const cors = require("cors");
require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { v4: uuidv4 } = require("uuid"); // Correct import for uuid

const port = 4800;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/payment", (req, res) => {
  const { product, token } = req.body;
  console.log("Product", product);
  console.log("Price", product.price);

  const idempotencyKey = uuidv4(); // Correct usage of uuid

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: product.price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `Purchased the ${product.name}`,
          shipping: {
            name: token.card.name,
            address: {
              line1: token.card.address_line1,
              line2: token.card.address_line2,
              city: token.card.address_city,
              country: token.card.address_country,
              postal_code: token.card.address_zip,
            },
          },
        },
        { idempotencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => console.log(err));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
