const express = require("express");
const app = express();

const stripe = require("stripe")(
  // This is your test secret API key.
  'sk_test_51LLRCzFJ7qVxZQOXjPPGgeJjnZcDE2EUzbqd0Ax2tPabA49h0645AtOgfUpYAiAuLu6XbbZUnOVHUyIVr4A8LhBy00ctN8ARDw',
  {
    apiVersion: "2023-10-16",
  }
);

app.use(express.static("dist"));
app.use(express.json());


app.post('/account_links', async (req, res) => {
  console.log('Request Body:', req.body); // Log request body

  try {
    const { account } = req.body;

    const accountId = account.connectedAccountId;

    if (!account) {
      return res.status(400).json({ error: 'Account ID is required' });
    }

    // Stripe API call to create account link
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: 'https://example.com/reauth',
      return_url: 'https://example.com/reauth',
      type: 'account_onboarding',
    });
    console.log('Account link created:', accountLink);
    res.json({
      link: accountLink
    });
  } catch (error) {
    console.error('Error creating account link:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/account", async (req, res) => {
    console.log("Creating account");
    try {
      const account = await stripe.accounts.create({
        controller: {
          stripe_dashboard: {
            type: "none",
          },
          fees: {
            payer: "application"
          },
          losses: {
            payments: "application"
          },
          requirement_collection: "application",
        },
        capabilities: {
          transfers: {requested: true}
        },
        country: "US",
      });
  
      res.json({
        account: account.id,
      });
    } catch (error) {
      console.error(
        "An error occurred when calling the Stripe API to create an account",
        error
      );
      res.status(500);
      res.send({ error: error.message });
    }
  });


app.get("/*", (_req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.listen(4242, () => console.log("Node server listening on port 4242! Visit http://localhost:4242 in your browser."));