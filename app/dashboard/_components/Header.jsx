"use client";
import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Button } from "../../../components/ui/button";
import Link from "next/link";

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isSignedIn } = useAuth(); // Get user authentication status from Clerk

  useEffect(() => {
    setMounted(true);
  }, []);

  const howItWorksRef = useRef(null); // Create a ref for the "How It Works" section

  const scrollToSection = () => {
    if (howItWorksRef.current) {
      howItWorksRef.current.scrollIntoView({
        behavior: "smooth", // Smooth scrolling effect
        block: "start", // Align the section to the top
      });
    }
  };

  const path = usePathname();

  if (!mounted) return null;

  return (
    <div className="flex p-4 justify-between  shadow-sm items-center bg-cyan-200 t">
      <Link href={"/"}>
        <h1 className="text-xl font-bold">VirtueHireX</h1>
      </Link>
      <ul className="hidden md:flex gap-6 items-center">
        <Link href={"/dashboard"}>
          <li
            className={`hover:text-blue-600 hover:font-bold transition-all cursor-pointer ${
              path == "/dashboard" && "text-blue-600 font-bold"
            }`}
          >
            Dashboard
          </li>
        </Link>
        <Link href={"/features"}>
          <li
            className={`hover:text-blue-600 hover:font-bold transition-all cursor-pointer ${
              path == "/features" && "text-blue-900 font-bold"
            }`}
          >
            Features
          </li>
        </Link>
        <Link href={"/pricing"}>
          <li
            className={`hover:text-blue-600 hover:font-bold transition-all cursor-pointer ${
              path == "/upgrade" && "text-blue-600 font-bold"
            }`}
          >
            Upgrade
          </li>
        </Link>
        <Link href={"/howitworks"}>
          <li
            onClick={scrollToSection} // Scroll to the "How It Works" section
            className={`hover:text-blue-600 hover:font-bold transition-all cursor-pointer ${
              path == "/howitworks" && "text-blue-600 font-bold"
            }`}
          >
            How it Works?
          </li>
        </Link>
        <Link href={"/contact"}>
          <li
            onClick={scrollToSection} // Scroll to the "How It Works" section
            className={`hover:text-blue-600 hover:font-bold transition-all cursor-pointer ${
              path == "/contact" && "text-blue-600 font-bold"
            }`}
          >
           Contact
          </li>
        </Link>
      </ul>
      <div className="flex flex-row gap-4">
        {/* Show Signin and Signup buttons only if user is not signed in */}
        {!isSignedIn && (
          <>
            <Link href={"/dashboard"}>
              <Button className="transition-all cursor-pointer">Get Started</Button>
            </Link>
          </>
        )}
        {/* Show UserButton if the user is logged in */}
        {isSignedIn && <UserButton />}
      </div>
    </div>
  );
};

export default Header;
