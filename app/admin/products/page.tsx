"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { adminApi, type AdminProduct } from "@/lib/admin-api";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.products.list(page, search);
      setProducts(data.results);
      setTotal(data.count);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id: number) {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    await adminApi.products.delete(id);
    load();
  }

  const pageSize = 20;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Qidirish…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary"
          />
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 shrink-0"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Yangi</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-2xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#2C2417] text-sm truncate">{p.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400">{p.category?.name ?? "—"}</span>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs font-medium text-primary">{formatPrice(Number(p.price))}</span>
                  <span className="text-xs text-gray-300">·</span>
                  <span className={`text-xs font-medium ${p.stock <= 5 ? "text-warning" : "text-gray-500"}`}>
                    {p.stock} dona
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Link
                  href={`/admin/products/${p.id}`}
                  className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-gray-50"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  aria-label="O'chirish"
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 px-4 py-10 text-center text-sm text-gray-400">
              Mahsulotlar yo&apos;q
            </div>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center gap-2 justify-center pt-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                page === i + 1 ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
