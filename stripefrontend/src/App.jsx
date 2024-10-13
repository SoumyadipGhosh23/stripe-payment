import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import StripeCheckout from "react-stripe-checkout";

function App() {
  const [product, setProduct] = useState({
    name: "macbook air m2",
    price: "100",
  });
  const public_key_stripe = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  console.log(public_key_stripe);

  const makePayment = async (token) => {
    const body = {
      token,
      product,
    };
    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch("http://localhost:4800/payment", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log(response);
        const { status } = response;
        console.log("status", status);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <StripeCheckout
        stripeKey={public_key_stripe}
        token={makePayment}
        amount={product.price * 100}
        product={product}
        name="testing a product"
        shippingAddress
        billingAddress
      >
        <button>
          Hey buy {product.name} at ${product.price}
        </button>
      </StripeCheckout>
    </>
  );
}

export default App;
