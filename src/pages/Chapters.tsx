import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useGameStore } from '@/store/gameStore';
import { useNavigate } from 'react-router-dom';
import { chapters } from '@/data/chapters';
import { Lock, Check, ChevronRight, RotateCcw, Play, X } from 'lucide-react';

export default function Chapters() {
  const navigate = useNavigate();
  const { save, startReplay, setCurrentScene } = useGameStore();
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  const handleChapterClick = (chapterId: string, isCompleted: boolean) => {
    const progress = save.chapterProgress[chapterId];
    const chapter = chapters.find((c) => c.id === chapterId);
    if (!chapter) return;

    if (isCompleted) {
      setSelectedChapter(chapterId);
    } else {
      const sceneId =
        progress?.currentSceneId || chapter.scenes[0]?.id || '';
      setCurrentScene(chapterId, sceneId);
      navigate(`/chapters/${chapterId}`);
    }
  };

  const handleContinue = (chapterId: string) => {
    const chapter = chapters.find((c) => c.id === chapterId);
    if (!chapter) return;
    const progress = save.chapterProgress[chapterId];
    const sceneId =
      progress?.currentSceneId || chapter.scenes[0]?.id || '';
    setCurrentScene(chapterId, sceneId);
    setSelectedChapter(null);
    navigate(`/chapters/${chapterId}`);
  };

  const handleReplay = (chapterId: string) => {
    startReplay(chapterId);
    setSelectedChapter(null);
    navigate(`/chapters/${chapterId}`);
  };

  return (
    <PageLayout title="主线章节">
      <div className="p-4 space-y-4">
        {chapters.map((chapter, index) => {
          const progress = save.chapterProgress[chapter.id];
          const isUnlocked = progress?.unlocked || chapter.unlockedByDefault;
          const isCompleted = progress?.completed;
          const visitedCount = progress?.visitedScenes?.length || 0;
          const totalScenes = chapter.scenes.length;
          const progressPercent = Math.min(100, (visitedCount / totalScenes) * 100);

          return (
            <button
              key={chapter.id}
              onClick={() => isUnlocked && handleChapterClick(chapter.id, !!isCompleted)}
              disabled={!isUnlocked}
              className={`w-full relative overflow-hidden rounded-2xl border transition-all duration-300 text-left ${
                isUnlocked
                  ? 'border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25 active:scale-[0.98]'
                  : 'border-white/5 bg-white/[0.02] opacity-60 cursor-not-allowed'
              }`}
            >
              <div
                className="absolute top-0 left-0 w-1 h-full"
                style={{
                  background: isCompleted
                    ? 'linear-gradient(180deg, #d4a84b 0%, #5b4b8a 100%)'
                    : isUnlocked
                    ? 'linear-gradient(180deg, #4cc9f0 0%, #5b4b8a 100%)'
                    : '#333'
                }}
              />
              <div className="flex items-center p-4 pl-5 gap-4">
                <div
                  className="text-4xl"
                  style={{ filter: isUnlocked ? 'none' : 'grayscale(1)' }}
                >
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
                    {isUnlocked && !isCompleted && visitedCount > 0 && (
                      <span className="text-[10px] text-cyan-400">
                        {Math.round(progressPercent)}%
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
                  {isUnlocked && !isCompleted && visitedCount > 0 && (
                    <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}
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

      {selectedChapter && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={() => setSelectedChapter(null)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-[480px] rounded-t-3xl overflow-hidden bg-[#0a1628] border-t border-white/10 p-6"
            style={{ animation: 'slideUp 0.3s ease-out' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}>
                {chapters.find((c) => c.id === selectedChapter)?.title}
              </h3>
              <button
                onClick={() => setSelectedChapter(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              本章已通关，请选择操作：
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleContinue(selectedChapter)}
                className="w-full py-4 px-6 rounded-xl font-medium text-base transition-all hover:scale-[1.01] active:scale-[0.99] text-white flex items-center justify-center gap-3"
                style={{
                  background: 'linear-gradient(135deg, #5b4b8a 0%, #d4a84b 100%)'
                }}
              >
                <Play size={20} />
                从上次进度继续
              </button>
              <button
                onClick={() => handleReplay(selectedChapter)}
                className="w-full py-4 px-6 rounded-xl font-medium text-base transition-all hover:scale-[1.01] active:scale-[0.99] border border-white/15 bg-white/5 text-white flex items-center justify-center gap-3 hover:bg-white/10"
              >
                <RotateCcw size={20} />
                从头开始回放
                <span className="text-[10px] text-gray-400">(不影响存档)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
