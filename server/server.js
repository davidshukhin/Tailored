const express = require("express");
const app = express();

const stripe = require("stripe")(
  // This is your test secret API key.
  'sk_test_51LLRCzFJ7qVxZQOXjPPGgeJjnZcDE2EUzbqd0Ax2tPabA49h0645AtOgfUpYAiAuLu6XbbZUnOVHUyIVr4A8LhBy00ctN8ARDw',
  {
    apiVersion: "2023-10-16",
  }
);

app.post("/account", async (req, res) => {
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