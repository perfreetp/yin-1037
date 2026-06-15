import { useState, useCallback } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { planets } from '@/data/events';
import { useGameStore } from '@/store/gameStore';
import type { Planet } from '@/types';
import { X, MapPin, Rocket } from 'lucide-react';

export default function StarMap() {
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [isTraveling, setIsTraveling] = useState(false);
  const { save, triggerRandomEvent } = useGameStore();

  const factionColors: Record<string, string> = {
    '织星族': '#c77dff',
    '自由联盟': '#d4a84b',
    '暗影教团': '#5b4b8a',
    '科技议会': '#4cc9f0',
    '银河议会': '#ef476f',
    '未知': '#06d6a0'
  };

  const handlePlanetSelect = useCallback((planet: Planet) => {
    setIsTraveling(true);

    setTimeout(() => {
      const eventTriggered = triggerRandomEvent('space_travel');
      setIsTraveling(false);

      if (!eventTriggered) {
        setSelectedPlanet(planet);
      }
    }, 800);
  }, [triggerRandomEvent]);

  return (
    <PageLayout title="星图">
      <div className="relative px-4 py-2">
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm">
          <svg className="absolute inset-0 w-full h-full">
            {planets.map((planet, i) =>
              planets.slice(i + 1).map((otherPlanet, j) => {
                const shouldShowLine =
                  (planet.unlocked || otherPlanet.unlocked) &&
                  Math.abs(planet.position.x - otherPlanet.position.x) < 50 &&
                  Math.abs(planet.position.y - otherPlanet.position.y) < 50;
                if (!shouldShowLine) return null;
                return (
                  <line
                    key={`${planet.id}-${otherPlanet.id}`}
                    x1={`${planet.position.x}%`}
                    y1={`${planet.position.y}%`}
                    x2={`${otherPlanet.position.x}%`}
                    y2={`${otherPlanet.position.y}%`}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                );
              })
            )}
          </svg>

          {planets.map((planet) => {
            const isUnlocked = planet.unlocked || save.factionReputation[planet.faction] !== undefined;
            const reputation = save.factionReputation[planet.faction] || 0;

            return (
              <button
                key={planet.id}
                onClick={() => isUnlocked && !isTraveling && handlePlanetSelect(planet)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 transition-transform ${
                  isTraveling ? 'opacity-50 cursor-wait' : 'hover:scale-110 active:scale-95'
                }`}
                style={{
                  left: `${planet.position.x}%`,
                  top: `${planet.position.y}%`
                }}
                disabled={!isUnlocked || isTraveling}
              >
                <div className="relative">
                  {isUnlocked && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping opacity-30"
                      style={{
                        background: planet.color,
                        width: '40px',
                        height: '40px',
                        marginLeft: '-4px',
                        marginTop: '-4px'
                      }}
                    />
                  )}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      isUnlocked ? '' : 'grayscale opacity-40'
                    }`}
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${planet.color}, ${planet.color}88 60%, ${planet.color}44)`,
                      boxShadow: isUnlocked
                        ? `0 0 20px ${planet.color}66`
                        : 'none'
                    }}
                  >
                    {!isUnlocked && <span className="text-[10px]">?</span>}
                  </div>
                  <p
                    className={`absolute top-full mt-1 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap ${
                      isUnlocked ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {isUnlocked ? planet.name : '???'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {isTraveling && (
          <div className="mt-4 p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
            <div className="flex items-center justify-center gap-3">
              <Rocket size={20} className="text-cyan-400 animate-bounce" />
              <p className="text-sm text-cyan-400">星际航行中...</p>
            </div>
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          {planets.filter((p) => p.unlocked).map((planet) => (
            <button
              key={planet.id}
              onClick={() => !isTraveling && handlePlanetSelect(planet)}
              disabled={isTraveling}
              className={`p-3 rounded-xl border border-white/10 bg-white/5 transition-all ${
                isTraveling ? 'opacity-50 cursor-wait' : 'hover:bg-white/10'
              } text-left`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ background: planet.color }}
                />
                <span className="text-xs font-medium">{planet.name}</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                {planet.faction} · {planet.status}
              </p>
            </button>
          ))}
        </div>
      </div>

      {selectedPlanet && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={() => setSelectedPlanet(null)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-[480px] rounded-t-3xl overflow-hidden bg-[#0a1628] border-t border-white/10"
            style={{ animation: 'slideUp 0.3s ease-out' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="font-semibold" style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}>
                {selectedPlanet.name}
              </h3>
              <button
                onClick={() => setSelectedPlanet(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-center py-6 mb-4">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${selectedPlanet.color}, ${selectedPlanet.color}88 60%, ${selectedPlanet.color}44)`,
                    boxShadow: `0 0 40px ${selectedPlanet.color}66`
                  }}
                >
                  🪐
                </div>
              </div>

              <div className="space-y-3">
                <InfoRow label="所属阵营" value={selectedPlanet.faction} color={factionColors[selectedPlanet.faction]} />
                <InfoRow label="当前状态" value={selectedPlanet.status} />
                <InfoRow
                  label="声望"
                  value={`${save.factionReputation[selectedPlanet.faction] || 0}`}
                  color={
                    (save.factionReputation[selectedPlanet.faction] || 0) >= 0
                      ? '#4cc9f0'
                      : '#ef476f'
                  }
                />
              </div>

              <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                  <MapPin size={12} />
                  星球简介
                </p>
                <p className="text-sm text-gray-200 leading-relaxed">
                  {selectedPlanet.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}

function InfoRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-medium" style={{ color: color || '#e5e7eb' }}>
        {value}
      </span>
    </div>
  );
}
