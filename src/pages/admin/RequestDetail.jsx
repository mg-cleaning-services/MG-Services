import { Link } from "react-router-dom";

import FormSection from "@/components/admin/forms/ui/FormSection";

import CustomerFields from "@/components/admin/forms/shared/CustomerFields";
import CleaningServiceFields from "@/components/admin/forms/shared/CleaningServiceFields";
import PropertyCharacteristicsFields from "@/components/admin/forms/shared/PropertyCharacteristicsFields";
import ServiceLocationFields from "@/components/admin/forms/shared/ServiceLocationFields";
import AccessFields from "@/components/admin/forms/shared/AccessFields";
import ServiceScheduleFields from "@/components/admin/forms/shared/ServiceScheduleFields";
import ServicePricingFields from "@/components/admin/forms/shared/ServicePricingFields";

import RequestHeader from "@/components/admin/forms/request/RequestHeader";
import ConvertedJobCard from "@/components/admin/forms/request/ConvertedJobCard";
import PreferredScheduleFields from "@/components/admin/forms/request/PreferredScheduleFields";
import PropertyConditionFields from "@/components/admin/forms/request/PropertyConditionFields";
import TeamPlanningFields from "@/components/admin/forms/request/TeamPlanningFields";

import useRequestDetail from "@/hooks/useRequestDetail";

export default function RequestDetail() {
  const {
    request,
    generatedJob,

    selectedPackage,
    calculationComplete,
    serviceBreakdown,
    packagePrice,
    packageLabourHours,

    jobLocation,
    setJobLocation,

    jobAccess,
    setJobAccess,

    activeEmployees,
    checkingConflicts,
    assignmentLoadingId,

    isEmployeeAssigned,
    getEmployeeJobConflicts,
    toggleRequestAssignment,

    loading,
    loadError,
    saving,
    converting,

    updateRequestSection,
    updateRequestField,

    saveRequest,
    convertToJob,
  } = useRequestDetail();

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-4xl px-6 py-16">
          <p className="text-gray-600">Loading request...</p>
        </section>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-4xl px-6 py-16">
          <h1 className="text-3xl font-bold text-gray-900">
            Could not load request
          </h1>

          <p className="mt-3 text-gray-600">{loadError}</p>

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

  const isConverted = request.status === "converted";

  const canConvert =
    request.status !== "converted" && request.status !== "closed";

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-5xl px-6 py-12">
        <RequestHeader
          request={request}
          onStatusChange={(status) => updateRequestField("status", status)}
        />

        <div className="mt-10 space-y-8">
          {isConverted && generatedJob && (
            <ConvertedJobCard job={generatedJob} />
          )}

          <FormSection title="Customer">
            <CustomerFields
              value={request.customer}
              onChange={(customer) =>
                updateRequestSection("customer", customer)
              }
            />
          </FormSection>

          <FormSection title="Property">
            <PropertyCharacteristicsFields
              value={request.property}
              onChange={(property) =>
                updateRequestSection("property", property)
              }
            />
          </FormSection>

          <FormSection title="Property Condition">
            <PropertyConditionFields
              condition={request.condition}
              notes={request.notes}
              onConditionChange={(condition) =>
                updateRequestField("condition", condition)
              }
              onNotesChange={(notes) => updateRequestField("notes", notes)}
            />
          </FormSection>

          <FormSection title="Service">
            <CleaningServiceFields
              value={request.service}
              onChange={(service) => updateRequestSection("service", service)}
            />
          </FormSection>

          <FormSection title="Service Location">
            <ServiceLocationFields
              value={jobLocation}
              onChange={setJobLocation}
            />
          </FormSection>

          <FormSection title="Customer Preferred Schedule">
            <PreferredScheduleFields
              value={request.schedule}
              onChange={(schedule) =>
                updateRequestSection("schedule", schedule)
              }
            />
          </FormSection>

          {!isConverted && (
            <>
              <FormSection title="Service Planning">
                <ServiceScheduleFields
                  value={request.schedule}
                  onChange={(schedule) =>
                    updateRequestSection("schedule", schedule)
                  }
                />
              </FormSection>

              <FormSection title="Estimate & Quote">
                <ServicePricingFields
                  estimatedPrice={request.estimation?.price}
                  estimatedLabourHours={request.estimation?.labourHours}
                  commercialPrice={request.pricing?.quotedPrice}
                  onCommercialPriceChange={(quotedPrice) =>
                    updateRequestSection("pricing", {
                      ...request.pricing,
                      quotedPrice,
                    })
                  }
                  commercialPriceLabel="Quoted price"
                  commercialPriceDescription="Price offered to the customer."
                  packagePrice={packagePrice}
                  packageLabourHours={packageLabourHours}
                  packageName={selectedPackage?.name}
                  bedrooms={request.property?.bedrooms}
                  bathrooms={request.property?.bathrooms}
                  serviceBreakdown={serviceBreakdown}
                  calculationComplete={calculationComplete}
                />
              </FormSection>

              <FormSection title="Team Planning">
                <TeamPlanningFields
                  employees={activeEmployees}
                  checkingConflicts={checkingConflicts}
                  assignmentLoadingId={assignmentLoadingId}
                  isEmployeeAssigned={isEmployeeAssigned}
                  getEmployeeJobConflicts={getEmployeeJobConflicts}
                  onToggleAssignment={toggleRequestAssignment}
                />
              </FormSection>

              <FormSection title="Access Information">
                <AccessFields value={jobAccess} onChange={setJobAccess} />
              </FormSection>
            </>
          )}
        </div>

        <div className="mt-10 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={saveRequest}
            className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          {canConvert && (
            <button
              type="button"
              disabled={converting}
              onClick={convertToJob}
              className="rounded-xl bg-gray-900 px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {converting ? "Converting..." : "Convert to Job"}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
