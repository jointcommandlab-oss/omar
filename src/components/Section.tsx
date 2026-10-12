import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

export default function Section({ title, to, children }: { title: string; to?: string; children: ReactNode }) {
  const { t } = useI18n();
  return (
    <section className="mx-auto mt-12 max-w-6xl px-4">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-2xl font-extrabold">{title}</h2>
        {to && <Link to={to} className="text-sm font-semibold text-brand">{t('sec.all')}</Link>}
      </div>
      {children}
    </section>
  );
}
