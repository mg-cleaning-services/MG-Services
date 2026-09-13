import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  BriefcaseBusiness,
  Users,
  ExternalLink,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    to: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    name: "Requests",
    to: "/admin/requests",
    icon: ClipboardList,
  },
  {
    name: "Jobs",
    to: "/admin/jobs",
    icon: BriefcaseBusiness,
  },
  {
    name: "Team",
    to: "/admin/team",
    icon: Users,
  },
];

export default function AdminSidebar() {
  return (
    <aside
      className="
    sticky top-0 z-40
    border-b border-[#2E7D32]/10
    bg-white/95 backdrop-blur
    lg:relative lg:min-h-screen lg:w-64
    lg:border-b-0 lg:border-r"
    >
      {/* Brand */}
      <div className="border-b border-[#2E7D32]/10 px-6 py-6">
        <Link to="/" className="inline-block">
          <div className="text-2xl font-heading font-bold text-[#1A1A1A]">
            MG<span className="text-[#2E7D32]">.</span>
          </div>

          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#1A1A1A]/40">
            Admin
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav
        className="
    flex gap-2 overflow-x-auto p-4
    scrollbar-hide
    lg:block lg:space-y-2
  "
      >
        {navigation.map(({ name, to, icon: Icon, end }) => (
          <NavLink
            key={name}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                "flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-[#E8F5E9] text-[#2E7D32]"
                  : "text-[#1A1A1A]/60 hover:bg-[#F9FAF9] hover:text-[#1A1A1A]",
              ].join(" ")
            }
          >
            <Icon size={19} />
            {name}
          </NavLink>
        ))}
      </nav>

      {/* Website */}
      <div className="hidden px-4 lg:absolute lg:bottom-6 lg:block lg:w-64">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[#1A1A1A]/50 transition hover:bg-[#F9FAF9] hover:text-[#2E7D32]"
        >
          <ExternalLink size={18} />
          View Website
        </Link>
      </div>
    </aside>
  );
}
