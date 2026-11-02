import {
  DEMO_CUSTOMERS,
  PRODUCT_CATALOG,
  getCustomerById,
} from "@/data/mockData";
import type {
  ChurnDriver,
  ChurnPrediction,
  Customer360Report,
  DemoCustomer,
  FraudPrediction,
  OfferPrediction,
  OfferRecommendation,
  ProductId,
} from "@/types/finora";

// ─────────────────────────────────────────────────────────────────────────────
// Mock prediction service.
//
// Every prediction the UI shows passes through this module. When the Python
// ML backend is ready, only this file changes: each function posts the
// customer's model-specific columns to the API and returns the same
// interfaces. No component contains prediction logic.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Demo decision threshold copied from supplied fraud-artifact metadata.
 * Probabilities below are still deterministic mock outputs: this frontend
 * never loads or executes the serialized Python model.
 */
const FRAUD_THRESHOLD = 0.9386608004570007;
/** Churn risk bands: Low < 30%, Medium 30–60%, High > 60%. */
const LOW_CHURN = 0.3;
const HIGH_CHURN = 0.6;

/** Simulated network latency so the guided workflow feels like model inference. */
const LATENCY_MS = 550;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Deterministic per-customer pseudo-random generator (stable across reloads). */
function seededRandom(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (x: number) => Math.min(0.97, Math.max(0.01, x));

/** Sync model internals — shared by the async API surface and demo aggregates. */

function isSyntheticReviewPath(customer: DemoCustomer): boolean {
  return (
    customer.transaction.amount >= 4000 &&
    /(unusual amount|card-not-present|foreign transaction)/i.test(
      customer.demoTransactionType,
    )
  );
}

function computeFraudProbability(customer: DemoCustomer): number {
  const rand = seededRandom(`${customer.demoId}-fraud`);
  // Demo behaviour: transaction-shaped review paths clear the stored cutoff;
  // all other synthetic examples remain clearly below it. `demoTrueFraud` is
  // never read by the mock service or a future model request.
  return isSyntheticReviewPath(customer)
    ? clamp01(0.95 + rand() * 0.045)
    : clamp01(rand() * 0.06);
}

function computeChurnProbability(customer: DemoCustomer): number {
  const { profile } = customer;
  const rand = seededRandom(`${customer.demoId}-churn`);
  let score = 0.05;
  if (!profile.isActiveMember) score += 0.34;
  if (profile.numOfProducts === 1) score += 0.12;
  if (profile.age > 55) score += 0.14;
  if (profile.creditScore < 620) score += 0.12;
  if (profile.mortgage > 150) score += 0.1;
  if (profile.geography === "Germany") score += 0.06;
  if (profile.tenure >= 10) score -= 0.06;
  if (profile.balance > 100000) score -= 0.08;
  if (profile.age < 30) score += 0.02;
  score += rand() * 0.06;
  return clamp01(score);
}

export function churnRiskFor(probability: number): "Low" | "Medium" | "High" {
  return probability < LOW_CHURN
    ? "Low"
    : probability < HIGH_CHURN
      ? "Medium"
      : "High";
}

// ── Fraud ────────────────────────────────────────────────────────────────────

export async function predictFraud(
  customer: DemoCustomer,
): Promise<FraudPrediction> {
  await delay(LATENCY_MS);
  const probability = computeFraudProbability(customer);
  return {
    customerId: customer.demoId,
    probability,
    threshold: FRAUD_THRESHOLD,
    flagged: probability >= FRAUD_THRESHOLD,
    transactionAmount: customer.transaction.amount,
    evaluatedAt: new Date().toISOString(),
  };
}

// ── Churn ────────────────────────────────────────────────────────────────────

function churnDrivers(customer: DemoCustomer): ChurnDriver[] {
  const { profile } = customer;
  const drivers: ChurnDriver[] = [];
  if (!profile.isActiveMember) {
    drivers.push({
      label: "Inactive member",
      detail: "No meaningful product engagement recorded",
      impact: "increases",
    });
  }
  if (profile.numOfProducts === 1) {
    drivers.push({
      label: "Single-product relationship",
      detail: "Only one bank product held — weak attachment",
      impact: "increases",
    });
  }
  if (profile.mortgage > 150) {
    drivers.push({
      label: "Large mortgage exposure",
      detail: `Mortgage of $${profile.mortgage}k against $${profile.income}k income`,
      impact: "increases",
    });
  }
  if (profile.creditScore < 620) {
    drivers.push({
      label: "Below-average credit score",
      detail: `Credit score of ${profile.creditScore}`,
      impact: "increases",
    });
  }
  if (profile.age > 55) {
    drivers.push({
      label: "Later career stage",
      detail: `Age ${profile.age} — typical pre-retirement segment`,
      impact: "increases",
    });
  }
  if (profile.tenure >= 10) {
    drivers.push({
      label: "Long tenure",
      detail: `${profile.tenure} years with the bank`,
      impact: "decreases",
    });
  }
  if (profile.balance > 100000) {
    drivers.push({
      label: "High balance",
      detail: "Significant deposits held with the bank",
      impact: "decreases",
    });
  }
  return drivers;
}

export async function predictChurn(
  customer: DemoCustomer,
): Promise<ChurnPrediction> {
  await delay(LATENCY_MS);
  const probability = computeChurnProbability(customer);
  const risk = churnRiskFor(probability);
  return {
    customerId: customer.demoId,
    probability,
    risk,
    drivers: churnDrivers(customer),
    evaluatedAt: new Date().toISOString(),
  };
}

// ── Offers ───────────────────────────────────────────────────────────────────

/** Cross-sell propensity per product; owned products are excluded before ranking. */
function productPropensity(
  customer: DemoCustomer,
  product: ProductId,
  jitter: number,
): number {
  const { profile } = customer;
  switch (product) {
    case "Personal Loan":
      return clamp01(
        0.02 +
          profile.income / 400 +
          profile.ccAvg / 12 +
          (profile.education === 3 ? 0.05 : 0) +
          jitter,
      );
    case "Securities Account":
      return clamp01(
        0.03 +
          profile.income / 600 +
          (profile.mortgage > 0 ? 0.06 : 0) +
          (profile.age > 40 ? 0.04 : 0) +
          jitter,
      );
    case "CD Account":
      return clamp01(
        0.02 +
          profile.income / 500 +
          (customer.ownedProducts.includes("Securities Account") ? 0.08 : 0) +
          (profile.age > 45 ? 0.05 : 0) +
          jitter,
      );
    case "Online":
      return clamp01(
        0.28 + (profile.age < 45 ? 0.15 : 0) + profile.income / 1200 + jitter,
      );
    case "CreditCard":
      return clamp01(
        0.08 + profile.ccAvg / 8 + (profile.age < 60 ? 0.05 : 0) + jitter,
      );
  }
}

function computeOffers(
  customer: DemoCustomer,
  churnRisk: "Low" | "Medium" | "High",
): OfferRecommendation[] {
  const rand = seededRandom(`${customer.demoId}-offers`);
  return (Object.keys(PRODUCT_CATALOG) as ProductId[])
    .filter((product) => !customer.ownedProducts.includes(product))
    .map((product) => ({
      product,
      probability: productPropensity(customer, product, (rand() - 0.5) * 0.06),
    }))
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 3);
}

export async function predictOffers(
  customer: DemoCustomer,
  churnRisk: "Low" | "Medium" | "High",
): Promise<OfferPrediction> {
  await delay(LATENCY_MS);
  return {
    customerId: customer.demoId,
    sectionLabel:
      churnRisk === "High" ? "Retention Offers" : "Recommended Offers",
    offers: computeOffers(customer, churnRisk),
    evaluatedAt: new Date().toISOString(),
  };
}

// ── Demo aggregates for the Overview dashboard ───────────────────────────────
// The Python backend will serve these summaries from batch scoring.

export interface DemoOverview {
  totalCustomers: number;
  flaggedCount: number;
  churnBands: { band: "Low" | "Medium" | "High"; count: number }[];
  scenarios: { scenario: string; count: number }[];
  retentionFocus: number;
  offerOpportunities: number;
}

export function getDemoOverview(): DemoOverview {
  const churnBands: Record<"Low" | "Medium" | "High", number> = {
    Low: 0,
    Medium: 0,
    High: 0,
  };
  const scenarios = new Map<string, number>();
  let flaggedCount = 0;
  let retentionFocus = 0;
  let offerOpportunities = 0;

  for (const customer of DEMO_CUSTOMERS) {
    scenarios.set(
      customer.demoScenario,
      (scenarios.get(customer.demoScenario) ?? 0) + 1,
    );
    if (computeFraudProbability(customer) >= FRAUD_THRESHOLD) {
      flaggedCount++;
      continue;
    }
    const risk = churnRiskFor(computeChurnProbability(customer));
    churnBands[risk]++;
    if (risk === "High") retentionFocus++;
    offerOpportunities += computeOffers(customer, risk).length;
  }

  return {
    totalCustomers: DEMO_CUSTOMERS.length,
    flaggedCount,
    churnBands: (["Low", "Medium", "High"] as const).map((band) => ({
      band,
      count: churnBands[band],
    })),
    scenarios: [...scenarios.entries()].map(([scenario, count]) => ({
      scenario,
      count,
    })),
    retentionFocus,
    offerOpportunities,
  };
}

// ── Guided Customer 360 flow ─────────────────────────────────────────────────

export type WorkflowStage =
  | { stage: "fraud" }
  | { stage: "stopped-fraud" }
  | { stage: "churn" }
  | { stage: "offers" }
  | { stage: "done" };

export async function runCustomer360(
  customer: DemoCustomer,
): Promise<Customer360Report> {
  const fraud = await predictFraud(customer);
  if (fraud.flagged) {
    return {
      customer,
      fraud,
      churn: null,
      offers: null,
      flagged: true,
      generatedAt: new Date().toISOString(),
    };
  }
  const churn = await predictChurn(customer);
  const offers = await predictOffers(customer, churn.risk);
  return {
    customer,
    fraud,
    churn,
    offers,
    flagged: false,
    generatedAt: new Date().toISOString(),
  };
}

export interface PortfolioScreening {
  customer: DemoCustomer;
  probability: number;
  flagged: boolean;
}

/** Sync screening of the whole demo portfolio (dashboard + fraud page tables). */
export function screenPortfolio(): PortfolioScreening[] {
  return DEMO_CUSTOMERS.map((customer) => {
    const probability = computeFraudProbability(customer);
    return { customer, probability, flagged: probability >= FRAUD_THRESHOLD };
  });
}

export { DEMO_CUSTOMERS, getCustomerById };
