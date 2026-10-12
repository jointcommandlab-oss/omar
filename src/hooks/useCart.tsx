import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useLocalState } from './useLocalState';
import { findProduct } from '../data/products';
import type { CartItem } from '../types/store';

interface Cart {
  items: CartItem[];
  add: (productId: string, variantId: string, qty?: number) => void;
  remove: (productId: string, variantId: string) => void;
  setQty: (productId: string, variantId: string, qty: number) => void;
  total: number;
  count: number;
}
const Ctx = createContext<Cart | null>(null);
const same = (i: CartItem, p: string, v: string) => i.productId === p && i.variantId === v;

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setItems] = useLocalState<CartItem[]>('cae-cart', []);
  // Drop entries whose product no longer exists.
  const items = useMemo(() => (Array.isArray(raw) ? raw : []).filter((i) => findProduct(i.productId) && i.qty > 0), [raw]);
  const add = useCallback((p: string, v: string, qty = 1) => setItems((cur) =>
    cur.some((i) => same(i, p, v)) ? cur.map((i) => (same(i, p, v) ? { ...i, qty: Math.min(99, i.qty + qty) } : i)) : [...cur, { productId: p, variantId: v, qty }]), [setItems]);
  const remove = useCallback((p: string, v: string) => setItems((cur) => cur.filter((i) => !same(i, p, v))), [setItems]);
  const setQty = useCallback((p: string, v: string, qty: number) => setItems((cur) =>
    qty < 1 ? cur.filter((i) => !same(i, p, v)) : cur.map((i) => (same(i, p, v) ? { ...i, qty: Math.min(99, qty) } : i))), [setItems]);
  const total = items.reduce((s, i) => s + (findProduct(i.productId)?.priceAed ?? 0) * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  return <Ctx.Provider value={{ items, add, remove, setQty, total, count }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart outside provider');
  return c;
}

/** Wishlist of product ids, persisted locally. */
export function useWishlist() {
  const [raw, setIds] = useLocalState<string[]>('cae-wishlist', []);
  const ids = Array.isArray(raw) ? raw : [];
  const toggle = useCallback((id: string) => setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])), [setIds]);
  return { ids, has: (id: string) => ids.includes(id), toggle };
}
