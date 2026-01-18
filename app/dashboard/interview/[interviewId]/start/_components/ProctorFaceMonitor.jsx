"use client";

import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { useProctor } from "./ProctorContext";

/* ================= CONFIG ================= */

// ~40° head turn
const YAW_THRESHOLD = 20;
const PITCH_THRESHOLD = 18;

// detection tuning
const DETECTION_INTERVAL = 80; // ms (~12 fps)
const SMOOTHING_WINDOW = 7;

// violation logic
const SUSTAINED_FRAMES = 25; // ~2 seconds
const FACE_LOST_GRACE = 15; // ignore brief loss

/* ========================================== */

export default function ProctorFaceMonitor() {
  const webcamRef = useRef(null);

  const sustainedCounter = useRef(0);
  const faceLostCounter = useRef(0);
  const lastRunTime = useRef(0);

  const yawHistory = useRef([]);
  const pitchHistory = useRef([]);

  const { deduct } = useProctor();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!webcamRef.current) return;

    let faceMesh;
    let camera;
    let active = true;

    const init = async () => {
      const { FaceMesh } = await import("@mediapipe/face_mesh");
      const { Camera } = await import("@mediapipe/camera_utils");

      faceMesh = new FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });

      faceMesh.onResults((results) => {
        if (!active) return;

        const now = Date.now();
        if (now - lastRunTime.current < DETECTION_INTERVAL) return;
        lastRunTime.current = now;

        let violation = false;

        /* ---------- FACE NOT FOUND ---------- */
        if (!results.multiFaceLandmarks?.length) {
          faceLostCounter.current++;

          if (faceLostCounter.current > FACE_LOST_GRACE) {
            violation = true;
          }
        } else {
          faceLostCounter.current = 0;

          const lm = results.multiFaceLandmarks[0];

          const yaw = (lm[263].x - lm[33].x) * 100;
          const pitch = (lm[199].y - lm[1].y) * 100;

          yawHistory.current.push(yaw);
          pitchHistory.current.push(pitch);

          if (yawHistory.current.length > SMOOTHING_WINDOW) {
            yawHistory.current.shift();
            pitchHistory.current.shift();
          }

          const avgYaw =
            yawHistory.current.reduce((a, b) => a + b, 0) /
            yawHistory.current.length;

          const avgPitch =
            pitchHistory.current.reduce((a, b) => a + b, 0) /
            pitchHistory.current.length;

          if (
            Math.abs(avgYaw) > YAW_THRESHOLD ||
            Math.abs(avgPitch) > PITCH_THRESHOLD
          ) {
            violation = true;
          }
        }

        /* ---------- SUSTAINED VIOLATION ---------- */
        sustainedCounter.current = violation ? sustainedCounter.current + 1 : 0;

        if (sustainedCounter.current === SUSTAINED_FRAMES) {
          deduct(2, "Excessive head movement detected");
          sustainedCounter.current = 0;
        }
      });

      camera = new Camera(webcamRef.current.video, {
        onFrame: async () => {
          if (webcamRef.current?.video?.readyState === 4) {
            await faceMesh.send({ image: webcamRef.current.video });
          }
        },
        width: 640,
        height: 480,
      });

      camera.start();
    };

    init();

    return () => {
      active = false;
      camera?.stop();
      faceMesh?.close();
    };
  }, [deduct]);

  return (
    <div className="hidden">
      <Webcam
        ref={webcamRef}
        mirrored
        videoConstraints={{ facingMode: "user" }}
      />
    </div>
  );
}
