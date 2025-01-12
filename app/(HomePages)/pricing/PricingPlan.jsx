"use client";
import React, { useState, useEffect } from "react";
import Script from "next/script";
import { Button } from "../../../components/ui/button";
import { LoaderCircle } from "lucide-react";

// Pricing Plan Component
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
  const [processing, setProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // New state to track loading status

  const handlePayment = async (amount) => {
    if (!razorpayLoaded) {
      console.error("Razorpay script not loaded yet.");
      return;
    }

    setIsLoading(true);
    setProcessing(true);

    console.log("Amount passed to backend:", amount);  // Log the amount being passed

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }), // Send the selected price
      });

      const data = await response.json();
      console.log("Payment Data:", data);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount, // amount in paise received from the backend
        currency: "INR",
        name: "VirtueHire",
        description: "Test Payment",
        order_id: data.orderId,
        handler: function () {
          window.location.href = "/thankyou"; // Redirect after success
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
      setProcessing(false);
    }
  };

  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.defer = true;
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => {
        console.error("Failed to load Razorpay script.");
        setIsLoading(false); // Handle script load failure
      };
      document.body.appendChild(script);
    };

    if (!razorpayLoaded) {
      loadRazorpayScript();
    }
  }, [razorpayLoaded]);

  return (
    <div className="dark bg-black mb-52 text-gray-100 mt-20">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Choose Your Plan</h1>

        {/* Show loader if payment is being processed */}
        {isLoading ? (
          <LoaderCircle className="relative top-50 right-50 h-20 w-20 mx-auto" />
        ) : (
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
              features={[
                "Access to premium content",
                "Priority support",
                "AI-powered tools",
              ]}
              isPremium={true}
              onUpgrade={() => handlePayment(499)} // Pass price here
            />
            <PricingPlan
              title="Pro"
              price={999}
              features={[
                "Everything in Premium",
                "Advanced analytics",
                "One-on-one mentorship",
              ]}
              isPremium={true}
              onUpgrade={() => handlePayment(999)} // Pass price here
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Pricing;
