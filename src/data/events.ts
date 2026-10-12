import type { CyclingEvent } from '../types/events';

const offsetDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** Real, verified events only. Intentionally empty until real data is confirmed. */
export const events: CyclingEvent[] = [];

/** DEMO fixtures: fictional, flagged isDemo, no registration link. Not real events. */
export const demoEvents: CyclingEvent[] = [
  {
    id: 'demo-event-upcoming',
    title: { ar: 'بطولة تجريبية قادمة', en: 'Demo upcoming championship' },
    date: offsetDate(60), emirate: 'dubai', isDemo: true,
    organizer: { ar: 'منظّم تجريبي', en: 'Demo organizer' },
    location: { ar: 'موقع تجريبي', en: 'Demo location' },
  },
  {
    id: 'demo-event-past',
    title: { ar: 'بطولة تجريبية سابقة', en: 'Demo past championship' },
    date: offsetDate(-60), emirate: 'abudhabi', isDemo: true,
    organizer: { ar: 'منظّم تجريبي', en: 'Demo organizer' },
    location: { ar: 'موقع تجريبي', en: 'Demo location' },
  },
];

export const allEvents: CyclingEvent[] = [...events, ...demoEvents];
