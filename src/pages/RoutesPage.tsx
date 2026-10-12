import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Map, Search } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import RouteCard from '../components/RouteCard';
import SampleBadge from '../components/SampleBadge';
import EmptyState from '../components/EmptyState';
import { emirates, sampleRoutes } from '../data/sample';
import { useI18n, type Key } from '../i18n';
import { useLocalState } from '../hooks/useLocalState';

export default function RoutesPage() {
  const { t, pick, tr } = useI18n();
  const [q, setQ] = useState('');
  const [em, setEm] = useState('all');
  const [sort, setSort] = useState<'name' | 'emirate'>('name');
  const [favs] = useLocalState<string[]>('cae-fav-routes', []);
  const list = useMemo(() => sampleRoutes
    .filter((r) => (em === 'all' || r.emirate === em) && pick(r.title).toLowerCase().includes(q.trim().toLowerCase()))
    .sort((a, b) => sort === 'name' ? pick(a.title).localeCompare(pick(b.title)) : a.emirate.localeCompare(b.emirate)), [q, em, sort, pick]);
  const field = 'card w-full px-4 py-3';
  return (
    <>
      <PageBanner icon={Map} title={t('p.routes')} desc={t('p.routes.d')} tone="from-emerald-950 to-ink" />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="card mb-4 grid gap-3 p-4 sm:grid-cols-3">
          <label className="relative sm:col-span-3">
            <Search size={18} className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-neutral-400" aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tr('ابحث عن مسار…', 'Search routes…')} aria-label={tr('بحث', 'Search')} className={field} />
          </label>
          <select value={em} onChange={(e) => setEm(e.target.value)} aria-label={tr('الإمارة', 'Emirate')} className={field}>
            <option value="all">{tr('كل الإمارات', 'All emirates')}</option>
            {emirates.map((e) => <option key={e} value={e}>{t(`em.${e}` as Key)}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as 'name' | 'emirate')} aria-label={tr('ترتيب', 'Sort')} className={field}>
            <option value="name">{tr('الاسم', 'Name')}</option>
            <option value="emirate">{tr('الإمارة', 'Emirate')}</option>
          </select>
          <p className="flex items-center gap-2 text-sm text-neutral-500"><Heart size={16} aria-hidden /> {tr('المفضلة', 'Favorites')}: {favs.length}</p>
        </div>
        <div className="mb-4 flex items-center gap-3 text-sm text-neutral-500">{list.length} {t('stat.routes')} <SampleBadge /></div>
        {list.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((r) => <Link key={r.id} to={`/routes/${r.id}`} className="block"><RouteCard route={r} /></Link>)}
          </div>
        ) : <EmptyState icon={Map} title={tr('لا توجد مسارات مطابقة', 'No matching routes')} desc={tr('جرّب تغيير البحث أو الفلتر.', 'Try changing the search or filter.')} />}
        <p className="mt-6 text-sm text-neutral-500">{tr('فلاتر الصعوبة والمسافة والإضاءة تُضاف عند توفر بيانات موثّقة.', 'Difficulty, distance and lighting filters arrive once verified data exists.')}</p>
      </div>
    </>
  );
}
