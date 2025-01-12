"use client"
import React from 'react'
import Header from './dashboard/_components/Header'
import Hero from './(HomePages)/Hero'
import Howitworks from './(HomePages)/howitworks/page'
import Features from './(HomePages)/features/page'
import Footer from './(HomePages)/Footer'
import Pricing from './(HomePages)/pricing/page'
const Home = () => {
  
  return (
    <>

    <Header/>
    < >
    <div>
      <Hero />
      <Howitworks />
      <Pricing/>
      <Features/>
      <Footer/>
      </div>
    </>
    </>
  )
}

export default Home
