import { Download, Users, UserCheck, UserPlus } from "lucide-react";

const customers = [
  { name: "Rahul Ahmed", email: "rahul@example.com", orders: 12, spent: 45200, joined: "Jan 2025", status: "Active" },
  { name: "Priya Sen", email: "priya@example.com", orders: 7, spent: 18900, joined: "Mar 2025", status: "Active" },
  { name: "Karim Hossain", email: "karim@example.com", orders: 23, spent: 82400, joined: "Nov 2024", status: "Active" },
  { name: "Fatima Akter", email: "fatima@example.com", orders: 4, spent: 9600, joined: "Apr 2026", status: "Active" },
  { name: "Arif Islam", email: "arif@example.com", orders: 1, spent: 1850, joined: "May 2026", status: "Active" },
  { name: "Nasrin Jahan", email: "nasrin@example.com", orders: 9, spent: 31200, joined: "Feb 2025", status: "Inactive" },
  { name: "Rahim Uddin", email: "rahim@example.com", orders: 15, spent: 54800, joined: "Oct 2024", status: "Active" },
  { name: "Sumaiya Khan", email: "sumaiya@example.com", orders: 3, spent: 7100, joined: "May 2026", status: "Active" },
];

const stats = [
  { label: "Total Customers", value: "1,234", icon: Users, color: "text-blue-500" },
  { label: "Active Customers", value: "987", icon: UserCheck, color: "text-green-500" },
  { label: "New This Month", value: "89", icon: UserPlus, color: "text-purple-500" },
];

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customers</h1>
        <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
          <Download className="h-4 w-4" /> Export
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          placeholder="Search customers..."
          className="w-full max-w-sm rounded-lg border border-border bg-card px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-4 text-left font-medium text-muted-foreground">Customer</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Orders</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Total Spent</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Joined</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.email} className="border-b border-border hover:bg-muted/30 transition-colors last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {c.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{c.orders} orders</td>
                <td className="p-4 font-medium">৳{c.spent.toLocaleString()}</td>
                <td className="p-4 text-muted-foreground">{c.joined}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    c.status === "Active" ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                  }`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
