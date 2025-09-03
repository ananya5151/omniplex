"use client";

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // Create payment intent
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 1000, // $10.00 in cents
          currency: "usd",
        }),
      });

      const { clientSecret, error } = await response.json();

      if (error) {
        setMessage(error);
        setIsLoading(false);
        return;
      }

      // Confirm payment
      const cardElement = elements.getElement(CardElement);
      const { error: paymentError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement!,
            billing_details: {
              name: "Test Customer",
            },
          },
        });

      if (paymentError) {
        setMessage(paymentError.message || "An error occurred");
      } else if (paymentIntent.status === "succeeded") {
        setMessage("Payment successful! 🎉");
      }
    } catch (error) {
      setMessage("An unexpected error occurred");
    }

    setIsLoading(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#ffffff",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Pro Plan - $10</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 border border-gray-600 rounded">
          <CardElement options={cardElementOptions} />
        </div>
        
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className={`w-full py-3 px-4 rounded font-medium text-white ${
            isLoading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Processing..." : "Pay $10"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded ${
            message.includes("successful")
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {message}
        </div>
      )}

      <div className="mt-4 p-3 bg-gray-700 rounded text-sm text-gray-300">
        <p><strong>Test Card:</strong> 4242 4242 4242 4242</p>
        <p><strong>Expiry:</strong> Any future date</p>
        <p><strong>CVC:</strong> Any 3 digits</p>
      </div>
    </div>
  );
};

const StripeCheckout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default StripeCheckout;