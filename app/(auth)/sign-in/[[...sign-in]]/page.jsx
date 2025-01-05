"use client";
import { SignIn } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export default function Page() {
  const [currentText, setCurrentText] = useState("");
  const textArray = [
    "Welcome to VirtueHireX",
    "Unlock Your Potential",
    "Transform Your Career",
  ];

  useEffect(() => {
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeEffect = () => {
      if (!isDeleting && charIndex <= textArray[textIndex].length) {
        setCurrentText(textArray[textIndex].substring(0, charIndex + 1));
        charIndex++;
      } else if (isDeleting && charIndex >= 0) {
        setCurrentText(textArray[textIndex].substring(0, charIndex));
        charIndex--;
      } else {
        isDeleting = !isDeleting;
        if (!isDeleting) {
          textIndex = (textIndex + 1) % textArray.length;
        }
      }
      setTimeout(typeEffect, isDeleting ? 50 : 100);
    };

    typeEffect();
  }, []);

  return (
    <section className="bg-white min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar with Animated Text */}
      <aside className="relative bg-black text-white flex flex-col items-center justify-center text-center p-8 lg:w-1/2">
        {/* SVG Decoration */}
      

        {/* Animated Text and Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 text-shadow-lg">
          VirtueHireX
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl font-medium text-cyan-400">
          {currentText}
        </p>
      </aside>

      {/* Main Sign-In Section */}
      <main className="flex flex-1 items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="max-w-md sm:max-w-lg lg:max-w-xl w-full">
          <SignIn />
        </div>
      </main>
    </section>
  );
}
