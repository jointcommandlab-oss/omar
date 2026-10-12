import { Link } from 'react-router-dom';
import Logo from './Logo';
import { navItems } from './navItems';
import { useI18n } from '../i18n';

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-16 bg-navy text-neutral-300">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
        <div className="text-white"><Logo /></div>
        <p className="max-w-xl text-sm">{t('hero.desc')}</p>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {navItems.map(({ to, key }) => <li key={to}><Link className="hover:text-brand" to={to}>{t(key)}</Link></li>)}
        </ul>
        <p className="rounded-lg bg-white/5 p-3 text-xs">{t('footer.disclaimer')}</p>
        <p className="text-xs text-neutral-500">© {new Date().getFullYear()} Cycling AE · {t('footer.rights')}</p>
      </div>
    </footer>
  );
}
