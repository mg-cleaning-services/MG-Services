import {
  Check,
  CheckCircle2,
  HelpCircle,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

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
    <div>
      {/* STEP HEADER */}
      <div className="max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#2E7D32]">
          Cleaning Service
        </p>

        <h2 className="font-heading text-2xl leading-tight text-[#1A1A1A] md:text-3xl">
          What kind of cleaning are you looking for?
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]/60 md:text-base">
          Choose one of our cleaning packages, build your own service, or tell
          us if you're not sure. We'll help you find the right option.
        </p>
      </div>

      {/* PACKAGES */}
      <div className="mt-10">
        <p className="mb-4 text-sm font-semibold text-[#1A1A1A]">
          Choose a cleaning package
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {packages.map((cleaningPackage) => {
            const selected =
              requestType === "package" &&
              selectedPackage === cleaningPackage.id;

            return (
              <button
                key={cleaningPackage.id}
                type="button"
                onClick={() => onSelectPackage(cleaningPackage.id)}
                className={`group relative min-h-[190px] overflow-hidden rounded-3xl border p-6 text-left transition-all duration-300 ${
                  selected
                    ? "border-[#2E7D32] bg-[#2E7D32] text-white shadow-lg shadow-[#2E7D32]/15"
                    : "border-[#2E7D32]/10 bg-[#F9FAF9] text-[#1A1A1A] hover:-translate-y-0.5 hover:border-[#2E7D32]/25 hover:shadow-lg hover:shadow-[#2E7D32]/5"
                }`}
              >
                <div
                  className={`mb-6 flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                    selected ? "bg-white/15" : "bg-[#E8F5E9]"
                  }`}
                >
                  {selected ? (
                    <Check className="h-5 w-5 text-white" />
                  ) : (
                    <Sparkles className="h-5 w-5 text-[#2E7D32]" />
                  )}
                </div>

                <h3 className="font-heading text-xl">{cleaningPackage.name}</h3>

                <p
                  className={`mt-3 text-sm leading-relaxed ${
                    selected ? "text-white/70" : "text-[#1A1A1A]/55"
                  }`}
                >
                  {cleaningPackage.description}
                </p>

                {selected && (
                  <div className="absolute right-5 top-5">
                    <CheckCircle2 className="h-5 w-5 text-white/80" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ALTERNATIVE OPTIONS */}
      <div className="mt-8 border-t border-[#2E7D32]/10 pt-8">
        <p className="mb-4 text-sm text-[#1A1A1A]/50">
          Or choose another way to build your request
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <button
            type="button"
            onClick={onSelectCustom}
            className={`group flex items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-300 ${
              requestType === "custom"
                ? "border-[#2E7D32] bg-[#E8F5E9]"
                : "border-[#2E7D32]/10 bg-white hover:border-[#2E7D32]/25 hover:shadow-md hover:shadow-[#2E7D32]/5"
            }`}
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                requestType === "custom"
                  ? "bg-[#2E7D32] text-white"
                  : "bg-[#E8F5E9] text-[#2E7D32]"
              }`}
            >
              <SlidersHorizontal className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[#1A1A1A]">
                  Build my own service
                </h3>

                {requestType === "custom" && (
                  <CheckCircle2 className="h-4 w-4 text-[#2E7D32]" />
                )}
              </div>

              <p className="mt-1 text-sm leading-relaxed text-[#1A1A1A]/55">
                Choose the individual cleaning services you need.
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={onSelectUnsure}
            className={`group flex items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-300 ${
              requestType === "unsure"
                ? "border-[#2E7D32] bg-[#E8F5E9]"
                : "border-[#2E7D32]/10 bg-white hover:border-[#2E7D32]/25 hover:shadow-md hover:shadow-[#2E7D32]/5"
            }`}
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                requestType === "unsure"
                  ? "bg-[#2E7D32] text-white"
                  : "bg-[#E8F5E9] text-[#2E7D32]"
              }`}
            >
              <HelpCircle className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[#1A1A1A]">
                  I'm not sure what I need
                </h3>

                {requestType === "unsure" && (
                  <CheckCircle2 className="h-4 w-4 text-[#2E7D32]" />
                )}
              </div>

              <p className="mt-1 text-sm leading-relaxed text-[#1A1A1A]/55">
                Tell us about your home and we'll help recommend the right
                service.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* PACKAGE DETAILS */}
      {requestType === "package" && selectedPackage && (
        <div className="mt-10 space-y-6">
          {/* INCLUDED SERVICES */}
          <div className="rounded-3xl bg-[#F9FAF9] p-6 md:p-8">
            <div>
              <p className="text-sm font-semibold text-[#1A1A1A]">
                Included in your package
              </p>

              <p className="mt-1 text-sm text-[#1A1A1A]/50">
                These services are already included in the package you selected.
              </p>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {includedServices.map((service) => (
                <div
                  key={service.id}
                  className="flex gap-3 rounded-2xl bg-white p-4"
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9]">
                    <Check className="h-3.5 w-3.5 text-[#2E7D32]" />
                  </div>

                  <div>
                    <p className="font-medium text-[#1A1A1A]">{service.name}</p>

                    <p className="mt-1 text-sm leading-relaxed text-[#1A1A1A]/50">
                      {service.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EXTRAS */}
          {availableExtras.length > 0 && (
            <div>
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A]">
                  Add something extra?
                </p>

                <p className="mt-1 text-sm text-[#1A1A1A]/50">
                  Optional services can be added to your selected package.
                </p>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {availableExtras.map((service) => {
                  const selected = selectedExtras.includes(service.id);

                  return (
                    <label
                      key={service.id}
                      className={`flex cursor-pointer gap-4 rounded-2xl border p-4 transition-all duration-300 ${
                        selected
                          ? "border-[#2E7D32] bg-[#E8F5E9]"
                          : "border-[#2E7D32]/10 bg-white hover:border-[#2E7D32]/25"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => onToggleExtra(service.id)}
                        className="sr-only"
                      />

                      <div
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                          selected
                            ? "border-[#2E7D32] bg-[#2E7D32]"
                            : "border-[#1A1A1A]/20 bg-white"
                        }`}
                      >
                        {selected && (
                          <Check className="h-3.5 w-3.5 text-white" />
                        )}
                      </div>

                      <div>
                        <p className="font-medium text-[#1A1A1A]">
                          {service.name}
                        </p>

                        <p className="mt-1 text-sm leading-relaxed text-[#1A1A1A]/50">
                          {service.description}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CUSTOM SERVICES */}
      {requestType === "custom" && (
        <div className="mt-10">
          <div>
            <p className="text-sm font-semibold text-[#1A1A1A]">
              Choose your services
            </p>

            <p className="mt-1 text-sm text-[#1A1A1A]/50">
              Select everything you'd like us to include in your cleaning
              request.
            </p>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {services.map((service) => {
              const selected = selectedServices.includes(service.id);

              return (
                <label
                  key={service.id}
                  className={`flex cursor-pointer gap-4 rounded-2xl border p-4 transition-all duration-300 ${
                    selected
                      ? "border-[#2E7D32] bg-[#E8F5E9]"
                      : "border-[#2E7D32]/10 bg-white hover:border-[#2E7D32]/25"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggleService(service.id)}
                    className="sr-only"
                  />

                  <div
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      selected
                        ? "border-[#2E7D32] bg-[#2E7D32]"
                        : "border-[#1A1A1A]/20 bg-white"
                    }`}
                  >
                    {selected && <Check className="h-3.5 w-3.5 text-white" />}
                  </div>

                  <div>
                    <p className="font-medium text-[#1A1A1A]">{service.name}</p>

                    <p className="mt-1 text-sm leading-relaxed text-[#1A1A1A]/50">
                      {service.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
