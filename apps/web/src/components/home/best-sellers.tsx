import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";

const DEMO_PRODUCTS = [
  { id: "1", name: "Premium Running Shoes", slug: "premium-running-shoes", price: 4200, compareAtPrice: 5500, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", rating: 4.8, reviewCount: 124 },
  { id: "2", name: "Classic Leather Wallet", slug: "classic-leather-wallet", price: 1800, compareAtPrice: 2400, image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80", rating: 4.6, reviewCount: 89 },
  { id: "3", name: "Wireless Earbuds Pro", slug: "wireless-earbuds-pro", price: 3500, compareAtPrice: 4200, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80", rating: 4.7, reviewCount: 203 },
  { id: "4", name: "Denim Jacket Classic", slug: "denim-jacket-classic", price: 3200, compareAtPrice: undefined, image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&q=80", rating: 4.5, reviewCount: 67 },
];

export function BestSellers() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Best Sellers</h2>
          <p className="mt-1 text-muted-foreground">Our most loved products</p>
        </div>
        <Link href="/category/bestsellers" className="hidden items-center gap-1 text-sm text-primary transition hover:gap-2 sm:flex">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DEMO_PRODUCTS.map((p) => (
          <ProductCard key={p.id} {...p} badge="Best Seller" />
        ))}
      </div>
    </section>
  );
}
