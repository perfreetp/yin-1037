import { useGameStore } from '@/store/gameStore';
import { X, AlertTriangle } from 'lucide-react';

export const RandomEventModal = () => {
  const { currentEvent, handleEventChoice, closeEvent } = useGameStore();

  if (!currentEvent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-[480px] rounded-3xl overflow-hidden border border-white/10"
        style={{
          background: 'linear-gradient(180deg, rgba(91, 75, 138, 0.4) 0%, rgba(10, 22, 40, 0.95) 100%)',
          animation: 'fadeIn 0.3s ease-out'
        }}
      >
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={closeEvent}
            className="p-1.5 rounded-lg bg-black/30 text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-amber-500/20">
              <AlertTriangle size={24} className="text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-amber-400 font-medium mb-0.5">随机事件</p>
              <h3
                className="text-xl font-bold"
                style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}
              >
                {currentEvent.title}
              </h3>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-200 leading-relaxed">
              {currentEvent.description}
            </p>
          </div>

          <div className="space-y-2">
            {currentEvent.choices.map((choice, idx) => (
              <button
                key={choice.id}
                onClick={() => handleEventChoice(choice.id)}
                className="w-full p-4 rounded-xl text-left transition-all border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
                style={{ animation: `fadeInUp 0.3s ease-out ${idx * 0.1}s both` }}
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-white/10 text-gray-400">
                    {idx + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-gray-100">
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
      </div>
    </div>
  );
};
