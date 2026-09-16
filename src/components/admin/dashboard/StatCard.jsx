import { Link } from "react-router-dom";

export default function StatCard({ title, value, icon: Icon, href }) {
  return (
    <Link
      to={href}
      className="group rounded-3xl border border-[#2E7D32]/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#2E7D32]/20 hover:shadow-xl hover:shadow-[#2E7D32]/5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#1A1A1A]/55">{title}</p>

          <p className="mt-3 text-4xl font-heading text-[#1A1A1A]">{value}</p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F5E9] transition group-hover:bg-[#2E7D32]">
          <Icon
            size={21}
            className="text-[#2E7D32] transition group-hover:text-white"
          />
        </div>
      </div>
    </Link>
  );
}
