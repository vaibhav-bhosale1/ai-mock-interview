"use client"

import React from 'react'

import Header from '../../dashboard/_components/Header'
import Footer from '../Footer'
import { usePathname } from 'next/navigation'
import Pricing from './PricingPlan'



const Pricinghome = () => {
  const path=usePathname();
  return (
    <div className='h-full bg-black'>
    {path === "/" ? (
    <Pricing/>
    ) : (
      // Show Header, HowItWorks, and Footer for other paths
      <>
        <Header />
       
      <Pricing/>
       
        <Footer />
      </>
    )}
  </div>
  )
}

export default Pricinghome
