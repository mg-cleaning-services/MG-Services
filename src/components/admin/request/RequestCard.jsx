import { Link } from "react-router-dom";

export default function RequestCard({ request, onStatusChange }) {
  const serviceLabel =
    request.service.requestType === "package"
      ? request.service.packageName || "Cleaning Package"
      : request.service.requestType === "custom"
        ? "Custom Cleaning"
        : "Needs Recommendation";

  function handleStatusChange(event) {
    event.preventDefault();
    event.stopPropagation();

    onStatusChange(request.id, event.target.value);
  }

  function handleStatusClick(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <Link
      to={`/admin/requests/${request.id}`}
      className="block rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-gray-300 hover:shadow-sm"
    >
      {/* Request ID + Status */}

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-gray-500">
          {request.requestCode}
        </p>

        <select
          value={request.status}
          onClick={handleStatusClick}
          onChange={handleStatusChange}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm capitalize text-gray-700"
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="in-discussion">In Discussion</option>
          <option value="converted">Converted</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Request information */}

      <div className="mt-5 grid gap-5 md:grid-cols-[1.4fr_1fr_1.2fr_1fr]">
        {/* Customer */}

        <div>
          <p className="font-semibold text-gray-900">
            {request.customer.firstName} {request.customer.lastName}
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {request.property.suburb}
            {request.property.postcode && ` · ${request.property.postcode}`}
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {request.customer.phone || "No phone"}
          </p>
        </div>

        {/* Service */}

        <div>
          <p className="text-xs font-semibold uppercase text-gray-400">
            Service
          </p>

          <p className="mt-1 font-medium text-gray-900">{serviceLabel}</p>
        </div>

        {/* Property */}

        <div>
          <p className="text-xs font-semibold uppercase text-gray-400">
            Property
          </p>

          <p className="mt-1 capitalize text-gray-900">
            {request.property.propertyType || "Not specified"}
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {formatPropertyDetails(request.property)}
          </p>
        </div>

        {/* Preferred */}

        <div>
          <p className="text-xs font-semibold uppercase text-gray-400">
            Preferred
          </p>

          <p className="mt-1 font-medium text-gray-900">
            {formatPreferredDate(request.schedule.preferredDate)}
          </p>

          <p className="mt-1 capitalize text-sm text-gray-600">
            {request.schedule.preferredTime || "Not specified"}
          </p>
        </div>
      </div>
    </Link>
  );
}

function formatPropertyDetails(property) {
  const details = [];

  if (property.bedrooms) {
    details.push(`${property.bedrooms} bed`);
  }

  if (property.bathrooms) {
    details.push(`${property.bathrooms} bath`);
  }

  if (property.floors) {
    details.push(`${property.floors} floor`);
  }

  return details.length > 0 ? details.join(" · ") : "Details not specified";
}

function formatPreferredDate(value) {
  if (!value) {
    return "No preferred date";
  }

  const [year, month, day] = value.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
