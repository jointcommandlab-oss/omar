import type { EventItem } from './index';

export type EventStatus = 'upcoming' | 'past';

export interface CyclingEvent extends EventItem {
  organizer: { ar: string; en: string };
  location: { ar: string; en: string };
  registrationUrl?: string;
  imageUrl?: string;
}

/** Status is always derived from the date (YYYY-MM-DD); an event is upcoming through its own day. */
export function eventStatus(date: string, now: Date = new Date()): EventStatus {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1) >= today ? 'upcoming' : 'past';
}
