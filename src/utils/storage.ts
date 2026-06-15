import type { GameSettings, PlayerSave } from '@/types';

const SAVE_KEY = 'stellarmail_saves';
const AUTO_SAVE_KEY = 'stellarmail_autosave';
const SETTINGS_KEY = 'stellarmail_settings';

export const defaultSettings: GameSettings = {
  textSpeed: 3,
  bgmEnabled: true,
  sfxEnabled: true,
  spoilerFree: false,
  autoSave: true
};

export const storage = {
  save: (key: string, data: unknown): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Storage save error:', e);
    }
  },
  load: <T>(key: string, defaultValue: T): T => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error('Storage load error:', e);
      return defaultValue;
    }
  },
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Storage remove error:', e);
    }
  }
};

export const getSettings = (): GameSettings => {
  return storage.load<GameSettings>(SETTINGS_KEY, defaultSettings);
};

export const saveSettings = (settings: GameSettings): void => {
  storage.save(SETTINGS_KEY, settings);
};

export const getAutoSave = (): PlayerSave | null => {
  return storage.load<PlayerSave | null>(AUTO_SAVE_KEY, null);
};

export const setAutoSave = (save: PlayerSave): void => {
  storage.save(AUTO_SAVE_KEY, save);
};

export const getManualSaves = (): PlayerSave[] => {
  return storage.load<PlayerSave[]>(SAVE_KEY, []);
};

export const saveManualSave = (save: PlayerSave, slot: number): void => {
  const saves = getManualSaves();
  saves[slot] = save;
  storage.save(SAVE_KEY, saves);
};

export const deleteManualSave = (slot: number): void => {
  const saves = getManualSaves();
  if (saves[slot]) {
    saves.splice(slot, 1);
    storage.save(SAVE_KEY, saves);
  }
};

export const generateSaveId = (): string => {
  return `save_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
