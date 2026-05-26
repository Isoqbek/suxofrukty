"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
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
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => { setStatus(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
              status === s ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/admin/orders/${o.id}`}
              className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex items-center gap-3 hover:border-primary/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-primary">#{o.id}</span>
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${STATUS_COLORS[o.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {STATUS_LABELS[o.status] ?? o.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-[#2C2417] truncate">{o.contact_name}</p>
                <p className="text-xs text-gray-400 truncate">{o.delivery_city}, {o.delivery_branch}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-[#2C2417]">{formatPrice(Number(o.total_price))}</p>
                <ChevronRight size={16} className="text-gray-300 ml-auto mt-1" />
              </div>
            </Link>
          ))}
          {orders.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 px-4 py-10 text-center text-sm text-gray-400">
              Buyurtmalar yo&apos;q
            </div>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex gap-2 justify-center pt-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} type="button" onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-xl text-sm font-medium ${page === i + 1 ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
