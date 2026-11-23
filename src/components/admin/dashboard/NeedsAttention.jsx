import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";

import SectionCard from "./SectionCard";
import EmptyState from "./EmptyState";

export default function NeedsAttention({ items }) {
  return (
    <SectionCard
      title="Needs Attention"
      description="Items that may require action."
    >
      {items.length === 0 ? (
        <EmptyState text="Nothing needs attention right now." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Link
              key={`${item.type}-${item.id}`}
              to={item.href}
              className="flex items-center justify-between rounded-2xl border border-brand/10 bg-surface p-4 transition hover:border-brand/25 hover:bg-brand-soft/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft">
                  <AlertTriangle size={18} className="text-brand" />
                </div>

                <p className="font-medium text-ink">{item.label}</p>
              </div>

              <ArrowRight size={18} className="shrink-0 text-ink/40" />
            </Link>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
