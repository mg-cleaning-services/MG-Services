import { useEffect, useMemo, useState } from "react";

import {
  getPackagesWithServices,
  getServices,
} from "@/services/cleaningService";

import { createRequest } from "@/services/requestService";

const initialPropertyDetails = {
  propertyType: "",
  bedrooms: "",
  bathrooms: "",
  kitchens: "",
  balconies: "",
  laundries: "",
  floors: "",
  suburb: "",
  postcode: "",
  pets: "",
};

const initialServiceDetails = {
  preferredDate: "",
  preferredTime: "",
  condition: "",
  lastProfessionalClean: "",
  focusAreas: "",
};

const initialCustomerDetails = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  preferredContact: "",
};

export default function useRequestService() {
  /*
  |--------------------------------------------------------------------------
  | CATALOG
  |--------------------------------------------------------------------------
  */

  const [packages, setPackages] = useState([]);
  const [services, setServices] = useState([]);

  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | REQUEST STATE
  |--------------------------------------------------------------------------
  */

  const [requestType, setRequestType] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState([]);

  const includedServices = useMemo(() => {
    if (!selectedPackage) {
      return [];
    }

    const cleaningPackage = packages.find(
      (item) => item.id === selectedPackage,
    );

    return cleaningPackage?.includedServices || [];
  }, [packages, selectedPackage]);

  const [propertyDetails, setPropertyDetails] = useState(
    initialPropertyDetails,
  );

  const [serviceDetails, setServiceDetails] = useState(initialServiceDetails);

  const [customerDetails, setCustomerDetails] = useState(
    initialCustomerDetails,
  );

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | LOAD CATALOG
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let ignore = false;

    async function loadCatalog() {
      try {
        setCatalogLoading(true);
        setCatalogError("");

        const [packageData, serviceData] = await Promise.all([
          getPackagesWithServices(),
          getServices(),
        ]);

        if (ignore) {
          return;
        }

        setPackages(packageData);
        setServices(serviceData);
      } catch (error) {
        console.error("Could not load cleaning catalog:", error);

        if (!ignore) {
          setCatalogError("Could not load cleaning services.");
        }
      } finally {
        if (!ignore) {
          setCatalogLoading(false);
        }
      }
    }

    loadCatalog();

    return () => {
      ignore = true;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | AVAILABLE EXTRAS
  |--------------------------------------------------------------------------
  */

  const availableExtras = useMemo(() => {
    const includedServiceIds = includedServices.map((service) => service.id);

    return services.filter(
      (service) =>
        service.available_as_addon && !includedServiceIds.includes(service.id),
    );
  }, [includedServices, services]);

  const publicServices = useMemo(() => {
    return services.filter(
      (service) =>
        service.active &&
        service.available_as_addon &&
        service.publicly_visible,
    );
  }, [services]);

  /*
  |--------------------------------------------------------------------------
  | STEP 1 — SERVICE
  |--------------------------------------------------------------------------
  */

  const hasValidServiceSelection =
    requestType === "package"
      ? Boolean(selectedPackage)
      : requestType === "custom"
        ? selectedServices.length > 0
        : requestType === "unsure";

  /*
  |--------------------------------------------------------------------------
  | STEP 2 — PROPERTY
  |--------------------------------------------------------------------------
  */

  const hasValidPropertyDetails =
    Boolean(propertyDetails.propertyType) &&
    Boolean(propertyDetails.floors) &&
    Boolean(propertyDetails.bedrooms) &&
    Boolean(propertyDetails.bathrooms) &&
    Boolean(propertyDetails.kitchens) &&
    Boolean(propertyDetails.balconies) &&
    Boolean(propertyDetails.laundries) &&
    Boolean(propertyDetails.suburb?.trim()) &&
    Boolean(propertyDetails.postcode?.trim()) &&
    Boolean(propertyDetails.pets);

  /*
  |--------------------------------------------------------------------------
  | STEP 3 — SCHEDULE
  |--------------------------------------------------------------------------
  */

  const hasValidServiceDetails =
    Boolean(serviceDetails.preferredDate) &&
    Boolean(serviceDetails.preferredTime) &&
    Boolean(serviceDetails.condition) &&
    Boolean(serviceDetails.lastProfessionalClean);

  /*
  |--------------------------------------------------------------------------
  | STEP 4 — CONTACT
  |--------------------------------------------------------------------------
  */

  const hasRequiredContactDetails =
    Boolean(customerDetails.firstName?.trim()) &&
    Boolean(customerDetails.lastName?.trim()) &&
    Boolean(customerDetails.phone?.trim()) &&
    Boolean(customerDetails.preferredContact);

  const hasRequiredEmail =
    customerDetails.preferredContact !== "email" ||
    Boolean(customerDetails.email?.trim());

  const hasValidCustomerDetails = hasRequiredContactDetails && hasRequiredEmail;

  /*
  |--------------------------------------------------------------------------
  | FINAL REQUEST VALIDATION
  |--------------------------------------------------------------------------
  */

  const canReview =
    hasValidServiceSelection &&
    hasValidPropertyDetails &&
    hasValidServiceDetails &&
    hasValidCustomerDetails;

  /*
  |--------------------------------------------------------------------------
  | FIELD UPDATES
  |--------------------------------------------------------------------------
  */

  function updateCustomerField(field, value) {
    setCustomerDetails((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateServiceField(field, value) {
    setServiceDetails((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updatePropertyField(field, value) {
    setPropertyDetails((current) => ({
      ...current,
      [field]: value,
    }));
  }

  /*
  |--------------------------------------------------------------------------
  | SERVICE SELECTION
  |--------------------------------------------------------------------------
  */

  function selectPackage(packageId) {
    setRequestType("package");
    setSelectedPackage(packageId);
    setSelectedServices([]);
    setSelectedExtras([]);
  }

  function selectCustom() {
    setRequestType("custom");
    setSelectedPackage("");
    setSelectedServices([]);
    setSelectedExtras([]);
  }

  function selectUnsure() {
    setRequestType("unsure");
    setSelectedPackage("");
    setSelectedServices([]);
    setSelectedExtras([]);
  }

  function toggleService(serviceId) {
    setSelectedServices((current) =>
      current.includes(serviceId)
        ? current.filter((id) => id !== serviceId)
        : [...current, serviceId],
    );
  }

  function toggleExtra(serviceId) {
    setSelectedExtras((current) =>
      current.includes(serviceId)
        ? current.filter((id) => id !== serviceId)
        : [...current, serviceId],
    );
  }

  /*
  |--------------------------------------------------------------------------
  | DISPLAY HELPERS
  |--------------------------------------------------------------------------
  */

  function getSelectedPackageName() {
    const selected = packages.find(
      (cleaningPackage) => cleaningPackage.id === selectedPackage,
    );

    return selected?.name || "";
  }

  function getServiceNames(serviceIds) {
    return serviceIds
      .map((id) => services.find((service) => service.id === id)?.name)
      .filter(Boolean);
  }

  /*
  |--------------------------------------------------------------------------
  | BUILD REQUEST
  |--------------------------------------------------------------------------
  */

  function buildRequestData() {
    return {
      customer: {
        firstName: customerDetails.firstName.trim(),
        lastName: customerDetails.lastName.trim(),
        phone: customerDetails.phone.trim(),
        email: customerDetails.email.trim(),
        preferredContact: customerDetails.preferredContact,
      },

      service: {
        requestType,
        packageId: requestType === "package" ? selectedPackage : "",
        selectedServices: requestType === "custom" ? selectedServices : [],
        extras: requestType === "package" ? selectedExtras : [],
      },

      property: {
        ...propertyDetails,
      },

      schedule: {
        preferredDate: serviceDetails.preferredDate,
        preferredTime: serviceDetails.preferredTime,
      },

      condition: {
        level: serviceDetails.condition,
        lastProfessionalClean: serviceDetails.lastProfessionalClean,
      },

      notes: serviceDetails.focusAreas.trim(),
    };
  }

  /*
  |--------------------------------------------------------------------------
  | SUBMIT REQUEST
  |--------------------------------------------------------------------------
  */

  async function submitRequest() {
    if (!canReview || submitting) {
      return;
    }

    try {
      setSubmitting(true);

      const requestData = buildRequestData();

      const createdRequest = await createRequest(requestData);

      setSubmitted(true);

      return createdRequest;
    } catch (error) {
      console.error("Could not create request:", error);

      alert("We couldn't send your cleaning request. Please try again.");

      return null;
    } finally {
      setSubmitting(false);
    }
  }

  return {
    /*
     * Catalog
     */
    packages,
    services: publicServices,
    catalogLoading,
    catalogError,

    /*
     * Selection
     */
    requestType,
    selectedPackage,
    selectedServices,
    selectedExtras,

    propertyDetails,
    serviceDetails,
    customerDetails,

    includedServices,
    availableExtras,

    /*
     * Validation
     */
    hasValidServiceSelection,
    hasValidPropertyDetails,
    hasValidServiceDetails,
    hasValidCustomerDetails,

    canReview,

    /*
     * Status
     */
    submitting,
    submitted,

    /*
     * Updates
     */
    updateCustomerField,
    updateServiceField,
    updatePropertyField,

    selectPackage,
    selectCustom,
    selectUnsure,

    toggleService,
    toggleExtra,

    /*
     * Helpers
     */
    getSelectedPackageName,
    getServiceNames,

    submitRequest,
  };
}
