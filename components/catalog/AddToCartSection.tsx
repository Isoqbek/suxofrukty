"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import type { Product, ProductVariant } from "@/types";

interface AddToCartSectionProps {
  product: Product;
}

export default function AddToCartSection({ product }: AddToCartSectionProps) {
  const { dispatch } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants[0] ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const activePrice = selectedVariant?.price ?? product.discount_price ?? product.price;
  const isOutOfStock = product.stock === 0;

  function handleAdd() {
    dispatch({ type: "ADD", product, variant: selectedVariant, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="flex flex-col gap-4">
      {product.variants.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-text">Фасування:</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVariant(v)}
                className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                  selectedVariant?.id === v.id
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 text-text hover:border-primary"
                }`}
              >
                {v.weight_grams >= 1000
                  ? `${v.weight_grams / 1000} кг`
                  : `${v.weight_grams} г`}{" "}
                — {formatPrice(v.price)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center text-muted hover:text-text hover:bg-gray-50 transition-colors"
            aria-label="Зменшити"
          >
            <Minus size={16} />
          </button>
          <span className="w-10 text-center text-sm font-semibold text-text">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="w-10 h-10 flex items-center justify-center text-muted hover:text-text hover:bg-gray-50 transition-colors"
            aria-label="Збільшити"
          >
            <Plus size={16} />
          </button>
        </div>

        <span className="text-lg font-bold text-text">
          {formatPrice(activePrice * quantity)}
        </span>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={isOutOfStock}
        className="flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ShoppingCart size={18} />
        {isOutOfStock ? "Немає в наявності" : added ? "Додано ✓" : "В кошик"}
      </button>
    </div>
  );
}
