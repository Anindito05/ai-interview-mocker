"use client";
import React, { createContext, useContext, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ProctorContext = createContext();

export const ProctorProvider = ({ interviewId, children }) => {
  const router = useRouter();

  // total warnings
  const [warnings, setWarnings] = useState(10);

  // prevent double auto-submit
  const autoSubmittedRef = useRef(false);

  // cooldown tracking per violation type
  const lastViolationRef = useRef({});

  /**
   * Deduct warning points safely
   */
  const deduct = (points, reason) => {
    const now = Date.now();

    // ⏱ cooldown per reason (3 seconds)
    const COOLDOWN_MS = 3000;
    const lastTime = lastViolationRef.current[reason] || 0;

    if (now - lastTime < COOLDOWN_MS) {
      return; // ignore spam
    }

    lastViolationRef.current[reason] = now;

    setWarnings((prev) => {
      if (prev <= 0) return prev;

      const next = Math.max(prev - points, 0);

      const time = new Date().toLocaleTimeString();
      console.log(
        `[Violation] ${time} | ${reason} | -${points} | Remaining: ${next}`,
      );

      toast.warning(`⚠ ${reason} (-${points}) | Remaining: ${next}`);

      if (next === 0 && !autoSubmittedRef.current) {
        autoSubmittedRef.current = true;
        autoSubmit();
      }

      return next;
    });
  };

  /**
   * Auto submit interview
   */
  const autoSubmit = () => {
    console.warn("🚨 Auto-submitting interview due to violations");
    toast.error("Interview auto-submitted due to violations");

    if (document.fullscreenElement) {
      document.exitFullscreen();
    }

    router.replace(`/dashboard/interview/${interviewId}/feedback`);
  };

  return (
    <ProctorContext.Provider value={{ warnings, deduct }}>
      {children}
    </ProctorContext.Provider>
  );
};

export const useProctor = () => {
  const ctx = useContext(ProctorContext);
  if (!ctx) throw new Error("useProctor must be inside ProctorProvider");
  return ctx;
};
