import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin, ShoppingBag } from 'lucide-react';
import { useI18n, type Key } from '../i18n';
import { getHomeStats } from '../services/stats';

// Gradient placeholders stand in for licensed photography (rights unconfirmed).
const slides: { key: Key; bg: string }[] = [
  { key: 'hero.s1', bg: 'from-[#2a1a0c] via-[#7a3a0a] to-[#0B0F14]' },
  { key: 'hero.s2', bg: 'from-[#0c2233] via-[#17506b] to-[#0B0F14]' },
  { key: 'hero.s3', bg: 'from-[#1b2a1b] via-[#35553a] to-[#0B0F14]' },
  { key: 'hero.s4', bg: 'from-[#0a0f2a] via-[#2a2a6b] to-[#0B0F14]' },
  { key: 'hero.s5', bg: 'from-[#2a0c18] via-[#6b1a3a] to-[#0B0F14]' },
];

export default function HeroCarousel() {
  const { t, dir, lang } = useI18n();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const stats = getHomeStats();
  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (paused || reduced) return;
    const id = setInterval(() => setI((n) => (n + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [paused, reduced]);

  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const statCards = [
    { n: stats.products, l: t('stat.products') },
    { n: stats.emirates, l: t('stat.emirates') },
    { n: stats.routes, l: t('stat.routes') },
  ];

  return (
    <section className="relative isolate overflow-hidden text-white" onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} aria-roledescription="carousel">
      {slides.map((s, idx) => (
        <div key={s.key} aria-hidden={idx !== i} className={`absolute inset-0 -z-10 bg-gradient-to-br ${s.bg} transition-opacity duration-700 ${idx === i ? 'opacity-100' : 'opacity-0'}`} />
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:pt-16">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-sm">
          <span className="h-2 w-2 rounded-full bg-brand" /> {t('hero.badge')} · {t(slides[i].key)}
        </span>
        <h1 className="mt-6 text-5xl font-extrabold leading-tight sm:text-7xl" dir="ltr" style={{ textAlign: dir === 'rtl' ? 'right' : 'left' }}>
          Cycling<br /><span className="text-brand">AE</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-200">{t('hero.desc')}</p>
        <div className="mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
          <Link to="/routes" className="btn-primary flex-1 py-4 text-lg"><MapPin size={20} aria-hidden /> {t('hero.explore')} <Arrow size={20} aria-hidden /></Link>
          <Link to="/store" className="btn-light flex-1 py-4 text-lg"><ShoppingBag size={20} aria-hidden /> {t('hero.shop')}</Link>
        </div>
        <div className="mt-10 grid grid-cols-3 gap-3">
          {statCards.map((c) => (
            <div key={c.l} className="rounded-2xl border border-white/10 bg-black/40 p-4 text-center backdrop-blur">
              <div className="text-3xl font-extrabold text-brand">{c.n}</div>
              <div className="text-sm text-neutral-300">{c.l}</div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-xs text-neutral-400">{t('sample.note')}</p>
        <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label={lang === 'ar' ? 'الشرائح' : 'Slides'}>
          {slides.map((s, idx) => (
            <button key={s.key} role="tab" aria-selected={idx === i} aria-label={t(s.key)} onClick={() => setI(idx)}
              className={`h-2.5 rounded-full transition-all ${idx === i ? 'w-10 bg-brand' : 'w-2.5 bg-white/40'}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
