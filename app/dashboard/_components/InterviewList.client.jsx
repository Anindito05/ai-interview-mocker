"use client";
import React from "react";
import InterviewItemCard from "./InterviewItemCard";
import { Skeleton } from "@/components/ui/skeleton";

const InterviewListClient = ({ interviewList }) => {
  return (
    <div className="w-full">
      {interviewList?.length > 0 ? (
        // Changed to grid-cols-1 to stack them like rows as requested
        <div className="grid grid-cols-1 gap-4">
          {interviewList.map((interview, index) => (
            <InterviewItemCard key={index} interview={interview} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <Skeleton className="w-full h-24 rounded-lg" />
          <Skeleton className="w-full h-24 rounded-lg" />
        </div>
      )}
    </div>
  );
};

export default InterviewListClient;
