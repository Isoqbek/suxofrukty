"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Package, TrendingUp, AlertTriangle } from "lucide-react";
import { adminApi, type AdminStats } from "@/lib/admin-api";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    adminApi.stats().then(setStats).catch(() => null);
  }, []);

  const cards = stats
    ? [
        { label: "Bugungi buyurtmalar", value: stats.orders_today, icon: ShoppingBag, color: "text-blue-500" },
        { label: "Umumiy daromad", value: formatPrice(stats.revenue_total), icon: TrendingUp, color: "text-green-500" },
        { label: "Mahsulotlar soni", value: stats.products_count, icon: Package, color: "text-primary" },
        { label: "Kam qolgan", value: stats.low_stock, icon: AlertTriangle, color: "text-warning" },
      ]
    : [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-montserrat font-bold text-xl text-[#2C2417]">Dashboard</h1>

      {!stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col gap-3">
              <Icon size={20} className={color} />
              <div>
                <p className="text-xl font-bold text-[#2C2417]">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
