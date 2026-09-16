import { Link } from "react-router-dom";

export default function RequestHeader({ request, onStatusChange }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <Link to="/admin/requests" className="text-sm text-gray-500">
          ← Back to Requests
        </Link>

        <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-gray-500">
          {request.requestCode}
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          {request.customer.firstName} {request.customer.lastName}
        </h1>
      </div>

      {request.status === "converted" ? (
        <span className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          Converted
        </span>
      ) : (
        <select
          value={request.status}
          onChange={(event) => onStatusChange(event.target.value)}
          className="rounded-xl border border-gray-300 bg-white px-4 py-3"
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
