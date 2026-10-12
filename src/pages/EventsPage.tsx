import { Calendar, Trophy } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import EmptyState from '../components/EmptyState';
import { useI18n } from '../i18n';

export default function EventsPage() {
  const { t } = useI18n();
  return (
    <>
      <PageBanner icon={Trophy} title={t('p.events')} desc={t('p.events.d')} tone="from-indigo-950 to-ink" />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <EmptyState icon={Calendar} title={t('empty.events.t')} desc={t('empty.events.d')} />
      </div>
    </>
  );
}
