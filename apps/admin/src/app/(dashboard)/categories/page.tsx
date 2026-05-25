import { Plus, Shirt, Cpu, Dumbbell, Home, Sparkles, BookOpen, Gamepad2, Edit, Trash2 } from "lucide-react";

const categories = [
  { name: "Men's Fashion", slug: "mens-fashion", count: 120, icon: Shirt, color: "bg-blue-500/10 text-blue-500" },
  { name: "Women's Fashion", slug: "womens-fashion", count: 180, icon: Sparkles, color: "bg-pink-500/10 text-pink-500" },
  { name: "Electronics", slug: "electronics", count: 95, icon: Cpu, color: "bg-cyan-500/10 text-cyan-500" },
  { name: "Sports & Outdoors", slug: "sports", count: 67, icon: Dumbbell, color: "bg-green-500/10 text-green-500" },
  { name: "Home & Living", slug: "home-living", count: 84, icon: Home, color: "bg-orange-500/10 text-orange-500" },
  { name: "Beauty", slug: "beauty", count: 56, icon: Sparkles, color: "bg-purple-500/10 text-purple-500" },
  { name: "Books", slug: "books", count: 43, icon: BookOpen, color: "bg-yellow-500/10 text-yellow-500" },
  { name: "Toys & Games", slug: "toys", count: 28, icon: Gamepad2, color: "bg-red-500/10 text-red-500" },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => (
          <div key={cat.slug} className="rounded-xl border border-border bg-card p-5 group hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${cat.color}`}>
                <cat.icon className="h-5 w-5" />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted transition-colors">
                  <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                <button className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-destructive/10 transition-colors">
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </button>
              </div>
            </div>
            <p className="font-semibold">{cat.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{cat.count} products</p>
            <div className="mt-3 h-1.5 w-full rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.min((cat.count / 180) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
