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

import DetailSectionNavigation from "@/components/admin/navigation/DetailSectionNavigation";

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

  const navigationSections = [
    { id: "customer", label: "Customer" },
    { id: "property", label: "Property" },
    { id: "service", label: "Service" },
    { id: "service-location", label: "Service Location" },
    { id: "access", label: "Access" },
    { id: "schedule", label: "Schedule" },
    { id: "pricing", label: "Pricing" },
    { id: "team", label: "Team" },
    { id: "notes", label: "Internal Notes" },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto w-full max-w-[1440px] px-6 pb-12">
        {/* Sticky context */}

        <div
          className="
            sticky top-3 z-30
            rounded-2xl
            border border-[#2E7D32]/10
            bg-white/95
            px-6 pt-4
            shadow-sm backdrop-blur
          "
        >
          <JobHeader job={job} />

          <div className="mt-3">
            <DetailSectionNavigation sections={navigationSections} />
          </div>
        </div>

        {/* Detail content */}

        <div className="mx-auto mt-8 max-w-6xl space-y-8">
          {/* Customer */}

          <div id="customer" className="scroll-mt-35">
            <FormSection title="Customer">
              <CustomerFields
                value={job.customer}
                onChange={(customer) => updateJobSection("customer", customer)}
              />
            </FormSection>
          </div>

          {/* Property */}

          <div id="property" className="scroll-mt-35">
            <FormSection title="Property">
              <PropertyCharacteristicsFields
                value={job.property}
                onChange={(property) => updateJobSection("property", property)}
              />
            </FormSection>
          </div>

          {/* Service */}

          <div id="service" className="scroll-mt-35">
            <FormSection title="Service">
              <CleaningServiceFields
                value={job.service}
                onChange={(service) => updateJobSection("service", service)}
              />
            </FormSection>
          </div>

          {/* Service Location */}

          <div id="service-location" className="scroll-mt-35">
            <FormSection title="Service Location">
              <ServiceLocationFields
                value={job.location}
                onChange={(location) => updateJobSection("location", location)}
              />
            </FormSection>
          </div>

          {/* Access */}

          <div id="access" className="scroll-mt-35">
            <FormSection title="Access">
              <AccessFields
                value={job.access}
                onChange={(access) => updateJobSection("access", access)}
              />
            </FormSection>
          </div>

          {/* Schedule */}

          <div id="schedule" className="scroll-mt-35">
            <FormSection title="Schedule">
              <ServiceScheduleFields
                value={job.schedule}
                onChange={(schedule) => updateJobSection("schedule", schedule)}
              />
            </FormSection>
          </div>

          {/* Pricing */}

          <div id="pricing" className="scroll-mt-35">
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
          </div>

          {/* Team */}

          <div id="team" className="scroll-mt-35">
            <FormSection title="Team">
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
          </div>

          {/* Internal Notes */}

          <div id="notes" className="scroll-mt-35">
            <FormSection title="Internal Notes">
              <InternalNotesFields
                value={job.notes}
                onChange={(notes) => updateJobField("notes", notes)}
              />
            </FormSection>
          </div>

          {saveMessage && (
            <p
              className={`text-sm font-medium ${
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
        </div>
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
