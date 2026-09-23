import { Link } from "react-router-dom";

export default function RequestHeader({
  request,
  generatedJob,
  onStatusChange,
}) {
  const isConverted = request.status === "converted";

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
      {/* Identity */}

      <div className="flex min-w-0 items-center gap-4">
        <p className="shrink-0 text-sm font-semibold uppercase tracking-widest text-gray-500">
          {request.requestCode}
        </p>

        <h1 className="truncate text-2xl font-bold text-gray-900">
          {request.customer.firstName} {request.customer.lastName}
        </h1>
      </div>

      {/* Job relationship */}

      <div className="flex flex-1 justify-center">
        {isConverted && generatedJob ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Converted to</span>

            <Link
              to={`/admin/jobs/${generatedJob.id}`}
              className="font-semibold text-[#2E7D32] hover:underline"
            >
              {generatedJob.jobCode || "Created Job"} →
            </Link>
          </div>
        ) : null}
      </div>

      {/* Status */}

      {isConverted ? (
        <span className="shrink-0 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
          Converted
        </span>
      ) : (
        <select
          value={request.status}
          onChange={(event) => onStatusChange(event.target.value)}
          className="shrink-0 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm"
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="in-discussion">In Discussion</option>
          <option value="closed">Closed</option>
        </select>
      )}
    </div>
  );
}
