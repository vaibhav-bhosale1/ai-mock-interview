import React, { useState } from "react";
import Script from "next/script";
import { Button } from "../../../components/ui/button";
import { LoaderCircle } from "lucide-react";

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
  const [scriptLoading, setScriptLoading] = useState(true); // Track if the Razorpay script is loading

  const handlePayment = async (amount) => {
    if (!razorpayLoaded) {
      console.error("Razorpay script not loaded yet.");
      return;
    }

    setIsLoading(true);
    setProcessing(true);

    console.log("Amount passed to backend:", amount); // Log the amount being passed
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData);
        throw new Error(errorData.error || "Failed to create Razorpay order");
      }

      const data = await response.json();
      console.log("Payment Data:", data);

      if (!data?.orderId || !data?.amount) {
        throw new Error("Invalid payment data received.");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "VirtueHire",
        description: "Test Payment",
        order_id: data.orderId,
        handler: function () {
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
      setProcessing(false);
    }
  };

  return (
    <div className="dark bg-black mb-52 text-gray-100 mt-20">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => {
          setRazorpayLoaded(true);
          setScriptLoading(false); // Set the loading state to false once the script is loaded
        }}
        onError={() => console.error("Failed to load Razorpay script.")}
      />

      <div className="text-center">
        <h1 className="text-3xl font-bold">Choose Your Plan</h1>

        {/* Show loader if Razorpay script is still loading */}
        {scriptLoading ? (
          <div className="flex justify-center items-center h-40">
            <LoaderCircle className="h-20 w-20" />
          </div>
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
