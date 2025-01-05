"use client"
import React from 'react'
import Featurepage from './Features'
import { usePathname } from 'next/navigation'
import Header from '../../dashboard/_components/Header'
import Footer from '../Footer'
const Features = () => {
    const path=usePathname();
  return (
    <div>
    {path === "/" ? (
      // Only show HowItWorks if the path is "/"
    <Featurepage/>
    ) : (
      // Show Header, HowItWorks, and Footer for other paths
      <>
      
        <Header />
      <Featurepage/>
        <Footer />
      </>
    )}
  </div>
  )
}

export default Features
