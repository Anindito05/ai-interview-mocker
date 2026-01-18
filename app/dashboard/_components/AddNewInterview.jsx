"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, ArrowRight } from "lucide-react"; // Added ArrowRight
import { sendMessage } from "@/utils/GeminiAIModal";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState(null);

  const { user } = useUser();
  const router = useRouter();

  // ERROR MESSAGES & PROMPTS (Kept exactly the same as your code)
  const errorMessages = {
    "-1": "Job role does not appear to be a real-world role.",
    "-2": "Job description does not logically match the job role.",
    "-3": "Years of experience must be between 0 and 50.",
    0: "Job role, description, and experience are all invalid.",
    UNKNOWN: "Something went wrong. Please try again.",
  };

  const getValidationPrompt = () => `
    You are a validation engine.
    Return ONLY a single integer. No text. No explanation.
    Validation rules:
    - If job role is not a real-world job or is nonsensical → return -1
    - If job role, job description, AND years of experience are all invalid → return 0
    - If job description does not logically match the job role → return -2
    - If years of experience <= 0 OR > 50 → return -3
    - If all inputs are realistic and logically consistent → return 1
    Use common real-world knowledge.
    Input:
    Job Role: ${jobPosition}
    Job Description: ${jobDesc}
    Years of Experience: ${jobExperience}
  `;

  const getGenerationPrompt = () => `
    You are a JSON API. Return ONLY valid JSON.
    Return exactly this format:
    [
      { "Question": "string", "Answer": "string" },
      { "Question": "string", "Answer": "string" },
      { "Question": "string", "Answer": "string" },
      { "Question": "string", "Answer": "string" },
      { "Question": "string", "Answer": "string" }
    ]
    Job Role: ${jobPosition}
    Job Description: ${jobDesc}
    Years of Experience: ${jobExperience}
  `;

  /* SUBMIT HANDLER */
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorCode(null);

    try {
      /* STEP 1: VALIDATION */
      const validationResp = await sendMessage(getValidationPrompt());
      const validationCode = Number(validationResp.text.trim());

      if (validationCode !== 1) {
        setErrorCode(validationCode);
        return;
      }

      /* STEP 2: GENERATION */
      const generationResp = await sendMessage(getGenerationPrompt());
      const cleanedJSON = generationResp.text
        .replace(/^```json/, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();

      let parsedResp;
      try {
        parsedResp = JSON.parse(cleanedJSON);
        if (!Array.isArray(parsedResp)) throw new Error("Invalid JSON shape");
      } catch (err) {
        setErrorCode("UNKNOWN");
        return;
      }

      /* STEP 3: SAVE TO DB */
      const response = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonMockResp: parsedResp,
          jobPosition,
          jobDesc,
          jobExperience,
          createdBy: user?.primaryEmailAddress?.emailAddress,
        }),
      });

      if (!response.ok) throw new Error("API failed");
      const data = await response.json();

      if (data?.success && data?.data?.mockId) {
        setOpenDialog(false);
        router.push("/dashboard/interview/" + data.data.mockId);
      } else {
        throw new Error("Invalid API response");
      }
    } catch (err) {
      console.error(err);
      setErrorCode("UNKNOWN");
    } finally {
      setLoading(false);
    }
  };

  /* UI */
  return (
    <div>
      {/* NEW HERO BUTTON TRIGGER */}
      <div
        onClick={() => {
          setErrorCode(null);
          setOpenDialog(true);
        }}
        className="inline-block"
      >
        <Button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-6 text-lg rounded-full shadow-lg transition-all hover:scale-105">
          Try now for free
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-center text-xs text-gray-400 mt-2">
          No payment required
        </p>
      </div>

      <Dialog
        open={openDialog}
        onOpenChange={(isOpen) => {
          setOpenDialog(isOpen);
          if (!isOpen) {
            setErrorCode(null);
            setJobPosition("");
            setJobDesc("");
            setJobExperience("");
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interview
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div className="my-3">
                  <h2>
                    Add details about your job position, description, and years
                    of experience
                  </h2>

                  <div className="mt-7 my-3">
                    <label className="text-black">Job Role / Position</label>
                    <Input
                      className="mt-1"
                      placeholder="Ex. Operations Manager, Software Engineer"
                      required
                      onChange={(e) => setJobPosition(e.target.value)}
                    />
                  </div>

                  {errorCode && (
                    <div className="mb-3 rounded-md border border-red-400 bg-red-100 p-2 text-sm text-red-700">
                      {errorMessages[errorCode]}
                    </div>
                  )}

                  <div className="my-5">
                    <label className="text-black">
                      Job Description / Responsibilities
                    </label>
                    <Textarea
                      placeholder="Brief description of responsibilities or skills"
                      required
                      onChange={(e) => setJobDesc(e.target.value)}
                    />
                  </div>

                  <div className="my-5">
                    <label className="text-black">Years of Experience</label>
                    <Input
                      type="number"
                      min="1"
                      max="50"
                      placeholder="Ex. 5"
                      required
                      onChange={(e) => setJobExperience(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="flex gap-5 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin mr-2" />
                        Validating & Generating
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
