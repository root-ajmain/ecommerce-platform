import { Images, FileText, Megaphone, Edit, ChevronRight } from "lucide-react";

const sections = [
  { title: "Hero Slides", count: "3 active", icon: Images, color: "bg-purple-500/10 text-purple-500", desc: "Manage homepage hero carousel slides and CTAs" },
  { title: "Pages", count: "8 pages", icon: FileText, color: "bg-blue-500/10 text-blue-500", desc: "Edit static pages like About, FAQ, Policies" },
  { title: "Banners", count: "5 active", icon: Megaphone, color: "bg-green-500/10 text-green-500", desc: "Promotional banners and announcement bars" },
];

const pages = [
  { name: "Home", slug: "/", status: "Published", updated: "25 May 2026" },
  { name: "About Us", slug: "/about", status: "Published", updated: "10 Apr 2026" },
  { name: "FAQ", slug: "/faq", status: "Published", updated: "01 Mar 2026" },
  { name: "Shipping Policy", slug: "/shipping-policy", status: "Published", updated: "15 Feb 2026" },
  { name: "Return Policy", slug: "/return-policy", status: "Draft", updated: "20 May 2026" },
];

export default function CMSPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Content Management</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {sections.map((s) => (
          <div key={s.title} className="rounded-xl border border-border bg-card p-5 hover:border-primary/50 transition-colors group cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <p className="font-semibold">{s.title}</p>
            <p className="text-sm font-medium text-primary mt-0.5">{s.count}</p>
            <p className="mt-2 text-xs text-muted-foreground">{s.desc}</p>
            <button className="mt-4 w-full rounded-lg border border-border py-1.5 text-xs font-medium hover:bg-muted transition-colors">
              Manage
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="font-semibold">Pages</h2>
          <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <FileText className="h-3.5 w-3.5" /> New Page
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-4 text-left font-medium text-muted-foreground">Page Name</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Slug</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Status</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Last Updated</th>
              <th className="p-4 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.slug} className="border-b border-border hover:bg-muted/30 transition-colors last:border-0">
                <td className="p-4 font-medium">{page.name}</td>
                <td className="p-4 font-mono text-xs text-muted-foreground">{page.slug}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    page.status === "Published" ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                  }`}>
                    {page.status}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground">{page.updated}</td>
                <td className="p-4 text-right">
                  <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors ml-auto">
                    <Edit className="h-4 w-4 text-muted-foreground" />
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
