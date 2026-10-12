import { Crown, Lock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useI18n, type Key } from '../i18n';
import AdvisorForm from '../components/AdvisorForm';
import { IS_DEV, IS_SUBSCRIBER } from '../config/features';

const bullets: Key[] = ['adv.b1', 'adv.b2', 'adv.b3', 'adv.b4'];

export default function AdvisorPage() {
  const { t, tr } = useI18n();
  const [preview, setPreview] = useState(false);
  if (IS_SUBSCRIBER || (IS_DEV && preview)) {
    return (
      <div className="bg-ink px-4 py-10 text-white">
        <h1 className="mb-6 text-center text-3xl font-extrabold">{tr('مستشار المسارات', 'Route advisor')}</h1>
        <AdvisorForm />
        {IS_DEV && !IS_SUBSCRIBER && <button type="button" onClick={() => setPreview(false)} className="mx-auto mt-6 block text-sm underline">{tr('إخفاء المعاينة', 'Hide preview')}</button>}
      </div>
    );
  }
  return (
    <div className="bg-ink px-4 py-16 text-white">
      <div className="mx-auto max-w-lg text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-brand shadow-xl shadow-brand/30"><Lock size={36} aria-hidden /></span>
        <h1 className="mt-6 text-3xl font-extrabold">{t('adv.lockTitle')}</h1>
        <p className="mt-3 text-neutral-400">{t('adv.lockDesc')}</p>
        <ul className="mt-8 space-y-3 rounded-2xl border border-brand/30 bg-white/5 p-5 text-start">
          {bullets.map((b) => <li key={b} className="flex items-center gap-3"><Sparkles size={18} className="shrink-0 text-brand" aria-hidden />{t(b)}</li>)}
        </ul>
        <Link to="/subscription" className="btn-primary mt-6 w-full py-4 text-lg">{t('adv.cta')} <Crown size={18} aria-hidden /></Link>
        <p className="mt-4 text-xs text-neutral-500">{t('adv.note')}</p>
        {IS_DEV && <button type="button" onClick={() => setPreview(true)} className="mt-4 text-sm underline">{tr('معاينة (تطوير فقط)', 'Preview (dev only)')}</button>}
      </div>
    </div>
  );
}
