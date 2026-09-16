import { useMemo } from "react";

import { getPackages, getServices } from "@/services/cleaningService";

export default function CleaningServiceFields({ value, onChange }) {
  const packages = getPackages();
  const services = getServices();

  const includedServiceIds = useMemo(() => {
    if (value.requestType !== "package" || !value.packageId) {
      return [];
    }

    const selectedPackage = packages.find(
      (cleaningPackage) => cleaningPackage.id === value.packageId,
    );

    return selectedPackage?.includedServices || [];
  }, [value.requestType, value.packageId, packages]);

  const availableExtras = services.filter(
    (service) => !includedServiceIds.includes(service.id),
  );

  function updateService(nextService) {
    onChange(nextService);
  }

  function handleRequestTypeChange(requestType) {
    updateService({
      ...value,
      requestType,
      packageId: requestType === "package" ? value.packageId : "",
      selectedServices:
        requestType === "custom" ? value.selectedServices || [] : [],
      extras: requestType === "package" ? value.extras || [] : [],
    });
  }

  function handlePackageChange(packageId) {
    updateService({
      ...value,
      requestType: "package",
      packageId,
      selectedServices: [],
      extras: [],
    });
  }

  function toggleService(serviceId) {
    const selected = value.selectedServices || [];

    const selectedServices = selected.includes(serviceId)
      ? selected.filter((id) => id !== serviceId)
      : [...selected, serviceId];

    updateService({
      ...value,
      selectedServices,
    });
  }

  function toggleExtra(serviceId) {
    const extras = value.extras || [];

    const nextExtras = extras.includes(serviceId)
      ? extras.filter((id) => id !== serviceId)
      : [...extras, serviceId];

    updateService({
      ...value,
      extras: nextExtras,
    });
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Request type"
          value={value.requestType}
          onChange={handleRequestTypeChange}
          options={[
            ["package", "Package"],
            ["custom", "Custom Cleaning"],
            ["unsure", "Needs Recommendation"],
          ]}
        />

        {value.requestType === "package" && (
          <Select
            label="Package"
            value={value.packageId}
            onChange={handlePackageChange}
            options={packages.map((item) => [item.id, item.name])}
          />
        )}
      </div>

      {value.requestType === "package" && (
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700">
            Additional services
          </p>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {availableExtras.map((service) => (
              <CheckboxCard
                key={service.id}
                label={service.name}
                checked={value.extras?.includes(service.id) || false}
                onChange={() => toggleExtra(service.id)}
              />
            ))}
          </div>
        </div>
      )}

      {value.requestType === "custom" && (
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700">Selected services</p>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {services.map((service) => (
              <CheckboxCard
                key={service.id}
                label={service.name}
                checked={value.selectedServices?.includes(service.id) || false}
                onChange={() => toggleService(service.id)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
      >
        <option value="">Select</option>

        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxCard({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4">
      <input type="checkbox" checked={checked} onChange={onChange} />

      <span className="text-sm font-medium text-gray-800">{label}</span>
    </label>
  );
}
