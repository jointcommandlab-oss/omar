import { useState } from 'react';
import { Check, Crown } from 'lucide-react';
import { useI18n, type Key } from '../i18n';

// Configurable example prices (from the owner's reference). Move to subscription_plans table in Phase 5/6.
const PRICE = { monthly: 31, yearly: 352 };
const features: Key[] = ['sub.f1', 'sub.f2', 'sub.f3', 'sub.f4', 'sub.f5', 'sub.f6'];

export default function SubscriptionPage() {
  const { t } = useI18n();
  const [yearly, setYearly] = useState(false);
  const savePct = Math.round((1 - PRICE.yearly / (PRICE.monthly * 12)) * 100);
  const perMonth = Math.round(PRICE.yearly / 12);
  const tab = (on: boolean) => `rounded-xl px-5 py-3 font-semibold ${on ? 'bg-white text-ink' : 'text-neutral-400'}`;
  return (
    <div className="bg-ink px-4 py-12 text-white">
      <div className="mx-auto max-w-md text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-sm text-brand"><Crown size={16} aria-hidden /> {t('sub.badge')}</span>
        <h1 className="mt-5 text-4xl font-extrabold">{t('sub.title')}</h1>
        <p className="mt-3 text-neutral-400">{t('sub.desc')}</p>
        <div className="mx-auto mt-8 inline-flex gap-1 rounded-2xl bg-white/10 p-1.5" role="group">
          <button className={tab(!yearly)} aria-pressed={!yearly} onClick={() => setYearly(false)}>{t('sub.monthly')}</button>
          <button className={`${tab(yearly)} flex items-center gap-2`} aria-pressed={yearly} onClick={() => setYearly(true)}>
            {t('sub.yearly')} <span className="rounded-full bg-brand px-2 py-0.5 text-xs text-white">{t('sub.save')} {savePct}%</span>
          </button>
        </div>
        <div className="relative mt-8 rounded-3xl border border-brand/40 bg-navy p-6">
          {yearly && <span className="absolute -top-3 start-1/2 -translate-x-1/2 rounded-full bg-brand px-4 py-1 text-sm font-bold rtl:translate-x-1/2">{t('sub.best')}</span>}
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand/10 text-brand"><Crown size={32} aria-hidden /></span>
          <h2 className="mt-4 text-2xl font-bold">{t('sub.plan')}</h2>
          <div className="mt-3 text-6xl font-extrabold"><span className="me-2 text-xl">{t('aed')}</span>{yearly ? PRICE.yearly : PRICE.monthly}</div>
          <p className="mt-1 text-neutral-400">{yearly ? `${t('sub.perYear')} · ${perMonth} ${t('aed')} / ${t('sub.mo')}` : t('sub.perMonth')}</p>
          <ul className="mt-6 space-y-3 text-start">
            {features.map((f) => <li key={f} className="flex items-center gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand"><Check size={18} aria-hidden /></span>{t(f)}</li>)}
          </ul>
          <button disabled className="btn mt-6 w-full cursor-not-allowed bg-neutral-700 py-4 text-lg text-neutral-300">{t('sub.cta')}</button>
          <p className="mt-3 text-xs text-neutral-400">{t('sub.note')}</p>
        </div>
        <p className="mt-4 text-xs text-neutral-500">{t('sub.example')}</p>
      </div>
    </div>
  );
}
