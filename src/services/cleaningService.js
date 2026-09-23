import { supabase } from "@/lib/supabase";

/*
|--------------------------------------------------------------------------
| SERVICE PACKAGES
|--------------------------------------------------------------------------
*/

export async function getPackages() {
  const { data, error } = await supabase
    .from("service_packages")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function getPackageById(id) {
  if (!id) {
    return null;
  }

  const { data, error } = await supabase
    .from("service_packages")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| CLEANING SERVICES
|--------------------------------------------------------------------------
*/

export async function getServices() {
  const { data, error } = await supabase
    .from("cleaning_services")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function getServiceById(id) {
  if (!id) {
    return null;
  }

  const { data, error } = await supabase
    .from("cleaning_services")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| PACKAGE SERVICES
|--------------------------------------------------------------------------
*/

export async function getPackageServices(packageId) {
  if (!packageId) {
    return [];
  }

  const { data, error } = await supabase
    .from("package_services")
    .select(
      `
      display_order,
      service:cleaning_services (
        id,
        slug,
        name,
        description,
        category,
        pricing_type,
        unit,
        base_price,
        estimated_labour_hours,
        available_as_addon,
        publicly_visible,
        active,
        display_order
      )
    `,
    )
    .eq("package_id", packageId)
    .order("display_order", { ascending: true });

  if (error) {
    throw error;
  }

  return (data || [])
    .map((item) => item.service)
    .filter((service) => service?.active);
}

/*
|--------------------------------------------------------------------------
| PACKAGE PRICING
|--------------------------------------------------------------------------
*/

export async function getPackagePricing(packageId, bedrooms, bathrooms) {
  if (!packageId || !bedrooms || !bathrooms) {
    return null;
  }

  const { data, error } = await supabase
    .from("package_pricing")
    .select("*")
    .eq("package_id", packageId)
    .eq("bedrooms", Number(bedrooms))
    .eq("bathrooms", Number(bathrooms))
    .eq("active", true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| SERVICE PRICING OPTIONS
|--------------------------------------------------------------------------
*/

export async function getServicePricingOptions(serviceId) {
  if (!serviceId) {
    return [];
  }

  const { data, error } = await supabase
    .from("service_pricing_options")
    .select("*")
    .eq("service_id", serviceId)
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}

/*
|--------------------------------------------------------------------------
| PACKAGES WITH INCLUDED SERVICES
|--------------------------------------------------------------------------
*/

export async function getPackagesWithServices() {
  const { data, error } = await supabase
    .from("service_packages")
    .select(
      `
      *,
      package_services (
        display_order,
        service:cleaning_services (
          id,
          slug,
          name,
          description,
          category,
          active
        )
      )
    `,
    )
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    throw error;
  }

  return (data || []).map((cleaningPackage) => ({
    ...cleaningPackage,

    includedServices: (cleaningPackage.package_services || [])
      .sort((a, b) => a.display_order - b.display_order)
      .map((item) => item.service)
      .filter((service) => service?.active),
  }));
}

/*
|--------------------------------------------------------------------------
| FULL PRICING CATALOG
|--------------------------------------------------------------------------
*/

export async function getPricingCatalog() {
  const [
    packagesResult,
    packagePricingResult,
    servicesResult,
    servicePricingResult,
    packageServicesResult,
  ] = await Promise.all([
    supabase
      .from("service_packages")
      .select("*")
      .eq("active", true)
      .order("display_order"),

    supabase.from("package_pricing").select("*").eq("active", true),

    supabase
      .from("cleaning_services")
      .select("*")
      .eq("active", true)
      .order("display_order"),

    supabase
      .from("service_pricing_options")
      .select("*")
      .eq("active", true)
      .order("display_order"),

    supabase.from("package_services").select("*").order("display_order"),
  ]);

  const results = [
    packagesResult,
    packagePricingResult,
    servicesResult,
    servicePricingResult,
    packageServicesResult,
  ];

  const failedResult = results.find((result) => result.error);

  if (failedResult) {
    throw failedResult.error;
  }

  return {
    packages: packagesResult.data || [],
    packagePricing: packagePricingResult.data || [],
    services: servicesResult.data || [],
    servicePricingOptions: servicePricingResult.data || [],
    packageServices: packageServicesResult.data || [],
  };
}

/*
|--------------------------------------------------------------------------
| CALCULATION HELPERS
|--------------------------------------------------------------------------
*/

/*
 * Returns true when a service is included in the selected package.
 *
 * Business rule:
 * an included quantifiable service includes exactly ONE unit/area.
 */
function isServiceIncludedInPackage(serviceId, packageId, catalog) {
  if (!serviceId || !packageId) {
    return false;
  }

  return catalog.packageServices.some(
    (item) => item.package_id === packageId && item.service_id === serviceId,
  );
}

/*
 * Finds the exact pricing tier for a requested quantity.
 *
 * Example:
 *
 * Carpet:
 * 1 area  -> $50
 * 2 areas -> $75
 * 3 areas -> $105
 *
 * We do NOT extrapolate tiered pricing.
 */
function findExactQuantityOption(serviceId, quantity, catalog) {
  return catalog.servicePricingOptions.find(
    (option) =>
      option.service_id === serviceId &&
      Number(option.quantity) === Number(quantity),
  );
}

/*
 * Calculates the additional charge for one service.
 *
 * quantity here means the BILLABLE quantity after subtracting
 * anything already included in the package.
 */
function calculateAdditionalService({ cleaningService, quantity, catalog }) {
  if (!cleaningService || quantity <= 0) {
    return {
      price: 0,
      labourHours: 0,
      complete: true,
    };
  }

  const pricingOptions = catalog.servicePricingOptions.filter(
    (option) => option.service_id === cleaningService.id,
  );

  /*
  |--------------------------------------------------------------------------
  | TIERED PRICING
  |--------------------------------------------------------------------------
  |
  | AC, Carpet, etc.
  |
  | We only accept an exact configured quantity.
  | We never invent a price outside the pricing table.
  |
  */

  if (cleaningService.pricing_type === "tiered") {
    const option = findExactQuantityOption(
      cleaningService.id,
      quantity,
      catalog,
    );

    if (!option) {
      return {
        price: 0,
        labourHours: 0,
        complete: false,
      };
    }

    return {
      price: Number(option.price || 0),
      labourHours: Number(option.estimated_labour_hours || 0),
      complete: true,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | SINGLE UNIT PRICING OPTION
  |--------------------------------------------------------------------------
  |
  | Example:
  |
  | Balcony:
  | 1 balcony = $85
  |
  | If 2 additional balconies are required:
  | 2 × $85
  |
  | A null quantity in an old pricing option is treated as
  | a standard one-unit option.
  |
  */

  if (pricingOptions.length === 1) {
    const option = pricingOptions[0];

    const optionQuantity =
      Number(option.quantity) > 0 ? Number(option.quantity) : 1;

    /*
     * Only multiply when the configured option represents
     * one unit.
     */
    if (optionQuantity === 1) {
      return {
        price: Number(option.price || 0) * quantity,

        labourHours: Number(option.estimated_labour_hours || 0) * quantity,

        complete: true,
      };
    }

    /*
     * If the option represents something other than one unit,
     * require an exact match.
     */
    if (optionQuantity === quantity) {
      return {
        price: Number(option.price || 0),
        labourHours: Number(option.estimated_labour_hours || 0),
        complete: true,
      };
    }

    return {
      price: 0,
      labourHours: 0,
      complete: false,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | MULTIPLE NON-TIERED OPTIONS
  |--------------------------------------------------------------------------
  |
  | Try an exact quantity match.
  |
  */

  if (pricingOptions.length > 1) {
    const option = findExactQuantityOption(
      cleaningService.id,
      quantity,
      catalog,
    );

    if (!option) {
      return {
        price: 0,
        labourHours: 0,
        complete: false,
      };
    }

    return {
      price: Number(option.price || 0),
      labourHours: Number(option.estimated_labour_hours || 0),
      complete: true,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | BASE PRICE FALLBACK
  |--------------------------------------------------------------------------
  */

  if (cleaningService.base_price != null) {
    return {
      price: Number(cleaningService.base_price || 0) * quantity,

      labourHours:
        Number(cleaningService.estimated_labour_hours || 0) * quantity,

      complete: true,
    };
  }

  /*
   * No safe pricing rule available.
   */
  return {
    price: 0,
    labourHours: 0,
    complete: false,
  };
}

/*
|--------------------------------------------------------------------------
| CALCULATE SERVICE ESTIMATE
|--------------------------------------------------------------------------
*/

export function calculateServiceEstimate({ service, property, catalog }) {
  if (!service || !property || !catalog) {
    return null;
  }

  let packagePrice = 0;
  let packageLabourHours = 0;

  let extrasPrice = 0;
  let extrasLabourHours = 0;

  let calculationComplete = true;

  const serviceBreakdown = [];

  /*
  |--------------------------------------------------------------------------
  | PACKAGE BASE PRICE
  |--------------------------------------------------------------------------
  */

  if (service.requestType === "package" && service.packageId) {
    const pricing = catalog.packagePricing.find(
      (item) =>
        item.package_id === service.packageId &&
        Number(item.bedrooms) === Number(property.bedrooms) &&
        Number(item.bathrooms) === Number(property.bathrooms),
    );

    if (pricing) {
      packagePrice = Number(pricing.price || 0);

      packageLabourHours = Number(pricing.estimated_labour_hours || 0);
    } else {
      calculationComplete = false;
    }
  }

  /*
  |--------------------------------------------------------------------------
  | SERVICES TO CALCULATE
  |--------------------------------------------------------------------------
  |
  | Custom:
  | selectedServices are all billable.
  |
  | Package:
  | extras are services not normally included.
  |
  | We ALSO inspect serviceQuantities because Maxi can increase
  | the quantity of a service that is already included.
  |
  */

  const selectedServiceIds =
    service.requestType === "custom"
      ? service.selectedServices || []
      : service.extras || [];

  const quantityServiceIds = Object.keys(service.serviceQuantities || {});

  /*
   * Merge both lists so that an included package service
   * with quantity > 1 is also calculated.
   */
  const serviceIdsToCalculate = [
    ...new Set([...selectedServiceIds, ...quantityServiceIds]),
  ];

  /*
  |--------------------------------------------------------------------------
  | CALCULATE EACH SERVICE
  |--------------------------------------------------------------------------
  */

  for (const serviceId of serviceIdsToCalculate) {
    const cleaningService = catalog.services.find(
      (item) => item.id === serviceId,
    );

    if (!cleaningService) {
      calculationComplete = false;
      continue;
    }

    const included =
      service.requestType === "package" &&
      isServiceIncludedInPackage(serviceId, service.packageId, catalog);

    /*
     * Quantity entered by Maxi represents TOTAL quantity required.
     *
     * If no explicit quantity exists:
     *
     * - selected additional service = 1
     * - included service = 1
     */
    const requestedQuantity = Math.max(
      1,
      Number(service.serviceQuantities?.[serviceId] || 1),
    );

    const includedQuantity = included ? 1 : 0;

    const additionalQuantity = Math.max(
      0,
      requestedQuantity - includedQuantity,
    );

    /*
     * The package price already contains the included unit.
     * Therefore only additionalQuantity is priced here.
     */
    const result = calculateAdditionalService({
      cleaningService,
      quantity: additionalQuantity,
      catalog,
    });

    extrasPrice += result.price;
    extrasLabourHours += result.labourHours;

    if (!result.complete) {
      calculationComplete = false;
    }

    serviceBreakdown.push({
      serviceId: cleaningService.id,
      serviceName: cleaningService.name,
      unit: cleaningService.unit,

      requestedQuantity,
      includedQuantity,
      additionalQuantity,

      additionalPrice: result.price,
      additionalLabourHours: result.labourHours,

      calculationComplete: result.complete,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | TOTAL
  |--------------------------------------------------------------------------
  */

  const estimatedPrice = packagePrice + extrasPrice;

  const estimatedLabourHours = packageLabourHours + extrasLabourHours;

  return {
    packagePrice,
    packageLabourHours,

    extrasPrice,
    extrasLabourHours,

    estimatedPrice,
    estimatedLabourHours,

    calculationComplete,

    serviceBreakdown,
  };
}
