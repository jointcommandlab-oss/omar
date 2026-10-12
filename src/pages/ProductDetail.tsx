import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag, ShoppingCart, Tag } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import SampleBadge from '../components/SampleBadge';
import { findProduct, formatAed } from '../data/products';
import { useCart, useWishlist } from '../hooks/useCart';
import { useI18n } from '../i18n';

export default function ProductDetail() {
  const { id = '' } = useParams();
  const { tr, lang, pick } = useI18n();
  const cart = useCart();
  const wish = useWishlist();
  const p = findProduct(id);
  const [variant, setVariant] = useState('');
  const [added, setAdded] = useState(false);

  if (!p) {
    return (
      <div className="mx-auto max-w-xl space-y-4 px-4 py-8">
        <EmptyState icon={Tag} title={tr('المنتج غير موجود', 'Product not found')} desc={tr('ربما أُزيل هذا المنتج.', 'This product may have been removed.')} />
        <Link to="/store" className="btn-primary w-full">{tr('العودة للمتجر', 'Back to store')}</Link>
      </div>
    );
  }
  const vid = variant || p.variants[0]?.id || '';
  const liked = wish.has(p.id);
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <Link to="/store" className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
        <ArrowLeft size={16} className="rtl:rotate-180" aria-hidden /> {tr('العودة للمتجر', 'Back to store')}
      </Link>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card grid aspect-square place-items-center bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-700" aria-hidden>
          <ShoppingBag size={64} className="text-neutral-400" />
        </div>
        <div className="space-y-4">
          {p.isDemo && <SampleBadge />}
          <h1 className="text-2xl font-extrabold">{pick(p.title)}</h1>
          <p className="text-xl font-bold text-brand">{formatAed(p.priceAed, lang)}</p>
          <p className="text-neutral-600 dark:text-neutral-300">{pick(p.description)}</p>
          {p.variants.length > 0 && (
            <div>
              <label htmlFor="variant" className="mb-1 block text-sm font-semibold">{tr('الخيار', 'Option')}</label>
              <select id="variant" value={vid} onChange={(e) => { setVariant(e.target.value); setAdded(false); }} className="card w-full px-4 py-3">
                {p.variants.map((v) => <option key={v.id} value={v.id}>{pick(v.label)}</option>)}
              </select>
            </div>
          )}
          <div className="flex gap-2">
            <button className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50" disabled={!p.inStock || !vid} onClick={() => { cart.add(p.id, vid); setAdded(true); }}>
              <ShoppingCart size={18} aria-hidden /> {p.inStock ? tr('أضف إلى السلة', 'Add to cart') : tr('نفد المخزون', 'Out of stock')}
            </button>
            <button onClick={() => wish.toggle(p.id)} aria-pressed={liked} aria-label={tr('المفضلة', 'Wishlist')} className="btn-ghost px-4">
              <Heart size={20} className={liked ? 'fill-red-500 text-red-500' : ''} aria-hidden />
            </button>
          </div>
          <p role="status" className="text-sm text-green-700 dark:text-green-400">
            {added && <>{tr('أُضيف إلى السلة.', 'Added to cart.')} <Link to="/cart" className="underline">{tr('عرض السلة', 'View cart')}</Link></>}
          </p>
        </div>
      </div>
    </div>
  );
}
