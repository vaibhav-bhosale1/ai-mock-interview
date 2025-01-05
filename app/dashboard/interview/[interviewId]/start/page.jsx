"use client";
import React, { useEffect, useState, use } from "react";
import { db } from "../../../../../utils/db";
import { MockInterview } from "../../../../../utils/schema";
import { eq } from "drizzle-orm";
import Question from "./_components/Questions";
import RecordAnsSection from "./_components/RecordAnsSection"
import {  LoaderPinwheel } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import Link from "next/link";

function StartInterview({ params: paramsPromise }) {
  const params = use(paramsPromise); // Resolve the `params` Promise
  const { interviewId } = params; // Safely access `interviewId`
    const [activequestionindex,setactivequestionindex]=useState(0)
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]); // Store questions
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state for handling fetch issues
  const [interviewData,setinterviewData]=useState();
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
      setinterviewData(result[0]);
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
        <p><LoaderPinwheel height={200} width={200} className="items-center mt-40 ml-70 pl-70 absolute animate-ping left-56" color="white"/></p> // Show loading message
      ) : error ? (
        <p className="text-red-500">{error}</p> // Show error message if fetching fails
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Render questions */}
          <Question mockInterviewQuestion={mockInterviewQuestion} activequestionindex={activequestionindex} />

          <RecordAnsSection  mockInterviewQuestion={mockInterviewQuestion} activequestionindex={activequestionindex} interviewData={interviewData}/>
        </div>
      )}
      <div className="flex justify-end gap-5">
        {activequestionindex>0&&   <Button onClick={()=>setactivequestionindex(activequestionindex-1)}>Previous Question</Button>}
        {activequestionindex!=mockInterviewQuestion?.length-1&& <Button onClick={()=>setactivequestionindex(activequestionindex+1)}>Next Question</Button>}
  
        {activequestionindex==mockInterviewQuestion?.length-1&&   <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'}> <Button>End Interview</Button></Link>}
       


      </div>
    </div>
  );
}

export default StartInterview;