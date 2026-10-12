import { useCallback, useState } from 'react';

/** localStorage-backed state. Phase 1-4 stand-in until Supabase (Phase 5). Never stores secrets. */
export function useLocalState<T>(key: string, initial: T) {
  const [v, setV] = useState<T>(() => {
    try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : initial; } catch { return initial; }
  });
  const set = useCallback((n: T | ((p: T) => T)) => {
    setV((p) => {
      const nv = typeof n === 'function' ? (n as (p: T) => T)(p) : n;
      try { localStorage.setItem(key, JSON.stringify(nv)); } catch { /* ignore */ }
      return nv;
    });
  }, [key]);
  return [v, set] as const;
}
