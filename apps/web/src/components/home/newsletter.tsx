"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Subscribed! Watch for exclusive deals.");
    setEmail("");
    setLoading(false);
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/10 p-10 text-center md:p-16"
        >
          <div className="absolute inset-0 -z-10 opacity-20" style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 50%), radial-gradient(circle at 80% 20%, #a855f7 0%, transparent 50%)"
          }} />

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 mb-6">
            <Mail className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-3xl font-bold md:text-4xl">Stay in the Loop</h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Subscribe for exclusive deals, new arrivals, and style inspiration.
          </p>

          <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm outline-none ring-2 ring-transparent transition focus:ring-primary"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "..." : <>Subscribe <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">No spam, unsubscribe anytime.</p>
        </motion.div>
      </div>
    </section>
  );
}
