import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

function Question({ mockInterviewQuestion, activequestionindex }) {
  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Sorry, Your Browser does not support text to speech");
    }
  };

  return (
    <div className="p-5 border rounded-lg my-10">
      {mockInterviewQuestion && mockInterviewQuestion.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {mockInterviewQuestion.map((question, index) => (
             <h2
             key={index}
             className={`font-semibold p-2 rounded-full text-xs md:text-sm text-center cursor-pointer ${
               activequestionindex === index
                 ? "text-white bg-blue-500"
                 : "bg-secondary text-gray-700"
             }`}
           >
           
                Question #{index + 1}
              </h2>
            ))}
          </div>
          <h2 className="my-5 text-sm md:text-lg text-cyan-200">

            {mockInterviewQuestion[activequestionindex]?.question}
          </h2>
          <Volume2
            onClick={() =>
              textToSpeech(mockInterviewQuestion[activequestionindex]?.question)
            }
            className="cursor-pointer text-cyan-50"
          />
          <div className="border rounded-lg p-5 bg-blue-100 mt-10">
            <h2 className="flex gap-5 items-center text-blue-900">
              <Lightbulb />
              <strong>Note:</strong>
            </h2>
            <h2 className="text-sm text-blue-900 my-5">
              {process.env.NEXT_PUBLIC_QUESTION_NOTE}
            </h2>
          </div>
        </>
      ) : (
        // Loading spinner or placeholder content
        <div className="flex justify-center items-center h-40">
          <div className="loader border-t-2 border-blue-500 w-10 h-10 rounded-full animate-spin"></div>
          <p className="ml-3 text-blue-500 font-semibold">Loading questions...</p>
        </div>
      )}
    </div>
  );
}

export default Question;
