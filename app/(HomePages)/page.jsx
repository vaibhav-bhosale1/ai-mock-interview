import React from 'react'
import HowItWorks from './howitworks/HowItWorks'
import Header from '../dashboard/_components/Header'
import Footer from './Footer'
const page = () => {
  return (
    <div>
        <Header/>
      <HowItWorks/>
      <Footer/>
    </div>
  )
}

export default page
