import { describe, expect, it } from 'vitest';
import { NOT_ENOUGH_DATA, recommend, type AdvisorRoute } from './advisor';

const mk = (id: string, emirate: string, distanceKm: number | null, lit?: boolean | null): AdvisorRoute => ({
  id, title: { ar: id, en: id }, emirate, distanceKm, isDemo: true, lit,
});
const base = { level: 'intermediate', goal: 'leisure' } as const;

describe('recommend', () => {
  it('filters by emirate', () => {
    const r = recommend({ ...base, emirate: 'dubai' }, [mk('a', 'dubai', 10), mk('b', 'sharjah', 10)]);
    expect(r.map((x) => x.route.id)).toEqual(['a']);
  });

  it('filters by max distance only when distance is verified', () => {
    const r = recommend({ ...base, maxDistanceKm: 20 }, [mk('a', 'dubai', 50), mk('b', 'dubai', 10), mk('c', 'dubai', null, true)]);
    expect(r.map((x) => x.route.id)).toEqual(['b', 'c']);
  });

  it('reports null fields as missing instead of guessing', () => {
    const [r] = recommend({ ...base, preferLit: true }, [mk('a', 'dubai', 10, null)]);
    expect(r.missingData).toContain('lighting');
    expect(r.score).toBe(1); // leisure rule only, no lighting credit
  });

  it('orders by score and puts unverified routes last', () => {
    const r = recommend({ ...base, preferLit: true }, [mk('none', 'dubai', null), mk('lowscore', 'dubai', 40, false), mk('best', 'dubai', 10, true)]);
    expect(r.map((x) => x.route.id)).toEqual(['best', 'lowscore', 'none']);
    expect(r[2].reasons).toContain(NOT_ENOUGH_DATA);
  });

  it('never invents values: routes with null data score 0', () => {
    const r = recommend({ level: 'beginner', goal: 'endurance', maxDistanceKm: 30, preferLit: true }, [mk('a', 'dubai', null)]);
    expect(r[0].score).toBe(0);
    expect(r[0].reasons).toEqual([NOT_ENOUGH_DATA]);
    expect(r[0].missingData).toEqual(['distance', 'lighting']);
  });

  it('flags speed goal as lacking data', () => {
    const [r] = recommend({ ...base, goal: 'speed' }, [mk('a', 'dubai', 10)]);
    expect(r.missingData).toContain('terrain-or-speed-data');
  });
});
