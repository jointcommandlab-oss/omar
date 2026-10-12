import { MapPin, Ruler } from 'lucide-react';
import type { RouteItem } from '../types';
import { useI18n, type Key } from '../i18n';
import SampleBadge from './SampleBadge';

export default function RouteCard({ route }: { route: RouteItem }) {
  const { t, pick } = useI18n();
  return (
    <article className="card overflow-hidden">
      <div className="relative h-44 bg-gradient-to-br from-neutral-700 to-neutral-900">
        <div className="absolute inset-0 grid place-items-center px-4 text-center text-xs text-white/60">{t('img.placeholder')}</div>
        <div className="absolute start-3 top-3 flex gap-2">{route.isDemo && <SampleBadge />}</div>
        <div className="absolute bottom-3 end-3 flex items-center gap-1 text-sm font-semibold text-white"><MapPin size={16} aria-hidden /> {t(`em.${route.emirate}` as Key)}</div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-brand">{pick(route.title)}</h3>
        <p className="mt-2 flex items-center gap-1 text-sm text-neutral-500"><Ruler size={16} aria-hidden />
          {route.distanceKm === null ? t('route.unverified') : `${route.distanceKm} ${t('km')}`}</p>
      </div>
    </article>
  );
}
