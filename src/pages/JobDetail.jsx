import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getJobById, updateJob } from "@/services/jobService";

import { getEmployees } from "@/services/employeeService";

import { getPackageById, getServiceById } from "@/services/cleaningService";
import CleanerIntroductionCard from "@/components/employees/CleanerIntroductionCard";

import { toPng } from "html-to-image";

import {
  buildCleanerJobMessage,
  buildCustomerCleanerMessage,
  createWhatsAppUrl,
} from "@/services/communicationService";

export default function JobDetail() {
  const { id } = useParams();

  const originalJob = getJobById(id);
  const employees = getEmployees();

  const [job, setJob] = useState(originalJob);
  const cleanerCardRef = useRef(null);
  if (!job) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-5xl px-6 py-16">
          <h1 className="text-3xl font-bold text-gray-900">Job not found</h1>

          <Link
            to="/admin/jobs"
            className="mt-6 inline-block text-sm font-medium text-gray-700"
          >
            ← Back to Jobs
          </Link>
        </section>
      </main>
    );
  }

  const activeEmployees = employees.filter(
    (employee) => employee.status === "active",
  );

  const assignedEmployee = activeEmployees.find(
    (employee) => String(employee.id) === String(job.assignedEmployeeId),
  );
  function handleSendJobToCleaner() {
    if (!assignedEmployee) {
      alert("Please assign a cleaner first.");
      return;
    }

    if (!assignedEmployee.phone) {
      alert("This employee does not have a phone number.");
      return;
    }

    const message = buildCleanerJobMessage(job);

    const whatsappUrl = createWhatsAppUrl(assignedEmployee.phone, message);

    if (!whatsappUrl) {
      return;
    }

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }
  function handleSendCleanerToCustomer() {
    if (!assignedEmployee) {
      alert("Please assign a cleaner first.");
      return;
    }

    if (!job.customer.phone) {
      alert("This customer does not have a phone number.");
      return;
    }

    const message = buildCustomerCleanerMessage(job, assignedEmployee);

    const whatsappUrl = createWhatsAppUrl(job.customer.phone, message);

    if (!whatsappUrl) {
      return;
    }

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }
  function handleEmployeeAssignment(employeeId) {
    setJob((current) => ({
      ...current,
      assignedEmployeeId: employeeId || null,
      status: employeeId ? "assigned" : "unassigned",
    }));
  }
  function updateLocationField(field, value) {
    setJob((current) => ({
      ...current,
      location: {
        ...current.location,
        [field]: value,
      },
    }));
  }

  function updateAccessField(field, value) {
    setJob((current) => ({
      ...current,
      access: {
        ...current.access,
        [field]: value,
      },
    }));
  }
  function updateCustomerField(field, value) {
    setJob((current) => ({
      ...current,
      customer: {
        ...current.customer,
        [field]: value,
      },
    }));
  }

  function updatePropertyField(field, value) {
    setJob((current) => ({
      ...current,
      property: {
        ...current.property,
        [field]: value,
      },
    }));
  }

  function updateScheduleField(field, value) {
    setJob((current) => ({
      ...current,
      schedule: {
        ...current.schedule,
        [field]: value,
      },
    }));
  }

  function updatePricingField(field, value) {
    setJob((current) => ({
      ...current,
      pricing: {
        ...current.pricing,
        [field]: value,
      },
    }));
  }

  function handleSave() {
    const updatedJob = {
      ...job,

      schedule: {
        ...job.schedule,
        estimatedHours: job.schedule.estimatedHours
          ? Number(job.schedule.estimatedHours)
          : null,
      },

      pricing: {
        ...job.pricing,
        finalPrice: job.pricing.finalPrice
          ? Number(job.pricing.finalPrice)
          : null,
      },
    };

    const updatedJobs = updateJob([originalJob], updatedJob);

    console.log("Updated Job:", updatedJobs[0]);
  }

  const packageName = job.service.packageId
    ? getPackageById(job.service.packageId)?.name
    : null;

  const customServices =
    job.service.selectedServices
      ?.map((serviceId) => getServiceById(serviceId)?.name)
      .filter(Boolean) || [];

  const extras =
    job.service.extras
      ?.map((serviceId) => getServiceById(serviceId)?.name)
      .filter(Boolean) || [];

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link to="/admin/jobs" className="text-sm text-gray-500">
              ← Back to Jobs
            </Link>

            <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-gray-500">
              {job.id}
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              {job.customer.firstName} {job.customer.lastName}
            </h1>

            {job.requestId && (
              <p className="mt-2 text-sm text-gray-500">
                Created from {job.requestId}
              </p>
            )}
          </div>

          <StatusBadge status={job.status} />
        </div>

        <div className="mt-10 space-y-8">
          <Section title="Customer">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="First name"
                value={job.customer.firstName}
                onChange={(value) => updateCustomerField("firstName", value)}
              />

              <Input
                label="Last name"
                value={job.customer.lastName}
                onChange={(value) => updateCustomerField("lastName", value)}
              />

              <Input
                label="Phone"
                value={job.customer.phone}
                onChange={(value) => updateCustomerField("phone", value)}
              />

              <Input
                label="Email"
                value={job.customer.email}
                onChange={(value) => updateCustomerField("email", value)}
              />
            </div>
          </Section>

          <Section title="Service">
            <div>
              <p className="text-sm text-gray-500">Confirmed service</p>

              <p className="mt-1 text-lg font-semibold text-gray-900">
                {job.service.requestType === "package"
                  ? packageName
                  : job.service.requestType === "custom"
                    ? "Custom Cleaning"
                    : "Customised Service"}
              </p>

              {customServices.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700">Services</p>

                  <p className="mt-1 text-sm text-gray-600">
                    {customServices.join(", ")}
                  </p>
                </div>
              )}

              {extras.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700">
                    Additional services
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    {extras.join(", ")}
                  </p>
                </div>
              )}
            </div>
          </Section>

          <Section title="Property">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Property type"
                value={job.property.propertyType}
                onChange={(value) => updatePropertyField("propertyType", value)}
              />

              <Input
                label="Floors"
                value={job.property.floors}
                onChange={(value) => updatePropertyField("floors", value)}
              />

              <Input
                label="Bedrooms"
                value={job.property.bedrooms}
                onChange={(value) => updatePropertyField("bedrooms", value)}
              />

              <Input
                label="Bathrooms"
                value={job.property.bathrooms}
                onChange={(value) => updatePropertyField("bathrooms", value)}
              />

              <Input
                label="Kitchens"
                value={job.property.kitchens}
                onChange={(value) => updatePropertyField("kitchens", value)}
              />

              <Input
                label="Balconies"
                value={job.property.balconies}
                onChange={(value) => updatePropertyField("balconies", value)}
              />

              <Input
                label="Laundries"
                value={job.property.laundries}
                onChange={(value) => updatePropertyField("laundries", value)}
              />

              <Input
                label="Suburb"
                value={job.property.suburb}
                onChange={(value) => updatePropertyField("suburb", value)}
              />

              <Input
                label="Postcode"
                value={job.property.postcode}
                onChange={(value) => updatePropertyField("postcode", value)}
              />

              <Input
                label="Pets"
                value={job.property.pets}
                onChange={(value) => updatePropertyField("pets", value)}
              />
            </div>
          </Section>
          <Section title="Service Location">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Street address"
                value={job.location?.address || ""}
                onChange={(value) => updateLocationField("address", value)}
              />

              <Input
                label="Unit / Apartment"
                value={job.location?.unit || ""}
                onChange={(value) => updateLocationField("unit", value)}
              />

              <Input
                label="Suburb"
                value={job.location?.suburb || job.property.suburb || ""}
                onChange={(value) => updateLocationField("suburb", value)}
              />

              <Input
                label="Postcode"
                value={job.location?.postcode || job.property.postcode || ""}
                onChange={(value) => updateLocationField("postcode", value)}
              />
            </div>
          </Section>

          <Section title="Access Information">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Access instructions
              </label>

              <textarea
                rows={4}
                value={job.access?.instructions || ""}
                onChange={(event) =>
                  updateAccessField("instructions", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Parking information
              </label>

              <textarea
                rows={3}
                value={job.access?.parking || ""}
                onChange={(event) =>
                  updateAccessField("parking", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>

            <label className="mt-4 flex items-center gap-3">
              <input
                type="checkbox"
                checked={job.access?.contactOnArrival || false}
                onChange={(event) =>
                  updateAccessField("contactOnArrival", event.target.checked)
                }
              />

              <span className="text-sm text-gray-700">
                Contact customer on arrival
              </span>
            </label>
          </Section>
          <Section title="Schedule">
            <div className="grid gap-4 md:grid-cols-3">
              <Input
                type="date"
                label="Date"
                value={job.schedule.date}
                onChange={(value) => updateScheduleField("date", value)}
              />

              <Input
                type="time"
                label="Start time"
                value={job.schedule.startTime}
                onChange={(value) => updateScheduleField("startTime", value)}
              />

              <Input
                type="number"
                label="Estimated hours"
                value={job.schedule.estimatedHours}
                onChange={(value) =>
                  updateScheduleField("estimatedHours", value)
                }
              />
            </div>
          </Section>

          <Section title="Pricing">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                type="number"
                label="Internal estimated price"
                value={job.pricing.estimatedPrice ?? ""}
                onChange={(value) =>
                  updatePricingField("estimatedPrice", value)
                }
              />

              <Input
                type="number"
                label="Final agreed price"
                value={job.pricing.finalPrice ?? ""}
                onChange={(value) => updatePricingField("finalPrice", value)}
              />
            </div>
          </Section>

          <Section title="Cleaner Assignment">
            <p className="mb-5 text-sm text-gray-500">
              Assign the employee responsible for this cleaning job.
            </p>

            <Select
              label="Assigned cleaner"
              value={job.assignedEmployeeId || ""}
              onChange={handleEmployeeAssignment}
              options={activeEmployees.map((employee) => [
                String(employee.id),
                `${employee.name} · ${employee.role}`,
              ])}
            />

            {assignedEmployee && (
              <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-lg font-semibold text-gray-900">
                  {assignedEmployee.name}
                </p>

                <p className="mt-1 text-sm text-gray-600">
                  {assignedEmployee.role}
                </p>

                <div className="mt-4 space-y-1 text-sm text-gray-600">
                  <p>Phone: {assignedEmployee.phone || "Not provided"}</p>

                  <p>Location: {assignedEmployee.location || "Not provided"}</p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadCleanerCard}
                    className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700"
                  >
                    Download Cleaner Introduction
                  </button>

                  <button
                    type="button"
                    onClick={handleSendCleanerToCustomer}
                    className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700"
                  >
                    Send Cleaner to Customer
                  </button>

                  <button
                    type="button"
                    onClick={handleSendJobToCleaner}
                    className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700"
                  >
                    Send Job to Cleaner
                  </button>
                </div>
              </div>
            )}
          </Section>
          <Section title="Customer Introduction">
            {!assignedEmployee ? (
              <p className="text-sm text-gray-500">
                Assign a cleaner before sending an introduction to the customer.
              </p>
            ) : (
              <>
                <p className="text-sm text-gray-500">
                  Introduce {assignedEmployee.name} to the customer before the
                  service.
                </p>

                <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-5">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Step 1 · Download introduction card
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Generate the cleaner presentation image to attach to the
                      customer message.
                    </p>

                    <button
                      type="button"
                      onClick={handleDownloadCleanerCard}
                      className="mt-4 rounded-xl border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700"
                    >
                      Download Cleaner Introduction
                    </button>
                  </div>

                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <p className="text-sm font-medium text-gray-900">
                      Step 2 · Contact customer
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Open WhatsApp with the introduction message prepared.
                      Attach the downloaded image before sending.
                    </p>

                    <button
                      type="button"
                      onClick={handleSendCleanerToCustomer}
                      className="mt-4 rounded-xl bg-gray-900 px-5 py-3 font-medium text-white"
                    >
                      Send Cleaner to Customer
                    </button>
                  </div>
                </div>
              </>
            )}
          </Section>
          <Section title="Internal Notes">
            <textarea
              rows={5}
              value={job.notes || ""}
              onChange={(event) =>
                setJob((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />
          </Section>
        </div>

        <div className="mt-10 flex flex-wrap justify-between gap-3">
          <button
            type="button"
            onClick={() =>
              setJob((current) => ({
                ...current,
                status: "cancelled",
              }))
            }
            className="rounded-xl border border-red-300 px-5 py-3 font-medium text-red-700"
          >
            Cancel Job
          </button>

          <div className="flex flex-wrap gap-3">
            {job.status === "assigned" && (
              <button
                type="button"
                onClick={() =>
                  setJob((current) => ({
                    ...current,
                    status: "completed",
                  }))
                }
                className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700"
              >
                Mark Completed
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-gray-900 px-6 py-3 font-medium text-white"
            >
              Save Job
            </button>
          </div>
        </div>
      </section>
      {assignedEmployee && (
        <div className="fixed left-[-9999px] top-0" aria-hidden="true">
          <div ref={cleanerCardRef}>
            <CleanerIntroductionCard employee={assignedEmployee} job={job} />
          </div>
        </div>
      )}
    </main>
  );
  async function handleDownloadCleanerCard() {
    if (!assignedEmployee || !cleanerCardRef.current) {
      return;
    }

    try {
      const dataUrl = await toPng(cleanerCardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      });

      const link = document.createElement("a");

      const employeeName = assignedEmployee.name
        .toLowerCase()
        .replace(/\s+/g, "-");

      link.download = `${employeeName}-mg-cleaning.png`;
      link.href = dataUrl;

      link.click();
    } catch (error) {
      console.error("Error generating cleaner introduction:", error);
    }
  }
}

function StatusBadge({ status }) {
  const labels = {
    unassigned: "Unassigned",
    assigned: "Assigned",
    completed: "Completed",
    cancelled: "Cancelled",
  };

  return (
    <span className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium capitalize text-gray-700">
      {labels[status] || status}
    </span>
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
        <option value="">Not assigned</option>

        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  );
}
