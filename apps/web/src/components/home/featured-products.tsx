import { ProductCard } from "@/components/product/product-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const PRODUCTS = [
  { id: "f1", name: "Cotton Polo Shirt", slug: "cotton-polo-shirt", price: 1400, compareAtPrice: undefined, image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&q=80", rating: 4.5, reviewCount: 78 },
  { id: "f2", name: "Leather Belt", slug: "leather-belt", price: 950, compareAtPrice: 1200, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", rating: 4.2, reviewCount: 45 },
  { id: "f3", name: "Sport Headband", slug: "sport-headband", price: 450, compareAtPrice: undefined, image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&q=80", rating: 4.0, reviewCount: 32 },
  { id: "f4", name: "Yoga Mat Premium", slug: "yoga-mat-premium", price: 2800, compareAtPrice: 3500, image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&q=80", rating: 4.7, reviewCount: 167 },
  { id: "f5", name: "Ceramic Mug", slug: "ceramic-mug", price: 380, compareAtPrice: undefined, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80", rating: 4.4, reviewCount: 92 },
  { id: "f6", name: "Scented Candle Set", slug: "scented-candle-set", price: 1200, compareAtPrice: 1600, image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400&q=80", rating: 4.6, reviewCount: 118 },
  { id: "f7", name: "Minimalist Watch", slug: "minimalist-watch", price: 5500, compareAtPrice: 7000, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80", rating: 4.8, reviewCount: 201 },
  { id: "f8", name: "Sneaker Care Kit", slug: "sneaker-care-kit", price: 680, compareAtPrice: undefined, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", rating: 4.3, reviewCount: 56 },
];

export function FeaturedProducts() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <p className="mt-1 text-muted-foreground">Handpicked just for you</p>
        </div>
        <Link href="/category/all" className="hidden items-center gap-1 text-sm text-primary transition hover:gap-2 sm:flex">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </section>
  );
}
