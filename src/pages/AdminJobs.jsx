import { useMemo, useState } from "react";
import JobCard from "@/components/admin/jobs/JobCard";
import { getJobs } from "@/services/jobService";
import { Link } from "react-router-dom";

export default function AdminJobs() {
  const [jobs] = useState(getJobs());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredJobs = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const fullName =
        `${job.customer.firstName} ${job.customer.lastName}`.toLowerCase();

      const matchesSearch =
        job.id.toLowerCase().includes(searchValue) ||
        fullName.includes(searchValue) ||
        job.property.suburb.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" || job.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, statusFilter]);

  const unassignedCount = jobs.filter(
    (job) => job.status === "unassigned",
  ).length;

  const assignedCount = jobs.filter((job) => job.status === "assigned").length;

  const completedCount = jobs.filter(
    (job) => job.status === "completed",
  ).length;

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Admin
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">Jobs</h1>

            <p className="mt-2 text-gray-600">
              Manage confirmed cleaning jobs and cleaner assignments.
            </p>
          </div>

          <Link
            to="/admin/jobs/new"
            className="
      inline-flex items-center justify-center
      rounded-xl bg-[#2E7D32]
      px-5 py-3
      font-semibold text-white
      transition hover:bg-[#256B29]
    "
          >
            + Create Job
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="Unassigned" value={unassignedCount} />
          <StatCard label="Assigned" value={assignedCount} />
          <StatCard label="Completed" value={completedCount} />
        </div>

        <div className="mt-8 flex flex-col gap-4 md:flex-row">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by customer, suburb or job ID..."
            className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-4 py-3"
          >
            <option value="all">All statuses</option>
            <option value="unassigned">Unassigned</option>
            <option value="assigned">Assigned</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="mt-8 space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <p className="font-medium text-gray-900">No jobs found</p>

              <p className="mt-2 text-sm text-gray-500">
                Confirmed cleaning jobs will appear here.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
