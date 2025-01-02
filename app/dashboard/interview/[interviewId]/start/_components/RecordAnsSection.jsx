"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { Button } from '../../../../../../components/ui/button'
import useSpeechToText from 'react-hook-speech-to-text';
import { is } from 'drizzle-orm'
import { Mic } from 'lucide-react'
import { toast } from '../../../../../../components/hooks/use-toast'



function RecordAnsSection ({ mockInterviewQuestion,activequestionindex}){
    const [userans,setuserans]=useState('');
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

      const SaveUserAnswer=()=>{
        if(isRecording){
            stopSpeechToText();
            if(userans?.length<10){
              toast('Error while saving your answer please record again')
            }
            const feedbackPrompt="Question:"+mockInterviewQuestion[activequestionindex]?.question+
            ", User Answer: "+userans+", Depends on question and user answer for given question please give feedback as area of improvement"
        }
        else{
            startSpeechToText();
        }
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
    <Button variant="outline" className="my-10" onClick={SaveUserAnswer}>
        {isRecording?
        <h2 className='text-red-600 flex gap-2'><Mic/>Stop Recording</h2>
        :'Record Answer'}</Button>
        <Button onClick={()=>console.log(userans)}>Show User Answer</Button>
    </div>
  )
}

export default RecordAnsSection
