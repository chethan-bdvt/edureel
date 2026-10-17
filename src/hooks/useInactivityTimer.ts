import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Monitors user interaction across the screen.
 * If zero screen touches, clicks, or scrolling occur for 60 seconds (1 minute),
 * triggers an auto-pause state to prevent wasted streaming bandwidth and power.
 */
export function useInactivityTimer(timeoutMs = 60000) {
  const [isIdle, setIsIdle] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsIdle(false);
    timerRef.current = setTimeout(() => {
      setIsIdle(true);
    }, timeoutMs);
  }, [timeoutMs]);

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'touchstart', 'touchmove', 'keydown', 'scroll'];

    const handleActivity = () => {
      // If user is currently marked idle, activity resumes it
      resetTimer();
    };

    events.forEach((ev) => window.addEventListener(ev, handleActivity, { passive: true }));
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((ev) => window.removeEventListener(ev, handleActivity));
    };
  }, [resetTimer]);

  const resume = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  return { isIdle, resume };
}
