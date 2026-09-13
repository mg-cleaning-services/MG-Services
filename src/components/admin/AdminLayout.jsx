import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#F9FAF9] lg:flex">
      <AdminSidebar />

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
