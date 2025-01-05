"use client"

import { TypeAnimation } from 'react-type-animation';
import "animate.css/animate.compat.css"
import ScrollAnimation from 'react-animate-on-scroll';
import { Button } from '../../components/ui/button';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r bg-black py-20">
    <div className="container mx-auto text-center text-white px-6">
      <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
      <TypeAnimation
        sequence={[
          'Ace',
          500,
          'Ace Your', //  Continuing previous Text
          500,
          'Ace Your Interviews',
          500,
          'Ace Your Interviews with',
          500,
          'Ace Your Interviews with Confidence!',
          500,
          'Ace Your Interviews with',
          500,
          'Ace Your Interviews', //  Continuing previous Text
          500,
          'Ace Your',
          500,
          'Ace',
          500,
          '',
          500,
         
        ]}
        style={{ fontSize: '1em' }}
        repeat={Infinity}
        className='shad-lg shadow-white'
      />
      
       
      </h1>
      <div>
        <ScrollAnimation  animateIn='bounce'
                  initiallyVisible={true}
                  animateOnce={true}>
                
          <p className="text-lg mb-12 opacity-90">
            Unlock your full potential with real-time feedback, progress tracking, and more. Start your journey today!
          </p>
          <Link href={'/dashboard'}><Button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Get Started Now
          </Button>
          </Link>
          </ScrollAnimation>

      </div>
   
    </div>
 
  </section>
  );
};

export default Hero;
