export default function ServiceSelectionStep({
  packages,
  services,

  requestType,
  selectedPackage,
  selectedServices,
  selectedExtras,

  includedServices,
  availableExtras,

  onSelectPackage,
  onSelectCustom,
  onSelectUnsure,
  onToggleService,
  onToggleExtra,
}) {
  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-gray-500">
          Request a Cleaning
        </p>

        <h1 className="text-4xl font-bold text-gray-900">
          What kind of cleaning are you looking for?
        </h1>

        <p className="mt-4 text-gray-600">
          Choose a package, build your own service, or tell us if you're not
          sure. We'll help you find the right option.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {packages.map((cleaningPackage) => {
          const selected =
            requestType === "package" && selectedPackage === cleaningPackage.id;

          return (
            <button
              key={cleaningPackage.id}
              type="button"
              onClick={() => onSelectPackage(cleaningPackage.id)}
              className={`rounded-2xl border p-6 text-left transition ${
                selected
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 bg-white hover:border-gray-400"
              }`}
            >
              <h2 className="text-xl font-semibold">{cleaningPackage.name}</h2>

              <p
                className={`mt-3 text-sm ${
                  selected ? "text-gray-200" : "text-gray-600"
                }`}
              >
                {cleaningPackage.description}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={onSelectCustom}
          className={`rounded-2xl border p-6 text-left transition ${
            requestType === "custom"
              ? "border-gray-900 bg-gray-900 text-white"
              : "border-gray-200 hover:border-gray-400"
          }`}
        >
          <h2 className="text-lg font-semibold">Build my own service</h2>

          <p className="mt-2 text-sm opacity-70">
            Choose the individual cleaning services you need.
          </p>
        </button>

        <button
          type="button"
          onClick={onSelectUnsure}
          className={`rounded-2xl border p-6 text-left transition ${
            requestType === "unsure"
              ? "border-gray-900 bg-gray-900 text-white"
              : "border-gray-200 hover:border-gray-400"
          }`}
        >
          <h2 className="text-lg font-semibold">I'm not sure what I need</h2>

          <p className="mt-2 text-sm opacity-70">
            Tell us about your home and we'll help recommend the right service.
          </p>
        </button>
      </div>

      {requestType === "package" && selectedPackage && (
        <div className="mt-10 space-y-6">
          <div className="rounded-2xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Included in your package
            </h2>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {includedServices.map((service) => (
                <div key={service.id} className="rounded-xl bg-gray-50 p-4">
                  <p className="font-medium text-gray-900">✓ {service.name}</p>

                  <p className="mt-1 text-sm text-gray-500">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {availableExtras.length > 0 && (
            <div className="rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Add something extra?
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                You can add individual services to your selected package.
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {availableExtras.map((service) => (
                  <label
                    key={service.id}
                    className="flex cursor-pointer gap-3 rounded-xl border border-gray-200 p-4"
                  >
                    <input
                      type="checkbox"
                      checked={selectedExtras.includes(service.id)}
                      onChange={() => onToggleExtra(service.id)}
                    />

                    <div>
                      <p className="font-medium text-gray-900">
                        {service.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {service.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {requestType === "custom" && (
        <div className="mt-10 rounded-2xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Choose your services
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {services.map((service) => (
              <label
                key={service.id}
                className="flex cursor-pointer gap-3 rounded-xl border border-gray-200 p-4"
              >
                <input
                  type="checkbox"
                  checked={selectedServices.includes(service.id)}
                  onChange={() => onToggleService(service.id)}
                />

                <div>
                  <p className="font-medium text-gray-900">{service.name}</p>

                  <p className="mt-1 text-sm text-gray-500">
                    {service.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
