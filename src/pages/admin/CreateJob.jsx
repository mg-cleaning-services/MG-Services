import { Link } from "react-router-dom";

import FormSection from "@/components/admin/forms/ui/FormSection";
import FormSelect from "@/components/admin/forms/ui/FormSelect";

import CustomerFields from "@/components/admin/forms/shared/CustomerFields";
import CleaningServiceFields from "@/components/admin/forms/shared/CleaningServiceFields";

import PropertyCharacteristicsFields from "@/components/admin/forms/shared/PropertyCharacteristicsFields";
import JobServiceLocationFields from "@/components/admin/forms/job/JobServiceLocationFields";
import JobAccessFields from "@/components/admin/forms/job/JobAccessFields";
import JobScheduleFields from "@/components/admin/forms/job/JobScheduleFields";
import PricingFields from "@/components/admin/forms/job/PricingFields";
import InternalNotesFields from "@/components/admin/forms/job/InternalNotesFields";

import useCreateJob from "@/hooks/useCreateJob";

export default function CreateJob() {
  const {
    job,
    creating,
    error,

    updateJobField,
    updateJobSection,

    submitJob,
  } = useCreateJob();

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <Link
            to="/admin/jobs"
            className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            ← Back to Jobs
          </Link>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-[#2E7D32]">
            Direct Job
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">Create Job</h1>

          <p className="mt-2 max-w-2xl text-gray-600">
            Create a confirmed job that did not originate from a website
            request.
          </p>
        </div>

        <div className="space-y-6">
          <FormSection title="Job Details">
            <div className="grid gap-5 md:grid-cols-2">
              <FormSelect
                label="Source"
                value={job.source}
                onChange={(value) => updateJobField("source", value)}
                options={[
                  ["phone", "Phone"],
                  ["whatsapp", "WhatsApp"],
                  ["referral", "Referral"],
                  ["returning_customer", "Returning Customer"],
                  ["other", "Other"],
                ]}
              />
            </div>
          </FormSection>

          <FormSection title="Customer">
            <CustomerFields
              value={job.customer}
              onChange={(value) => updateJobSection("customer", value)}
            />
          </FormSection>

          <FormSection title="Service">
            <CleaningServiceFields
              value={job.service}
              onChange={(value) => updateJobSection("service", value)}
            />
          </FormSection>

          <FormSection title="Property">
            <PropertyCharacteristicsFields
              value={job.property}
              onChange={(value) => updateJobSection("property", value)}
            />
          </FormSection>

          <FormSection title="Service Location">
            <JobServiceLocationFields
              value={job.location}
              onChange={(value) => updateJobSection("location", value)}
            />
          </FormSection>

          <FormSection title="Access Information">
            <JobAccessFields
              value={job.access}
              onChange={(value) => updateJobSection("access", value)}
            />
          </FormSection>

          <FormSection title="Schedule">
            <JobScheduleFields
              value={job.schedule}
              onChange={(value) => updateJobSection("schedule", value)}
            />
          </FormSection>

          <FormSection title="Pricing">
            <PricingFields
              value={job.pricing}
              onChange={(value) => updateJobSection("pricing", value)}
            />
          </FormSection>

          <FormSection title="Internal Notes">
            <InternalNotesFields
              value={job.notes}
              onChange={(value) => updateJobField("notes", value)}
            />
          </FormSection>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pb-8 sm:flex-row sm:justify-end">
            <Link
              to="/admin/jobs"
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-center font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="button"
              disabled={creating}
              onClick={submitJob}
              className="rounded-xl bg-[#2E7D32] px-6 py-3 font-medium text-white transition hover:bg-[#256b29] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating ? "Creating Job..." : "Create Job"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
