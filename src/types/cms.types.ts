/**
 * CMS Data Type Definitions
 *
 * Centralized type definitions for presenters, shows, and schedules
 */

export interface SocialLinks {
  twitter?: string;
  instagram?: string;
  facebook?: string;
}

export interface Presenter {
  id: string;
  name: string;
  bio: string;
  imagePath: string; // Local asset path
  socials?: SocialLinks;
  isArchived: boolean;
  archivedAt?: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export interface Show {
  id: string;
  name: string;
  time: string; // Format: "HH:MM - HH:MM"
  presenterId: string | 'dynamic'; // 'dynamic' for shows with changing presenters
  synopsis: string;
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: string;
  type: 'weekday' | 'friday' | 'weekend';
  showIds: string[]; // Ordered list of show IDs
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PresenterCreateInput = Omit<Presenter, 'id' | 'createdAt' | 'updatedAt' | 'isArchived' | 'archivedAt'>;
export type PresenterUpdateInput = Partial<PresenterCreateInput>;

export type ShowCreateInput = Omit<Show, 'id' | 'createdAt' | 'updatedAt'>;
export type ShowUpdateInput = Partial<ShowCreateInput>;

export type ScheduleUpdateInput = Partial<Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>>;
