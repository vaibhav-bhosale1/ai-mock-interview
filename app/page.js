"use client";
import React, { useState, useEffect } from "react";
import Header from "./dashboard/_components/Header";
import Hero from "./(HomePages)/Hero";
import Howitworks from "./(HomePages)/howitworks/page";
import Features from "./(HomePages)/features/page";
import Footer from "./(HomePages)/Footer";
import Pricing from "./(HomePages)/pricing/page";
import { hatch } from "ldrs";

hatch.register();

const Home = () => {
  const [loading, setLoading] = useState(true); // State to handle loading

  useEffect(() => {
    // Simulate loading duration
    const timer = setTimeout(() => setLoading(false), 2000); // Adjust timing as needed

    return () => clearTimeout(timer); // Clean up the timer
  }, []);

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f9f9f9", // Optional: loader background
          }}
        >
          <l-hatch size="64" stroke="4" speed="3.5" color="black"></l-hatch>
        </div>
      ) : (
        <>
          <Header />
          <div>
            <Hero />
            <Howitworks />
            <Pricing />
            <Features />
            <Footer />
          </div>
        </>
      )}
    </>
  );
};

export default Home;
