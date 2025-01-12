"use client";
import React, { useEffect, useState } from "react";
import Header from "../../dashboard/_components/Header";
import Footer from "../Footer";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { FiCheckCircle } from "react-icons/fi"; // Success icon from react-icons

const ThankYouPage = () => {
  const [orderId, setOrderId] = useState(null);
  const [plan, setPlan] = useState(null);
  const [price, setPrice] = useState(null);

  useEffect(() => {
    // Get the payment details from localStorage
    const storedPlan = localStorage.getItem("paymentPlan");
    const storedOrderId = localStorage.getItem("orderId");
    const storedPrice = localStorage.getItem("price");

    if (storedPlan && storedOrderId && storedPrice) {
      setPlan(storedPlan);
      setOrderId(storedOrderId);
      // Divide price by 100 to get the value in INR
      setPrice((parseInt(storedPrice) / 100).toFixed(2)); // Ensure it's a string with two decimal places
    } else {
      console.error("Payment details not found in localStorage");
    }
  }, []);

  // Check if the payment details exist
  if (!orderId || !plan || !price) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">Error: Payment details not found!</h1>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-black min-h-screen text-gray-100">
        <div className="flex flex-col items-center justify-center h-full py-20 space-y-8">
          <div className="text-center">
            <FiCheckCircle className="text-white mx-auto mb-4 text-7xl animate-pulse" />
            <h1 className="text-4xl font-extrabold text-white mb-4">
              Thank You for Your Purchase!
            </h1>
            <p className="text-lg text-white max-w-lg mx-auto mb-6">
              Your payment was successful. We're thrilled to have you on board! Enjoy the premium experience.
            </p>
            <Link href={"/"} passHref>
              <Button
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-800 text-white text-xl font-semibold rounded-full shadow-xl transition-all duration-300"
              >
                Go to Home
              </Button>
            </Link>
          </div>

          {/* Enhanced Receipt-like Order Summary */}
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl mx-auto text-left">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Order Summary</h2>

            {/* Styled Receipt Table */}
            <div className="receipt-table">
              <table className="w-full text-sm text-left">
                <thead className="border-b-2 border-gray-300">
                  <tr>
                    <th className="pb-3 text-gray-600">Item</th>
                    <th className="pb-3 text-gray-600 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-300">
                    <td className="py-2 text-gray-800">Plan: {plan}</td>
                    <td className="py-2 text-right text-gray-800">₹{price}</td>
                  </tr>

                  {/* Add other dynamic items like features if needed */}
                  {/* Example: */}
                  <tr className="border-b border-gray-300">
                    <td className="py-2 text-gray-800">✔ Premium Content</td>
                    <td className="py-2 text-right text-gray-800">-</td>
                  </tr>

                  {/* Total row */}
                  <tr className="border-t-2 border-gray-300">
                    <td className="py-3 font-semibold text-lg text-gray-800">Total</td>
                    <td className="py-3 text-right font-semibold text-lg text-gray-800">₹{price}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Order ID & Activation */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between">
                <p className="text-lg font-semibold text-gray-600">Order ID:</p>
                <p className="text-lg text-gray-800">{orderId}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-lg font-semibold text-gray-600">Activation:</p>
                <p className="text-lg text-gray-800">Within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="mt-12 text-center text-white space-y-4">
            <p>
              Need assistance? <Link href="/contact" className="text-indigo-200">Contact Support</Link>
            </p>
          
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ThankYouPage;
