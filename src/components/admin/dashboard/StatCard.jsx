import { Link } from "react-router-dom";

export default function StatCard({ title, value, icon: Icon, href }) {
  return (
    <Link
      to={href}
      className="group rounded-3xl border border-brand/10 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/20 hover:shadow-xl hover:shadow-brand/5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-ink/55">{title}</p>

          <p className="mt-3 text-4xl font-heading text-ink">{value}</p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft transition group-hover:bg-brand">
          <Icon
            size={21}
            className="text-brand transition group-hover:text-white"
          />
        </div>
      </div>
    </Link>
  );
}
