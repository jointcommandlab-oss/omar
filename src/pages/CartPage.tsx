import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import EmptyState from '../components/EmptyState';
import { useI18n } from '../i18n';

export default function CartPage() {
  const { t, tr } = useI18n();
  return (
    <>
      <PageBanner icon={ShoppingCart} title={t('p.cart')} desc="" />
      <div className="mx-auto max-w-xl space-y-4 px-4 py-8">
        <EmptyState icon={ShoppingCart} title={tr('سلتك فارغة', 'Your cart is empty')} desc={tr('لا توجد منتجات منشورة بعد. الدفع غير مفعّل حتى موافقة المالك.', 'No products are published yet. Checkout stays disabled until owner approval.')} />
        <Link to="/store" className="btn-primary w-full">{t('nav.store')}</Link>
      </div>
    </>
  );
}
