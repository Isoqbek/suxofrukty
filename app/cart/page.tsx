"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";

const FREE_DELIVERY_THRESHOLD = 1500;

export default function CartPage() {
  const { items, dispatch, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <ShoppingBag size={48} className="text-muted" />
        <p className="text-xl font-semibold text-text">Кошик порожній</p>
        <p className="text-muted text-sm">Додайте товари з каталогу</p>
        <Link
          href="/catalog"
          className="mt-2 px-8 py-3 rounded-full bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Перейти до каталогу
        </Link>
      </div>
    );
  }

  const remaining = FREE_DELIVERY_THRESHOLD - totalPrice;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 flex flex-col gap-4">
        <h1 className="font-montserrat font-bold text-2xl text-text">
          Кошик
        </h1>

        {remaining > 0 && (
          <div className="bg-bg border border-gray-200 rounded-xl px-4 py-3">
            <p className="text-sm text-muted">
              До безкоштовної доставки залишилось{" "}
              <span className="font-semibold text-text">{formatPrice(remaining)}</span>
            </p>
            <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.min((totalPrice / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        <ul className="flex flex-col gap-3">
          {items.map((item) => {
            const image = item.product.images.find((i) => i.is_main) ?? item.product.images[0];
            const price = item.variant?.price ?? item.product.discount_price ?? item.product.price;
            const productId = item.product.id;
            const variantId = item.variant?.id ?? null;

            return (
              <li
                key={`${productId}_${variantId}`}
                className="flex gap-4 bg-white rounded-2xl p-4 border border-gray-100"
              >
                <Link href={`/product/${item.product.slug}`} className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-50">
                  {image && (
                    <Image
                      src={image.url}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  )}
                </Link>

                <div className="flex flex-col flex-1 gap-1 min-w-0">
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="text-sm font-medium text-text line-clamp-2 hover:text-primary transition-colors"
                  >
                    {item.product.name}
                  </Link>
                  {item.variant && (
                    <p className="text-xs text-muted">
                      {item.variant.weight_grams >= 1000
                        ? `${item.variant.weight_grams / 1000} кг`
                        : `${item.variant.weight_grams} г`}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => dispatch({ type: "UPDATE_QTY", productId, variantId, quantity: item.quantity - 1 })}
                        className="w-8 h-8 flex items-center justify-center text-muted hover:text-text hover:bg-gray-50 transition-colors"
                        aria-label="Зменшити"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-text">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => dispatch({ type: "UPDATE_QTY", productId, variantId, quantity: item.quantity + 1 })}
                        className="w-8 h-8 flex items-center justify-center text-muted hover:text-text hover:bg-gray-50 transition-colors"
                        aria-label="Збільшити"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <span className="font-bold text-text text-sm">
                      {formatPrice(price * item.quantity)}
                    </span>

                    <button
                      type="button"
                      onClick={() => dispatch({ type: "REMOVE", productId, variantId })}
                      className="p-2 text-muted hover:text-red-500 transition-colors"
                      aria-label="Видалити"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
          <h2 className="font-montserrat font-bold text-lg text-text">Підсумок</h2>

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-muted">
              <span>Товари</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Доставка</span>
              <span>{totalPrice >= FREE_DELIVERY_THRESHOLD ? "Безкоштовно" : "За тарифом НП"}</span>
            </div>
            <div className="flex justify-between font-bold text-text border-t border-gray-100 pt-2 mt-1">
              <span>Разом</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-3 rounded-2xl bg-primary text-white text-center font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Оформити замовлення
          </Link>

          <Link
            href="/catalog"
            className="text-center text-sm text-muted hover:text-primary transition-colors"
          >
            Продовжити покупки
          </Link>
        </div>
      </div>
    </div>
  );
}
