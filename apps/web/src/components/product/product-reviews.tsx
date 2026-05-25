"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  id?: string;
  rating: number;
  title?: string | null;
  body?: string | null;
  user?: { firstName: string; lastName: string; avatar?: string | null };
  createdAt?: Date | string;
}

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export function ProductReviews({ reviews, rating, reviewCount }: ProductReviewsProps) {
  return (
    <section className="mt-16">
      <h2 className="mb-6 text-2xl font-bold">Reviews ({reviewCount})</h2>

      <div className="mb-8 flex items-center gap-6">
        <div className="text-center">
          <p className="text-6xl font-bold">{rating.toFixed(1)}</p>
          <div className="mt-2 flex justify-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn("h-5 w-5", i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted")}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{reviewCount} reviews</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review, i) => (
            <div key={i} className="rounded-xl border border-border p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {review.user?.firstName?.[0]}{review.user?.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{review.user?.firstName} {review.user?.lastName}</p>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={cn("h-3 w-3", j < review.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted")} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {review.title && <p className="mt-3 font-semibold">{review.title}</p>}
              {review.body && <p className="mt-1 text-sm text-muted-foreground">{review.body}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
