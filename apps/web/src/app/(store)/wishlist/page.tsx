"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, ShoppingBag, Sparkles } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist.store";

export default function WishlistPage() {
  const { productIds } = useWishlistStore();
  const count = productIds.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/30 px-4 py-10">
        <div className="container mx-auto flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Your Wishlist
          </h1>
          {count > 0 && (
            <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-primary px-2 text-sm font-semibold text-primary-foreground">
              {count}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-16">
        {count === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            {/* Animated heart */}
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/15 to-pink-500/15 ring-1 ring-rose-500/20"
            >
              <Heart className="h-14 w-14 text-rose-400" strokeWidth={1.5} />
            </motion.div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
              Save items you love
            </h2>
            <p className="text-muted-foreground max-w-sm mb-8 leading-relaxed">
              Tap the heart on any product to save it here. Your wishlist is stored locally — sign in to sync it across devices.
            </p>

            {/* Feature highlights */}
            <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3 w-full max-w-lg">
              {[
                {
                  icon: Heart,
                  title: "Save Favourites",
                  desc: "Bookmark products you want to buy later",
                },
                {
                  icon: Sparkles,
                  title: "Get Notified",
                  desc: "Be first to know about price drops",
                },
                {
                  icon: ShoppingBag,
                  title: "Easy Checkout",
                  desc: "Move items to your cart in one tap",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-xl border border-border bg-card p-4 text-left"
                >
                  <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>

            <Link
              href="/category/all"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-95"
            >
              <ShoppingBag className="h-4 w-4" />
              Start Shopping
            </Link>
          </motion.div>
        ) : (
          /* Non-empty: show count card + prompt */
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-rose-500/15 to-pink-500/15 ring-1 ring-rose-500/20">
              <Heart className="h-12 w-12 fill-rose-400 text-rose-400" strokeWidth={1.5} />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
              {count} item{count !== 1 ? "s" : ""} saved
            </h2>
            <p className="text-muted-foreground max-w-sm mb-8">
              Sign in to view and manage your wishlist items, or continue shopping to add more.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/account"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-95"
              >
                Sign In to View
              </Link>
              <Link
                href="/category/all"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-7 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Keep Shopping
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
