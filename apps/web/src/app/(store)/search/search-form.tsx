"use client";

import { useRouter } from "next/navigation";
import { useRef, useTransition } from "react";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchFormProps {
  defaultValue?: string;
}

export function SearchForm({ defaultValue }: SearchFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = inputRef.current?.value.trim();
    if (!value) return;
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(value)}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute left-4 text-muted-foreground">
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </div>
        <input
          ref={inputRef}
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder="Search for products, brands, categories…"
          autoFocus
          className={cn(
            "w-full rounded-2xl border border-border bg-background py-4 pl-12 pr-36 text-base text-foreground",
            "placeholder:text-muted-foreground",
            "shadow-sm transition-shadow duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/60",
          )}
        />
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            "absolute right-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground",
            "transition-all duration-200 hover:bg-primary/90 active:scale-95",
            "disabled:opacity-60 disabled:cursor-not-allowed",
          )}
        >
          {isPending ? "Searching…" : "Search"}
        </button>
      </div>
    </form>
  );
}
