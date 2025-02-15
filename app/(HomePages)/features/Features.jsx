import React from "react";
import "animate.css/animate.compat.css"
import ScrollAnimation from 'react-animate-on-scroll';

const Featurepage = () => {
  return (
    <div className=" bg-black text-white mt-8 min-h-screen">
    
    

   
      <section className="py-16 ">
        <div className="container mx-auto text-center px-6 ">
          <h2 className="text-4xl font-bold text-white mb-6">
            Key Features
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Explore powerful features designed to help you succeed:
          </p>
              <ScrollAnimation animateIn='bounce'
                  initiallyVisible={true}
                  animateOnce={true}>
                

              <div className="flex flex-col  gap-8">
                <div className="relative group p-6 bg-violet-100 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <i className="fas fa-clock text-5xl text-blue-600 mb-4"></i>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 group-hover:text-blue-900 transition-colors duration-300">
                    Timed Sessions
                  </h3>
                  <p className="text-gray-600">
                    Practice under real interview conditions with timed sessions.
                  </p>
                </div>
                <div className="relative group p-6 bg-violet-200 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <i className="fas fa-chart-line text-5xl text-purple-600 mb-4"></i>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 group-hover:text-purple-900 transition-colors duration-300">
                    Track Your Progress
                  </h3>
                  <p className="text-gray-600">
                    Get feedback on your performance and track your improvement over time.
                  </p>
                </div>
                <div className="relative group p-6 bg-violet-300 rounded-lg shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <i className="fas fa-comments text-5xl text-pink-600 mb-4"></i>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 group-hover:text-pink-900 transition-colors duration-300">
                    Real-time Feedback
                  </h3>
                  <p className="text-gray-600">
                    Receive immediate feedback on your answers to refine your responses.
                  </p>
                </div>
              </div>
              </ScrollAnimation>
            </div>
      </section>

      

    
    </div>

  );
};

export default Featurepage;
