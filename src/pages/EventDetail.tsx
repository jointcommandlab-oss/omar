import { Link, useParams } from 'react-router-dom';
import { ExternalLink, Trophy } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import SampleBadge from '../components/SampleBadge';
import { allEvents } from '../data/events';
import { eventStatus } from '../types/events';
import { useI18n, type Key } from '../i18n';

export default function EventDetail() {
  const { id } = useParams();
  const { t, pick, tr, lang } = useI18n();
  const e = allEvents.find((x) => x.id === id);
  if (!e) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="text-lg font-bold">{tr('البطولة غير موجودة', 'Event not found')}</p>
        <Link to="/events" className="btn-primary mt-4">{t('p.events')}</Link>
      </div>
    );
  }
  const status = eventStatus(e.date);
  const date = new Date(`${e.date}T00:00:00`).toLocaleDateString(lang === 'ar' ? 'ar-AE' : 'en-GB', { dateStyle: 'full' });
  const rows: [string, string][] = [
    [tr('التاريخ', 'Date'), date],
    [tr('الحالة', 'Status'), status === 'upcoming' ? tr('قادمة', 'Upcoming') : tr('سابقة', 'Past')],
    [tr('الإمارة', 'Emirate'), t(`em.${e.emirate}` as Key)],
    [tr('المنظّم', 'Organizer'), pick(e.organizer)],
    [tr('الموقع', 'Location'), pick(e.location)],
  ];
  return (
    <>
      <PageBanner icon={Trophy} title={pick(e.title)} desc={e.isDemo ? t('sample.note') : pick(e.organizer)} tone="from-indigo-950 to-ink" />
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <div className="flex flex-wrap items-center gap-3">
          {e.isDemo && <SampleBadge />}
          <Link to="/events" className="btn-ghost">{t('p.events')}</Link>
        </div>
        {e.imageUrl && <img src={e.imageUrl} alt={pick(e.title)} loading="lazy" className="card h-56 w-full object-cover" />}
        <dl className="card divide-y divide-neutral-100 dark:divide-white/10">
          {rows.map(([k, v]) => <div key={k} className="flex justify-between gap-4 p-4"><dt className="text-neutral-500">{k}</dt><dd className="font-semibold">{v}</dd></div>)}
        </dl>
        {e.registrationUrl ? (
          status === 'upcoming' && (
            <a href={e.registrationUrl} target="_blank" rel="noopener noreferrer" className="btn-primary"
              aria-label={tr('التسجيل (يفتح في نافذة جديدة)', 'Register (opens in a new tab)')}>
              <ExternalLink size={18} aria-hidden /> {tr('التسجيل', 'Register')}
            </a>
          )
        ) : (
          <p className="card p-4 text-sm text-neutral-600 dark:text-neutral-300">{tr('رابط التسجيل غير متوفر.', 'No registration link available.')}</p>
        )}
      </div>
    </>
  );
}
