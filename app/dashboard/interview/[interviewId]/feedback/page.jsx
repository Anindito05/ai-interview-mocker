"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

const Feedback = () => {
  const router = useRouter();
  const params = useParams(); //  CORRECT WAY
  const interviewId = params.interviewId;

  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (interviewId) {
      getFeedback();
    }
  }, [interviewId]);

  const getFeedback = async () => {
    try {
      console.log(" Fetching feedback for:", interviewId);

      const res = await fetch(`/api/interview/feedback/${interviewId}`);

      if (!res.ok) {
        throw new Error("Failed to fetch feedback");
      }

      const data = await res.json();
      console.log(" Feedback Data:", data);

      setFeedbackList(data);
    } catch (error) {
      console.error(" Client fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const overallRating = useMemo(() => {
    if (feedbackList.length === 0) return 0;

    const total = feedbackList.reduce(
      (sum, item) => sum + Number(item.rating),
      0,
    );

    return (total / feedbackList.length).toFixed(1);
  }, [feedbackList]);

  if (loading) {
    return (
      <div className="p-10 text-gray-500 font-semibold">
        Loading feedback...
      </div>
    );
  }

  return (
    <div className="p-10 max-w-5xl mx-auto">
      {feedbackList.length === 0 ? (
        <h2 className="font-bold text-xl text-gray-500 my-5">
          No Interview Feedback Found
        </h2>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-green-600">
            🎉 Congratulations!
          </h2>

          <h2 className="font-bold text-2xl mt-2">
            Here is your interview feedback
          </h2>

          <h2 className="text-primary text-lg my-4">
            Overall Interview Rating:{" "}
            <strong
              className={`${
                overallRating >= 5 ? "text-green-600" : "text-red-600"
              }`}
            >
              {overallRating}
              <span className="text-black"> / 10</span>
            </strong>
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Review each question along with your answer, the correct answer, and
            improvement feedback.
          </p>

          {feedbackList.map((item, index) => (
            <Collapsible key={index} className="mb-4">
              <CollapsibleTrigger className="p-3 bg-secondary rounded-lg flex justify-between items-center w-full text-left">
                <span>{item.question}</span>
                <ChevronDown className="h-5 w-5" />
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-2">
                <div className="flex flex-col gap-3">
                  <div className="p-2 border rounded bg-red-50 text-red-700">
                    <strong>Rating:</strong> {item.rating}/10
                  </div>

                  <div className="p-2 border rounded bg-yellow-50 text-yellow-900">
                    <strong>Your Answer:</strong> {item.userAns}
                  </div>

                  <div className="p-2 border rounded bg-green-50 text-green-900">
                    <strong>Correct Answer:</strong> {item.correctAns}
                  </div>

                  <div className="p-2 border rounded bg-blue-50 text-blue-900">
                    <strong>Feedback:</strong> {item.feedback}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </>
      )}

      <div className="mt-8">
        <Button onClick={() => router.replace("/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Feedback;
