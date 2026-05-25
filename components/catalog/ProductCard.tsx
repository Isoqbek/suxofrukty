import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { formatPrice, discountPercent } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images.find((img) => img.is_main) ?? product.images[0];
  const hasDiscount = product.discount_price !== null && product.discount_price < product.price;

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-gray-50">
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            Фото відсутнє
          </div>
        )}

        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-[var(--color-primary)] text-white text-xs font-bold px-2 py-0.5 rounded-full">
            −{discountPercent(product.price, product.discount_price!)}%
          </span>
        )}

        {product.stock <= 10 && product.stock > 0 && (
          <span className="absolute top-2 right-2 bg-[var(--color-warning)] text-white text-xs px-2 py-0.5 rounded-full">
            Мало
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-3 gap-2">
        <Link
          href={`/product/${product.slug}`}
          className="text-sm font-medium text-[var(--color-text)] leading-snug line-clamp-2 hover:text-[var(--color-primary)] transition-colors"
        >
          {product.name}
        </Link>

        <div className="flex items-baseline gap-2 mt-auto">
          {hasDiscount ? (
            <>
              <span className="font-bold text-[var(--color-primary)]">
                {formatPrice(product.discount_price!)}
              </span>
              <span className="text-xs text-[var(--color-muted)] line-through">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="font-bold text-[var(--color-text)]">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <button
          className="mt-1 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={product.stock === 0}
        >
          <ShoppingCart size={16} />
          {product.stock === 0 ? "Немає в наявності" : "В кошик"}
        </button>
      </div>
    </article>
  );
}
