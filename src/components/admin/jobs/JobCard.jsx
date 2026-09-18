import { Link } from "react-router-dom";
import { getPackageById, getServiceById } from "@/services/cleaningService";

export default function JobCard({ job }) {
  const packageName = job.service.packageId
    ? getPackageById(job.service.packageId)?.name
    : null;

  const customServices = (job.service.selectedServices || [])
    .map((id) => getServiceById(id)?.name)
    .filter(Boolean);

  const extras = (job.service.extras || [])
    .map((id) => getServiceById(id)?.name)
    .filter(Boolean);

  const serviceLabel =
    job.service.requestType === "package"
      ? packageName
      : job.service.requestType === "custom"
        ? customServices.join(", ")
        : "Customised Service";

  const displayPrice = job.pricing.finalPrice ?? job.pricing.agreedPrice;

  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-500">{job.jobCode}</p>

          <h2 className="mt-1 text-xl font-semibold text-gray-900">
            {job.customer.firstName} {job.customer.lastName}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {job.property.suburb}
            {job.property.postcode && ` · ${job.property.postcode}`}
          </p>
        </div>

        <span className="rounded-full border border-gray-300 px-3 py-2 text-sm capitalize text-gray-700">
          {job.status}
        </span>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-4">
        <div>
          <p className="text-xs font-semibold uppercase text-gray-400">
            Service
          </p>

          <p className="mt-1 font-medium text-gray-900">
            {serviceLabel || "Cleaning"}
          </p>

          {extras.length > 0 && (
            <p className="mt-1 text-sm text-gray-600">+ {extras.join(", ")}</p>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-gray-400">
            Schedule
          </p>

          <p className="mt-1 text-gray-900">{job.schedule.date}</p>

          <p className="mt-1 text-sm text-gray-600">
            {job.schedule.startTime}
            {job.schedule.endTime && ` – ${job.schedule.endTime}`}
          </p>

          {job.schedule.estimatedLabourHours != null && (
            <p className="mt-1 text-xs text-gray-500">
              {job.schedule.estimatedLabourHours}h total labour
            </p>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase text-gray-400">Price</p>

          <p className="mt-1 font-medium text-gray-900">
            {displayPrice != null ? `$${displayPrice}` : "Not set"}
          </p>

          {job.pricing.finalPrice != null && (
            <p className="mt-1 text-xs text-gray-500">Final price</p>
          )}

          {job.pricing.finalPrice == null &&
            job.pricing.agreedPrice != null && (
              <p className="mt-1 text-xs text-gray-500">Agreed price</p>
            )}
        </div>

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

      <div className="mt-6">
        <Link
          to={`/admin/jobs/${job.id}`}
          className="inline-block rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white"
        >
          View Job
        </Link>
      </div>
    </article>
  );
}
