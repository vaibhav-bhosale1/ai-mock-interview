import React from 'react'
import { Button } from '../components/ui/button'
import  Link  from 'next/link'
import Header from './dashboard/_components/Header'
import Hero from './(HomePages)/Hero'
import HowItWorks from './(HomePages)/howitworks/page'
import Features from './(HomePages)/features/page'
import Footer from './(HomePages)/Footer'
const Home = () => {
  
  return (
    <>

    <Header/>
    < >
    <div>
      <Hero />
      <HowItWorks />
      <Features/>
      <Footer/>
      </div>
    </>
    </>
  )
}

export default Home
