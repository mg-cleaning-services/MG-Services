import { getPackageById, getServiceById } from "@/services/cleaningService";

export default function ConfirmedServiceFields({ value }) {
  const packageName = value.packageId
    ? getPackageById(value.packageId)?.name
    : null;

  const customServices = (value.selectedServices || [])
    .map((serviceId) => getServiceById(serviceId)?.name)
    .filter(Boolean);

  const extras = (value.extras || [])
    .map((serviceId) => getServiceById(serviceId)?.name)
    .filter(Boolean);

  return (
    <div>
      <p className="text-sm text-gray-500">Confirmed service</p>

      <p className="mt-1 text-lg font-semibold text-gray-900">
        {value.requestType === "package"
          ? packageName || "Cleaning Package"
          : value.requestType === "custom"
            ? "Custom Cleaning"
            : "Customised Service"}
      </p>

      {customServices.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700">Services</p>

          <p className="mt-1 text-sm text-gray-600">
            {customServices.join(", ")}
          </p>
        </div>
      )}

      {extras.length > 0 && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700">
            Additional services
          </p>

          <p className="mt-1 text-sm text-gray-600">{extras.join(", ")}</p>
        </div>
      )}
    </div>
  );
}
