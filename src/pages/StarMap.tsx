import { useState, useCallback, useMemo } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { planets, planetRoutes, eventChains, randomEvents, getRouteBetweenPlanets, getRiskColor, getRiskText, getEventTypeText } from '@/data/events';
import { useGameStore } from '@/store/gameStore';
import { mailTemplates } from '@/data/mails';
import type { Planet, PlanetRoute, EventChain } from '@/types';
import { X, MapPin, Rocket, Navigation, AlertTriangle, Clock, Calendar, Scroll, ChevronRight, Ship, Link2, CheckCircle2, Circle, HelpCircle, User } from 'lucide-react';

export default function StarMap() {
  const [activeTab, setActiveTab] = useState<'map' | 'chains'>('map');
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [targetPlanet, setTargetPlanet] = useState<Planet | null>(null);
  const [showTravelConfirm, setShowTravelConfirm] = useState(false);
  const [showTravelLogs, setShowTravelLogs] = useState(false);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [isTraveling, setIsTraveling] = useState(false);
  const [selectedChainId, setSelectedChainId] = useState<string | null>(null);
  const { save, triggerRandomEvent, startTravel, completeTravel } = useGameStore();

  const currentPlanet = useMemo(() => {
    return planets.find(p => p.id === save.currentPlanetId) || planets[0];
  }, [save.currentPlanetId]);

  const routeToTarget = useMemo(() => {
    if (!targetPlanet || !currentPlanet) return null;
    return getRouteBetweenPlanets(currentPlanet.id, targetPlanet.id);
  }, [currentPlanet, targetPlanet]);

  const factionColors: Record<string, string> = {
    '织星族': '#c77dff',
    '自由联盟': '#d4a84b',
    '暗影教团': '#5b4b8a',
    '科技议会': '#4cc9f0',
    '银河议会': '#ef476f',
    '未知': '#06d6a0'
  };

  const handlePlanetClick = useCallback((planet: Planet) => {
    if (planet.id === currentPlanet?.id) {
      setSelectedPlanet(planet);
    } else {
      setTargetPlanet(planet);
      setShowTravelConfirm(true);
    }
  }, [currentPlanet]);

  const handleStartTravel = useCallback(() => {
    if (!targetPlanet || !currentPlanet || !routeToTarget) return;

    setShowTravelConfirm(false);
    setIsTraveling(true);
    startTravel(currentPlanet.id, currentPlanet.name, targetPlanet.id, targetPlanet.name);

    setTimeout(() => {
      const eventTriggered = triggerRandomEvent(
        'space_travel',
        routeToTarget?.riskLevel,
        routeToTarget?.possibleEvents
      );
      setIsTraveling(false);
      completeTravel();

      if (!eventTriggered) {
        setSelectedPlanet(targetPlanet);
      }
      setTargetPlanet(null);
    }, 1500);
  }, [targetPlanet, currentPlanet, routeToTarget, startTravel, triggerRandomEvent, completeTravel]);

  const formatDuration = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}分钟`;
    const hours = Math.floor(minutes / 60);
    return `${hours}小时${minutes % 60}分钟`;
  };

  return (
    <PageLayout title="星图">
      <div className="relative px-4 py-2">
        <div className="flex gap-1 p-1 mb-3 rounded-xl bg-white/5 border border-white/10">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'map'
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Ship size={14} />
            星图
          </button>
          <button
            onClick={() => setActiveTab('chains')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'chains'
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Link2 size={14} />
            事件线索
          </button>
        </div>

        {activeTab === 'map' && (
          <>
        <div className="mb-3 p-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ship size={16} className="text-cyan-400" />
              <div>
                <p className="text-[10px] text-cyan-400/70">当前位置</p>
                <p className="text-sm font-medium text-cyan-300">{currentPlanet?.name}</p>
              </div>
            </div>
            <button
              onClick={() => setShowTravelLogs(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <Scroll size={14} />
              航行日志
            </button>
          </div>
        </div>

        <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm">
          <svg className="absolute inset-0 w-full h-full">
            {planetRoutes.map((route) => {
              const fromPlanet = planets.find(p => p.id === route.fromPlanetId);
              const toPlanet = planets.find(p => p.id === route.toPlanetId);
              if (!fromPlanet || !toPlanet) return null;

              const isUnlocked = fromPlanet.unlocked || toPlanet.unlocked;
              const isTargetRoute = targetPlanet &&
                ((route.fromPlanetId === currentPlanet?.id && route.toPlanetId === targetPlanet.id) ||
                 (route.toPlanetId === currentPlanet?.id && route.fromPlanetId === targetPlanet.id));

              if (!isUnlocked) return null;

              return (
                <line
                  key={`${route.fromPlanetId}-${route.toPlanetId}`}
                  x1={`${fromPlanet.position.x}%`}
                  y1={`${fromPlanet.position.y}%`}
                  x2={`${toPlanet.position.x}%`}
                  y2={`${toPlanet.position.y}%`}
                  stroke={isTargetRoute ? 'rgba(76, 201, 240, 0.8)' : 'rgba(255,255,255,0.1)'}
                  strokeWidth={isTargetRoute ? '2' : '1'}
                  strokeDasharray={isTargetRoute ? '8 4' : '4 4'}
                  className={isTargetRoute ? 'animate-pulse' : ''}
                />
              );
            })}
          </svg>

          {planets.map((planet) => {
            const isUnlocked = planet.unlocked || save.factionReputation[planet.faction] !== undefined;
            const isCurrent = planet.id === currentPlanet?.id;
            const isTarget = planet.id === targetPlanet?.id;

            return (
              <button
                key={planet.id}
                onClick={() => isUnlocked && !isTraveling && handlePlanetClick(planet)}
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
                  {isCurrent && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping opacity-40"
                      style={{
                        background: '#4cc9f0',
                        width: '48px',
                        height: '48px',
                        marginLeft: '-8px',
                        marginTop: '-8px'
                      }}
                    />
                  )}
                  {isUnlocked && !isCurrent && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping opacity-20"
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
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      isUnlocked ? '' : 'grayscale opacity-40'
                    }`}
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${isCurrent ? '#4cc9f0' : planet.color}, ${isCurrent ? '#4cc9f088' : planet.color + '88'} 60%, ${isCurrent ? '#4cc9f044' : planet.color + '44'})`,
                      boxShadow: isUnlocked
                        ? `0 0 ${isCurrent ? '30px' : '20px'} ${isCurrent ? '#4cc9f066' : planet.color + '66'}`
                        : 'none',
                      border: isTarget ? '2px solid #4cc9f0' : 'none'
                    }}
                  >
                    {isCurrent ? <Ship size={14} /> : !isUnlocked ? <span className="text-[10px]">?</span> : null}
                  </div>
                  <p
                    className={`absolute top-full mt-1 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap font-medium ${
                      isCurrent ? 'text-cyan-400' : isUnlocked ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {isUnlocked ? planet.name : '???'}
                    {isCurrent && ' (当前)'}
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
              <div>
                <p className="text-sm text-cyan-400 font-medium">星际航行中...</p>
                <p className="text-[10px] text-cyan-400/60 mt-0.5">
                  {currentPlanet?.name} → {targetPlanet?.name}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          {planets.filter((p) => p.unlocked).map((planet) => {
            const isCurrent = planet.id === currentPlanet?.id;
            return (
              <button
                key={planet.id}
                onClick={() => !isTraveling && handlePlanetClick(planet)}
                disabled={isTraveling}
                className={`p-3 rounded-xl border transition-all ${
                  isTraveling ? 'opacity-50 cursor-wait' : 'hover:bg-white/10'
                } ${
                  isCurrent
                    ? 'border-cyan-500/30 bg-cyan-500/10'
                    : 'border-white/10 bg-white/5'
                } text-left`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ background: isCurrent ? '#4cc9f0' : planet.color }}
                  />
                  <span className="text-xs font-medium">{planet.name}</span>
                  {isCurrent && <span className="text-[10px] text-cyan-400">(当前)</span>}
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  {planet.faction} · {planet.status}
                </p>
              </button>
            );
          })}
        </div>
          </>
        )}

        {activeTab === 'chains' && (
          <EventChainsPanel
            save={save}
            onSelectChain={(id) => setSelectedChainId(id)}
          />
        )}
      </div>

      {selectedPlanet && (
        <PlanetDetailModal
          planet={selectedPlanet}
          onClose={() => setSelectedPlanet(null)}
          reputation={save.factionReputation[selectedPlanet.faction] || 0}
        />
      )}

      {showTravelConfirm && targetPlanet && routeToTarget && (
        <TravelConfirmModal
          route={routeToTarget}
          fromPlanet={currentPlanet!}
          toPlanet={targetPlanet}
          onConfirm={handleStartTravel}
          onCancel={() => {
            setShowTravelConfirm(false);
            setTargetPlanet(null);
          }}
        />
      )}

      {showTravelLogs && (
        <TravelLogsModal
          logs={save.travelLogs}
          onClose={() => setShowTravelLogs(false)}
          onSelectLog={(id) => setSelectedLogId(id)}
          formatDuration={formatDuration}
        />
      )}

      {selectedLogId && (
        <TravelLogDetailModal
          log={save.travelLogs.find(l => l.id === selectedLogId)!}
          onClose={() => setSelectedLogId(null)}
          formatDuration={formatDuration}
        />
      )}

      {selectedChainId && (
        <EventChainDetailModal
          chainId={selectedChainId}
          save={save}
          onClose={() => setSelectedChainId(null)}
        />
      )}
    </PageLayout>
  );
}

function EventChainsPanel({
  save,
  onSelectChain
}: {
  save: any;
  onSelectChain: (id: string) => void;
}) {
  const chains = eventChains.map((chain) => {
    const startingEvent = randomEvents.find(e => e.id === chain.startingEventId);
    const startChoice = save.choices.find((c: any) => c.sceneId === `event_${chain.startingEventId}`);
    const hasStarted = !!startChoice;

    const totalNodes = 1 + chain.subsequentEvents.length;
    let completedNodes = hasStarted ? 1 : 0;

    if (hasStarted) {
      for (const sub of chain.subsequentEvents) {
        const triggerChoice = save.choices.find((c: any) => c.choiceId === sub.triggerChoiceId);
        if (triggerChoice) {
          if (sub.nextEventId.startsWith('mail_')) {
            const mailFound = save.mails.some((m: any) => m.id === sub.nextEventId);
            if (mailFound) completedNodes++;
          } else {
            const eventDone = save.choices.some((c: any) => c.sceneId === `event_${sub.nextEventId}`);
            if (eventDone) completedNodes++;
          }
        }
      }
    }

    return {
      chain,
      hasStarted,
      completedNodes,
      totalNodes,
      progress: Math.round((completedNodes / totalNodes) * 100),
      startingEvent
    };
  });

  const activeCount = chains.filter(c => c.hasStarted).length;

  return (
    <div>
      {activeCount > 0 && (
        <div className="mb-4 p-4 rounded-2xl border border-purple-500/20 bg-purple-500/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20">
              <Link2 size={20} className="text-purple-400" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 mb-1">进行中的线索</p>
              <p className="text-xl font-bold text-purple-300">{activeCount} / {chains.length}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {chains.map(({ chain, hasStarted, progress, startingEvent }) => (
          <button
            key={chain.id}
            onClick={() => hasStarted && onSelectChain(chain.id)}
            disabled={!hasStarted}
            className={`w-full p-4 rounded-xl border text-left transition-all ${
              hasStarted
                ? 'border-white/10 bg-white/5 hover:bg-white/10'
                : 'border-white/5 bg-white/[0.02] opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl ${
                  hasStarted ? 'bg-purple-500/20' : 'bg-gray-500/10'
                }`}>
                  {chain.id === 'chain_rescue' ? (
                    <User size={18} className={hasStarted ? 'text-purple-400' : 'text-gray-600'} />
                  ) : (
                    <AlertTriangle size={18} className={hasStarted ? 'text-purple-400' : 'text-gray-600'} />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">
                    {hasStarted ? chain.name : '未知线索'}
                  </p>
                  <p className="text-[10px] text-gray-500 leading-relaxed max-w-[200px]">
                    {hasStarted ? chain.description : '触发相关事件后可查看详情'}
                  </p>
                </div>
              </div>
              {hasStarted && <ChevronRight size={16} className="text-gray-500 mt-1" />}
            </div>

            {hasStarted && startingEvent && (
              <div className="pt-3 border-t border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] text-gray-500">
                    触发节点：{startingEvent.title}
                  </p>
                  <p className="text-[10px] text-purple-400 font-medium">{progress}%</p>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-300 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {activeCount === 0 && (
        <div className="py-16 text-center">
          <HelpCircle size={40} className="mx-auto mb-3 opacity-30 text-gray-600" />
          <p className="text-sm text-gray-500">暂无进行中的线索</p>
          <p className="text-[10px] text-gray-600 mt-1">多进行星际航行会遇到各种事件</p>
        </div>
      )}
    </div>
  );
}

function EventChainDetailModal({
  chainId,
  save,
  onClose
}: {
  chainId: string;
  save: any;
  onClose: () => void;
}) {
  const chain = eventChains.find(c => c.id === chainId);
  if (!chain) return null;

  const nodes: {
    id: string;
    title: string;
    type: 'event' | 'mail' | 'next';
    status: 'done' | 'current' | 'locked';
    description: string;
    choiceText?: string;
    timestamp?: number;
    vagueHint?: string;
  }[] = [];

  const startChoice = save.choices.find((c: any) => c.sceneId === `event_${chain.startingEventId}`);
  const startEvent = randomEvents.find(e => e.id === chain.startingEventId);

  nodes.push({
    id: chain.startingEventId,
    title: startEvent?.title || '起点事件',
    type: 'event',
    status: startChoice ? 'done' : 'locked',
    description: startEvent?.description || '',
    choiceText: startChoice?.choiceText,
    timestamp: startChoice?.timestamp,
    vagueHint: '在航行中遇到特定事件时触发'
  });

  for (let i = 0; i < chain.subsequentEvents.length; i++) {
    const sub = chain.subsequentEvents[i];
    const prevTriggered = i === 0
      ? !!save.choices.find((c: any) => c.choiceId === sub.triggerChoiceId)
      : !!save.choices.find((c: any) => c.choiceId === chain.subsequentEvents[i - 1].triggerChoiceId);

    const isMail = sub.nextEventId.startsWith('mail_');
    let isDone = false;
    let choiceText: string | undefined;
    let timestamp: number | undefined;
    let title: string = '下一步';
    let description: string = '';
    let vagueHint: string = '';

    if (isMail) {
      const mailTemplate = mailTemplates.find((m: any) => m.id === sub.nextEventId);
      title = mailTemplate?.subject || '后续邮件';
      description = mailTemplate?.content || '';
      const savedMail = save.mails.find((m: any) => m.id === sub.nextEventId);
      if (savedMail) {
        isDone = true;
        if (savedMail.selectedReply) {
          const reply = mailTemplate?.replyOptions?.find((r: any) => r.id === savedMail.selectedReply);
          choiceText = reply?.text || savedMail.selectedReply;
        }
        timestamp = savedMail.timestamp;
      }
      vagueHint = '不久后会收到一封意外的邮件……';
    } else {
      const event = randomEvents.find(e => e.id === sub.nextEventId);
      title = event?.title || '后续事件';
      description = event?.description || '';
      const done = save.choices.find((c: any) => c.sceneId === `event_${sub.nextEventId}`);
      if (done) {
        isDone = true;
        choiceText = done.choiceText;
        timestamp = done.timestamp;
      }
      if (chainId === 'chain_rescue') {
        vagueHint = '下次航行也许会遇到优惠的买卖……';
      } else if (chainId === 'chain_merchant') {
        vagueHint = '下次航行商人可能带来更稀有的货物……';
      }
    }

    const triggerChoiceMade = !!save.choices.find((c: any) => c.choiceId === sub.triggerChoiceId);
    const status = isDone ? 'done' : (triggerChoiceMade ? 'current' : 'locked');

    nodes.push({
      id: sub.nextEventId,
      title,
      type: isMail ? 'mail' : 'event',
      status,
      description,
      choiceText,
      timestamp,
      vagueHint
    });
  }

  const doneCount = nodes.filter(n => n.status === 'done').length;
  const progress = Math.round((doneCount / nodes.length) * 100);

  const delayNames: Record<string, string> = {
    immediate: '立即',
    next_travel: '下次航行',
    next_chapter: '下一章',
    delayed_mail: '延迟邮件'
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-[480px] h-[75vh] rounded-t-3xl overflow-hidden bg-[#0a1628] border-t border-white/10 flex flex-col"
        style={{ animation: 'slideUp 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/10 bg-[#0a1628] z-10">
          <div>
            <h3 className="font-semibold flex items-center gap-2" style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}>
              <Link2 size={16} className="text-purple-400" />
              {chain.name}
            </h3>
            <p className="text-[10px] text-gray-500 mt-0.5">
              进度 {progress}%（{doneCount}/{nodes.length}）
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-3 border-b border-white/5 bg-white/[0.02]">
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="relative ml-3 pl-6 border-l-2 border-purple-500/20 space-y-4">
            {nodes.map((node, idx) => (
              <div key={node.id} className="relative">
                <div className={`absolute -left-[30px] top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  node.status === 'done'
                    ? 'bg-emerald-400 border-emerald-300'
                    : node.status === 'current'
                    ? 'bg-amber-400 border-amber-300 animate-pulse'
                    : 'bg-gray-700 border-gray-600'
                }`}>
                  {node.status === 'done' ? (
                    <CheckCircle2 size={10} className="text-[#0a1628]" />
                  ) : node.status === 'current' ? (
                    <Circle size={10} className="text-[#0a1628]" fill="currentColor" />
                  ) : (
                    <HelpCircle size={10} className="text-gray-500" />
                  )}
                </div>

                <div className={`p-3 rounded-xl border ${
                  node.status === 'locked'
                    ? 'bg-white/[0.02] border-white/5 opacity-60'
                    : node.status === 'current'
                    ? 'bg-amber-500/5 border-amber-500/20'
                    : 'bg-white/5 border-white/10'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        node.type === 'mail'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      }`}>
                        {node.type === 'mail' ? '📧 邮件' : '🌟 事件'}
                      </span>
                      <span className="text-xs font-medium">
                        {node.status === 'locked' ? '???' : node.title}
                      </span>
                    </div>
                    <span className={`text-[10px] ${
                      node.status === 'done' ? 'text-emerald-400' :
                      node.status === 'current' ? 'text-amber-400' : 'text-gray-600'
                    }`}>
                      {node.status === 'done' ? '已完成' :
                       node.status === 'current' ? '进行中' : '未解锁'}
                    </span>
                  </div>

                  {node.status !== 'locked' && (
                    <>
                      <p className="text-xs text-gray-300 leading-relaxed mb-2">
                        {node.description.length > 100
                          ? `${node.description.slice(0, 100)}…`
                          : node.description}
                      </p>
                      {node.choiceText && (
                        <p className="text-[10px] text-cyan-300 italic bg-cyan-500/5 p-2 rounded-lg border border-cyan-500/10">
                          你的选择："{node.choiceText}"
                        </p>
                      )}
                      {node.timestamp && (
                        <p className="text-[10px] text-gray-500 mt-1">
                          {new Date(node.timestamp).toLocaleString()}
                        </p>
                      )}
                    </>
                  )}

                  {node.status === 'current' && node.vagueHint && (
                    <div className="mt-2 p-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
                      <p className="text-[10px] text-amber-300 flex items-start gap-1">
                        <HelpCircle size={10} className="mt-0.5 flex-shrink-0" />
                        <span>{node.vagueHint}</span>
                      </p>
                    </div>
                  )}

                  {node.status === 'locked' && (
                    <p className="text-[10px] text-gray-600">
                      完成上一步后继续……
                    </p>
                  )}

                  {idx < chain.subsequentEvents.length && idx > 0 && chain.subsequentEvents[idx - 1] && (
                    <div className="mt-2 pt-2 border-t border-white/5">
                      <p className="text-[10px] text-gray-600">
                        触发方式：{delayNames[chain.subsequentEvents[idx - 1].delay] || chain.subsequentEvents[idx - 1].delay}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
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

function PlanetDetailModal({
  planet,
  onClose,
  reputation
}: {
  planet: Planet;
  onClose: () => void;
  reputation: number;
}) {
  const factionColors: Record<string, string> = {
    '织星族': '#c77dff',
    '自由联盟': '#d4a84b',
    '暗影教团': '#5b4b8a',
    '科技议会': '#4cc9f0',
    '银河议会': '#ef476f',
    '未知': '#06d6a0'
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
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="font-semibold" style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}>
            {planet.name}
          </h3>
          <button
            onClick={onClose}
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
                background: `radial-gradient(circle at 30% 30%, ${planet.color}, ${planet.color}88 60%, ${planet.color}44)`,
                boxShadow: `0 0 40px ${planet.color}66`
              }}
            >
              🪐
            </div>
          </div>

          <div className="space-y-3">
            <InfoRow label="所属阵营" value={planet.faction} color={factionColors[planet.faction]} />
            <InfoRow label="当前状态" value={planet.status} />
            <InfoRow
              label="声望"
              value={`${reputation}`}
              color={reputation >= 0 ? '#4cc9f0' : '#ef476f'}
            />
          </div>

          <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
              <MapPin size={12} />
              星球简介
            </p>
            <p className="text-sm text-gray-200 leading-relaxed">
              {planet.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TravelConfirmModal({
  route,
  fromPlanet,
  toPlanet,
  onConfirm,
  onCancel
}: {
  route: PlanetRoute;
  fromPlanet: Planet;
  toPlanet: Planet;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const riskColor = getRiskColor(route.riskLevel);
  const riskText = getRiskText(route.riskLevel);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-[480px] rounded-3xl overflow-hidden bg-[#0a1628] border border-white/10"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="font-semibold flex items-center gap-2" style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}>
            <Navigation size={18} className="text-cyan-400" />
            确认航线
          </h3>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="text-center flex-1">
              <div
                className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                style={{ background: `radial-gradient(circle at 30% 30%, ${fromPlanet.color}, ${fromPlanet.color}88)` }}
              >
                🪐
              </div>
              <p className="text-sm font-medium">{fromPlanet.name}</p>
              <p className="text-[10px] text-gray-500">出发</p>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <Rocket size={20} className="text-cyan-400 mb-1" />
              <p className="text-[10px] text-cyan-400">{route.distance} 光年</p>
            </div>
            <div className="text-center flex-1">
              <div
                className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                style={{ background: `radial-gradient(circle at 30% 30%, ${toPlanet.color}, ${toPlanet.color}88)` }}
              >
                🪐
              </div>
              <p className="text-sm font-medium">{toPlanet.name}</p>
              <p className="text-[10px] text-gray-500">目的地</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                <AlertTriangle size={12} style={{ color: riskColor }} />
                风险等级
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: riskColor, boxShadow: `0 0 10px ${riskColor}` }}
                />
                <span className="text-sm font-medium" style={{ color: riskColor }}>
                  {riskText}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                <Clock size={12} className="text-gray-400" />
                预计时间
              </p>
              <p className="text-sm font-medium">{route.estimatedTime}</p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-gray-400 mb-2">可能遇到的事件</p>
              <div className="flex flex-wrap gap-1">
                {route.possibleEvents.map((evt, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10"
                  >
                    {getEventTypeText(evt)}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
              <p className="text-xs text-cyan-400/70 mb-1">航线描述</p>
              <p className="text-sm text-cyan-200/80">{route.routeDescription}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium transition-colors"
            >
              取消
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#0a1628] text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Rocket size={16} />
              开始航行
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TravelLogsModal({
  logs,
  onClose,
  onSelectLog,
  formatDuration
}: {
  logs: any[];
  onClose: () => void;
  onSelectLog: (id: string) => void;
  formatDuration: (ms: number) => string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-[480px] h-[70vh] rounded-t-3xl overflow-hidden bg-[#0a1628] border-t border-white/10 flex flex-col"
        style={{ animation: 'slideUp 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/10 bg-[#0a1628]">
          <h3 className="font-semibold flex items-center gap-2" style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}>
            <Scroll size={18} className="text-amber-400" />
            航行日志
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {logs.length === 0 ? (
            <div className="py-20 text-center">
              <Scroll size={48} className="mx-auto mb-3 opacity-30 text-gray-600" />
              <p className="text-sm text-gray-500">暂无航行记录</p>
              <p className="text-xs text-gray-600 mt-1">开始星际航行后记录将出现在这里</p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log, idx) => (
                <button
                  key={log.id}
                  onClick={() => onSelectLog(log.id)}
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🚀</span>
                      <div>
                        <p className="text-sm font-medium">
                          {log.fromPlanetName} → {log.toPlanetName}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          航行 #{logs.length - idx}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-500" />
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(log.departureTime).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {formatDuration(log.arrivalTime - log.departureTime)}
                    </span>
                    <span
                      className="px-1.5 py-0.5 rounded"
                      style={{
                        background: `${getRiskColor(log.routeRisk)}20`,
                        color: getRiskColor(log.routeRisk)
                      }}
                    >
                      {getRiskText(log.routeRisk)}
                    </span>
                  </div>
                  {log.eventsEncountered.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/5">
                      <p className="text-[10px] text-gray-500 mb-1">遇到事件：</p>
                      <div className="flex flex-wrap gap-1">
                        {log.eventsEncountered.map((evt: any, i: number) => (
                          <span
                            key={i}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400"
                          >
                            {evt.eventTitle}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TravelLogDetailModal({
  log,
  onClose,
  formatDuration
}: {
  log: any;
  onClose: () => void;
  formatDuration: (ms: number) => string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-[480px] h-[80vh] rounded-t-3xl overflow-hidden bg-[#0a1628] border-t border-white/10 flex flex-col"
        style={{ animation: 'slideUp 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/10 bg-[#0a1628]">
          <h3 className="font-semibold" style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}>
            航行详情
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
            <div className="flex items-center justify-between mb-4">
              <div className="text-center flex-1">
                <p className="text-xs text-gray-400 mb-1">出发</p>
                <p className="text-sm font-semibold text-cyan-300">{log.fromPlanetName}</p>
              </div>
              <div className="px-4">
                <Rocket size={20} className="text-cyan-400" />
              </div>
              <div className="text-center flex-1">
                <p className="text-xs text-gray-400 mb-1">到达</p>
                <p className="text-sm font-semibold text-purple-300">{log.toPlanetName}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[10px] text-gray-500">航行用时</p>
                <p className="text-sm font-medium">{formatDuration(log.arrivalTime - log.departureTime)}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500">风险等级</p>
                <p className="text-sm font-medium" style={{ color: getRiskColor(log.routeRisk) }}>
                  {getRiskText(log.routeRisk)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500">事件数</p>
                <p className="text-sm font-medium">{log.eventsEncountered.length}</p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-[10px] text-gray-500 mb-1">出发时间</p>
            <p className="text-sm">{new Date(log.departureTime).toLocaleString()}</p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <p className="text-[10px] text-gray-500 mb-1">到达时间</p>
            <p className="text-sm">{new Date(log.arrivalTime).toLocaleString()}</p>
          </div>

          {log.eventsEncountered.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-400" />
                航行中遇到的事件
              </h4>
              <div className="space-y-3">
                {log.eventsEncountered.map((evt: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {evt.eventType === 'storm' ? '🌪️' :
                           evt.eventType === 'merchant' ? '🛸' :
                           evt.eventType === 'distress' ? '🆘' :
                           evt.eventType === 'discovery' ? '✨' :
                           evt.eventType === 'pirate' ? '☠️' : '🌟'}
                        </span>
                        <div>
                          <p className="text-sm font-medium">{evt.eventTitle}</p>
                          <p className="text-[10px] text-gray-500">
                            {new Date(evt.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400">
                        {getEventTypeText(evt.eventType)}
                      </span>
                    </div>
                    <div className="ml-7">
                      <p className="text-xs text-gray-400 mb-1">你的选择：</p>
                      <p className="text-sm text-gray-200 mb-2">"{evt.choiceText}"</p>
                      {evt.effects.length > 0 && (
                        <>
                          <p className="text-xs text-gray-500 mb-1">产生的影响：</p>
                          <div className="flex flex-wrap gap-1">
                            {evt.effects.map((eff: string, i: number) => {
                              const [type, value] = eff.split(':');
                              return (
                                <span
                                  key={i}
                                  className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400"
                                >
                                  {type}:{value?.slice(0, 8)}
                                </span>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(log.rewards.items.length > 0 || log.rewards.clues.length > 0 || log.rewards.reputationChanges.length > 0) && (
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Sparkles size={14} className="text-emerald-400" />
                本次收获
              </h4>
              <div className="space-y-2">
                {log.rewards.items.length > 0 && (
                  <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <p className="text-[10px] text-emerald-400/70 mb-1">获得物品</p>
                    <p className="text-sm text-emerald-300">{log.rewards.items.join(', ')}</p>
                  </div>
                )}
                {log.rewards.clues.length > 0 && (
                  <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
                    <p className="text-[10px] text-cyan-400/70 mb-1">获得线索</p>
                    <p className="text-sm text-cyan-300">{log.rewards.clues.join(', ')}</p>
                  </div>
                )}
                {log.rewards.reputationChanges.length > 0 && (
                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <p className="text-[10px] text-amber-400/70 mb-1">声望变化</p>
                    {log.rewards.reputationChanges.map((rep: any, i: number) => (
                      <p key={i} className={`text-sm ${rep.amount >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                        {rep.faction}: {rep.amount >= 0 ? '+' : ''}{rep.amount}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Sparkles({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
