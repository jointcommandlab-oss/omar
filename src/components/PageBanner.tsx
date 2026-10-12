import type { LucideIcon } from 'lucide-react';

export default function PageBanner({ icon: Icon, title, desc, tone = 'from-neutral-800 to-ink' }: { icon: LucideIcon; title: string; desc: string; tone?: string }) {
  return (
    <div className={`bg-gradient-to-br ${tone} text-white`}>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand"><Icon size={28} aria-hidden /></span>
          <h1 className="text-3xl font-extrabold">{title}</h1>
        </div>
        <p className="mt-4 max-w-2xl text-lg text-neutral-300">{desc}</p>
      </div>
    </div>
  );
}
