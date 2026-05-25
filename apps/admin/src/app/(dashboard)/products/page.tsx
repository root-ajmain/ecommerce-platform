import type { Metadata } from "next";
import { Plus, Search, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export const metadata: Metadata = { title: "Products" };

const PRODUCTS = [
  { id: 1, name: "Classic Cotton T-Shirt", sku: "TSH-001", category: "Men's Fashion", price: 850, stock: 142, status: "Active" },
  { id: 2, name: "Slim Fit Denim Jeans", sku: "JNS-002", category: "Men's Fashion", price: 2200, stock: 58, status: "Active" },
  { id: 3, name: "Floral Summer Dress", sku: "DRS-003", category: "Women's Fashion", price: 1750, stock: 34, status: "Active" },
  { id: 4, name: "Wireless Noise-Cancelling Headphones", sku: "ELC-004", category: "Electronics", price: 8500, stock: 0, status: "Out of Stock" },
  { id: 5, name: "Yoga Mat Premium", sku: "SPT-005", category: "Sports", price: 1200, stock: 75, status: "Active" },
  { id: 6, name: "Ceramic Coffee Mug Set", sku: "HML-006", category: "Home & Living", price: 650, stock: 8, status: "Active" },
  { id: 7, name: "Moisturizing Face Cream", sku: "BTY-007", category: "Beauty", price: 980, stock: 0, status: "Draft" },
  { id: 8, name: "JavaScript: The Good Parts", sku: "BKS-008", category: "Books", price: 450, stock: 22, status: "Draft" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "bg-green-500/10 text-green-500",
    Draft: "bg-yellow-500/10 text-yellow-500",
    "Out of Stock": "bg-red-500/10 text-red-500",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground text-sm">Manage your product catalog</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Products", value: "248" },
          { label: "Active", value: "215" },
          { label: "Draft", value: "33" },
          { label: "Out of Stock", value: "12" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option value="">All Categories</option>
          <option>Men&apos;s Fashion</option>
          <option>Women&apos;s Fashion</option>
          <option>Electronics</option>
          <option>Sports</option>
          <option>Home &amp; Living</option>
          <option>Beauty</option>
          <option>Books</option>
        </select>
        <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option value="">All Status</option>
          <option>Active</option>
          <option>Draft</option>
          <option>Out of Stock</option>
        </select>
        <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option value="">Price Range</option>
          <option>Under ৳500</option>
          <option>৳500 – ৳2,000</option>
          <option>৳2,000 – ৳5,000</option>
          <option>Above ৳5,000</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-4 text-left font-medium text-muted-foreground">Product</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Category</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Price</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Stock</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Status</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map((product) => (
              <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground flex-shrink-0">
                      IMG
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{product.category}</td>
                <td className="p-4 font-medium">৳{product.price.toLocaleString()}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4">
                  <StatusBadge status={product.status} />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button className="rounded-lg p-1.5 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg p-1.5 hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-sm text-muted-foreground">Showing 1–8 of 248 products</p>
          <div className="flex items-center gap-1">
            <button className="rounded-lg p-1.5 hover:bg-muted transition-colors text-muted-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
            {[1, 2, 3, "...", 31].map((page, i) => (
              <button
                key={i}
                className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${page === 1 ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}
              >
                {page}
              </button>
            ))}
            <button className="rounded-lg p-1.5 hover:bg-muted transition-colors text-muted-foreground">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
