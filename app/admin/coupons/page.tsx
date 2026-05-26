"use client";

import { useEffect, useState } from "react";
import { adminApi, type AdminCoupon } from "@/lib/admin-api";

const TYPE_LABELS: Record<string, string> = {
  percent: "Foiz (%)",
  fixed: "Belgilangan (₴)",
  free_delivery: "Bepul yetkazish",
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [form, setForm] = useState({ code: "", type: "percent", discount: 0, max_uses: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.coupons.list().then(setCoupons);
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.coupons.create(form);
      setForm({ code: "", type: "percent", discount: 0, max_uses: 0 });
      adminApi.coupons.list().then(setCoupons);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(id: number) {
    await adminApi.coupons.toggle(id);
    adminApi.coupons.list().then(setCoupons);
  }

  const inputCls = "px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary transition-colors";

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h1 className="font-montserrat font-bold text-xl text-[#2C2417]">Kuponlar</h1>

      <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
        <p className="text-sm font-semibold text-[#2C2417]">Yangi kupon</p>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-xs font-medium text-gray-500">
            Kod *
            <input
              required
              value={form.code}
              onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
              placeholder="SUMMER20"
              className={inputCls}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-gray-500">
            Turi *
            <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value })} className={inputCls}>
              {Object.entries(TYPE_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-gray-500">
            Chegirma miqdori
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.discount}
              onChange={(e) => setForm((p) => ({ ...p, discount: Number(e.target.value) }))}
              className={inputCls}
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-gray-500">
            Maksimal foydalanish (0 = cheksiz)
            <input
              type="number"
              min="0"
              value={form.max_uses}
              onChange={(e) => setForm((p) => ({ ...p, max_uses: Number(e.target.value) }))}
              className={inputCls}
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="self-start px-5 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saqlanmoqda…" : "Yaratish"}
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 text-gray-400 text-xs">
            <tr>
              <th className="text-left px-4 py-3">Kod</th>
              <th className="text-left px-4 py-3">Turi</th>
              <th className="text-right px-4 py-3">Chegirma</th>
              <th className="text-right px-4 py-3">Ishlatilgan</th>
              <th className="text-center px-4 py-3">Holat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {coupons.map((c) => (
              <tr key={c.ID} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono font-bold text-[#2C2417]">{c.code}</td>
                <td className="px-4 py-3 text-gray-500">{TYPE_LABELS[c.type] ?? c.type}</td>
                <td className="px-4 py-3 text-right">{c.type === "free_delivery" ? "—" : c.discount}</td>
                <td className="px-4 py-3 text-right text-gray-500">
                  {c.used_count}/{c.max_uses === 0 ? "∞" : c.max_uses}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleToggle(c.ID)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      c.active ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {c.active ? "Faol" : "Bloklangan"}
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-400">Kuponlar yo&apos;q</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
