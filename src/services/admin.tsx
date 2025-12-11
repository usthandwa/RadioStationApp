// src/services/admin.ts
import { Presenter, Show } from '@/src/types/index.ts';
import Constants from 'expo-constants';

const API_BASE = (Constants.expoConfig?.extra?.apiUrl as string | undefined) ?? '';
if (!API_BASE) {
  console.warn('API_URL not set in app config (app.json > extra.apiUrl)');
}

export const fetchPresenters = async (): Promise<Record<string, Presenter>> => {
  const response = await fetch(`${API_BASE}/presenters`);
  if (!response.ok) throw new Error('Failed to fetch presenters');
  return response.json();
};

export const fetchShows = async (): Promise<{
  weekday: Show[];
  friday: Show[];
  weekend: Show[];
}> => {
  const response = await fetch(`${API_BASE}/shows`);
  if (!response.ok) throw new Error('Failed to fetch shows');
  return response.json();
};

export const updatePresenter = async (name: string, data: Partial<Presenter>): Promise<void> => {
  const response = await fetch(`${API_BASE}/presenters/${encodeURIComponent(name)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update presenter');
};

export const archivePresenter = async (name: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/presenters/${encodeURIComponent(name)}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to archive presenter');
};

export const uploadPresenterImage = async (presenterName: string, file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await fetch(
    `${API_BASE}/presenters/${encodeURIComponent(presenterName)}/image`, 
    {
      method: 'POST',
      body: formData
    }
  );
  
  if (!response.ok) throw new Error('Failed to upload image');
  const data = await response.json();
  return data.imageUrl;
};

export const updateShow = async (id: string, data: Partial<Show>): Promise<void> => {
  const response = await fetch(`${API_BASE}/shows/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update show');
};

export const createShow = async (data: Show): Promise<Show> => {
  const response = await fetch(`${API_BASE}/shows`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create show');
  return response.json();
};

export const archiveShow = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/shows/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to archive show');
  return response.json();
};
