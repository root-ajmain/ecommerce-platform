import { AlertTriangle } from "lucide-react";

const LOW_STOCK = [
  { name: "Blue Denim Jacket", sku: "SKU-1042", quantity: 3 },
  { name: "Running Shoes XL", sku: "SKU-2891", quantity: 2 },
  { name: "Wireless Earbuds", sku: "SKU-3301", quantity: 5 },
  { name: "Canvas Backpack", sku: "SKU-1876", quantity: 1 },
];

export function LowStockAlert() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <h2 className="text-sm font-semibold">Low Stock</h2>
      </div>
      <div className="space-y-3">
        {LOW_STOCK.map((item) => (
          <div key={item.sku} className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.sku}</p>
            </div>
            <span className="ml-2 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-500">
              {item.quantity} left
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
