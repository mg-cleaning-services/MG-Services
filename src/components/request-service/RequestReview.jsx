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
    <div className="mt-10 rounded-2xl border border-gray-200 p-6">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
          Step 5
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-gray-900">
          Review your cleaning request
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Check the details below before sending your request to MG Cleaning.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <ServiceSummary
          requestType={requestType}
          selectedExtras={selectedExtras}
          selectedServices={selectedServices}
          getSelectedPackageName={getSelectedPackageName}
          getServiceNames={getServiceNames}
        />

        <PropertySummary property={propertyDetails} />

        <ScheduleSummary service={serviceDetails} />

        <ContactSummary customer={customerDetails} />
      </div>

      {serviceDetails.focusAreas && (
        <div className="mt-6 rounded-xl bg-gray-50 p-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Cleaning priorities
          </p>

          <p className="mt-2 whitespace-pre-line text-sm text-gray-700">
            {serviceDetails.focusAreas}
          </p>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-gray-200 p-4">
        <p className="text-sm text-gray-600">
          This request is not a confirmed booking. MG Cleaning will review the
          information and contact you to discuss the service, confirm
          availability and finalise the details.
        </p>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          disabled={submitting}
          onClick={onSubmit}
          className="rounded-xl bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Send Cleaning Request"}
        </button>
      </div>
    </div>
  );
}

function ServiceSummary({
  requestType,
  selectedExtras,
  selectedServices,
  getSelectedPackageName,
  getServiceNames,
}) {
  return (
    <SummaryCard title="Service">
      {requestType === "package" && (
        <>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            {getSelectedPackageName()}
          </p>

          {selectedExtras.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-500">Extras</p>

              <ul className="mt-1 space-y-1 text-sm text-gray-700">
                {getServiceNames(selectedExtras).map((name) => (
                  <li key={name}>+ {name}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {requestType === "custom" && (
        <>
          <p className="mt-2 text-lg font-semibold text-gray-900">
            Custom Cleaning
          </p>

          <ul className="mt-3 space-y-1 text-sm text-gray-700">
            {getServiceNames(selectedServices).map((name) => (
              <li key={name}>✓ {name}</li>
            ))}
          </ul>
        </>
      )}

      {requestType === "unsure" && (
        <p className="mt-2 text-lg font-semibold text-gray-900">
          Help me choose
        </p>
      )}
    </SummaryCard>
  );
}

function PropertySummary({ property }) {
  return (
    <SummaryCard title="Property">
      <p className="mt-2 text-lg font-semibold capitalize text-gray-900">
        {property.propertyType}
      </p>

      <div className="mt-3 space-y-1 text-sm text-gray-700">
        <p>{property.bedrooms} bedrooms</p>
        <p>{property.bathrooms} bathrooms</p>

        {property.kitchens !== "" && <p>{property.kitchens} kitchens</p>}

        {property.balconies !== "" && <p>{property.balconies} balconies</p>}

        {property.laundries !== "" && <p>{property.laundries} laundries</p>}

        {property.floors && <p>{property.floors} floors</p>}

        <p className="pt-2">
          {property.suburb}
          {property.postcode && ` · ${property.postcode}`}
        </p>
      </div>
    </SummaryCard>
  );
}

function ScheduleSummary({ service }) {
  return (
    <SummaryCard title="Preferred Schedule">
      <p className="mt-2 font-semibold text-gray-900">
        {service.preferredDate}
      </p>

      <p className="mt-1 text-sm capitalize text-gray-700">
        {service.preferredTime}
      </p>
    </SummaryCard>
  );
}

function ContactSummary({ customer }) {
  return (
    <SummaryCard title="Contact">
      <p className="mt-2 font-semibold text-gray-900">
        {customer.firstName} {customer.lastName}
      </p>

      <p className="mt-1 text-sm text-gray-700">{customer.phone}</p>

      {customer.email && (
        <p className="text-sm text-gray-700">{customer.email}</p>
      )}

      <p className="mt-2 text-sm capitalize text-gray-500">
        Preferred contact: {customer.preferredContact}
      </p>
    </SummaryCard>
  );
}

function SummaryCard({ title, children }) {
  return (
    <div className="rounded-xl bg-gray-50 p-5">
      <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </p>

      {children}
    </div>
  );
}
