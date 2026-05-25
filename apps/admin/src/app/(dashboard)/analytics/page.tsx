"use client";

import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, BarChart2 } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 42000 }, { month: "Feb", revenue: 58000 },
  { month: "Mar", revenue: 51000 }, { month: "Apr", revenue: 74000 },
  { month: "May", revenue: 89000 }, { month: "Jun", revenue: 95000 },
  { month: "Jul", revenue: 112000 }, { month: "Aug", revenue: 124500 },
];

const trafficData = [
  { name: "Direct", value: 35 }, { name: "Organic", value: 28 },
  { name: "Social", value: 22 }, { name: "Referral", value: 15 },
];

const categoryData = [
  { name: "Fashion", sales: 145 }, { name: "Electronics", sales: 98 },
  { name: "Home", sales: 76 }, { name: "Sports", sales: 54 },
  { name: "Beauty", sales: 43 },
];

const PIE_COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];

const stats = [
  { label: "Revenue", value: "৳1,24,500", change: "+18.2%", up: true, icon: DollarSign },
  { label: "Orders", value: "342", change: "+12.5%", up: true, icon: ShoppingBag },
  { label: "Visitors", value: "8,920", change: "+5.1%", up: true, icon: Users },
  { label: "Conversion", value: "3.84%", change: "-0.3%", up: false, icon: BarChart2 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <button className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
          Last 30 Days
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className={`mt-1 flex items-center gap-1 text-xs ${s.up ? "text-green-500" : "text-red-500"}`}>
              {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {s.change} vs last month
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-semibold">Revenue Overview</h2>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `৳${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => [`৳${v.toLocaleString()}`, "Revenue"]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-semibold">Traffic Sources</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={trafficData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                  {trafficData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {trafficData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <span className="h-3 w-3 rounded-full" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="ml-auto font-medium">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-semibold">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={categoryData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={60} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
