import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ShoppingCart, Tag } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import EmptyState from '../components/EmptyState';
import SampleBadge from '../components/SampleBadge';
import { allProducts, categoryIds, formatAed } from '../data/products';
import { useCart, useWishlist } from '../hooks/useCart';
import type { ProductCategory } from '../types/store';
import { useI18n, type Key } from '../i18n';

export default function StorePage() {
  const { t, tr, lang, pick } = useI18n();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<ProductCategory | 'all'>('all');
  const cart = useCart();
  const wish = useWishlist();

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return allProducts.filter((p) => (cat === 'all' || p.category === cat)
      && (!s || `${p.title.ar} ${p.title.en}`.toLowerCase().includes(s)));
  }, [q, cat]);

  return (
    <>
      <PageBanner icon={ShoppingBag} title={t('p.store')} desc={t('p.store.d')} tone="from-neutral-600 to-ink" />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('search.placeholder')} aria-label={t('search.placeholder')} className="card w-full px-4 py-3" />
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2" role="group" aria-label={tr('التصنيفات', 'Categories')}>
          {(['all', ...categoryIds] as const).map((c) => (
            <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${cat === c ? 'border-brand bg-brand text-white' : 'border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900'}`}>{t(`cat.${c}` as Key)}</button>
          ))}
        </div>
        <p className="text-sm text-neutral-500" aria-live="polite">{list.length} {t('count.products')}</p>
        {list.length === 0 ? (
          <EmptyState icon={Tag} title={t('empty.store.t')} desc={tr('لا توجد منتجات مطابقة. جرّب بحثاً أو تصنيفاً آخر.', 'No matching products. Try another search or category.')} />
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p) => {
              const liked = wish.has(p.id);
              const title = pick(p.title);
              return (
                <li key={p.id} className="card relative flex flex-col overflow-hidden">
                  <Link to={`/store/${p.id}`} className="block" aria-label={title}>
                    <div className="grid aspect-[4/3] place-items-center bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-700" aria-hidden>
                      <ShoppingBag size={40} className="text-neutral-400" />
                    </div>
                  </Link>
                  <button onClick={() => wish.toggle(p.id)} aria-pressed={liked} aria-label={`${tr('المفضلة', 'Wishlist')}: ${title}`}
                    className="absolute end-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow dark:bg-neutral-900/90">
                    <Heart size={20} className={liked ? 'fill-red-500 text-red-500' : 'text-neutral-600 dark:text-neutral-300'} aria-hidden />
                  </button>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    {p.isDemo && <SampleBadge className="self-start" />}
                    <Link to={`/store/${p.id}`} className="font-bold hover:underline">{title}</Link>
                    <p className="font-semibold text-brand">{formatAed(p.priceAed, lang)}</p>
                    <button className="btn-primary mt-auto disabled:cursor-not-allowed disabled:opacity-50" disabled={!p.inStock || p.variants.length === 0}
                      onClick={() => cart.add(p.id, p.variants[0].id)}>
                      <ShoppingCart size={18} aria-hidden /> {p.inStock ? tr('أضف إلى السلة', 'Add to cart') : tr('نفد المخزون', 'Out of stock')}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
