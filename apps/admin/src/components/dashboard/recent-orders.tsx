"use client";

import { cn } from "@/lib/utils";

const ORDERS = [
  { id: "ORD-001", customer: "Rahim Ahmed", total: "৳2,400", status: "DELIVERED", date: "2 mins ago" },
  { id: "ORD-002", customer: "Karim Islam", total: "৳850", status: "PROCESSING", date: "15 mins ago" },
  { id: "ORD-003", customer: "Fatima Begum", total: "৳5,200", status: "SHIPPED", date: "1 hr ago" },
  { id: "ORD-004", customer: "Noor Hossain", total: "৳320", status: "PENDING", date: "2 hrs ago" },
  { id: "ORD-005", customer: "Sumaiya Khatun", total: "৳1,700", status: "CANCELLED", date: "3 hrs ago" },
];

const STATUS_STYLES: Record<string, string> = {
  DELIVERED: "bg-green-500/10 text-green-500",
  PROCESSING: "bg-blue-500/10 text-blue-500",
  SHIPPED: "bg-purple-500/10 text-purple-500",
  PENDING: "bg-yellow-500/10 text-yellow-600",
  CANCELLED: "bg-red-500/10 text-red-500",
};

export function RecentOrders() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 text-sm font-semibold">Recent Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Order</th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Customer</th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Total</th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Status</th>
              <th className="pb-3 text-left text-xs font-medium text-muted-foreground">Date</th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((order) => (
              <tr key={order.id} className="border-b border-border/50 last:border-0">
                <td className="py-3 font-mono text-xs">{order.id}</td>
                <td className="py-3">{order.customer}</td>
                <td className="py-3 font-semibold">{order.total}</td>
                <td className="py-3">
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_STYLES[order.status])}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 text-muted-foreground">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
