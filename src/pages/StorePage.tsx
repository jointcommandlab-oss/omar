import { ShoppingBag, Tag } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import EmptyState from '../components/EmptyState';
import CategoryPills from './CategoryPills';
import { sampleProducts } from '../data/sample';
import { useI18n } from '../i18n';

export default function StorePage() {
  const { t } = useI18n();
  return (
    <>
      <PageBanner icon={ShoppingBag} title={t('p.store')} desc={t('p.store.d')} tone="from-neutral-600 to-ink" />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <input type="search" placeholder={t('search.placeholder')} aria-label={t('search.placeholder')} className="card w-full px-4 py-3" />
        <CategoryPills />
        <p className="text-sm text-neutral-500">{sampleProducts.length} {t('count.products')}</p>
        <EmptyState icon={Tag} title={t('empty.store.t')} desc={t('empty.store.d')} />
      </div>
    </>
  );
}
