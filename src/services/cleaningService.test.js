import { describe, expect, it, vi } from "vitest";

// The estimate is pure logic; the Supabase client is never used here.
vi.mock("@/lib/supabase", () => ({ supabase: {} }));

const { calculateServiceEstimate } = await import("./cleaningService");

/*
 * A small fake catalogue with the same shape as the Supabase tables.
 * Prices are made up: these tests check the rules, not the real prices.
 */
const catalog = {
  packagePricing: [
    { package_id: "regular", bedrooms: 2, bathrooms: 1, price: 180, estimated_labour_hours: 3 },
    { package_id: "regular", bedrooms: 3, bathrooms: 2, price: 240, estimated_labour_hours: 4 },
  ],
  packageServices: [
    // The regular package already includes one oven clean and one carpet area.
    { package_id: "regular", service_id: "oven" },
    { package_id: "regular", service_id: "carpet" },
  ],
  services: [
    { id: "oven", name: "Oven", unit: "oven", pricing_type: "fixed" },
    { id: "balcony", name: "Balcony", unit: "balcony", pricing_type: "fixed" },
    { id: "carpet", name: "Carpet", unit: "area", pricing_type: "tiered" },
    { id: "windows", name: "Windows", unit: "job", pricing_type: "fixed", base_price: 60, estimated_labour_hours: 1 },
    { id: "fridge", name: "Fridge", unit: "fridge", pricing_type: "fixed" },
    { id: "mystery", name: "No price yet", unit: "job", pricing_type: "fixed" },
  ],
  servicePricingOptions: [
    { service_id: "oven", quantity: 1, price: 70, estimated_labour_hours: 1 },
    { service_id: "balcony", quantity: null, price: 85, estimated_labour_hours: 1 },
    { service_id: "carpet", quantity: 1, price: 50, estimated_labour_hours: 1 },
    { service_id: "carpet", quantity: 2, price: 75, estimated_labour_hours: 1.5 },
    { service_id: "carpet", quantity: 3, price: 105, estimated_labour_hours: 2 },
    // Fridge is sold as a pack of two only.
    { service_id: "fridge", quantity: 2, price: 90, estimated_labour_hours: 1 },
  ],
};

const property = { bedrooms: 3, bathrooms: 2 };

function packageRequest(overrides = {}) {
  return { requestType: "package", packageId: "regular", extras: [], serviceQuantities: {}, ...overrides };
}

function estimate(service, prop = property) {
  return calculateServiceEstimate({ service, property: prop, catalog });
}

describe("calculateServiceEstimate", () => {
  it("returns null when data is missing", () => {
    expect(calculateServiceEstimate({ service: null, property, catalog })).toBeNull();
    expect(calculateServiceEstimate({ service: packageRequest(), property: null, catalog })).toBeNull();
    expect(calculateServiceEstimate({ service: packageRequest(), property, catalog: null })).toBeNull();
  });

  describe("packages", () => {
    it("uses the price for the exact bedrooms and bathrooms", () => {
      const result = estimate(packageRequest());
      expect(result.packagePrice).toBe(240);
      expect(result.packageLabourHours).toBe(4);
      expect(result.estimatedPrice).toBe(240);
      expect(result.calculationComplete).toBe(true);
    });

    it("is marked incomplete when that property size has no price", () => {
      const result = estimate(packageRequest(), { bedrooms: 5, bathrooms: 3 });
      expect(result.estimatedPrice).toBe(0);
      expect(result.calculationComplete).toBe(false);
    });

    it("adds extras on top of the package", () => {
      const result = estimate(packageRequest({ extras: ["balcony", "windows"] }));
      expect(result.extrasPrice).toBe(85 + 60);
      expect(result.estimatedPrice).toBe(240 + 85 + 60);
      expect(result.estimatedLabourHours).toBe(4 + 1 + 1);
    });

    it("does not charge again for one unit already included", () => {
      const result = estimate(packageRequest({ serviceQuantities: { oven: 1 } }));
      expect(result.extrasPrice).toBe(0);
      expect(result.estimatedPrice).toBe(240);
    });

    it("charges only the units above what is included", () => {
      const result = estimate(packageRequest({ serviceQuantities: { oven: 3 } }));
      const oven = result.serviceBreakdown.find((s) => s.serviceId === "oven");
      expect(oven).toMatchObject({ requestedQuantity: 3, includedQuantity: 1, additionalQuantity: 2 });
      expect(result.extrasPrice).toBe(2 * 70);
    });

    it("uses the tier matching the extra units for tiered services", () => {
      // 3 carpet areas requested, 1 included -> the 2-area tier applies.
      const result = estimate(packageRequest({ serviceQuantities: { carpet: 3 } }));
      expect(result.extrasPrice).toBe(75);
      expect(result.calculationComplete).toBe(true);
    });
  });

  describe("custom requests", () => {
    function customRequest(selectedServices, serviceQuantities = {}) {
      return { requestType: "custom", selectedServices, serviceQuantities };
    }

    it("charges every selected service and no package", () => {
      const result = estimate(customRequest(["oven", "balcony"]));
      expect(result.packagePrice).toBe(0);
      expect(result.estimatedPrice).toBe(70 + 85);
    });

    it("multiplies one-unit prices by the quantity", () => {
      const result = estimate(customRequest(["balcony"], { balcony: 3 }));
      expect(result.estimatedPrice).toBe(3 * 85);
    });

    it("never invents a price outside the tier table", () => {
      const result = estimate(customRequest(["carpet"], { carpet: 5 }));
      expect(result.estimatedPrice).toBe(0);
      expect(result.calculationComplete).toBe(false);
    });

    it("requires an exact match for options sold in packs", () => {
      expect(estimate(customRequest(["fridge"], { fridge: 2 })).estimatedPrice).toBe(90);

      const single = estimate(customRequest(["fridge"], { fridge: 1 }));
      expect(single.estimatedPrice).toBe(0);
      expect(single.calculationComplete).toBe(false);
    });

    it("falls back to the base price when there are no pricing options", () => {
      const result = estimate(customRequest(["windows"], { windows: 2 }));
      expect(result.estimatedPrice).toBe(120);
      expect(result.estimatedLabourHours).toBe(2);
    });

    it("is marked incomplete when a service has no price at all", () => {
      const result = estimate(customRequest(["oven", "mystery"]));
      expect(result.estimatedPrice).toBe(70);
      expect(result.calculationComplete).toBe(false);
    });

    it("is marked incomplete when a service is not in the catalogue", () => {
      const result = estimate(customRequest(["deleted-service"]));
      expect(result.calculationComplete).toBe(false);
    });

    it("treats a quantity of zero or less as one", () => {
      const result = estimate(customRequest(["balcony"], { balcony: 0 }));
      expect(result.estimatedPrice).toBe(85);
    });
  });
});
