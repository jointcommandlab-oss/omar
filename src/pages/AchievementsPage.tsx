import { Bike, Timer, Trophy, Zap } from 'lucide-react';
import SampleBadge from '../components/SampleBadge';
import { useI18n } from '../i18n';

// DEMO ONLY: anonymised placeholder rows to show the layout. Never real riders.
const demo = [1, 2, 3, 4, 5].map((n) => ({ n, time: ['1:12:34', '1:15:02', '1:17:45', '1:20:11', '1:22:58'][n - 1] }));

export default function AchievementsPage() {
  const { t } = useI18n();
  const tiles = [
    { icon: Trophy, v: '—', l: t('achv.longest'), c: 'text-brand' },
    { icon: Zap, v: '—', l: t('achv.total'), c: 'text-emerald-400' },
    { icon: Bike, v: '—', l: t('achv.rides'), c: 'text-purple-400' },
    { icon: Timer, v: '—', l: t('achv.best'), c: 'text-sky-400' },
  ];
  return (
    <div className="bg-ink px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-extrabold">🏆 {t('p.achievements')}</h1>
        <p className="mt-2 text-neutral-400">{t('p.achievements.d')}</p>
        <p className="mt-4 text-sm text-neutral-400">{t('achv.promo')}</p>
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {tiles.map(({ icon: I, v, l, c }) => (
            <div key={l} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <I className={c} aria-hidden /><div className="mt-3 text-2xl font-extrabold">{v}</div><div className="text-sm text-neutral-400">{l}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 p-4">
            <h2 className="font-bold">{t('achv.board')}</h2><SampleBadge />
          </div>
          <p className="bg-amber-500/10 p-3 text-sm text-amber-300">{t('achv.demoWarn')}</p>
          <table className="w-full text-sm">
            <thead className="text-neutral-400"><tr><th className="p-3 text-start">#</th><th className="p-3 text-start">{t('achv.rider')}</th><th className="p-3 text-start">{t('achv.time')}</th></tr></thead>
            <tbody>
              {demo.map((r) => (
                <tr key={r.n} className="border-t border-white/5 opacity-70">
                  <td className="p-3">{r.n}</td><td className="p-3">{t('achv.demoRider')} {r.n}</td><td className="p-3 text-sky-400" dir="ltr">{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
