"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { adminApi, type AdminOrder } from "@/lib/admin-api";
import { formatPrice } from "@/lib/utils";

const STATUSES = ["", "pending", "paid", "processing", "shipped", "delivered", "cancelled"];
const STATUS_LABELS: Record<string, string> = {
  "": "Barchasi", pending: "Yangi", paid: "To'langan", processing: "Jarayonda",
  shipped: "Yuborilgan", delivered: "Yetkazilgan", cancelled: "Bekor",
};
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.orders.list(page, status);
      setOrders(data.results);
      setTotal(data.count);
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => { load(); }, [load]);

  const pageSize = 20;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-montserrat font-bold text-xl text-[#2C2417]">Buyurtmalar</h1>

      <div className="flex gap-2 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => { setStatus(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              status === s ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-primary"
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 text-gray-400 text-xs">
            <tr>
              <th className="text-left px-4 py-3">ID</th>
              <th className="text-left px-4 py-3">Mijoz</th>
              <th className="text-left px-4 py-3">Yetkazish</th>
              <th className="text-right px-4 py-3">Summa</th>
              <th className="text-center px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                ))
              : orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="font-medium text-primary">#{o.id}</Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#2C2417]">{o.contact_name}</p>
                      <p className="text-xs text-gray-400">{o.contact_phone}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{o.delivery_city}, {o.delivery_branch}</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatPrice(Number(o.total_price))}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${STATUS_COLORS[o.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {STATUS_LABELS[o.status] ?? o.status}
                      </span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex gap-2 justify-center">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} type="button" onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-sm font-medium ${page === i + 1 ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
