import { FlaskConical } from 'lucide-react';
import { useI18n } from '../i18n';

export default function SampleBadge({ className = '' }: { className?: string }) {
  const { t } = useI18n();
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 ${className}`}>
      <FlaskConical size={12} aria-hidden /> {t('sample.badge')}
    </span>
  );
}
