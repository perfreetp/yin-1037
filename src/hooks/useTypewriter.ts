import { useState, useEffect, useRef } from 'react';

export const useTypewriter = (
  text: string,
  speed: number = 3
): {
  displayedText: string;
  isComplete: boolean;
  skip: () => void;
  reset: () => void;
} => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  const intervalMs = Math.max(10, 120 - speed * 20);

  const skip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    indexRef.current = text.length;
    setDisplayedText(text);
    setIsComplete(true);
  };

  const reset = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    indexRef.current = 0;
    setDisplayedText('');
    setIsComplete(false);
  };

  useEffect(() => {
    reset();

    if (!text) {
      setIsComplete(true);
      return;
    }

    const type = () => {
      if (indexRef.current < text.length) {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
        timeoutRef.current = window.setTimeout(type, intervalMs);
      } else {
        setIsComplete(true);
      }
    };

    timeoutRef.current = window.setTimeout(type, intervalMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, intervalMs]);

  return { displayedText, isComplete, skip, reset };
};
