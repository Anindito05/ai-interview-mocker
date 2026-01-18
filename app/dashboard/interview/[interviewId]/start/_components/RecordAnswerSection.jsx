"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Mic, MicOff, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

const RecordAnswerSection = ({
  activeQuestionIndex,
  savedAnswer,
  onAnswerChange,
}) => {
  // Local state for the current question's text
  const [userAnswer, setUserAnswer] = useState(savedAnswer || "");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // RESET LOGIC: This fixes the "shared text" bug
  useEffect(() => {
    // When the question index changes, load the saved answer for that specific question
    setUserAnswer(savedAnswer || "");
    // Stop any UI recording state if the user clicks next while recording
    setIsRecording(false);
  }, [activeQuestionIndex, savedAnswer]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        await sendForTranscription(audioBlob);
        setIsRecording(false);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast("Recording started... Speak now.");
    } catch (err) {
      console.error(err);
      toast("Microphone access denied. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const sendForTranscription = async (audioBlob) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("audio", audioBlob);

    try {
      const res = await fetch("/api/ai/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Transcription request failed");

      const data = await res.json();
      const textResult = data.text || "";

      // Update local state and parent state
      setUserAnswer(textResult);
      onAnswerChange(activeQuestionIndex, textResult);

      toast("Voice transcribed successfully!");
    } catch (error) {
      console.error(error);
      toast("Failed to transcribe audio. You can type your answer instead.");
    } finally {
      setLoading(false);
    }
  };

  // Manual editing handler
  const handleTextChange = (e) => {
    const newValue = e.target.value;
    setUserAnswer(newValue);
    onAnswerChange(activeQuestionIndex, newValue);
  };

  return (
    <div className="flex flex-col items-center gap-5 border p-5 rounded-xl bg-slate-50 shadow-sm">
      {/* Webcam Container */}
      <div className="bg-black p-4 rounded-xl flex justify-center w-full max-w-md shadow-inner">
        <Webcam mirrored width={400} height={300} />
      </div>

      {/* Control Button */}
      <Button
        variant={isRecording ? "destructive" : "outline"}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={loading}
        className="flex items-center gap-2 h-12 px-6 rounded-full transition-all"
      >
        {loading ? (
          <LoaderCircle className="animate-spin" />
        ) : isRecording ? (
          "Stop Recording"
        ) : (
          "Record Answer"
        )}
        {isRecording ? (
          <MicOff className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </Button>

      {/* Answer Area */}
      <div className="flex flex-col gap-2 w-full max-w-md">
        <div className="flex justify-between items-center">
          <label className="text-sm font-bold text-slate-600">
            Answer for Question #{activeQuestionIndex + 1}
          </label>
          {loading && (
            <span className="text-xs text-blue-500 animate-pulse font-medium">
              AI Transcribing...
            </span>
          )}
        </div>

        <textarea
          className="border border-slate-300 rounded-xl p-4 w-full h-40 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-800 bg-white"
          placeholder="Your transcribed text will appear here. You can also type or edit your answer directly..."
          value={userAnswer}
          onChange={handleTextChange}
        />
        <p className="text-[10px] text-slate-400 italic">
          *You can record your voice or type your answer manually. Use Prev/Next
          to save your progress.
        </p>
      </div>
    </div>
  );
};

export default RecordAnswerSection;
