import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ profile }) {
  return (
    <div className="lg:flex">
      <AdminSidebar profile={profile} />

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
