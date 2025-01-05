"use client"
import React from 'react'
import HowItWorks from './HowItWorks'
import Header from '../../dashboard/_components/Header'
import Footer from '../Footer'
import { usePathname } from 'next/navigation'
import CallToAction from './CallToAction'
const page = () => {
  const path=usePathname();
  return (
    <div className='h-full bg-black'>
    {path === "/" ? (
      // Only show HowItWorks if the path is "/"
      <HowItWorks />
    ) : (
      // Show Header, HowItWorks, and Footer for other paths
      <>
        <Header />
        <CallToAction/>
        <HowItWorks />
       
        <Footer />
      </>
    )}
  </div>
  )
}

export default page
