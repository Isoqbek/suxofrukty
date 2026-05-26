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
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-montserrat font-bold text-xl text-[#2C2417]">Mahsulotlar</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Yangi mahsulot
        </Link>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Nom bo'yicha qidirish…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 text-gray-400 text-xs">
            <tr>
              <th className="text-left px-4 py-3">Mahsulot</th>
              <th className="text-left px-4 py-3">Kategoriya</th>
              <th className="text-right px-4 py-3">Narx</th>
              <th className="text-right px-4 py-3">Stock</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                    </td>
                  </tr>
                ))
              : products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-[#2C2417]">{p.name}</td>
                    <td className="px-4 py-3 text-gray-500">{p.category?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-right">{formatPrice(Number(p.price))}</td>
                    <td className={`px-4 py-3 text-right font-medium ${p.stock <= 5 ? "text-warning" : "text-gray-700"}`}>
                      {p.stock}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link href={`/admin/products/${p.id}`} className="p-1.5 text-gray-400 hover:text-primary transition-colors">
                          <Pencil size={15} />
                        </Link>
                        <button type="button" onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center gap-2 justify-center">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                page === i + 1 ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-primary"
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
