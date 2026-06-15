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
import { X } from 'lucide-react';

export default function ChapterPlay() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const chapter = getChapterById(id || '');
  const { save, setCurrentScene, setDialogueIndex, makeChoice } = useGameStore();

  const currentSceneId =
    save.currentChapterId === id
      ? save.currentSceneId || chapter?.scenes[0]?.id
      : chapter?.scenes[0]?.id;

  const currentScene = chapter && currentSceneId ? getSceneById(chapter.id, currentSceneId) : null;

  const [dialogueIndex, setLocalDialogueIndex] = useState(0);

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

  const handleNext = useCallback(() => {
    if (!currentScene) return;
    if (dialogueIndex < currentScene.dialogues.length - 1) {
      setLocalDialogueIndex(dialogueIndex + 1);
    }
  }, [currentScene, dialogueIndex]);

  const handleSelectChoice = useCallback(
    (choice: Choice) => {
      if (!chapter || !currentScene) return;

      const playerChoice: PlayerChoice = {
        id: `choice_${Date.now()}`,
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
    },
    [chapter, currentScene, makeChoice, setCurrentScene]
  );

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

  const handleNextScene = () => {
    if (currentScene.nextScene) {
      setCurrentScene(chapter.id, currentScene.nextScene);
      setLocalDialogueIndex(0);
    }
  };

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
            onClick={() => navigate('/chapters')}
            className="p-2 -ml-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
          <h2
            className="flex-1 text-center text-sm font-medium text-gray-300"
            style={{ fontFamily: "'Cinzel', 'Noto Serif SC', serif" }}
          >
            {chapter.title}
          </h2>
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
      </div>
    </div>
  );
}
