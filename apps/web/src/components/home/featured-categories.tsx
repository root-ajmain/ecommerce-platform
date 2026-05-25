"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  { name: "Men's Fashion", slug: "mens-fashion", emoji: "👔", count: 120 },
  { name: "Women's Fashion", slug: "womens-fashion", emoji: "👗", count: 180 },
  { name: "Electronics", slug: "electronics", emoji: "📱", count: 95 },
  { name: "Sports", slug: "sports-outdoors", emoji: "⚽", count: 67 },
  { name: "Home & Living", slug: "home-living", emoji: "🏠", count: 84 },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturedCategories() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Shop by Category</h2>
          <p className="mt-1 text-muted-foreground">Explore our curated collections</p>
        </div>
        <Link href="/category/all" className="hidden items-center gap-1 text-sm text-primary transition hover:gap-2 sm:flex">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
      >
        {CATEGORIES.map((cat) => (
          <motion.div key={cat.slug} variants={itemVariants}>
            <Link
              href={`/category/${cat.slug}`}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg"
            >
              <span className="text-4xl">{cat.emoji}</span>
              <div>
                <p className="font-semibold text-sm">{cat.name}</p>
                <p className="text-xs text-muted-foreground">{cat.count} items</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
