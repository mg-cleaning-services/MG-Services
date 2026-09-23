import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  const displayPrice = job.pricing.finalPrice ?? job.pricing.agreedPrice;

  const priceLabel =
    job.pricing.finalPrice != null
      ? "Final price"
      : job.pricing.agreedPrice != null
        ? "Agreed price"
        : null;

  const serviceLabel =
    job.service.requestType === "package"
      ? job.service.packageName || "Package"
      : "Customised Service";

  return (
    <Link
      to={`/admin/jobs/${job.id}`}
      className="block rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-gray-300 hover:shadow-sm"
    >
      {/* Job ID + Status */}

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-gray-500">{job.jobCode}</p>

        <span className="rounded-full border border-gray-300 px-3 py-1.5 text-sm capitalize text-gray-700">
          {job.status}
        </span>
      </div>

      {/* Operational information */}

      <div className="mt-5 grid gap-5 md:grid-cols-[1.4fr_1fr_1.1fr_.8fr_1fr]">
        {/* Customer */}

        <div>
          <p className="font-semibold text-gray-900">
            {job.customer.firstName} {job.customer.lastName}
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {job.location.suburb}
            {job.location.postcode && ` · ${job.location.postcode}`}
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {job.customer.phone || "No phone"}
          </p>
        </div>

        {/* Service */}

        <div>
          <p className="text-xs font-semibold uppercase text-gray-400">
            Service
          </p>

          <p className="mt-1 font-medium text-gray-900">{serviceLabel}</p>
        </div>

        {/* Schedule */}

        <div>
          <p className="text-xs font-semibold uppercase text-gray-400">
            Schedule
          </p>

          <p className="mt-1 font-medium text-gray-900">
            {formatServiceDate(job.schedule.serviceDate)}
          </p>

          <p className="mt-1 text-sm text-gray-600">
            {job.schedule.startTime}
            {job.schedule.endTime && ` – ${job.schedule.endTime}`}
          </p>
        </div>

        {/* Price */}

        <div>
          <p className="text-xs font-semibold uppercase text-gray-400">Price</p>

          <p className="mt-1 font-medium text-gray-900">
            {displayPrice != null ? `$${displayPrice}` : "Not set"}
          </p>

          {priceLabel && (
            <p className="mt-1 text-xs text-gray-500">{priceLabel}</p>
          )}
        </div>

        {/* Team */}

        <div>
          <p className="text-xs font-semibold uppercase text-gray-400">Team</p>

          {job.team.length === 0 ? (
            <p className="mt-1 font-medium text-gray-900">Not assigned</p>
          ) : (
            <>
              <p className="mt-1 font-medium text-gray-900">
                {job.team[0].name}
              </p>

              {job.team.length > 1 && (
                <p className="mt-1 text-sm text-gray-500">
                  + {job.team.length - 1} more
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

function formatServiceDate(value) {
  if (!value) {
    return "Not scheduled";
  }

  const [year, month, day] = value.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
