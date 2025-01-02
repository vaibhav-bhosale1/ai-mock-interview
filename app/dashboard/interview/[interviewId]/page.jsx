"use client"
import React, { use, useEffect, useState } from 'react'
import { MockInterview } from '../../../../utils/schema'
import { eq } from 'drizzle-orm'
import { db } from '../../../../utils/db'
import Webcam from "react-webcam";
import { CameraIcon, Lightbulb, Link } from 'lucide-react'
import { Button } from '../../../../components/ui/button'
import { useRouter } from 'next/navigation'



const Interview = ({ params }) => {
    // Unwrap the params promise
    const { interviewId } = use(params);
    const [interviewData,setinterviewData]=useState(null);
    const [webcam,setwebcam]=useState(false);
      const router=useRouter();
  
    useEffect(() => {
      GetInterviewDetails();
    }, []);
    
  
    const GetInterviewDetails = async () => {
      try {
        const result = await db
          .select()
          .from(MockInterview)
          .where(eq(MockInterview.mockId,interviewId));

          setinterviewData(result[0]);
       
        console.log(result);
      } catch (error) {
        console.error("Error fetching interview details:", error);
      }
    }
    
  return (
    <div className='my-10 flex-col'>
        <h2 className='font-bold text-2xl'>
            Let's Get Started
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            
                <div className='flex flex-col my-5 gap-3 w-auto'>
                    <div className='flex flex-col p-5 rounded-lg border gap-5'>
                        {interviewData ? (
                                <>
                                <h2 className='text-lg'><strong>Job Role/Position:</strong> {interviewData.jobPosition}</h2>
                                <h2 className='text-lg'><strong>Job Description/Tech Stack:</strong> {interviewData.jobDesc}</h2>
                                <h2 className='text-lg'><strong>Years of Experience:</strong> {interviewData.jobExperience}</h2>
                                </>

                            ) : (
                                <h2>Loading interview details...</h2>
                            )}
                    </div>
                    <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
                       <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb/><strong><span>Information</span></strong></h2> 
                        <h2 className='mt-3'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
                    </div>


                </div>
                <div>
                    {webcam? <><Webcam
                    onUserMedia={()=>setwebcam(true)}
                    onUserMediaError={()=>setwebcam(false)}
                    mirrored={true}
                    className='my-10 h-80 w-full'/>
                    <Button onClick={()=>setwebcam(false)} className='w-full' variant="ghost">Disable Web Cam and Microphone</Button>
                    </>
                    :<>
                    <CameraIcon className='h-80 w-full my-7 p-20 bg-slate-100 rounded-lg border'/>
                    <Button onClick={()=>setwebcam(true)} className='w-full' variant="ghost">Enable Web Cam and Microphone</Button>
                    
                    </>
                    }
                </div>

        </div>
        <div className='flex justify-end items-end mt-10'>
       
            <Button className='w-40' onClick={()=>router.push('/dashboard/interview/'+params.interviewId+'/start')}>Start Interview</Button>
        
        </div>
     
        
      
    </div>
  )
}

export default Interview
