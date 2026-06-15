import { PageLayout } from '@/components/layout/PageLayout';
import { useGameStore } from '@/store/gameStore';
import { useNavigate } from 'react-router-dom';
import { chapters } from '@/data/chapters';
import { Lock, Check, ChevronRight } from 'lucide-react';

export default function Chapters() {
  const navigate = useNavigate();
  const { save } = useGameStore();

  return (
    <PageLayout title="主线章节">
      <div className="p-4 space-y-4">
        {chapters.map((chapter, index) => {
          const progress = save.chapterProgress[chapter.id];
          const isUnlocked = progress?.unlocked || chapter.unlockedByDefault;
          const isCompleted = progress?.completed;

          return (
            <button
              key={chapter.id}
              onClick={() => {
                if (isUnlocked) {
                  navigate(`/chapters/${chapter.id}`);
                }
              }}
              disabled={!isUnlocked}
              className={`w-full relative overflow-hidden rounded-2xl border transition-all duration-300 text-left ${
                isUnlocked
                  ? 'border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98]'
                  : 'border-white/5 bg-white/[0.02] opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="absolute top-0 left-0 w-1 h-full" style={{
                background: isCompleted
                  ? 'linear-gradient(180deg, #d4a84b 0%, #5b4b8a 100%)'
                  : isUnlocked
                  ? 'linear-gradient(180deg, #4cc9f0 0%, #5b4b8a 100%)'
                  : '#333'
              }} />
              <div className="flex items-center p-4 pl-5 gap-4">
                <div className="text-4xl" style={{ filter: isUnlocked ? 'none' : 'grayscale(1)' }}>
                  {chapter.coverImage}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500 font-mono">
                      CH.{String(index + 1).padStart(2, '0')}
                    </span>
                    {isCompleted && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-400 px-2 py-0.5 rounded-full bg-amber-400/10">
                        <Check size={10} fill="currentColor" />
                        已通关
                      </span>
                    )}
                    {!isUnlocked && (
                      <span className="flex items-center gap-1 text-[10px] text-gray-500 px-2 py-0.5 rounded-full bg-white/5">
                        <Lock size={10} />
                        未解锁
                      </span>
                    )}
                  </div>
                  <h3
                    className={`font-semibold text-base mb-1 ${
                      isUnlocked ? 'text-white' : 'text-gray-500'
                    }`}
                    style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}
                  >
                    {chapter.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {chapter.subtitle}
                  </p>
                </div>
                {isUnlocked && (
                  <ChevronRight size={20} className="text-gray-500" />
                )}
              </div>
            </button>
          );
        })}

        <div className="p-4 rounded-2xl border border-dashed border-white/10 text-center">
          <p className="text-sm text-gray-500">更多章节开发中...</p>
          <p className="text-xs text-gray-600 mt-1">敬请期待后续更新</p>
        </div>
      </div>
    </PageLayout>
  );
}
