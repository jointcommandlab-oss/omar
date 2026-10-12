// Clearly-labelled DEMO fixtures for Phase 1 only. Replaced by Supabase queries in Phase 5.
import type { EventItem, ProductItem, RouteItem } from '../types';

export const sampleRoutes: RouteItem[] = [
  { id: 'demo-qudra', title: { ar: 'مسار القدرة للدراجات', en: 'Al Qudra Cycling Track' }, emirate: 'dubai', distanceKm: null, isDemo: true },
  { id: 'demo-hudayriat', title: { ar: 'مسار الحديريات للدراجات', en: 'Al Hudayriat Cycling Track' }, emirate: 'dubai', distanceKm: null, isDemo: true },
  { id: 'demo-yas', title: { ar: 'مسار تجريبي – أبوظبي', en: 'Sample route – Abu Dhabi' }, emirate: 'abudhabi', distanceKm: null, isDemo: true },
];
export const sampleEvents: EventItem[] = [];
export const sampleProducts: ProductItem[] = [];

export const emirates = ['abudhabi', 'dubai', 'sharjah', 'ajman', 'uaq', 'rak', 'fujairah'] as const;
