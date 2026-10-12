import { Lock, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import { useI18n } from '../i18n';

export default function AdminPage() {
  const { t, tr } = useI18n();
  const tabs = [tr('نظرة عامة', 'Overview'), tr('المسارات', 'Routes'), tr('الفعاليات', 'Events'), tr('المنتجات', 'Products'), tr('الطلبات', 'Orders'), tr('المستعمل', 'Used'), tr('المستخدمون', 'Users')];
  return (
    <>
      <PageBanner icon={LayoutDashboard} title={t('p.admin')} desc="" />
      <div className="mx-auto max-w-xl space-y-4 px-4 py-8 text-center">
        <div className="card p-8"><Lock className="mx-auto text-brand" size={36} aria-hidden />
          <h2 className="mt-3 text-xl font-extrabold">{tr('للمشرفين فقط', 'Administrators only')}</h2>
          <p className="mt-2 text-sm text-neutral-500">{t('admin.note')}</p>
          <p className="mt-2 text-sm text-neutral-500">{tr('لا يُمنح أي دور مشرف من الواجهة؛ يُعيَّن المشرف الأول عبر إعداد آمن موثّق.', 'No admin role is granted from the frontend; the first admin is assigned via a documented secure setup.')}</p></div>
        <ul className="flex flex-wrap justify-center gap-2 opacity-60" aria-label={tr('أقسام مخطط لها', 'Planned sections')}>{tabs.map((x) => <li key={x} className="rounded-full border border-neutral-300 px-3 py-1 text-sm dark:border-white/20">{x}</li>)}</ul>
        <Link to="/" className="btn-primary">{t('soon.back')}</Link>
      </div>
    </>
  );
}
