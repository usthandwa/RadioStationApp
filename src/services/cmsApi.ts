/* // src/services/cmsApi.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { 
  AxiosHeaders, 
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError 
} from 'axios';

const API_URL = 'http://localhost:1337/api';

// Cache constants
const CACHE_KEYS = {
  LIVE_STREAM: 'liveStreamData',
  SHOWS: 'showsData',
  PRESENTERS: 'presentersData'
};

const CACHE_DURATION = 1000 * 60 * 15; // 15 minutes

// Types
interface Show {
  id: string;
  name: string;
  time: string;
  presenterId: string;
  synopsis: string;
}

interface Presenter {
  id: string;
  name: string;
  bio: string;
  image: string;
}

interface LiveStreamData {
  presenters: {
    [key: string]: Presenter;
  };
  shows: {
    weekday: Show[];
    friday: Show[];
    weekend: Show[];
  };
}

// Initialize axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: new AxiosHeaders({
    'Content-Type': 'application/json'
  })
});

// ---------------------- Caching Abstraction ----------------------
interface Cache {
  getItem(key: string): Promise<any | null>;
  setItem(key: string, value: any): Promise<void>;
  removeItem(key: string): Promise<void>;
}

class AsyncStorageCache implements Cache {
  async getItem(key: string): Promise<any | null> {
    try {
      const item = await AsyncStorage.getItem(key);
      if (item) {
        const parsedItem = JSON.parse(item);
        return parsedItem;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving from AsyncStorage:', error);
      return null;
    }
  }

  async setItem(key: string, value: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error storing in AsyncStorage:', error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from AsyncStorage:', error);
    }
  }
}

const cache: Cache = new AsyncStorageCache();

// Cache helper functions
export const cacheData = async (key: string, data: any) => {
  try {
    const cacheItem = {
      data,
      timestamp: Date.now(),
    };
    await cache.setItem(key, cacheItem); // Use the abstracted cache
  } catch (error) {
    console.error('Error caching data:', error);
  }
};

export const getCachedData = async (key: string) => {
  try {
    const item = await cache.getItem(key); // Use the abstracted cache
    if (item) {
      const isExpired = Date.now() - item.timestamp > CACHE_DURATION;
      
      if (!isExpired) {
        return item.data;
      }
      // If cache is expired, remove it
      await cache.removeItem(key);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving cached data:', error);
    return null;
  }
};

// API functions
export const fetchLiveStreamInfo = async (): Promise<LiveStreamData> => {
  try {
    // Check cache first
    const cachedData = await getCachedData(CACHE_KEYS.LIVE_STREAM);
    if (cachedData) {
      return cachedData;
    }

    // Fetch fresh data
    const response = await api.get('/live-stream-info');
    const data = response.data;

    // Cache the new data
    await cacheData(CACHE_KEYS.LIVE_STREAM, data);

    return data;
  } catch (error) {
    console.error('Error fetching live stream info:', error);
    throw error;
  }
};

// Update functions
export const updatePresenterBio = async (presenterId: string, newBio: string): Promise<void> => {
  try {
    await api.put(`/presenters/${presenterId}`, { // Update by ID
      bio: newBio
    });
    // Invalidate cache - be more granular if possible
    await AsyncStorage.removeItem(CACHE_KEYS.LIVE_STREAM);
  } catch (error) {
    console.error('Error updating presenter bio:', error);
    throw error;
  }
};

export const updateShowSynopsis = async (showId: string, newSynopsis: string): Promise<void> => {
  try {
    await api.put(`/shows/${showId}`, { // Update by ID
      synopsis: newSynopsis
    });
    // Invalidate cache
    await AsyncStorage.removeItem(CACHE_KEYS.LIVE_STREAM);
  } catch (error) {
    console.error('Error updating show synopsis:', error);
    throw error;
  }
};

export const updatePresenterImage = async (presenterId: string, formData: FormData): Promise<void> => {
  try {
    await api.put(`/presenters/${presenterId}/image`, formData, { // Update by ID
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // Invalidate cache
    await AsyncStorage.removeItem(CACHE_KEYS.LIVE_STREAM);
  } catch (error) {
    console.error('Error updating presenter image:', error);
    throw error;
  }
};

export const updateShowDetails = async (
  showId: string, 
  updates: Partial<Show>
): Promise<void> => {
  try {
    await api.put(`/shows/${showId}`, updates); // Update by ID
    // Invalidate cache
    await AsyncStorage.removeItem(CACHE_KEYS.LIVE_STREAM);
  } catch (error) {
    console.error('Error updating show details:', error);
    throw error;
  }
};

// Error handling middleware
api.interceptors.response.use(
  response => response,
  error => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      console.error('Server Error:', error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Error in request setup
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem('adminToken');
      if (token) {
        if (!(config.headers instanceof AxiosHeaders)) {
          config.headers = new AxiosHeaders(config.headers);
        }
        config.headers.set('Authorization', `Bearer ${token}`);
      }
      return config;
    } catch (error) {
      console.error("Error getting admin token", error);
      return config; // Continue without the token
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default {
  fetchLiveStreamInfo,
  updatePresenterBio,
  updateShowSynopsis,
  updatePresenterImage,
  updateShowDetails,
  cacheData,
  getCachedData,
};
 */

// src/services/cmsApi.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:1337/api';

// Create axios instance with custom config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Cache constants
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
const CACHE_KEY = 'livestreamData';

export const cacheData = async (data: any) => {
  try {
    const cacheItem = {
      data,
      timestamp: Date.now()
    };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheItem));
  } catch (error) {
    console.error('Error caching data:', error);
  }
};

export const getCachedData = async () => {
  try {
    const cachedItem = await AsyncStorage.getItem(CACHE_KEY);
    if (cachedItem) {
      const { data, timestamp } = JSON.parse(cachedItem);
      const isExpired = Date.now() - timestamp > CACHE_DURATION;
      
      if (!isExpired) {
        return data;
      }
      // Clear expired cache
      await AsyncStorage.removeItem(CACHE_KEY);
    }
    return null;
  } catch (error) {
    console.error('Error retrieving cached data:', error);
    return null;
  }
};

export const fetchLiveStreamInfo = async () => {
  try {
    // Try to get cached data first
    const cachedData = await getCachedData();
    if (cachedData) {
      return cachedData;
    }

    // Fetch fresh data
    const response = await api.get('/live-stream-info');
    const data = response.data;

    // Cache the fresh data
    await cacheData(data);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please check your connection.');
      }
      if (!error.response) {
        throw new Error('Network error. Please check if the server is running.');
      }
      throw new Error(error.response.data?.message || 'Failed to fetch data');
    }
    throw error;
  }
};