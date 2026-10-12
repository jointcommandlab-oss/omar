// TEST ONLY — SYNTHETIC COORDINATES, NOT A REAL ROUTE. Never import from app code.
// Used solely to visually verify the map component during development.
import type { RouteItem } from '../../types';

export const TEST_ONLY_geoRoute: RouteItem = {
  id: 'demo-qudra',
  title: { ar: 'اختبار فقط', en: 'TEST ONLY' },
  emirate: 'dubai',
  distanceKm: 1,
  isDemo: true,
  start: [25.0, 55.0],
  finish: [25.01, 55.01],
  path: [[25.0, 55.0], [25.004, 55.003], [25.007, 55.008], [25.01, 55.01]],
  difficulty: 'easy',
  lighting: 'partial',
  elevationM: 0,
  source: 'TEST FIXTURE (synthetic)',
  verifiedAt: '2000-01-01',
};
