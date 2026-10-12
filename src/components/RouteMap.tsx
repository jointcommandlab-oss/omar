/// <reference types="vite/client" />
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import type { RouteGeo } from '../types/routeGeo';
import { useI18n } from '../i18n';

// Vite does not resolve Leaflet's default icon URLs; point them at bundled assets.
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow });

export default function RouteMap({ route }: { route: RouteGeo }) {
  const el = useRef<HTMLDivElement>(null);
  const { tr } = useI18n();
  useEffect(() => {
    if (!el.current) return;
    const map = L.map(el.current, { scrollWheelZoom: false });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      className: 'cae-tiles',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    const pts: L.LatLngExpression[] = [];
    if (route.path && route.path.length > 1) {
      L.polyline(route.path, { color: '#FF6B00', weight: 5 }).addTo(map);
      pts.push(...route.path);
    }
    if (route.start) { L.marker(route.start).addTo(map).bindPopup(tr('البداية', 'Start')); pts.push(route.start); }
    if (route.finish) { L.marker(route.finish).addTo(map).bindPopup(tr('النهاية', 'Finish')); pts.push(route.finish); }
    if (pts.length) map.fitBounds(L.latLngBounds(pts), { padding: [24, 24], maxZoom: 16 });
    return () => { map.remove(); };
  }, [route, tr]);
  return (
    <>
      {/* Map geometry stays LTR inside RTL pages; tiles are inverted in dark mode. */}
      <style>{'.dark .cae-tiles{filter:invert(1) hue-rotate(180deg) brightness(.95) contrast(.9)}'}</style>
      <div ref={el} dir="ltr" role="region" aria-label={tr('خريطة المسار', 'Route map')} className="h-72 w-full overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10" />
    </>
  );
}
