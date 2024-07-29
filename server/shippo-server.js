import { Shippo } from "shippo";
import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
const port = 3000;

const shippo = new Shippo({
    apiKeyHeader: "shippo_test_494f449c778c94212eef649f07cf6b3c980f30d6",
});

app.post('/create-address', async (req, res) => {
    try {
      const address = await shippo.addresses.create(req.body);
      res.json(address);
    } catch (error) {
      console.error('Error creating address:', error);
      res.status(500).json({ error: 'An error occurred while creating the address' });
    }
  });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});