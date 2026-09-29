import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  ClipboardList,
  BriefcaseBusiness,
  Users,
  UserRoundSearch,
  ExternalLink,
  Menu,
  X,
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
  {
    name: "Candidates",
    to: "/admin/candidates",
    icon: UserRoundSearch,
  },
];

export default function AdminSidebar({ profile }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error);
      return;
    }

    navigate("/login", { replace: true });
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      {/* =========================================================
          MOBILE HEADER
      ========================================================= */}
      <header className="sticky top-0 z-50 border-b border-[#2E7D32]/10 bg-white/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {/* User */}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {profile?.full_name || "Admin"}
            </p>

            <p className="text-xs capitalize text-gray-500">
              {profile?.role || ""}
            </p>
          </div>

          {/* Hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-700 transition hover:bg-gray-50"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="absolute left-0 right-0 top-full border-b border-gray-200 bg-white shadow-lg">
            <div className="px-4 py-4">
              {/* Navigation */}
              <nav className="space-y-1">
                {navigation.map(({ name, to, icon: Icon, end }) => (
                  <NavLink
                    key={name}
                    to={to}
                    end={end}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition",
                        isActive
                          ? "bg-[#E8F5E9] text-[#2E7D32]"
                          : "text-gray-600 hover:bg-[#F9FAF9] hover:text-gray-900",
                      ].join(" ")
                    }
                  >
                    <Icon size={19} />

                    <span>{name}</span>
                  </NavLink>
                ))}
              </nav>

              {/* Bottom actions */}
              <div className="mt-4 border-t border-gray-100 pt-4">
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition hover:bg-[#F9FAF9] hover:text-[#2E7D32]"
                >
                  <ExternalLink size={18} />

                  <span>View Website</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 flex w-full items-center rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================= */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 self-start border-r border-[#2E7D32]/10 bg-white/95 backdrop-blur lg:block">
        {/* User */}
        <div className="border-b border-gray-100 px-6 py-5">
          <p className="font-semibold text-gray-900">
            {profile?.full_name || "Admin"}
          </p>

          <p className="text-sm capitalize text-gray-500">
            {profile?.role || ""}
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 p-4">
          {navigation.map(({ name, to, icon: Icon, end }) => (
            <NavLink
              key={name}
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-[#E8F5E9] text-[#2E7D32]"
                    : "text-[#1A1A1A]/60 hover:bg-[#F9FAF9] hover:text-[#1A1A1A]",
                ].join(" ")
              }
            >
              <Icon size={19} />

              <span>{name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="absolute bottom-6 w-64 px-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[#1A1A1A]/50 transition hover:bg-[#F9FAF9] hover:text-[#2E7D32]"
          >
            <ExternalLink size={18} />

            <span>View Website</span>
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
    </>
  );
}
