import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

export const useBackgroundMusic = () => {
  const { settings, bgmPlaying } = useGameStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      try {
        const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
        const audioCtx = new AudioContext();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(220, audioCtx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(330, audioCtx.currentTime + 2);
        oscillator.frequency.linearRampToValueAtTime(277, audioCtx.currentTime + 4);
        oscillator.frequency.linearRampToValueAtTime(330, audioCtx.currentTime + 6);
        oscillator.frequency.linearRampToValueAtTime(220, audioCtx.currentTime + 8);

        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.03, audioCtx.currentTime + 1);

        oscillator.start();

        const interval = setInterval(() => {
          const now = audioCtx.currentTime;
          oscillator.frequency.setValueAtTime(220, now);
          oscillator.frequency.linearRampToValueAtTime(330, now + 2);
          oscillator.frequency.linearRampToValueAtTime(277, now + 4);
          oscillator.frequency.linearRampToValueAtTime(330, now + 6);
          oscillator.frequency.linearRampToValueAtTime(220, now + 8);
        }, 8000);

        audioRef.current = {
          play: () => {
            gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
            gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.03, audioCtx.currentTime + 0.5);
          },
          pause: () => {
            gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
            gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);
          }
        } as unknown as HTMLAudioElement;

        return () => {
          clearInterval(interval);
          oscillator.stop();
          audioCtx.close();
        };
      } catch (e) {
        console.log('Audio not supported');
      }
    }

    return () => {};
  }, []);

  useEffect(() => {
    if (audioRef.current && 'play' in audioRef.current) {
      if (settings.bgmEnabled && bgmPlaying) {
        try {
          (audioRef.current as { play: () => void }).play();
        } catch (e) {
          console.log('Auto-play blocked');
        }
      } else {
        try {
          (audioRef.current as { pause: () => void }).pause();
        } catch (e) {
          // ignore
        }
      }
    }
  }, [settings.bgmEnabled, bgmPlaying]);

  const toggle = () => {
    useGameStore.getState().toggleBgm();
  };

  return { toggle, isPlaying: settings.bgmEnabled && bgmPlaying };
};
