import ServiceSelectionStep from "@/components/request-service/ServiceSelectionStep";
import PropertyStep from "@/components/request-service/PropertyStep";
import ScheduleStep from "@/components/request-service/ScheduleStep";
import CustomerStep from "@/components/request-service/CustomerStep";
import RequestReview from "@/components/request-service/RequestReview";

import useRequestService from "@/hooks/useRequestService";

export default function RequestService() {
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

    canReview,
    submitting,

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

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-6 py-16">
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

        {requestType && (
          <>
            <PropertyStep
              value={propertyDetails}
              onFieldChange={updatePropertyField}
            />

            <ScheduleStep
              value={serviceDetails}
              onFieldChange={updateServiceField}
            />

            <CustomerStep
              value={customerDetails}
              onFieldChange={updateCustomerField}
            />
          </>
        )}

        {canReview && (
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
      </section>
    </main>
  );
}
