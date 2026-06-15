import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useGameStore } from '@/store/gameStore';
import { endings, getEndingById } from '@/data/endings';
import { Star, Lock, X, Trophy, EyeOff } from 'lucide-react';

const endingTypeNames: Record<string, string> = {
  good: '好结局',
  neutral: '普通结局',
  bad: '坏结局',
  hidden: '隐藏结局',
  true: '真结局'
};

const endingTypeColors: Record<string, string> = {
  good: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  neutral: 'text-gray-400 border-gray-500/30 bg-gray-500/10',
  bad: 'text-red-400 border-red-500/30 bg-red-500/10',
  hidden: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  true: 'text-amber-400 border-amber-500/30 bg-amber-500/10'
};

export default function EndingsGallery() {
  const { save, settings } = useGameStore();
  const [selectedEndingId, setSelectedEndingId] = useState<string | null>(null);

  const unlockedCount = save.unlockedEndings.length;
  const totalCount = endings.length;
  const progress = (unlockedCount / totalCount) * 100;

  return (
    <PageLayout title="结局馆">
      <div className="p-4">
        {settings.spoilerFree && (
          <div className="mb-4 p-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 flex items-center gap-2">
            <EyeOff size={16} className="text-cyan-400 flex-shrink-0" />
            <p className="text-xs text-cyan-400">无剧透模式已开启 - 未解锁结局信息已隐藏</p>
          </div>
        )}

        <div className="mb-6 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20">
              <Trophy size={24} className="text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">收集进度</p>
              <p className="text-xl font-bold">
                {unlockedCount} / {totalCount}
              </p>
            </div>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-purple-400 to-cyan-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {endings.map((ending) => {
            const isUnlocked = save.unlockedEndings.includes(ending.id);
            const showSpoiler = isUnlocked || !settings.spoilerFree;

            return (
              <button
                key={ending.id}
                onClick={() => isUnlocked && setSelectedEndingId(ending.id)}
                disabled={!isUnlocked}
                className={`relative aspect-[3/4] rounded-2xl border overflow-hidden transition-all ${
                  isUnlocked
                    ? 'border-white/15 hover:scale-[1.02] hover:border-white/25 active:scale-[0.98]'
                    : 'border-white/5 opacity-60 cursor-not-allowed'
                }`}
                style={{
                  background: isUnlocked
                    ? `linear-gradient(180deg, ${ending.type === 'true' ? 'rgba(212,168,75,0.3)' : ending.type === 'good' ? 'rgba(6,214,160,0.2)' : ending.type === 'hidden' ? 'rgba(199,125,255,0.2)' : 'rgba(100,100,100,0.2)'} 0%, rgba(10,22,40,0.9) 100%)`
                    : 'rgba(255,255,255,0.02)'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {isUnlocked ? (
                    <span className="text-6xl" style={{ animation: 'float 4s ease-in-out infinite' }}>
                      {ending.thumbnail}
                    </span>
                  ) : (
                    <Lock size={32} className="text-gray-700" />
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-start justify-between mb-1">
                    {showSpoiler ? (
                      <>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded ${endingTypeColors[ending.type]}`}
                        >
                          {endingTypeNames[ending.type]}
                        </span>
                        {ending.type === 'true' && (
                          <Star size={12} className="text-amber-400" fill="currentColor" />
                        )}
                      </>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-500/10 text-gray-500 border border-gray-500/20">
                        待解锁
                      </span>
                    )}
                  </div>
                  <h3
                    className={`text-sm font-semibold ${
                      isUnlocked ? 'text-white' : 'text-gray-600'
                    }`}
                    style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}
                  >
                    {isUnlocked ? ending.title : '???'}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedEndingId && (
        <EndingDetailModal
          endingId={selectedEndingId}
          onClose={() => setSelectedEndingId(null)}
          isUnlocked={save.unlockedEndings.includes(selectedEndingId)}
          spoilerFree={settings.spoilerFree}
        />
      )}
    </PageLayout>
  );
}

function EndingDetailModal({
  endingId,
  onClose,
  isUnlocked,
  spoilerFree
}: {
  endingId: string;
  onClose: () => void;
  isUnlocked: boolean;
  spoilerFree: boolean;
}) {
  const ending = getEndingById(endingId);
  if (!ending) return null;

  const showContent = isUnlocked || !spoilerFree;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div
        className="relative w-full max-w-[480px] rounded-3xl overflow-hidden bg-[#0a1628] border border-white/10"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-xl bg-black/50 backdrop-blur-xl text-gray-300 hover:text-white"
        >
          <X size={20} />
        </button>

        <div
            className="h-48 flex items-center justify-center relative overflow-hidden"
            style={{
              background: showContent
                ? `radial-gradient(circle at center, ${
                    ending.type === 'true'
                      ? 'rgba(212,168,75,0.4)'
                      : ending.type === 'good'
                      ? 'rgba(6,214,160,0.3)'
                      : ending.type === 'bad'
                      ? 'rgba(239,71,111,0.3)'
                      : ending.type === 'hidden'
                      ? 'rgba(199,125,255,0.3)'
                      : 'rgba(100,100,100,0.2)'
                  } 0%, rgba(10,22,40,0.8) 100%)`
                : 'rgba(255,255,255,0.02)'
            }}
          >
            {showContent ? (
              <span className="text-8xl" style={{ animation: 'float 4s ease-in-out infinite' }}>
                {ending.cgImage}
              </span>
            ) : (
              <Lock size={48} className="text-gray-700" />
            )}
          </div>

          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              {showContent ? (
                <>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${endingTypeColors[ending.type]}`}>
                    {endingTypeNames[ending.type]}
                  </span>
                  {ending.type === 'true' && (
                    <Star size={14} className="text-amber-400" fill="currentColor" />
                  )}
                </>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-500/10 text-gray-500 border border-gray-500/20">
                  待解锁
                </span>
              )}
            </div>

            <h2
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}
            >
              {showContent ? ending.title : '???'}
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              {showContent ? ending.description : '通关后解锁此结局的详细信息'}
            </p>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              {showContent ? (
                <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {ending.storyText}
                </p>
              ) : (
                <div className="text-center py-4">
                  <Lock size={24} className="mx-auto mb-2 text-gray-600" />
                  <p className="text-sm text-gray-600">结局内容尚未解锁</p>
                  <p className="text-xs text-gray-700 mt-1">继续游戏以解锁更多结局</p>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
}
