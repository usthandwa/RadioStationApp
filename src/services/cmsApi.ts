// src/services/cmsApi.ts

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://your-strapi-url/api';

const api = axios.create({
  baseURL: API_URL,
});

export const fetchShows = async () => {
  const response = await api.get('/shows');
  return response.data;
};

export const fetchPodcasts = async () => {
  const response = await api.get('/podcasts');
  return response.data;
};

export const fetchLiveStreamInfo = async () => {
  const response = await api.get('/live-stream-info');
  return response.data;
};

export const submitPrayerRequest = async (requestData: any) => {
  const response = await api.post('/prayer-requests', requestData);
  return response.data;
};

export const cacheData = async (key: string, data: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error caching data:', error);
  }
};

export const getCachedData = async (key: string) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving cached data:', error);
    return null;
  }
};