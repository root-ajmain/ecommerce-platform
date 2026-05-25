import { Truck, Shield, RefreshCw, Headphones } from "lucide-react";

const TRUST_ITEMS = [
  { icon: Truck, title: "Free Delivery", description: "On orders above ৳1000" },
  { icon: Shield, title: "Secure Payment", description: "100% secure transactions" },
  { icon: RefreshCw, title: "Easy Returns", description: "7-day hassle-free return" },
  { icon: Headphones, title: "24/7 Support", description: "Expert help anytime" },
];

export function TrustSection() {
  return (
    <section className="border-y border-border bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {TRUST_ITEMS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
