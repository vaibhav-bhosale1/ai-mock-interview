
import React from 'react'
import AddNewInterview from './_components/AddNewInterview'

const Dashboard = () => {
  return (
    <div className='p-10'>
        <h2 className='font-bold text-2xl'>Dashboard</h2>
        <h2 className='text-gray-400'>Create and start your AI Mockup Interview</h2>

        <div className='grid md:grid-cols-1 lg:grid-cols-3 my-5'>
            <AddNewInterview/>
        </div>
    </div>
  )
}

export default Dashboard
