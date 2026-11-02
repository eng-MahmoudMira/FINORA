import { describe, expect, it } from "vitest";
import { DEMO_CUSTOMERS } from "@/data/mockData";
import {
  churnRiskFor,
  getDemoOverview,
  runCustomer360,
} from "@/services/predictionService";

describe("FINORA mock prediction service contract", () => {
  it("stops a synthetic review-path workflow after fraud screening", async () => {
    const reviewPathCustomer = DEMO_CUSTOMERS.find(
      (customer) => customer.demoId === "C018",
    );
    expect(reviewPathCustomer).toBeDefined();

    const report = await runCustomer360(reviewPathCustomer!);

    expect(report.flagged).toBe(true);
    expect(report.fraud.probability).toBeGreaterThanOrEqual(
      report.fraud.threshold,
    );
    expect(report.churn).toBeNull();
    expect(report.offers).toBeNull();
  });

  it("continues the workflow for a non-flagged synthetic profile and never returns owned products", async () => {
    const standardCustomer = DEMO_CUSTOMERS.find(
      (customer) => customer.demoId === "C001",
    );
    expect(standardCustomer).toBeDefined();

    const report = await runCustomer360(standardCustomer!);

    expect(report.flagged).toBe(false);
    expect(report.churn).not.toBeNull();
    expect(report.offers).not.toBeNull();
    expect(report.offers?.offers).toHaveLength(3);
    expect(
      report.offers?.offers.every(
        (offer) => !standardCustomer!.ownedProducts.includes(offer.product),
      ),
    ).toBe(true);
  });

  it("keeps risk bands and overview totals inside their declared demo contract", () => {
    expect(churnRiskFor(0.299)).toBe("Low");
    expect(churnRiskFor(0.3)).toBe("Medium");
    expect(churnRiskFor(0.6)).toBe("High");

    const overview = getDemoOverview();
    expect(overview.totalCustomers).toBe(20);
    expect(overview.flaggedCount).toBe(3);
    expect(
      overview.churnBands.reduce((total, item) => total + item.count, 0),
    ).toBe(17);
  });
});
