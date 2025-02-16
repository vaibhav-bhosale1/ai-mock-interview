import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "../components/ui/toaster";
import NextTopLoader from 'nextjs-toploader';
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from "next-themes";  // Import ThemeProvider for theme management

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "VirtueHireX",
  description: "AI mock Interview Platform",
 
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    {/* Wrap the layout in ThemeProvider */}
        <html lang="en">
       
          
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased  bg-black`} suppressHydrationWarning
          >
          
            <NextTopLoader />
            {children}
          </body>
        </html>
    
    </ClerkProvider>
  );
}
