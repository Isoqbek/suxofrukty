import { notFound } from "next/navigation";
import ProductGallery from "@/components/catalog/ProductGallery";
import AddToCartSection from "@/components/catalog/AddToCartSection";
import { formatPrice, discountPercent } from "@/lib/utils";
import { api } from "@/lib/api";
import type { Product } from "@/types";

async function getProduct(slug: string): Promise<Product | null> {
  try {
    return await api.products.get(slug);
  } catch {
    return null;
  }
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const hasDiscount =
    product.discount_price !== null && product.discount_price < product.price;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
      <ProductGallery images={product.images} productName={product.name} />

      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs text-muted mb-1">SKU: {product.sku}</p>
          <h1 className="font-montserrat font-bold text-2xl text-text leading-snug">
            {product.name}
          </h1>
        </div>

        <div className="flex items-baseline gap-3">
          {hasDiscount ? (
            <>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.discount_price!)}
              </span>
              <span className="text-base text-muted line-through">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm font-semibold text-white bg-primary px-2 py-0.5 rounded-full">
                −{discountPercent(product.price, product.discount_price!)}%
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold text-text">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {product.stock === 0 ? (
          <p className="text-sm font-medium text-red-500">Немає в наявності</p>
        ) : product.stock <= 10 ? (
          <p className="text-sm font-medium text-warning">
            Мало залишилось: {product.stock} шт.
          </p>
        ) : (
          <p className="text-sm font-medium text-success">В наявності</p>
        )}

        <AddToCartSection product={product} />

        {product.description && (
          <div className="mt-2 pt-4 border-t border-gray-100">
            <p className="text-sm text-muted leading-relaxed">{product.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
