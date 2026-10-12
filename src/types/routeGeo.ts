/** Optional, VERIFIED geo/metrics for a route. Every field may be absent or null; never invent values. */
export type LatLng = [number, number];
export type Difficulty = 'easy' | 'moderate' | 'hard';
export type Lighting = 'lit' | 'partial' | 'unlit';

export interface RouteGeo {
  start?: LatLng | null;
  finish?: LatLng | null;
  path?: LatLng[] | null;
  difficulty?: Difficulty | null;
  lighting?: Lighting | null;
  elevationM?: number | null;
  /** Provenance: where the data came from (e.g. field survey, GPX from authority). */
  source?: string | null;
  /** ISO date (YYYY-MM-DD) of verification. */
  verifiedAt?: string | null;
}

export function hasVerifiedGeo(r: RouteGeo): boolean {
  return !!(r.start || r.finish || (r.path && r.path.length > 1));
}
