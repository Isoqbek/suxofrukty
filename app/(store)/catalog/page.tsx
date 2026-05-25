import { Suspense } from "react";
import ProductCard from "@/components/catalog/ProductCard";
import ProductCardSkeleton from "@/components/catalog/ProductCardSkeleton";
import type { Product } from "@/types";

async function getProducts(): Promise<Product[]> {
  // TODO: replace with real API call
  return [];
}

function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-24 text-[var(--color-muted)]">
        <p className="text-lg font-medium">Товари не знайдено</p>
        <p className="text-sm mt-1">Спробуйте змінити фільтри</p>
      </div>
    );
  }

  return (
    <>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  );
}

function SkeletonGrid() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </>
  );
}

export default async function CatalogPage() {
  const products = await getProducts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-[var(--font-montserrat)] font-bold text-2xl text-[var(--color-text)]">
          Каталог
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          {products.length} товарів
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <Suspense fallback={<SkeletonGrid />}>
          <ProductGrid products={products} />
        </Suspense>
      </div>
    </div>
  );
}
