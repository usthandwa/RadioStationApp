/**
 * CMS Local Storage Service
 *
 * Handles CRUD operations for presenters, shows, and schedules using AsyncStorage.
 * This is Option 1 implementation - local JSON-based data management.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Presenter,
  PresenterCreateInput,
  PresenterUpdateInput,
  Show,
  ShowCreateInput,
  ShowUpdateInput,
  Schedule,
  ScheduleUpdateInput,
} from '@/types/cms.types';
import presentersSeed from '@/data/presenters.json';
import showsSeed from '@/data/shows.json';
import schedulesSeed from '@/data/schedules.json';

const STORAGE_KEYS = {
  PRESENTERS: '@cms/presenters',
  SHOWS: '@cms/shows',
  SCHEDULES: '@cms/schedules',
  INITIALIZED: '@cms/initialized',
};

/**
 * Initialize storage with seed data if not already initialized
 */
export const initializeStorage = async (): Promise<void> => {
  try {
    const initialized = await AsyncStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!initialized) {
      await AsyncStorage.setItem(STORAGE_KEYS.PRESENTERS, JSON.stringify(presentersSeed));
      await AsyncStorage.setItem(STORAGE_KEYS.SHOWS, JSON.stringify(showsSeed));
      await AsyncStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedulesSeed));
      await AsyncStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
      console.log('[CMSStorage] Initialized with seed data');
    }
  } catch (error) {
    console.error('[CMSStorage] Initialization error:', error);
    throw error;
  }
};

// ==================== PRESENTERS ====================

/**
 * Get all presenters (optionally include archived)
 */
export const getAllPresenters = async (includeArchived = false): Promise<Presenter[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PRESENTERS);
    const presenters: Presenter[] = data ? JSON.parse(data) : [];
    return includeArchived ? presenters : presenters.filter(p => !p.isArchived);
  } catch (error) {
    console.error('[CMSStorage] Error getting presenters:', error);
    return [];
  }
};

/**
 * Get presenter by ID
 */
export const getPresenterById = async (id: string): Promise<Presenter | null> => {
  try {
    const presenters = await getAllPresenters(true);
    return presenters.find(p => p.id === id) || null;
  } catch (error) {
    console.error('[CMSStorage] Error getting presenter by ID:', error);
    return null;
  }
};

/**
 * Get presenter by name
 */
export const getPresenterByName = async (name: string): Promise<Presenter | null> => {
  try {
    const presenters = await getAllPresenters(true);
    return presenters.find(p => p.name === name) || null;
  } catch (error) {
    console.error('[CMSStorage] Error getting presenter by name:', error);
    return null;
  }
};

/**
 * Create a new presenter
 */
export const createPresenter = async (input: PresenterCreateInput): Promise<Presenter> => {
  try {
    const presenters = await getAllPresenters(true);
    const newPresenter: Presenter = {
      ...input,
      id: `presenter-${Date.now()}`,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    presenters.push(newPresenter);
    await AsyncStorage.setItem(STORAGE_KEYS.PRESENTERS, JSON.stringify(presenters));
    console.log('[CMSStorage] Created presenter:', newPresenter.id);
    return newPresenter;
  } catch (error) {
    console.error('[CMSStorage] Error creating presenter:', error);
    throw error;
  }
};

/**
 * Update an existing presenter
 */
export const updatePresenter = async (id: string, input: PresenterUpdateInput): Promise<Presenter | null> => {
  try {
    const presenters = await getAllPresenters(true);
    const index = presenters.findIndex(p => p.id === id);
    if (index === -1) return null;

    presenters[index] = {
      ...presenters[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.PRESENTERS, JSON.stringify(presenters));
    console.log('[CMSStorage] Updated presenter:', id);
    return presenters[index];
  } catch (error) {
    console.error('[CMSStorage] Error updating presenter:', error);
    throw error;
  }
};

/**
 * Archive a presenter
 */
export const archivePresenter = async (id: string): Promise<boolean> => {
  try {
    const presenters = await getAllPresenters(true);
    const index = presenters.findIndex(p => p.id === id);
    if (index === -1) return false;

    presenters[index].isArchived = true;
    presenters[index].archivedAt = new Date().toISOString();
    presenters[index].updatedAt = new Date().toISOString();
    await AsyncStorage.setItem(STORAGE_KEYS.PRESENTERS, JSON.stringify(presenters));
    console.log('[CMSStorage] Archived presenter:', id);
    return true;
  } catch (error) {
    console.error('[CMSStorage] Error archiving presenter:', error);
    return false;
  }
};

/**
 * Restore an archived presenter
 */
export const restorePresenter = async (id: string): Promise<boolean> => {
  try {
    const presenters = await getAllPresenters(true);
    const index = presenters.findIndex(p => p.id === id);
    if (index === -1) return false;

    presenters[index].isArchived = false;
    presenters[index].archivedAt = undefined;
    presenters[index].updatedAt = new Date().toISOString();
    await AsyncStorage.setItem(STORAGE_KEYS.PRESENTERS, JSON.stringify(presenters));
    console.log('[CMSStorage] Restored presenter:', id);
    return true;
  } catch (error) {
    console.error('[CMSStorage] Error restoring presenter:', error);
    return false;
  }
};

/**
 * Delete a presenter permanently (use with caution)
 */
export const deletePresenter = async (id: string): Promise<boolean> => {
  try {
    const presenters = await getAllPresenters(true);
    const filtered = presenters.filter(p => p.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.PRESENTERS, JSON.stringify(filtered));
    console.log('[CMSStorage] Deleted presenter:', id);
    return true;
  } catch (error) {
    console.error('[CMSStorage] Error deleting presenter:', error);
    return false;
  }
};

// ==================== SHOWS ====================

/**
 * Get all shows
 */
export const getAllShows = async (): Promise<Show[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SHOWS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('[CMSStorage] Error getting shows:', error);
    return [];
  }
};

/**
 * Get show by ID
 */
export const getShowById = async (id: string): Promise<Show | null> => {
  try {
    const shows = await getAllShows();
    return shows.find(s => s.id === id) || null;
  } catch (error) {
    console.error('[CMSStorage] Error getting show by ID:', error);
    return null;
  }
};

/**
 * Create a new show
 */
export const createShow = async (input: ShowCreateInput): Promise<Show> => {
  try {
    const shows = await getAllShows();
    const newShow: Show = {
      ...input,
      id: `show-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    shows.push(newShow);
    await AsyncStorage.setItem(STORAGE_KEYS.SHOWS, JSON.stringify(shows));
    console.log('[CMSStorage] Created show:', newShow.id);
    return newShow;
  } catch (error) {
    console.error('[CMSStorage] Error creating show:', error);
    throw error;
  }
};

/**
 * Update an existing show
 */
export const updateShow = async (id: string, input: ShowUpdateInput): Promise<Show | null> => {
  try {
    const shows = await getAllShows();
    const index = shows.findIndex(s => s.id === id);
    if (index === -1) return null;

    shows[index] = {
      ...shows[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.SHOWS, JSON.stringify(shows));
    console.log('[CMSStorage] Updated show:', id);
    return shows[index];
  } catch (error) {
    console.error('[CMSStorage] Error updating show:', error);
    throw error;
  }
};

/**
 * Delete a show
 */
export const deleteShow = async (id: string): Promise<boolean> => {
  try {
    const shows = await getAllShows();
    const filtered = shows.filter(s => s.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.SHOWS, JSON.stringify(filtered));
    console.log('[CMSStorage] Deleted show:', id);
    return true;
  } catch (error) {
    console.error('[CMSStorage] Error deleting show:', error);
    return false;
  }
};

// ==================== SCHEDULES ====================

/**
 * Get all schedules
 */
export const getAllSchedules = async (): Promise<Schedule[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SCHEDULES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('[CMSStorage] Error getting schedules:', error);
    return [];
  }
};

/**
 * Get schedule by type
 */
export const getScheduleByType = async (type: 'weekday' | 'friday' | 'weekend'): Promise<Schedule | null> => {
  try {
    const schedules = await getAllSchedules();
    return schedules.find(s => s.type === type) || null;
  } catch (error) {
    console.error('[CMSStorage] Error getting schedule by type:', error);
    return null;
  }
};

/**
 * Update a schedule
 */
export const updateSchedule = async (id: string, input: ScheduleUpdateInput): Promise<Schedule | null> => {
  try {
    const schedules = await getAllSchedules();
    const index = schedules.findIndex(s => s.id === id);
    if (index === -1) return null;

    schedules[index] = {
      ...schedules[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
    console.log('[CMSStorage] Updated schedule:', id);
    return schedules[index];
  } catch (error) {
    console.error('[CMSStorage] Error updating schedule:', error);
    throw error;
  }
};

// ==================== UTILITY ====================

/**
 * Clear all CMS data (for testing or reset)
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.PRESENTERS,
      STORAGE_KEYS.SHOWS,
      STORAGE_KEYS.SCHEDULES,
      STORAGE_KEYS.INITIALIZED,
    ]);
    console.log('[CMSStorage] Cleared all data');
  } catch (error) {
    console.error('[CMSStorage] Error clearing data:', error);
    throw error;
  }
};

/**
 * Export all data as JSON (for backup)
 */
export const exportData = async (): Promise<string> => {
  try {
    const presenters = await getAllPresenters(true);
    const shows = await getAllShows();
    const schedules = await getAllSchedules();
    return JSON.stringify({ presenters, shows, schedules }, null, 2);
  } catch (error) {
    console.error('[CMSStorage] Error exporting data:', error);
    throw error;
  }
};

/**
 * Import data from JSON (for restore)
 */
export const importData = async (jsonData: string): Promise<void> => {
  try {
    const { presenters, shows, schedules } = JSON.parse(jsonData);
    await AsyncStorage.setItem(STORAGE_KEYS.PRESENTERS, JSON.stringify(presenters));
    await AsyncStorage.setItem(STORAGE_KEYS.SHOWS, JSON.stringify(shows));
    await AsyncStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
    console.log('[CMSStorage] Imported data successfully');
  } catch (error) {
    console.error('[CMSStorage] Error importing data:', error);
    throw error;
  }
};
