import { create } from 'zustand';
import type {
  PlayerSave,
  GameSettings,
  Mail,
  Notification,
  PlayerChoice,
  RandomEvent,
  ChoiceEffect,
  TravelLog,
  TravelLogEvent
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
import { chapters, getSceneById } from '@/data/chapters';
import { applyEffects, tryCombineItems } from '@/utils/conditions';
import { mailTemplates, checkMailTrigger, createMailFromTemplate } from '@/data/mails';
import { randomEvents, eventChains, getRouteBetweenPlanets } from '@/data/events';
import { endings } from '@/data/endings';
import { checkCondition } from '@/utils/conditions';

interface GameState {
  save: PlayerSave;
  settings: GameSettings;
  notifications: Notification[];
  isPlaying: boolean;
  isReplayMode: boolean;
  replayChapterId: string | null;
  currentEvent: RandomEvent | null;
  bgmPlaying: boolean;
  pendingTravelLog: TravelLog | null;
  pendingEventChainTriggers: { eventId: string; delay: string }[];

  initSave: () => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  setCurrentScene: (chapterId: string, sceneId: string) => void;
  setDialogueIndex: (index: number) => void;
  makeChoice: (choice: PlayerChoice, effects: unknown[]) => void;
  addMail: (mail: Mail) => void;
  markMailRead: (mailId: string) => void;
  replyMail: (mailId: string, replyId: string, effects: unknown[]) => void;
  checkAndTriggerMails: () => void;
  addItemToInventory: (itemId: string, fromChoice?: string) => void;
  removeItemFromInventory: (itemId: string) => void;
  combineItems: (item1Id: string, item2Id: string, resultId: string, description: string) => boolean;
  completeChapter: (chapterId: string) => void;
  unlockChapter: (chapterId: string) => void;
  checkEndingUnlocks: () => void;
  startReplay: (chapterId: string) => void;
  exitReplay: () => void;
  triggerRandomEvent: (location: string) => boolean;
  handleEventChoice: (choiceId: string) => void;
  closeEvent: () => void;
  startTravel: (fromPlanetId: string, fromPlanetName: string, toPlanetId: string, toPlanetName: string) => void;
  completeTravel: () => void;
  addEventToTravelLog: (eventId: string, eventTitle: string, eventType: string, choiceId: string, choiceText: string, effects: string[]) => void;
  checkEventChainTriggers: (choiceId: string) => void;
  processPendingEventChains: (trigger: 'travel' | 'chapter') => void;
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
  toggleBgm: () => void;
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

  const welcomeTemplate = mailTemplates.find((m) => m.id === 'welcome_mail');

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
    mails: welcomeTemplate ? [createMailFromTemplate(welcomeTemplate)] : [],
    travelLogs: [],
    currentPlanetId: 'planet_weaver',
    eventChainProgress: {},
    playTime: 0,
    settings: defaultSettings
  };
};

export const useGameStore = create<GameState>((set, get) => ({
  save: getAutoSave() || createInitialSave(),
  settings: getSettings(),
  notifications: [],
  isPlaying: false,
  isReplayMode: false,
  replayChapterId: null,
  currentEvent: null,
  bgmPlaying: false,
  pendingTravelLog: null,
  pendingEventChainTriggers: [],

  initSave: () => {
    const autoSave = getAutoSave();
    if (!autoSave) {
      const newSave = createInitialSave();
      set({ save: newSave });
    } else {
      const state = get();
      if (state.settings.bgmEnabled && !state.bgmPlaying) {
        set({ bgmPlaying: true });
      }
    }
  },

  updateSettings: (partialSettings) => {
    const newSettings = { ...get().settings, ...partialSettings };
    set({ settings: newSettings });
    saveSettings(newSettings);

    if (partialSettings.bgmEnabled !== undefined) {
      set({ bgmPlaying: partialSettings.bgmEnabled });
    }
  },

  setCurrentScene: (chapterId, sceneId) => {
    set((state) => {
      const isReplay = state.isReplayMode && state.replayChapterId === chapterId;

      if (isReplay) {
        return {
          save: {
            ...state.save,
            currentChapterId: chapterId,
            currentSceneId: sceneId,
            currentDialogueIndex: 0
          },
          isPlaying: true
        };
      }

      return {
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
      };
    });
  },

  setDialogueIndex: (index) => {
    set((state) => ({
      save: { ...state.save, currentDialogueIndex: index }
    }));
  },

  makeChoice: (choice, effects) => {
    set((state) => {
      const isReplay = state.isReplayMode;

      if (isReplay) {
        return {
          save: {
            ...state.save,
            currentDialogueIndex: 0
          }
        };
      }

      const effectResult = applyEffects(
        effects as Parameters<typeof applyEffects>[0],
        state.save
      );
      const choiceWithSource: PlayerChoice = {
        ...choice,
        source: choice.source || 'main_story'
      };
      const newSave = {
        ...effectResult.save,
        choices: [...state.save.choices, choiceWithSource]
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

    setTimeout(() => {
      get().checkAndTriggerMails();
      get().checkEndingUnlocks();
    }, 500);

    if (get().settings.autoSave) {
      setTimeout(() => get().autoSaveGame(), 1000);
    }
  },

  addMail: (mail) => {
    set((state) => ({
      save: {
        ...state.save,
        mails: [...state.save.mails, mail]
      },
      notifications: [
        ...state.notifications,
        {
          id: `notif_${Date.now()}`,
          type: 'mail',
          title: '收到新邮件',
          message: mail.subject,
          icon: '✉️',
          timestamp: Date.now()
        }
      ]
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

    if (get().settings.autoSave) {
      setTimeout(() => get().autoSaveGame(), 500);
    }
  },

  replyMail: (mailId, replyId, effects) => {
    set((state) => {
      const effectResult = applyEffects(
        effects as Parameters<typeof applyEffects>[0],
        state.save
      );

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

      const mail = state.save.mails.find(m => m.id === mailId);
      const replyText = mail?.replyOptions?.find(r => r.id === replyId)?.text || '回复邮件';
      const replyChoice: PlayerChoice = {
        id: `choice_${Date.now()}`,
        source: 'mail_reply',
        chapterId: 'mailbox',
        sceneId: `mail_${mailId}`,
        choiceId: replyId,
        choiceText: replyText,
        timestamp: Date.now(),
        isKeyChoice: false,
        consequences: (effects as { type: string; target?: string; value?: unknown }[])
          .map((e) => `${e.type}:${e.target || e.value}`),
        context: mail?.subject || '回复邮件'
      };

      return {
        save: {
          ...effectResult.save,
          choices: [...state.save.choices, replyChoice],
          mails: state.save.mails.map((m) =>
            m.id === mailId ? { ...m, replied: true, selectedReply: replyId } : m
          )
        },
        notifications
      };
    });

    setTimeout(() => {
      get().checkAndTriggerMails();
      get().checkEndingUnlocks();
      if (get().settings.autoSave) {
        get().autoSaveGame();
      }
    }, 500);
  },

  checkAndTriggerMails: () => {
    const state = get();
    const triggeredMails: Mail[] = [];

    for (const template of mailTemplates) {
      if (checkMailTrigger(template, state.save)) {
        triggeredMails.push(createMailFromTemplate(template));
      }
    }

    if (triggeredMails.length > 0) {
      set((state) => {
        const notifications: Notification[] = [...state.notifications];
        const newMails: Mail[] = [...state.save.mails];

        for (const mail of triggeredMails) {
          newMails.push(mail);
          notifications.push({
            id: `notif_${Date.now()}_${Math.random()}`,
            type: 'mail',
            title: mail.type === 'hidden' ? '收到神秘邮件' : '收到新邮件',
            message: mail.subject,
            icon: '✉️',
            timestamp: Date.now()
          });
        }

        return {
          save: { ...state.save, mails: newMails },
          notifications
        };
      });
    }
  },

  addItemToInventory: (itemId, fromChoice) => {
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
            { itemId, quantity: 1, obtainedAt: Date.now(), fromChoice }
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
    set((state) => {
      const chapterIndex = chapters.findIndex((c) => c.id === chapterId);
      const nextChapter = chapters[chapterIndex + 1];

      const newProgress = { ...state.save.chapterProgress };
      newProgress[chapterId] = {
        ...newProgress[chapterId],
        completed: true
      };

      if (nextChapter) {
        newProgress[nextChapter.id] = {
          chapterId: nextChapter.id,
          unlocked: true,
          completed: false,
          currentSceneId: nextChapter.scenes[0]?.id || '',
          visitedScenes: []
        };
      }

      return {
        save: {
          ...state.save,
          chapterProgress: newProgress
        }
      };
    });

    setTimeout(() => {
      get().checkAndTriggerMails();
      get().checkEndingUnlocks();
      if (get().settings.autoSave) {
        get().autoSaveGame();
      }
    }, 500);
  },

  unlockChapter: (chapterId) => {
    set((state) => {
      const chapter = chapters.find((c) => c.id === chapterId);
      if (!chapter) return state;

      if (state.save.chapterProgress[chapterId]?.unlocked) return state;

      return {
        save: {
          ...state.save,
          chapterProgress: {
            ...state.save.chapterProgress,
            [chapterId]: {
              chapterId,
              unlocked: true,
              completed: false,
              currentSceneId: chapter.scenes[0]?.id || '',
              visitedScenes: []
            }
          }
        }
      };
    });
  },

  checkEndingUnlocks: () => {
    const state = get();
    const newlyUnlocked: string[] = [];

    for (const ending of endings) {
      if (state.save.unlockedEndings.includes(ending.id)) continue;

      const allConditionsMet = ending.unlockConditions.every((cond) =>
        checkCondition(cond, state.save)
      );

      if (allConditionsMet) {
        newlyUnlocked.push(ending.id);
      }
    }

    if (newlyUnlocked.length > 0) {
      set((state) => {
        const notifications: Notification[] = [...state.notifications];
        const newUnlockedEndings = [...state.save.unlockedEndings];

        for (const endingId of newlyUnlocked) {
          newUnlockedEndings.push(endingId);
          const ending = endings.find((e) => e.id === endingId);
          notifications.push({
            id: `notif_${Date.now()}_${Math.random()}`,
            type: 'ending',
            title: '结局解锁',
            message: ending?.title || endingId,
            icon: ending?.thumbnail,
            timestamp: Date.now()
          });
        }

        return {
          save: { ...state.save, unlockedEndings: newUnlockedEndings },
          notifications
        };
      });
    }
  },

  startReplay: (chapterId) => {
    const chapter = chapters.find((c) => c.id === chapterId);
    if (!chapter) return;

    const firstScene = chapter.scenes[0];
    if (!firstScene) return;

    set((state) => ({
      isReplayMode: true,
      replayChapterId: chapterId,
      save: {
        ...state.save,
        currentChapterId: chapterId,
        currentSceneId: firstScene.id,
        currentDialogueIndex: 0
      },
      isPlaying: true
    }));
  },

  exitReplay: () => {
    set((state) => ({
      isReplayMode: false,
      replayChapterId: null,
      isPlaying: false,
      save: {
        ...state.save,
        currentChapterId: null,
        currentSceneId: null,
        currentDialogueIndex: 0
      }
    }));
  },

  triggerRandomEvent: (location) => {
    const state = get();
    if (state.isReplayMode || state.currentEvent) return false;

    const availableEvents = randomEvents.filter(
      (e) =>
        e.triggerLocation.includes(location) &&
        Math.random() < e.probability &&
        !state.save.choices.some((c) => c.sceneId.startsWith(`event_${e.id}`))
    );

    if (availableEvents.length === 0) return false;

    const event = availableEvents[Math.floor(Math.random() * availableEvents.length)];
    set({ currentEvent: event });
    return true;
  },

  handleEventChoice: (choiceId) => {
    const state = get();
    if (!state.currentEvent) return;

    const choice = state.currentEvent.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    set((state) => {
      if (!state.currentEvent) return state;

      const effectResult = applyEffects(
        choice.effects as ChoiceEffect[],
        state.save
      );

      const eventEffects = choice.effects.map((e) => `${e.type}:${e.target || e.value}`);
      const playerChoice: PlayerChoice = {
        id: `choice_${Date.now()}`,
        source: 'navigation',
        chapterId: 'events',
        sceneId: `event_${state.currentEvent.id}`,
        choiceId: choice.id,
        choiceText: choice.text,
        timestamp: Date.now(),
        isKeyChoice: choice.isKeyChoice,
        consequences: eventEffects,
        context: state.currentEvent.title
      };

      if (state.pendingTravelLog) {
        get().addEventToTravelLog(
          state.currentEvent.id,
          state.currentEvent.title,
          state.currentEvent.eventType,
          choice.id,
          choice.text,
          eventEffects
        );
      }

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

      return {
        save: {
          ...effectResult.save,
          choices: [...state.save.choices, playerChoice]
        },
        currentEvent: null,
        notifications
      };
    });

    setTimeout(() => {
      get().checkAndTriggerMails();
      get().checkEndingUnlocks();
      get().checkEventChainTriggers(choiceId);
      if (get().settings.autoSave) {
        get().autoSaveGame();
      }
    }, 500);
  },

  closeEvent: () => {
    set({ currentEvent: null });
  },

  unlockEnding: (endingId) => {
    set((state) => {
      if (state.save.unlockedEndings.includes(endingId)) {
        return state;
      }
      const ending = endings.find((e) => e.id === endingId);
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
            message: ending?.title || endingId,
            icon: ending?.thumbnail,
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
    setTimeout(() => {
      get().checkAndTriggerMails();
      get().checkEndingUnlocks();
    }, 1000);
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
      setTimeout(() => {
        get().checkAndTriggerMails();
        get().checkEndingUnlocks();
      }, 1000);
    }
  },

  newGame: () => {
    const newSave = createInitialSave();
    set({ save: newSave, isPlaying: false, isReplayMode: false, replayChapterId: null });
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
  },

  startTravel: (fromPlanetId, fromPlanetName, toPlanetId, toPlanetName) => {
    const route = getRouteBetweenPlanets(fromPlanetId, toPlanetId);
    set({
      pendingTravelLog: {
        id: `travel_${Date.now()}`,
        fromPlanetId,
        fromPlanetName,
        toPlanetId,
        toPlanetName,
        departureTime: Date.now(),
        arrivalTime: 0,
        routeRisk: route?.riskLevel || 'low',
        eventsEncountered: [],
        rewards: { items: [], clues: [], reputationChanges: [] }
      }
    });
  },

  completeTravel: () => {
    set((state) => {
      if (!state.pendingTravelLog) return state;

      const completedLog: TravelLog = {
        ...state.pendingTravelLog,
        arrivalTime: Date.now()
      };

      return {
        save: {
          ...state.save,
          currentPlanetId: state.pendingTravelLog.toPlanetId,
          travelLogs: [completedLog, ...state.save.travelLogs]
        },
        pendingTravelLog: null
      };
    });

    setTimeout(() => {
      get().processPendingEventChains('travel');
      if (get().settings.autoSave) {
        get().autoSaveGame();
      }
    }, 300);
  },

  addEventToTravelLog: (eventId, eventTitle, eventType, choiceId, choiceText, effects) => {
    set((state) => {
      if (!state.pendingTravelLog) return state;

      const logEvent: TravelLogEvent = {
        eventId,
        eventTitle,
        eventType: eventType as TravelLogEvent['eventType'],
        choiceId,
        choiceText,
        effects,
        timestamp: Date.now()
      };

      return {
        pendingTravelLog: {
          ...state.pendingTravelLog,
          eventsEncountered: [...state.pendingTravelLog.eventsEncountered, logEvent]
        }
      };
    });
  },

  checkEventChainTriggers: (choiceId) => {
    const state = get();
    const pending: { eventId: string; delay: string }[] = [];

    for (const chain of eventChains) {
      for (const sub of chain.subsequentEvents) {
        if (sub.triggerChoiceId === choiceId) {
          if (sub.delay === 'immediate') {
            const event = randomEvents.find(e => e.id === sub.nextEventId);
            if (event) {
              set({ currentEvent: event });
            }
          } else if (sub.delay === 'delayed_mail') {
            const mailTemplate = mailTemplates.find(m => m.id === sub.nextEventId);
            if (mailTemplate && !state.save.mails.some(m => m.id === mailTemplate.id)) {
              get().addMail(createMailFromTemplate(mailTemplate));
            }
          } else {
            pending.push({ eventId: sub.nextEventId, delay: sub.delay });
          }
        }
      }
    }

    if (pending.length > 0) {
      set((state) => ({
        pendingEventChainTriggers: [...state.pendingEventChainTriggers, ...pending]
      }));
    }
  },

  processPendingEventChains: (trigger) => {
    const state = get();
    const delayType = trigger === 'travel' ? 'next_travel' : 'next_chapter';
    const toProcess = state.pendingEventChainTriggers.filter(p => p.delay === delayType);
    const remaining = state.pendingEventChainTriggers.filter(p => p.delay !== delayType);

    if (toProcess.length > 0) {
      const event = randomEvents.find(e => e.id === toProcess[0].eventId);
      if (event && !state.currentEvent) {
        set({
          currentEvent: event,
          pendingEventChainTriggers: toProcess.length > 1 ? [...toProcess.slice(1), ...remaining] : remaining
        });
      } else {
        set({ pendingEventChainTriggers: remaining });
      }
    }
  },

  combineItems: (item1Id, item2Id, resultId, description) => {
    const state = get();
    const result = tryCombineItems(item1Id, item2Id);

    if (!result.success || result.result?.id !== resultId) return false;

    set((state) => {
      const newInventory = state.save.inventory.filter(i => i.itemId !== item1Id && i.itemId !== item2Id);
      const existing = newInventory.find(i => i.itemId === resultId);
      if (existing) {
        existing.quantity += 1;
      } else {
        newInventory.push({ itemId: resultId, quantity: 1, obtainedAt: Date.now() });
      }

      const combineChoice: PlayerChoice = {
        id: `choice_${Date.now()}`,
        source: 'item_combine',
        chapterId: 'inventory',
        sceneId: `combine_${item1Id}_${item2Id}`,
        choiceId: `combine_${resultId}`,
        choiceText: description,
        timestamp: Date.now(),
        isKeyChoice: false,
        consequences: [`item:${resultId}`],
        context: '物品合成'
      };

      return {
        save: {
          ...state.save,
          inventory: newInventory,
          choices: [...state.save.choices, combineChoice]
        },
        notifications: [
          ...state.notifications,
          {
            id: `notif_${Date.now()}`,
            type: 'item',
            title: '合成成功',
            message: result.description || '获得新物品',
            timestamp: Date.now()
          }
        ]
      };
    });

    setTimeout(() => {
      if (get().settings.autoSave) {
        get().autoSaveGame();
      }
    }, 500);

    return true;
  },

  toggleBgm: () => {
    set((state) => ({
      bgmPlaying: !state.bgmPlaying,
      settings: {
        ...state.settings,
        bgmEnabled: !state.bgmPlaying
      }
    }));
  }
}));

function getNotificationTitle(type: string): string {
  switch (type) {
    case 'item':
      return '获得物品';
    case 'clue':
      return '发现线索';
    case 'achievement':
      return '成就解锁';
    case 'ending':
      return '结局解锁';
    case 'mail':
      return '收到新邮件';
    default:
      return '通知';
  }
}
