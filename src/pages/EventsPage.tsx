import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Search, Trophy } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import EmptyState from '../components/EmptyState';
import SampleBadge from '../components/SampleBadge';
import { emirates } from '../data/sample';
import { allEvents } from '../data/events';
import { eventStatus, type EventStatus } from '../types/events';
import { useI18n, type Key } from '../i18n';

export default function EventsPage() {
  const { t, pick, tr, lang } = useI18n();
  const [q, setQ] = useState('');
  const [em, setEm] = useState('all');
  const [tab, setTab] = useState<EventStatus>('upcoming');
  const fmt = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString(lang === 'ar' ? 'ar-AE' : 'en-GB', { dateStyle: 'long' });
  const needle = q.trim().toLowerCase();
  const filtered = useMemo(() => allEvents.filter((e) =>
    (em === 'all' || e.emirate === em) &&
    (!needle || [pick(e.title), pick(e.organizer), pick(e.location)].some((s) => s.toLowerCase().includes(needle))),
  ), [needle, em, pick]);
  const list = filtered
    .filter((e) => eventStatus(e.date) === tab)
    .sort((a, b) => (tab === 'upcoming' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));
  const field = 'card w-full px-4 py-3';
  const tabs: [EventStatus, string][] = [['upcoming', tr('القادمة', 'Upcoming')], ['past', tr('السابقة', 'Past')]];
  const filtering = needle !== '' || em !== 'all';
  return (
    <>
      <PageBanner icon={Trophy} title={t('p.events')} desc={t('p.events.d')} tone="from-indigo-950 to-ink" />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="card mb-4 grid gap-3 p-4 sm:grid-cols-2">
          <label className="relative sm:col-span-2">
            <Search size={18} className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tr('ابحث عن بطولة…', 'Search events…')} aria-label={tr('بحث', 'Search')} className={field} />
          </label>
          <select value={em} onChange={(e) => setEm(e.target.value)} aria-label={tr('الإمارة', 'Emirate')} className={field}>
            <option value="all">{tr('كل الإمارات', 'All emirates')}</option>
            {emirates.map((e) => <option key={e} value={e}>{t(`em.${e}` as Key)}</option>)}
          </select>
          <div role="tablist" aria-label={tr('حالة البطولات', 'Event status')} className="grid grid-cols-2 gap-2">
            {tabs.map(([k, label]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={tab === k ? 'btn-primary' : 'btn-ghost'}>{label}</button>
            ))}
          </div>
        </div>
        <p className="mb-4 text-sm text-neutral-500" aria-live="polite">{list.length} {tr('بطولة', 'events')}</p>
        {list.length ? (
          <div role="tabpanel" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((e) => (
              <Link key={e.id} to={`/events/${e.id}`} className="card block p-4 transition hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand">
                <div className="flex flex-wrap items-center gap-2">
                  {e.isDemo && <SampleBadge />}
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700 dark:bg-white/10 dark:text-neutral-200">
                    {eventStatus(e.date) === 'upcoming' ? tr('قادمة', 'Upcoming') : tr('سابقة', 'Past')}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-brand">{pick(e.title)}</h3>
                <p className="mt-2 flex items-center gap-1 text-sm text-neutral-500"><Calendar size={16} aria-hidden /> {fmt(e.date)}</p>
                <p className="mt-1 flex items-center gap-1 text-sm text-neutral-500"><MapPin size={16} aria-hidden /> {t(`em.${e.emirate}` as Key)} · {pick(e.location)}</p>
              </Link>
            ))}
          </div>
        ) : filtering ? (
          <EmptyState icon={Search} title={tr('لا توجد بطولات مطابقة', 'No matching events')} desc={tr('جرّب تغيير البحث أو الإمارة أو التبويب.', 'Try changing the search, emirate or tab.')} />
        ) : (
          <EmptyState icon={Calendar} title={tab === 'upcoming' ? tr('لا توجد بطولات قادمة حالياً', 'No upcoming events right now') : tr('لا توجد بطولات سابقة', 'No past events')}
            desc={tr('ستظهر البطولات هنا عند تأكيدها من المنظّمين.', 'Events will appear here once confirmed by organizers.')} />
        )}
      </div>
    </>
  );
}
