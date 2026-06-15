import { useEffect, useState } from 'react';
import { useTypewriter } from '@/hooks/useTypewriter';
import { useGameStore } from '@/store/gameStore';
import { getCharacterById } from '@/data/characters';
import type { Dialogue, DialogueEmotion } from '@/types';
import { X } from 'lucide-react';

interface DialogueBoxProps {
  dialogue: Dialogue;
  onNext: () => void;
  hasNext: boolean;
}

const emotionColorMap: Record<DialogueEmotion, string> = {
  neutral: 'text-white',
  happy: 'text-amber-300',
  sad: 'text-blue-300',
  angry: 'text-red-400',
  surprised: 'text-cyan-300',
  mysterious: 'text-purple-300'
};

export const DialogueBox = ({ dialogue, onNext, hasNext }: DialogueBoxProps) => {
  const { settings } = useGameStore();
  const [shake, setShake] = useState(false);
  const [glitch, setGlitch] = useState(false);

  const { displayedText, isComplete, skip } = useTypewriter(
    dialogue.text,
    settings.textSpeed
  );

  const speaker = dialogue.speakerId
    ? getCharacterById(dialogue.speakerId)
    : null;
  const speakerName = dialogue.speakerName || speaker?.name || '';

  useEffect(() => {
    if (dialogue.textEffect === 'shake') {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
    if (dialogue.textEffect === 'glitch') {
      setGlitch(true);
      const timer = setTimeout(() => setGlitch(false), 300);
      return () => clearTimeout(timer);
    }
  }, [dialogue.id, dialogue.textEffect]);

  const handleClick = () => {
    if (!isComplete) {
      skip();
    } else if (hasNext) {
      onNext();
    }
  };

  return (
    <div
      onClick={handleClick}
      className="absolute bottom-0 left-0 right-0 cursor-pointer select-none"
    >
      <div
        className={`mx-3 mb-4 p-5 rounded-2xl backdrop-blur-xl border border-white/15 transition-all duration-300 ${
          shake ? 'animate-pulse' : ''
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(91, 75, 138, 0.4) 0%, rgba(10, 22, 40, 0.9) 100%)'
        }}
      >
        {speakerName && (
          <div
            className={`text-sm font-semibold mb-2 tracking-wider ${
              emotionColorMap[dialogue.emotion || 'neutral']
            }`}
            style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}
          >
            {speaker?.avatar && (
              <span className="mr-2">{speaker.avatar}</span>
            )}
            {speakerName}
          </div>
        )}
        <p
          className={`text-base leading-relaxed tracking-wide ${
            glitch ? 'text-cyan-400' : 'text-gray-100'
          }`}
          style={{
            textShadow: glitch ? '2px 0 #ff00ff, -2px 0 #00ffff' : 'none',
            minHeight: '4.5rem'
          }}
        >
          {displayedText}
          {isComplete && hasNext && (
            <span className="inline-block ml-1 text-amber-400 animate-pulse">▸</span>
          )}
        </p>
        {!isComplete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              skip();
            }}
            className="absolute top-2 right-2 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
