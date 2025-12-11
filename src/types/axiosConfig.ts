// src/utils/axiosConfig.ts
import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get the API URL from EAS secret
const API_URL = Constants.expoConfig?.extra?.apiUrl;

if (!API_URL) {
  console.warn('API_URL is not defined in EAS config');
}

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('adminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          await AsyncStorage.removeItem('adminToken');
          // You might want to trigger a navigation to login here
          break;
        default:
          console.error('API error:', error.response.data);
      }
    } else if (error.request) {
      console.error('Network error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: async <T>(url: string, config = {}) => {
    const response = await axiosInstance.get<T>(url, config);
    return response.data;
  },

  post: async <T>(url: string, data = {}, config = {}) => {
    const response = await axiosInstance.post<T>(url, data, config);
    return response.data;
  },

  put: async <T>(url: string, data = {}, config = {}) => {
    const response = await axiosInstance.put<T>(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config = {}) => {
    const response = await axiosInstance.delete<T>(url, config);
    return response.data;
  },

  upload: async <T>(url: string, formData: FormData, config: import('axios').AxiosRequestConfig = {}) => {
    const uploadConfig = {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    };
    const response = await axiosInstance.post<T>(url, formData, uploadConfig);
    return response.data;
  }
};

export default api;
// NOTE: Environment-specific shell exports were accidentally committed here.
// They have been removed. Use your shell profile (e.g., ~/.zshrc) or CI config
// to export ANDROID_HOME and related PATH entries.
