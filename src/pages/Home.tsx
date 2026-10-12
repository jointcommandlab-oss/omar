import { Calendar, Map, ShoppingBag, Trophy } from 'lucide-react';
import HeroCarousel from '../components/HeroCarousel';
import Section from '../components/Section';
import RouteCard from '../components/RouteCard';
import EmptyState from '../components/EmptyState';
import { Link } from 'react-router-dom';
import { Crown } from 'lucide-react';
import { sampleEvents, sampleProducts, sampleRoutes } from '../data/sample';
import { useI18n } from '../i18n';

export default function Home() {
  const { t } = useI18n();
  return (
    <>
      <HeroCarousel />
      <Section title={t('sec.routes')} to="/routes">
        {sampleRoutes.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{sampleRoutes.map((r) => <RouteCard key={r.id} route={r} />)}</div>
        ) : <EmptyState icon={Map} title={t('route.unverified')} desc="" />}
      </Section>
      <Section title={t('sec.events')} to="/events">
        {sampleEvents.length ? null : <EmptyState icon={Calendar} title={t('empty.events.t')} desc={t('empty.events.d')} />}
      </Section>
      <Section title={t('sec.shop')} to="/store">
        {sampleProducts.length ? null : <EmptyState icon={ShoppingBag} title={t('empty.store.t')} desc={t('empty.store.d')} />}
      </Section>
      <Section title={t('sec.achv')} to="/achievements">
        <div className="card flex items-center gap-4 p-5">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand"><Trophy aria-hidden /></span>
          <p className="text-neutral-600 dark:text-neutral-300">{t('achv.promo')}</p>
        </div>
      </Section>
      <section className="mx-auto mt-12 max-w-6xl px-4">
        <div className="rounded-3xl bg-gradient-to-br from-ink to-navy p-8 text-center text-white">
          <Crown className="mx-auto text-brand" size={36} aria-hidden />
          <h2 className="mt-3 text-2xl font-extrabold">{t('sub.title')}</h2>
          <p className="mt-2 text-neutral-300">{t('sub.desc')}</p>
          <Link to="/subscription" className="btn-primary mt-5">{t('nav.subscription')}</Link>
        </div>
      </section>
    </>
  );
}
