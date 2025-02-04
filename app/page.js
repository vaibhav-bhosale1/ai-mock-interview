"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "./dashboard/_components/Header";
import Hero from "./(HomePages)/Hero";
import Howitworks from "./(HomePages)/howitworks/page";
import Features from "./(HomePages)/features/page";
import Footer from "./(HomePages)/Footer";
import Pricing from "./(HomePages)/pricing/page";
import BackgroundPaths from "../components/ui/BckgroundPath"; // Animated background

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000); // Adjust timing as needed
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center h-screen w-full bg-black">
          {/* Animated Text Loading Effect */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-bold text-white"
          >
            {Array.from("VirtueHireX").map((letter, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.08, // Smoother, staggered animation
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subscript for "by Vaibhav Bhosale" */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-sm text-gray-400 mt-2"
          >
            by Vaibhav Bhosale
          </motion.p>
        </div>
      ) : (
        <div className="relative min-h-screen w-full overflow-hidden">
        
            <Header />
            <Hero />
            <Howitworks />
            <Pricing />
            <Features />
            <Footer />
          </div>
     
      )}
    </>
  );
};

export default Home;
