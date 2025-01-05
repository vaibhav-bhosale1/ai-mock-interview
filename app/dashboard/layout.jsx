import React from 'react'
import Header from './_components/Header'
import NextTopLoader from 'nextjs-toploader';
function DashboardLayout({children}){
    return(
        <div className='bg-black min-h-screen'>
              <NextTopLoader />
            <Header/>
                <div className='mx-5 md:mx-20 lg:mx-30'>
                    {children}
                </div>
           
        </div>
    )
}

export default DashboardLayout