"use client"
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { db } from '../../../utils/db';
import { MockInterview } from '../../../utils/schema';
import { desc, eq } from 'drizzle-orm';
import InterviewItemCard from '../_components/InterviewItemCard'

function InterviewList() {
    const {user}=useUser();
    const [InterviewList,setInterviewList]=useState([]);

    useEffect(()=>{
        user&&GetInterviewList();
    },[user])
    

    const GetInterviewList=async()=>{
        const result=await db.select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy,user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(MockInterview.id))

        console.log(result);
        setInterviewList(result);
    }
  return (
    <div>
        <h2 className=' text-xl font-bold'>Previous Mock Interview</h2>
        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
            {InterviewList&&InterviewList.map((interview,index)=>(
                <InterviewItemCard interview={interview} key={index}/>
            ))}
        </div>
    </div>
  )
}

export default InterviewList
