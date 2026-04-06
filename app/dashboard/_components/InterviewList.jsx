"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import InterviewItemCard from "../_components/InterviewItemCard";
import { LoaderPinwheel } from "lucide-react";

function InterviewList() {
  const { user } = useUser();
  const [InterviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    user && GetInterviewList();
  }, [user]);

  const GetInterviewList = async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      const res = await fetch(`/api/interviews?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setInterviewList(data);
    } catch (error) {
      console.error("Error fetching interview list:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-cyan-300">Previous Mock Interviews</h2>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoaderPinwheel className="w-16 h-16 animate-spin text-gray-500" />
          <p className="ml-4 text-lg text-gray-500">Loading interviews...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
          {InterviewList && InterviewList.length > 0 ? (
            InterviewList.map((interview, index) => (
              <InterviewItemCard interview={interview} key={index} />
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              No mock interviews found. Create a new one!
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default InterviewList;