import type { DemoCustomer, ProductId, RecentActivity } from "@/types/finora";

// Demo dataset: 20 synthetic customers across 7 scenarios. The three models
// were trained on separate public datasets, so these profiles exist only to
// demonstrate the full decision flow.

const p = (
  age: number,
  experience: number,
  income: number,
  family: number,
  ccAvg: number,
  education: 1 | 2 | 3,
  mortgage: number,
  gender: "Male" | "Female",
  geography: "France" | "Spain" | "Germany",
  creditScore: number,
  tenure: number,
  balance: number,
  numOfProducts: number,
  isActiveMember: 0 | 1,
): DemoCustomer["profile"] => ({
  age,
  experience,
  income,
  family,
  ccAvg,
  education,
  mortgage,
  gender,
  geography,
  creditScore,
  tenure,
  balance,
  numOfProducts,
  hasCrCard: 0, // replaced below from owned products
  isActiveMember,
  estimatedSalary: income * 1000,
});

/** hasCrCard is kept consistent with CreditCard ownership on every customer. */
const withCardFlag = (
  owned: ProductId[],
  profile: DemoCustomer["profile"],
): DemoCustomer["profile"] => ({
  ...profile,
  hasCrCard: owned.includes("CreditCard") ? 1 : 0,
});

export const DEMO_CUSTOMERS: DemoCustomer[] = [
  // ── Young Student ────────────────────────────────────────────────
  {
    demoId: "C001",
    demoName: "Ava Thompson",
    demoScenario: "Young Student",
    demoTransactionType: "Online purchase",
    demoTrueFraud: 0,
    transaction: { time: 41220, amount: 42.5 },
    profile: withCardFlag(
      ["Online"],
      p(23, 2, 28, 1, 1.2, 1, 0, "Female", "France", 640, 2, 4200, 2, 1),
    ),
    ownedProducts: ["Online"],
  },
  {
    demoId: "C002",
    demoName: "Liam Carter",
    demoScenario: "Young Student",
    demoTransactionType: "Contactless payment",
    demoTrueFraud: 0,
    transaction: { time: 51840, amount: 18.9 },
    profile: withCardFlag(
      ["Online", "CreditCard"],
      p(24, 3, 31, 1, 1.6, 1, 0, "Male", "Spain", 655, 3, 5100, 3, 1),
    ),
    ownedProducts: ["Online", "CreditCard"],
  },
  {
    demoId: "C003",
    demoName: "Maya Rossi",
    demoScenario: "Young Student",
    demoTransactionType: "Subscription payment",
    demoTrueFraud: 0,
    transaction: { time: 68200, amount: 12.99 },
    profile: withCardFlag(
      ["Online"],
      p(22, 1, 26, 2, 0.9, 1, 0, "Female", "Spain", 630, 1, 3300, 2, 1),
    ),
    ownedProducts: ["Online"],
  },

  // ── Loyal Professional ──────────────────────────────────────────
  {
    demoId: "C004",
    demoName: "Ethan Brooks",
    demoScenario: "Loyal Professional",
    demoTransactionType: "Grocery purchase",
    demoTrueFraud: 0,
    transaction: { time: 24600, amount: 128.4 },
    profile: withCardFlag(
      ["Online", "CreditCard"],
      p(38, 13, 82, 3, 3.4, 2, 120, "Male", "France", 720, 9, 62000, 3, 1),
    ),
    ownedProducts: ["Online", "CreditCard"],
  },
  {
    demoId: "C005",
    demoName: "Sofia Hernandez",
    demoScenario: "Loyal Professional",
    demoTransactionType: "Restaurant payment",
    demoTrueFraud: 0,
    transaction: { time: 74400, amount: 86.2 },
    profile: withCardFlag(
      ["CreditCard", "Online"],
      p(36, 11, 76, 2, 3.1, 2, 95, "Female", "Spain", 705, 8, 54000, 3, 1),
    ),
    ownedProducts: ["CreditCard", "Online"],
  },
  {
    demoId: "C006",
    demoName: "Daniel Kim",
    demoScenario: "Loyal Professional",
    demoTransactionType: "Utility bill",
    demoTrueFraud: 0,
    transaction: { time: 32000, amount: 210.0 },
    profile: withCardFlag(
      ["Online", "CD Account"],
      p(41, 16, 95, 4, 4.2, 3, 140, "Male", "Germany", 740, 11, 88000, 3, 1),
    ),
    ownedProducts: ["Online", "CD Account"],
  },
  {
    demoId: "C007",
    demoName: "Grace Patel",
    demoScenario: "Loyal Professional",
    demoTransactionType: "Travel booking",
    demoTrueFraud: 0,
    transaction: { time: 58300, amount: 742.0 },
    profile: withCardFlag(
      ["CreditCard", "Securities Account"],
      p(35, 10, 68, 2, 2.8, 2, 60, "Female", "France", 690, 7, 41000, 3, 1),
    ),
    ownedProducts: ["CreditCard", "Securities Account"],
  },

  // ── Wealthy Investor ────────────────────────────────────────────
  {
    demoId: "C008",
    demoName: "Alexander Wright",
    demoScenario: "Wealthy Investor",
    demoTransactionType: "Wire transfer fee",
    demoTrueFraud: 0,
    transaction: { time: 36600, amount: 35.0 },
    profile: withCardFlag(
      ["Securities Account", "CD Account"],
      p(52, 27, 185, 2, 6.8, 3, 0, "Male", "France", 780, 14, 210000, 3, 1),
    ),
    ownedProducts: ["Securities Account", "CD Account"],
  },
  {
    demoId: "C009",
    demoName: "Isabella Moreau",
    demoScenario: "Wealthy Investor",
    demoTransactionType: "Investment platform transfer",
    demoTrueFraud: 0,
    transaction: { time: 40200, amount: 1250.0 },
    profile: withCardFlag(
      ["CD Account", "Online"],
      p(48, 23, 162, 3, 5.9, 3, 0, "Female", "France", 765, 12, 178000, 3, 1),
    ),
    ownedProducts: ["CD Account", "Online"],
  },
  {
    demoId: "C010",
    demoName: "Benjamin Adler",
    demoScenario: "Wealthy Investor",
    demoTransactionType: "Luxury retail purchase",
    demoTrueFraud: 0,
    transaction: { time: 55800, amount: 2380.0 },
    profile: withCardFlag(
      ["Securities Account", "Online"],
      p(57, 32, 210, 2, 7.4, 3, 0, "Male", "Germany", 790, 16, 245000, 3, 1),
    ),
    ownedProducts: ["Securities Account", "Online"],
  },

  // ── Inactive Customer at Risk ───────────────────────────────────
  {
    demoId: "C011",
    demoName: "Henry Walsh",
    demoScenario: "Inactive Customer at Risk",
    demoTransactionType: "ATM withdrawal",
    demoTrueFraud: 0,
    transaction: { time: 61200, amount: 300.0 },
    profile: withCardFlag(
      ["Online", "CreditCard"],
      p(46, 21, 58, 3, 2.2, 2, 80, "Male", "France", 610, 6, 92000, 1, 0),
    ),
    ownedProducts: ["Online", "CreditCard"],
  },
  {
    demoId: "C012",
    demoName: "Clara Dubois",
    demoScenario: "Inactive Customer at Risk",
    demoTransactionType: "Card payment — dormant card",
    demoTrueFraud: 0,
    transaction: { time: 47900, amount: 64.75 },
    profile: withCardFlag(
      ["CreditCard"],
      p(51, 24, 52, 2, 1.8, 1, 45, "Female", "France", 590, 5, 68000, 2, 0),
    ),
    ownedProducts: ["CreditCard"],
  },
  {
    demoId: "C013",
    demoName: "Victor Osei",
    demoScenario: "Inactive Customer at Risk",
    demoTransactionType: "Standing order",
    demoTrueFraud: 0,
    transaction: { time: 28800, amount: 450.0 },
    profile: withCardFlag(
      ["Online"],
      p(44, 19, 61, 4, 2.5, 2, 70, "Male", "Spain", 615, 6, 74000, 1, 0),
    ),
    ownedProducts: ["Online"],
  },

  // ── Retiree ─────────────────────────────────────────────────────
  {
    demoId: "C014",
    demoName: "Margaret Hale",
    demoScenario: "Retiree",
    demoTransactionType: "Pharmacy payment",
    demoTrueFraud: 0,
    transaction: { time: 33400, amount: 58.3 },
    profile: withCardFlag(
      ["CD Account", "Online"],
      p(67, 40, 74, 2, 1.9, 2, 0, "Female", "France", 730, 19, 132000, 3, 1),
    ),
    ownedProducts: ["CD Account", "Online"],
  },
  {
    demoId: "C015",
    demoName: "Robert Ellison",
    demoScenario: "Retiree",
    demoTransactionType: "Grocery purchase",
    demoTrueFraud: 0,
    transaction: { time: 30100, amount: 92.6 },
    profile: withCardFlag(
      ["CD Account", "Securities Account"],
      p(71, 44, 66, 2, 1.4, 1, 0, "Male", "Spain", 750, 21, 118000, 3, 1),
    ),
    ownedProducts: ["CD Account", "Securities Account"],
  },

  // ── Unhappy Borrower ────────────────────────────────────────────
  {
    demoId: "C016",
    demoName: "Thomas Reed",
    demoScenario: "Unhappy Borrower",
    demoTransactionType: "Loan servicing payment",
    demoTrueFraud: 0,
    transaction: { time: 25700, amount: 980.0 },
    profile: withCardFlag(
      ["Personal Loan", "CreditCard"],
      p(39, 14, 64, 4, 4.6, 2, 245, "Male", "France", 575, 5, 12000, 2, 1),
    ),
    ownedProducts: ["Personal Loan", "CreditCard"],
  },
  {
    demoId: "C017",
    demoName: "Nadia Farsi",
    demoScenario: "Unhappy Borrower",
    demoTransactionType: "Mortgage-linked transfer",
    demoTrueFraud: 0,
    transaction: { time: 39600, amount: 1240.0 },
    profile: withCardFlag(
      ["Personal Loan", "Online"],
      p(43, 17, 71, 3, 3.9, 3, 190, "Female", "Germany", 600, 6, 18000, 2, 1),
    ),
    ownedProducts: ["Personal Loan", "Online"],
  },

  // ── Card Victim (fraudulent transaction) ────────────────────────
  {
    demoId: "C018",
    demoName: "Oliver Grant",
    demoScenario: "Card Victim",
    demoTransactionType: "Online purchase — unusual amount",
    demoTrueFraud: 1,
    transaction: { time: 7740, amount: 4830.55 },
    profile: withCardFlag(
      ["Online", "CreditCard"],
      p(34, 9, 78, 2, 3.2, 2, 90, "Male", "France", 700, 8, 23000, 3, 1),
    ),
    ownedProducts: ["Online", "CreditCard"],
  },
  {
    demoId: "C019",
    demoName: "Priya Nair",
    demoScenario: "Card Victim",
    demoTransactionType: "Card-not-present transaction",
    demoTrueFraud: 1,
    transaction: { time: 11100, amount: 9712.4 },
    profile: withCardFlag(
      ["CreditCard", "Online"],
      p(29, 6, 54, 1, 2.7, 2, 40, "Female", "Germany", 680, 4, 15000, 3, 1),
    ),
    ownedProducts: ["CreditCard", "Online"],
  },
  {
    demoId: "C020",
    demoName: "Marcus Webb",
    demoScenario: "Card Victim",
    demoTransactionType: "Foreign transaction",
    demoTrueFraud: 1,
    transaction: { time: 16550, amount: 6204.18 },
    profile: withCardFlag(
      ["Online", "CreditCard"],
      p(47, 22, 88, 3, 4.1, 2, 110, "Male", "France", 665, 10, 31000, 3, 1),
    ),
    ownedProducts: ["Online", "CreditCard"],
  },
];

export const PRODUCT_CATALOG: Record<ProductId, string> = {
  "Personal Loan": "Unsecured personal loan with a fixed term and rate.",
  "Securities Account": "Brokerage / securities account for investing.",
  "CD Account": "Certificate of deposit — fixed-term, fixed-rate savings.",
  Online: "Digital banking: payments, transfers and self-service.",
  CreditCard: "Bank-issued credit card with monthly spending limit.",
};

export const EDUCATION_LABELS: Record<1 | 2 | 3, string> = {
  1: "Undergraduate",
  2: "Graduate",
  3: "Advanced degree",
};

export const RECENT_ACTIVITY: RecentActivity[] = [
  {
    customerId: "C018",
    customerName: "Oliver Grant",
    action: "Transaction flagged for review",
    detail: "Online purchase — unusual amount · $4,830.55",
    time: "12 min ago",
  },
  {
    customerId: "C011",
    customerName: "Henry Walsh",
    action: "Customer 360 completed",
    detail: "High churn risk · retention offers issued",
    time: "38 min ago",
  },
  {
    customerId: "C008",
    customerName: "Alexander Wright",
    action: "Customer 360 completed",
    detail: "Low churn risk · 3 recommended offers",
    time: "1 hr ago",
  },
  {
    customerId: "C019",
    customerName: "Priya Nair",
    action: "Transaction flagged for review",
    detail: "Card-not-present transaction · $9,712.40",
    time: "2 hrs ago",
  },
  {
    customerId: "C016",
    customerName: "Thomas Reed",
    action: "Customer 360 completed",
    detail: "Elevated churn risk · retention offers issued",
    time: "3 hrs ago",
  },
  {
    customerId: "C002",
    customerName: "Liam Carter",
    action: "Customer 360 completed",
    detail: "Low churn risk · 3 recommended offers",
    time: "5 hrs ago",
  },
];

export const getCustomerById = (id: string): DemoCustomer | undefined =>
  DEMO_CUSTOMERS.find((c) => c.demoId === id);
