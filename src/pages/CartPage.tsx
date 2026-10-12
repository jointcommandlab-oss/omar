import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import EmptyState from '../components/EmptyState';
import SampleBadge from '../components/SampleBadge';
import { findProduct, formatAed } from '../data/products';
import { useCart } from '../hooks/useCart';
import { useI18n } from '../i18n';

export default function CartPage() {
  const { t, tr, lang, pick } = useI18n();
  const { items, setQty, remove, total } = useCart();
  return (
    <>
      <PageBanner icon={ShoppingCart} title={t('p.cart')} desc="" />
      <div className="mx-auto max-w-xl space-y-4 px-4 py-8">
        {items.length === 0 ? (
          <>
            <EmptyState icon={ShoppingCart} title={tr('سلتك فارغة', 'Your cart is empty')} desc={tr('الدفع غير مفعّل حتى موافقة المالك.', 'Checkout stays disabled until owner approval.')} />
            <Link to="/store" className="btn-primary w-full">{t('nav.store')}</Link>
          </>
        ) : (
          <>
            <ul className="space-y-3">
              {items.map((i) => {
                const p = findProduct(i.productId)!;
                const v = p.variants.find((x) => x.id === i.variantId);
                const name = pick(p.title);
                return (
                  <li key={`${i.productId}:${i.variantId}`} className="card space-y-2 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link to={`/store/${p.id}`} className="font-bold hover:underline">{name}</Link>
                        {v && <p className="text-sm text-neutral-500">{pick(v.label)}</p>}
                        {p.isDemo && <SampleBadge className="mt-1" />}
                      </div>
                      <p className="font-semibold">{formatAed(p.priceAed * i.qty, lang)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button className="icon-btn" aria-label={`${tr('إنقاص الكمية', 'Decrease quantity')}: ${name}`} onClick={() => setQty(i.productId, i.variantId, i.qty - 1)}><Minus size={16} aria-hidden /></button>
                        <span className="min-w-6 text-center font-semibold" aria-live="polite">{i.qty}</span>
                        <button className="icon-btn" aria-label={`${tr('زيادة الكمية', 'Increase quantity')}: ${name}`} onClick={() => setQty(i.productId, i.variantId, i.qty + 1)}><Plus size={16} aria-hidden /></button>
                      </div>
                      <button className="btn-ghost px-3 py-2 text-sm" onClick={() => remove(i.productId, i.variantId)} aria-label={`${tr('إزالة', 'Remove')}: ${name}`}>
                        <Trash2 size={16} aria-hidden /> {tr('إزالة', 'Remove')}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="card flex items-center justify-between p-4 text-lg font-bold">
              <span>{tr('الإجمالي', 'Total')}</span><span>{formatAed(total, lang)}</span>
            </div>
            <button className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50" disabled aria-describedby="checkout-note">{tr('إتمام الشراء', 'Checkout')}</button>
            <p id="checkout-note" className="text-center text-sm text-neutral-500">{tr('الدفع غير مفعّل حتى موافقة المالك.', 'Payment is not enabled until owner approval.')}</p>
          </>
        )}
      </div>
    </>
  );
}
