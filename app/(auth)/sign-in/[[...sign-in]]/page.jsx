"use client";
import { SignIn } from "@clerk/nextjs";
import { useState, useEffect } from "react";

export default function Page() {
  const [currentText, setCurrentText] = useState("");
  const textArray = ["Welcome to VirtueHireX", "Unlock Your Potential", "Transform Your Career"];

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
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        {/* Black Background with Title and Typography Animation */}
        <aside className="relative block h-16 bg-black text-white lg:col-span-6 lg:h-full xl:col-span-6 flex flex-col justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="absolute bottom-0 w-full h-16 text-black"
            fill="#000"
          >
            <path
              fillOpacity="1"
              d="M0,224L48,192C96,160,192,96,288,74.7C384,53,480,75,576,106.7C672,139,768,181,864,202.7C960,224,1056,224,1152,213.3C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>

          {/* Title with White Shadow */}
          <h1 className="text-6xl font-extrabold mb-6 text-white text-shadow-lg">
            VirtueHireX
          </h1>

          <p className="text-3xl font-medium text-cyan-400">{currentText}</p>
        </aside>

        {/* Main Sign-In Section */}
        <main
          className="flex items-center justify-center px-8 py-8 sm:px-12 lg:order-last lg:col-span-6 lg:px-16 lg:py-12 xl:col-span-6"
        >
          <div className="max-w-xl lg:max-w-3xl">
            <SignIn />
          </div>
        </main>
      </div>
    </section>
  );
}
