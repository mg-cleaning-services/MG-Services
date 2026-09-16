import { Link } from "react-router-dom";

export default function ConvertedJobCard({ job }) {
  if (!job) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-green-700">Converted to Job</p>

          <p className="mt-1 text-xl font-semibold text-gray-900">
            {job.jobCode}
          </p>

          <p className="mt-2 text-sm text-gray-600">
            {formatJobStatus(job.status)}
            {" · "}
            {job.schedule.date}
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {job.team.length === 0
              ? "Team not assigned"
              : job.team.map((employee) => employee.name).join(", ")}
          </p>
        </div>

        <Link
          to={`/admin/jobs/${job.id}`}
          className="rounded-xl bg-[#2E7D32] px-5 py-3 text-sm font-medium text-white"
        >
          View Job →
        </Link>
      </div>
    </div>
  );
}

function formatJobStatus(status) {
  const labels = {
    unassigned: "Unassigned",
    assigned: "Assigned",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return labels[status] || status;
}
