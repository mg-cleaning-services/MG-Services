function formatMoney(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "—";
  }

  return `$${number.toFixed(2)}`;
}

function formatHours(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "—";
  }

  return `${number} h`;
}

export default function ServicePricingFields({
  estimatedPrice = 0,
  estimatedLabourHours = 0,

  commercialPrice = "",
  onCommercialPriceChange,
  commercialPriceLabel = "Quoted price",
  commercialPriceDescription = "Price offered to the customer.",

  finalPrice = "",
  onFinalPriceChange,
  showFinalPrice = false,

  packagePrice = 0,
  packageLabourHours = 0,
  packageName = "",
  bedrooms = "",
  bathrooms = "",

  serviceBreakdown = [],
  calculationComplete = true,
}) {
  const hasPackage = Boolean(packageName);

  return (
    <div className="space-y-6">
      {/* CURRENT SERVICE ESTIMATE */}

      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Current service estimate
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Automatically calculated from the selected package, property and
              additional services.
            </p>
          </div>

          {!calculationComplete && (
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
              Quote required
            </span>
          )}
        </div>

        {/* PACKAGE */}

        {hasPackage && (
          <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900">{packageName}</p>

                {(bedrooms !== "" || bathrooms !== "") && (
                  <p className="mt-1 text-xs text-gray-500">
                    {bedrooms !== "" &&
                      `${bedrooms} bedroom${Number(bedrooms) === 1 ? "" : "s"}`}
                    {bedrooms !== "" && bathrooms !== "" && " · "}
                    {bathrooms !== "" &&
                      `${bathrooms} bathroom${Number(bathrooms) === 1 ? "" : "s"}`}
                  </p>
                )}
              </div>

              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatMoney(packagePrice)}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {formatHours(packageLabourHours)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SERVICE BREAKDOWN */}

        {serviceBreakdown.length > 0 && (
          <div className="mt-3 space-y-2">
            {serviceBreakdown.map((item) => (
              <div
                key={item.serviceId}
                className="rounded-xl border border-gray-200 bg-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.serviceName}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {item.requestedQuantity} required
                      {" · "}
                      {item.includedQuantity} included
                      {" · "}
                      {item.additionalQuantity} additional
                    </p>
                  </div>

                  <div className="text-right">
                    {item.additionalQuantity <= 0 ? (
                      <p className="text-sm font-medium text-gray-500">
                        Included
                      </p>
                    ) : item.calculationComplete ? (
                      <>
                        <p className="font-semibold text-gray-900">
                          +{formatMoney(item.additionalPrice)}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          +{formatHours(item.additionalLabourHours)}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm font-medium text-amber-700">
                        Quote required
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TOTAL */}

        <div className="mt-5 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-600">Suggested price</span>

            <span className="font-semibold text-gray-900">
              {calculationComplete
                ? formatMoney(estimatedPrice)
                : "Quote required"}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between gap-4">
            <span className="text-sm text-gray-600">Estimated labour</span>

            <span className="font-semibold text-gray-900">
              {formatHours(estimatedLabourHours)}
            </span>
          </div>
        </div>

        {/* INCOMPLETE CALCULATION */}

        {!calculationComplete && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm font-medium text-amber-800">
              Manual quote required
            </p>

            <p className="mt-1 text-xs text-amber-700">
              One or more selected services cannot be fully calculated from the
              current pricing catalogue. Review the quantities and enter the
              customer price manually.
            </p>
          </div>
        )}
      </div>

      {/* CUSTOMER PRICING */}

      <div>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Customer pricing
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Commercial prices are controlled manually and are not overwritten by
            the automatic estimate.
          </p>
        </div>

        <div
          className={
            showFinalPrice
              ? "grid gap-6 md:grid-cols-2"
              : "grid gap-6 md:grid-cols-1"
          }
        >
          {/* QUOTED / AGREED PRICE */}

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-gray-700">
              {commercialPriceLabel}
            </span>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={commercialPrice ?? ""}
                onChange={(event) =>
                  onCommercialPriceChange?.(event.target.value)
                }
                placeholder="0.00"
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-8 pr-4 text-gray-900 outline-none focus:border-gray-500"
              />
            </div>

            <p className="mt-2 text-xs text-gray-500">
              {commercialPriceDescription}
            </p>
          </label>

          {/* FINAL PRICE — JOB ONLY */}

          {showFinalPrice && (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-700">
                Final price
              </span>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={finalPrice ?? ""}
                  onChange={(event) => onFinalPriceChange?.(event.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-8 pr-4 text-gray-900 outline-none focus:border-gray-500"
                />
              </div>

              <p className="mt-2 text-xs text-gray-500">
                Actual amount charged after the service is completed or the
                scope changes.
              </p>
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
