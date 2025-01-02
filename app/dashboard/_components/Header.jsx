"use client"
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'




const Header = () => {

    const path=usePathname();
    useEffect(()=>{
        console.log(path)
    })
  return (
    <div className='flex p-4 justify-between bg-secondary shadow-sm'>
        <h1>Header</h1>
        <ul className='hidden md:flex gap-6 items-center'>
            <li className={`hover:text-blue-600 hover:font-bold transition-all cursor-pointer ${path=='/dashboard'&&'text-blue-900 font-bold'}`}
            >Dashboard</li>
            <li className={`hover:text-blue-600 hover:font-bold transition-all cursor-pointer ${path=='/dashbod'&&'text-blue-900 font-bold'}`}
            >Questions</li>
              <li className={`hover:text-blue-600 hover:font-bold transition-all cursor-pointer ${path=='/dashbard'&&'text-blue-900 font-bold'}`}
            >Upgrade</li>
             <li className={`hover:text-blue-600 hover:font-bold transition-all cursor-pointer ${path=='/dashbard'&&'text-blue-900 font-bold'}`}
            >How it Works?</li>
        </ul>
        <UserButton/>
    </div>
  )
}

export default Header
