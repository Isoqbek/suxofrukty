"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { adminApi, type AdminOrder } from "@/lib/admin-api";
import { formatPrice } from "@/lib/utils";

const STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];
const STATUS_LABELS: Record<string, string> = {
  pending: "Yangi", paid: "To'langan", processing: "Jarayonda",
  shipped: "Yuborilgan", delivered: "Yetkazilgan", cancelled: "Bekor",
};

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.orders.get(Number(id)).then((o) => {
      setOrder(o);
      setStatus(o.status);
    });
  }, [id]);

  async function handleStatusSave() {
    setSaving(true);
    await adminApi.orders.updateStatus(Number(id), status);
    setSaving(false);
    router.refresh();
  }

  if (!order) return <div className="animate-pulse h-8 bg-gray-100 rounded w-48" />;

  return (
    <div className="flex flex-col gap-5 max-w-xl">
      <h1 className="font-montserrat font-bold text-xl text-[#2C2417]">Buyurtma #{order.id}</h1>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 text-sm">
        <Row label="Mijoz" value={order.contact_name} />
        <Row label="Telefon" value={order.contact_phone} />
        <Row label="Email" value={order.contact_email} />
        <Row label="Shahar" value={order.delivery_city} />
        <Row label="Filial" value={order.delivery_branch} />
        <Row label="Jami" value={formatPrice(Number(order.total_price))} bold />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-2">
        <p className="text-xs font-medium text-gray-400 mb-1">Mahsulotlar</p>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-gray-600">#{item.product_id} × {item.quantity}</span>
            <span className="font-medium">{formatPrice(Number(item.unit_price) * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
        <p className="text-xs font-medium text-gray-400">Status o&apos;zgartirish</p>
        <div className="flex gap-2">
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary">
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          <button type="button" onClick={handleStatusSave} disabled={saving}
            className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50">
            {saving ? "…" : "Saqlash"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{label}</span>
      <span className={bold ? "font-bold text-primary" : "font-medium text-[#2C2417]"}>{value}</span>
    </div>
  );
}
