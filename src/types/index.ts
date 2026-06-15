export interface GameSettings {
  textSpeed: number;
  bgmEnabled: boolean;
  sfxEnabled: boolean;
  spoilerFree: boolean;
  autoSave: boolean;
}

export interface ChapterProgress {
  chapterId: string;
  unlocked: boolean;
  completed: boolean;
  currentSceneId: string;
  visitedScenes: string[];
}

export type RelationStatus = 'stranger' | 'acquaintance' | 'friend' | 'ally' | 'lover' | 'enemy';

export interface CharacterRelation {
  characterId: string;
  affection: number;
  trust: number;
  status: RelationStatus;
  unlockedSegments: string[];
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
  obtainedAt: number;
  fromChoice?: string;
}

export interface PlayerChoice {
  id: string;
  chapterId: string;
  sceneId: string;
  choiceId: string;
  choiceText: string;
  timestamp: number;
  isKeyChoice: boolean;
  consequences: string[];
}

export type MailType = 'main' | 'side' | 'hidden';

export interface ReplyOption {
  id: string;
  text: string;
  effects: ChoiceEffect[];
}

export interface Mail {
  id: string;
  from: string;
  fromCharacterId?: string;
  subject: string;
  content: string;
  type: MailType;
  read: boolean;
  replied: boolean;
  replyOptions?: ReplyOption[];
  selectedReply?: string;
  timestamp: number;
}

export interface PlayerSave {
  id: string;
  timestamp: number;
  chapterProgress: Record<string, ChapterProgress>;
  currentChapterId: string | null;
  currentSceneId: string | null;
  currentDialogueIndex: number;
  characterRelations: Record<string, CharacterRelation>;
  factionReputation: Record<string, number>;
  inventory: InventoryItem[];
  clues: string[];
  unlockedEndings: string[];
  achievements: string[];
  choices: PlayerChoice[];
  mails: Mail[];
  playTime: number;
  settings: GameSettings;
}

export type DialogueEmotion = 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'mysterious';
export type TextEffect = 'normal' | 'shake' | 'glitch' | 'fade';

export interface Dialogue {
  id: string;
  speakerId?: string;
  speakerName?: string;
  text: string;
  emotion?: DialogueEmotion;
  textEffect?: TextEffect;
}

export interface CharacterOnStage {
  characterId: string;
  position: 'left' | 'center' | 'right';
  emotion?: DialogueEmotion;
}

export type ChoiceEffectType =
  | 'affection'
  | 'trust'
  | 'reputation'
  | 'item'
  | 'clue'
  | 'mail'
  | 'ending'
  | 'unlock_chapter'
  | 'achievement';

export interface ChoiceEffect {
  type: ChoiceEffectType;
  target?: string;
  value?: number | string;
  amount?: number;
}

export interface ChoiceCondition {
  type: 'affection' | 'trust' | 'reputation' | 'has_item' | 'has_clue' | 'choice_made' | 'ending_unlocked';
  target: string;
  operator?: '>' | '<' | '>=' | '<=' | '==' | '!=';
  value: number | string | boolean;
}

export interface Choice {
  id: string;
  text: string;
  isKeyChoice: boolean;
  condition?: ChoiceCondition;
  nextSceneId: string;
  effects: ChoiceEffect[];
}

export interface TimedChoice {
  timeLimit: number;
  choices: Choice[];
  defaultChoiceId: string;
}

export type EndingType = 'good' | 'neutral' | 'bad' | 'hidden' | 'true';

export interface UnlockCondition {
  type: 'chapter_complete' | 'affection' | 'trust' | 'reputation' | 'has_item' | 'choice_made' | 'ending_unlocked';
  target?: string;
  value?: number | string | boolean;
  operator?: '>' | '<' | '>=' | '<=' | '==' | '!=';
}

export interface Scene {
  id: string;
  chapterId: string;
  background: string;
  characterOnStage?: CharacterOnStage[];
  dialogues: Dialogue[];
  nextScene?: string;
  choices?: Choice[];
  timedChoice?: TimedChoice;
  isEnding?: boolean;
  endingId?: string;
}

export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  order: number;
  coverImage: string;
  description: string;
  unlockedByDefault: boolean;
  unlockCondition?: UnlockCondition;
  scenes: Scene[];
}

export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type ItemCategory = 'item' | 'clue' | 'letter' | 'key';

export interface CombineRecipe {
  ingredients: string[];
  result: string;
  resultType: 'item' | 'clue' | 'event';
  description: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: ItemRarity;
  category: ItemCategory;
  combinable: boolean;
  combineRecipes?: CombineRecipe[];
}

export interface Character {
  id: string;
  name: string;
  title: string;
  avatar: string;
  portrait: string;
  faction: string;
  description: string;
  backgroundStory: string[];
  personalityTags: string[];
}

export interface Ending {
  id: string;
  title: string;
  description: string;
  type: EndingType;
  thumbnail: string;
  cgImage: string;
  storyText: string;
  unlockConditions: UnlockCondition[];
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  probability: number;
  triggerLocation: string[];
  choices: Choice[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  hidden: boolean;
}

export interface Planet {
  id: string;
  name: string;
  description: string;
  faction: string;
  status: string;
  position: { x: number; y: number };
  color: string;
  unlocked: boolean;
}

export interface Notification {
  id: string;
  type: 'item' | 'achievement' | 'ending' | 'clue' | 'mail' | 'info';
  title: string;
  message: string;
  icon?: string;
  timestamp: number;
}
