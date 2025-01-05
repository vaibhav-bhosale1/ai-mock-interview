import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "../components/ui/toaster";
import NextTopLoader from 'nextjs-toploader';
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
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"></link>
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"></link>
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"></link>
<link rel="manifest" href="/site.webmanifest"></link>
          
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning
          >
          
            <NextTopLoader />
            {children}
          </body>
        </html>
    
    </ClerkProvider>
  );
}
