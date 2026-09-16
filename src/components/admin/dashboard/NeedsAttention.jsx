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
              className="flex items-center justify-between rounded-2xl border border-[#2E7D32]/10 bg-[#F9FAF9] p-4 transition hover:border-[#2E7D32]/25 hover:bg-[#E8F5E9]/40"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F5E9]">
                  <AlertTriangle size={18} className="text-[#2E7D32]" />
                </div>

                <p className="font-medium text-[#1A1A1A]">{item.label}</p>
              </div>

              <ArrowRight size={18} className="shrink-0 text-[#1A1A1A]/40" />
            </Link>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
