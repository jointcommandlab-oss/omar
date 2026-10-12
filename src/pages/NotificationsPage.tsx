import { Bell } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import { useI18n } from '../i18n';
import { useLocalState } from '../hooks/useLocalState';

export default function NotificationsPage() {
  const { t, tr } = useI18n();
  const [prefs, setPrefs] = useLocalState('cae-notif-prefs', { events: true, routes: true, store: false });
  const items: [keyof typeof prefs, string][] = [['events', tr('فعاليات جديدة', 'New events')], ['routes', tr('مسارات جديدة', 'New routes')], ['store', tr('عروض المتجر', 'Store offers')]];
  return (
    <>
      <PageBanner icon={Bell} title={t('p.notifications')} desc="" />
      <div className="mx-auto max-w-xl space-y-4 px-4 py-8">
        <div className="card p-4"><p className="font-semibold">{tr('مرحباً بك في سايكلنج AE', 'Welcome to Cycling AE')}</p>
          <p className="mt-1 text-sm text-neutral-500">{tr('الإشعارات الفعلية تظهر هنا عند ربط الحسابات (المرحلة 5).', 'Real notifications appear here once accounts are connected (Phase 5).')}</p></div>
        <div className="card divide-y divide-neutral-100 dark:divide-white/10">
          <h2 className="p-4 font-bold">{tr('تفضيلات الإشعارات', 'Notification preferences')}</h2>
          {items.map(([k, label]) => (
            <label key={k} className="flex items-center justify-between p-4"><span>{label}</span>
              <input type="checkbox" checked={prefs[k]} onChange={(e) => setPrefs({ ...prefs, [k]: e.target.checked })} className="h-5 w-5 accent-brand" /></label>
          ))}
        </div>
      </div>
    </>
  );
}
