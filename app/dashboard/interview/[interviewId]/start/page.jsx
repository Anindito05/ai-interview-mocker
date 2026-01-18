"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import QuestionSection from "./_components/QuestionSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

export default function StartInterview() {
  const { interviewId } = useParams();
  const [interviewData, setInterviewData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/interview/${interviewId}`)
      .then((res) => res.json())
      .then((data) => {
        setInterviewData(data);
        const parsedQuestions =
          typeof data.jsonMockResp === "string"
            ? JSON.parse(data.jsonMockResp)
            : data.jsonMockResp;
        setQuestions(parsedQuestions);
      });
  }, [interviewId]);

  const onAnswerChange = (qIdx, val) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: val }));
  };

  const endInterview = async () => {
    setLoading(true);
    try {
      for (let i = 0; i < questions.length; i++) {
        await fetch("/api/interview/answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mockId: interviewData.mockId,
            question: questions[i].Question || questions[i].question,
            correctAns: questions[i].Answer || questions[i].answer,
            userAnswer: answers[i] || "",
            userEmail: interviewData.createdBy, // Matches MockInterview schema
          }),
        });
      }
      window.location.href = `/dashboard/interview/${interviewId}/feedback`;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!interviewData) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <QuestionSection
          mockInterviewQuestion={questions}
          activeQuestionIndex={index}
        />
        <RecordAnswerSection
          activeQuestionIndex={index}
          savedAnswer={answers[index] || ""}
          onAnswerChange={onAnswerChange}
        />
      </div>

      <div className="flex justify-between mt-10">
        <Button disabled={index === 0} onClick={() => setIndex(index - 1)}>
          Previous
        </Button>
        {index < questions.length - 1 ? (
          <Button onClick={() => setIndex(index + 1)}>Next</Button>
        ) : (
          <Button
            variant="destructive"
            onClick={endInterview}
            disabled={loading}
          >
            {loading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "End Interview"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
