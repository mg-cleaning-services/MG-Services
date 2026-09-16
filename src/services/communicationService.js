import { getPackageById, getServiceById } from "@/services/cleaningService";

function cleanPhoneNumber(phone = "") {
  return phone.replace(/\D/g, "");
}

function getJobServiceNames(job) {
  const names = [];

  if (job.service.requestType === "package") {
    const cleaningPackage = getPackageById(job.service.packageId);

    if (cleaningPackage) {
      names.push(cleaningPackage.name);
    }
  }

  if (job.service.requestType === "custom") {
    job.service.selectedServices?.forEach((serviceId) => {
      const service = getServiceById(serviceId);

      if (service) {
        names.push(service.name);
      }
    });
  }

  job.service.extras?.forEach((serviceId) => {
    const service = getServiceById(serviceId);

    if (service) {
      names.push(service.name);
    }
  });

  return names;
}

export function buildCleanerJobMessage(job) {
  const services = getJobServiceNames(job);

  const address = [
    job.location?.address,
    job.location?.unit,
    job.location?.suburb,
    job.location?.postcode,
  ]
    .filter(Boolean)
    .join(", ");

  return [
    "Hi, you have been assigned a new MG Cleaning job.",
    "",
    `Job: ${job.id}`,
    `Client: ${job.customer.firstName} ${job.customer.lastName}`,
    "",
    `Date: ${job.schedule.date}`,
    `Start time: ${job.schedule.startTime}`,
    `Estimated duration: ${job.schedule.estimatedHours} hours`,
    "",
    `Address: ${address}`,
    "",
    `Property: ${job.property.propertyType}`,
    `Bedrooms: ${job.property.bedrooms}`,
    `Bathrooms: ${job.property.bathrooms}`,
    `Pets: ${job.property.pets || "Not specified"}`,
    "",
    `Services: ${
      services.length > 0 ? services.join(", ") : "Cleaning service"
    }`,
    "",
    job.notes?.cleaningPriorities
      ? `Cleaning priorities: ${job.notes.cleaningPriorities}`
      : null,
    "",
    job.access?.instructions
      ? `Access instructions: ${job.access.instructions}`
      : null,
    job.access?.parking ? `Parking: ${job.access.parking}` : null,
    job.access?.contactOnArrival
      ? "Please contact the customer when you arrive."
      : null,
    "",
    "Please contact Maxi if you have any questions.",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export function buildCustomerCleanerMessage(job, employee) {
  const customerName = job.customer.firstName || "there";

  const profileUrl = employee.slug
    ? `${window.location.origin}/team/${employee.slug}`
    : null;

  return [
    `Hi ${customerName},`,
    "",
    "Your cleaner for your upcoming MG Cleaning service has been assigned.",
    "",
    `Cleaner: ${employee.name}`,
    `Role: ${employee.role}`,
    employee.years
      ? `Experience: ${employee.years} ${
          employee.years === 1 ? "year" : "years"
        }`
      : null,
    "",
    `Date: ${job.schedule.date}`,
    `Time: ${job.schedule.startTime}`,
    "",
    "We've prepared an introduction card so you can get to know the person who will be looking after your home.",
    "",
    profileUrl ? `Learn more about ${employee.name}: ${profileUrl}` : null,
    "",
    "If you have any questions before your service, please contact us.",
    "",
    "MG Cleaning Melbourne",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export function createWhatsAppUrl(phone, message) {
  const cleanedPhone = cleanPhoneNumber(phone);

  if (!cleanedPhone) {
    return null;
  }

  return `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;
}
