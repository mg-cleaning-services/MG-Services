import { getServiceById } from "@/services/cleaningService";

function cleanPhoneNumber(phone = "") {
  return phone.replace(/\D/g, "");
}

async function getJobAdditionalServices(job) {
  const selectedServiceIds =
    job.service?.requestType === "custom"
      ? job.service?.selectedServices || []
      : job.service?.extras || [];

  const quantityServiceIds = Object.keys(job.service?.serviceQuantities || {});

  const serviceIds = [
    ...new Set([...selectedServiceIds, ...quantityServiceIds]),
  ];

  const services = await Promise.all(
    serviceIds.map(async (serviceId) => {
      const service = await getServiceById(serviceId);

      if (!service) {
        return null;
      }

      const quantity = Math.max(
        1,
        Number(job.service?.serviceQuantities?.[serviceId] || 1),
      );

      return {
        id: service.id,
        name: service.name,
        quantity,
        unit: service.unit,
      };
    }),
  );

  return services.filter(Boolean);
}

function formatServiceQuantity(service) {
  if (service.quantity <= 1) {
    return service.name;
  }

  return `${service.name} × ${service.quantity}`;
}

export async function buildCleanerJobMessage(job) {
  const additionalServices = await getJobAdditionalServices(job);

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
    `Job: ${job.jobCode || job.id}`,
    `Client: ${job.customer.firstName} ${job.customer.lastName}`,
    job.customer?.phone ? `Phone: ${job.customer.phone}` : null,
    "",
    `Date: ${job.schedule.serviceDate}`,
    `Start time: ${job.schedule.startTime}`,
    job.schedule.endTime ? `End time: ${job.schedule.endTime}` : null,
    job.estimation?.labourHours != null
      ? `Estimated labour: ${job.estimation.labourHours} hours`
      : null,
    "",
    `Address: ${address}`,
    "",
    `Property: ${job.property.propertyType}`,
    `Bedrooms: ${job.property.bedrooms}`,
    `Bathrooms: ${job.property.bathrooms}`,
    job.property?.floors != null ? `Floors: ${job.property.floors}` : null,
    `Pets: ${job.property.pets || "Not specified"}`,
    "",
    job.service?.packageName
      ? `Package: ${job.service.packageName}`
      : "Package: Custom cleaning",
    "",
    "Additional services:",
    additionalServices.length > 0
      ? additionalServices
          .map((service) => `• ${formatServiceQuantity(service)}`)
          .join("\n")
      : "• None",
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

export async function buildCustomerCleanerMessage(job, employee) {
  return [
    `Hi ${job.customer.firstName || "there"},`,
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
    job.service?.packageName
      ? `Service: ${job.service.packageName}`
      : "Service: Custom cleaning",
    `Date: ${job.schedule.serviceDate}`,
    job.schedule.endTime
      ? `Time: ${job.schedule.startTime} - ${job.schedule.endTime}`
      : `Time: ${job.schedule.startTime}`,
    "",
    "We've prepared an introduction card so you can get to know the person who will be looking after your home.",
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
