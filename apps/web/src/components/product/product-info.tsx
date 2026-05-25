"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Truck, Shield, RefreshCw, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { formatPrice, formatDiscount, cn } from "@/lib/utils";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    shortDescription?: string | null;
    price: number | string;
    compareAtPrice?: number | string | null;
    rating: number;
    reviewCount: number;
    variants?: Array<{ id: string; sku: string; price: number }>;
    inventory?: { quantity: number } | null;
    images?: Array<{ url: string }>;
  };
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  const addItem = useCartStore((s) => s.addItem);

  const price = Number(product.price);
  const compareAtPrice = product.compareAtPrice ? Number(product.compareAtPrice) : undefined;
  const discount = compareAtPrice ? formatDiscount(compareAtPrice, price) : 0;
  const inStock = !product.inventory || product.inventory.quantity > 0;

  const handleAddToCart = () => {
    addItem({
      id: uuidv4(),
      productId: product.id,
      variantId: selectedVariantId ?? undefined,
      name: product.name,
      slug: product.slug,
      image: product.images?.[0]?.url,
      price,
      quantity,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">{product.name}</h1>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
                )}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.rating} ({product.reviewCount} reviews)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold">{formatPrice(price)}</span>
        {compareAtPrice && (
          <>
            <span className="text-lg text-muted-foreground line-through">{formatPrice(compareAtPrice)}</span>
            <span className="rounded-full bg-rose-500/10 px-2.5 py-0.5 text-sm font-semibold text-rose-500">
              -{discount}%
            </span>
          </>
        )}
      </div>

      {product.shortDescription && (
        <p className="text-muted-foreground leading-relaxed">{product.shortDescription}</p>
      )}

      <div className="flex items-center gap-2">
        <span className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
          inStock ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"
        )}>
          <span className={cn("h-2 w-2 rounded-full", inStock ? "bg-green-500" : "bg-red-500")} />
          {inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-full border border-border">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-accent"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-accent"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <motion.button
          onClick={handleAddToCart}
          disabled={!inStock}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </motion.button>

      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-border p-4 sm:grid-cols-3">
        {[
          { icon: Truck, title: "Free Delivery", desc: "Orders above ৳1000" },
          { icon: Shield, title: "Secure Checkout", desc: "100% protected" },
          { icon: RefreshCw, title: "Easy Returns", desc: "7 day policy" },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-primary shrink-0" />
            <div>
              <p className="text-xs font-semibold">{title}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
