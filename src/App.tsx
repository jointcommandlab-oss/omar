import { Route, Routes } from 'react-router-dom';
import { Bell } from 'lucide-react';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import RoutesPage from './pages/RoutesPage';
import EventsPage from './pages/EventsPage';
import StorePage from './pages/StorePage';
import ProductDetail from './pages/ProductDetail';
import UsedPage from './pages/UsedPage';
import AdvisorPage from './pages/AdvisorPage';
import AchievementsPage from './pages/AchievementsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import SettingsPage from './pages/SettingsPage';
import ComingSoon from './pages/ComingSoon';
import RouteDetail from './pages/RouteDetail';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import CartPage from './pages/CartPage';
import AdminPage from './pages/AdminPage';
import { useI18n } from './i18n';

function NotFound() {
  const { t } = useI18n();
  return <ComingSoon icon={Bell} title={t('nf.title')} desc="404" phase={1} />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="routes" element={<RoutesPage />} />
        <Route path="routes/:id" element={<RouteDetail />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="store" element={<StorePage />} />
        <Route path="store/:id" element={<ProductDetail />} />
        <Route path="advisor" element={<AdvisorPage />} />
        <Route path="achievements" element={<AchievementsPage />} />
        <Route path="used" element={<UsedPage />} />
        <Route path="subscription" element={<SubscriptionPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
