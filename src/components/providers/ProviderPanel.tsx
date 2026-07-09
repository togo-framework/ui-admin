"use client";

// ProviderPanel — a control surface for togo's provider system: shows each
// capability (impl/exec/compute/data/queue/catalog/share) and its selected
// backend, and lets an operator switch it. Pure + presentational (Rule 25): the
// host supplies the capability rows + an onSelect callback (which typically calls
// `togo provider:use` / the MCP provider_use tool / a settings API). Bilingual
// EN/AR (Rule 8); token-clean (Rule 16).

import * as React from "react";
import { cn, NativeSelect, StatusBadge } from "@togo-framework/ui-core";

export interface CapabilityState {
  capability: string;
  active: string;
  options: string[];
  isDefault?: boolean;
}

export interface ProviderPanelProps {
  capabilities: CapabilityState[];
  language?: "en" | "ar";
  onSelect?: (capability: string, backend: string) => void;
  className?: string;
}

const LABEL: Record<string, { en: string; ar: string }> = {
  impl: { en: "Implementation", ar: "التنفيذ" },
  exec: { en: "Execution", ar: "بيئة التشغيل" },
  compute: { en: "Compute", ar: "الحوسبة" },
  data: { en: "Data", ar: "البيانات" },
  queue: { en: "Queue", ar: "الطابور" },
  catalog: { en: "Catalog", ar: "الفهرس" },
  share: { en: "Sharing", ar: "المشاركة" },
  storage: { en: "Storage", ar: "التخزين" },
  cache: { en: "Cache", ar: "التخزين المؤقت" },
  realtime: { en: "Realtime", ar: "الوقت الفعلي" },
};

export function ProviderPanel({ capabilities, language = "en", onSelect, className }: ProviderPanelProps) {
  const ar = language === "ar";
  const t = {
    title: ar ? "المزوّدون" : "Providers",
    subtitle: ar ? "الواجهة الخلفية المختارة لكل قدرة" : "Selected backend per capability",
    def: ar ? "افتراضي" : "default",
  };
  return (
    <div dir={ar ? "rtl" : "ltr"} className={cn("rounded-xl border border-border bg-card p-4", className)}>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-foreground">{t.title}</h3>
        <p className="text-xs text-muted-foreground">{t.subtitle}</p>
      </div>
      <div className="space-y-2">
        {capabilities.map((c) => {
          const label = LABEL[c.capability]?.[ar ? "ar" : "en"] ?? c.capability;
          return (
            <div key={c.capability} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{label}</span>
                  {c.isDefault && <StatusBadge tone="neutral">{t.def}</StatusBadge>}
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">{c.capability}</span>
              </div>
              <NativeSelect value={c.active} onChange={(e) => onSelect?.(c.capability, e.target.value)} className="w-auto min-w-[140px]">
                {c.options.map((o) => (<option key={o} value={o}>{o}</option>))}
              </NativeSelect>
            </div>
          );
        })}
      </div>
    </div>
  );
}
