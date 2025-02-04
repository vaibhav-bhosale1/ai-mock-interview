"use client";
import React, { useState, useEffect } from "react";
import Script from "next/script";
import { Button } from "../../../components/ui/button";
import { LoaderCircle } from "lucide-react";
import Head from "next/head";

const PricingPlan = ({ title, price, features, isPremium, onUpgrade }) => (
  <div
    className={`p-6 rounded-lg shadow-lg m-4 max-w-md ${
      isPremium ? "bg-purple-700 text-white" : "bg-gray-800 text-gray-300"
    }`}
  >
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <p className="text-2xl font-bold mb-4">₹{price}/month</p>
    <ul className="mb-6">
      {features.map((feature, index) => (
        <li key={index} className="mb-2">
          ✔ {feature}
        </li>
      ))}
    </ul>
    {isPremium && (
      <Button
        className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
        onClick={onUpgrade}
      >
        Upgrade Now
      </Button>
    )}
  </div>
);

const Pricing = () => {
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(true);

  // Preload Razorpay script on page load
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      setRazorpayLoaded(true);
      setScriptLoading(false); // Once loaded, stop showing the loader
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script.");
      setScriptLoading(false); // Stop loader even if script fails
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup on unmount
    };
  }, []);

  const handlePayment = async (amount, planTitle) => {
    if (!razorpayLoaded) {
      console.error("Razorpay script not loaded yet.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();
      if (!data?.orderId || !data?.amount) {
        throw new Error("Invalid payment data received.");
      }

      // Store planTitle in localStorage to make sure it's available on the thank you page
      localStorage.setItem("paymentPlan", planTitle);
      localStorage.setItem("orderId", data.orderId);
      localStorage.setItem("price", data.amount);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "VirtueHire",
        description: "Test Payment",
        order_id: data.orderId,
        handler: function () {
          // Redirect to the thank you page after payment
          window.location.href = "/thankyou";
        },
        prefill: {
          name: "Vaibhav Bhosale",
          email: "heytherevaibhav@virtuehirex",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzpl = new window.Razorpay(options);
      rzpl.open();
    } catch (error) {
      console.error("Payment failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dark bg-black mb-50 text-gray-100 mt-20">
      {/* Preload Razorpay script */}
      <Head>
        <link rel="preload" href="https://checkout.razorpay.com/v1/checkout.js" as="script" />
      </Head>

      {/* Display loader while script is loading */}
      {scriptLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-white text-lg mb-4">Please wait, loading payment options...</div>
          <LoaderCircle className="h-20 w-20 animate-spin" />
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-3xl font-bold">Choose Your Plan</h1>
          <div className="flex flex-row flex-wrap justify-center">
            <PricingPlan
              title="Basic"
              price={0}
              features={["Access to free content", "Basic support"]}
              isPremium={false}
            />
            <PricingPlan
              title="Premium"
              price={499}
              features={["Access to premium content", "Priority support", "AI-powered tools"]}
              isPremium={true}
              onUpgrade={() => handlePayment(499, "Premium")}
            />
            <PricingPlan
              title="Pro"
              price={999}
              features={["Everything in Premium", "Advanced analytics", "One-on-one mentorship"]}
              isPremium={true}
              onUpgrade={() => handlePayment(999, "Pro")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
