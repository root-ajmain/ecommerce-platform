import { Plus, Edit, Trash2, Tag } from "lucide-react";

const coupons = [
  { code: "SUMMER20", type: "Percentage", value: 20, minOrder: 500, used: 142, limit: 500, expiry: "30 Jun 2026", status: "Active" },
  { code: "FLAT100", type: "Fixed", value: 100, minOrder: 1000, used: 89, limit: 200, expiry: "15 Jun 2026", status: "Active" },
  { code: "WELCOME10", type: "Percentage", value: 10, minOrder: 0, used: 312, limit: 1000, expiry: "31 Dec 2026", status: "Active" },
  { code: "EID50", type: "Fixed", value: 50, minOrder: 300, used: 200, limit: 200, expiry: "20 May 2026", status: "Expired" },
  { code: "TECH15", type: "Percentage", value: 15, minOrder: 2000, used: 45, limit: 100, expiry: "30 Jul 2026", status: "Active" },
  { code: "VIP25", type: "Percentage", value: 25, minOrder: 5000, used: 18, limit: 50, expiry: "31 Aug 2026", status: "Active" },
  { code: "FLASH200", type: "Fixed", value: 200, minOrder: 1500, used: 50, limit: 50, expiry: "01 May 2026", status: "Expired" },
  { code: "NEWUSER", type: "Percentage", value: 30, minOrder: 0, used: 567, limit: 2000, expiry: "31 Dec 2026", status: "Active" },
];

export default function CouponsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Create Coupon
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-4 text-left font-medium text-muted-foreground">Code</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Discount</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Min Order</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Usage</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Expiry</th>
              <th className="p-4 text-left font-medium text-muted-foreground">Status</th>
              <th className="p-4 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.code} className="border-b border-border hover:bg-muted/30 transition-colors last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-primary" />
                    <span className="font-mono font-semibold text-primary">{coupon.code}</span>
                  </div>
                </td>
                <td className="p-4 font-medium">
                  {coupon.type === "Percentage" ? `${coupon.value}% off` : `৳${coupon.value} off`}
                </td>
                <td className="p-4 text-muted-foreground">
                  {coupon.minOrder > 0 ? `৳${coupon.minOrder}` : "No minimum"}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.min((coupon.used / coupon.limit) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{coupon.used}/{coupon.limit}</span>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{coupon.expiry}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    coupon.status === "Active" ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"
                  }`}>
                    {coupon.status}
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
