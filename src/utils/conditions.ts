import type {
  ChoiceCondition,
  ChoiceEffect,
  UnlockCondition,
  PlayerSave,
  RelationStatus
} from '@/types';
import { items } from '@/data/items';
import { chapters } from '@/data/chapters';

export const relationStatusMap: Record<number, RelationStatus> = {
  0: 'stranger',
  20: 'acquaintance',
  40: 'friend',
  60: 'ally',
  80: 'lover'
};

export const getRelationStatus = (affection: number, trust: number): RelationStatus => {
  const combined = (affection + trust) / 2;
  if (combined < 0) return 'enemy';
  if (combined >= 80) return 'lover';
  if (combined >= 60) return 'ally';
  if (combined >= 40) return 'friend';
  if (combined >= 20) return 'acquaintance';
  return 'stranger';
};

export const getRelationStatusName = (status: RelationStatus): string => {
  const names: Record<RelationStatus, string> = {
    stranger: '陌生人',
    acquaintance: '认识',
    friend: '朋友',
    ally: '盟友',
    lover: '挚友',
    enemy: '敌人'
  };
  return names[status];
};

export const checkCondition = (
  condition: ChoiceCondition | UnlockCondition,
  save: PlayerSave
): boolean => {
  const { type, target, value, operator = '==' } = condition;

  switch (type) {
    case 'affection': {
      const relation = save.characterRelations[target || ''];
      const actual = relation?.affection || 0;
      return compareValues(actual, Number(value), operator);
    }
    case 'trust': {
      const relation = save.characterRelations[target || ''];
      const actual = relation?.trust || 0;
      return compareValues(actual, Number(value), operator);
    }
    case 'reputation': {
      const actual = save.factionReputation[target || ''] || 0;
      return compareValues(actual, Number(value), operator);
    }
    case 'has_item': {
      return save.inventory.some(i => i.itemId === target);
    }
    case 'has_clue': {
      return save.clues.includes(target || '');
    }
    case 'choice_made': {
      return save.choices.some(c => c.choiceId === target);
    }
    case 'chapter_complete': {
      const progress = save.chapterProgress[target || ''];
      return progress?.completed || false;
    }
    case 'ending_unlocked': {
      return save.unlockedEndings.includes(target || '');
    }
    default:
      return true;
  }
};

const compareValues = (
  actual: number,
  expected: number,
  operator: string
): boolean => {
  switch (operator) {
    case '>':
      return actual > expected;
    case '<':
      return actual < expected;
    case '>=':
      return actual >= expected;
    case '<=':
      return actual <= expected;
    case '!=':
      return actual !== expected;
    default:
      return actual === expected;
  }
};

export const applyEffect = (effect: ChoiceEffect, save: PlayerSave): PlayerSave => {
  const newSave = { ...save };

  switch (effect.type) {
    case 'affection': {
      const charId = effect.target || '';
      if (!newSave.characterRelations[charId]) {
        newSave.characterRelations[charId] = {
          characterId: charId,
          affection: 0,
          trust: 0,
          status: 'stranger',
          unlockedSegments: []
        };
      }
      newSave.characterRelations[charId] = {
        ...newSave.characterRelations[charId],
        affection: Math.max(0, Math.min(100,
          newSave.characterRelations[charId].affection + (effect.amount || 0)
        ))
      };
      newSave.characterRelations[charId].status = getRelationStatus(
        newSave.characterRelations[charId].affection,
        newSave.characterRelations[charId].trust
      );
      break;
    }
    case 'trust': {
      const charId = effect.target || '';
      if (!newSave.characterRelations[charId]) {
        newSave.characterRelations[charId] = {
          characterId: charId,
          affection: 0,
          trust: 0,
          status: 'stranger',
          unlockedSegments: []
        };
      }
      newSave.characterRelations[charId] = {
        ...newSave.characterRelations[charId],
        trust: Math.max(0, Math.min(100,
          newSave.characterRelations[charId].trust + (effect.amount || 0)
        ))
      };
      newSave.characterRelations[charId].status = getRelationStatus(
        newSave.characterRelations[charId].affection,
        newSave.characterRelations[charId].trust
      );
      break;
    }
    case 'reputation': {
      const faction = effect.target || '';
      newSave.factionReputation[faction] =
        (newSave.factionReputation[faction] || 0) + (effect.amount || 0);
      break;
    }
    case 'item': {
      const itemId = String(effect.value || '');
      const existing = newSave.inventory.find(i => i.itemId === itemId);
      if (existing) {
        existing.quantity += 1;
      } else {
        newSave.inventory.push({
          itemId,
          quantity: 1,
          obtainedAt: Date.now()
        });
      }
      break;
    }
    case 'clue': {
      const clue = String(effect.value || '');
      if (!newSave.clues.includes(clue)) {
        newSave.clues.push(clue);
      }
      break;
    }
    case 'ending': {
      const endingId = String(effect.value || '');
      if (!newSave.unlockedEndings.includes(endingId)) {
        newSave.unlockedEndings.push(endingId);
      }
      break;
    }
    case 'unlock_chapter': {
      const chapterId = String(effect.value || '');
      if (!newSave.chapterProgress[chapterId]) {
        const chapter = chapters.find(c => c.id === chapterId);
        if (chapter) {
          newSave.chapterProgress[chapterId] = {
            chapterId,
            unlocked: true,
            completed: false,
            currentSceneId: chapter.scenes[0]?.id || '',
            visitedScenes: []
          };
        }
      } else {
        newSave.chapterProgress[chapterId].unlocked = true;
      }
      break;
    }
    case 'achievement': {
      const achievementId = String(effect.value || '');
      if (!newSave.achievements.includes(achievementId)) {
        newSave.achievements.push(achievementId);
      }
      break;
    }
    case 'mail': {
      break;
    }
  }

  return newSave;
};

export const applyEffects = (
  effects: ChoiceEffect[],
  save: PlayerSave
): { save: PlayerSave; notifications: { type: string; value?: string }[] } => {
  let newSave = save;
  const notifications: { type: string; value?: string }[] = [];

  for (const effect of effects) {
    newSave = applyEffect(effect, newSave);
    if (effect.type === 'item' || effect.type === 'clue' ||
        effect.type === 'achievement' || effect.type === 'ending') {
      notifications.push({ type: effect.type, value: String(effect.value) });
    }
  }

  return { save: newSave, notifications };
};

export const tryCombineItems = (
  item1Id: string,
  item2Id: string
): { success: boolean; result?: typeof items[0]; description?: string } => {
  const item1 = items.find(i => i.id === item1Id);
  const item2 = items.find(i => i.id === item2Id);

  if (!item1 || !item2) return { success: false };

  const allItems = [...items];
  for (const item of allItems) {
    if (item.combineRecipes) {
      for (const recipe of item.combineRecipes) {
        const ingredients = recipe.ingredients.sort();
        const input = [item1Id, item2Id].sort();
        if (ingredients[0] === input[0] && ingredients[1] === input[1]) {
          const resultItem = items.find(i => i.id === recipe.result);
          return {
            success: true,
            result: resultItem,
            description: recipe.description
          };
        }
      }
    }
  }

  return { success: false };
};
