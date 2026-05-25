"use client";

import { motion } from "framer-motion";
import { TrendingUp, ShoppingCart, Users, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCard {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ElementType;
  color: string;
}

const STATS: StatCard[] = [
  {
    label: "Total Revenue",
    value: "৳1,24,500",
    change: "+12.5% from last month",
    trend: "up",
    icon: TrendingUp,
    color: "text-violet-500",
  },
  {
    label: "Orders",
    value: "340",
    change: "+8.2% from last month",
    trend: "up",
    icon: ShoppingCart,
    color: "text-blue-500",
  },
  {
    label: "Customers",
    value: "1,280",
    change: "+15.3% from last month",
    trend: "up",
    icon: Users,
    color: "text-green-500",
  },
  {
    label: "Products",
    value: "248",
    change: "+4 new this week",
    trend: "neutral",
    icon: Package,
    color: "text-orange-500",
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="rounded-xl border border-border bg-card p-5"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <stat.icon className={cn("h-5 w-5", stat.color)} />
          </div>
          <p className="mt-2 text-2xl font-bold">{stat.value}</p>
          <p className={cn("mt-1 text-xs", stat.trend === "up" ? "text-green-500" : "text-muted-foreground")}>
            {stat.change}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
