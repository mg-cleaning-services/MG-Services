export default function EstimateQuoteFields({
  estimation,
  pricing,
  onEstimationChange,
  onPricingChange,
}) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-gray-700">
          Estimated labour hours
        </span>

        <input
          type="number"
          min="0"
          step="0.5"
          value={estimation?.labourHours ?? ""}
          onChange={(event) =>
            onEstimationChange("labourHours", event.target.value)
          }
          placeholder="e.g. 4"
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-gray-500"
        />

        <p className="mt-2 text-xs text-gray-500">
          Total labour effort, not service duration.
        </p>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-gray-700">
          Estimated price
        </span>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            $
          </span>

          <input
            type="number"
            min="0"
            step="0.01"
            value={estimation?.price ?? ""}
            onChange={(event) =>
              onEstimationChange("price", event.target.value)
            }
            placeholder="0.00"
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-8 pr-4 text-gray-900 outline-none focus:border-gray-500"
          />
        </div>

        <p className="mt-2 text-xs text-gray-500">Internal system estimate.</p>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-gray-700">
          Quoted price
        </span>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            $
          </span>

          <input
            type="number"
            min="0"
            step="0.01"
            value={pricing?.quotedPrice ?? ""}
            onChange={(event) =>
              onPricingChange("quotedPrice", event.target.value)
            }
            placeholder="0.00"
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-8 pr-4 text-gray-900 outline-none focus:border-gray-500"
          />
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Price offered to the customer.
        </p>
      </label>
    </div>
  );
}
