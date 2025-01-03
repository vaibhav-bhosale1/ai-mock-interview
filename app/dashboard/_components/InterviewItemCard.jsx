import React from 'react'
import { Button } from '../../../components/ui/button'
import { useRouter } from 'next/navigation'

function InterviewItemCard ({interview}) {
    const router=useRouter();
  return (
    <div className='border shadow-sm rounded-lg p-3'>
        <h2 className='font-bold text-blue-500'> {interview?.jobPosition}</h2>
       <h2 className='text-sm text-gray-600'>Job Experience: {interview?.jobExperience}</h2>
       <h2 className='text-xs text-gray-500'>Created At: {interview.createdAt}</h2>
       <div className='flex justify-between mt-2 gap-5'>
            <Button size="sm" variant='outline' className='w-full' onClick={()=>router.push('/dashboard/interview/'+interview?.mockId+'/feedback')}>Feedback</Button>
            <Button size="sm" className='w-full' onClick={()=>router.push('/dashboard/interview/'+interview?.mockId)}>Start</Button>
       </div>
    </div>
  )
}

export default InterviewItemCard
