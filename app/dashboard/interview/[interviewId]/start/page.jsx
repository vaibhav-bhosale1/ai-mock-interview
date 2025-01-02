"use client";
import React, { useEffect, useState, use } from "react";
import { db } from "../../../../../utils/db";
import { MockInterview } from "../../../../../utils/schema";
import { eq } from "drizzle-orm";
import Question from "./_components/Questions";
import RecordAnsSection from "./_components/RecordAnsSection"
function StartInterview({ params: paramsPromise }) {
  const params = use(paramsPromise); // Resolve the `params` Promise
  const { interviewId } = params; // Safely access `interviewId`
    const [activequestionindex,setactivequestionindex]=useState(1)
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]); // Store questions
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state for handling fetch issues

  // Fetch interview details on component mount
  useEffect(() => {
    GetInterviewDetails();
  }, []);

  const GetInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));

      // Parse JSON response
      const jsonMockResp = JSON.parse(result[0]?.jsonMockResp || "{}");

      // Extract the array of questions
      const questions = jsonMockResp.interviewQuestions || [];
      setMockInterviewQuestion(questions);
    } catch (error) {
      console.error("Error fetching interview details:", error);
      setError("Failed to fetch interview details. Please try again later.");
    } finally {
      setIsLoading(false); // Stop loading spinner regardless of success or failure
    }
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p> // Show loading message
      ) : error ? (
        <p className="text-red-500">{error}</p> // Show error message if fetching fails
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Render questions */}
          <Question mockInterviewQuestion={mockInterviewQuestion} activequestionindex={activequestionindex} />

          <RecordAnsSection  mockInterviewQuestion={mockInterviewQuestion} activequestionindex={activequestionindex}/>
        </div>
      )}
    </div>
  );
}

export default StartInterview;
