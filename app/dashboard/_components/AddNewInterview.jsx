"use client";
import React, { useState } from "react";
import { chatSession } from "../../../utils/GeminiAiModel";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../../utils/db";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Input } from "../../../components/ui/input";
import { LoaderPinwheel } from "lucide-react";
import { MockInterview } from "../../../utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AddNewInterview = () => {
  const [opendialog, setopendialog] = useState(false);
  const [jobposition, setjobposition] = useState("");
  const [jobdesc, setjobdesc] = useState("");
  const [jobexp, setjobexp] = useState("");
  const [numQuestions, setNumQuestions] = useState("");
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user } = useUser();

  const onSubmit = async (event) => {
    setloading(true);
    event.preventDefault();
    
    const Inputprompt = `Generate a technical interview for the following position:
    - Job Position: ${jobposition}
    - Job Description: ${jobdesc}
    - Years of Experience Required: ${jobexp}
    
    Please provide exactly ${numQuestions} interview questions if answer require to have code ask them to write code and with detailed answers in this exact JSON format:
    
    {
      "interview_questions": [
        {
          "question_number": 1,
          "question": "The technical question text",
          "answer": "The detailed answer text"
        }
      ]
    }
    
    The response must be valid JSON only, properly formatted as plain text. Ensure that any code included is correctly formatted without extra markdown, symbols, or explanations. Do not include any additional text outside the JSON response.No additional text or formatted`;
    
  
    try {
      const result = await chatSession.sendMessage(Inputprompt);
      let MockJsonResp = await result.response.text();
      
      // Clean the response
      MockJsonResp = MockJsonResp.replace(/```json\n?/g, "")
                                .replace(/```\n?/g, "")
                                .trim();
      
      console.log("Raw JSON string:", MockJsonResp);
      
      // Parse and validate
      const parsedResponse = JSON.parse(MockJsonResp);
      
      if (!parsedResponse.interview_questions || !Array.isArray(parsedResponse.interview_questions)) {
        throw new Error("Invalid response format from AI");
      }
  
      // Store in database
      const resp = await db
        .insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: MockJsonResp,
          jobPosition: jobposition,
          jobDesc: jobdesc,
          jobExperience: jobexp,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-yyyy"),
        })
        .returning({ mockId: MockInterview.mockId });
  
      setloading(false);
      setopendialog(false);
      
      if (resp && resp[0]?.mockId) {
        router.push("/dashboard/interview/" + resp[0].mockId)
        
      }
  
    } catch (error) {
      console.error("Error:", error);
      setloading(false);
      alert("Failed to create interview. Please try again.");
    }
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-sm cursor-pointer transition-all"
        onClick={() => setopendialog(true)}
      >
        <div className="text-lg text-center">
          <h2>+Add New</h2>
        </div>
      </div>
      <Dialog open={opendialog} onOpenChange={setopendialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about the job you are interviewing
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                  </div>
                )}
                <div>
                  <h2>
                    Add Details about your job position/role, Job description
                    and years of experience
                  </h2>
                  <div className="mt-7 my-3">
                    <label>Job Role/Job Position</label>
                    <Input
                      placeholder="Ex. Full Stack Developer"
                      required
                      onChange={(event) => setjobposition(event.target.value)}
                    />
                  </div>
                  <div className="my-3">
                    <label>Job Description/Tech Stack</label>
                    <Textarea
                      placeholder="Ex. React, Angular"
                      required
                      onChange={(event) => setjobdesc(event.target.value)}
                    />
                  </div>
                  <div className="my-3">
                    <label>Years of Experience</label>
                    <Input
                      placeholder="5"
                      type="number"
                      max="70"
                      required
                      onChange={(event) => setjobexp(event.target.value)}
                    />
                  </div>

                  <div className="my-3">
                    <label>Number of Questions</label>
                    <Input
                      placeholder="5"
                      type="number"
                      min="1"
                      max="20"
                      required
                      value={numQuestions}
                      onChange={(event) => setNumQuestions(event.target.value)}
                    />
                  </div>

                </div>
                <div className="flex gap-5 justify-end">
                  <Button
                    onClick={() => setopendialog(false)}
                    variant="ghost"
                    type="button"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderPinwheel className="animate-spin mr-2" />
                        Generating from AI...
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;