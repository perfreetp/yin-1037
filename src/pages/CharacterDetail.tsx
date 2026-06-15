import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { getCharacterById } from '@/data/characters';
import { useGameStore } from '@/store/gameStore';
import { getRelationStatusName } from '@/utils/conditions';
import { ArrowLeft, Lock, Heart, Shield, User, EyeOff } from 'lucide-react';

export default function CharacterDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { save, settings } = useGameStore();

  const character = getCharacterById(id || '');
  const relation = save.characterRelations[id || ''];
  const isUnlocked = !!relation;
  const showSpoiler = isUnlocked || !settings.spoilerFree;

  if (!character) {
    return (
      <PageLayout title="角色详情" showBack>
        <div className="p-4 text-center text-gray-500">角色不存在</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout hideTitle>
      <div>
        <div className="relative h-48 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(91, 75, 138, 0.4) 0%, rgba(10, 22, 40, 0) 100%)'
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-28 h-28 rounded-full flex items-center justify-center text-6xl"
              style={{
                background: isUnlocked
                  ? 'linear-gradient(135deg, rgba(212, 168, 75, 0.4), rgba(91, 75, 138, 0.4))'
                  : 'rgba(255, 255, 255, 0.05)',
                boxShadow: isUnlocked ? '0 0 40px rgba(212, 168, 75, 0.3)' : 'none',
                animation: 'float 4s ease-in-out infinite'
              }}
            >
              {isUnlocked ? character.avatar : '❓'}
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2 rounded-xl bg-black/30 backdrop-blur-xl text-white"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <div className="px-4 -mt-6 relative z-10">
          {settings.spoilerFree && !isUnlocked && (
            <div className="mb-4 p-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 flex items-center gap-2">
              <EyeOff size={16} className="text-cyan-400 flex-shrink-0" />
              <p className="text-xs text-cyan-400">无剧透模式已开启 - 角色敏感信息已隐藏</p>
            </div>
          )}

          <div className="p-5 rounded-2xl backdrop-blur-xl border border-white/10 bg-[#0a1628]/90">
            <div className="text-center mb-4">
              <h1
                className={`text-xl font-bold mb-1 ${
                  isUnlocked ? 'text-white' : 'text-gray-600'
                }`}
                style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}
              >
                {showSpoiler ? character.name : '???'}
              </h1>
              <p className={`text-sm ${isUnlocked ? 'text-gray-400' : 'text-gray-700'}`}>
                {showSpoiler ? character.title : '资料未解锁'}
              </p>
            </div>

            {isUnlocked ? (
              <>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <StatCard
                    icon={Heart}
                    label="好感"
                    value={relation.affection}
                    color="#d4a84b"
                  />
                  <StatCard
                    icon={Shield}
                    label="信任"
                    value={relation.trust}
                    color="#4cc9f0"
                  />
                  <StatCard
                    icon={User}
                    label={getRelationStatusName(relation.status)}
                    value={null}
                    color="#c77dff"
                  />
                </div>

                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
                    <span className="w-1 h-3 bg-amber-400 rounded-full" />
                    所属阵营
                  </h3>
                  <p className="text-sm text-purple-300">
                    {showSpoiler ? character.faction : '???'}
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
                    <span className="w-1 h-3 bg-amber-400 rounded-full" />
                    简介
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {showSpoiler ? character.description : '与角色互动后解锁角色简介'}
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
                    <span className="w-1 h-3 bg-amber-400 rounded-full" />
                    性格标签
                  </h3>
                  {showSpoiler ? (
                    <div className="flex flex-wrap gap-2">
                      {character.personalityTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">???</p>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
                    <span className="w-1 h-3 bg-amber-400 rounded-full" />
                    背景故事
                  </h3>
                  {showSpoiler ? (
                    <div className="space-y-3">
                      {character.backgroundStory.map((para, idx) => {
                        const unlocked = idx < Math.floor((relation.affection + relation.trust) / 25) + 1;
                        return (
                          <div key={idx} className="relative">
                            {unlocked ? (
                              <p className="text-sm text-gray-300 leading-relaxed pl-4 border-l-2 border-white/10">
                                {para}
                              </p>
                            ) : (
                              <div className="flex items-center gap-2 text-gray-600 pl-4 border-l-2 border-white/5">
                                <Lock size={12} />
                                <span className="text-xs">提升好感度解锁更多故事</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-600 py-2">
                      <Lock size={14} />
                      <span className="text-xs">与角色互动后解锁背景故事</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="py-8 text-center">
                <Lock size={32} className="mx-auto mb-3 text-gray-700" />
                <p className="text-sm text-gray-600">在游戏中与此角色互动后解锁资料</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color
}: {
  icon: typeof Heart;
  label: string;
  value: number | null;
  color: string;
}) {
  return (
    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
      <Icon size={16} className="mx-auto mb-1" style={{ color }} />
      {value !== null ? (
        <p className="text-lg font-bold" style={{ color }}>
          {value}
        </p>
      ) : (
        <div className="h-5" />
      )}
      <p className="text-[10px] text-gray-500">{label}</p>
    </div>
  );
}
