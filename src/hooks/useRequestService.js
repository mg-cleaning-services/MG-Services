import { useMemo, useState } from "react";

import {
  getPackages,
  getServices,
  getPackageServices,
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
  const packages = getPackages();
  const services = getServices();

  const [requestType, setRequestType] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState([]);

  const [propertyDetails, setPropertyDetails] = useState(
    initialPropertyDetails,
  );

  const [serviceDetails, setServiceDetails] = useState(initialServiceDetails);

  const [customerDetails, setCustomerDetails] = useState(
    initialCustomerDetails,
  );

  const [submitting, setSubmitting] = useState(false);

  const includedServices = useMemo(() => {
    if (!selectedPackage) {
      return [];
    }

    return getPackageServices(selectedPackage);
  }, [selectedPackage]);

  const availableExtras = useMemo(() => {
    const includedServiceIds = includedServices.map((service) => service.id);

    return services.filter(
      (service) => !includedServiceIds.includes(service.id),
    );
  }, [includedServices, services]);

  const hasValidServiceSelection =
    requestType === "package" ||
    requestType === "unsure" ||
    (requestType === "custom" && selectedServices.length > 0);

  const canReview =
    hasValidServiceSelection &&
    propertyDetails.propertyType &&
    propertyDetails.bedrooms !== "" &&
    propertyDetails.bathrooms !== "" &&
    propertyDetails.suburb &&
    serviceDetails.preferredDate &&
    serviceDetails.preferredTime &&
    customerDetails.firstName &&
    customerDetails.phone &&
    customerDetails.preferredContact;

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

  async function submitRequest() {
    if (!canReview || submitting) {
      return;
    }

    try {
      setSubmitting(true);

      const requestData = buildRequestData();

      const createdRequest = await createRequest(requestData);

      alert("Your cleaning request has been sent successfully.");

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
  };
}
