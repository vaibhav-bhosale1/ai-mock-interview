"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { Button } from '../../../../../../components/ui/button'
import useSpeechToText from 'react-hook-speech-to-text';
import { is } from 'drizzle-orm'
import { Mic } from 'lucide-react'
import {chatSession} from '../../../../../../utils/GeminiAiModel'
import { db } from '../../../../../../utils/db'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { UserAnswer } from '../../../../../../utils/schema'


function RecordAnsSection ({ mockInterviewQuestion,activequestionindex,interviewData}){
    const [userans,setuserans]=useState('');
    const [loading,setloading]=useState(false);
    const {user}=useUser();
    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
      } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
      });
      useEffect(()=>{
            results.map((result)=>(
                setuserans(prevAns=>prevAns+result?.transcript)
            ))
      },[results])

      useEffect(()=>{
        if(!isRecording){
          Updateuseransdb();
        }
      },[userans])

      const StartStopRecording= async()=>{
        if(isRecording){
            stopSpeechToText();
          
         
        }
        else{
            startSpeechToText();
        }
      }
      
      const Updateuseransdb=async()=>{
        setloading(true)
        console.log(userans)
        const feedbackPrompt="Question:"+mockInterviewQuestion[activequestionindex]?.question+
        ", User Answer: "+userans+", Depends on question and user answer for given interview question"+
        "please give us rating rating for answer and feedback as area of improvement if any"+
        "in just 3-5 lines to improve in JSON format with rating field and feedback field";

        const result=await chatSession.sendMessage(feedbackPrompt);
        const mockJsonrep=(result.response.text()).replace('```json','').replace('```','')
        console.log(mockJsonrep)
        const JsonFeedbackResp=JSON.parse(mockJsonrep)
        const resp=await db.insert(UserAnswer).values({
          mockIdRef:interviewData?.mockId,
          question:mockInterviewQuestion[activequestionindex]?.question,
          correctAns:mockInterviewQuestion[activequestionindex]?.answer,
          userAns:userans,
          feedback:JsonFeedbackResp?.feedback,
          rating:JsonFeedbackResp?.rating,
          userEmail:user?.primaryEmailAddress.emailAddress,
          createdAt:moment().format('DD-MM-yyyy') 

        })

        
        setuserans('')
        setloading(false)
      }


      if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;
  return (
    <div className='flex justify-center items-center flex-col'>
    <div className='flex flex-col justify-center items-center bg-black rounded-lg p-5 mt-20'> 
        <Image src={"/webcam.jpeg"} width={300} height={300} alt='webcam' className='absolute'/>
        <Webcam
        mirrored={true}
        style={{height:300,
            width:'100%',
            zIndex:10,
        }
        } />
      
    </div>
    <Button disabled={loading}
    variant="outline" className="my-10" onClick={StartStopRecording}>
        {isRecording?
        <h2 className='text-red-600 flex gap-2'><Mic/>Stop Recording</h2>
        :<h2>Record Answer</h2>}</Button>
    </div>
  )
}

export default RecordAnsSection
