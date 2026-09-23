import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  BriefcaseBusiness,
  Users,
  ExternalLink,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

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

export default function AdminSidebar({ profile }) {
  const navigate = useNavigate();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error);
      return;
    }

    navigate("/login", { replace: true });
  }

  return (
    <aside className="sticky top-0 z-40 border-b border-[#2E7D32]/10 bg-white/95 backdrop-blur lg:h-screen lg:w-64 lg:shrink-0 lg:self-start lg:border-b-0 lg:border-r">
      {/* User */}
      <div className="border-b border-gray-100 px-4 py-4 lg:px-6">
        <p className="font-semibold text-gray-900">
          {profile?.full_name || "Admin"}
        </p>

        <p className="text-sm capitalize text-gray-500">
          {profile?.role || ""}
        </p>
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

      {/* Bottom actions */}
      <div className="px-4 pb-4 lg:absolute lg:bottom-6 lg:w-64">
        <Link
          to="/"
          className="hidden items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[#1A1A1A]/50 transition hover:bg-[#F9FAF9] hover:text-[#2E7D32] lg:flex"
        >
          <ExternalLink size={18} />
          View Website
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-2 w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
