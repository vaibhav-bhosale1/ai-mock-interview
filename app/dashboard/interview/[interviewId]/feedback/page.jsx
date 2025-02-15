"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { db } from "../../../../../utils/db";
import { eq } from "drizzle-orm";
import { UserAnswer } from "../../../../../utils/schema";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../../../../components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import PerformanceBarChart from "../feedback/feedbackgraphics/page";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../../../components/ui/dialog";
import AnswerDisplay from "./AnswerDisplay ";

function Feedback({ params: paramsPromise }) {
  const [params, setParams] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchParams = async () => {
      try {
        const resolvedParams = await paramsPromise;
        setParams(resolvedParams);
      } catch (error) {
        console.error("Error resolving params:", error);
      }
    };
    fetchParams();
  }, [paramsPromise]);

  useEffect(() => {
    if (params) {
      fetchFeedback();
    }
  }, [params]);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      if (!params?.interviewId) {
        console.error("Interview ID is missing");
        setLoading(false);
        return;
      }
  
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, params.interviewId))
        .orderBy(UserAnswer.id);
  
      console.log("Fetched Feedback:", result);
      setFeedbackList(result);
      calculateAverageRating(result);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = (feedbackList) => {
    if (!feedbackList || feedbackList.length === 0) {
      setAverageRating(0);
      return;
    }
  
    const totalRating = feedbackList.reduce((acc, item) => {
      const rating = Number(item.rating) || 0;
      return acc + rating;
    }, 0);
  
    const avgRating = totalRating / feedbackList.length;
    setAverageRating(avgRating.toFixed(1));
  };

  return(
    <div className="min-h-screen bg-black p-4 md:p-10">
  <div className="max-w-4xl mx-auto">
    {/* Congratulations Block */}
    <div className="bg-gradient-to-br from-cyan-900 to-cyan-700/90 text-white rounded-xl shadow-lg p-6 mb-6 backdrop-blur-md border border-cyan-500/50">
      <h2 className="text-2xl font-extrabold text-white mb-2 text-center">
        🎉 Congratulations!
      </h2>
      <h3 className="text-lg font-medium text-gray-300 mb-4 text-center">
        Here's your interview feedback
      </h3>

      <div className="bg-black/30 border border-cyan-400 rounded-lg p-3 text-center shadow-md">
        <span className="text-lg text-gray-200">Overall Interview Rating:</span>
        <span className="text-2xl font-bold text-cyan-300 ml-2">
          {averageRating !== null ? averageRating : "Loading..."}/10
        </span>
      </div>

      <p className="text-gray-300 text-sm mt-3 text-center">
        Click on each question below to view your answers and detailed feedback.
      </p>
    </div>

    {/* Questions & Feedback */}
    {loading ? (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} height={80} className="rounded-lg bg-gray-800/50" />
        ))}
      </div>
    ) : feedbackList?.length === 0 ? (
      <div className="text-center py-6 bg-gray-900 text-gray-400 rounded-lg shadow-md">
        <h2 className="text-lg">No Interview Feedback Record Found</h2>
      </div>
    ) : (
      <div className="space-y-4">
        {feedbackList.map((item, index) => (
          <Collapsible key={item.id} className="bg-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-700">
            <CollapsibleTrigger className="w-full p-4 hover:bg-cyan-800/20 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-cyan-500 text-black px-3 py-1 rounded-full font-semibold shadow-md">
                    Q{index + 1}
                  </span>
                  <span className="text-gray-200 font-medium">{item.question}</span>
                </div>
                <ChevronsUpDown className="h-5 w-5 text-cyan-400" />
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="border-t border-gray-700">
              <div className="p-5 space-y-4">
                {/* Rating Block */}
                <div className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-3 shadow-md">
                  <div className="font-semibold text-yellow-400">Rating</div>
                  <div className="text-yellow-300">{item.rating}/10</div>
                </div>

                {/* User Answer Block */}
                <div className="bg-red-900/30 border border-red-500 rounded-lg p-3 shadow-md">
                  <div className="font-semibold text-red-400">Your Answer</div>
                  <div className="text-red-300">{item.userAns}</div>
                </div>

                {/* Correct Answer Block */}
                <div className="bg-green-900/30 border border-green-500 rounded-lg p-3 shadow-md">
                  <div className="font-semibold text-green-400">Correct Answer</div>
                  <div className="text-green-300">
                    <AnswerDisplay content={item.correctAns} />
                  </div>
                </div>

                {/* Feedback Block */}
                <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-3 shadow-md">
                  <div className="font-semibold text-blue-400">Feedback</div>
                  <div className="text-blue-300">{item.feedback}</div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    )}

    {/* Buttons */}
    <div className="mt-8 flex gap-4 justify-center">
      <Button
        onClick={() => router.push("/dashboard")}
        className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-2 rounded-lg shadow-md transition-all duration-200"
      >
        Go Home
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            disabled={loading || feedbackList.length === 0}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-200"
          >
            View Performance
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl bg-gray-900 text-gray-200 border border-cyan-500 shadow-lg rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-cyan-300">
              Performance Analysis
            </DialogTitle>
          </DialogHeader>
          <PerformanceBarChart feedbackList={feedbackList} />
        </DialogContent>
      </Dialog>
    </div>
  </div>
</div>

  
  );
}

export default Feedback;