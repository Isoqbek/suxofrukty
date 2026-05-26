"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, Package, ShoppingBag, Tag, Ticket, LogOut } from "lucide-react";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Mahsulotlar", icon: Package },
  { href: "/admin/orders", label: "Buyurtmalar", icon: ShoppingBag },
  { href: "/admin/categories", label: "Kategoriyalar", icon: Tag },
  { href: "/admin/coupons", label: "Kuponlar", icon: Ticket },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === "/admin/login") return;
    const token = localStorage.getItem("admin_token");
    if (!token) router.replace("/admin/login");
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  function logout() {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-56 shrink-0 bg-[#2C2417] flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <p className="text-white font-montserrat font-bold text-base">Suxofrukty</p>
          <p className="text-white/40 text-xs mt-0.5">Admin panel</p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active ? "bg-primary text-white" : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-3 px-6 py-4 text-white/40 hover:text-white text-sm transition-colors border-t border-white/10"
        >
          <LogOut size={16} />
          Chiqish
        </button>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-6 py-6">{children}</div>
      </main>
    </div>
  );
}
