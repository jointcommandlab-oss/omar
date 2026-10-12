import { Settings } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import { useI18n } from '../i18n';
import { useTheme } from '../hooks/useTheme';

export default function SettingsPage() {
  const { t, lang, setLang } = useI18n();
  const { theme, toggle } = useTheme();
  const seg = (on: boolean) => `rounded-lg px-4 py-2 font-semibold ${on ? 'bg-brand text-white' : 'bg-neutral-100 dark:bg-white/10'}`;
  return (
    <>
      <PageBanner icon={Settings} title={t('p.settings')} desc="" />
      <div className="mx-auto max-w-xl space-y-4 px-4 py-8">
        <div className="card flex items-center justify-between p-4"><span className="font-semibold">{t('set.language')}</span>
          <div className="flex gap-2"><button className={seg(lang === 'ar')} onClick={() => setLang('ar')}>العربية</button><button className={seg(lang === 'en')} onClick={() => setLang('en')}>English</button></div></div>
        <div className="card flex items-center justify-between p-4"><span className="font-semibold">{t('set.theme')}</span>
          <div className="flex gap-2"><button className={seg(theme === 'light')} onClick={() => theme !== 'light' && toggle()}>{t('set.light')}</button><button className={seg(theme === 'dark')} onClick={() => theme !== 'dark' && toggle()}>{t('set.dark')}</button></div></div>
      </div>
    </>
  );
}
