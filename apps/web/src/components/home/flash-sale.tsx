"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product/product-card";
import { Zap } from "lucide-react";

const SALE_PRODUCTS = [
  { id: "s1", name: "Smart Watch Series 5", slug: "smart-watch-series-5", price: 8500, compareAtPrice: 15000, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", rating: 4.9, reviewCount: 312 },
  { id: "s2", name: "Canvas Backpack", slug: "canvas-backpack", price: 2200, compareAtPrice: 3500, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", rating: 4.4, reviewCount: 156 },
  { id: "s3", name: "Sunglasses UV400", slug: "sunglasses-uv400", price: 1200, compareAtPrice: 2000, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80", rating: 4.3, reviewCount: 89 },
  { id: "s4", name: "Fitness Tracker Band", slug: "fitness-tracker-band", price: 1800, compareAtPrice: 2800, image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&q=80", rating: 4.6, reviewCount: 234 },
];

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const update = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ h: 0, m: 0, s: 0 }); return; }
      setTimeLeft({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

export function FlashSale() {
  const [endTime, setEndTime] = useState<Date | null>(null);
  useEffect(() => { setEndTime(new Date(Date.now() + 6 * 3600000)); }, []);
  const { h, m, s } = useCountdown(endTime ?? new Date(0));

  return (
    <section className="bg-gradient-to-r from-rose-500/10 via-orange-500/5 to-amber-500/10 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Flash Sale</h2>
              <p className="text-muted-foreground text-sm">Limited time offers</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-center">
            {[
              { label: "Hours", value: h },
              { label: "Mins", value: m },
              { label: "Secs", value: s },
            ].map(({ label, value }, i) => (
              <span key={i} className="flex flex-col">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-card border border-border font-bold text-xl">
                  {String(value).padStart(2, "0")}
                </span>
                <span className="text-[10px] text-muted-foreground mt-1">{label}</span>
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SALE_PRODUCTS.map((p) => (
            <ProductCard key={p.id} {...p} badge="SALE" />
          ))}
        </div>
      </div>
    </section>
  );
}
