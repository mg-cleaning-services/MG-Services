import DashboardStats from "@/components/admin/dashboard/DashboardStats";
import NeedsAttention from "@/components/admin/dashboard/NeedsAttention";
import UpcomingJobs from "@/components/admin/dashboard/UpcomingJobs";
import RecentRequests from "@/components/admin/dashboard/RecentRequests";

import useAdminDashboard from "@/hooks/useAdminDashboard";

export default function AdminDashboard() {
  const {
    newRequests,
    unassignedJobs,
    activeEmployees,
    upcomingJobs,
    recentRequests,
    attentionItems,
    loading,
    loadError,
  } = useAdminDashboard();

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F9FAF9] px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-[#1A1A1A]/60">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="min-h-screen bg-[#F9FAF9] px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-heading text-[#1A1A1A]">
            Could not load dashboard
          </h1>

          <p className="mt-3 text-[#1A1A1A]/60">{loadError}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9FAF9] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2E7D32]">
            Admin Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-heading text-[#1A1A1A]">
            MG Cleaning
          </h1>

          <p className="mt-2 text-[#1A1A1A]/60">
            Overview of requests, jobs and team activity.
          </p>
        </header>

        <DashboardStats
          newRequests={newRequests}
          unassignedJobs={unassignedJobs}
          upcomingJobs={upcomingJobs}
          activeEmployees={activeEmployees}
        />

        <div className="mt-10 grid gap-8 xl:grid-cols-2">
          <NeedsAttention items={attentionItems} />

          <UpcomingJobs jobs={upcomingJobs} />

          <div className="xl:col-span-2">
            <RecentRequests requests={recentRequests} />
          </div>
        </div>
      </div>
    </main>
  );
}
