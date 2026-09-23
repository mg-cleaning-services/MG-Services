import { useEffect, useMemo, useState } from "react";

import { getPricingCatalog } from "@/services/cleaningService";

import FormSelect from "../ui/FormSelect";
import CheckboxCard from "../ui/CheckboxCard";

export default function CleaningServiceFields({ value, onChange }) {
  const [catalog, setCatalog] = useState({
    packages: [],
    packagePricing: [],
    services: [],
    servicePricingOptions: [],
    packageServices: [],
  });

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD CATALOG
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let ignore = false;

    async function loadCatalog() {
      try {
        setLoading(true);
        setLoadError("");

        const data = await getPricingCatalog();

        if (!ignore) {
          setCatalog(data);
        }
      } catch (error) {
        console.error("Could not load cleaning catalog:", error);

        if (!ignore) {
          setLoadError("Could not load cleaning packages and services.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      ignore = true;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | BASIC CATALOG DATA
  |--------------------------------------------------------------------------
  */

  const packages = catalog.packages;
  const services = catalog.services;

  /*
  |--------------------------------------------------------------------------
  | SELECTED PACKAGE SERVICES
  |--------------------------------------------------------------------------
  */

  const includedServiceIds = useMemo(() => {
    if (value.requestType !== "package" || !value.packageId) {
      return [];
    }

    return catalog.packageServices
      .filter((item) => item.package_id === value.packageId)
      .map((item) => item.service_id);
  }, [value.requestType, value.packageId, catalog.packageServices]);

  const includedServices = useMemo(() => {
    return includedServiceIds
      .map((serviceId) => services.find((service) => service.id === serviceId))
      .filter(Boolean);
  }, [includedServiceIds, services]);

  /*
  |--------------------------------------------------------------------------
  | SERVICES AVAILABLE AS ADD-ONS
  |--------------------------------------------------------------------------
  */

  const availableExtras = useMemo(() => {
    return services.filter(
      (service) =>
        service.active &&
        service.available_as_addon &&
        !includedServiceIds.includes(service.id),
    );
  }, [services, includedServiceIds]);

  const customServices = useMemo(() => {
    return services.filter(
      (service) => service.active && service.available_as_addon,
    );
  }, [services]);

  /*
  |--------------------------------------------------------------------------
  | QUANTITY HELPERS
  |--------------------------------------------------------------------------
  */

  function getServiceQuantity(serviceId) {
    return Number(value.serviceQuantities?.[serviceId] || 0);
  }

  function updateServiceQuantity(serviceId, quantity) {
    const safeQuantity = Math.max(0, Number(quantity) || 0);

    const nextQuantities = {
      ...(value.serviceQuantities || {}),
    };

    if (safeQuantity === 0) {
      delete nextQuantities[serviceId];
    } else {
      nextQuantities[serviceId] = safeQuantity;
    }

    onChange({
      ...value,
      serviceQuantities: nextQuantities,
    });
  }

  function removeServiceQuantity(serviceId, currentValue = value) {
    const nextQuantities = {
      ...(currentValue.serviceQuantities || {}),
    };

    delete nextQuantities[serviceId];

    return nextQuantities;
  }

  /*
  |--------------------------------------------------------------------------
  | DOES THIS SERVICE NEED A QUANTITY?
  |--------------------------------------------------------------------------
  |
  | If pricing options contain quantities, the service is treated as
  | quantifiable.
  |
  | Examples:
  | Carpet -> areas
  | Air conditioner -> units
  |
  |--------------------------------------------------------------------------
  */

  function getPricingOptions(serviceId) {
    return catalog.servicePricingOptions.filter(
      (option) => option.service_id === serviceId,
    );
  }

  function isQuantifiableService(serviceId) {
    return getPricingOptions(serviceId).some(
      (option) => Number(option.quantity) > 0,
    );
  }

  /*
  |--------------------------------------------------------------------------
  | REQUEST TYPE
  |--------------------------------------------------------------------------
  */

  function handleRequestTypeChange(requestType) {
    onChange({
      ...value,

      requestType,

      packageId: requestType === "package" ? value.packageId : "",

      selectedServices:
        requestType === "custom" ? value.selectedServices || [] : [],

      extras: requestType === "package" ? value.extras || [] : [],

      serviceQuantities: {},
    });
  }

  /*
  |--------------------------------------------------------------------------
  | PACKAGE
  |--------------------------------------------------------------------------
  */

  function handlePackageChange(packageId) {
    onChange({
      ...value,

      requestType: "package",
      packageId,

      selectedServices: [],
      extras: [],
      serviceQuantities: {},
    });
  }

  /*
  |--------------------------------------------------------------------------
  | CUSTOM SERVICE
  |--------------------------------------------------------------------------
  */

  function toggleService(serviceId) {
    const selected = value.selectedServices || [];

    const isSelected = selected.includes(serviceId);

    const nextSelected = isSelected
      ? selected.filter((id) => id !== serviceId)
      : [...selected, serviceId];

    const nextValue = {
      ...value,
      selectedServices: nextSelected,
    };

    if (isSelected) {
      nextValue.serviceQuantities = removeServiceQuantity(serviceId);
    } else if (isQuantifiableService(serviceId)) {
      /*
       * Start at 1 because selecting the service means
       * at least one unit/area is required.
       */
      nextValue.serviceQuantities = {
        ...(value.serviceQuantities || {}),
        [serviceId]: 1,
      };
    }

    onChange(nextValue);
  }

  /*
  |--------------------------------------------------------------------------
  | PACKAGE EXTRA
  |--------------------------------------------------------------------------
  */

  function toggleExtra(serviceId) {
    const extras = value.extras || [];

    const isSelected = extras.includes(serviceId);

    const nextExtras = isSelected
      ? extras.filter((id) => id !== serviceId)
      : [...extras, serviceId];

    const nextValue = {
      ...value,
      extras: nextExtras,
    };

    if (isSelected) {
      nextValue.serviceQuantities = removeServiceQuantity(serviceId);
    } else if (isQuantifiableService(serviceId)) {
      nextValue.serviceQuantities = {
        ...(value.serviceQuantities || {}),
        [serviceId]: 1,
      };
    }

    onChange(nextValue);
  }

  /*
  |--------------------------------------------------------------------------
  | QUANTITY CONTROL
  |--------------------------------------------------------------------------
  */

  function renderQuantityControl(service, { included = false } = {}) {
    if (!isQuantifiableService(service.id)) {
      return null;
    }

    const quantity = getServiceQuantity(service.id);

    /*
     * Included services start conceptually at 1.
     * If Maxi has not entered anything yet, show 1.
     */
    const displayQuantity = included && quantity === 0 ? 1 : quantity;

    const unit = service.unit || "unit";

    const unitLabel =
      displayQuantity === 1 ? unit : unit === "area" ? "areas" : `${unit}s`;

    return (
      <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Total required</p>

            <p className="mt-0.5 text-xs text-gray-500">
              {included
                ? `1 ${unit} included with this package`
                : `Total number of ${unitLabel} required`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                updateServiceQuantity(
                  service.id,
                  Math.max(included ? 1 : 1, displayQuantity - 1),
                )
              }
              disabled={displayQuantity <= 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-lg font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              −
            </button>

            <input
              type="number"
              min="1"
              step="1"
              value={displayQuantity || 1}
              onChange={(event) =>
                updateServiceQuantity(
                  service.id,
                  Math.max(1, Number(event.target.value) || 1),
                )
              }
              className="h-9 w-16 rounded-lg border border-gray-300 bg-white text-center text-sm font-semibold text-gray-800 outline-none focus:border-[#2E7D32]"
            />

            <button
              type="button"
              onClick={() =>
                updateServiceQuantity(service.id, displayQuantity + 1)
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-lg font-medium text-gray-700 transition hover:bg-gray-100"
            >
              +
            </button>
          </div>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          {displayQuantity} {unitLabel} total
          {included && (
            <> · 1 included · {Math.max(0, displayQuantity - 1)} additional</>
          )}
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | LOADING / ERROR
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-500">
        Loading cleaning catalog...
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {loadError}
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        <FormSelect
          label="Request type"
          value={value.requestType || ""}
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
            value={value.packageId || ""}
            onChange={handlePackageChange}
            options={packages.map((item) => [item.id, item.name])}
          />
        )}
      </div>

      {/* INCLUDED PACKAGE SERVICES */}

      {value.requestType === "package" &&
        value.packageId &&
        includedServices.length > 0 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700">
              Included services
            </p>

            <p className="mt-1 text-xs text-gray-500">
              Quantifiable services include one unit as part of the package.
            </p>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {includedServices.map((service) => (
                <div
                  key={service.id}
                  className="rounded-xl border border-green-200 bg-green-50/50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {service.name}
                      </p>

                      {service.description && (
                        <p className="mt-1 text-xs text-gray-500">
                          {service.description}
                        </p>
                      )}
                    </div>

                    <span className="shrink-0 rounded-full bg-[#2E7D32]/10 px-2.5 py-1 text-xs font-medium text-[#2E7D32]">
                      Included
                    </span>
                  </div>

                  {renderQuantityControl(service, {
                    included: true,
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

      {/* PACKAGE ADDITIONAL SERVICES */}

      {value.requestType === "package" && value.packageId && (
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700">
            Additional services
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Add services that are not already included in the selected package.
          </p>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {availableExtras.map((service) => {
              const selected = value.extras?.includes(service.id) || false;

              return (
                <div key={service.id}>
                  <CheckboxCard
                    label={service.name}
                    checked={selected}
                    onChange={() => toggleExtra(service.id)}
                  />

                  {selected && renderQuantityControl(service)}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CUSTOM CLEANING */}

      {value.requestType === "custom" && (
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700">Selected services</p>

          <p className="mt-1 text-xs text-gray-500">
            Select the services discussed with the customer.
          </p>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {customServices.map((service) => {
              const selected =
                value.selectedServices?.includes(service.id) || false;

              return (
                <div key={service.id}>
                  <CheckboxCard
                    label={service.name}
                    checked={selected}
                    onChange={() => toggleService(service.id)}
                  />

                  {selected && renderQuantityControl(service)}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
