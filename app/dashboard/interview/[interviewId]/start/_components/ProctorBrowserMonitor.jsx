"use client";
import { useEffect, useRef } from "react";
import { useProctor } from "./ProctorContext";

export default function ProctorBrowserMonitor() {
  const { deduct } = useProctor();
  const timerRef = useRef(null);

  useEffect(() => {
    const checkFullscreen = () => {
      if (!document.fullscreenElement) {
        // Immediate deduction on exit
        deduct(2, "Exited fullscreen");

        // Start 10-second penalty if user doesn't restore
        if (!timerRef.current) {
          timerRef.current = setTimeout(() => {
            deduct(2, "Browser not in fullscreen for 10 seconds");
            timerRef.current = null;
          }, 50000);
        }
      } else {
        // Clear timer if fullscreen is restored
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }
    };

    const onVisibility = () => {
      if (document.hidden) deduct(2, "Tab switched");
    };

    const onBlur = () => deduct(2, "Window lost focus");

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    document.addEventListener("fullscreenchange", checkFullscreen);

    // Backup interval check
    const interval = setInterval(checkFullscreen, 1000);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("fullscreenchange", checkFullscreen);
      clearInterval(interval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [deduct]);

  return null;
}
