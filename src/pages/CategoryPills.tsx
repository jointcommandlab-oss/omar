import { useState } from 'react';
import { useI18n, type Key } from '../i18n';

const cats: Key[] = ['cat.all', 'cat.bikes', 'cat.helmets', 'cat.clothing', 'cat.shoes', 'cat.accessories', 'cat.parts', 'cat.maintenance'];

export default function CategoryPills() {
  const { t } = useI18n();
  const [active, setActive] = useState<Key>('cat.all');
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
      {cats.map((c) => (
        <button key={c} onClick={() => setActive(c)} aria-pressed={active === c}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${active === c ? 'border-brand bg-brand text-white' : 'border-neutral-200 bg-white dark:border-white/10 dark:bg-neutral-900'}`}>{t(c)}</button>
      ))}
    </div>
  );
}
