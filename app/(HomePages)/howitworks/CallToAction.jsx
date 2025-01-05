import React from 'react'
import { Button } from '../../../components/ui/button'
import Link from 'next/link'

const CallToAction = () => {
  return (
    <div className='text-cyan-400'>
       <section className="py-16 bg-gradient-to-r text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg mb-12">
            Sign up now and gain access to all our premium features!
          </p>
          <Link href={'/dashboard'}><Button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Sign Up for Free
          </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default CallToAction
