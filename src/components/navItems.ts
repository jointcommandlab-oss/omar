import { Home, Map, Trophy, ShoppingBag, Sparkles, Crown, Tag } from 'lucide-react';
import type { Key } from '../i18n';

export const navItems: { to: string; key: Key; icon: typeof Home }[] = [
  { to: '/', key: 'nav.home', icon: Home },
  { to: '/routes', key: 'nav.routes', icon: Map },
  { to: '/events', key: 'nav.events', icon: Trophy },
  { to: '/store', key: 'nav.store', icon: ShoppingBag },
  { to: '/advisor', key: 'nav.advisor', icon: Sparkles },
  { to: '/achievements', key: 'nav.achievements', icon: Crown },
  { to: '/used', key: 'nav.used', icon: Tag },
  { to: '/subscription', key: 'nav.subscription', icon: Crown },
];
