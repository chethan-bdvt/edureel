import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeechSynthesis() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [progress, setProgress] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPlaying(false);
    setProgress(0);
  }, []);

  const speak = useCallback(
    (text: string, rate = 1.0) => {
      if (!isSupported) {
        // Simulated playback fallback if Web Speech is blocked in sandbox
        setIsPlaying(true);
        let current = 0;
        const durationMs = Math.max(text.length * 50, 4000);
        const step = 100;
        intervalRef.current = setInterval(() => {
          current += step;
          const p = Math.min(100, Math.round((current / durationMs) * 100));
          setProgress(p);
          if (p >= 100) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsPlaying(false);
          }
        }, step);
        return;
      }

      window.speechSynthesis.cancel();
      if (intervalRef.current) clearInterval(intervalRef.current);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = 1.1; // Slightly cheerful, kid-friendly pitch

      // Pick a friendly english voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))) ||
        voices.find((v) => v.lang.startsWith('en'));
      if (preferred) {
        utterance.voice = preferred;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        let start = Date.now();
        const estDuration = Math.max(text.length * 60, 3000);
        intervalRef.current = setInterval(() => {
          const elapsed = Date.now() - start;
          const pct = Math.min(99, Math.round((elapsed / estDuration) * 100));
          setProgress(pct);
        }, 200);
      };

      utterance.onend = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsPlaying(false);
        setProgress(100);
      };

      utterance.onerror = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsPlaying(false);
        setProgress(0);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported]
  );

  const toggle = useCallback(
    (text: string) => {
      if (isPlaying) {
        stop();
      } else {
        speak(text);
      }
    },
    [isPlaying, speak, stop]
  );

  return { isPlaying, progress, speak, stop, toggle, isSupported };
}
