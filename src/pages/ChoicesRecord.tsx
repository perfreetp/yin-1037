import { PageLayout } from '@/components/layout/PageLayout';
import { useGameStore } from '@/store/gameStore';
import { chapters } from '@/data/chapters';
import { Star, ChevronRight } from 'lucide-react';

export default function ChoicesRecord() {
  const { save } = useGameStore();

  const choicesByChapter: Record<string, typeof save.choices> = {};
  for (const choice of save.choices) {
    if (!choicesByChapter[choice.chapterId]) {
      choicesByChapter[choice.chapterId] = [];
    }
    choicesByChapter[choice.chapterId].push(choice);
  }

  return (
    <PageLayout title="抉择记录">
      <div className="p-4">
        {save.choices.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            <Star size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">暂无抉择记录</p>
            <p className="text-xs text-gray-600 mt-1">开始游戏后你的选择将记录在此</p>
          </div>
        ) : (
          <div className="space-y-6">
            {chapters
              .filter((ch) => choicesByChapter[ch.id])
              .map((chapter) => (
                <div key={chapter.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{chapter.coverImage}</span>
                    <div>
                      <h3 className="text-sm font-semibold" style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}>
                        {chapter.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {choicesByChapter[chapter.id].length} 次抉择
                      </p>
                    </div>
                  </div>

                  <div className="relative ml-4 pl-4 border-l border-white/10 space-y-4">
                    {choicesByChapter[chapter.id].map((choice, idx) => (
                      <div key={choice.id} className="relative">
                        <div
                          className={`absolute -left-[25px] top-1 w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                            choice.isKeyChoice
                              ? 'bg-amber-400 border-amber-300 text-[#0a1628]'
                              : 'bg-[#0a1628] border-gray-600'
                          }`}
                        >
                          {choice.isKeyChoice && <Star size={10} fill="currentColor" />}
                        </div>

                        <div
                          className={`p-3 rounded-xl border transition-all ${
                            choice.isKeyChoice
                              ? 'bg-amber-500/5 border-amber-500/20'
                              : 'bg-white/[0.02] border-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] text-gray-500">
                              抉择 #{idx + 1}
                            </span>
                            <span className="text-[10px] text-gray-600">
                              {new Date(choice.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-200 leading-relaxed">
                            {choice.choiceText}
                          </p>
                          {choice.isKeyChoice && (
                            <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-400">
                              <Star size={10} fill="currentColor" />
                              关键抉择
                            </div>
                          )}
                          {choice.consequences.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-white/5">
                              <p className="text-[10px] text-gray-500 mb-1">产生的影响：</p>
                              <div className="flex flex-wrap gap-1">
                                {choice.consequences.slice(0, 3).map((c, i) => {
                                  const [type, value] = c.split(':');
                                  return (
                                    <span
                                      key={i}
                                      className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400"
                                    >
                                      {type}:{value?.slice(0, 6)}
                                    </span>
                                  );
                                })}
                                {choice.consequences.length > 3 && (
                                  <span className="text-[10px] text-gray-600">
                                    +{choice.consequences.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}

        {save.choices.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">总计抉择</p>
                <p className="text-2xl font-bold">{save.choices.length}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">关键抉择</p>
                <p className="text-2xl font-bold text-amber-400">
                  {save.choices.filter((c) => c.isKeyChoice).length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
