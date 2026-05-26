"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

type Step = 1 | 2 | 3;

interface ContactForm {
  name: string;
  phone: string;
  email: string;
}

interface DeliveryForm {
  city: string;
  branch: string;
}

const INITIAL_CONTACT: ContactForm = { name: "", phone: "", email: "" };
const INITIAL_DELIVERY: DeliveryForm = { city: "", branch: "" };

function StepIndicator({ current }: { current: Step }) {
  const steps = ["Контакти", "Доставка", "Оплата"];
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((label, i) => {
        const num = (i + 1) as Step;
        const done = num < current;
        const active = num === current;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-colors ${
              done ? "bg-success text-white" : active ? "bg-primary text-white" : "bg-gray-100 text-muted"
            }`}>
              {done ? "✓" : num}
            </div>
            <span className={`text-sm ${active ? "font-semibold text-text" : "text-muted"}`}>
              {label}
            </span>
            {i < steps.length - 1 && <div className="w-8 h-px bg-gray-200" />}
          </div>
        );
      })}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, dispatch } = useCart();
  const [step, setStep] = useState<Step>(1);
  const [contact, setContact] = useState<ContactForm>(INITIAL_CONTACT);
  const [delivery, setDelivery] = useState<DeliveryForm>(INITIAL_DELIVERY);
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    router.replace("/cart");
    return null;
  }

  function updateContact(field: keyof ContactForm, value: string) {
    setContact((prev) => ({ ...prev, [field]: value }));
  }

  function updateDelivery(field: keyof DeliveryForm, value: string) {
    setDelivery((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      await api.orders.create({
        contact: { name: contact.name, phone: contact.phone, email: contact.email },
        delivery: { city: delivery.city, branch: delivery.branch },
        items: items.map((i) => ({
          product_id: i.product.id,
          variant_id: i.variant?.id ?? null,
          quantity: i.quantity,
        })),
      });
      dispatch({ type: "CLEAR" });
      router.push("/order-success");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="font-montserrat font-bold text-2xl text-text mb-6">
        Оформлення замовлення
      </h1>

      <StepIndicator current={step} />

      {step === 1 && (
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-text">Ваші контакти</h2>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-muted">Ім&apos;я та прізвище</span>
            <input
              type="text"
              value={contact.name}
              onChange={(e) => updateContact("name", e.target.value)}
              placeholder="Іван Іваненко"
              className="px-4 py-3 rounded-xl border border-gray-300 text-sm text-text outline-none focus:border-primary transition-colors"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-muted">Телефон</span>
            <input
              type="tel"
              value={contact.phone}
              onChange={(e) => updateContact("phone", e.target.value)}
              placeholder="+38 (067) 000-00-00"
              className="px-4 py-3 rounded-xl border border-gray-300 text-sm text-text outline-none focus:border-primary transition-colors"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-muted">Email</span>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => updateContact("email", e.target.value)}
              placeholder="ivan@example.com"
              className="px-4 py-3 rounded-xl border border-gray-300 text-sm text-text outline-none focus:border-primary transition-colors"
            />
          </label>

          <button
            type="button"
            disabled={!contact.name || !contact.phone || !contact.email}
            onClick={() => setStep(2)}
            className="mt-2 py-3 rounded-2xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Далі — Доставка
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-text">Доставка Nova Poshta</h2>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-muted">Місто</span>
            <input
              type="text"
              value={delivery.city}
              onChange={(e) => updateDelivery("city", e.target.value)}
              placeholder="Київ"
              className="px-4 py-3 rounded-xl border border-gray-300 text-sm text-text outline-none focus:border-primary transition-colors"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-muted">Відділення або поштомат</span>
            <input
              type="text"
              value={delivery.branch}
              onChange={(e) => updateDelivery("branch", e.target.value)}
              placeholder="Відділення №1"
              className="px-4 py-3 rounded-xl border border-gray-300 text-sm text-text outline-none focus:border-primary transition-colors"
            />
          </label>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-2xl border border-gray-300 text-text font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Назад
            </button>
            <button
              type="button"
              disabled={!delivery.city || !delivery.branch}
              onClick={() => setStep(3)}
              className="flex-1 py-3 rounded-2xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Далі — Оплата
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-text">Підтвердження та оплата</h2>

          <div className="bg-bg rounded-xl border border-gray-200 p-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-muted">
              <span>Отримувач</span>
              <span className="text-text font-medium">{contact.name}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Телефон</span>
              <span className="text-text">{contact.phone}</span>
            </div>
            <div className="flex justify-between text-muted">
              <span>Доставка</span>
              <span className="text-text">{delivery.city}, {delivery.branch}</span>
            </div>
            <div className="flex justify-between font-bold text-text border-t border-gray-200 pt-2 mt-1">
              <span>До сплати</span>
              <span className="text-primary">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-text">Спосіб оплати:</p>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-primary bg-primary/5">
              <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <span className="text-sm font-medium text-text">LiqPay (картка, Google Pay)</span>
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 py-3 rounded-2xl border border-gray-300 text-text font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Назад
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3 rounded-2xl bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? "Обробка…" : "Оплатити"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
