import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center">
      <CheckCircle size={56} className="text-success" />
      <div>
        <h1 className="font-montserrat font-bold text-2xl text-text">
          Замовлення прийнято!
        </h1>
        <p className="text-muted text-sm mt-2">
          Ми надіслали підтвердження на вашу електронну пошту.
        </p>
      </div>
      <Link
        href="/catalog"
        className="px-8 py-3 rounded-full bg-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        Продовжити покупки
      </Link>
    </div>
  );
}
