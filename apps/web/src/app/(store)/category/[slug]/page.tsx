import type { Metadata } from "next";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/product/product-card";
import { Breadcrumb } from "@/components/shared/breadcrumb";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface ProductListing {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images?: { url: string }[];
  rating?: number;
  reviewCount?: number;
  badge?: string;
}

function formatCategoryName(slug: string): string {
  if (slug === "all") return "All Products";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = formatCategoryName(slug);
  return {
    title,
    description: `Browse our ${title} collection`,
  };
}

export const revalidate = 60;

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const categoryName = formatCategoryName(slug);

  const rawProducts = await api.products
    .getAll(slug === "all" ? undefined : { category: slug })
    .catch(() => []);

  const products = (Array.isArray(rawProducts) ? rawProducts : []) as ProductListing[];

  const breadcrumbs = [
    { label: "Products", href: "/category/all" },
    { label: categoryName },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbs} />

      <div className="mt-6 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {categoryName}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {products.length > 0
            ? `${products.length} product${products.length !== 1 ? "s" : ""} found`
            : "Browse our collection"}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="rounded-full bg-muted p-6 mb-6">
            <PackageSearch className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">No products found</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            We couldn&apos;t find any products in this category. Check back soon or explore our other collections.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              image={product.images?.[0]?.url}
              rating={product.rating}
              reviewCount={product.reviewCount}
              badge={product.badge}
            />
          ))}
        </div>
      )}
    </div>
  );
}
