"use client";

import React, { useEffect, useState, useContext, use } from "react";
import { Lightbulb, WebcamIcon, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam";
import Link from "next/link";
import { WebCamContext } from "@/app/dashboard/layout";

const StatusItem = ({ label, ok }) => (
  <div className="flex justify-between items-center text-sm">
    <span>{label}</span>
    <span className={ok ? "text-green-600" : "text-red-500"}>
      {ok ? "✔ Ready" : "✖ Required"}
    </span>
  </div>
);

const Interview = ({ params }) => {
  const { interviewId } = use(params);

  const { webCamEnabled, setWebCamEnabled } = useContext(WebCamContext);

  const [interviewData, setInterviewData] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const canStartInterview = webCamEnabled && cameraReady && isFullscreen;

  // Detect mobile
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Fetch interview data
  useEffect(() => {
    if (!interviewId) return;

    fetch(`/api/interview/${interviewId}`)
      .then((res) => res.json())
      .then((data) => setInterviewData(data));
  }, [interviewId]);

  // Fullscreen listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);

      // Enforce rules
      if (!fs) {
        setWebCamEnabled(false);
        setCameraReady(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [setWebCamEnabled]);

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  //  Mobile Block
  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center gap-4 px-4">
        <h2 className="text-2xl font-semibold">Desktop Required</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          This interview uses camera monitoring and fullscreen enforcement.
          Please use a desktop or laptop device.
        </p>
      </div>
    );
  }

  if (!interviewData) return <div>Loading...</div>;

  return (
    <div className="my-10 space-y-6">
      <h2 className="font-bold text-3xl text-center">Interview Setup</h2>

      {/* Warning Banner */}
      <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded text-sm flex gap-2 items-center">
        <ShieldCheck />
        This interview is monitored. Exiting fullscreen or disabling the camera
        will block the session.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT */}
        <div className="space-y-5">
          <div className="p-5 rounded-lg border space-y-3">
            <h2 className="text-lg">
              <strong>Job Role:</strong> {interviewData.jobPosition}
            </h2>
            <h2 className="text-lg">
              <strong>Tech Stack:</strong> {interviewData.jobDesc}
            </h2>
            <h2 className="text-lg">
              <strong>Experience:</strong> {interviewData.jobExperience} years
            </h2>
          </div>

          <div className="p-5 border rounded-lg bg-yellow-100 border-yellow-300">
            <h2 className="flex gap-2 items-center text-yellow-700 font-semibold">
              <Lightbulb />
              Information
            </h2>
            <p className="mt-2 text-yellow-700 text-sm">
              {process.env.NEXT_PUBLIC_INFORMATION}
            </p>
          </div>

          {/* Readiness Checklist */}
          <div className="border rounded-lg p-4 bg-secondary space-y-2">
            <h3 className="font-semibold text-sm">Interview Readiness</h3>
            <StatusItem
              label="Camera Enabled"
              ok={webCamEnabled && cameraReady}
            />
            <StatusItem label="Fullscreen Mode" ok={isFullscreen} />
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <div className="flex items-center justify-center p-6">
            {webCamEnabled ? (
              <div className="relative border-4 border-black rounded-xl overflow-hidden shadow-lg">
                <Webcam
                  onUserMedia={() => {
                    setWebCamEnabled(true);
                    setCameraReady(true);
                  }}
                  onUserMediaError={() => {
                    setWebCamEnabled(false);
                    setCameraReady(false);
                  }}
                  height={250}
                  width={250}
                  mirrored
                />
                <span className="absolute top-2 left-2 bg-black text-white text-xs px-2 py-1 rounded">
                  LIVE
                </span>
              </div>
            ) : (
              <WebcamIcon className="h-60 w-full p-16 bg-secondary rounded-lg border" />
            )}
          </div>

          <Button
            className="w-full"
            onClick={() => setWebCamEnabled(true)}
            disabled={webCamEnabled && !cameraReady}
          >
            {webCamEnabled ? "Camera Active" : "Enable Camera"}
          </Button>

          {!isFullscreen && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={enterFullscreen}
            >
              Enter Secure Fullscreen Mode
            </Button>
          )}

          {canStartInterview ? (
            <Link href={`/dashboard/interview/${interviewId}/start`}>
              <Button className="w-full text-lg">Start Interview</Button>
            </Link>
          ) : (
            <Button disabled className="w-full cursor-not-allowed">
              Start Interview
            </Button>
          )}

          {canStartInterview && (
            <div className="text-green-700 text-sm flex items-center gap-2 justify-center">
              🔒 Secure Interview Mode Enabled
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interview;
