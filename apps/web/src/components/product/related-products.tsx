import { ProductCard } from "./product-card";

const DEMO_RELATED = [
  { id: "r1", name: "Sport Sneakers Low", slug: "sport-sneakers-low", price: 3800, rating: 4.6, reviewCount: 89 },
  { id: "r2", name: "Trail Running Shoes", slug: "trail-running-shoes", price: 5200, compareAtPrice: 6500, rating: 4.7, reviewCount: 142 },
  { id: "r3", name: "Casual Canvas Shoes", slug: "casual-canvas-shoes", price: 2100, rating: 4.4, reviewCount: 67 },
  { id: "r4", name: "Athletic Socks Pack", slug: "athletic-socks-pack", price: 480, rating: 4.2, reviewCount: 234 },
];

interface RelatedProductsProps {
  productId: string;
}

export function RelatedProducts({ productId: _ }: RelatedProductsProps) {
  return (
    <section className="mt-16">
      <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DEMO_RELATED.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </section>
  );
}
