import type { RouteItem } from '../types';

/**
 * Transparent, RULES-BASED route recommender. NOT an AI model.
 * It scores only fields that are verified (non-null). Unknown fields are
 * reported in `missingData`, never guessed.
 */
export type Level = 'beginner' | 'intermediate' | 'advanced';
export type Goal = 'endurance' | 'speed' | 'leisure';

export interface AdvisorInput {
  emirate?: string;
  level: Level;
  maxDistanceKm?: number;
  preferLit?: boolean;
  goal: Goal;
}

/** RouteItem plus optional verified lighting info (null/undefined = unverified). */
export type AdvisorRoute = RouteItem & { lit?: boolean | null };

export type MissingField = 'distance' | 'lighting' | 'terrain-or-speed-data';

export interface Recommendation {
  route: AdvisorRoute;
  score: number;
  reasons: string[];
  missingData: MissingField[];
}

export const NOT_ENOUGH_DATA = 'not enough verified data';

/** Published rule thresholds (km). These are rules, not facts about any route. */
export const RULES = {
  beginnerMaxKm: 25,
  enduranceMinKm: 30,
  leisureMaxKm: 20,
} as const;

export function recommend(input: AdvisorInput, routes: AdvisorRoute[]): Recommendation[] {
  const ranked: Recommendation[] = [];
  const unverified: Recommendation[] = [];

  for (const route of routes) {
    const d = route.distanceKm ?? null;
    const lit = route.lit ?? null;

    // Hard filters, applied only on verified values.
    if (input.emirate && route.emirate && route.emirate !== input.emirate) continue;
    if (input.maxDistanceKm != null && d != null && d > input.maxDistanceKm) continue;

    const reasons: string[] = [];
    const missing: MissingField[] = [];
    let score = 0;

    if (input.emirate && route.emirate === input.emirate) reasons.push(`in selected emirate (${route.emirate})`);

    if (d == null) missing.push('distance');
    else {
      if (input.maxDistanceKm != null) { score += 1; reasons.push(`${d} km is within ${input.maxDistanceKm} km limit`); }
      if (input.level === 'beginner' && d <= RULES.beginnerMaxKm) { score += 1; reasons.push(`${d} km suits a beginner (rule: <= ${RULES.beginnerMaxKm} km)`); }
      if (input.goal === 'endurance' && d >= RULES.enduranceMinKm) { score += 1; reasons.push(`${d} km suits endurance (rule: >= ${RULES.enduranceMinKm} km)`); }
      if (input.goal === 'leisure' && d <= RULES.leisureMaxKm) { score += 1; reasons.push(`${d} km suits leisure (rule: <= ${RULES.leisureMaxKm} km)`); }
    }

    if (input.preferLit) {
      if (lit == null) missing.push('lighting');
      else if (lit) { score += 1; reasons.push('verified lit route'); }
    }

    if (input.goal === 'speed') missing.push('terrain-or-speed-data');

    if (d == null && lit == null) {
      unverified.push({ route, score: 0, reasons: [NOT_ENOUGH_DATA], missingData: missing });
    } else {
      ranked.push({ route, score, reasons, missingData: missing });
    }
  }

  // Stable sort: highest score first, ties keep input order.
  const indexed = ranked.map((r, i) => ({ r, i }));
  indexed.sort((a, b) => b.r.score - a.r.score || a.i - b.i);
  return [...indexed.map((x) => x.r), ...unverified];
}
