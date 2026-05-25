"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function Header() {
  const { totalCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        <Link
          href="/"
          className="font-montserrat font-bold text-xl text-primary shrink-0"
        >
          Сухофрукти
        </Link>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="hidden sm:flex flex-1 items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-primary"
        >
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Пошук товарів..."
            className="flex-1 px-4 py-2 text-sm outline-none bg-transparent text-text placeholder:text-muted"
          />
          <button
            type="submit"
            className="px-3 py-2 text-muted hover:text-primary transition-colors"
            aria-label="Пошук"
          >
            <Search size={18} />
          </button>
        </form>

        <nav className="hidden sm:flex items-center gap-6 text-sm text-text">
          <Link href="/catalog" className="hover:text-primary transition-colors">
            Каталог
          </Link>
          <Link href="/catalog?sale=true" className="hover:text-primary transition-colors">
            Акції
          </Link>
        </nav>

        <Link
          href="/cart"
          className="relative ml-auto sm:ml-0 flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Кошик"
        >
          <ShoppingCart size={22} className="text-text" />
          {totalCount > 0 && (
            <span className="absolute top-1 right-1 min-w-4.5 h-4.5 px-1 flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold">
              {totalCount > 99 ? "99+" : totalCount}
            </span>
          )}
        </Link>

        <button
          type="button"
          className="sm:hidden flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Меню"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4">
          <form onSubmit={(e) => e.preventDefault()} className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Пошук товарів..."
              className="flex-1 px-4 py-2 text-sm outline-none text-text placeholder:text-muted"
            />
            <button type="submit" className="px-3 py-2 text-muted" aria-label="Пошук">
              <Search size={18} />
            </button>
          </form>
          <nav className="flex flex-col gap-3 text-sm text-text">
            <Link href="/catalog" onClick={() => setMenuOpen(false)} className="py-1 hover:text-primary">
              Каталог
            </Link>
            <Link href="/catalog?sale=true" onClick={() => setMenuOpen(false)} className="py-1 hover:text-primary">
              Акції
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
