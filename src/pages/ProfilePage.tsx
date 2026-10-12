import { Heart, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageBanner from '../components/PageBanner';
import { sampleRoutes } from '../data/sample';
import { useI18n } from '../i18n';
import { useLocalState } from '../hooks/useLocalState';

export default function ProfilePage() {
  const { t, pick, tr } = useI18n();
  const [name, setName] = useLocalState('cae-profile-name', '');
  const [favs] = useLocalState<string[]>('cae-fav-routes', []);
  const favRoutes = sampleRoutes.filter((r) => favs.includes(r.id));
  return (
    <>
      <PageBanner icon={UserCircle} title={t('p.profile')} desc="" />
      <div className="mx-auto max-w-xl space-y-4 px-4 py-8">
        <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{tr('الحسابات الحقيقية (تسجيل الدخول والبريد) تأتي في المرحلة 5. هذه البيانات تُحفظ على جهازك فقط.', 'Real accounts (sign-in, email) arrive in Phase 5. This data is saved on your device only.')}</p>
        <label className="card block p-4"><span className="text-sm text-neutral-500">{tr('الاسم المعروض', 'Display name')}</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} className="mt-2 w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-2 dark:border-white/10" /></label>
        <div className="card p-4"><h2 className="mb-3 flex items-center gap-2 font-bold"><Heart size={18} className="text-brand" aria-hidden /> {tr('مساراتي المفضلة', 'My favorite routes')}</h2>
          {favRoutes.length ? <ul className="space-y-2">{favRoutes.map((r) => <li key={r.id}><Link className="text-brand" to={`/routes/${r.id}`}>{pick(r.title)}</Link></li>)}</ul>
            : <p className="text-sm text-neutral-500">{tr('لا توجد مفضلة بعد.', 'No favorites yet.')}</p>}</div>
      </div>
    </>
  );
}
