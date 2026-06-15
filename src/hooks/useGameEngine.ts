import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

export const useTimedChoice = (
  timeLimit: number,
  onTimeout: () => void,
  enabled: boolean
) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsActive(false);
      setTimeLeft(timeLimit);
      return;
    }

    setIsActive(true);
    setTimeLeft(timeLimit);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(interval);
          setIsActive(false);
          onTimeout();
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [enabled, timeLimit, onTimeout]);

  const stop = () => {
    setIsActive(false);
  };

  return { timeLeft, isActive, progress: (timeLeft / timeLimit) * 100, stop };
};

export const useAutoSave = () => {
  const { autoSaveGame, settings } = useGameStore();

  useEffect(() => {
    if (!settings.autoSave) return;

    const interval = setInterval(() => {
      autoSaveGame();
    }, 60000);

    return () => clearInterval(interval);
  }, [settings.autoSave, autoSaveGame]);
};
