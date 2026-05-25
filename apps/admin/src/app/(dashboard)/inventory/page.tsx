import { AlertTriangle, Package, RefreshCw } from "lucide-react";

const inventory = [
  { product: "Premium Cotton T-Shirt", sku: "TSH-001-BLK", stock: 3, threshold: 10, supplier: "FabricCo" },
  { product: "Samsung Galaxy S24", sku: "ELC-SG24-128", stock: 8, threshold: 5, supplier: "TechDistrib" },
  { product: "Running Shoes Pro", sku: "SHO-RUN-42", stock: 0, threshold: 15, supplier: "SportGear" },
  { product: "Wireless Earbuds X1", sku: "ELC-EAR-X1", stock: 24, threshold: 10, supplier: "TechDistrib" },
  { product: "Linen Summer Dress", sku: "DRS-LIN-M", stock: 6, threshold: 20, supplier: "FashionHub" },
  { product: "Yoga Mat Premium", sku: "SPT-YOG-001", stock: 42, threshold: 15, supplier: "SportGear" },
  { product: "Leather Wallet", sku: "ACC-WAL-BRN", stock: 2, threshold: 10, supplier: "LeatherWorks" },
  { product: "Sony WH-1000XM5", sku: "ELC-SNY-XM5", stock: 11, threshold: 5, supplier: "TechDistrib" },
  { product: "Denim Jacket Classic", sku: "JKT-DEN-L", stock: 0, threshold: 8, supplier: "FashionHub" },
  { product: "Protein Powder 2kg", sku: "NTR-PRT-2KG", stock: 18, threshold: 20, supplier: "HealthPlus" },
];

const lowStock = inventory.filter((i) => i.stock < i.threshold).length;
const outOfStock = inventory.filter((i) => i.stock === 0).length;

function StockBadge({ stock, threshold }: { stock: number; threshold: number }) {
  if (stock === 0) return <span className="font-medium text-red-500">Out of Stock</span>;
  if (stock < threshold / 2) return <span className="font-medium text-red-400">{stock} units</span>;
  if (stock < threshold) return <span className="font-medium text-yellow-500">{stock} units</span>;
  return <span className="font-medium text-green-500">{stock} units</span>;
}

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
          <RefreshCw className="h-4 w-4" /> Sync Stock
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <Package className="h-5 w-5 text-muted-foreground mb-2" />
          <p className="text-2xl font-bold">{inventory.length}</p>
          <p className="text-sm text-muted-foreground">Total SKUs</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mb-2" />
          <p className="text-2xl font-bold text-yellow-500">{lowStock}</p>
          <p className="text-sm text-muted-foreground">Low Stock</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <AlertTriangle className="h-5 w-5 text-red-500 mb-2" />
          <p className="text-2xl font-bold text-red-500">{outOfStock}</p>
          <p className="text-sm text-muted-foreground">Out of Stock</p>
        </div>
      </div>

      {lowStock > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-600 dark:text-yellow-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span><strong>{lowStock} products</strong> need restocking. Review and reorder soon.</span>
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-4 text-left font-medium text-muted-foreground">Product</th>
              <th className="p-4 text-left font-medium text-muted-foreground">SKU</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Stock</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Threshold</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Supplier</th>
              <th className="p-4 text-right font-medium text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.sku} className="border-b border-border hover:bg-muted/30 transition-colors last:border-0">
                <td className="p-4 font-medium">{item.product}</td>
                <td className="p-4 font-mono text-xs text-muted-foreground">{item.sku}</td>
                <td className="p-4"><StockBadge stock={item.stock} threshold={item.threshold} /></td>
                <td className="p-4 text-muted-foreground">{item.threshold} units</td>
                <td className="p-4 text-muted-foreground">{item.supplier}</td>
                <td className="p-4 text-right">
                  <button className="rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
                    Restock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
