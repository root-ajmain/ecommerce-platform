"use client";

import { useState } from "react";
import { Save } from "lucide-react";

const tabs = ["General", "Payments", "Notifications", "Security"];

function InputField({ label, defaultValue, type = "text" }: { label: string; defaultValue: string; type?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </div>
  );
}

function SelectField({ label, options, defaultValue }: { label: string; options: string[]; defaultValue: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      <select
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function SettingsPage() {
  const [active, setActive] = useState("General");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="flex gap-1 rounded-lg border border-border bg-muted/30 p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              active === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {active === "General" && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-5 max-w-2xl">
          <h2 className="font-semibold">Store Information</h2>
          <InputField label="Store Name" defaultValue="LUXE Store" />
          <InputField label="Store Email" defaultValue="contact@luxestore.com" type="email" />
          <InputField label="Support Phone" defaultValue="+880 1700-000000" />
          <SelectField label="Currency" options={["BDT (৳)", "USD ($)", "EUR (€)"]} defaultValue="BDT (৳)" />
          <SelectField
            label="Timezone"
            options={["Asia/Dhaka (GMT+6)", "UTC (GMT+0)", "Asia/Kolkata (GMT+5:30)"]}
            defaultValue="Asia/Dhaka (GMT+6)"
          />
          <div className="pt-2">
            <button className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <Save className="h-4 w-4" /> Save Changes
            </button>
          </div>
        </div>
      )}

      {active !== "General" && (
        <div className="rounded-xl border border-border bg-card p-12 text-center max-w-2xl">
          <p className="text-4xl mb-3">🚧</p>
          <p className="font-semibold text-lg">{active} Settings</p>
          <p className="mt-1 text-sm text-muted-foreground">This section is under development and will be available soon.</p>
        </div>
      )}
    </div>
  );
}
