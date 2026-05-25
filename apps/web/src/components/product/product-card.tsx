"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { cn, formatPrice, formatDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
// uuid is used for cart item IDs

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  className?: string;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  compareAtPrice,
  image,
  rating = 0,
  reviewCount = 0,
  badge,
  className,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(id);

  const discount = compareAtPrice ? formatDiscount(compareAtPrice, price) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id: uuidv4(), productId: id, name, slug, image, price, quantity: 1 });
    toast.success(`${name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(id);
    toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <motion.div
      className={cn("group relative flex flex-col rounded-xl overflow-hidden bg-card border border-border", className)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link href={`/products/${slug}`} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
          </div>
        )}

        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
            {badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-destructive px-2.5 py-0.5 text-xs font-semibold text-destructive-foreground">
            -{discount}%
          </span>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/20 flex items-center justify-center gap-3"
        >
          <button
            onClick={handleAddToCart}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:scale-110"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
          <Link
            href={`/products/${slug}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:scale-110"
            aria-label="Quick view"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <button
            onClick={handleWishlist}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition hover:scale-110",
              inWishlist ? "bg-rose-500 text-white" : "bg-white text-black"
            )}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("h-4 w-4", inWishlist && "fill-current")} />
          </button>
        </motion.div>
      </Link>

      <div className="flex flex-1 flex-col p-4 gap-2">
        <Link href={`/products/${slug}`} className="line-clamp-2 text-sm font-medium hover:text-primary transition-colors">
          {name}
        </Link>

        {rating > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({reviewCount})</span>
          </div>
        )}

        <div className="mt-auto flex items-center gap-2">
          <span className="font-bold text-foreground">{formatPrice(price)}</span>
          {compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">{formatPrice(compareAtPrice)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
