"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { adminApi, type AdminProduct, type AdminCategory } from "@/lib/admin-api";
import ImageUploader from "@/components/admin/ImageUploader";

interface Variant { id?: number; weight_grams: number; price: number; stock: number }
interface Image { url: string; is_main: boolean }

interface Props { product?: AdminProduct }

export default function ProductForm({ product }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [discountPrice, setDiscountPrice] = useState(product?.discount_price ?? "");
  const [stock, setStock] = useState(product?.stock ?? 0);
  const [categoryId, setCategoryId] = useState(product?.category?.id ?? 0);
  const [variants, setVariants] = useState<Variant[]>(
    product?.variants.map((v) => ({ id: v.id, weight_grams: v.weight_grams, price: Number(v.price), stock: v.stock })) ?? []
  );
  const [images, setImages] = useState<Image[]>(
    product?.images.map((i) => ({ url: i.url, is_main: i.is_main })) ?? []
  );

  useEffect(() => {
    adminApi.categories.list().then(setCategories);
  }, []);

  function addVariant() {
    setVariants((prev) => [...prev, { weight_grams: 100, price: 0, stock: 0 }]);
  }

  function removeVariant(i: number) {
    setVariants((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateVariant(i: number, field: keyof Variant, value: number) {
    setVariants((prev) => prev.map((v, idx) => idx === i ? { ...v, [field]: value } : v));
  }


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const body = {
      name, slug, description,
      price: Number(price),
      discount_price: discountPrice ? Number(discountPrice) : null,
      stock,
      category_id: categoryId,
      variants,
      images,
    };
    try {
      if (product) {
        await adminApi.products.update(product.id, body);
      } else {
        await adminApi.products.create(body);
      }
      router.push("/admin/products");
    } catch {
      setError("Saqlashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-primary transition-colors w-full";
  const labelCls = "flex flex-col gap-1 text-xs font-medium text-gray-500";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <label className={labelCls}>
          Nom *
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        </label>
        <label className={labelCls}>
          Slug
          <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="avtomatik" className={inputCls} />
        </label>
      </div>

      <label className={labelCls}>
        Tavsif
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={`${inputCls} resize-none`} />
      </label>

      <div className="grid grid-cols-3 gap-4">
        <label className={labelCls}>
          Narx (₴) *
          <input required type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className={inputCls} />
        </label>
        <label className={labelCls}>
          Chegirma narxi (₴)
          <input type="number" min="0" step="0.01" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} className={inputCls} />
        </label>
        <label className={labelCls}>
          Stock *
          <input required type="number" min="0" value={stock} onChange={(e) => setStock(Number(e.target.value))} className={inputCls} />
        </label>
      </div>

      <label className={labelCls}>
        Kategoriya *
        <select required value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} className={inputCls}>
          <option value={0}>Tanlang…</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </label>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">Variantlar (gramm/narx)</span>
          <button type="button" onClick={addVariant} className="flex items-center gap-1 text-xs text-primary font-medium">
            <Plus size={14} /> Qo&apos;shish
          </button>
        </div>
        {variants.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <input type="number" min="1" value={v.weight_grams} onChange={(e) => updateVariant(i, "weight_grams", Number(e.target.value))} placeholder="gramm" className={`${inputCls} w-28`} />
            <input type="number" min="0" step="0.01" value={v.price} onChange={(e) => updateVariant(i, "price", Number(e.target.value))} placeholder="narx" className={`${inputCls} w-28`} />
            <input type="number" min="0" value={v.stock} onChange={(e) => updateVariant(i, "stock", Number(e.target.value))} placeholder="stock" className={`${inputCls} w-20`} />
            <button type="button" onClick={() => removeVariant(i)} aria-label="Variantni o'chirish" className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-gray-500">Rasmlar</span>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
          {loading ? "Saqlanmoqda…" : "Saqlash"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
          Bekor qilish
        </button>
      </div>
    </form>
  );
}
