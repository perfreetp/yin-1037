import { useState, useEffect } from 'react';
import type { Choice, TimedChoice } from '@/types';
import { Star, AlertTriangle } from 'lucide-react';

interface ChoicePanelProps {
  choices: Choice[];
  timedChoice?: TimedChoice;
  onSelect: (choice: Choice) => void;
}

export const ChoicePanel = ({ choices, timedChoice, onSelect }: ChoicePanelProps) => {
  const [timeLeft, setTimeLeft] = useState(timedChoice?.timeLimit || 0);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!timedChoice) return;

    setTimeLeft(timedChoice.timeLimit);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(interval);
          const defaultChoice = choices.find((c) => c.id === timedChoice.defaultChoiceId);
          if (defaultChoice && !selected) {
            onSelect(defaultChoice);
          }
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [timedChoice, choices, onSelect, selected]);

  const handleSelect = (choice: Choice) => {
    if (selected) return;
    setSelected(choice.id);
    setTimeout(() => onSelect(choice), 200);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 px-3 pb-4">
      {timedChoice && (
        <div className="mb-3 mx-1">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-amber-400" />
            <span className="text-xs text-amber-400 font-medium">限时选择</span>
            <span className="text-xs text-gray-400 ml-auto">{timeLeft.toFixed(1)}s</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100 bg-gradient-to-r from-amber-400 to-red-500"
              style={{ width: `${(timeLeft / timedChoice.timeLimit) * 100}%` }}
            />
          </div>
        </div>
      )}
      <div className="space-y-2">
        {choices.map((choice, index) => (
          <button
            key={choice.id}
            onClick={() => handleSelect(choice)}
            disabled={!!selected}
            className={`w-full p-4 rounded-xl text-left transition-all duration-200 backdrop-blur-xl border ${
              selected === choice.id
                ? 'scale-[0.98] bg-amber-500/20 border-amber-400/50'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-[1.01] active:scale-[0.98]'
            } ${choice.isKeyChoice ? 'ring-2 ring-amber-400/30' : ''}`}
            style={{
              animation: `fadeInUp 0.3s ease-out ${index * 0.1}s both`
            }}
          >
            <div className="flex items-start gap-3">
              <span
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  choice.isKeyChoice
                    ? 'bg-amber-400/20 text-amber-400'
                    : 'bg-white/10 text-gray-400'
                }`}
              >
                {choice.isKeyChoice ? <Star size={12} fill="currentColor" /> : index + 1}
              </span>
              <span className="text-sm leading-relaxed flex-1 text-gray-100">
                {choice.text}
              </span>
              {choice.isKeyChoice && (
                <span className="text-[10px] text-amber-400 font-medium px-2 py-0.5 rounded-full bg-amber-400/10 whitespace-nowrap">
                  关键
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
