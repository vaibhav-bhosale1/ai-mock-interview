"use client";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
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
import { useRouter } from "next/navigation";

function Feedback({ params }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(null); // State for average rating
  const router = useRouter();

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
    calculateAverageRating(result); // Calculate average rating after fetching
    setLoading(false); // Set loading to false after fetching
  };

  const calculateAverageRating = (feedbackList) => {
    if (feedbackList.length === 0) {
      setAverageRating(0);
      return;
    }
    // Safely parse rating as a number and handle invalid data
    const totalRating = feedbackList.reduce((acc, item) => {
      const rating = Number(item.rating) || 0; // Parse rating as a number, default to 0 if invalid
      return acc + rating;
    }, 0);
    
    const avgRating = totalRating / feedbackList.length;
    setAverageRating(avgRating.toFixed(1)); // Limit to 1 decimal place
  };

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-blue-500">Congratulations!!</h2>
      <h2 className="text-2xl font-bold text-gray-100">Here is your interview</h2>
      <h2 className="text-lg text-gray-300">
        Overall Interview Rating: <strong className='text-gray-300'>{averageRating || "Loading..."}/10</strong>
      </h2>
      <h2 className="text-sm text-gray-500">
        Find below interview questions, correct answers, your answers, and feedback for improvement.
      </h2>
      {loading ? (
        <div className="flex flex-col gap-5">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} height={60} className="rounded-lg" />
          ))}
        </div>
      ) : feedbackList?.length === 0 ? (
        <h2>No Interview Feedback Record Found</h2>

      ) : (
        feedbackList.map((item, index) => (
          <Collapsible key={item.id} className="mt-7">
            <CollapsibleTrigger className="p-2 bg-gray-200 m-2 text-left rounded-lg flex justify-between gap-7 w-full">
              {item.question} <ChevronsUpDown className="h-5 w-5" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col gap-2">
                <h2 className="text-red-600 p-2 border rounded-lg">
                  <strong>Rating:</strong> {item.rating}
                </h2>
                <h2 className="p-2 rounded-lg bg-red-50 text-sm text-red-900">
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
      <Button onClick={() => router.replace("/dashboard")} className="mt-4">
        Go Home
      </Button>
    </div>
  );
}

export default Feedback;
