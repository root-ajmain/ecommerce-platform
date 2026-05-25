import { Plus, Edit, Trash2 } from "lucide-react";

const brands = [
  { name: "Nike", products: 45, status: "Active" },
  { name: "Samsung", products: 32, status: "Active" },
  { name: "Apple", products: 28, status: "Active" },
  { name: "Adidas", products: 38, status: "Active" },
  { name: "Sony", products: 21, status: "Active" },
  { name: "LG", products: 17, status: "Active" },
  { name: "Puma", products: 29, status: "Active" },
  { name: "Zara", products: 54, status: "Active" },
  { name: "H&M", products: 61, status: "Active" },
  { name: "Reebok", products: 22, status: "Inactive" },
];

export default function BrandsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Brands</h1>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Brand
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-4 text-left font-medium text-muted-foreground">Brand Name</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Products</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Status</th>
              <th className="p-4 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.name} className="border-b border-border hover:bg-muted/30 transition-colors last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted font-bold text-sm">
                      {brand.name[0]}
                    </div>
                    <span className="font-medium">{brand.name}</span>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{brand.products} products</td>
                <td className="p-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    brand.status === "Active"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {brand.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors">
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-destructive/10 transition-colors">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
