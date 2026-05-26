const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("admin_token") ?? "";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}/admin${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...init?.headers,
    },
  });
  if (res.status === 401) {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login";
    throw new Error("unauthorized");
  }
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export interface AdminStats {
  orders_today: number;
  revenue_total: number;
  products_count: number;
  low_stock: number;
}

export interface AdminOrder {
  id: number;
  status: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  delivery_city: string;
  delivery_branch: string;
  total_price: string;
  discount: string;
  items: { id: number; product_id: number; variant_id: number | null; quantity: number; unit_price: string }[];
}

export interface AdminProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  discount_price: string | null;
  stock: number;
  category: { id: number; name: string; slug: string };
  images: { id: number; url: string; is_main: boolean }[];
  variants: { id: number; weight_grams: number; price: string; stock: number }[];
}

export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
}

export interface AdminCoupon {
  ID: number;
  code: string;
  type: string;
  discount: string;
  used_count: number;
  max_uses: number;
  active: boolean;
}

export const adminApi = {
  login(email: string, password: string) {
    return fetch(`${BASE_URL}/admin/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then((r) => r.json() as Promise<{ token?: string; error?: string }>);
  },

  stats: () => request<AdminStats>("/stats"),

  products: {
    list: (page = 1, search = "") =>
      request<{ count: number; results: AdminProduct[] }>(`/products/?page=${page}&search=${encodeURIComponent(search)}`),
    create: (body: unknown) => request<AdminProduct>("/products/", { method: "POST", body: JSON.stringify(body) }),
    update: (id: number, body: unknown) => request<AdminProduct>(`/products/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: number) => request<{ ok: boolean }>(`/products/${id}`, { method: "DELETE" }),
  },

  orders: {
    list: (page = 1, status = "") =>
      request<{ count: number; results: AdminOrder[] }>(`/orders/?page=${page}&status=${status}`),
    get: (id: number) => request<AdminOrder>(`/orders/${id}`),
    updateStatus: (id: number, status: string) =>
      request<{ ok: boolean }>(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  },

  categories: {
    list: () => request<AdminCategory[]>("/categories/"),
    create: (body: { name: string; slug?: string }) =>
      request<AdminCategory>("/categories/", { method: "POST", body: JSON.stringify(body) }),
    update: (id: number, body: { name: string; slug?: string }) =>
      request<{ ok: boolean }>(`/categories/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: number) => request<{ ok: boolean }>(`/categories/${id}`, { method: "DELETE" }),
  },

  coupons: {
    list: () => request<AdminCoupon[]>("/coupons/"),
    create: (body: { code: string; type: string; discount: number; max_uses: number }) =>
      request<AdminCoupon>("/coupons/", { method: "POST", body: JSON.stringify(body) }),
    toggle: (id: number) => request<{ active: boolean }>(`/coupons/${id}/toggle`, { method: "PATCH" }),
  },
};
