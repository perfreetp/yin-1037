import { PageLayout } from '@/components/layout/PageLayout';
import { useNavigate } from 'react-router-dom';
import { characters } from '@/data/characters';
import { useGameStore } from '@/store/gameStore';
import { getRelationStatusName } from '@/utils/conditions';
import { ChevronRight, Lock } from 'lucide-react';

export default function Characters() {
  const navigate = useNavigate();
  const { save } = useGameStore();

  return (
    <PageLayout title="角色档案">
      <div className="p-4 grid grid-cols-2 gap-3">
        {characters.map((character) => {
          const relation = save.characterRelations[character.id];
          const affection = relation?.affection || 0;
          const trust = relation?.trust || 0;
          const status = relation?.status || 'stranger';
          const isUnlocked = !!relation;

          return (
            <button
              key={character.id}
              onClick={() => navigate(`/characters/${character.id}`)}
              className="relative p-4 rounded-2xl border transition-all hover:scale-[1.02] active:scale-[0.98] text-left"
              style={{
                background: isUnlocked
                  ? 'linear-gradient(135deg, rgba(91, 75, 138, 0.2) 0%, rgba(255, 255, 255, 0.03) 100%)'
                  : 'rgba(255, 255, 255, 0.02)',
                borderColor: isUnlocked ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)'
              }}
            >
              {!isUnlocked && (
                <div className="absolute top-3 right-3">
                  <Lock size={14} className="text-gray-600" />
                </div>
              )}

              <div className="flex flex-col items-center mb-3">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2 ${
                    isUnlocked ? '' : 'grayscale opacity-40'
                  }`}
                  style={{
                    background: isUnlocked
                      ? 'linear-gradient(135deg, rgba(212, 168, 75, 0.3), rgba(91, 75, 138, 0.3))'
                      : 'rgba(255, 255, 255, 0.05)',
                    boxShadow: isUnlocked ? '0 0 20px rgba(212, 168, 75, 0.2)' : 'none'
                  }}
                >
                  {isUnlocked ? character.avatar : '❓'}
                </div>
                <h3
                  className={`font-semibold text-sm ${
                    isUnlocked ? 'text-white' : 'text-gray-600'
                  }`}
                  style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}
                >
                  {isUnlocked ? character.name : '???'}
                </h3>
                <p className={`text-[10px] ${isUnlocked ? 'text-gray-500' : 'text-gray-700'}`}>
                  {isUnlocked ? character.title : '未解锁'}
                </p>
              </div>

              {isUnlocked && (
                <>
                  <div className="space-y-2">
                    <ProgressBar label="好感" value={affection} color="#d4a84b" />
                    <ProgressBar label="信任" value={trust} color="#4cc9f0" />
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">关系</span>
                    <span className="text-xs font-medium text-purple-300">
                      {getRelationStatusName(status)}
                    </span>
                  </div>
                </>
              )}

              {isUnlocked && (
                <ChevronRight
                  size={16}
                  className="absolute bottom-3 right-3 text-gray-600"
                />
              )}
            </button>
          );
        })}
      </div>
    </PageLayout>
  );
}

function ProgressBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-gray-500">{label}</span>
        <span className="text-[10px] font-mono text-gray-400">{value}</span>
      </div>
      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`
          }}
        />
      </div>
    </div>
  );
}
