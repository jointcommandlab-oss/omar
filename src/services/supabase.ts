import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Lazy Supabase client.
 * - Uses ONLY the public URL + anon key (safe in the browser; data is protected by RLS).
 * - Never reference a service-role key anywhere in the frontend.
 * - If the env vars are missing, `supabase` is null and the app keeps working with sample data.
 */
const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {};
const url = env.VITE_SUPABASE_URL?.trim();
const anonKey = env.VITE_SUPABASE_ANON_KEY?.trim();

function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

export const isSupabaseConfigured = Boolean(url && anonKey && isHttpUrl(url));

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;
