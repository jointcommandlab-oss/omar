import { Tag } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import EmptyState from '../components/EmptyState';
import CategoryPills from './CategoryPills';
import { useI18n } from '../i18n';

export default function UsedPage() {
  const { t } = useI18n();
  return (
    <>
      <PageBanner icon={Tag} title={t('p.used')} desc={t('p.used.d')} tone="from-amber-950 to-ink" />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <CategoryPills />
        <p className="text-sm text-neutral-500">0 {t('count.listings')}</p>
        <EmptyState icon={Tag} title={t('empty.used.t')} desc={t('empty.used.d')} />
      </div>
    </>
  );
}
