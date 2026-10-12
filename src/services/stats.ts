import { emirates, sampleEvents, sampleProducts, sampleRoutes } from '../data/sample';

/** Single source for homepage counts. Swap the body for Supabase counts in Phase 5. */
export function getHomeStats() {
  return {
    routes: sampleRoutes.length,
    products: sampleProducts.length,
    events: sampleEvents.length,
    emirates: emirates.length,
    isDemo: true,
  };
}
