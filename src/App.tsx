import { Route, Routes } from 'react-router-dom';
import { Bell, LayoutDashboard, ShoppingCart, UserCircle } from 'lucide-react';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import RoutesPage from './pages/RoutesPage';
import EventsPage from './pages/EventsPage';
import StorePage from './pages/StorePage';
import UsedPage from './pages/UsedPage';
import AdvisorPage from './pages/AdvisorPage';
import AchievementsPage from './pages/AchievementsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import SettingsPage from './pages/SettingsPage';
import ComingSoon from './pages/ComingSoon';
import { useI18n } from './i18n';

function NotFound() {
  const { t } = useI18n();
  return <ComingSoon icon={Bell} title={t('nf.title')} desc="404" phase={1} />;
}
function Soon({ k, icon, phase, note }: { k: 'p.profile' | 'p.notifications' | 'p.cart' | 'p.admin'; icon: typeof Bell; phase: number; note?: 'admin' }) {
  const { t } = useI18n();
  return <ComingSoon icon={icon} title={t(k)} desc="" phase={phase} note={note ? t('admin.note') : undefined} />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="routes" element={<RoutesPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="store" element={<StorePage />} />
        <Route path="advisor" element={<AdvisorPage />} />
        <Route path="achievements" element={<AchievementsPage />} />
        <Route path="used" element={<UsedPage />} />
        <Route path="subscription" element={<SubscriptionPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<Soon k="p.profile" icon={UserCircle} phase={4} />} />
        <Route path="notifications" element={<Soon k="p.notifications" icon={Bell} phase={5} />} />
        <Route path="cart" element={<Soon k="p.cart" icon={ShoppingCart} phase={4} />} />
        <Route path="admin" element={<Soon k="p.admin" icon={LayoutDashboard} phase={6} note="admin" />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
