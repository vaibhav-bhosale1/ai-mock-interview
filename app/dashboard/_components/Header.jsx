"use client";
import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Mobile menu icons

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isSignedIn } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu state

  const path = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="flex justify-between items-center p-4 shadow-sm bg-cyan-100">
      {/* Logo */}
      <Link href="/">
      <h1 className="text-xl font-bold">
  VirtueHireX<sub className="text-sm font-normal"> by Vaibhav Bhosale</sub>
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
      <div className="flex items-center gap-4">
        {/* Show "Get Started" button if user is not signed in */}
        {!isSignedIn && (
          <Link href="/dashboard">
            <Button className="transition-all cursor-pointer">Get Started</Button>
          </Link>
        )}

        {/* User Button */}
        {isSignedIn && <UserButton />}

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
        <ul className="absolute top-16 left-0 w-full bg-cyan-200 shadow-md flex flex-col items-center gap-4 py-4 z-50 md:hidden">
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
      className={`hover:text-blue-600 hover:font-bold transition-all cursor-pointer ${
        path === href ? "text-blue-600 font-bold" : ""
      }`}
    >
      <Link href={href}>{label}</Link>
    </li>
  );
};

export default Header;
