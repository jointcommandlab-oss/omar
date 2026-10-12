import type { Product, ProductCategory } from '../types/store';

export const categoryIds: ProductCategory[] = ['bikes', 'helmets', 'clothing', 'shoes', 'accessories', 'parts', 'maintenance'];

/** Real catalogue: intentionally empty until the owner supplies verified products. */
export const realProducts: Product[] = [];

/** Clearly-labelled demo items. No brands, no performance claims. Prices are placeholders. */
export const demoProducts: Product[] = [
  {
    id: 'demo-helmet', category: 'helmets', priceAed: 100, inStock: true, images: [], isDemo: true,
    title: { ar: 'خوذة تجريبية', en: 'Sample helmet' },
    description: { ar: 'منتج تجريبي لعرض تصميم المتجر فقط. غير متاح للشراء.', en: 'A demo item to preview the store layout only. Not available for purchase.' },
    variants: [{ id: 's', label: { ar: 'صغير', en: 'Small' } }, { id: 'm', label: { ar: 'وسط', en: 'Medium' } }, { id: 'l', label: { ar: 'كبير', en: 'Large' } }],
  },
  {
    id: 'demo-bottle', category: 'accessories', priceAed: 25, inStock: true, images: [], isDemo: true,
    title: { ar: 'قارورة ماء تجريبية', en: 'Sample water bottle' },
    description: { ar: 'منتج تجريبي لعرض تصميم المتجر فقط. غير متاح للشراء.', en: 'A demo item to preview the store layout only. Not available for purchase.' },
    variants: [{ id: 'std', label: { ar: 'قياسي', en: 'Standard' } }],
  },
  {
    id: 'demo-jersey', category: 'clothing', priceAed: 80, inStock: false, images: [], isDemo: true,
    title: { ar: 'قميص تجريبي', en: 'Sample jersey' },
    description: { ar: 'منتج تجريبي لعرض حالة نفاد المخزون. غير متاح للشراء.', en: 'A demo item showing the out-of-stock state. Not available for purchase.' },
    variants: [{ id: 'm', label: { ar: 'وسط', en: 'Medium' } }, { id: 'l', label: { ar: 'كبير', en: 'Large' } }],
  },
];

export const allProducts: Product[] = [...realProducts, ...demoProducts];
export const findProduct = (id: string) => allProducts.find((p) => p.id === id);

export function formatAed(n: number, lang: 'ar' | 'en') {
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-AE' : 'en-AE', { style: 'currency', currency: 'AED' }).format(n);
}
