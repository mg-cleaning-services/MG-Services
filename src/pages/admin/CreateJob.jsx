import { Link } from "react-router-dom";
import { CircleAlert, CircleCheck } from "lucide-react";

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

import EmployeeAvailabilitySelect from "@/components/admin/team/EmployeeAvailabilitySelect";

import useCreateJob from "@/hooks/useCreateJob";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function CreateJob() {
  const {
    job,

    selectedEmployees,
    selectableEmployees,

    selectedEmployeeId,
    setSelectedEmployeeId,

    loadingEmployees,
    checkingConflicts,

    getEmployeeJobConflicts,
    hasEmployeeJobConflict,

    addSelectedEmployee,
    removeSelectedEmployee,

    creating,
    error,

    updateJobField,
    updateJobSection,

    submitJob,
  } = useCreateJob();

  const scheduleReady =
    job.schedule.date &&
    job.schedule.startTime &&
    job.schedule.endTime &&
    job.schedule.endTime > job.schedule.startTime;

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

          <FormSection title="Team Assignment">
            <div className="space-y-5">
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <div className="flex gap-3">
                  <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                  <div>
                    <p className="text-sm font-medium text-amber-900">
                      Operational availability
                    </p>

                    <p className="mt-1 text-sm text-amber-700">
                      Availability currently checks existing job assignments
                      only. Personal availability and time off are not
                      configured yet.
                    </p>
                  </div>
                </div>
              </div>

              {!scheduleReady && (
                <p className="text-sm text-gray-500">
                  Select a valid service date, start time and end time to check
                  employee availability.
                </p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1">
                  <EmployeeAvailabilitySelect
                    employees={selectableEmployees}
                    value={selectedEmployeeId}
                    onChange={setSelectedEmployeeId}
                    checkingConflicts={checkingConflicts}
                    getEmployeeJobConflicts={getEmployeeJobConflicts}
                    disabled={loadingEmployees || !scheduleReady || creating}
                  />
                </div>

                <button
                  type="button"
                  onClick={addSelectedEmployee}
                  disabled={
                    !selectedEmployeeId || checkingConflicts || creating
                  }
                  className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add
                </button>
              </div>

              {loadingEmployees && (
                <p className="text-sm text-gray-500">Loading employees...</p>
              )}

              {!loadingEmployees && selectedEmployees.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-300 px-4 py-5 text-center">
                  <p className="text-sm font-medium text-gray-700">
                    No cleaners assigned yet
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    You can create the job without a cleaner and assign the team
                    later.
                  </p>
                </div>
              )}

              {selectedEmployees.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900">
                    Planned team
                  </p>

                  {selectedEmployees.map((employee) => {
                    const conflicts = getEmployeeJobConflicts(employee.id);

                    const hasConflict = hasEmployeeJobConflict(employee.id);

                    return (
                      <div
                        key={employee.id}
                        className={`rounded-xl border bg-white p-4 ${
                          hasConflict ? "border-red-300" : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex min-w-0 gap-3">
                            {employee.photo ? (
                              <img
                                src={employee.photo}
                                alt=""
                                className="h-11 w-11 shrink-0 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                                {getInitials(employee.name)}
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="truncate font-semibold text-gray-900">
                                {employee.name}
                              </p>

                              <p className="text-sm text-gray-500">
                                {employee.role || "Cleaner"}
                              </p>

                              {hasConflict ? (
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-red-700">
                                    Unavailable
                                  </p>

                                  {conflicts.map((conflict) => (
                                    <p
                                      key={conflict.jobId}
                                      className="mt-1 text-xs text-red-600"
                                    >
                                      {conflict.jobCode} · {conflict.startTime}–
                                      {conflict.endTime}
                                    </p>
                                  ))}
                                </div>
                              ) : scheduleReady ? (
                                <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-green-700">
                                  <CircleCheck className="h-4 w-4" />
                                  Available · Planned for this job
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeSelectedEmployee(employee.id)}
                            disabled={creating}
                            className="shrink-0 text-sm font-medium text-red-600 transition hover:text-red-700 disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
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
