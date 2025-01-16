import Image from 'next/image';
import React, { useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button } from '../../../../../../components/ui/button';
import { Mic } from 'lucide-react';
import { chatSession } from '../../../../../../utils/GeminiAiModel';
import { db } from '../../../../../../utils/db';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { UserAnswer } from '../../../../../../utils/schema';
import { eq } from 'drizzle-orm';
import { ToastContainer, toast } from 'react-toastify';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function RecordAnsSection({ mockInterviewQuestion, activequestionindex, interviewData }) {
  const [userans, setuserans] = useState('');
  const [loading, setloading] = useState(false);
  const { user } = useUser();

  const notifysuccess = () => toast('Answer stored!');
  const notifyfailed = () => toast('Failed to store answer. Please try again.');

  // Speech Recognition hooks
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  /** Handle Start/Stop Recording */
  const StartStopRecording = useCallback(() => {
    if (listening) {
      SpeechRecognition.stopListening();
      console.log('Recording stopped');
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
      console.log('Recording started');
    }
  }, [listening, resetTranscript]);

  /** Update DB after Recording */
  useEffect(() => {
    if (!listening && transcript?.length > 3) {
      setuserans(transcript);
      Updateuseransdb();
    }
  }, [listening, transcript]);

  /** Update User Answer in DB */
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

    console.log('Answer successfully stored in the database:', userans); // Log the saved answer

    const feedbackPrompt =
      'Question:' +
      mockInterviewQuestion[activequestionindex]?.question +
      ', User Answer: ' +
      userans +
      ', Depends on question and user answer for given interview question' +
      'please give us rating rating for answer and feedback as area of improvement if any' +
      'in just 5-6 lines to improve and topics that needs to be studied highlight it in JSON format with rating field and feedback field';

    const result = await chatSession.sendMessage(feedbackPrompt);
    const cleanedJson = (await result.response.text())
      .replace('```json', '')
      .replace('```', '');
    const JsonFeedbackResp = JSON.parse(cleanedJson);

    await db.update(UserAnswer).set({
      feedback: JsonFeedbackResp?.feedback,
      rating: JsonFeedbackResp?.rating,
    }).where(eq(UserAnswer.mockIdRef, interviewData?.mockId));

    console.log('Feedback and rating updated for the answer:', JsonFeedbackResp); // Log feedback and rating

    notifysuccess();
    setuserans('');
  } catch (error) {
    console.error('Failed to save answer:', error);
    notifyfailed();
    alert('Failed to save the answer. Check console for details.');
  } finally {
    setloading(false);
  }
};


  if (!browserSupportsSpeechRecognition) {
    return (
      <p className="text-red-500">
        Browser does not support Speech Recognition. Please use Chrome or a supported browser.
      </p>
    );
  }

  return (
    <div className="flex justify-center items-center flex-col">
      {/* Camera Section */}
      <div className="flex flex-col justify-center items-center bg-black rounded-lg p-5 mt-20 border border-cyan-200">
        <Image
          src={'/webcam.png'}
          width={300}
          height={300}
          alt="webcam"
          className="absolute"
        />
        <Webcam mirrored={true} style={{ height: 300, width: '100%', zIndex: 10 }} />
      </div>

      {/* Record Button */}
      <Button
        disabled={loading}
        variant="outline"
        className="my-10"
        onClick={StartStopRecording}
      >
        {listening ? (
          <h2 className="text-red-600 flex gap-2">
            <Mic /> Stop Recording
          </h2>
        ) : (
          <h2>Record Answer</h2>
        )}
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
