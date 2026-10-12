import { Map } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import RouteCard from '../components/RouteCard';
import SampleBadge from '../components/SampleBadge';
import { sampleRoutes } from '../data/sample';
import { useI18n } from '../i18n';

export default function RoutesPage() {
  const { t } = useI18n();
  return (
    <>
      <PageBanner icon={Map} title={t('p.routes')} desc={t('p.routes.d')} tone="from-emerald-950 to-ink" />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-4 flex items-center gap-3 text-sm text-neutral-500">{sampleRoutes.length} {t('stat.routes')} <SampleBadge /></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{sampleRoutes.map((r) => <RouteCard key={r.id} route={r} />)}</div>
        <p className="mt-6 text-sm text-neutral-500">{t('soon.desc')} ({t('soon.phase')} 2)</p>
      </div>
    </>
  );
}
