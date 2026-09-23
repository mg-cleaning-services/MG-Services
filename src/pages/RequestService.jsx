import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import ServiceSelectionStep from "@/components/request-service/ServiceSelectionStep";
import PropertyStep from "@/components/request-service/PropertyStep";
import ScheduleStep from "@/components/request-service/ScheduleStep";
import CustomerStep from "@/components/request-service/CustomerStep";
import RequestReview from "@/components/request-service/RequestReview";
import RequestProgress from "@/components/request-service/RequestProgress";
import Navbar from "@/components/landing/Navbar";
import RequestSuccess from "@/components/request-service/RequestSuccess";

import useRequestService from "@/hooks/useRequestService";

export default function RequestService() {
  const location = useLocation();

  const [currentStep, setCurrentStep] = useState(1);

  const preselectionHandledRef = useRef(false);

  const {
    packages,
    services,

    requestType,
    selectedPackage,
    selectedServices,
    selectedExtras,

    propertyDetails,
    serviceDetails,
    customerDetails,

    includedServices,
    availableExtras,

    hasValidServiceSelection,
    hasValidPropertyDetails,
    hasValidServiceDetails,
    hasValidCustomerDetails,

    canReview,
    submitting,
    submitted,

    updateCustomerField,
    updateServiceField,
    updatePropertyField,

    selectPackage,
    selectCustom,
    selectUnsure,

    toggleService,
    toggleExtra,

    getSelectedPackageName,
    getServiceNames,

    submitRequest,
  } = useRequestService();

  /*
  |--------------------------------------------------------------------------
  | PACKAGE PRESELECTION FROM LANDING
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const packageId = location.state?.packageId;

    if (!packageId) {
      return;
    }

    if (preselectionHandledRef.current) {
      return;
    }

    if (!packages.length) {
      return;
    }

    const packageExists = packages.some(
      (cleaningPackage) => cleaningPackage.id === packageId,
    );

    if (!packageExists) {
      preselectionHandledRef.current = true;
      return;
    }

    selectPackage(packageId);

    preselectionHandledRef.current = true;
  }, [location.state, packages, selectPackage]);

  /*
  |--------------------------------------------------------------------------
  | STEP VALIDATION
  |--------------------------------------------------------------------------
  */

  const canContinueCurrentStep =
    currentStep === 1
      ? hasValidServiceSelection
      : currentStep === 2
        ? hasValidPropertyDetails
        : currentStep === 3
          ? hasValidServiceDetails
          : currentStep === 4
            ? hasValidCustomerDetails
            : true;

  function nextStep() {
    if (!canContinueCurrentStep) {
      return;
    }

    setCurrentStep((current) => Math.min(current + 1, 5));
  }

  function previousStep() {
    setCurrentStep((current) => Math.max(current - 1, 1));
  }

  /*
  |--------------------------------------------------------------------------
  | SCROLL TO TOP BETWEEN STEPS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentStep]);

  return (
    <main className="min-h-screen bg-[#F9FAF9] pt-20 text-[#1A1A1A]">
      <Navbar />

      {/* PAGE INTRO */}
      <section className="px-6 pb-8 pt-14 md:pb-10 md:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#2E7D32]">
            Request a Cleaning
          </p>

          <h1 className="font-heading text-4xl leading-tight text-[#1A1A1A] md:text-5xl lg:text-6xl">
            Tell us about your home
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#1A1A1A]/60 md:text-lg">
            A few simple steps help us understand what you need. We'll review
            everything personally before confirming your service.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-[#1A1A1A]/45">
            <ShieldCheck className="h-4 w-4 text-[#2E7D32]" />

            <span>No payment required. This is not a confirmed booking.</span>
          </div>
        </div>
      </section>

      {/* REQUEST WIZARD */}
      <section className="px-6 pb-20 md:pb-28">
        <div className="mx-auto max-w-6xl">
          {!submitted && <RequestProgress currentStep={currentStep} />}

          <div className="overflow-hidden rounded-3xl border border-[#2E7D32]/10 bg-white shadow-xl shadow-[#2E7D32]/5">
            {submitted ? (
              <div className="p-6 md:p-10 lg:p-12">
                <RequestSuccess
                  firstName={customerDetails.firstName}
                  preferredContact={customerDetails.preferredContact}
                />
              </div>
            ) : (
              <>
                <div className="p-6 md:p-10 lg:p-12">
                  {/* STEP 1 - SERVICE */}
                  {currentStep === 1 && (
                    <ServiceSelectionStep
                      packages={packages}
                      services={services}
                      requestType={requestType}
                      selectedPackage={selectedPackage}
                      selectedServices={selectedServices}
                      selectedExtras={selectedExtras}
                      includedServices={includedServices}
                      availableExtras={availableExtras}
                      onSelectPackage={selectPackage}
                      onSelectCustom={selectCustom}
                      onSelectUnsure={selectUnsure}
                      onToggleService={toggleService}
                      onToggleExtra={toggleExtra}
                    />
                  )}

                  {/* STEP 2 - PROPERTY */}
                  {currentStep === 2 && (
                    <PropertyStep
                      value={propertyDetails}
                      onFieldChange={updatePropertyField}
                    />
                  )}

                  {/* STEP 3 - SCHEDULE */}
                  {currentStep === 3 && (
                    <ScheduleStep
                      value={serviceDetails}
                      onFieldChange={updateServiceField}
                    />
                  )}

                  {/* STEP 4 - CUSTOMER */}
                  {currentStep === 4 && (
                    <CustomerStep
                      value={customerDetails}
                      onFieldChange={updateCustomerField}
                    />
                  )}

                  {/* STEP 5 - REVIEW */}
                  {currentStep === 5 && (
                    <RequestReview
                      requestType={requestType}
                      selectedExtras={selectedExtras}
                      selectedServices={selectedServices}
                      propertyDetails={propertyDetails}
                      serviceDetails={serviceDetails}
                      customerDetails={customerDetails}
                      getSelectedPackageName={getSelectedPackageName}
                      getServiceNames={getServiceNames}
                      submitting={submitting}
                      onSubmit={submitRequest}
                    />
                  )}
                </div>

                {/* WIZARD NAVIGATION */}
                <div className="flex items-center justify-between border-t border-[#2E7D32]/10 bg-[#F9FAF9]/60 px-6 py-5 md:px-10 lg:px-12">
                  <div>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={previousStep}
                        disabled={submitting}
                        className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-[#1A1A1A]/60 transition-all hover:bg-white hover:text-[#1A1A1A] disabled:opacity-50"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </button>
                    )}
                  </div>

                  {currentStep < 5 && (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!canContinueCurrentStep}
                      className="rounded-full bg-[#2E7D32] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#256b29] hover:shadow-lg hover:shadow-[#2E7D32]/20 disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-[#1A1A1A]/10 disabled:text-[#1A1A1A]/30 disabled:shadow-none"
                    >
                      Continue →
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {currentStep === 5 && !canReview && (
            <p className="mt-4 text-center text-sm text-amber-700">
              Some required information is still missing. Go back and complete
              the previous steps.
            </p>
          )}

          {/* BOTTOM REASSURANCE */}
          <p className="mx-auto mt-6 max-w-xl text-center text-xs leading-relaxed text-[#1A1A1A]/40">
            MG Cleaning will review your request and contact you before
            confirming any service.
          </p>
        </div>
      </section>
    </main>
  );
}
