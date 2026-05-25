import type { Metadata } from "next";
import { Info, Lock, Mail, User } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Account",
  description: "Sign in or create an account",
};

// Shared input class
const inputCls = cn(
  "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground",
  "placeholder:text-muted-foreground shadow-sm",
  "transition-shadow duration-200",
  "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60",
);

const labelCls = "mb-1.5 block text-sm font-medium text-foreground";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="border-b border-border bg-muted/30 px-4 py-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Account</h1>
        <p className="mt-2 text-muted-foreground">Sign in or create a new account</p>
      </div>

      {/* Notice banner */}
      <div className="container mx-auto max-w-5xl px-4 pt-8">
        <div className="flex items-start gap-3 rounded-xl border border-blue-500/30 bg-blue-500/5 px-5 py-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
          <p className="text-sm text-blue-600 dark:text-blue-400">
            <strong>Authentication coming soon</strong> — backend integration required. The forms below are UI previews only.
          </p>
        </div>
      </div>

      {/* Two-column form layout */}
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* ── Sign In ── */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground">Sign In</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Welcome back! Sign in to your account.
              </p>
            </div>

            <form className="space-y-4" action="#">
              <div>
                <label className={labelCls} htmlFor="signin-email">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={cn(inputCls, "pl-10")}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={cn(labelCls, "mb-0")} htmlFor="signin-password">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={cn(inputCls, "pl-10")}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-border accent-primary"
                />
                <label htmlFor="remember" className="text-sm text-muted-foreground">
                  Remember me for 30 days
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]"
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Social placeholder */}
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-border bg-background py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
            >
              {/* Google "G" icon */}
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          {/* ── Register ── */}
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground">Create Account</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                New here? Join us and start shopping.
              </p>
            </div>

            <form className="space-y-4" action="#">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls} htmlFor="reg-first">
                    First name
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      id="reg-first"
                      type="text"
                      placeholder="Jane"
                      autoComplete="given-name"
                      className={cn(inputCls, "pl-10")}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls} htmlFor="reg-last">
                    Last name
                  </label>
                  <input
                    id="reg-last"
                    type="text"
                    placeholder="Doe"
                    autoComplete="family-name"
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls} htmlFor="reg-email">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="reg-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={cn(inputCls, "pl-10")}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls} htmlFor="reg-password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="reg-password"
                    type="password"
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    className={cn(inputCls, "pl-10")}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls} htmlFor="reg-confirm">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="reg-confirm"
                    type="password"
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    className={cn(inputCls, "pl-10")}
                  />
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input
                  id="terms"
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <a href="#" className="font-medium text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-medium text-primary hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]"
              >
                Create Account
              </button>
            </form>

            {/* Benefits */}
            <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Member benefits
              </p>
              <ul className="space-y-1.5">
                {[
                  "Track your orders in real time",
                  "Get early access to new arrivals",
                  "Exclusive member discounts",
                  "Faster checkout every time",
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
