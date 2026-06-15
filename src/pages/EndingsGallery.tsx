import { useState, useMemo } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useGameStore } from '@/store/gameStore';
import { endings, getEndingById } from '@/data/endings';
import { chapters } from '@/data/chapters';
import { checkCondition } from '@/utils/conditions';
import { Star, Lock, X, Trophy, EyeOff, Map, Target, Sparkles, ChevronRight } from 'lucide-react';
import type { Ending } from '@/types';

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

interface EndingProgress {
  ending: Ending;
  isUnlocked: boolean;
  completionPercent: number;
  metConditions: number;
  totalConditions: number;
  isNearComplete: boolean;
}

const tabs = [
  { key: 'gallery', label: '结局收藏', icon: Trophy },
  { key: 'hints', label: '路线提示', icon: Map }
] as const;

export default function EndingsGallery() {
  const { save, settings } = useGameStore();
  const [activeTab, setActiveTab] = useState<'gallery' | 'hints'>('gallery');
  const [selectedEndingId, setSelectedEndingId] = useState<string | null>(null);

  const unlockedCount = save.unlockedEndings.length;
  const totalCount = endings.length;
  const progress = (unlockedCount / totalCount) * 100;

  const endingsProgress = useMemo((): EndingProgress[] => {
    return endings.map((ending) => {
      const isUnlocked = save.unlockedEndings.includes(ending.id);
      const totalConditions = ending.unlockConditions.length;
      const metConditions = ending.unlockConditions.filter(cond =>
        checkCondition(cond, save)
      ).length;
      const completionPercent = Math.round((metConditions / totalConditions) * 100);
      const isNearComplete = !isUnlocked && completionPercent >= 50;

      return {
        ending,
        isUnlocked,
        completionPercent,
        metConditions,
        totalConditions,
        isNearComplete
      };
    });
  }, [save]);

  const nearCompleteEndings = endingsProgress.filter(e => e.isNearComplete);
  const unlockedEndings = endingsProgress.filter(e => e.isUnlocked);

  const getVagueHint = (ending: Ending, progress: EndingProgress): string => {
    const hints: string[] = [];

    for (const cond of ending.unlockConditions) {
      if (checkCondition(cond, save)) continue;

      if (cond.type === 'affection') {
        const charName = cond.target === 'lyra' ? '莱拉公主' :
                        cond.target === 'kairo' ? '凯洛' :
                        cond.target === 'seraphine' ? '塞拉芬' : cond.target;
        hints.push(`你与${charName}的关系似乎还可以更进一步……`);
      } else if (cond.type === 'has_item') {
        hints.push('也许某个重要的物品还在等待你去发现……');
      } else if (cond.type === 'chapter_complete') {
        hints.push('继续推进主线剧情，也许会有新的发现。');
      } else if (cond.type === 'choice_made') {
        hints.push('在某个关键的十字路口，你需要做出不同的选择。');
      } else if (cond.type === 'trust') {
        hints.push('信任是需要慢慢建立的……');
      }
    }

    return hints[0] || '继续探索，也许会有新的发现。';
  };

  const getKeyChoiceText = (choiceId: string): string => {
    const choice = save.choices.find(c => c.choiceId === choiceId);
    if (choice) return choice.choiceText;

    for (const chapter of chapters) {
      for (const scene of chapter.scenes) {
        const ch = scene.choices?.find(c => c.id === choiceId);
        if (ch) return ch.text;
      }
    }

    return choiceId;
  };

  return (
    <PageLayout title="结局馆">
      <div className="p-4">
        {settings.spoilerFree && (
          <div className="mb-4 p-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 flex items-center gap-2">
            <EyeOff size={16} className="text-cyan-400 flex-shrink-0" />
            <p className="text-xs text-cyan-400">无剧透模式已开启 - 未解锁结局信息已隐藏</p>
          </div>
        )}

        <div className="flex gap-1 p-1 mb-4 rounded-xl bg-white/5 border border-white/10">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                activeTab === key
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

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

        {activeTab === 'gallery' ? (
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
        ) : (
          <div className="space-y-4">
            {nearCompleteEndings.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Sparkles size={14} className="text-amber-400" />
                  即将达成
                </h3>
                <div className="space-y-3">
                  {nearCompleteEndings.map(({ ending, completionPercent, metConditions, totalConditions }) => (
                    <div
                      key={ending.id}
                      className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{ending.thumbnail}</span>
                          <div>
                            <p className="text-sm font-medium text-amber-300">
                              {settings.spoilerFree ? '???' : ending.title}
                            </p>
                            <p className="text-[10px] text-amber-400/70">
                              {endingTypeNames[ending.type]}
                            </p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-amber-400">
                          {completionPercent}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-amber-500/10 overflow-hidden mb-3">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-300 transition-all"
                          style={{ width: `${completionPercent}%` }}
                        />
                      </div>
                      <p className="text-xs text-amber-200/80 leading-relaxed">
                        💡 {getVagueHint(ending, { ending, isUnlocked: false, completionPercent, metConditions, totalConditions, isNearComplete: true })}
                      </p>
                      <p className="text-[10px] text-amber-400/50 mt-2">
                        已满足 {metConditions}/{totalConditions} 个条件
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {unlockedEndings.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Trophy size={14} className="text-emerald-400" />
                  已达成路线
                </h3>
                <div className="space-y-3">
                  {unlockedEndings.map(({ ending }) => (
                    <button
                      key={ending.id}
                      onClick={() => setSelectedEndingId(ending.id)}
                      className="w-full p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{ending.thumbnail}</span>
                          <div>
                            <p className="text-sm font-medium">{ending.title}</p>
                            <p className="text-[10px] text-gray-500">
                              {endingTypeNames[ending.type]}
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-500" />
                      </div>
                      <p className="text-xs text-cyan-400/80 leading-relaxed mb-2">
                        📝 {ending.routeHint}
                      </p>
                      {ending.keyChoices.length > 0 && (
                        <div className="pt-2 border-t border-white/5">
                          <p className="text-[10px] text-gray-500 mb-1">关键选择：</p>
                          <div className="space-y-1">
                            {ending.keyChoices.slice(0, 3).map((choiceId, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2 text-[10px] text-gray-400"
                              >
                                <Star size={10} className="text-amber-400 mt-0.5 flex-shrink-0" fill="currentColor" />
                                <span>{getKeyChoiceText(choiceId)}</span>
                              </div>
                            ))}
                            {ending.keyChoices.length > 3 && (
                              <p className="text-[10px] text-gray-600">
                                +{ending.keyChoices.length - 3} 个关键选择
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {nearCompleteEndings.length === 0 && unlockedEndings.length === 0 && (
              <div className="py-16 text-center">
                <Target size={48} className="mx-auto mb-3 opacity-30 text-gray-600" />
                <p className="text-sm text-gray-500">暂无路线提示</p>
                <p className="text-xs text-gray-600 mt-1">继续游戏以解锁更多路线提示</p>
              </div>
            )}

            {nearCompleteEndings.length === 0 && unlockedEndings.length > 0 && (
              <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
                <p className="text-xs text-cyan-300 text-center">
                  🎉 恭喜！你已经达成了所有已解锁的结局。继续探索以发现更多隐藏路线！
                </p>
              </div>
            )}
          </div>
        )}
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
  const { save } = useGameStore();

  if (!ending) return null;

  const showContent = isUnlocked || !spoilerFree;

  const getKeyChoiceText = (choiceId: string): string => {
    const choice = save.choices.find(c => c.choiceId === choiceId);
    if (choice) return choice.choiceText;

    for (const chapter of chapters) {
      for (const scene of chapter.scenes) {
        const ch = scene.choices?.find(c => c.id === choiceId);
        if (ch) return ch.text;
      }
    }

    return choiceId;
  };

  const getChoiceTimestamp = (choiceId: string): number | null => {
    const choice = save.choices.find(c => c.choiceId === choiceId);
    return choice?.timestamp || null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div
        className="relative w-full max-w-[480px] max-h-[85vh] overflow-y-auto rounded-3xl bg-[#0a1628] border border-white/10"
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

          <div className="p-5 space-y-4">
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
            <p className="text-sm text-gray-400">
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

            {showContent && ending.routeHint && (
              <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
                <p className="text-[10px] text-cyan-400/70 mb-1">路线提示</p>
                <p className="text-sm text-cyan-300">📝 {ending.routeHint}</p>
              </div>
            )}

            {showContent && ending.keyChoices.length > 0 && (
              <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Star size={14} className="text-amber-400" />
                关键选择路径
              </h4>
              <div className="relative ml-2 pl-4 border-l-2 border-amber-500/30 space-y-3">
                {ending.keyChoices.map((choiceId, idx) => {
                  const timestamp = getChoiceTimestamp(choiceId);
                  return (
                    <div key={choiceId} className="relative">
                      <div className="absolute -left-[25px] top-1 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center">
                        <span className="text-[10px] text-[#0a1628] font-bold">{idx + 1}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-sm text-gray-200 leading-relaxed">
                          {getKeyChoiceText(choiceId)}
                        </p>
                        {timestamp && (
                          <p className="text-[10px] text-gray-500 mt-1">
                            {new Date(timestamp).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            )}

            {showContent && ending.characterRoutes.length > 0 && (
              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
                <p className="text-[10px] text-purple-400/70 mb-1">关联角色</p>
                <div className="flex flex-wrap gap-2">
                  {ending.characterRoutes.map((charId) => {
                    const charNames: Record<string, string> = {
                      lyra: '莱拉公主',
                      kairo: '凯洛',
                      seraphine: '塞拉芬',
                      nova: '诺瓦'
                    };
                    return (
                      <span
                        key={charId}
                        className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20"
                      >
                        {charNames[charId] || charId}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
