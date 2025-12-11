// src/types/presenter.ts
import { ImageSourcePropType } from 'react-native';

export interface Presenter {
  name: string;
  bio: string;
  image: ImageSourcePropType | string;
}

export interface Show {
  name: string;
  time: string;
  presenter: string;
  synopsis: string;
}

export interface ShowSchedule {
  weekday: Show[];
  friday: Show[];
  weekend: Show[];
}

export interface LiveStreamData {
  presenters: Record<string, Presenter>;
  shows: ShowSchedule;
}

export type DayType = 'weekday' | 'friday' | 'weekend';
