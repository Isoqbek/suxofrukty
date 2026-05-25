"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Search, Menu, X } from "lucide-react";

interface HeaderProps {
  cartCount?: number;
}

export default function Header({ cartCount = 0 }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        <Link
          href="/"
          className="font-[var(--font-montserrat)] font-bold text-xl text-[var(--color-primary)] shrink-0"
        >
          Сухофрукти
        </Link>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="hidden sm:flex flex-1 items-center border border-gray-300 rounded-lg overflow-hidden focus-within:border-[var(--color-primary)]"
        >
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Пошук товарів..."
            className="flex-1 px-4 py-2 text-sm outline-none bg-transparent text-[var(--color-text)] placeholder:text-[var(--color-muted)]"
          />
          <button
            type="submit"
            className="px-3 py-2 text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
            aria-label="Пошук"
          >
            <Search size={18} />
          </button>
        </form>

        <nav className="hidden sm:flex items-center gap-6 text-sm text-[var(--color-text)]">
          <Link href="/catalog" className="hover:text-[var(--color-primary)] transition-colors">
            Каталог
          </Link>
          <Link href="/catalog?sale=true" className="hover:text-[var(--color-primary)] transition-colors">
            Акції
          </Link>
        </nav>

        <Link
          href="/cart"
          className="relative ml-auto sm:ml-0 flex items-center justify-center w-11 h-11 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Кошик"
        >
          <ShoppingCart size={22} className="text-[var(--color-text)]" />
          {cartCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Link>

        <button
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
              className="flex-1 px-4 py-2 text-sm outline-none text-[var(--color-text)] placeholder:text-[var(--color-muted)]"
            />
            <button type="submit" className="px-3 py-2 text-[var(--color-muted)]" aria-label="Пошук">
              <Search size={18} />
            </button>
          </form>
          <nav className="flex flex-col gap-3 text-sm text-[var(--color-text)]">
            <Link href="/catalog" onClick={() => setMenuOpen(false)} className="py-1 hover:text-[var(--color-primary)]">
              Каталог
            </Link>
            <Link href="/catalog?sale=true" onClick={() => setMenuOpen(false)} className="py-1 hover:text-[var(--color-primary)]">
              Акції
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
