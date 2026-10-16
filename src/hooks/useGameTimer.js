"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function useGameTimer(initialSeconds = 45, onTimeUp) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const onTimeUpRef = useRef(onTimeUp);
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (!isRunning || secondsRemaining <= 0) return undefined;

    const intervalId = window.setInterval(() => {
      setSecondsRemaining((seconds) => {
        const nextSeconds = Math.max(seconds - 1, 0);
        if (nextSeconds === 0 && !hasExpiredRef.current) {
          hasExpiredRef.current = true;
          setIsRunning(false);
          onTimeUpRef.current?.();
        }
        return nextSeconds;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning, secondsRemaining]);

  const reset = useCallback((seconds = initialSeconds) => {
    hasExpiredRef.current = false;
    setSecondsRemaining(seconds);
    setIsRunning(true);
  }, [initialSeconds]);

  const start = useCallback(() => {
    if (secondsRemaining > 0) setIsRunning(true);
  }, [secondsRemaining]);

  const pause = useCallback(() => setIsRunning(false), []);

  return {
    secondsRemaining,
    isRunning,
    start,
    pause,
    reset,
  };
}
