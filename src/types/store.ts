export type ProductCategory = 'bikes' | 'helmets' | 'clothing' | 'shoes' | 'accessories' | 'parts' | 'maintenance';

export interface ProductVariant { id: string; label: { ar: string; en: string } }

export interface Product {
  id: string;
  title: { ar: string; en: string };
  description: { ar: string; en: string };
  category: ProductCategory;
  priceAed: number;
  variants: ProductVariant[];
  inStock: boolean;
  images: string[];
  isDemo: boolean;
}

export interface CartItem { productId: string; variantId: string; qty: number }
