import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getRequestById, updateRequest } from "@/services/requestService";
import { getPackages, getServices } from "@/services/cleaningService";
import { useNavigate } from "react-router-dom";
import { createJob, getJobs } from "@/services/jobService";

export default function RequestDetail() {
  const { id } = useParams();

  const originalRequest = getRequestById(id);
  const packages = getPackages();
  const services = getServices();

  const [request, setRequest] = useState(originalRequest);
  const navigate = useNavigate();

  const [jobs, setJobs] = useState(getJobs());

  const [jobDetails, setJobDetails] = useState({
    date: request?.schedule?.preferredDate || "",
    startTime: "",
    estimatedHours: "",
    finalPrice: "",
  });
  const [jobLocation, setJobLocation] = useState({
    address: "",
    unit: "",
  });

  const [jobAccess, setJobAccess] = useState({
    instructions: "",
    parking: "",
    contactOnArrival: false,
  });
  function updateJobLocation(field, value) {
    setJobLocation((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateJobAccess(field, value) {
    setJobAccess((current) => ({
      ...current,
      [field]: value,
    }));
  }
  function updateJobDetail(field, value) {
    setJobDetails((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleConvertToJob() {
    if (
      !jobDetails.date ||
      !jobDetails.startTime ||
      !jobDetails.estimatedHours ||
      !jobLocation.address.trim()
    ) {
      alert(
        "Please enter the confirmed date, start time, estimated duration and service address.",
      );

      return;
    }

    const jobData = {
      requestId: request.id,

      customer: {
        ...request.customer,
      },

      service: {
        ...request.service,
      },

      property: {
        ...request.property,
      },
      location: {
        address: jobLocation.address.trim(),
        unit: jobLocation.unit.trim(),
        suburb: request.property.suburb,
        postcode: request.property.postcode,
      },

      access: {
        instructions: jobAccess.instructions.trim(),
        parking: jobAccess.parking.trim(),
        contactOnArrival: jobAccess.contactOnArrival,
      },

      schedule: {
        date: jobDetails.date,
        startTime: jobDetails.startTime,
        estimatedHours: Number(jobDetails.estimatedHours),
      },

      pricing: {
        estimatedPrice: null,
        finalPrice: jobDetails.finalPrice
          ? Number(jobDetails.finalPrice)
          : null,
      },

      assignedEmployeeId: null,

      notes: request.notes,

      status: "unassigned",
    };

    const nextJobs = createJob(jobs, jobData);

    setJobs(nextJobs);

    console.log("Job created:", nextJobs[nextJobs.length - 1]);

    setRequest((current) => ({
      ...current,
      status: "converted",
    }));

    navigate("/admin/jobs");
  }
  if (!request) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-4xl px-6 py-16">
          <h1 className="text-3xl font-bold text-gray-900">
            Request not found
          </h1>

          <Link
            to="/admin/requests"
            className="mt-6 inline-block text-sm font-medium text-gray-700"
          >
            ← Back to Requests
          </Link>
        </section>
      </main>
    );
  }

  function updateCustomerField(field, value) {
    setRequest((current) => ({
      ...current,
      customer: {
        ...current.customer,
        [field]: value,
      },
    }));
  }

  function updatePropertyField(field, value) {
    setRequest((current) => ({
      ...current,
      property: {
        ...current.property,
        [field]: value,
      },
    }));
  }

  function updateScheduleField(field, value) {
    setRequest((current) => ({
      ...current,
      schedule: {
        ...current.schedule,
        [field]: value,
      },
    }));
  }

  function updateConditionField(field, value) {
    setRequest((current) => ({
      ...current,
      condition: {
        ...current.condition,
        [field]: value,
      },
    }));
  }

  function updateServiceField(field, value) {
    setRequest((current) => ({
      ...current,
      service: {
        ...current.service,
        [field]: value,
      },
    }));
  }

  function toggleService(serviceId) {
    setRequest((current) => {
      const selected = current.service.selectedServices || [];

      const nextSelected = selected.includes(serviceId)
        ? selected.filter((id) => id !== serviceId)
        : [...selected, serviceId];

      return {
        ...current,
        service: {
          ...current.service,
          selectedServices: nextSelected,
        },
      };
    });
  }

  function toggleExtra(serviceId) {
    setRequest((current) => {
      const extras = current.service.extras || [];

      const nextExtras = extras.includes(serviceId)
        ? extras.filter((id) => id !== serviceId)
        : [...extras, serviceId];

      return {
        ...current,
        service: {
          ...current.service,
          extras: nextExtras,
        },
      };
    });
  }

  function handlePackageChange(packageId) {
    setRequest((current) => ({
      ...current,
      service: {
        ...current.service,
        requestType: "package",
        packageId,
        selectedServices: [],
        extras: [],
      },
    }));
  }

  function handleRequestTypeChange(requestType) {
    setRequest((current) => ({
      ...current,
      service: {
        ...current.service,
        requestType,
        packageId: requestType === "package" ? current.service.packageId : "",
        selectedServices:
          requestType === "custom"
            ? current.service.selectedServices || []
            : [],
        extras: requestType === "package" ? current.service.extras || [] : [],
      },
    }));
  }

  function handleSave() {
    const updatedRequests = updateRequest([originalRequest], request);

    console.log("Updated Request:", updatedRequests[0]);
  }

  const includedServiceIds = useMemo(() => {
    if (
      request.service.requestType !== "package" ||
      !request.service.packageId
    ) {
      return [];
    }

    const selectedPackage = packages.find(
      (cleaningPackage) => cleaningPackage.id === request.service.packageId,
    );

    return selectedPackage?.includedServices || [];
  }, [request.service.requestType, request.service.packageId, packages]);

  const availableExtras = services.filter(
    (service) => !includedServiceIds.includes(service.id),
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link to="/admin/requests" className="text-sm text-gray-500">
              ← Back to Requests
            </Link>

            <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-gray-500">
              {request.id}
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {request.customer.firstName} {request.customer.lastName}
            </h1>
          </div>

          <select
            value={request.status}
            onChange={(event) =>
              setRequest((current) => ({
                ...current,
                status: event.target.value,
              }))
            }
            className="rounded-xl border border-gray-300 bg-white px-4 py-3"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="in-discussion">In Discussion</option>
            <option value="converted">Converted</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="mt-10 space-y-8">
          <Section title="Customer">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="First name"
                value={request.customer.firstName}
                onChange={(value) => updateCustomerField("firstName", value)}
              />

              <Input
                label="Last name"
                value={request.customer.lastName}
                onChange={(value) => updateCustomerField("lastName", value)}
              />

              <Input
                label="Phone"
                value={request.customer.phone}
                onChange={(value) => updateCustomerField("phone", value)}
              />

              <Input
                label="Email"
                value={request.customer.email}
                onChange={(value) => updateCustomerField("email", value)}
              />

              <Select
                label="Preferred contact"
                value={request.customer.preferredContact}
                onChange={(value) =>
                  updateCustomerField("preferredContact", value)
                }
                options={[
                  ["whatsapp", "WhatsApp"],
                  ["phone", "Phone"],
                  ["email", "Email"],
                ]}
              />
            </div>
          </Section>

          <Section title="Service">
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="Request type"
                value={request.service.requestType}
                onChange={handleRequestTypeChange}
                options={[
                  ["package", "Package"],
                  ["custom", "Custom Cleaning"],
                  ["unsure", "Needs Recommendation"],
                ]}
              />

              {request.service.requestType === "package" && (
                <Select
                  label="Package"
                  value={request.service.packageId}
                  onChange={handlePackageChange}
                  options={packages.map((item) => [item.id, item.name])}
                />
              )}
            </div>

            {request.service.requestType === "package" && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700">
                  Additional services
                </p>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {availableExtras.map((service) => (
                    <CheckboxCard
                      key={service.id}
                      label={service.name}
                      checked={
                        request.service.extras?.includes(service.id) || false
                      }
                      onChange={() => toggleExtra(service.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {request.service.requestType === "custom" && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700">
                  Selected services
                </p>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {services.map((service) => (
                    <CheckboxCard
                      key={service.id}
                      label={service.name}
                      checked={
                        request.service.selectedServices?.includes(
                          service.id,
                        ) || false
                      }
                      onChange={() => toggleService(service.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </Section>

          <Section title="Property">
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="Property type"
                value={request.property.propertyType}
                onChange={(value) => updatePropertyField("propertyType", value)}
                options={[
                  ["apartment", "Apartment"],
                  ["house", "House"],
                  ["townhouse", "Townhouse"],
                  ["office", "Office"],
                  ["other", "Other"],
                ]}
              />

              <Input
                label="Floors"
                value={request.property.floors}
                onChange={(value) => updatePropertyField("floors", value)}
              />

              <Input
                label="Bedrooms"
                value={request.property.bedrooms}
                onChange={(value) => updatePropertyField("bedrooms", value)}
              />

              <Input
                label="Bathrooms"
                value={request.property.bathrooms}
                onChange={(value) => updatePropertyField("bathrooms", value)}
              />

              <Input
                label="Kitchens"
                value={request.property.kitchens}
                onChange={(value) => updatePropertyField("kitchens", value)}
              />

              <Input
                label="Balconies"
                value={request.property.balconies}
                onChange={(value) => updatePropertyField("balconies", value)}
              />

              <Input
                label="Laundries"
                value={request.property.laundries}
                onChange={(value) => updatePropertyField("laundries", value)}
              />

              <Input
                label="Suburb"
                value={request.property.suburb}
                onChange={(value) => updatePropertyField("suburb", value)}
              />

              <Input
                label="Postcode"
                value={request.property.postcode}
                onChange={(value) => updatePropertyField("postcode", value)}
              />

              <Select
                label="Pets"
                value={request.property.pets}
                onChange={(value) => updatePropertyField("pets", value)}
                options={[
                  ["yes", "Yes"],
                  ["no", "No"],
                ]}
              />
            </div>
          </Section>

          <Section title="Preferred Schedule">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                type="date"
                label="Preferred date"
                value={request.schedule.preferredDate}
                onChange={(value) =>
                  updateScheduleField("preferredDate", value)
                }
              />

              <Select
                label="Preferred time"
                value={request.schedule.preferredTime}
                onChange={(value) =>
                  updateScheduleField("preferredTime", value)
                }
                options={[
                  ["morning", "Morning"],
                  ["afternoon", "Afternoon"],
                  ["evening", "Evening"],
                  ["flexible", "Flexible"],
                ]}
              />
            </div>
          </Section>

          <Section title="Property Condition">
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="Condition"
                value={request.condition.level}
                onChange={(value) => updateConditionField("level", value)}
                options={[
                  ["maintained", "Well Maintained"],
                  ["needs-attention", "Needs Some Attention"],
                  ["heavy", "Needs a Thorough Clean"],
                ]}
              />

              <Select
                label="Last professional clean"
                value={request.condition.lastProfessionalClean}
                onChange={(value) =>
                  updateConditionField("lastProfessionalClean", value)
                }
                options={[
                  ["less-than-month", "Less Than a Month"],
                  ["1-3-months", "1–3 Months"],
                  ["3-6-months", "3–6 Months"],
                  ["6-plus-months", "6+ Months"],
                  ["never", "Never"],
                  ["unsure", "Unsure"],
                ]}
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Notes / cleaning priorities
              </label>

              <textarea
                rows={5}
                value={request.notes}
                onChange={(event) =>
                  setRequest((current) => ({
                    ...current,
                    notes: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>
          </Section>
        </div>
        <Section title="Confirmed Job Details">
          <p className="mb-5 text-sm text-gray-500">
            Complete the details agreed with the customer before converting this
            request into a job.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              type="date"
              label="Confirmed date"
              value={jobDetails.date}
              onChange={(value) => updateJobDetail("date", value)}
            />

            <Input
              type="time"
              label="Start time"
              value={jobDetails.startTime}
              onChange={(value) => updateJobDetail("startTime", value)}
            />

            <Input
              type="number"
              label="Estimated hours"
              value={jobDetails.estimatedHours}
              onChange={(value) => updateJobDetail("estimatedHours", value)}
            />

            <Input
              type="number"
              label="Final price"
              value={jobDetails.finalPrice}
              onChange={(value) => updateJobDetail("finalPrice", value)}
            />
          </div>
        </Section>
        <Section title="Service Location">
          <p className="mb-5 text-sm text-gray-500">
            Enter the exact service address after confirming the job with the
            customer.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Street address"
              value={jobLocation.address}
              onChange={(value) => updateJobLocation("address", value)}
            />

            <Input
              label="Unit / Apartment"
              value={jobLocation.unit}
              onChange={(value) => updateJobLocation("unit", value)}
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input
              label="Suburb"
              value={request.property.suburb}
              onChange={(value) => updatePropertyField("suburb", value)}
            />

            <Input
              label="Postcode"
              value={request.property.postcode}
              onChange={(value) => updatePropertyField("postcode", value)}
            />
          </div>
        </Section>
        <Section title="Access Information">
          <p className="mb-5 text-sm text-gray-500">
            Add any instructions the cleaner will need to enter or access the
            property.
          </p>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Access instructions
            </label>

            <textarea
              rows={4}
              value={jobAccess.instructions}
              onChange={(event) =>
                updateJobAccess("instructions", event.target.value)
              }
              placeholder="e.g. Collect keys from reception, use the rear entrance, ring apartment 504..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Parking information
            </label>

            <textarea
              rows={3}
              value={jobAccess.parking}
              onChange={(event) =>
                updateJobAccess("parking", event.target.value)
              }
              placeholder="e.g. Visitor parking available in basement B2"
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </div>

          <label className="mt-4 flex items-center gap-3">
            <input
              type="checkbox"
              checked={jobAccess.contactOnArrival}
              onChange={(event) =>
                updateJobAccess("contactOnArrival", event.target.checked)
              }
            />

            <span className="text-sm text-gray-700">
              Contact customer when cleaner arrives
            </span>
          </label>
        </Section>
        <div className="mt-10 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={handleConvertToJob}
            className="rounded-xl bg-gray-900 px-6 py-3 font-medium text-white"
          >
            Convert to Job
          </button>
        </div>
      </section>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-300 px-4 py-3"
      >
        <option value="">Select</option>

        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  );
}

function CheckboxCard({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4">
      <input type="checkbox" checked={checked} onChange={onChange} />

      <span className="text-sm font-medium text-gray-800">{label}</span>
    </label>
  );
}
