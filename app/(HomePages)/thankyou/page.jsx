"use client";
import React from "react";
import { useRouter } from "next/router";
import Header from "../../dashboard/_components/Header";
import Footer from "../Footer";
import Link from "next/link";
import { Button } from "../../../components/ui/button";


const ThankYouPage = () => {
  

  return (
    <>
    <Header />
    <div className="dark bg-gray-900 min-h-screen text-gray-100 min-h-screen">
  
      <div className="flex flex-col items-center justify-center h-full py-10">
        <h1 className="text-4xl font-bold mb-6">Thank You for Your Purchase!</h1>
        <p className="text-lg mb-6">
          Your payment was successful. We appreciate your support and hope you enjoy our premium features.
        </p>
        <Link href={"/"}>
        <Button
         
          className="px-6 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
        >
          Go to Home
        </Button>
        </Link>
        
      </div>
      <Footer />
    </div>
    </>
  );
};

export default ThankYouPage;