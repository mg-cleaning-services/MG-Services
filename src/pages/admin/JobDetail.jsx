import CleanerIntroductionCard from "@/components/employees/CleanerIntroductionCard";

import FormSection from "@/components/admin/forms/ui/FormSection";

import JobHeader from "@/components/admin/forms/job/JobHeader";
import JobCustomerFields from "@/components/admin/forms/job/JobCustomerFields";
import ConfirmedServiceFields from "@/components/admin/forms/job/ConfirmedServiceFields";
import PropertyCharacteristicsFields from "@/components/admin/forms/shared/PropertyCharacteristicsFields";
import JobServiceLocationFields from "@/components/admin/forms/job/JobServiceLocationFields";
import JobAccessFields from "@/components/admin/forms/job/JobAccessFields";
import JobScheduleFields from "@/components/admin/forms/job/JobScheduleFields";
import PricingFields from "@/components/admin/forms/job/PricingFields";
import TeamAssignmentFields from "@/components/admin/forms/job/TeamAssignmentFields";
import InternalNotesFields from "@/components/admin/forms/job/InternalNotesFields";
import JobActions from "@/components/admin/forms/job/JobActions";

import useJobDetail from "@/hooks/useJobDetail";
import useJobCommunication from "@/hooks/useJobCommunication";

export default function JobDetail() {
  const {
    job,
    assignments,
    availableEmployees,

    selectedEmployeeId,
    setSelectedEmployeeId,

    loading,
    loadError,
    saving,
    saveMessage,
    assignmentLoading,

    updateJobSection,
    updateJobField,

    saveJob,
    addEmployee,
    removeEmployee,
  } = useJobDetail();

  const {
    introductionEmployee,
    cleanerCardRef,

    sendJobToCleaner,
    sendCleanerToCustomer,
    downloadCleanerCard,
    clearIntroductionEmployee,
  } = useJobCommunication(job);

  async function handleRemoveEmployee(employeeId) {
    await removeEmployee(employeeId);
    clearIntroductionEmployee(employeeId);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-gray-500">Loading job...</p>
        </section>
      </main>
    );
  }

  if (loadError || !job) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-5xl px-6 py-16">
          <h1 className="text-3xl font-bold text-gray-900">Job not found</h1>

          <p className="mt-3 text-gray-500">
            {loadError || "This job could not be found."}
          </p>

          <a
            href="/admin/jobs"
            className="mt-6 inline-block text-sm font-medium text-gray-700"
          >
            ← Back to Jobs
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-5xl px-6 py-12">
        <JobHeader job={job} />

        <div className="mt-10 space-y-8">
          <FormSection title="Customer">
            <JobCustomerFields
              value={job.customer}
              onChange={(customer) => updateJobSection("customer", customer)}
            />
          </FormSection>

          <FormSection title="Service">
            <ConfirmedServiceFields value={job.service} />
          </FormSection>

          <FormSection title="Property">
            <PropertyCharacteristicsFields
              value={job.property}
              onChange={(property) => updateJobSection("property", property)}
            />
          </FormSection>

          <FormSection title="Service Location">
            <JobServiceLocationFields
              value={job.location}
              onChange={(location) => updateJobSection("location", location)}
            />
          </FormSection>

          <FormSection title="Access Information">
            <JobAccessFields
              value={job.access}
              onChange={(access) => updateJobSection("access", access)}
            />
          </FormSection>

          <FormSection title="Schedule">
            <JobScheduleFields
              value={job.schedule}
              onChange={(schedule) => updateJobSection("schedule", schedule)}
            />
          </FormSection>

          <FormSection title="Pricing">
            <PricingFields
              value={job.pricing}
              onChange={(pricing) => updateJobSection("pricing", pricing)}
            />
          </FormSection>

          <FormSection title="Team Assignment">
            <TeamAssignmentFields
              availableEmployees={availableEmployees}
              assignments={assignments}
              selectedEmployeeId={selectedEmployeeId}
              assignmentLoading={assignmentLoading}
              onSelectedEmployeeChange={setSelectedEmployeeId}
              onAddEmployee={addEmployee}
              onRemoveEmployee={handleRemoveEmployee}
              onDownloadIntroduction={downloadCleanerCard}
              onSendToCustomer={sendCleanerToCustomer}
              onSendJob={sendJobToCleaner}
            />
          </FormSection>

          <FormSection title="Internal Notes">
            <InternalNotesFields
              value={job.notes}
              onChange={(notes) => updateJobField("notes", notes)}
            />
          </FormSection>
        </div>

        {saveMessage && (
          <p
            className={`mt-6 text-sm font-medium ${
              saveMessage.includes("successfully")
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            {saveMessage}
          </p>
        )}

        <JobActions
          status={job.status}
          saving={saving}
          onCancel={() => updateJobField("status", "cancelled")}
          onComplete={() => updateJobField("status", "completed")}
          onSave={saveJob}
        />
      </section>

      {introductionEmployee && (
        <div className="fixed left-[-9999px] top-0" aria-hidden="true">
          <div ref={cleanerCardRef}>
            <CleanerIntroductionCard
              employee={introductionEmployee}
              job={job}
            />
          </div>
        </div>
      )}
    </main>
  );
}
