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

import DetailSectionNavigation from "@/components/admin/navigation/DetailSectionNavigation";

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
        <section className="mx-auto max-w-5xl px-6 py-16">
          <p className="text-gray-500">Loading request...</p>
        </section>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="min-h-screen bg-gray-50">
        <section className="mx-auto max-w-5xl px-6 py-16">
          <h1 className="text-3xl font-bold text-gray-900">
            Could not load request
          </h1>

          <p className="mt-3 text-gray-500">{loadError}</p>

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
        <section className="mx-auto max-w-5xl px-6 py-16">
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

  const navigationSections = [
    { id: "customer", label: "Customer" },
    { id: "property", label: "Property" },
    { id: "property-condition", label: "Condition" },
    { id: "service", label: "Service" },
    { id: "service-location", label: "Service Location" },

    ...(!isConverted
      ? [
          { id: "access", label: "Access" },
          {
            id: "preferred-schedule",
            label: "Preferred Schedule",
          },
          { id: "schedule", label: "Schedule" },
          { id: "pricing", label: "Pricing" },
          { id: "team", label: "Team" },
        ]
      : []),
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
          <RequestHeader
            request={request}
            generatedJob={generatedJob}
            onStatusChange={(status) => updateRequestField("status", status)}
          />

          <div className="mt-3">
            <DetailSectionNavigation sections={navigationSections} />
          </div>
        </div>

        {/* Detail content */}

        <div className="mx-auto mt-8 max-w-6xl space-y-8">
          {/* Converted Job */}

          {isConverted && generatedJob && (
            <ConvertedJobCard job={generatedJob} />
          )}

          {/* Customer */}

          <div id="customer" className="scroll-mt-35">
            <FormSection title="Customer">
              <CustomerFields
                value={request.customer}
                onChange={(customer) =>
                  updateRequestSection("customer", customer)
                }
              />
            </FormSection>
          </div>

          {/* Property */}

          <div id="property" className="scroll-mt-35">
            <FormSection title="Property">
              <PropertyCharacteristicsFields
                value={request.property}
                onChange={(property) =>
                  updateRequestSection("property", property)
                }
              />
            </FormSection>
          </div>

          {/* Property Condition */}

          <div id="property-condition" className="scroll-mt-35">
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
          </div>

          {/* Service */}

          <div id="service" className="scroll-mt-35">
            <FormSection title="Service">
              <CleaningServiceFields
                value={request.service}
                onChange={(service) => updateRequestSection("service", service)}
              />
            </FormSection>
          </div>

          {/* Service Location */}

          <div id="service-location" className="scroll-mt-35">
            <FormSection title="Service Location">
              <ServiceLocationFields
                value={jobLocation}
                onChange={setJobLocation}
              />
            </FormSection>
          </div>

          {!isConverted && (
            <>
              {/* Access */}

              <div id="access" className="scroll-mt-35">
                <FormSection title="Access">
                  <AccessFields value={jobAccess} onChange={setJobAccess} />
                </FormSection>
              </div>

              {/* Preferred Schedule */}

              <div id="preferred-schedule" className="scroll-mt-35">
                <FormSection title="Preferred Schedule">
                  <PreferredScheduleFields
                    value={request.schedule}
                    onChange={(schedule) =>
                      updateRequestSection("schedule", schedule)
                    }
                  />
                </FormSection>
              </div>

              {/* Schedule */}

              <div id="schedule" className="scroll-mt-35">
                <FormSection title="Schedule">
                  <ServiceScheduleFields
                    value={request.schedule}
                    onChange={(schedule) =>
                      updateRequestSection("schedule", schedule)
                    }
                  />
                </FormSection>
              </div>

              {/* Pricing */}

              <div id="pricing" className="scroll-mt-35">
                <FormSection title="Pricing">
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
              </div>

              {/* Team */}

              <div id="team" className="scroll-mt-35">
                <FormSection title="Team">
                  <TeamPlanningFields
                    employees={activeEmployees}
                    checkingConflicts={checkingConflicts}
                    assignmentLoadingId={assignmentLoadingId}
                    isEmployeeAssigned={isEmployeeAssigned}
                    getEmployeeJobConflicts={getEmployeeJobConflicts}
                    onToggleAssignment={toggleRequestAssignment}
                  />
                </FormSection>
              </div>
            </>
          )}

          {/* Actions */}

          <div className="flex flex-wrap justify-end gap-3 pt-2">
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
        </div>
      </section>
    </main>
  );
}
