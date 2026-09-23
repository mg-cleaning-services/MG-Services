import { useEffect, useState } from "react";

import {
  calculateServiceEstimate,
  getPricingCatalog,
} from "@/services/cleaningService";

export default function useServiceEstimate({
  service,
  property,
  onEstimateChange,
}) {
  const [pricingCatalog, setPricingCatalog] = useState(null);

  const [calculationComplete, setCalculationComplete] = useState(true);
  const [serviceBreakdown, setServiceBreakdown] = useState([]);

  const [packagePrice, setPackagePrice] = useState(0);
  const [packageLabourHours, setPackageLabourHours] = useState(0);

  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD PRICING CATALOG
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let ignore = false;

    async function loadCatalog() {
      try {
        setCatalogLoading(true);
        setCatalogError("");

        const catalog = await getPricingCatalog();

        if (!ignore) {
          setPricingCatalog(catalog);
        }
      } catch (error) {
        console.error("Could not load pricing catalog:", error);

        if (!ignore) {
          setPricingCatalog(null);
          setCatalogError("Could not load pricing catalog.");
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
  | CALCULATE SERVICE ESTIMATE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!service || !property || !pricingCatalog) {
      return;
    }

    const result = calculateServiceEstimate({
      service,
      property,
      catalog: pricingCatalog,
    });

    if (!result) {
      return;
    }

    setCalculationComplete(result.calculationComplete);
    setServiceBreakdown(result.serviceBreakdown || []);

    setPackagePrice(result.packagePrice || 0);
    setPackageLabourHours(result.packageLabourHours || 0);

    onEstimateChange?.({
      price: result.estimatedPrice,
      labourHours: result.estimatedLabourHours,
    });
  }, [
    service,
    property?.bedrooms,
    property?.bathrooms,
    pricingCatalog,
    onEstimateChange,
  ]);

  const selectedPackage =
    pricingCatalog?.packages?.find(
      (pkg) => String(pkg.id) === String(service?.packageId),
    ) || null;

  return {
    pricingCatalog,
    selectedPackage,
    calculationComplete,
    serviceBreakdown,
    packagePrice,
    packageLabourHours,
    catalogLoading,
    catalogError,
  };
}
