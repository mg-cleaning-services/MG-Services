import { Link } from "react-router-dom";

export default function JobHeader({ job }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      {/* Identity */}

      <div className="flex min-w-0 items-center gap-4">
        <p className="shrink-0 text-sm font-semibold uppercase tracking-widest text-gray-500">
          {job.jobCode}
        </p>

        <h1 className="truncate text-2xl font-bold text-gray-900">
          {job.customer.firstName} {job.customer.lastName}
        </h1>
      </div>

      {/* Request / source relationship */}

      <div className="flex flex-1 justify-center">
        {job.requestId ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Created from</span>

            <Link
              to={`/admin/requests/${job.requestId}`}
              className="font-semibold text-[#2E7D32] hover:underline"
            >
              {job.requestCode || "Original Request"} →
            </Link>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Direct Job · {formatSource(job.source)}
          </p>
        )}
      </div>

      {/* Status */}

      <StatusBadge status={job.status} />
    </div>
  );
}

function formatSource(source) {
  const labels = {
    website: "Website",
    phone: "Phone",
    whatsapp: "WhatsApp",
    referral: "Referral",
    returning_customer: "Returning Customer",
    other: "Other",
  };

  return labels[source] || source || "Other";
}

function StatusBadge({ status }) {
  const labels = {
    unassigned: "Unassigned",
    assigned: "Assigned",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    <span className="shrink-0 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
      {labels[status] || status}
    </span>
  );
}
