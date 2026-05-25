export function TopProducts() {
  const PRODUCTS = [
    { name: "Premium Sneakers", sales: 142, revenue: "৳71,000" },
    { name: "Leather Bag", sales: 98, revenue: "৳49,000" },
    { name: "Smart Watch", sales: 87, revenue: "৳1,04,400" },
    { name: "Sunglasses", sales: 74, revenue: "৳22,200" },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 text-sm font-semibold">Top Products</h2>
      <div className="space-y-3">
        {PRODUCTS.map((p, i) => (
          <div key={p.name} className="flex items-center gap-3">
            <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.sales} sales</p>
            </div>
            <span className="text-sm font-semibold">{p.revenue}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
