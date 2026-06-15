import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { StarfieldBackground } from '@/components/layout/StarfieldBackground';
import { DialogueBox } from '@/components/game/DialogueBox';
import { ChoicePanel } from '@/components/game/ChoicePanel';
import { NotificationToast } from '@/components/game/NotificationToast';
import { useGameStore } from '@/store/gameStore';
import { getChapterById, getSceneById } from '@/data/chapters';
import { getCharacterById } from '@/data/characters';
import type { Choice, PlayerChoice } from '@/types';
import { X, Check, Trophy, RotateCcw, Home } from 'lucide-react';

export default function ChapterPlay() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const chapter = getChapterById(id || '');
  const {
    save,
    setCurrentScene,
    setDialogueIndex,
    makeChoice,
    completeChapter,
    exitReplay,
    isReplayMode,
    triggerRandomEvent
  } = useGameStore();

  const currentSceneId =
    save.currentChapterId === id
      ? save.currentSceneId || chapter?.scenes[0]?.id
      : chapter?.scenes[0]?.id;

  const currentScene = chapter && currentSceneId ? getSceneById(chapter.id, currentSceneId) : null;

  const [dialogueIndex, setLocalDialogueIndex] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionData, setCompletionData] = useState<{
    title: string;
    type: 'good' | 'neutral' | 'bad';
    unlockedChapter?: string;
  } | null>(null);

  const isEndingScene = currentScene?.id?.includes('_end');

  useEffect(() => {
    if (chapter && currentSceneId) {
      setCurrentScene(chapter.id, currentSceneId);
      setLocalDialogueIndex(
        save.currentChapterId === chapter.id ? save.currentDialogueIndex : 0
      );
    }
  }, [chapter?.id, currentSceneId]);

  useEffect(() => {
    setDialogueIndex(dialogueIndex);
  }, [dialogueIndex, setDialogueIndex]);

  useEffect(() => {
    if (isEndingScene && dialogueIndex >= (currentScene?.dialogues.length || 0) - 1) {
      const endingType = currentScene?.id.includes('_good')
        ? 'good'
        : currentScene?.id.includes('_bad')
        ? 'bad'
        : 'neutral';

      const nextChapter = chapter?.order ? `ch${chapter.order + 1}` : undefined;

      setCompletionData({
        title: endingType === 'good' ? '完美通关！' : endingType === 'bad' ? '任务失败' : '章节结束',
        type: endingType,
        unlockedChapter: nextChapter
      });

      if (!isReplayMode) {
        completeChapter(chapter!.id);
      }

      setShowCompletion(true);
    }
  }, [isEndingScene, dialogueIndex, currentScene, chapter, completeChapter, isReplayMode]);

  const handleNext = useCallback(() => {
    if (!currentScene) return;
    if (dialogueIndex < currentScene.dialogues.length - 1) {
      setLocalDialogueIndex(dialogueIndex + 1);
    }
  }, [currentScene, dialogueIndex]);

  const triggerRandomEventIfNeeded = useCallback(() => {
    if (isReplayMode) return false;
    return triggerRandomEvent('chapter_transition');
  }, [isReplayMode, triggerRandomEvent]);

  const handleSelectChoice = useCallback(
    (choice: Choice) => {
      if (!chapter || !currentScene) return;

      if (isEndingScene && choice.text.includes('返回章节列表')) {
        if (isReplayMode) {
          exitReplay();
        }
        navigate('/chapters');
        return;
      }

      const playerChoice: PlayerChoice = {
        id: `choice_${Date.now()}`,
        source: 'main_story',
        chapterId: chapter.id,
        sceneId: currentScene.id,
        choiceId: choice.id,
        choiceText: choice.text,
        timestamp: Date.now(),
        isKeyChoice: choice.isKeyChoice,
        consequences: choice.effects.map((e) => `${e.type}:${e.target || e.value}`)
      };

      makeChoice(playerChoice, choice.effects);
      setCurrentScene(chapter.id, choice.nextSceneId);
      setLocalDialogueIndex(0);

      setTimeout(() => {
        triggerRandomEventIfNeeded();
      }, 300);
    },
    [chapter, currentScene, makeChoice, setCurrentScene, isEndingScene, isReplayMode, exitReplay, navigate, triggerRandomEventIfNeeded]
  );

  const handleNextScene = () => {
    if (currentScene.nextScene) {
      setCurrentScene(chapter!.id, currentScene.nextScene);
      setLocalDialogueIndex(0);

      setTimeout(() => {
        triggerRandomEventIfNeeded();
      }, 300);
    }
  };

  const handleReturnToChapters = () => {
    if (isReplayMode) {
      exitReplay();
    }
    navigate('/chapters');
  };

  if (!chapter || !currentScene) {
    return (
      <div className="relative min-h-screen">
        <StarfieldBackground />
        <div className="flex items-center justify-center min-h-screen text-white">
          <div className="text-center">
            <p className="text-gray-400 mb-4">章节未找到</p>
            <button
              onClick={() => navigate('/chapters')}
              className="px-4 py-2 rounded-lg bg-white/10"
            >
              返回章节列表
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentDialogue = currentScene.dialogues[dialogueIndex];
  const isLastDialogue = dialogueIndex >= currentScene.dialogues.length - 1;
  const hasChoices = (currentScene.choices?.length || 0) > 0;
  const hasTimedChoice = !!currentScene.timedChoice;
  const showChoices = isLastDialogue && (hasChoices || hasTimedChoice);

  const isDialogueComplete = !showChoices && isLastDialogue && currentScene.nextScene;

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <StarfieldBackground />
      <NotificationToast />

      <div
        className="relative mx-auto max-w-[480px] min-h-screen flex flex-col"
        style={{
          background: `linear-gradient(180deg, rgba(10,22,40,0.3) 0%, rgba(10,22,40,0.9) 100%)`
        }}
      >
        <div className="relative h-14 flex items-center px-4 z-10">
          <button
            onClick={handleReturnToChapters}
            className="p-2 -ml-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex-1 text-center">
            <h2
              className="text-sm font-medium text-gray-300"
              style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}
            >
              {chapter.title}
            </h2>
            {isReplayMode && (
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <RotateCcw size={10} className="text-amber-400" />
                <span className="text-[10px] text-amber-400">回放模式 · 不影响存档</span>
              </div>
            )}
          </div>
          <div className="w-8" />
        </div>

        <div className="flex-1 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-9xl opacity-30" style={{ animation: 'float 6s ease-in-out infinite' }}>
              {currentScene.background}
            </div>
          </div>

          {currentScene.characterOnStage?.map((char, idx) => {
            const character = getCharacterById(char.characterId);
            if (!character) return null;
            const positionClasses =
              char.position === 'left'
                ? 'left-4'
                : char.position === 'right'
                ? 'right-4'
                : 'left-1/2 -translate-x-1/2';
            return (
              <div
                key={idx}
                className={`absolute top-20 ${positionClasses}`}
                style={{ animation: 'float 5s ease-in-out infinite', animationDelay: `${idx * 0.5}s` }}
              >
                <div className="text-7xl opacity-70">{character.portrait}</div>
              </div>
            );
          })}
        </div>

        <div className="relative min-h-[200px]">
          {currentDialogue && (
            <DialogueBox
              dialogue={currentDialogue}
              onNext={isDialogueComplete ? handleNextScene : handleNext}
              hasNext={!showChoices}
            />
          )}

          {showChoices && (
            <ChoicePanel
              choices={hasTimedChoice ? currentScene.timedChoice!.choices : currentScene.choices!}
              timedChoice={currentScene.timedChoice}
              onSelect={handleSelectChoice}
            />
          )}
        </div>

        {showCompletion && completionData && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleReturnToChapters}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <div
              className="relative w-full max-w-[400px] rounded-3xl overflow-hidden border border-white/10"
              style={{
                background: completionData.type === 'good'
                  ? 'linear-gradient(180deg, rgba(6,214,160,0.3) 0%, rgba(10,22,40,0.98) 100%)'
                  : completionData.type === 'bad'
                  ? 'linear-gradient(180deg, rgba(239,71,111,0.3) 0%, rgba(10,22,40,0.98) 100%)'
                  : 'linear-gradient(180deg, rgba(100,100,100,0.3) 0%, rgba(10,22,40,0.98) 100%)',
                animation: 'fadeIn 0.5s ease-out'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 text-center">
                <div className="mb-4">
                  {completionData.type === 'good' ? (
                    <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center" style={{ animation: 'pulse 2s ease-in-out infinite' }}>
                      <Trophy size={40} className="text-emerald-400" />
                    </div>
                  ) : completionData.type === 'bad' ? (
                    <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
                      <span className="text-4xl">💔</span>
                    </div>
                  ) : (
                    <div className="w-20 h-20 mx-auto rounded-full bg-gray-500/20 flex items-center justify-center">
                      <Check size={40} className="text-gray-400" />
                    </div>
                  )}
                </div>

                <h2
                  className={`text-2xl font-bold mb-2 ${
                    completionData.type === 'good'
                      ? 'text-emerald-400'
                      : completionData.type === 'bad'
                      ? 'text-red-400'
                      : 'text-gray-300'
                  }`}
                  style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}
                >
                  {completionData.title}
                </h2>

                <p className="text-sm text-gray-400 mb-6">
                  {chapter.title}
                </p>

                {!isReplayMode && completionData.type === 'good' && completionData.unlockedChapter && (
                  <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-sm text-amber-400 flex items-center justify-center gap-2">
                      <span>🔓</span>
                      新章节已解锁！
                    </p>
                  </div>
                )}

                {isReplayMode && (
                  <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="text-sm text-amber-400 flex items-center justify-center gap-2">
                      <RotateCcw size={14} />
                      回放模式 - 进度不会保存
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={handleReturnToChapters}
                    className="w-full py-4 px-6 rounded-xl font-medium text-white transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{
                      background: completionData.type === 'good'
                        ? 'linear-gradient(135deg, #06d6a0 0%, #118ab2 100%)'
                        : completionData.type === 'bad'
                        ? 'linear-gradient(135deg, #ef476f 0%, #9b2c47 100%)'
                        : 'linear-gradient(135deg, #5b4b8a 0%, #3a2e5a 100%)'
                    }}
                  >
                    <Home size={18} />
                    返回章节列表
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
