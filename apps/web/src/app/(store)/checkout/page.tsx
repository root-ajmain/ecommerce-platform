import Link from "next/link";
import { ShoppingBag, ArrowLeft, Lock } from "lucide-react";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mx-auto">
          <Lock className="h-10 w-10 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Checkout</h1>
          <p className="mt-2 text-muted-foreground">
            Secure checkout is coming soon. Sign in to be notified when it launches.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/account"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Sign In
          </Link>
          <Link
            href="/category/all"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium transition hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
