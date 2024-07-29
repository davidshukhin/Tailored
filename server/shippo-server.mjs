import express from 'express';
import { Shippo } from "shippo";

const shippo = new Shippo({
  apiKeyHeader: "shippo_test_494f449c778c94212eef649f07cf6b3c980f30d6",
  // the API version can be globally set, though this is normally not required
  // shippoApiVersion: "<YYYY-MM-DD>",
});
const app = express();
const port = 3000;

app.use(express.json());

async function run() {
  const result = await shippo.shipments.create({
    extra: {
      accountsReceivableCustomerAccount: {
        prefix: "ABC",
        value: "value",
        refSort: 1,
      },
      appropriationNumber: {
        prefix: "ABC",
        value: "value",
        refSort: 1,
      },
      billOfLadingNumber: {
        prefix: "ABC",
        value: "value",
        refSort: 1,
      },
      cod: {
        amount: "5.5",
        currency: "USD",
        paymentMethod: "CASH",
      },
      codNumber: {
        prefix: "ABC",
        value: "value",
        refSort: 1,
      },
      customerReference: {
        refSort: 1,
      },
      dealerOrderNumber: {
        prefix: "ABC",
        value: "value",
        refSort: 1,
      },
      deptNumber: {
        refSort: 3,
      },
      fdaProductCode: {
        prefix: "ABC",
        value: "value",
        refSort: 1,
      },
      insurance: {
        amount: "5.5",
        currency: "USD",
      },
      invoiceNumber: {
        refSort: 2,
      },
      manifestNumber: {
        prefix: "ABC",
        value: "value",
        refSort: 1,
      },
      modelNumber: {
        prefix: "ABC",
        value: "value",
        refSort: 1,
      },
      partNumber: {
        prefix: "ABC",
        value: "value",
        refSort: 1,
      },
      poNumber: {
        refSort: 2,
      },
      productionCode: {
        prefix: "ABC",
        value: "value",
        refSort: 1,
      },
      purchaseRequestNumber: {
        prefix: "ABC",
        value: "value",
        refSort: 1,
      },
      rmaNumber: {
        refSort: 1,
      },
      salespersonNumber: {
        prefix: "ABC",
        value: "value",
        refSort: 1,
      },
      serialNumber: {
        prefix: "ABC",
        value: "value",
        refSort: 1,
      },
      storeNumber: {
        prefix: "ABC",
        value: "value",
        refSort: 1,
      },
      transactionReferenceNumber: {
        prefix: "ABC",
        value: "value",
        refSort: 1,
      },
    },
    metadata: "Customer ID 123456",
    shipmentDate: "2021-03-22T12:00:00Z",
  addressFrom:     {
        name: "Shwan Ippotle",
        company: "Shippo",
        street1: "215 Clayton St.",
        street3: "",
        streetNo: "",
        city: "San Francisco",
        state: "CA",
        zip: "94117",
        country: "US",
        phone: "+1 555 341 9393",
        email: "shippotle@shippo.com",
        isResidential: true,
        metadata: "Customer ID 123456",
        validate: true,
      },
  addressReturn:     {
        name: "Shwan Ippotle",
        company: "Shippo",
        street1: "215 Clayton St.",
        street3: "",
        streetNo: "",
        city: "San Francisco",
        state: "CA",
        zip: "94117",
        country: "US",
        phone: "+1 555 341 9393",
        email: "shippotle@shippo.com",
        isResidential: true,
        metadata: "Customer ID 123456",
        validate: true,
      },
  addressTo: "d799c2679e644279b59fe661ac8fa489",
  customsDeclaration: "adcfdddf8ec64b84ad22772bce3ea37a",
    carrierAccounts: [
      "065a4a8c10d24a34ab932163a1b87f52",
      "73f706f4bdb94b54a337563840ce52b0",
    ],
    parcels: [
        {
          extra: {
            cod: {
              amount: "5.5",
              currency: "USD",
              paymentMethod: "CASH",
            },
            insurance: {
              amount: "5.5",
              content: "Laptop",
              currency: "USD",
              provider: "UPS",
            },
          },
          metadata: "Customer ID 123456",
          massUnit: "lb",
          weight: "1",
        template: "USPS_FlatRateGiftCardEnvelope",
        },
    ],
  });

  // Handle the result
  console.log(result)
}

run();

app.post('/create-shipment', async (req, res) => {
  const { addressFrom, addressTo, parcel } = req.body;

  try {
    console.log("connected")
    const shipment = await shippo.shipments.create({
      addressFrom: addressFrom,
      addressTo: addressTo,
      parcels: [parcel],
    });
    console.log(shipment)

    const rates = await shippo.shipment.rates(shipment.object_id);
    const rateId = rates.results[0].object_id; // Using the first rate
    console.log("here")
    const transaction = await shippo.transaction.create({
      rate: rateId,
      async: false,
    });

    if (transaction.status === 'SUCCESS') {
      res.json({ label_url: transaction.label_url });
    } else {
      res.status(400).json({ error: transaction.messages });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
