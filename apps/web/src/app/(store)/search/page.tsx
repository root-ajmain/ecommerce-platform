import type { Metadata } from "next";
import Link from "next/link";
import { SearchX } from "lucide-react";
import { api } from "@/lib/api";
import { ProductCard } from "@/components/product/product-card";
import { SearchForm } from "./search-form";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
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

interface SearchResult {
  products: ProductListing[];
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : "Search",
    description: q ? `Search results for "${q}"` : "Search our product catalog",
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim();

  let products: ProductListing[] = [];

  if (query) {
    const result = await api.search
      .query(query)
      .catch(() => null) as SearchResult | null;

    if (result && Array.isArray(result.products)) {
      products = result.products;
    } else if (Array.isArray(result)) {
      // fallback: some backends return array directly
      products = result as ProductListing[];
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Search hero */}
      <section className="border-b border-border bg-muted/30 px-4 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
            {query ? "Search Results" : "Search Products"}
          </h1>
          <p className="mb-8 text-muted-foreground">
            {query
              ? `Showing results for "${query}"`
              : "Find exactly what you're looking for"}
          </p>
          <SearchForm defaultValue={query} />
        </div>
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 py-10">
        {!query ? (
          /* No query yet — prompt the user */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted-foreground max-w-sm">
              Type something in the search box above to find products.
            </p>
            <Link
              href="/category/all"
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Browse All Products
            </Link>
          </div>
        ) : products.length === 0 ? (
          /* Query but no results */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-muted p-6 mb-6">
              <SearchX className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No results for &ldquo;{query}&rdquo;
            </h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Try different keywords, check your spelling, or browse all products.
            </p>
            <div className="flex gap-3">
              <Link
                href="/category/all"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Browse All
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Go Home
              </Link>
            </div>
          </div>
        ) : (
          /* Results grid */
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              {products.length} result{products.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
            </p>
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
          </>
        )}
      </section>
    </div>
  );
}
