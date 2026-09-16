import {
  ClipboardList,
  BriefcaseBusiness,
  CalendarDays,
  Users,
} from "lucide-react";

import StatCard from "./StatCard";

export default function DashboardStats({
  newRequests,
  unassignedJobs,
  upcomingJobs,
  activeEmployees,
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="New Requests"
        value={newRequests.length}
        icon={ClipboardList}
        href="/admin/requests"
      />

      <StatCard
        title="Unassigned Jobs"
        value={unassignedJobs.length}
        icon={BriefcaseBusiness}
        href="/admin/jobs"
      />

      <StatCard
        title="Upcoming Jobs"
        value={upcomingJobs.length}
        icon={CalendarDays}
        href="/admin/jobs"
      />

      <StatCard
        title="Active Cleaners"
        value={activeEmployees.length}
        icon={Users}
        href="/admin/team"
      />
    </div>
  );
}
