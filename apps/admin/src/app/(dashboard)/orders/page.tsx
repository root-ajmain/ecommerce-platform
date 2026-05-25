import { Download, Eye } from "lucide-react";

const orders = [
  { id: "#1010", customer: "Rahul Ahmed", date: "25 May 2026", items: 3, total: 8450, status: "Pending" },
  { id: "#1009", customer: "Priya Sen", date: "24 May 2026", items: 1, total: 2200, status: "Processing" },
  { id: "#1008", customer: "Karim Hossain", date: "24 May 2026", items: 5, total: 15800, status: "Shipped" },
  { id: "#1007", customer: "Fatima Akter", date: "23 May 2026", items: 2, total: 4300, status: "Delivered" },
  { id: "#1006", customer: "Arif Islam", date: "23 May 2026", items: 1, total: 1850, status: "Delivered" },
  { id: "#1005", customer: "Nasrin Jahan", date: "22 May 2026", items: 4, total: 9200, status: "Cancelled" },
  { id: "#1004", customer: "Rahim Uddin", date: "22 May 2026", items: 2, total: 5600, status: "Delivered" },
  { id: "#1003", customer: "Sumaiya Khan", date: "21 May 2026", items: 3, total: 7100, status: "Shipped" },
  { id: "#1002", customer: "Tanvir Chowdhury", date: "21 May 2026", items: 1, total: 3200, status: "Delivered" },
  { id: "#1001", customer: "Mita Roy", date: "20 May 2026", items: 6, total: 22400, status: "Delivered" },
];

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-yellow-500/10 text-yellow-500",
  Processing: "bg-blue-500/10 text-blue-500",
  Shipped: "bg-purple-500/10 text-purple-500",
  Delivered: "bg-green-500/10 text-green-500",
  Cancelled: "bg-red-500/10 text-red-500",
};

const tabs = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
          <Download className="h-4 w-4" /> Export
        </button>
      </div>

      <div className="flex gap-1 rounded-lg border border-border bg-muted/30 p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === "All" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-4 text-left font-medium text-muted-foreground">Order ID</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Customer</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Date</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Items</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Total</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Status</th>
              <th className="p-4 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border hover:bg-muted/30 transition-colors last:border-0">
                <td className="p-4 font-mono font-medium text-primary">{order.id}</td>
                <td className="p-4 font-medium">{order.customer}</td>
                <td className="p-4 text-muted-foreground">{order.date}</td>
                <td className="p-4 text-muted-foreground">{order.items} items</td>
                <td className="p-4 font-medium">৳{order.total.toLocaleString()}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors ml-auto">
                    <Eye className="h-4 w-4 text-muted-foreground" />
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
