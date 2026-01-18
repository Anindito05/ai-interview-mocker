import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const InterviewItemCard = ({ interview }) => {
  const router = useRouter();

  const onStart = () =>
    router.push("/dashboard/interview/" + interview?.mockId);
  const onFeedback = () =>
    router.push("/dashboard/interview/" + interview?.mockId + "/feedback");

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-bold text-lg text-blue-700 capitalize">
            {interview?.jobPosition}
          </h2>
          <p className="text-sm text-gray-500">
            {interview?.jobExperience} Years of experience
          </p>
        </div>
        <span className="text-[10px] text-gray-400 font-medium">
          {new Date(interview.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="flex gap-3 mt-4">
        <Button
          onClick={onFeedback}
          variant="outline"
          className="w-1/2 text-xs h-9"
        >
          Feedback
        </Button>
        <Button
          onClick={onStart}
          className="w-4/10 text-xs h-9 bg-blue-600 hover:bg-blue-700"
        >
          Start
        </Button>
      </div>
    </div>
  );
};

export default InterviewItemCard;
