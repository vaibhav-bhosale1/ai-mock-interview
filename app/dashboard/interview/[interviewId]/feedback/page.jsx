"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../../../utils/db";
import { eq } from "drizzle-orm";
import { UserAnswer } from "../../../../../utils/schema";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../../../components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const router=useRouter();

  useEffect(() => {
    fetchFeedback();
  }, [params]);

  const fetchFeedback = async () => {
    setLoading(true); // Set loading to true before fetching
    const resolvedParams = await params; // Unwrap the params Promise
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, resolvedParams.interviewId))
      .orderBy(UserAnswer.id);
    console.log(result);
    setFeedbackList(result);
    setLoading(false); // Set loading to false after fetching
  };

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-blue-500">Congratulations!!</h2>
      <h2 className="text-2xl font-bold">Here is your interview</h2>
      <h2 className="text-primary text-lg">
        Overall Interview Rating <strong>7/10</strong>
      </h2>
      <h2 className="text-sm text-gray-500">
        Find below interview questions, correct answers, your answers, and
        feedback for improvement.
      </h2>
      {feedbackList?.length===0?
    <h2> No Interview Feedback Record Found</h2>  
    :
    <>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          {/* Larger and different loading animation */}
          <svg
            className="animate-ping h-16 w-16 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <circle
              className="opacity-75"
              cx="12"
              cy="12"
              r="6"
              fill="currentColor"
            ></circle>
          </svg>
        </div>
      ) : (
        feedbackList &&
        feedbackList.map((item, index) => (
          <Collapsible key={item.id} className="mt-7">
            <CollapsibleTrigger className="p-2 bg-gray-200 m-2 text-left rounded-lg flex justify-between gap-7 w-full">
              {item.question} <ChevronsUpDown className="h-5 w-5" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col gap-2 ">
                <h2 className="text-red-600 p-2 border rounded-lg">
                  <strong>Rating:</strong> {item.rating}
                </h2>
                <h2 className="p-2 rounded-lg bg-red-50 text-sm text-red-700">
                  <strong>Your Answer: </strong>
                  {item.userAns}
                </h2>
                <h2 className="p-2 rounded-lg bg-green-50 text-sm text-green-700">
                  <strong>Correct Answer: </strong>
                  {item.correctAns}
                </h2>
                <h2 className="p-2 rounded-lg bg-blue-50 text-sm text-blue-700">
                  <strong>Feedback: </strong>
                  {item.feedback}
                </h2>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))
      )}
      </>}
 <Button onClick={()=>router.replace('/dashboard')}>Go Home</Button>
 
    </div>
  );
}

export default Feedback;
