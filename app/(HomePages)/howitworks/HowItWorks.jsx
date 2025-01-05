import React from "react";
import "animate.css/animate.compat.css"
import ScrollAnimation from 'react-animate-on-scroll';
function HowItWorks () {
    return (
      <section id="how-it-works" className="py-16 bg-black">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-6xl font-semibold text-cyan-300 mb-6">
          <ScrollAnimation  animateIn='bounce'
                  initiallyVisible={true}
                  animateOnce={true}>
                
            <h2>
            
              How It Works
              
            </h2>
          </ScrollAnimation>
            </h2>
            <ScrollAnimation animateIn='bounceInRight'
            animateOut='bounceOutLeft'>
            <p className="text-lg text-gray-400 mb-12">AI-powered mock interviews to guide your progress. Here's how you can get started:</p>
            </ScrollAnimation>
          <ScrollAnimation animateIn='bounceInLeft'
            animateOut='bounceOutRight'>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
              <div className="p-6 border-2 border-blue-500 rounded-lg transform hover:scale-105 transition-transform duration-300">
                <i className="fas fa-question-circle text-4xl text-cyan-400 mb-4"></i>
                <h3 className="text-xl font-semibold mb-4 text-cyan-500">1. Answer Questions</h3>
                <p className="text-gray-400">Choose from a variety of interview questions based on your job role. Answer them in a real-time simulated interview environment.</p>
              </div>
              <div className="p-6 border-2 border-cyan-400 rounded-lg transform hover:scale-105 transition-transform duration-300">
                <i className="fas fa-cogs text-4xl text-cyan-600 mb-4"></i>
                <h3 className="text-xl font-semibold mb-4 text-cyan-500">2. AI Analysis</h3>
                <p className="text-gray-400">Our AI analyzes your answers and provides detailed feedback to help you improve your performance.</p>
              </div>
              <div className="p-6 border-2 border-cyab-500 rounded-lg transform hover:scale-105 transition-transform duration-300">
                <i className="fas fa-trophy text-4xl text-cyab-500 mb-4"></i>
                <h3 className="text-xl font-semibold mb-4 text-cyan-500">3. Get Better</h3>
                <p className="text-gray-400">Based on feedback, continue to practice and refine your answers. Track your progress with insightful analytics.</p>
              </div>
          </div>
          </ScrollAnimation>
          
        </div>
      </section>
    );
  };
  
  export default HowItWorks;
  