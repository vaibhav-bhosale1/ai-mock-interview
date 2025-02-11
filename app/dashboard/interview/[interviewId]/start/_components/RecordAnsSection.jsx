import Image from 'next/image';
import React, { useState, useCallback, useRef } from 'react';
import Webcam from 'react-webcam';
import { Button } from '../../../../../../components/ui/button';
import { Mic, Type, Save } from 'lucide-react';
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
  const [inputMethod, setInputMethod] = useState('mic');
  const [textAnswer, setTextAnswer] = useState('');
  const { user } = useUser();
  const isSubmitting = useRef(false);
  const recordedAnswer = useRef('');

  const notifysuccess = () => toast.success('Answer stored!');
  const notifyfailed = () => toast.error('Failed to store answer. Please try again.');

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({
    continuous: true,
    onResult: (result) => {
      recordedAnswer.current = result;
    }
  });

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

  const storeAnswer = async (answerText) => {
    if (isSubmitting.current || !answerText || answerText.length <= 3) {
      notifyfailed();
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
        userAns: answerText,
        userEmail: user.primaryEmailAddress.emailAddress,
        createdAt: moment().format('DD-MM-yyyy'),
      });

      // Generate feedback
      const feedbackPrompt = `Question: ${currentQuestion.question}
        User Answer: ${answerText}
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
      if (inputMethod === 'text') {
        setTextAnswer('');
      }
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
        // Small delay to ensure we have the final transcript
        setTimeout(() => {
          storeAnswer(transcript);
          resetTranscript();
        }, 500);
      }
    } else {
      // Start new recording
      resetTranscript();
      recordedAnswer.current = '';
      SpeechRecognition.startListening({ continuous: true });
    }
  }, [listening, transcript, resetTranscript]);

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textAnswer.trim()) {
      storeAnswer(textAnswer.trim());
    }
  };

  if (!browserSupportsSpeechRecognition && inputMethod === 'mic') {
    setInputMethod('text');
    return (
      <p className="text-red-500 mb-4">
        Browser does not support Speech Recognition. Switching to text input mode.
      </p>
    );
  }

  return (
    <div className="flex justify-center items-center flex-col">
      <div className="flex gap-2 mb-5">
        <Button 
          variant={inputMethod === 'mic' ? "outline" : "default"}
          onClick={() => {
            setInputMethod('mic');
            resetTranscript();
          }}
          className="flex gap-2 items-center mt-5"
        >
          <Mic className="h-4 w-4" />
          Voice Recording
        </Button>
        <Button 
          variant={inputMethod === 'text' ? "outline" : "default"}
          onClick={() => setInputMethod('text')}
          className="flex gap-2 items-center mt-5 "
        >
          <Type className="h-4 w-4" />
          Text Input
        </Button>
      </div>

      <div className="flex flex-col justify-center items-center bg-black rounded-lg p-5 mt-18 border border-cyan-200">
        <Image
          src="/webcam.png"
          width={300}
          height={300}
          alt="webcam"
          className="absolute"
        />
        <Webcam mirrored={true} style={{ height: 300, width: '100%', zIndex: 10 }} />
      </div>

      {inputMethod === 'mic' ? (
        <div className="flex flex-col items-center w-full max-w-lg">
          <Button
            disabled={loading}
            variant="outline"
            className="my-10"
            onClick={handleRecordingToggle}
          >
            {listening ? (
              <h2 className="text-red-600 flex gap-2">
                <Mic className="animate-pulse" /> Stop Recording
              </h2>
            ) : (
              <h2>Record Answer</h2>
            )}
          </Button>

          {listening && (
            <div className="text-sm text-gray-600 mb-4">
              Recording: {transcript}
            </div>
          )}

          {!listening && transcript && (
            <div className="text-sm text-gray-600 mb-4">
              Last recorded answer: {transcript}
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleTextSubmit} className="w-full max-w-lg mt-10">
          <textarea
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-3 border rounded-lg min-h-[100px] mb-4"
            disabled={loading}
          />
          <Button 
            type="submit" 
            disabled={loading || !textAnswer.trim()} 
            className="w-full flex gap-2 items-center justify-center"
          >
            <Save className="h-4 w-4" />
            Save Answer
          </Button>
        </form>
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