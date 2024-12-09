import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
interface Presenter {
  id: number;
  name: string;
  bio: string;
  imageUrl: string;
  socials?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
}

interface Show {
  id: number;
  title: string;
  synopsis: string;
  imageUrl: string;
  presenterId: number;
  presenter?: Presenter;
  donationGoal?: number;
  donationCurrent?: number;
}

interface UpdateShowRequest {
  title?: string;
  synopsis?: string;
  presenterId?: number;
  donationGoal?: number;
}

interface UpdatePresenterRequest {
  name?: string;
  bio?: string;
  imageUrl?: string;  // Add this
  socials?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
}

// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://your-strapi-url/api';
const CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour

// Cache keys
const CACHE_KEYS = {
  SHOWS: 'cached_shows',
  PRESENTERS: 'cached_presenters',
};

// API Instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Longer timeout for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handling
const handleApiError = (error: AxiosError, operation: string) => {
  console.error(`${operation} failed:`, error);
  throw new Error(`${operation} failed: ${error.message}`);
};

// Cache Management
export const cacheData = async (key: string, data: any): Promise<void> => {
  try {
    const cacheItem = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (error) {
    console.error('Cache storage error:', error);
  }
};

export const getCachedData = async <T>(key: string): Promise<T | null> => {
  try {
    const cached = await AsyncStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_EXPIRY;

    return isExpired ? null : data;
  } catch (error) {
    console.error('Cache retrieval error:', error);
    return null;
  }
};

// Show Management
export const fetchShows = async (): Promise<Show[]> => {
  try {
    const cachedShows = await getCachedData<Show[]>(CACHE_KEYS.SHOWS);
    if (cachedShows) return cachedShows;

    const response = await api.get<{ data: Show[] }>('/shows');
    const shows = response.data.data;
    
    await cacheData(CACHE_KEYS.SHOWS, shows);
    return shows;
  } catch (error) {
    handleApiError(error as AxiosError, 'Fetch shows');
    return [];
  }
};

export const updateShow = async (showId: number, updateData: UpdateShowRequest): Promise<Show> => {
  try {
    const response = await api.put(`/shows/${showId}`, {
      data: updateData
    });
    const updatedShow = response.data.data;
    
    // Update cache
    const shows = await getCachedData<Show[]>(CACHE_KEYS.SHOWS) || [];
    const updatedShows = shows.map(show => 
      show.id === showId ? updatedShow : show
    );
    await cacheData(CACHE_KEYS.SHOWS, updatedShows);
    
    return updatedShow;
  } catch (error) {
    handleApiError(error as AxiosError, 'Update show');
    throw error;
  }
};

// Presenter Management
export const fetchPresenters = async (): Promise<Presenter[]> => {
  try {
    const cachedPresenters = await getCachedData<Presenter[]>(CACHE_KEYS.PRESENTERS);
    if (cachedPresenters) return cachedPresenters;

    const response = await api.get<{ data: Presenter[] }>('/presenters');
    const presenters = response.data.data;
    
    await cacheData(CACHE_KEYS.PRESENTERS, presenters);
    return presenters;
  } catch (error) {
    handleApiError(error as AxiosError, 'Fetch presenters');
    return [];
  }
};

export const updatePresenter = async (presenterId: number, updateData: UpdatePresenterRequest): Promise<Presenter> => {
  try {
    const response = await api.put(`/presenters/${presenterId}`, {
      data: updateData
    });
    return response.data.data;
  } catch (error) {
    handleApiError(error as AxiosError, 'Update presenter');
    throw error;
  }
};

// Image upload
export const uploadPresenterImage = async (presenterId: number, imageFile: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('files', imageFile);
    formData.append('ref', 'presenter');
    formData.append('refId', presenterId.toString());
    formData.append('field', 'image');

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const imageUrl = response.data[0].url;
    
    // Update presenter with new image URL
    await updatePresenter(presenterId, { 
      imageUrl 
    });

    return imageUrl;
  } catch (error) {
    handleApiError(error as AxiosError, 'Upload presenter image');
    throw error;
  }
};

// Donation management
export const updateDonationGoal = async (showId: number, amount: number): Promise<Show> => {
  try {
    return await updateShow(showId, { donationGoal: amount });
  } catch (error) {
    handleApiError(error as AxiosError, 'Update donation goal');
    throw error;
  }
};

// Authentication interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const clearCache = async () => {
  try {
    await AsyncStorage.multiRemove([CACHE_KEYS.SHOWS, CACHE_KEYS.PRESENTERS]);
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
};