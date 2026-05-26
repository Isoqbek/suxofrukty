"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { adminApi, type AdminProduct } from "@/lib/admin-api";
import ProductForm from "../ProductForm";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<AdminProduct | null>(null);

  useEffect(() => {
    adminApi.products.list(1, "").then((data) => {
      const found = data.results.find((p) => p.id === Number(id));
      if (found) setProduct(found);
    });
  }, [id]);

  if (!product) return <div className="animate-pulse h-8 bg-gray-100 rounded w-48" />;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-montserrat font-bold text-xl text-[#2C2417]">Mahsulotni tahrirlash</h1>
      <ProductForm product={product} />
    </div>
  );
}
