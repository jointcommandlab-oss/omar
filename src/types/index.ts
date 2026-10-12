import type { RouteGeo } from './routeGeo';
export type { RouteGeo } from './routeGeo';

export type Lang = 'ar' | 'en';
export type Theme = 'light' | 'dark';

export interface RouteItem extends RouteGeo {
  id: string;
  title: { ar: string; en: string };
  emirate: string;
  /** null = not yet verified. Never invent route metrics. */
  distanceKm: number | null;
  isDemo: boolean;
}
export interface EventItem { id: string; title: { ar: string; en: string }; date: string; emirate: string; isDemo: boolean }
export interface ProductItem { id: string; title: { ar: string; en: string }; priceAed: number; isDemo: boolean }
