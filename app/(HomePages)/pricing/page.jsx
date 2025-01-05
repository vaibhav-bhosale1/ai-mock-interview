"use client"
import React from 'react'
import PricingPlan from "./PricingPlan"
import { useUser } from '@clerk/nextjs'
import Header from '../../dashboard/_components/Header'
import Footer from '../Footer'
import "animate.css/animate.compat.css"
import ScrollAnimation from 'react-animate-on-scroll';
const page = () => {
    const {user}=useUser();
  return (
    <>
   <Header/>
      <ScrollAnimation animateIn='bounce'
                  initiallyVisible={true}
                  animateOnce={true}>
    <div className='p-10 bg-black'>
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8" >
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-center md:gap-8">
    {PricingPlan.map((item,index)=>(
      <div className="rounded-2xl border border-cyan-200 p-6 shadow-sm sm:px-8 lg:p-12  hover:scale-105 hover:shadow-sm transition-all" key={index}>
      <div className="text-center">
        <h2 className="text-lg font-medium text-gray-300">
          {item.duration}
          <span className="sr-only">Plan</span>
        </h2>

        <p className="mt-2 sm:mt-4">
          <strong className="text-3xl font-bold text-gray-300 sm:text-4xl"> {item.price} </strong>

          <span className="text-sm font-medium text-gray-300">/{item.duration}</span>
        </p>
      </div>

      <ul className="mt-6 space-y-2">
        <li className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5 text-indigo-700"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>

          <span className="text-gray-300">15+ Question/Day </span>
        </li>

        <li className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5 text-indigo-700"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>

          <span className="text-gray-300"> Get Detailed feedback  </span>
        </li>

        <li className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5 text-indigo-700"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>

          <span className="text-gray-300"> Email support </span>
        </li>

        <li className="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-5 text-indigo-700"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>

          <span className="text-gray-300"> Help center access </span>
        </li>
      </ul>

      <a
        href={item.link}
        target='_blank'
        className="mt-8 block rounded-full border border-indigo-600 bg-white px-12 py-3 text-center text-sm font-medium text-indigo-600 hover:ring-1 hover:ring-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
      >
        Get Started
      </a>
    </div>
      
        )) }
    
  </div>
</div>
      
    </div>
    </ScrollAnimation>
    <Footer/>
    </>
  )
}

export default page
