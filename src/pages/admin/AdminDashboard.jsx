import { Link } from "react-router-dom";
import {
  ClipboardList,
  BriefcaseBusiness,
  CalendarDays,
  Users,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

import { getRequests } from "@/services/requestService";
import { getJobs } from "@/services/jobService";
import { getEmployees } from "@/services/employeeService";

export default function AdminDashboard() {
  const requests = getRequests();
  const jobs = getJobs();
  const employees = getEmployees();

  const newRequests = requests.filter((request) => request.status === "new");

  const unassignedJobs = jobs.filter(
    (job) =>
      job.status !== "completed" &&
      job.status !== "cancelled" &&
      !job.assignedEmployeeId,
  );

  const activeEmployees = employees.filter(
    (employee) => employee.status === "active",
  );

  const upcomingJobs = jobs
    .filter((job) => {
      if (!job.schedule?.date) return false;
      if (job.status === "completed" || job.status === "cancelled")
        return false;

      const jobDate = new Date(`${job.schedule.date}T00:00:00`);
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      return jobDate >= today;
    })
    .sort((a, b) => {
      const dateA = new Date(
        `${a.schedule.date}T${a.schedule.startTime || "00:00"}`,
      );

      const dateB = new Date(
        `${b.schedule.date}T${b.schedule.startTime || "00:00"}`,
      );

      return dateA - dateB;
    });

  const recentRequests = [...requests]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);

      return dateB - dateA;
    })
    .slice(0, 5);

  const attentionItems = [
    ...unassignedJobs.slice(0, 3).map((job) => ({
      id: job.id,
      type: "job",
      label: `${job.id} has no cleaner assigned`,
      href: `/admin/jobs/${job.id}`,
    })),

    ...newRequests.slice(0, 3).map((request) => ({
      id: request.id,
      type: "request",
      label: `${request.id} is a new request`,
      href: `/admin/requests/${request.id}`,
    })),
  ];

  return (
    <div className="min-h-screen bg-[#F9FAF9] px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2E7D32]">
            Admin Dashboard
          </p>

          <h1 className="mt-2 text-4xl font-heading text-[#1A1A1A]">
            MG Cleaning
          </h1>

          <p className="mt-2 text-[#1A1A1A]/60">
            Overview of requests, jobs and team activity.
          </p>
        </div>

        {/* Stats */}
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

        <div className="mt-10 grid gap-8 xl:grid-cols-2">
          {/* Needs Attention */}
          <SectionCard
            title="Needs Attention"
            description="Items that may require action."
          >
            {attentionItems.length === 0 ? (
              <EmptyState text="Nothing needs attention right now." />
            ) : (
              <div className="space-y-3">
                {attentionItems.map((item) => (
                  <Link
                    key={`${item.type}-${item.id}`}
                    to={item.href}
                    className="flex items-center justify-between rounded-2xl border border-[#2E7D32]/10 bg-[#F9FAF9] p-4 transition hover:border-[#2E7D32]/25 hover:bg-[#E8F5E9]/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F5E9]">
                        <AlertTriangle size={18} className="text-[#2E7D32]" />
                      </div>

                      <div>
                        <p className="font-medium text-[#1A1A1A]">
                          {item.label}
                        </p>
                      </div>
                    </div>

                    <ArrowRight size={18} className="text-[#1A1A1A]/40" />
                  </Link>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Upcoming Jobs */}
          <SectionCard title="Upcoming Jobs" description="Next scheduled jobs.">
            {upcomingJobs.length === 0 ? (
              <EmptyState text="No upcoming jobs." />
            ) : (
              <div className="space-y-3">
                {upcomingJobs.slice(0, 5).map((job) => {
                  const employee = employees.find(
                    (item) => item.id === job.assignedEmployeeId,
                  );

                  return (
                    <Link
                      key={job.id}
                      to={`/admin/jobs/${job.id}`}
                      className="block rounded-2xl border border-[#2E7D32]/10 p-4 transition hover:border-[#2E7D32]/25"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-[#1A1A1A]">
                            {job.id}
                          </p>

                          <p className="mt-1 text-sm text-[#1A1A1A]/60">
                            {job.location?.suburb || "Location not set"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-medium text-[#1A1A1A]">
                            {job.schedule?.date}
                          </p>

                          <p className="mt-1 text-sm text-[#1A1A1A]/60">
                            {job.schedule?.startTime || "Time not set"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 border-t border-[#2E7D32]/10 pt-3">
                        <p className="text-sm text-[#1A1A1A]/60">
                          Cleaner:{" "}
                          <span className="font-medium text-[#1A1A1A]">
                            {employee?.name || "Unassigned"}
                          </span>
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </SectionCard>

          {/* Recent Requests */}
          <div className="xl:col-span-2">
            <SectionCard
              title="Recent Requests"
              description="Latest customer enquiries."
            >
              {recentRequests.length === 0 ? (
                <EmptyState text="No requests yet." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#2E7D32]/10 text-left">
                        <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/40">
                          Request
                        </th>

                        <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/40">
                          Customer
                        </th>

                        <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/40">
                          Location
                        </th>

                        <th className="pb-3 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/40">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentRequests.map((request) => (
                        <tr
                          key={request.id}
                          className="border-b border-[#2E7D32]/5 last:border-0"
                        >
                          <td className="py-4">
                            <Link
                              to={`/admin/requests/${request.id}`}
                              className="font-semibold text-[#2E7D32] hover:underline"
                            >
                              {request.id}
                            </Link>
                          </td>

                          <td className="py-4 text-sm text-[#1A1A1A]">
                            {[
                              request.customer?.firstName,
                              request.customer?.lastName,
                            ]
                              .filter(Boolean)
                              .join(" ") || "Unknown"}
                          </td>

                          <td className="py-4 text-sm text-[#1A1A1A]/60">
                            {request.property?.suburb || "Not provided"}
                          </td>

                          <td className="py-4">
                            <StatusBadge status={request.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, href }) {
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

function SectionCard({ title, description, children }) {
  return (
    <section className="rounded-3xl border border-[#2E7D32]/10 bg-white p-6 md:p-7">
      <div className="mb-6">
        <h2 className="text-xl font-heading text-[#1A1A1A]">{title}</h2>

        <p className="mt-1 text-sm text-[#1A1A1A]/50">{description}</p>
      </div>

      {children}
    </section>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-2xl bg-[#F9FAF9] px-5 py-8 text-center">
      <p className="text-sm text-[#1A1A1A]/50">{text}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    new: "bg-[#E8F5E9] text-[#2E7D32]",
    contacted: "bg-blue-50 text-blue-700",
    "in-discussion": "bg-amber-50 text-amber-700",
    converted: "bg-purple-50 text-purple-700",
    closed: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status || "unknown"}
    </span>
  );
}
