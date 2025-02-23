// types/index.ts

import express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace 'any' with a more specific type if possible (e.g., User object)
    }
  }
}

declare global {
    interface Window {
      fs: {
        readFile: (path: string, options?: { encoding?: string }) => Promise<Uint8Array | string>;
      };
    }
  }

  
  export interface Presenter {
    id: string;
    name: string;
    bio: string;
    image: string;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Show {
    id: string;  // Make id required
    name: string;
    time: string;
    presenter: string;
    synopsis: string;
    scheduleType: 'weekday' | 'friday' | 'weekend';
  }
  
  export interface ShowSchedule {
    weekday: Show[];
    friday: Show[];
    weekend: Show[];
  } 

  export interface EditState {
    [key: string]: boolean;
  }
