import services from "@/data/services.json";
import packages from "@/data/packages.json";

export function getServices() {
  return services.filter((service) => service.active);
}

export function getPackages() {
  return packages.filter((cleaningPackage) => cleaningPackage.active);
}

export function getServiceById(id) {
  return services.find((service) => service.id === id);
}

export function getPackageById(id) {
  return packages.find((cleaningPackage) => cleaningPackage.id === id);
}

export function getPackageServices(packageId) {
  const cleaningPackage = getPackageById(packageId);

  if (!cleaningPackage) {
    return [];
  }

  return cleaningPackage.includedServices
    .map((serviceId) => getServiceById(serviceId))
    .filter(Boolean);
}
