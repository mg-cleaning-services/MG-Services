import CleanerIntroductionCard from "@/components/employees/CleanerIntroductionCard";

import FormSection from "@/components/admin/forms/ui/FormSection";

import JobHeader from "@/components/admin/forms/job/JobHeader";
import TeamAssignmentFields from "@/components/admin/forms/job/TeamAssignmentFields";
import InternalNotesFields from "@/components/admin/forms/job/InternalNotesFields";
import JobActions from "@/components/admin/forms/job/JobActions";

import CustomerFields from "@/components/admin/forms/shared/CustomerFields";
import CleaningServiceFields from "@/components/admin/forms/shared/CleaningServiceFields";
import PropertyCharacteristicsFields from "@/components/admin/forms/shared/PropertyCharacteristicsFields";
import ServiceLocationFields from "@/components/admin/forms/shared/ServiceLocationFields";
import AccessFields from "@/components/admin/forms/shared/AccessFields";
import ServiceScheduleFields from "@/components/admin/forms/shared/ServiceScheduleFields";
import ServicePricingFields from "@/components/admin/forms/shared/ServicePricingFields";

import useJobDetail from "@/hooks/useJobDetail";
import useJobCommunication from "@/hooks/useJobCommunication";

export default function JobDetail() {
  const {
    job,

    selectedPackage,
    calculationComplete,
    serviceBreakdown,
    packagePrice,
    packageLabourHours,

    assignments,
    availableEmployees,

    selectedEmployeeId,
    setSelectedEmployeeId,

    checkingConflicts,
    getEmployeeJobConflicts,
    hasEmployeeJobConflict,

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
            <CustomerFields
              value={job.customer}
              onChange={(customer) => updateJobSection("customer", customer)}
            />
          </FormSection>

          <FormSection title="Property">
            <PropertyCharacteristicsFields
              value={job.property}
              onChange={(property) => updateJobSection("property", property)}
            />
          </FormSection>

          <FormSection title="Service">
            <CleaningServiceFields
              value={job.service}
              onChange={(service) => updateJobSection("service", service)}
            />
          </FormSection>

          <FormSection title="Service Location">
            <ServiceLocationFields
              value={job.location}
              onChange={(location) => updateJobSection("location", location)}
            />
          </FormSection>

          <FormSection title="Access Information">
            <AccessFields
              value={job.access}
              onChange={(access) => updateJobSection("access", access)}
            />
          </FormSection>

          <FormSection title="Schedule">
            <ServiceScheduleFields
              value={job.schedule}
              onChange={(schedule) => updateJobSection("schedule", schedule)}
            />
          </FormSection>

          <FormSection title="Pricing">
            <ServicePricingFields
              estimatedPrice={job.estimation?.price}
              estimatedLabourHours={job.estimation?.labourHours}
              commercialPrice={job.pricing?.agreedPrice}
              onCommercialPriceChange={(agreedPrice) =>
                updateJobSection("pricing", {
                  ...job.pricing,
                  agreedPrice,
                })
              }
              commercialPriceLabel="Agreed price"
              commercialPriceDescription="Price agreed with the customer."
              finalPrice={job.pricing?.finalPrice}
              onFinalPriceChange={(finalPrice) =>
                updateJobSection("pricing", {
                  ...job.pricing,
                  finalPrice,
                })
              }
              showFinalPrice
              packagePrice={packagePrice}
              packageLabourHours={packageLabourHours}
              packageName={selectedPackage?.name}
              bedrooms={job.property?.bedrooms}
              bathrooms={job.property?.bathrooms}
              serviceBreakdown={serviceBreakdown}
              calculationComplete={calculationComplete}
            />
          </FormSection>

          <FormSection title="Team Assignment">
            <TeamAssignmentFields
              availableEmployees={availableEmployees}
              assignments={assignments}
              selectedEmployeeId={selectedEmployeeId}
              assignmentLoading={assignmentLoading}
              checkingConflicts={checkingConflicts}
              getEmployeeJobConflicts={getEmployeeJobConflicts}
              hasEmployeeJobConflict={hasEmployeeJobConflict}
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
