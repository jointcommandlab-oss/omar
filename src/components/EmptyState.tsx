import type { LucideIcon } from 'lucide-react';

export default function EmptyState({ icon: Icon, title, desc }: { icon: LucideIcon; title: string; desc: string }) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      <Icon size={44} className="text-neutral-300 dark:text-neutral-600" aria-hidden />
      <p className="mt-4 text-lg font-bold text-neutral-600 dark:text-neutral-300">{title}</p>
      <p className="mt-1 text-sm text-neutral-500">{desc}</p>
    </div>
  );
}
