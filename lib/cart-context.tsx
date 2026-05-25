"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
} from "react";
import type { CartItem, Product, ProductVariant } from "@/types";

type CartAction =
  | { type: "ADD"; product: Product; variant: ProductVariant | null; quantity: number }
  | { type: "REMOVE"; productId: number; variantId: number | null }
  | { type: "UPDATE_QTY"; productId: number; variantId: number | null; quantity: number }
  | { type: "CLEAR" };

interface CartState {
  items: CartItem[];
}

function cartKey(productId: number, variantId: number | null) {
  return `${productId}_${variantId ?? "base"}`;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const key = cartKey(action.product.id, action.variant?.id ?? null);
      const exists = state.items.find(
        (i) => cartKey(i.product.id, i.variant?.id ?? null) === key
      );
      if (exists) {
        return {
          items: state.items.map((i) =>
            cartKey(i.product.id, i.variant?.id ?? null) === key
              ? { ...i, quantity: i.quantity + action.quantity }
              : i
          ),
        };
      }
      return {
        items: [...state.items, { product: action.product, variant: action.variant, quantity: action.quantity }],
      };
    }
    case "REMOVE":
      return {
        items: state.items.filter(
          (i) => cartKey(i.product.id, i.variant?.id ?? null) !== cartKey(action.productId, action.variantId)
        ),
      };
    case "UPDATE_QTY":
      return {
        items: state.items.map((i) =>
          cartKey(i.product.id, i.variant?.id ?? null) === cartKey(action.productId, action.variantId)
            ? { ...i, quantity: Math.max(1, action.quantity) }
            : i
        ),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

const STORAGE_KEY = "cart_v1";

function loadFromStorage(): CartState {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch {
    return { items: [] };
  }
}

interface CartContextValue {
  items: CartItem[];
  dispatch: Dispatch<CartAction>;
  totalCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const totalCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => {
    const price = i.variant?.price ?? i.product.discount_price ?? i.product.price;
    return sum + price * i.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ items: state.items, dispatch, totalCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
