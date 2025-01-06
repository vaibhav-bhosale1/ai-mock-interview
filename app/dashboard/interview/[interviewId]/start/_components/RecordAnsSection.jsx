"use client";
import Image from 'next/image';
import React, { useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button } from '../../../../../../components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react';
import { chatSession } from '../../../../../../utils/GeminiAiModel';
import { db } from '../../../../../../utils/db';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { UserAnswer } from '../../../../../../utils/schema';
import { eq } from 'drizzle-orm';
import { ToastContainer, toast } from 'react-toastify';

function RecordAnsSection({ mockInterviewQuestion, activequestionindex, interviewData }) {
  const [userans, setuserans] = useState('');
  const [loading, setloading] = useState(false);
  const { user } = useUser();
  const notifysuccess = () => toast('Answer stored!');
  const notifyfailed = () => toast('failed to stored answer, PLease try again');


  const {
    error,
    results,
    isRecording,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  /** Aggregate Speech Results */
  useEffect(() => {
    if (results && results.length > 0) {
      const completeTranscript = results.map((r) => r.transcript).join(' ');
      setuserans(completeTranscript);
    }
  }, [results]);

  /** Update DB after Recording */
  useEffect(() => {
    if (!isRecording && userans?.length > 3) {
      Updateuseransdb();
    }
  }, [isRecording]);

  /** Start/Stop Recording */
  const StartStopRecording = useCallback(() => {
    if (isRecording) {
      stopSpeechToText();
      
      console.log('Recording stopped');
    } else {
      setuserans('');
      setResults([]);
      startSpeechToText();
      console.log('Recording started');
    }
  }, [isRecording, startSpeechToText, stopSpeechToText]);

  /** Update User Answer in DB */
  const Updateuseransdb = async () => {
    setloading(true);
    console.log('Saving user answer:', userans);

    try {
      await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activequestionindex]?.question,
        correctAns: mockInterviewQuestion[activequestionindex]?.answer,
        userAns: userans,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy'),
      });

       const feedbackPrompt="Question:"+mockInterviewQuestion[activequestionindex]?.question+
        ", User Answer: "+userans+", Depends on question and user answer for given interview question"+
        "please give us rating rating for answer and feedback as area of improvement if any"+
        "in just 5-6 lines to improve and topics that needs to be studied highlight it in JSON format with rating field and feedback field";

      const result = await chatSession.sendMessage(feedbackPrompt);
      const cleanedJson = (await result.response.text()).replace('```json', '').replace('```', '');
      const JsonFeedbackResp = JSON.parse(cleanedJson);

      await db.update(UserAnswer).set({
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
      }).where(eq(UserAnswer.mockIdRef, interviewData?.mockId));

      
      
      notifysuccess()
      setuserans('');
      setResults([]);
    } catch (error) {
      console.error('Failed to save answer:', error);
      notifyfailed()
     
      alert('Failed to save the answer. Check console for details.');
    } finally {
      setloading(false);
    }
  };

  if (error) {
    return <p className='text-red-500'>Web Speech API is not supported in this browser. Please use Chrome or a supported browser.</p>;
  }

  return (
    <div className='flex justify-center items-center flex-col'>
      {/* Camera Section */}
      <div className='flex flex-col justify-center items-center bg-black rounded-lg p-5 mt-20 border border-cyan-200'>
        <Image src={"/webcam.png"} width={300} height={300} alt='webcam' className='absolute' />
        <Webcam mirrored={true} style={{ height: 300, width: '100%', zIndex: 10 }} />
      </div>

      {/* Record Button */}
      <Button disabled={loading} variant="outline" className="my-10" onClick={StartStopRecording}>
        {isRecording ? <h2 className='text-red-600 flex gap-2'><Mic /> Stop Recording</h2> : <h2>Record Answer</h2>}
      </Button>
      <ToastContainer 
      position="top-center"
      autoClose={1110}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      
      />
    </div>
  );
}

export default RecordAnsSection;
