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
  DialogTrigger,
} from "../../../components/ui/dialog";

import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { Input } from "../../../components/ui/input";
import { ChatSession } from "@google/generative-ai";
import { LoaderPinwheel } from "lucide-react";
import { MockInterview } from "../../../utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

const AddNewInterview = () => {
  const [opendialog, setopendialog] = useState(false);
  const [jobposition, setjobposition] = useState("");
  const [jobdesc, setjobdesc] = useState("");
  const [jobexp, setjobexp] = useState("");
  const [loading, setloading] = useState(false);
  const [jsonresp, setjsonresp] = useState([]);
  const router = useRouter();
  const { user } = useUser();

  const onSubmit = async (event) => {
    setloading(true);
    event.preventDefault();
    console.log(jobposition, jobdesc, jobexp);

    const Inputprompt = `Job position: ${jobposition}, Job description: ${jobdesc}, Years of experience: ${jobexp}, Depends on this info give me ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions and answers which will train me quite good for interview in JSON format`;

    try {
      const result = await chatSession.sendMessage(Inputprompt);
      const MockJsonResp = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");
      console.log(JSON.parse(MockJsonResp));
      setjsonresp(MockJsonResp);

      let resp = null; // Declare `resp` outside the block
      if (MockJsonResp) {
        resp = await db
          .insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: MockJsonResp,
            jobPosition: jobposition,
            jobDesc: jobdesc,
            jobExperience: jobexp,
            createdBy: user?.primaryEmailAddress.emailAddress,
            createdAt: moment().format("DD-MM-yyyy"),
          })
          .returning({ mockId: MockInterview.mockId });

        console.log("Inserted ID", resp);
      } else {
        console.log("Error: No response generated");
      }

      setloading(false);

      if (resp) {
        setopendialog(false);
        router.push("/dashboard/interview/" + resp[0]?.mockId);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setloading(false); // Ensure spinner stops on error
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
      {/* Dialog */}
      <Dialog open={opendialog} onOpenChange={setopendialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about the job you are interviewing
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
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
                        <LoaderPinwheel className="animate-spin" />
                        Generating from AI
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
