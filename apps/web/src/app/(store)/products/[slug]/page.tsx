import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductReviews } from "@/components/product/product-reviews";
import { RelatedProducts } from "@/components/product/related-products";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { api } from "@/lib/api";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await api.products.getBySlug(slug).catch(() => null);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.metaTitle ?? product.name,
    description: product.metaDesc ?? product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription ?? "",
      images: product.images?.[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await api.products.getBySlug(slug).catch(() => null);
  if (!product) notFound();

  const breadcrumbs = [
    { label: "Home", href: "/" },
    ...(product.categories?.[0]
      ? [
          {
            label: product.categories[0].category.name,
            href: `/category/${product.categories[0].category.slug}`,
          },
        ]
      : []),
    { label: product.name, href: `/products/${slug}` },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbs} />
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images ?? []} productName={product.name} />
        <ProductInfo product={product} />
      </div>
      <ProductReviews productId={product.id} reviews={product.reviews ?? []} rating={Number(product.rating)} reviewCount={product.reviewCount} />
      <RelatedProducts productId={product.id} />
    </div>
  );
}
