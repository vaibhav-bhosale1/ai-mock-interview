"use client";
import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Mobile menu icons
import { Image } from "@nextui-org/react";


const Header = () => {
  const [mounted, setMounted] = useState(false);
  const { isSignedIn } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu state
  const [scrolling, setScrolling] = useState(false); // To detect scroll
  const path = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 10); // Set scrolling state when user scrolls
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <header
      className={`flex justify-between items-center p-4 text-white shadow-md bg-black bg-opacity-70 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 ${
        scrolling ? "bg-opacity-90" : "bg-opacity-70"
      }`}
    >
      {/* Logo */}
      <Link href="/">
      
        <h1 className="text-xl font-bold">
          VirtueHireX<sub className="text-sm font-normal"></sub>
        </h1>
      </Link>

      {/* Desktop Navigation Links */}
      <ul className="hidden md:flex gap-6 items-center">
        <NavLink href="/dashboard" label="Dashboard" path={path} />
        <NavLink href="/features" label="Features" path={path} />
        <NavLink href="/pricing" label="Pricing" path={path} />
        <NavLink href="/howitworks" label="How it Works?" path={path} />
        <NavLink href="/contact" label="Contact" path={path} />
      </ul>

      {/* User Actions and Mobile Menu */} 
      <div className="flex items-center gap-4 ">
        {/* Show "Get Started" button if user is not signed in */}
        {!isSignedIn && (
          <Link href="/dashboard">
            <Button className="transition-all cursor-pointer text-black bg-white hover:bg-gray-100">
              Get Started
            </Button>
          </Link>
        )}

        {/* User Button */}
        {isSignedIn && (
  <div className="  border-3 border-cyan-500 rounded-full ">
    <UserButton />
  </div>
)}


        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center focus:outline-none"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)} // Toggle mobile menu
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" /> // Close icon
          ) : (
            <Menu className="w-6 h-6" /> // Hamburger icon
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <ul className="absolute top-16 left-0 w-full bg-[#1c1c1c] bg-opacity-90 backdrop-blur-md shadow-md flex flex-col items-center gap-4 py-4 z-50 md:hidden">
          <NavLink
            href="/dashboard"
            label="Dashboard"
            path={path}
            onClick={() => setIsMobileMenuOpen(false)} // Close menu after clicking
          />
          <NavLink
            href="/features"
            label="Features"
            path={path}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <NavLink
            href="/pricing"
            label="Pricing"
            path={path}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <NavLink
            href="/howitworks"
            label="How it Works?"
            path={path}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <NavLink
            href="/contact"
            label="Contact"
            path={path}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        </ul>
      )}
    </header>
  );
};

// Reusable NavLink Component
const NavLink = ({ href, label, path, onClick }) => {
  return (
    <li
      onClick={onClick}
      className={`relative cursor-pointer group hover:text-blue-400  transition-all`}
    >
      <Link href={href}>{label}</Link>
      <div className="absolute left-0 right-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-transparent to-blue-400 scale-x-0 group-hover:scale-x-100 transition-all duration-300"></div>
    </li>
  );
};

export default Header;
