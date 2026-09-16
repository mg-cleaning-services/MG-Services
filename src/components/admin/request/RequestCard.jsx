import { Link } from "react-router-dom";
import { getPackageById, getServiceById } from "@/services/cleaningService";

export default function RequestCard({ request, onStatusChange }) {
  const packageName = request.service.packageId
    ? getPackageById(request.service.packageId)?.name
    : null;

  const customServices = (request.service.selectedServices || [])
    .map((id) => getServiceById(id)?.name)
    .filter(Boolean);

  const extras = (request.service.extras || [])
    .map((id) => getServiceById(id)?.name)
    .filter(Boolean);

  const serviceLabel =
    request.service.requestType === "package"
      ? packageName || "Cleaning Package"
      : request.service.requestType === "custom"
        ? "Custom Cleaning"
        : "Needs Recommendation";

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-500">
            {request.requestCode}
          </p>

          <h2 className="mt-1 text-xl font-semibold text-gray-900">
            {request.customer.firstName} {request.customer.lastName}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {request.property.suburb}
            {request.property.postcode && ` · ${request.property.postcode}`}
          </p>
        </div>

        <select
          value={request.status}
          onChange={(event) => onStatusChange(request.id, event.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="in-discussion">In Discussion</option>
          <option value="converted">Converted</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Service
          </p>

          <p className="mt-1 font-medium text-gray-900">{serviceLabel}</p>

          {customServices.length > 0 && (
            <p className="mt-1 text-sm text-gray-600">
              {customServices.join(", ")}
            </p>
          )}

          {extras.length > 0 && (
            <p className="mt-1 text-sm text-gray-600">+ {extras.join(", ")}</p>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Property
          </p>

          <p className="mt-1 capitalize text-gray-900">
            {request.property.propertyType}
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {request.property.bedrooms} bed · {request.property.bathrooms} bath
            · {request.property.floors || "?"} floor
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Preferred
          </p>

          <p className="mt-1 text-gray-900">{request.schedule.preferredDate}</p>

          <p className="mt-1 capitalize text-sm text-gray-600">
            {request.schedule.preferredTime}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to={`/admin/requests/${request.id}`}
          className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white"
        >
          View Request
        </Link>

        <button
          type="button"
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
        >
          Contact
        </button>
      </div>
    </article>
  );
}
