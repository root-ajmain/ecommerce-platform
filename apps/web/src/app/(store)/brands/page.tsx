import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Our Brands",
  description: "Discover all the top brands we carry in our store",
};

const BRANDS = [
  { name: "Nike", emoji: null },
  { name: "Samsung", emoji: null },
  { name: "Apple", emoji: null },
  { name: "Adidas", emoji: null },
  { name: "Sony", emoji: null },
  { name: "LG", emoji: null },
  { name: "Puma", emoji: null },
  { name: "Zara", emoji: null },
  { name: "H&M", emoji: null },
  { name: "Reebok", emoji: null },
  { name: "Under Armour", emoji: null },
  { name: "Philips", emoji: null },
];

function getBrandHref(name: string): string {
  return `/category/${name.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and")}`;
}

function getBrandInitials(name: string): string {
  const words = name.split(/\s+/);
  if (words.length === 1) return name.slice(0, 2).toUpperCase();
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// Consistent color palette per brand index — no randomness at render
const ACCENT_COLORS = [
  "from-orange-500/20 to-red-500/20 border-orange-500/30",
  "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  "from-slate-500/20 to-zinc-500/20 border-slate-500/30",
  "from-green-500/20 to-emerald-500/20 border-green-500/30",
  "from-indigo-500/20 to-blue-500/20 border-indigo-500/30",
  "from-red-500/20 to-pink-500/20 border-red-500/30",
  "from-yellow-500/20 to-orange-500/20 border-yellow-500/30",
  "from-violet-500/20 to-purple-500/20 border-violet-500/30",
  "from-pink-500/20 to-rose-500/20 border-pink-500/30",
  "from-teal-500/20 to-cyan-500/20 border-teal-500/30",
  "from-blue-600/20 to-indigo-500/20 border-blue-600/30",
  "from-cyan-500/20 to-blue-500/20 border-cyan-500/30",
];

export default function BrandsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/60 to-background px-4 py-20 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_70%)]" />
        <div className="relative mx-auto max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Our Partners
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Top Brands,
            <br />
            <span className="text-primary">One Destination</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Shop from the world&apos;s most trusted brands — all in one place, with guaranteed authenticity.
          </p>
        </div>
      </section>

      {/* Brand Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {BRANDS.map((brand, idx) => (
            <Link
              key={brand.name}
              href={getBrandHref(brand.name)}
              className={cn(
                "group relative flex flex-col items-center justify-center rounded-2xl border bg-gradient-to-br p-6 text-center",
                "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10",
                ACCENT_COLORS[idx % ACCENT_COLORS.length]
              )}
            >
              {/* Brand initials avatar */}
              <div
                className={cn(
                  "mb-3 flex h-14 w-14 items-center justify-center rounded-full",
                  "bg-background/80 shadow-sm ring-1 ring-border/50",
                  "text-lg font-bold text-foreground",
                  "transition-transform duration-300 group-hover:scale-110"
                )}
              >
                {getBrandInitials(brand.name)}
              </div>

              <span className="text-sm font-semibold text-foreground">
                {brand.name}
              </span>

              <span className="mt-1 text-xs text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                Shop now
              </span>

              {/* Subtle shine on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-border bg-muted/30 py-16 text-center">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="text-2xl font-bold text-foreground">
            Can&apos;t find your brand?
          </h2>
          <p className="mt-2 text-muted-foreground">
            We&apos;re constantly adding new brands. Browse all products or reach out to us.
          </p>
          <Link
            href="/category/all"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Browse All Products
          </Link>
        </div>
      </section>
    </div>
  );
}
