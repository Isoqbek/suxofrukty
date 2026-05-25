import Link from "next/link";

export default function HomePage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
      <h1 className="font-[var(--font-montserrat)] font-bold text-4xl text-[var(--color-text)]">
        Свіжі сухофрукти та горіхи
      </h1>
      <p className="text-[var(--color-muted)] text-lg max-w-md">
        Доставка по всій Україні. Гарантія свіжості.
      </p>
      <Link
        href="/catalog"
        className="mt-4 px-8 py-3 rounded-full bg-[var(--color-primary)] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        Перейти до каталогу
      </Link>
    </section>
  );
}
