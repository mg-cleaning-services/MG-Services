export default function RequestReview({
  requestType,
  selectedExtras,
  selectedServices,

  propertyDetails,
  serviceDetails,
  customerDetails,

  getSelectedPackageName,
  getServiceNames,

  submitting,
  onSubmit,
}) {
  return (
    <div>
      {/* STEP HEADER */}
      <div className="max-w-2xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#2E7D32]">
          Review
        </p>

        <h2 className="font-heading text-2xl leading-tight text-[#1A1A1A] md:text-3xl">
          Review your cleaning request
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-[#1A1A1A]/60 md:text-base">
          Check the details below before sending your request to MG Cleaning.
        </p>
      </div>

      {/* REQUEST SUMMARY */}
      <div className="mt-9 space-y-4">
        <ServiceSummary
          requestType={requestType}
          selectedExtras={selectedExtras}
          selectedServices={selectedServices}
          getSelectedPackageName={getSelectedPackageName}
          getServiceNames={getServiceNames}
        />

        <PropertySummary property={propertyDetails} />

        <div className="grid gap-4 md:grid-cols-2">
          <ScheduleSummary service={serviceDetails} />

          <ContactSummary customer={customerDetails} />
        </div>

        {serviceDetails.focusAreas && (
          <ReviewSection title="Cleaning Priorities">
            <p className="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-[#1A1A1A]/65">
              {serviceDetails.focusAreas}
            </p>
          </ReviewSection>
        )}
      </div>

      {/* BOOKING NOTICE */}
      <div className="mt-8 flex gap-3 rounded-2xl border border-[#2E7D32]/10 bg-[#E8F5E9]/50 p-5">
        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2E7D32] text-xs font-bold text-white">
          ✓
        </div>

        <div>
          <p className="text-sm font-semibold text-[#1A1A1A]">
            This is a request, not a confirmed booking.
          </p>

          <p className="mt-1 text-sm leading-relaxed text-[#1A1A1A]/55">
            MG Cleaning will review your request and contact you to confirm
            availability and finalise the service details.
          </p>
        </div>
      </div>

      {/* SUBMIT */}
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          disabled={submitting}
          onClick={onSubmit}
          className="rounded-full bg-[#2E7D32] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#256b29] hover:shadow-lg hover:shadow-[#2E7D32]/20 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none"
        >
          {submitting ? "Sending..." : "Send Cleaning Request"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------ */
/* SERVICE                                          */
/* ------------------------------------------------ */

function ServiceSummary({
  requestType,
  selectedExtras,
  selectedServices,
  getSelectedPackageName,
  getServiceNames,
}) {
  return (
    <ReviewSection title="Service">
      {requestType === "package" && (
        <div>
          <p className="font-heading text-xl text-[#1A1A1A]">
            {getSelectedPackageName()}
          </p>

          {selectedExtras.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#1A1A1A]/40">
                Added extras
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {getServiceNames(selectedExtras).map((name) => (
                  <span
                    key={name}
                    className="rounded-full bg-[#E8F5E9] px-3 py-1.5 text-xs font-medium text-[#2E7D32]"
                  >
                    + {name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {requestType === "custom" && (
        <div>
          <p className="font-heading text-xl text-[#1A1A1A]">Custom Cleaning</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {getServiceNames(selectedServices).map((name) => (
              <span
                key={name}
                className="rounded-full bg-[#E8F5E9] px-3 py-1.5 text-xs font-medium text-[#2E7D32]"
              >
                ✓ {name}
              </span>
            ))}
          </div>
        </div>
      )}

      {requestType === "unsure" && (
        <p className="font-heading text-xl text-[#1A1A1A]">Help me choose</p>
      )}
    </ReviewSection>
  );
}

/* ------------------------------------------------ */
/* PROPERTY                                         */
/* ------------------------------------------------ */

function PropertySummary({ property }) {
  return (
    <ReviewSection title="Property">
      <p className="font-heading text-xl capitalize text-[#1A1A1A]">
        {property.propertyType}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
        <DetailItem label="Bedrooms" value={property.bedrooms} />

        <DetailItem label="Bathrooms" value={property.bathrooms} />

        <DetailItem label="Kitchens" value={property.kitchens} />

        <DetailItem label="Balconies" value={property.balconies} />

        <DetailItem label="Laundries" value={property.laundries} />

        <DetailItem label="Floors" value={property.floors} />
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-[#2E7D32]/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#1A1A1A]/40">
            Location
          </p>

          <p className="mt-1 text-sm font-medium text-[#1A1A1A]">
            {property.suburb}
            {property.postcode && ` · ${property.postcode}`}
          </p>
        </div>

        <div className="sm:text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#1A1A1A]/40">
            Pets
          </p>

          <p className="mt-1 text-sm font-medium capitalize text-[#1A1A1A]">
            {property.pets}
          </p>
        </div>
      </div>
    </ReviewSection>
  );
}

/* ------------------------------------------------ */
/* SCHEDULE                                         */
/* ------------------------------------------------ */

function ScheduleSummary({ service }) {
  return (
    <ReviewSection title="Preferred Schedule">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#1A1A1A]/40">
            Preferred date
          </p>

          <p className="mt-1 font-heading text-xl text-[#1A1A1A]">
            {formatDate(service.preferredDate)}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#1A1A1A]/40">
            Preferred time
          </p>

          <p className="mt-1 font-heading text-xl capitalize text-[#1A1A1A]">
            {service.preferredTime}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 border-t border-[#2E7D32]/10 pt-5 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#1A1A1A]/40">
            Property condition
          </p>

          <p className="mt-1 text-sm font-medium text-[#1A1A1A]">
            {formatCondition(service.condition)}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#1A1A1A]/40">
            Last professional clean
          </p>

          <p className="mt-1 text-sm font-medium text-[#1A1A1A]">
            {formatLastClean(service.lastProfessionalClean)}
          </p>
        </div>
      </div>
    </ReviewSection>
  );
}

/* ------------------------------------------------ */
/* CONTACT                                          */
/* ------------------------------------------------ */

function ContactSummary({ customer }) {
  return (
    <ReviewSection title="Contact">
      <p className="font-heading text-xl text-[#1A1A1A]">
        {customer.firstName} {customer.lastName}
      </p>

      <div className="mt-4 grid gap-5 sm:grid-cols-3">
        <DetailItem label="Phone" value={customer.phone} />

        <DetailItem label="Email" value={customer.email || "Not provided"} />

        <DetailItem
          label="Preferred contact"
          value={capitalize(customer.preferredContact)}
        />
      </div>
    </ReviewSection>
  );
}

/* ------------------------------------------------ */
/* SHARED                                           */
/* ------------------------------------------------ */

function ReviewSection({ title, children }) {
  return (
    <section className="rounded-2xl border border-[#2E7D32]/10 bg-[#F9FAF9] p-5 md:p-6">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#2E7D32]">
        {title}
      </p>

      {children}
    </section>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1A1A1A]/40">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-[#1A1A1A]">{value}</p>
    </div>
  );
}

/* ------------------------------------------------ */
/* FORMATTERS                                       */
/* ------------------------------------------------ */

function formatCondition(condition) {
  const labels = {
    maintained: "Well maintained",
    "needs-attention": "Needs some attention",
    heavy: "Needs a thorough clean",
  };

  return labels[condition] || condition;
}

function formatLastClean(value) {
  const labels = {
    "less-than-month": "Less than a month ago",
    "1-3-months": "1–3 months ago",
    "3-6-months": "3–6 months ago",
    "6-plus-months": "More than 6 months ago",
    never: "Never professionally cleaned",
    unsure: "I'm not sure",
  };

  return labels[value] || value;
}

function formatDate(value) {
  if (!value) return "";

  const [year, month, day] = value.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function capitalize(value) {
  if (!value) return "";

  return value.charAt(0).toUpperCase() + value.slice(1);
}
