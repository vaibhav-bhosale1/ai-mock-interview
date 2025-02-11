import Image from 'next/image';
import React, { useState, useCallback, useRef } from 'react';
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
  const [loading, setloading] = useState(false);
  const { user } = useUser();
  const isSubmitting = useRef(false);

  const notifysuccess = () => toast.success('Answer stored!');
  const notifyfailed = () => toast.error('Failed to store answer. Please try again.');

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const parseFeedbackResponse = (response) => {
    try {
      const jsonStart = response.indexOf('{');
      const jsonEnd = response.lastIndexOf('}') + 1;
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('No valid JSON found in response');
      }
      const jsonStr = response.slice(jsonStart, jsonEnd);
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Failed to parse feedback response:', error);
      return {
        rating: "N/A",
        feedback: "Unable to generate feedback at this time."
      };
    }
  };

  const storeAnswer = async (transcriptText) => {
    if (isSubmitting.current || !transcriptText || transcriptText.length <= 3) {
      return;
    }

    isSubmitting.current = true;
    setloading(true);

    try {
      const currentQuestion = mockInterviewQuestion[activequestionindex];
      if (!currentQuestion || !interviewData?.mockId || !user?.primaryEmailAddress?.emailAddress) {
        throw new Error('Required data missing');
      }

      // Insert answer
      await db.insert(UserAnswer).values({
        mockIdRef: interviewData.mockId,
        question: currentQuestion.question,
        correctAns: currentQuestion.answer,
        userAns: transcriptText,
        userEmail: user.primaryEmailAddress.emailAddress,
        createdAt: moment().format('DD-MM-yyyy'),
      });

      // Generate feedback
      const feedbackPrompt = `Question: ${currentQuestion.question}
        User Answer: ${transcriptText}
        Please provide a JSON response with:
        {
          "rating": "1-10 rating",
          "feedback": "2-3 sentences of constructive feedback"
        }`;

      const result = await chatSession.sendMessage(feedbackPrompt);
      const responseText = await result.response.text();
      const JsonFeedbackResp = parseFeedbackResponse(responseText);

      // Update with feedback
      await db
        .update(UserAnswer)
        .set({
          feedback: JsonFeedbackResp.feedback,
          rating: JsonFeedbackResp.rating,
        })
        .where(eq(UserAnswer.mockIdRef, interviewData.mockId));

      notifysuccess();
    } catch (error) {
      console.error('Failed to save answer:', error);
      notifyfailed();
    } finally {
      setloading(false);
      isSubmitting.current = false;
    }
  };

  const handleRecordingToggle = useCallback(() => {
    if (listening) {
      // Stop recording and store the answer
      SpeechRecognition.stopListening();
      if (transcript) {
        storeAnswer(transcript);
      }
    } else {
      // Start new recording
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
    }
  }, [listening, transcript, resetTranscript]);

  if (!browserSupportsSpeechRecognition) {
    return (
      <p className="text-red-500">
        Browser does not support Speech Recognition. Please use Chrome or a supported browser.
      </p>
    );
  }

  return (
    <div className="flex justify-center items-center flex-col">
      <div className="flex flex-col justify-center items-center bg-black rounded-lg p-5 mt-20 border border-cyan-200">
        <Image
          src="/webcam.png"
          width={300}
          height={300}
          alt="webcam"
          className="absolute"
        />
        <Webcam mirrored={true} style={{ height: 300, width: '100%', zIndex: 10 }} />
      </div>

      <Button
        disabled={loading}
        variant="outline"
        className="my-10"
        onClick={handleRecordingToggle}
      >
        {listening ? (
          <h2 className="text-red-600 flex gap-2">
            <Mic /> Stop Recording
          </h2>
        ) : (
          <h2>Record Answer</h2>
        )}
      </Button>

      {transcript && !listening && (
        <div className="text-sm text-gray-600 mb-4">
          Last recorded answer: {transcript}
        </div>
      )}

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