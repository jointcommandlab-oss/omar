import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Bell, Menu, Moon, Settings, ShoppingCart, Sun, UserCircle, X } from 'lucide-react';
import Logo from './Logo';
import { navItems } from './navItems';
import { useI18n } from '../i18n';
import { useTheme } from '../hooks/useTheme';

export default function Header() {
  const { t, toggleLang } = useI18n();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-ink/95">
      <div className="mx-auto flex max-w-6xl items-center gap-1 px-3 py-3 sm:gap-2 sm:px-4">
        <Logo />
        <nav className="ms-4 hidden items-center gap-1 lg:flex" aria-label="Main">
          {navItems.map(({ to, key }) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-semibold ${isActive ? 'bg-brand text-white' : 'hover:bg-neutral-100 dark:hover:bg-white/10'}`}>{t(key)}</NavLink>
          ))}
        </nav>
        <div className="ms-auto flex items-center gap-1 sm:gap-2">
          <button onClick={toggleLang} className="hidden rounded-xl px-3 py-2 text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-white/10 sm:block">{t('lang.switch')}</button>
          <Link to="/profile" className="icon-btn" aria-label={t('hdr.profile')}><UserCircle size={22} /></Link>
          <Link to="/settings" className="icon-btn" aria-label={t('hdr.settings')}><Settings size={20} /></Link>
          <Link to="/notifications" className="icon-btn" aria-label={t('hdr.notifications')}><Bell size={20} /></Link>
          <button onClick={toggle} className="icon-btn" aria-label={t('hdr.theme')}>{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button>
          <Link to="/cart" className="icon-btn" aria-label={t('hdr.cart')}><ShoppingCart size={20} /></Link>
          <button onClick={() => setOpen((o) => !o)} className="icon-btn lg:hidden" aria-expanded={open} aria-label={open ? t('hdr.close') : t('hdr.menu')}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-neutral-200 bg-white p-3 dark:border-white/10 dark:bg-ink lg:hidden" aria-label="Mobile">
          <ul className="space-y-1">
            {navItems.map(({ to, key, icon: Icon }) => (
              <li key={to}>
                <NavLink to={to} end={to === '/'} className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3.5 font-semibold ${isActive ? 'bg-brand text-white shadow-lg shadow-brand/30' : 'text-neutral-700 dark:text-neutral-200'}`}>
                  <Icon size={20} aria-hidden /> {t(key)}
                </NavLink>
              </li>
            ))}
            <li><button onClick={toggleLang} className="w-full rounded-xl px-4 py-3.5 text-start font-semibold text-neutral-700 dark:text-neutral-200">{t('lang.switch')}</button></li>
          </ul>
        </nav>
      )}
    </header>
  );
}
