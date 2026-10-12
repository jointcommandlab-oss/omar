import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Hammer } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import { useI18n } from '../i18n';

export default function ComingSoon({ icon, title, desc, phase, note }: { icon: LucideIcon; title: string; desc: string; phase: number; note?: string }) {
  const { t } = useI18n();
  return (
    <>
      <PageBanner icon={icon} title={title} desc={desc} />
      <div className="mx-auto max-w-xl px-4 py-12">
        <div className="card flex flex-col items-center px-6 py-12 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-soft text-brand"><Hammer size={30} aria-hidden /></span>
          <span className="mt-4 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">{t('soon.badge')} · {t('soon.phase')} {phase}</span>
          <h2 className="mt-4 text-xl font-extrabold">{t('soon.title')}</h2>
          <p className="mt-2 text-neutral-500">{note ?? t('soon.desc')}</p>
          <Link to="/" className="btn-primary mt-6">{t('soon.back')}</Link>
        </div>
      </div>
    </>
  );
}
