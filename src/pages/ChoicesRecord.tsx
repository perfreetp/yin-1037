import { useState, useMemo } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { useGameStore } from '@/store/gameStore';
import { chapters } from '@/data/chapters';
import { Star, ChevronRight, X, Rocket, Mail, FlaskConical, BookOpen, Filter } from 'lucide-react';
import type { ChoiceSource, PlayerChoice } from '@/types';

const sourceTabs: { key: ChoiceSource | 'all'; label: string; icon: typeof Star }[] = [
  { key: 'all', label: '全部', icon: Filter },
  { key: 'main_story', label: '主线剧情', icon: BookOpen },
  { key: 'navigation', label: '航行事件', icon: Rocket },
  { key: 'mail_reply', label: '邮件回复', icon: Mail },
  { key: 'item_combine', label: '物品合成', icon: FlaskConical },
];

const sourceNames: Record<ChoiceSource, string> = {
  main_story: '主线剧情',
  navigation: '航行事件',
  mail_reply: '邮件回复',
  item_combine: '物品合成'
};

const sourceColors: Record<ChoiceSource, string> = {
  main_story: '#c77dff',
  navigation: '#4cc9f0',
  mail_reply: '#d4a84b',
  item_combine: '#06d6a0'
};

export default function ChoicesRecord() {
  const { save } = useGameStore();
  const [activeTab, setActiveTab] = useState<ChoiceSource | 'all'>('all');
  const [selectedChoice, setSelectedChoice] = useState<PlayerChoice | null>(null);

  const filteredChoices = useMemo(() => {
    if (activeTab === 'all') return save.choices;
    return save.choices.filter(c => c.source === activeTab);
  }, [save.choices, activeTab]);

  const choicesByGroup = useMemo(() => {
    const groups: Record<string, PlayerChoice[]> = {};

    for (const choice of filteredChoices) {
      let groupKey: string;

      if (choice.source === 'main_story') {
        const chapter = chapters.find(ch => ch.id === choice.chapterId);
        groupKey = chapter?.title || choice.chapterId;
      } else if (choice.source === 'navigation') {
        groupKey = choice.context || '航行事件';
      } else if (choice.source === 'mail_reply') {
        groupKey = choice.context || '邮件回复';
      } else if (choice.source === 'item_combine') {
        groupKey = '物品合成';
      } else {
        groupKey = '其他';
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(choice);
    }

    return groups;
  }, [filteredChoices]);

  const stats = useMemo(() => {
    const total = save.choices.length;
    const bySource: Record<ChoiceSource, number> = {
      main_story: 0,
      navigation: 0,
      mail_reply: 0,
      item_combine: 0
    };

    for (const choice of save.choices) {
      if (choice.source in bySource) {
        bySource[choice.source as ChoiceSource]++;
      }
    }

    return { total, bySource, key: save.choices.filter(c => c.isKeyChoice).length };
  }, [save.choices]);

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
          <>
            <div className="flex gap-1 p-1 mb-4 rounded-xl bg-white/5 border border-white/10 overflow-x-auto">
              {sourceTabs.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    activeTab === key
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon size={12} />
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {(Object.keys(stats.bySource) as ChoiceSource[]).map((source) => (
                <div
                  key={source}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-center"
                >
                  <p className="text-lg font-bold" style={{ color: sourceColors[source] }}>
                    {stats.bySource[source]}
                  </p>
                  <p className="text-[10px] text-gray-500">{sourceNames[source]}</p>
                </div>
              ))}
            </div>

            {filteredChoices.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <Filter size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">此分类暂无记录</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(choicesByGroup).map(([groupName, choices]) => (
                  <div key={groupName}>
                    <div className="flex items-center gap-2 mb-3">
                      {choices[0].source === 'main_story' ? (
                        <span className="text-2xl">
                          {chapters.find(ch => ch.title === groupName)?.coverImage || '📖'}
                        </span>
                      ) : choices[0].source === 'navigation' ? (
                        <span className="text-2xl">🚀</span>
                      ) : choices[0].source === 'mail_reply' ? (
                        <span className="text-2xl">📧</span>
                      ) : (
                        <span className="text-2xl">⚗️</span>
                      )}
                      <div>
                        <h3 className="text-sm font-semibold" style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}>
                          {groupName}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: sourceColors[choices[0].source as ChoiceSource] }}
                          />
                          {sourceNames[choices[0].source as ChoiceSource]} · {choices.length} 次抉择
                        </p>
                      </div>
                    </div>

                    <div className="relative ml-4 pl-4 border-l border-white/10 space-y-4">
                      {choices.map((choice, idx) => (
                        <button
                          key={choice.id}
                          onClick={() => setSelectedChoice(choice)}
                          className="w-full text-left relative"
                        >
                          <div
                            className={`absolute -left-[25px] top-1 w-4 h-4 rounded-full flex items-center justify-center border-2 z-10 ${
                              choice.isKeyChoice
                                ? 'bg-amber-400 border-amber-300 text-[#0a1628]'
                                : 'bg-[#0a1628] border-gray-600'
                            }`}
                          >
                            {choice.isKeyChoice && <Star size={10} fill="currentColor" />}
                          </div>

                          <div
                            className={`p-3 rounded-xl border transition-all hover:bg-white/5 ${
                              choice.isKeyChoice
                                ? 'bg-amber-500/5 border-amber-500/20'
                                : 'bg-white/[0.02] border-white/5'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-500">
                                  抉择 #{idx + 1}
                                </span>
                                <span
                                  className="text-[10px] px-1.5 py-0.5 rounded"
                                  style={{
                                    background: `${sourceColors[choice.source as ChoiceSource]}20`,
                                    color: sourceColors[choice.source as ChoiceSource]
                                  }}
                                >
                                  {sourceNames[choice.source as ChoiceSource]}
                                </span>
                              </div>
                              <ChevronRight size={14} className="text-gray-500" />
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
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">总计抉择</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">关键抉择</p>
                  <p className="text-2xl font-bold text-amber-400">
                    {stats.key}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedChoice && (
        <ChoiceDetailModal
          choice={selectedChoice}
          onClose={() => setSelectedChoice(null)}
        />
      )}
    </PageLayout>
  );
}

function ChoiceDetailModal({
  choice,
  onClose
}: {
  choice: PlayerChoice;
  onClose: () => void;
}) {
  const formatConsequence = (c: string) => {
    const [type, value] = c.split(':');
    const typeNames: Record<string, string> = {
      item: '获得物品',
      clue: '获得线索',
      reputation: '声望变化',
      affection: '好感变化',
      ending: '解锁结局'
    };
    return {
      type: typeNames[type] || type,
      value: value || '',
      isPositive: !value?.startsWith('-') && type !== 'remove_item'
    };
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-[480px] rounded-t-3xl overflow-hidden bg-[#0a1628] border-t border-white/10"
        style={{ animation: 'slideUp 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/10 bg-[#0a1628]">
          <h3 className="font-semibold" style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}>
            抉择详情
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[10px] px-2 py-0.5 rounded"
              style={{
                background: `${sourceColors[choice.source as ChoiceSource]}20`,
                color: sourceColors[choice.source as ChoiceSource]
              }}
            >
              {sourceNames[choice.source as ChoiceSource]}
            </span>
            {choice.isKeyChoice && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 flex items-center gap-1">
                <Star size={10} fill="currentColor" />
                关键抉择
              </span>
            )}
          </div>

          {choice.context && (
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-[10px] text-gray-500 mb-1">场景</p>
              <p className="text-sm text-gray-300">{choice.context}</p>
            </div>
          )}

          <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10">
            <p className="text-[10px] text-gray-500 mb-2">你当时的选择</p>
            <p className="text-lg font-medium text-gray-100 leading-relaxed">
              "{choice.choiceText}"
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-[10px] text-gray-500 mb-1">抉择时间</p>
            <p className="text-sm text-gray-300">
              {new Date(choice.timestamp).toLocaleString()}
            </p>
          </div>

          {choice.consequences.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Star size={14} className="text-amber-400" />
                带来的影响
              </h4>
              <div className="space-y-2">
                {choice.consequences.map((c, i) => {
                  const { type, value, isPositive } = formatConsequence(c);
                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border ${
                        isPositive
                          ? 'bg-emerald-500/5 border-emerald-500/10'
                          : 'bg-red-500/5 border-red-500/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">{type}</span>
                        <span className={`text-sm font-medium ${isPositive ? 'text-emerald-300' : 'text-red-300'}`}>
                          {value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
            <p className="text-[10px] text-cyan-400/70">
              抉择 ID: {choice.choiceId}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
