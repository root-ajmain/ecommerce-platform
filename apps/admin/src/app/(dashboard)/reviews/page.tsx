import { Star, CheckCircle, XCircle, MessageSquare } from "lucide-react";

const reviews = [
  { product: "Premium Cotton T-Shirt", customer: "Rahul Ahmed", rating: 5, text: "Excellent quality! The fabric is soft and the fit is perfect. Will definitely buy more.", date: "24 May 2026", status: "Pending" },
  { product: "Samsung Galaxy S24", customer: "Priya Sen", rating: 4, text: "Great phone overall. Camera is amazing but battery life could be better.", date: "23 May 2026", status: "Approved" },
  { product: "Running Shoes Pro", customer: "Karim Hossain", rating: 5, text: "Best running shoes I've ever owned. Super comfortable for long runs.", date: "22 May 2026", status: "Approved" },
  { product: "Wireless Earbuds X1", customer: "Fatima Akter", rating: 2, text: "Disappointed with the sound quality. Expected much better for the price.", date: "21 May 2026", status: "Pending" },
  { product: "Linen Summer Dress", customer: "Nasrin Jahan", rating: 5, text: "Absolutely love this dress! Perfect for summer. Got so many compliments.", date: "20 May 2026", status: "Approved" },
  { product: "Yoga Mat Premium", customer: "Sumaiya Khan", rating: 3, text: "Decent mat but slips a bit during hot yoga. Good for regular practice though.", date: "19 May 2026", status: "Rejected" },
];

const stats = [
  { label: "Total Reviews", value: "456", color: "text-foreground" },
  { label: "Pending", value: "23", color: "text-yellow-500" },
  { label: "Approved", value: "412", color: "text-green-500" },
  { label: "Rejected", value: "21", color: "text-red-500" },
];

const tabs = ["All", "Pending", "Approved", "Rejected"];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reviews</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          <span>Manage customer reviews</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
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

      <div className="space-y-4">
        {reviews.map((review, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {review.customer.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{review.customer}</span>
                    <span className="text-xs text-muted-foreground">on</span>
                    <span className="text-sm font-medium text-primary truncate">{review.product}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={review.rating} />
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{review.text}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  review.status === "Approved" ? "bg-green-500/10 text-green-500" :
                  review.status === "Rejected" ? "bg-red-500/10 text-red-500" :
                  "bg-yellow-500/10 text-yellow-500"
                }`}>
                  {review.status}
                </span>
                {review.status === "Pending" && (
                  <>
                    <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-green-500/10 transition-colors" title="Approve">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-red-500/10 transition-colors" title="Reject">
                      <XCircle className="h-4 w-4 text-red-500" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
