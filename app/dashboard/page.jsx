"use client"
import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'
import { useUser } from '@clerk/nextjs'
import { LoaderPinwheelIcon } from 'lucide-react'



const Dashboard = () => {
  const { user, isLoaded } = useUser(); // Ensure user data is loaded

  if (!isLoaded) {
    return <p className="p-10 "><LoaderPinwheelIcon/></p>; // Show a loading message while fetching user data
  }

  return (
    <div className='p-10'>
      <h1 className='text-white text-4xl font-sans mb-4'>Welcome, {user?.firstName} {user?.lastName}!</h1>
      <h2 className='font-bold text-2xl text-cyan-300'>Dashboard</h2>
      <h2 className='text-gray-400'>Create and start your AI Mock Interview</h2>

      <div className='grid md:grid-cols-1 lg:grid-cols-3 my-5'>
        <AddNewInterview />
      </div>
      <InterviewList />
    </div>
  );
}

export default Dashboard;
