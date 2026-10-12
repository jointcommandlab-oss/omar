import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Lang } from '../types';
import { dict, type Key } from './dictionary';

interface I18n { lang: Lang; dir: 'rtl' | 'ltr'; t: (k: Key) => string; setLang: (l: Lang) => void; toggleLang: () => void; pick: (o: { ar: string; en: string }) => string; tr: (ar: string, en: string) => string }
const Ctx = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (document.documentElement.lang === 'en' ? 'en' : 'ar'));
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    try { localStorage.setItem('cae-lang', lang); } catch { /* ignore */ }
  }, [lang, dir]);
  const t = useCallback((k: Key) => dict[lang][k], [lang]);
  const pick = useCallback((o: { ar: string; en: string }) => o[lang], [lang]);
  const tr = useCallback((ar: string, en: string) => (lang === 'ar' ? ar : en), [lang]);
  const toggleLang = useCallback(() => setLang((l) => (l === 'ar' ? 'en' : 'ar')), []);
  return <Ctx.Provider value={{ lang, dir, t, setLang, toggleLang, pick, tr }}>{children}</Ctx.Provider>;
}
export function useI18n() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useI18n outside provider');
  return c;
}
export type { Key };
