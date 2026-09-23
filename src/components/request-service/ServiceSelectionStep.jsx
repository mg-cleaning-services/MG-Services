import { useMemo, useRef } from "react";
import {
  ArrowRight,
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
  const carouselRef = useRef(null);

  const mouseDragRef = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
  });

  /*
  |--------------------------------------------------------------------------
  | PACKAGE ORDER
  |--------------------------------------------------------------------------
  */

  const orderedPackages = useMemo(() => {
    const order = ["end-of-lease", "regular", "deep", "premium", "deluxe"];

    return [...packages].sort((a, b) => {
      const aIndex = order.indexOf(a.slug);
      const bIndex = order.indexOf(b.slug);

      const safeAIndex = aIndex === -1 ? order.length : aIndex;
      const safeBIndex = bIndex === -1 ? order.length : bIndex;

      return safeAIndex - safeBIndex;
    });
  }, [packages]);

  /*
  |--------------------------------------------------------------------------
  | MOUSE DRAG
  |--------------------------------------------------------------------------
  */

  function handleMouseDown(event) {
    const carousel = carouselRef.current;

    if (!carousel) return;

    mouseDragRef.current = {
      isDown: true,
      startX: event.pageX,
      scrollLeft: carousel.scrollLeft,
    };
  }

  function handleMouseMove(event) {
    const carousel = carouselRef.current;

    if (!carousel || !mouseDragRef.current.isDown) return;

    event.preventDefault();

    const distance = event.pageX - mouseDragRef.current.startX;

    carousel.scrollLeft = mouseDragRef.current.scrollLeft - distance;
  }

  function handleMouseUp() {
    mouseDragRef.current.isDown = false;
  }

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
        <div className="mb-5">
          <p className="text-sm font-semibold text-[#1A1A1A]">
            Choose one cleaning package
          </p>

          <p className="mt-1 text-sm text-[#1A1A1A]/45">
            Select one option. You can change your selection at any time.
          </p>
        </div>

        {/* CAROUSEL VIEWPORT */}
        <div className="relative">
          <div
            ref={carouselRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="
              flex
              cursor-grab
              snap-x
              snap-mandatory
              gap-5
              overflow-x-auto
              pb-5
              select-none
              active:cursor-grabbing
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          >
            {orderedPackages.map((cleaningPackage) => {
              const selected =
                requestType === "package" &&
                selectedPackage === cleaningPackage.id;

              const packageServices = cleaningPackage.includedServices || [];

              const previewServices = packageServices.slice(0, 3);

              const remainingServices =
                packageServices.length - previewServices.length;

              const isEndOfLease = cleaningPackage.slug === "end-of-lease";

              return (
                <button
                  data-package-card
                  key={cleaningPackage.id}
                  type="button"
                  onClick={() => onSelectPackage(cleaningPackage.id)}
                  className={`group relative flex shrink-0 basis-[86%] snap-start flex-col overflow-hidden rounded-3xl border text-left transition-all duration-300 sm:basis-[62%] md:basis-[44%] lg:basis-[31%] ${
                    selected
                      ? "border-[#2E7D32] bg-[#2E7D32] shadow-xl shadow-[#2E7D32]/15"
                      : "border-[#2E7D32]/10 bg-white hover:-translate-y-0.5 hover:border-[#2E7D32]/30 hover:shadow-lg hover:shadow-[#2E7D32]/5"
                  }`}
                >
                  {/* IMAGE */}
                  <div className="relative h-44 w-full shrink-0 overflow-hidden bg-[#E8F5E9]">
                    {cleaningPackage.image_url ? (
                      <img
                        src={cleaningPackage.image_url}
                        alt=""
                        draggable="false"
                        className="pointer-events-none h-full w-full select-none object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Sparkles className="h-7 w-7 text-[#2E7D32]/40" />
                      </div>
                    )}

                    {/* IMAGE GRADIENT */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />

                    {/* SELECT INDICATOR */}
                    <div
                      className={`absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-md transition ${
                        selected
                          ? "border-white/60 bg-[#2E7D32] text-white"
                          : "border-white/60 bg-white/80 text-[#1A1A1A]/40"
                      }`}
                    >
                      {selected ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <div className="h-2.5 w-2.5 rounded-full border border-current" />
                      )}
                    </div>
                  </div>

                  {/* CARD CONTENT */}
                  <div className="flex flex-1 flex-col p-6">
                    <div>
                      <h3
                        className={`font-heading text-xl ${
                          selected ? "text-white" : "text-[#1A1A1A]"
                        }`}
                      >
                        {cleaningPackage.name}
                      </h3>

                      <p
                        className={`mt-3 min-h-[66px] text-sm leading-relaxed ${
                          selected ? "text-white/70" : "text-[#1A1A1A]/55"
                        }`}
                      >
                        {cleaningPackage.web_description ||
                          cleaningPackage.description}
                      </p>
                    </div>

                    {/* PREVIEW SERVICES */}
                    {previewServices.length > 0 && (
                      <div className="mt-5 space-y-2.5">
                        {previewServices.map((service) => (
                          <div
                            key={service.id}
                            className="flex items-center gap-2.5"
                          >
                            <div
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                                selected ? "bg-white/15" : "bg-[#E8F5E9]"
                              }`}
                            >
                              <Check
                                className={`h-3 w-3 ${
                                  selected ? "text-white" : "text-[#2E7D32]"
                                }`}
                              />
                            </div>

                            <span
                              className={`text-sm ${
                                selected ? "text-white/80" : "text-[#1A1A1A]/65"
                              }`}
                            >
                              {service.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* END OF LEASE */}
                    {isEndOfLease && packageServices.length === 0 && (
                      <div
                        className={`mt-5 rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                          selected
                            ? "bg-white/10 text-white/75"
                            : "bg-[#E8F5E9]/70 text-[#1A1A1A]/60"
                        }`}
                      >
                        Full vacate cleaning tailored to the property and
                        inspection requirements.
                      </div>
                    )}

                    {/* MORE SERVICES */}
                    {remainingServices > 0 && (
                      <div className="mt-auto pt-6">
                        <div
                          className={`relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                            selected
                              ? "border-white/25 bg-white/10 text-white shadow-[0_0_22px_rgba(255,255,255,0.16)]"
                              : "border-[#2E7D32]/30 bg-[#E8F5E9] text-[#2E7D32] shadow-[0_0_22px_rgba(46,125,50,0.20)]"
                          }`}
                        >
                          <span
                            className={`absolute inset-0 animate-pulse rounded-full ${
                              selected ? "bg-white/5" : "bg-[#66BB6A]/10"
                            }`}
                          />

                          <Sparkles className="relative h-4 w-4" />

                          <span className="relative">
                            +{remainingServices} more included
                          </span>

                          <ArrowRight className="relative h-3.5 w-3.5" />
                        </div>
                      </div>
                    )}

                    {/* SELECTED TEXT */}
                    <div
                      className={`mt-6 flex items-center gap-2 border-t pt-4 text-xs font-semibold uppercase tracking-[0.12em] ${
                        selected
                          ? "border-white/15 text-white/75"
                          : "border-[#1A1A1A]/5 text-[#1A1A1A]/35"
                      }`}
                    >
                      {selected ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Selected
                        </>
                      ) : (
                        <>Select package</>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT EDGE DISCOVERY FADE */}
          <div className="pointer-events-none absolute bottom-5 right-0 top-0 w-10 bg-gradient-to-l from-white/90 to-transparent md:w-14" />
        </div>

        {/* DRAG / SWIPE HINT */}
        <div className="mt-1 flex items-center justify-center gap-2">
          <ArrowRight className="h-3.5 w-3.5 text-[#2E7D32]/50" />

          <span className="text-xs text-[#1A1A1A]/40">
            Drag or swipe to explore all packages
          </span>
        </div>
      </div>

      {/* ALTERNATIVE OPTIONS */}
      <div className="mt-8 border-t border-[#2E7D32]/10 pt-8">
        <div className="mb-5 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#2E7D32]/10" />

          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1A1A1A]/35">
            Or
          </span>

          <div className="h-px flex-1 bg-[#2E7D32]/10" />
        </div>

        <p className="mb-4 text-sm text-[#1A1A1A]/50">
          Other ways to create your request
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

            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-[#1A1A1A]">
                  Build my own service
                </h3>

                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                    requestType === "custom"
                      ? "border-[#2E7D32] bg-[#2E7D32]"
                      : "border-[#1A1A1A]/20"
                  }`}
                >
                  {requestType === "custom" && (
                    <Check className="h-3.5 w-3.5 text-white" />
                  )}
                </div>
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

            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-[#1A1A1A]">
                  I'm not sure what I need
                </h3>

                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                    requestType === "unsure"
                      ? "border-[#2E7D32] bg-[#2E7D32]"
                      : "border-[#1A1A1A]/20"
                  }`}
                >
                  {requestType === "unsure" && (
                    <Check className="h-3.5 w-3.5 text-white" />
                  )}
                </div>
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
          {includedServices.length > 0 && (
            <div className="rounded-3xl bg-[#F9FAF9] p-6 md:p-8">
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A]">
                  Included in your package
                </p>

                <p className="mt-1 text-sm text-[#1A1A1A]/50">
                  These services are already included in the package you
                  selected.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {includedServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex gap-3 rounded-2xl bg-white p-4"
                  >
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8F5E9]">
                      <Check className="h-3.5 w-3.5 text-[#2E7D32]" />
                    </div>

                    <div>
                      <p className="font-medium text-[#1A1A1A]">
                        {service.name}
                      </p>

                      {service.description && (
                        <p className="mt-1 text-sm leading-relaxed text-[#1A1A1A]/50">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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

                        {service.description && (
                          <p className="mt-1 text-sm leading-relaxed text-[#1A1A1A]/50">
                            {service.description}
                          </p>
                        )}
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

                    {service.description && (
                      <p className="mt-1 text-sm leading-relaxed text-[#1A1A1A]/50">
                        {service.description}
                      </p>
                    )}
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
