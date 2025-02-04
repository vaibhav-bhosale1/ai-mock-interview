"use client"

import { TypeAnimation } from "react-type-animation"
import "animate.css/animate.compat.css"
import ScrollAnimation from "react-animate-on-scroll"
import { Button } from "../../components/ui/button"
import Link from "next/link"

export default function Hero() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <h1 className="text-3xl font-bold mb-10 text-cyan-200">VirtueHireX</h1>

      {/* Main Content */}
      <div className="max-w-[800px] mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-[1.1] mb-12">
          <TypeAnimation
            sequence={[
              "Practice interviews.",
              1000,
              "Build confidence.",
              1000,
              "Land your dream job.",
              1000,
              "Practice interviews.",
              1000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Number.POSITIVE_INFINITY}
            className="block"
          />
        </h2>

        <ScrollAnimation animateIn="bounce" initiallyVisible={true} animateOnce={true}>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-[600px] mx-auto leading-normal">
          Unlock your full potential with real-time feedback, progress tracking, and more. Start your journey today!
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-gray-200 rounded-full text-base px-8 h-12 transform hover:scale-105 transition-all duration-300"
            >
              <Link href="/dashboard">
                Start now <span className="ml-2">↗</span>
              </Link>
            </Button>

           
          </div>
        </ScrollAnimation>
      </div>
    </div>
  )
}

