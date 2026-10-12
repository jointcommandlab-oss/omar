import { Link, useParams } from 'react-router-dom';
import { Heart, Info, MapPin } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import SampleBadge from '../components/SampleBadge';
import { sampleRoutes } from '../data/sample';
import { useI18n, type Key } from '../i18n';
import { useLocalState } from '../hooks/useLocalState';
import { Map as MapIcon } from 'lucide-react';

export default function RouteDetail() {
  const { id } = useParams();
  const { t, pick, tr } = useI18n();
  const [favs, setFavs] = useLocalState<string[]>('cae-fav-routes', []);
  const r = sampleRoutes.find((x) => x.id === id);
  if (!r) return <div className="mx-auto max-w-xl px-4 py-16 text-center"><p className="text-lg font-bold">{t('nf.title')}</p><Link to="/routes" className="btn-primary mt-4">{t('nav.routes')}</Link></div>;
  const fav = favs.includes(r.id);
  const unknown = tr('غير موثّق بعد', 'Not verified yet');
  const rows: [string, string][] = [
    [tr('الإمارة', 'Emirate'), t(`em.${r.emirate}` as Key)],
    [tr('المسافة', 'Distance'), r.distanceKm === null ? unknown : `${r.distanceKm} ${t('km')}`],
    [tr('الوقت التقديري', 'Estimated time'), unknown],
    [tr('الارتفاع', 'Elevation'), unknown],
    [tr('الصعوبة', 'Difficulty'), unknown],
    [tr('الإضاءة', 'Lighting'), unknown],
  ];
  return (
    <>
      <PageBanner icon={MapIcon} title={pick(r.title)} desc={t('sample.note')} tone="from-emerald-950 to-ink" />
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <div className="flex flex-wrap items-center gap-3">
          <SampleBadge />
          <button onClick={() => setFavs((f) => (f.includes(r.id) ? f.filter((x) => x !== r.id) : [...f, r.id]))} aria-pressed={fav}
            className={fav ? 'btn-primary' : 'btn-ghost'}><Heart size={18} fill={fav ? 'currentColor' : 'none'} aria-hidden /> {fav ? tr('في المفضلة', 'Favorited') : tr('أضف للمفضلة', 'Add to favorites')}</button>
        </div>
        <dl className="card divide-y divide-neutral-100 dark:divide-white/10">
          {rows.map(([k, v]) => <div key={k} className="flex justify-between p-4"><dt className="text-neutral-500">{k}</dt><dd className="font-semibold">{v}</dd></div>)}
        </dl>
        <div className="card flex items-start gap-3 p-4 text-sm text-neutral-600 dark:text-neutral-300">
          <MapPin className="mt-0.5 shrink-0 text-brand" size={18} aria-hidden />
          <p>{tr('الخريطة (Leaflet + OpenStreetMap) تُضاف مع نقاط البداية والنهاية الموثّقة؛ لا نعرض مواقع تقريبية.', 'The map (Leaflet + OpenStreetMap) arrives with verified start/finish points; we do not show approximate locations.')}</p>
        </div>
        <div className="card flex items-start gap-3 p-4 text-sm text-neutral-600 dark:text-neutral-300">
          <Info className="mt-0.5 shrink-0 text-brand" size={18} aria-hidden />
          <p>{tr('مصدر البيانات: عيّنة تجريبية داخلية — لم تُراجع ميدانياً.', 'Data source: internal demo sample — not field-verified.')}</p>
        </div>
      </div>
    </>
  );
}
