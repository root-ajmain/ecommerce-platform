"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, Heart, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Shop", href: "/category/all", icon: Grid },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Cart", href: "#cart", icon: ShoppingCart, isCart: true },
  { label: "Account", href: "/account", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount());
  const openCart = useCartStore((s) => s.openCart);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {NAV_ITEMS.map(({ label, href, icon: Icon, isCart }) => {
          const isActive = !isCart && pathname === href;
          return (
            <button
              key={label}
              onClick={isCart ? openCart : undefined}
              className="flex flex-1 flex-col items-center justify-center gap-1"
            >
              {isCart ? (
                <span className="relative">
                  <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                  {itemCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                      {itemCount}
                    </span>
                  )}
                </span>
              ) : (
                <Link href={href} className="flex flex-col items-center gap-1">
                  <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-[10px]", isActive ? "text-primary font-medium" : "text-muted-foreground")}>
                    {label}
                  </span>
                </Link>
              )}
              {isCart && (
                <span className={cn("text-[10px]", "text-muted-foreground")}>{label}</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
