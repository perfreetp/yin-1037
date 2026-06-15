import { create } from 'zustand';
import type {
  PlayerSave,
  GameSettings,
  Mail,
  Notification,
  PlayerChoice
} from '@/types';
import {
  defaultSettings,
  getSettings,
  saveSettings,
  getAutoSave,
  setAutoSave,
  getManualSaves,
  saveManualSave,
  generateSaveId
} from '@/utils/storage';
import { chapters } from '@/data/chapters';
import { applyEffects } from '@/utils/conditions';

interface GameState {
  save: PlayerSave;
  settings: GameSettings;
  notifications: Notification[];
  isPlaying: boolean;

  initSave: () => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  setCurrentScene: (chapterId: string, sceneId: string) => void;
  setDialogueIndex: (index: number) => void;
  makeChoice: (choice: PlayerChoice, effects: unknown[]) => void;
  addMail: (mail: Mail) => void;
  markMailRead: (mailId: string) => void;
  replyMail: (mailId: string, replyId: string, effects: unknown[]) => void;
  addItemToInventory: (itemId: string) => void;
  removeItemFromInventory: (itemId: string) => void;
  completeChapter: (chapterId: string) => void;
  unlockEnding: (endingId: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  autoSaveGame: () => void;
  loadSave: (save: PlayerSave) => void;
  manualSave: (slot: number) => void;
  loadManualSave: (slot: number) => void;
  newGame: () => void;
  addClue: (clue: string) => void;
  unlockAchievement: (achievementId: string) => void;
}

const createInitialSave = (): PlayerSave => {
  const chapterProgress: PlayerSave['chapterProgress'] = {};
  for (const chapter of chapters) {
    if (chapter.unlockedByDefault) {
      chapterProgress[chapter.id] = {
        chapterId: chapter.id,
        unlocked: true,
        completed: false,
        currentSceneId: chapter.scenes[0]?.id || '',
        visitedScenes: []
      };
    }
  }

  return {
    id: generateSaveId(),
    timestamp: Date.now(),
    chapterProgress,
    currentChapterId: null,
    currentSceneId: null,
    currentDialogueIndex: 0,
    characterRelations: {},
    factionReputation: {},
    inventory: [],
    clues: [],
    unlockedEndings: [],
    achievements: [],
    choices: [],
    mails: [
      {
        id: 'welcome_mail',
        from: '银河信使协会',
        subject: '欢迎加入群星邮差！',
        content: '亲爱的新人信使：\n\n恭喜你从信使学院毕业！从今天起，你就是一名光荣的星际信使了。\n\n你的第一个任务已经分配，请查看任务列表。记住——每一封信都承载着一份希望，每一次投递都可能改变命运。\n\n愿星辰指引你的道路。\n\n银河信使协会',
        type: 'main',
        read: false,
        replied: false,
        timestamp: Date.now()
      }
    ],
    playTime: 0,
    settings: defaultSettings
  };
};

export const useGameStore = create<GameState>((set, get) => ({
  save: getAutoSave() || createInitialSave(),
  settings: getSettings(),
  notifications: [],
  isPlaying: false,

  initSave: () => {
    const autoSave = getAutoSave();
    if (!autoSave) {
      const newSave = createInitialSave();
      set({ save: newSave });
    }
  },

  updateSettings: (partialSettings) => {
    const newSettings = { ...get().settings, ...partialSettings };
    set({ settings: newSettings });
    saveSettings(newSettings);
  },

  setCurrentScene: (chapterId, sceneId) => {
    set((state) => ({
      save: {
        ...state.save,
        currentChapterId: chapterId,
        currentSceneId: sceneId,
        currentDialogueIndex: 0,
        chapterProgress: {
          ...state.save.chapterProgress,
          [chapterId]: {
            ...state.save.chapterProgress[chapterId],
            currentSceneId: sceneId,
            visitedScenes: [
              ...new Set([
                ...(state.save.chapterProgress[chapterId]?.visitedScenes || []),
                sceneId
              ])
            ]
          }
        }
      },
      isPlaying: true
    }));
  },

  setDialogueIndex: (index) => {
    set((state) => ({
      save: { ...state.save, currentDialogueIndex: index }
    }));
  },

  makeChoice: (choice, effects) => {
    set((state) => {
      const effectResult = applyEffects(effects as Parameters<typeof applyEffects>[0], state.save);
      const newSave = {
        ...effectResult.save,
        choices: [...state.save.choices, choice]
      };

      const notifications: Notification[] = [...state.notifications];
      for (const n of effectResult.notifications) {
        notifications.push({
          id: `notif_${Date.now()}_${Math.random()}`,
          type: n.type as Notification['type'],
          title: getNotificationTitle(n.type),
          message: n.value || '',
          timestamp: Date.now()
        });
      }

      return { save: newSave, notifications };
    });

    if (get().settings.autoSave) {
      get().autoSaveGame();
    }
  },

  addMail: (mail) => {
    set((state) => ({
      save: {
        ...state.save,
        mails: [...state.save.mails, mail]
      }
    }));
  },

  markMailRead: (mailId) => {
    set((state) => ({
      save: {
        ...state.save,
        mails: state.save.mails.map((m) =>
          m.id === mailId ? { ...m, read: true } : m
        )
      }
    }));
  },

  replyMail: (mailId, replyId, effects) => {
    set((state) => {
      const effectResult = applyEffects(effects as Parameters<typeof applyEffects>[0], state.save);
      return {
        save: {
          ...effectResult.save,
          mails: state.save.mails.map((m) =>
            m.id === mailId ? { ...m, replied: true, selectedReply: replyId } : m
          )
        }
      };
    });
  },

  addItemToInventory: (itemId) => {
    set((state) => {
      const existing = state.save.inventory.find((i) => i.itemId === itemId);
      if (existing) {
        return {
          save: {
            ...state.save,
            inventory: state.save.inventory.map((i) =>
              i.itemId === itemId ? { ...i, quantity: i.quantity + 1 } : i
            )
          }
        };
      }
      return {
        save: {
          ...state.save,
          inventory: [
            ...state.save.inventory,
            { itemId, quantity: 1, obtainedAt: Date.now() }
          ]
        }
      };
    });
  },

  removeItemFromInventory: (itemId) => {
    set((state) => ({
      save: {
        ...state.save,
        inventory: state.save.inventory.filter((i) => i.itemId !== itemId)
      }
    }));
  },

  completeChapter: (chapterId) => {
    set((state) => ({
      save: {
        ...state.save,
        chapterProgress: {
          ...state.save.chapterProgress,
          [chapterId]: {
            ...state.save.chapterProgress[chapterId],
            completed: true
          }
        }
      }
    }));
  },

  unlockEnding: (endingId) => {
    set((state) => {
      if (state.save.unlockedEndings.includes(endingId)) {
        return state;
      }
      return {
        save: {
          ...state.save,
          unlockedEndings: [...state.save.unlockedEndings, endingId]
        },
        notifications: [
          ...state.notifications,
          {
            id: `notif_${Date.now()}`,
            type: 'ending',
            title: '结局解锁',
            message: endingId,
            timestamp: Date.now()
          }
        ]
      };
    });
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id: `notif_${Date.now()}_${Math.random()}`,
          timestamp: Date.now()
        }
      ]
    }));
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    }));
  },

  autoSaveGame: () => {
    const state = get();
    const saveData = { ...state.save, timestamp: Date.now() };
    setAutoSave(saveData);
    set({ save: saveData });
  },

  loadSave: (saveData) => {
    set({ save: saveData });
  },

  manualSave: (slot) => {
    const state = get();
    const saveData = { ...state.save, timestamp: Date.now(), id: generateSaveId() };
    saveManualSave(saveData, slot);
  },

  loadManualSave: (slot) => {
    const saves = getManualSaves();
    if (saves[slot]) {
      set({ save: saves[slot] });
    }
  },

  newGame: () => {
    const newSave = createInitialSave();
    set({ save: newSave, isPlaying: false });
    setAutoSave(newSave);
  },

  addClue: (clue) => {
    set((state) => {
      if (state.save.clues.includes(clue)) return state;
      return {
        save: {
          ...state.save,
          clues: [...state.save.clues, clue]
        }
      };
    });
  },

  unlockAchievement: (achievementId) => {
    set((state) => {
      if (state.save.achievements.includes(achievementId)) return state;
      return {
        save: {
          ...state.save,
          achievements: [...state.save.achievements, achievementId]
        },
        notifications: [
          ...state.notifications,
          {
            id: `notif_${Date.now()}`,
            type: 'achievement',
            title: '成就解锁',
            message: achievementId,
            timestamp: Date.now()
          }
        ]
      };
    });
  }
}));

function getNotificationTitle(type: string): string {
  switch (type) {
    case 'item': return '获得物品';
    case 'clue': return '发现线索';
    case 'achievement': return '成就解锁';
    case 'ending': return '结局解锁';
    case 'mail': return '收到新邮件';
    default: return '通知';
  }
}
