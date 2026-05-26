export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  image: string | null;
  children?: Category[];
}

export interface ProductVariant {
  id: number;
  weight_grams: number;
  price: number;
  stock: number;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount_price: number | null;
  stock: number;
  is_active: boolean;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  rating: number;
  review_count: number;
}

export interface ProductImage {
  id: number;
  url: string;
  is_main: boolean;
  sort_order: number;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
}

export interface Order {
  id: number;
  status: OrderStatus;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  delivery_city: string;
  delivery_branch: string;
  total_price: string;
  discount: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  product_id: number;
  variant_id: number | null;
  quantity: number;
  unit_price: string;
}

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";
