"use client";
import React, { useEffect, useState } from "react";
import Question from "./_components/Questions";
import RecordAnsSection from "./_components/RecordAnsSection";
import { LoaderPinwheel } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import Link from "next/link";
import { use } from 'react';

function StartInterview({ params }) {
  const { interviewId } = use(params);
  const [activequestionindex, setactivequestionindex] = useState(0);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interviewData, setinterviewData] = useState();

  useEffect(() => {
    GetInterviewDetails();
  }, [interviewId]);

  const GetInterviewDetails = async () => {
    try {
      const res = await fetch(`/api/interviews?mockId=${interviewId}`);
      const result = await res.json();

      if (!result) throw new Error("Interview not found");

      setinterviewData(result);

      const parsedQuestions = JSON.parse(result.jsonMockResp);
      if (parsedQuestions && Array.isArray(parsedQuestions.interview_questions)) {
        setMockInterviewQuestion(parsedQuestions.interview_questions);
      } else {
        throw new Error("Invalid question format");
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderPinwheel className="animate-spin" />
        <p className="ml-2">Loading interview questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Question
          mockInterviewQuestion={mockInterviewQuestion}
          activequestionindex={activequestionindex}
        />
        <RecordAnsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activequestionindex={activequestionindex}
          interviewData={interviewData}
        />
      </div>
      <div className="flex justify-end gap-5">
        {activequestionindex > 0 && (
          <Button onClick={() => setactivequestionindex(activequestionindex - 1)}>
            Previous Question
          </Button>
        )}
        {activequestionindex < mockInterviewQuestion.length - 1 && (
          <Button onClick={() => setactivequestionindex(activequestionindex + 1)}>
            Next Question
          </Button>
        )}
        {activequestionindex === mockInterviewQuestion.length - 1 && (
          <Link href={"/dashboard/interview/" + interviewData?.mockId + "/feedback"}>
            <Button>End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default StartInterview;