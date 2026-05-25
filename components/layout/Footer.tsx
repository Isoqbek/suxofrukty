import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-text)] text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <p className="font-[var(--font-montserrat)] font-bold text-white text-lg mb-2">
            Сухофрукти
          </p>
          <p className="text-sm leading-relaxed text-gray-400">
            Свіжі горіхи та сухофрукти з доставкою по всій Україні.
          </p>
        </div>

        <div>
          <p className="text-white font-semibold mb-3 text-sm">Покупцям</p>
          <nav className="flex flex-col gap-2 text-sm">
            <Link href="/catalog" className="hover:text-white transition-colors">Каталог</Link>
            <Link href="/delivery" className="hover:text-white transition-colors">Доставка та оплата</Link>
            <Link href="/returns" className="hover:text-white transition-colors">Повернення</Link>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
          </nav>
        </div>

        <div>
          <p className="text-white font-semibold mb-3 text-sm">Контакти</p>
          <div className="flex flex-col gap-2 text-sm">
            <a href="tel:+380000000000" className="hover:text-white transition-colors">
              +38 (000) 000-00-00
            </a>
            <a href="mailto:info@suxofrukty.ua" className="hover:text-white transition-colors">
              info@suxofrukty.ua
            </a>
            <p className="text-gray-400 text-xs mt-1">Пн–Пт: 9:00–18:00</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 px-4 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Сухофрукти. Усі права захищені.
      </div>
    </footer>
  );
}
