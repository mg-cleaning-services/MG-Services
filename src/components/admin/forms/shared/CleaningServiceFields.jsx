import { useMemo } from "react";

import { getPackages, getServices } from "@/services/cleaningService";

import FormSelect from "../ui/FormSelect";
import CheckboxCard from "../ui/CheckboxCard";

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

  function handleRequestTypeChange(requestType) {
    onChange({
      ...value,
      requestType,
      packageId: requestType === "package" ? value.packageId : "",
      selectedServices:
        requestType === "custom" ? value.selectedServices || [] : [],
      extras: requestType === "package" ? value.extras || [] : [],
    });
  }

  function handlePackageChange(packageId) {
    onChange({
      ...value,
      requestType: "package",
      packageId,
      selectedServices: [],
      extras: [],
    });
  }

  function toggleService(serviceId) {
    const selected = value.selectedServices || [];

    const nextSelected = selected.includes(serviceId)
      ? selected.filter((id) => id !== serviceId)
      : [...selected, serviceId];

    onChange({
      ...value,
      selectedServices: nextSelected,
    });
  }

  function toggleExtra(serviceId) {
    const extras = value.extras || [];

    const nextExtras = extras.includes(serviceId)
      ? extras.filter((id) => id !== serviceId)
      : [...extras, serviceId];

    onChange({
      ...value,
      extras: nextExtras,
    });
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <FormSelect
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
          <FormSelect
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
