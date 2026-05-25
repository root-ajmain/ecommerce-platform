"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistState {
  productIds: string[];
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],

      addToWishlist: (id) =>
        set((state) => ({
          productIds: state.productIds.includes(id)
            ? state.productIds
            : [...state.productIds, id],
        })),

      removeFromWishlist: (id) =>
        set((state) => ({
          productIds: state.productIds.filter((pid) => pid !== id),
        })),

      toggleWishlist: (id) => {
        if (get().isInWishlist(id)) {
          get().removeFromWishlist(id);
        } else {
          get().addToWishlist(id);
        }
      },

      isInWishlist: (id) => get().productIds.includes(id),

      clear: () => set({ productIds: [] }),
    }),
    {
      name: "wishlist-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
