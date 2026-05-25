import type { Product, Category, Order } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${path}`);
  }
  return res.json() as Promise<T>;
}

export interface ProductsParams {
  category?: string;
  search?: string;
  sale?: boolean;
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  results: T[];
}

export const api = {
  products: {
    list(params: ProductsParams = {}): Promise<PaginatedResponse<Product>> {
      const qs = new URLSearchParams();
      if (params.category) qs.set("category", params.category);
      if (params.search)   qs.set("search", params.search);
      if (params.sale)     qs.set("sale", "true");
      if (params.page)     qs.set("page", String(params.page));
      if (params.page_size) qs.set("page_size", String(params.page_size));
      const query = qs.toString();
      return request(`/products/${query ? `?${query}` : ""}`);
    },

    get(slug: string): Promise<Product> {
      return request(`/products/${slug}/`);
    },
  },

  categories: {
    list(): Promise<Category[]> {
      return request("/categories/");
    },
  },

  orders: {
    create(body: {
      contact: { name: string; phone: string; email: string };
      delivery: { city: string; branch: string };
      items: { product_id: number; variant_id: number | null; quantity: number }[];
    }): Promise<Order> {
      return request("/orders/", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },

    get(id: number): Promise<Order> {
      return request(`/orders/${id}/`);
    },
  },

  coupons: {
    validate(code: string): Promise<{ discount: number; type: "percent" | "fixed" | "free_delivery" }> {
      return request("/coupons/validate/", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
    },
  },
};
