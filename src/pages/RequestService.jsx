import { useState } from "react";
import {
  getPackages,
  getServices,
  getPackageServices,
} from "@/services/cleaningService";
import { createRequest, getRequests } from "@/services/requestService";

export default function RequestService() {
  const [requests, setRequests] = useState(getRequests());
  const packages = getPackages();
  const services = getServices();

  const [requestType, setRequestType] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [propertyDetails, setPropertyDetails] = useState({
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    kitchens: "",
    balconies: "",
    laundries: "",
    floors: "",
    suburb: "",
    postcode: "",
    pets: "",
  });
  const [serviceDetails, setServiceDetails] = useState({
    preferredDate: "",
    preferredTime: "",
    condition: "",
    lastProfessionalClean: "",
    focusAreas: "",
  });
  const [customerDetails, setCustomerDetails] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    preferredContact: "",
  });
  const hasValidServiceSelection =
    requestType === "package" ||
    requestType === "unsure" ||
    (requestType === "custom" && selectedServices.length > 0);

  const canReview =
    hasValidServiceSelection &&
    propertyDetails.propertyType &&
    propertyDetails.bedrooms !== "" &&
    propertyDetails.bathrooms !== "" &&
    propertyDetails.suburb &&
    serviceDetails.preferredDate &&
    serviceDetails.preferredTime &&
    customerDetails.firstName &&
    customerDetails.phone &&
    customerDetails.preferredContact;
  function updateCustomerField(field, value) {
    setCustomerDetails((current) => ({
      ...current,
      [field]: value,
    }));
  }
  function updateServiceField(field, value) {
    setServiceDetails((current) => ({
      ...current,
      [field]: value,
    }));
  }
  function updatePropertyField(field, value) {
    setPropertyDetails((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function selectPackage(packageId) {
    setRequestType("package");
    setSelectedPackage(packageId);
    setSelectedServices([]);
    setSelectedExtras([]);
  }

  function selectCustom() {
    setRequestType("custom");
    setSelectedPackage("");
    setSelectedServices([]);
    setSelectedExtras([]);
  }

  function selectUnsure() {
    setRequestType("unsure");
    setSelectedPackage("");
    setSelectedServices([]);
    setSelectedExtras([]);
  }

  function toggleService(serviceId) {
    setSelectedServices((current) =>
      current.includes(serviceId)
        ? current.filter((id) => id !== serviceId)
        : [...current, serviceId],
    );
  }

  function toggleExtra(serviceId) {
    setSelectedExtras((current) =>
      current.includes(serviceId)
        ? current.filter((id) => id !== serviceId)
        : [...current, serviceId],
    );
  }
  function getSelectedPackageName() {
    const selected = packages.find(
      (cleaningPackage) => cleaningPackage.id === selectedPackage,
    );

    return selected?.name || "";
  }

  function getServiceNames(serviceIds) {
    return serviceIds
      .map((id) => services.find((service) => service.id === id)?.name)
      .filter(Boolean);
  }
  function buildRequestData() {
    return {
      customer: {
        firstName: customerDetails.firstName.trim(),
        lastName: customerDetails.lastName.trim(),
        phone: customerDetails.phone.trim(),
        email: customerDetails.email.trim(),
        preferredContact: customerDetails.preferredContact,
      },

      service: {
        requestType,
        packageId: requestType === "package" ? selectedPackage : "",
        selectedServices: requestType === "custom" ? selectedServices : [],
        extras: requestType === "package" ? selectedExtras : [],
      },

      property: {
        ...propertyDetails,
      },

      schedule: {
        preferredDate: serviceDetails.preferredDate,
        preferredTime: serviceDetails.preferredTime,
      },

      condition: {
        level: serviceDetails.condition,
        lastProfessionalClean: serviceDetails.lastProfessionalClean,
      },

      notes: serviceDetails.focusAreas.trim(),
    };
  }
  function handleSubmitRequest() {
    const requestData = buildRequestData();

    setRequests((currentRequests) =>
      createRequest(currentRequests, requestData),
    );

    console.log("Request created:", requestData);
  }
  const includedServices = selectedPackage
    ? getPackageServices(selectedPackage)
    : [];

  const includedServiceIds = includedServices.map((service) => service.id);

  const availableExtras = services.filter(
    (service) => !includedServiceIds.includes(service.id),
  );

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-6 py-16">
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
              requestType === "package" &&
              selectedPackage === cleaningPackage.id;

            return (
              <button
                key={cleaningPackage.id}
                type="button"
                onClick={() => selectPackage(cleaningPackage.id)}
                className={`rounded-2xl border p-6 text-left transition ${
                  selected
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
              >
                <h2 className="text-xl font-semibold">
                  {cleaningPackage.name}
                </h2>

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
            onClick={selectCustom}
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
            onClick={selectUnsure}
            className={`rounded-2xl border p-6 text-left transition ${
              requestType === "unsure"
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <h2 className="text-lg font-semibold">I'm not sure what I need</h2>

            <p className="mt-2 text-sm opacity-70">
              Tell us about your home and we'll help recommend the right
              service.
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
                    <p className="font-medium text-gray-900">
                      ✓ {service.name}
                    </p>

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
                        onChange={() => toggleExtra(service.id)}
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
                    onChange={() => toggleService(service.id)}
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
        {requestType && (
          <div className="mt-10 rounded-2xl border border-gray-200 p-6">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                Step 2
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                Tell us about your property
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                This helps us understand the size of the job and prepare a more
                accurate recommendation.
              </p>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Property type
                </label>

                <select
                  value={propertyDetails.propertyType}
                  onChange={(event) =>
                    updatePropertyField("propertyType", event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                >
                  <option value="">Select property type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="office">Office</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Floors
                </label>

                <select
                  value={propertyDetails.floors}
                  onChange={(event) =>
                    updatePropertyField("floors", event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                >
                  <option value="">Select floors</option>
                  <option value="1">1 floor</option>
                  <option value="2">2 floors</option>
                  <option value="3">3 floors</option>
                  <option value="4+">4+ floors</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Bedrooms
                </label>

                <select
                  value={propertyDetails.bedrooms}
                  onChange={(event) =>
                    updatePropertyField("bedrooms", event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                >
                  <option value="">Select bedrooms</option>
                  <option value="0">Studio / 0</option>
                  <option value="1">1 bedroom</option>
                  <option value="2">2 bedrooms</option>
                  <option value="3">3 bedrooms</option>
                  <option value="4">4 bedrooms</option>
                  <option value="5+">5+ bedrooms</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Bathrooms
                </label>

                <select
                  value={propertyDetails.bathrooms}
                  onChange={(event) =>
                    updatePropertyField("bathrooms", event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                >
                  <option value="">Select bathrooms</option>
                  <option value="1">1 bathroom</option>
                  <option value="2">2 bathrooms</option>
                  <option value="3">3 bathrooms</option>
                  <option value="4">4 bathrooms</option>
                  <option value="5+">5+ bathrooms</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Kitchens
                </label>

                <select
                  value={propertyDetails.kitchens}
                  onChange={(event) =>
                    updatePropertyField("kitchens", event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                >
                  <option value="">Select kitchens</option>
                  <option value="0">0</option>
                  <option value="1">1 kitchen</option>
                  <option value="2">2 kitchens</option>
                  <option value="3+">3+ kitchens</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Balconies
                </label>

                <select
                  value={propertyDetails.balconies}
                  onChange={(event) =>
                    updatePropertyField("balconies", event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                >
                  <option value="">Select balconies</option>
                  <option value="0">No balcony</option>
                  <option value="1">1 balcony</option>
                  <option value="2">2 balconies</option>
                  <option value="3+">3+ balconies</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Laundry rooms
                </label>

                <select
                  value={propertyDetails.laundries}
                  onChange={(event) =>
                    updatePropertyField("laundries", event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                >
                  <option value="">Select laundry rooms</option>
                  <option value="0">0</option>
                  <option value="1">1 laundry</option>
                  <option value="2+">2+ laundries</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Suburb
                </label>

                <input
                  type="text"
                  value={propertyDetails.suburb}
                  onChange={(event) =>
                    updatePropertyField("suburb", event.target.value)
                  }
                  placeholder="e.g. South Yarra"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Postcode
                </label>

                <input
                  type="text"
                  value={propertyDetails.postcode}
                  onChange={(event) =>
                    updatePropertyField("postcode", event.target.value)
                  }
                  placeholder="e.g. 3141"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                />
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-medium text-gray-700">
                Are there pets at the property?
              </p>

              <div className="flex gap-3">
                {["yes", "no"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => updatePropertyField("pets", option)}
                    className={`rounded-xl border px-5 py-2.5 capitalize transition ${
                      propertyDetails.pets === option
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 bg-white text-gray-700"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {requestType && (
          <div className="mt-10 rounded-2xl border border-gray-200 p-6">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                Step 3
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                When would you like your cleaning?
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Tell us your preferred date and a little about the current
                condition of the property. We'll confirm availability with you
                before the service is booked.
              </p>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Preferred date
                </label>

                <input
                  type="date"
                  value={serviceDetails.preferredDate}
                  onChange={(event) =>
                    updateServiceField("preferredDate", event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Preferred time
                </label>

                <select
                  value={serviceDetails.preferredTime}
                  onChange={(event) =>
                    updateServiceField("preferredTime", event.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                >
                  <option value="">Select preferred time</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="flexible">I'm flexible</option>
                </select>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm font-medium text-gray-700">
                How would you describe the current condition of the property?
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Don't worry if you're not sure. This just helps us understand
                the amount of work involved.
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {[
                  {
                    value: "maintained",
                    title: "Well maintained",
                    description:
                      "Cleaned regularly and mainly needs maintenance.",
                  },
                  {
                    value: "needs-attention",
                    title: "Needs some attention",
                    description: "Some areas need more detailed cleaning.",
                  },
                  {
                    value: "heavy",
                    title: "Needs a thorough clean",
                    description:
                      "Significant buildup or several areas need attention.",
                  },
                ].map((option) => {
                  const selected = serviceDetails.condition === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        updateServiceField("condition", option.value)
                      }
                      className={`rounded-xl border p-4 text-left transition ${
                        selected
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 bg-white hover:border-gray-400"
                      }`}
                    >
                      <p className="font-medium">{option.title}</p>

                      <p
                        className={`mt-2 text-sm ${
                          selected ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                When was the property last professionally cleaned?
              </label>

              <select
                value={serviceDetails.lastProfessionalClean}
                onChange={(event) =>
                  updateServiceField(
                    "lastProfessionalClean",
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 md:max-w-md"
              >
                <option value="">Select an option</option>
                <option value="less-than-month">Less than a month ago</option>
                <option value="1-3-months">1–3 months ago</option>
                <option value="3-6-months">3–6 months ago</option>
                <option value="6-plus-months">More than 6 months ago</option>
                <option value="never">Never professionally cleaned</option>
                <option value="unsure">I'm not sure</option>
              </select>
            </div>

            <div className="mt-8">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                What would you like us to focus on?
              </label>

              <p className="mb-3 text-sm text-gray-500">
                Tell us about any areas that need extra attention or anything
                else that would help us understand the job.
              </p>

              <textarea
                rows={5}
                value={serviceDetails.focusAreas}
                onChange={(event) =>
                  updateServiceField("focusAreas", event.target.value)
                }
                placeholder="For example: the kitchen needs extra attention, there are stains on the carpet, the bathrooms haven't been deep cleaned recently..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>
          </div>
        )}
        {requestType && (
          <div className="mt-10 rounded-2xl border border-gray-200 p-6">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                Step 4
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                How can we contact you?
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                We'll use these details to discuss your request, answer any
                questions and confirm the service with you.
              </p>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  First name
                </label>

                <input
                  type="text"
                  value={customerDetails.firstName}
                  onChange={(event) =>
                    updateCustomerField("firstName", event.target.value)
                  }
                  placeholder="John"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Last name
                </label>

                <input
                  type="text"
                  value={customerDetails.lastName}
                  onChange={(event) =>
                    updateCustomerField("lastName", event.target.value)
                  }
                  placeholder="Smith"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone number
                </label>

                <input
                  type="tel"
                  value={customerDetails.phone}
                  onChange={(event) =>
                    updateCustomerField("phone", event.target.value)
                  }
                  placeholder="04XX XXX XXX"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  value={customerDetails.email}
                  onChange={(event) =>
                    updateCustomerField("email", event.target.value)
                  }
                  placeholder="john@email.com"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3"
                />
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm font-medium text-gray-700">
                How would you prefer us to contact you?
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    value: "whatsapp",
                    title: "WhatsApp",
                    description: "Message me on WhatsApp",
                  },
                  {
                    value: "phone",
                    title: "Phone",
                    description: "Give me a call",
                  },
                  {
                    value: "email",
                    title: "Email",
                    description: "Contact me by email",
                  },
                ].map((option) => {
                  const selected =
                    customerDetails.preferredContact === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        updateCustomerField("preferredContact", option.value)
                      }
                      className={`rounded-xl border p-4 text-left transition ${
                        selected
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 bg-white hover:border-gray-400"
                      }`}
                    >
                      <p className="font-medium">{option.title}</p>

                      <p
                        className={`mt-1 text-sm ${
                          selected ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-600">
                Sending this request does not confirm a booking. MG Cleaning
                will contact you to review the details, recommend the
                appropriate service if needed, and confirm availability.
              </p>
            </div>
          </div>
        )}
        {canReview && (
          <div className="mt-10 rounded-2xl border border-gray-200 p-6">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                Step 5
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                Review your cleaning request
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Check the details below before sending your request to MG
                Cleaning.
              </p>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Service
                </p>

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
              </div>

              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Property
                </p>

                <p className="mt-2 text-lg font-semibold capitalize text-gray-900">
                  {propertyDetails.propertyType}
                </p>

                <div className="mt-3 space-y-1 text-sm text-gray-700">
                  <p>{propertyDetails.bedrooms} bedrooms</p>
                  <p>{propertyDetails.bathrooms} bathrooms</p>

                  {propertyDetails.kitchens !== "" && (
                    <p>{propertyDetails.kitchens} kitchens</p>
                  )}

                  {propertyDetails.balconies !== "" && (
                    <p>{propertyDetails.balconies} balconies</p>
                  )}

                  {propertyDetails.laundries !== "" && (
                    <p>{propertyDetails.laundries} laundries</p>
                  )}

                  {propertyDetails.floors && (
                    <p>{propertyDetails.floors} floors</p>
                  )}

                  <p className="pt-2">
                    {propertyDetails.suburb}
                    {propertyDetails.postcode &&
                      ` · ${propertyDetails.postcode}`}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Preferred Schedule
                </p>

                <p className="mt-2 font-semibold text-gray-900">
                  {serviceDetails.preferredDate}
                </p>

                <p className="mt-1 capitalize text-sm text-gray-700">
                  {serviceDetails.preferredTime}
                </p>
              </div>

              <div className="rounded-xl bg-gray-50 p-5">
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Contact
                </p>

                <p className="mt-2 font-semibold text-gray-900">
                  {customerDetails.firstName} {customerDetails.lastName}
                </p>

                <p className="mt-1 text-sm text-gray-700">
                  {customerDetails.phone}
                </p>

                {customerDetails.email && (
                  <p className="text-sm text-gray-700">
                    {customerDetails.email}
                  </p>
                )}

                <p className="mt-2 text-sm capitalize text-gray-500">
                  Preferred contact: {customerDetails.preferredContact}
                </p>
              </div>
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
                This request is not a confirmed booking. MG Cleaning will review
                the information and contact you to discuss the service, confirm
                availability and finalise the details.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSubmitRequest}
                className="rounded-xl bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800"
              >
                Send Cleaning Request
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
