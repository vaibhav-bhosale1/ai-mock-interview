"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { LoaderCircle } from "lucide-react";
import Head from "next/head";
import { motion } from "framer-motion";

// Pricing Plan Component
const PricingPlan = ({ title, price, features, isPremium, onUpgrade }) => {
  return (
    <motion.div
      className={`relative p-8 rounded-3xl transition-all transform ${
        isPremium
          ? "bg-gradient-to-r from-blue-500 to-violet-600 text-white"
          : "bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300"
      } backdrop-blur-xl shadow-neumorph flex flex-col justify-between m-6 space-y-6 hover:scale-105 hover:shadow-xl hover:shadow-lg`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-3xl font-semibold mb-4">{title}</h3>
      <p className="text-4xl font-bold mb-6">₹{price}/month</p>

      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.293 5.293a1 1 0 011.414 1.414L9 14.414l-4-4a1 1 0 011.414-1.414L9 11.586l7.293-7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        {isPremium ? (
          <Button
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg shadow-xl focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={onUpgrade}
          >
            Upgrade Now
          </Button>
        ) : (
          <Button
            className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg shadow-xl focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
          >
            Get Started
          </Button>
        )}
      </div>
    </motion.div>
  );
};

const Pricing = () => {
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false); // For showing the loading popup

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      setRazorpayLoaded(true);
      setScriptLoading(false);
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script.");
      setScriptLoading(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async (amount, planTitle) => {
    if (!razorpayLoaded) {
      console.error("Razorpay script not loaded yet.");
      return;
    }

    setIsLoading(true);
    setShowPopup(true); // Show the popup when the user clicks on Upgrade

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
      setShowPopup(false); // Hide the popup once Razorpay is loaded
    }
  };

  return (
    <div className="dark bg-black mb-50 text-gray-100 mt-20">
      <Head>
        <link
          rel="preload"
          href="https://checkout.razorpay.com/v1/checkout.js"
          as="script"
        />
      </Head>

      {scriptLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-white text-lg mb-4">Please wait, loading payment options...</div>
          <LoaderCircle className="h-20 w-20 animate-spin" />
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-8">Choose Your Plan</h1>
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
              onUpgrade={() => handlePayment(499, "Premium")}
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
              onUpgrade={() => handlePayment(999, "Pro")}
            />
          </div>
        </div>
      )}

      {/* Enhanced Loading Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-cyan-100 p-8 rounded-xl text-center shadow-xl max-w-xs w-full">
            <div className="text-black text-xl mb-4">Getting you to your payment...</div>
            <div className="flex justify-center">
              <LoaderCircle className="h-16 w-16 text-black animate-spin" />
            </div>
            <p className="mt-4 text-black text-sm">Please wait while we prepare your payment page.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
