// FINORA domain types.
// These interfaces mirror the data the Python ML backend will return, so the
// UI can switch from mock data to real API responses without changes.

export type ProductId =
  | "Personal Loan"
  | "Securities Account"
  | "CD Account"
  | "Online"
  | "CreditCard";

export type ChurnRisk = "Low" | "Medium" | "High";

export type EducationLevel = 1 | 2 | 3;

export type Geography = "France" | "Spain" | "Germany";

/** One demo customer: profile + the card transaction to screen. */
export interface DemoCustomer {
  demoId: string;
  demoName: string;
  demoScenario: string;
  demoTransactionType: string;
  /** Synthetic review-path marker for the demo — UI only, never sent to a model. */
  demoTrueFraud: 0 | 1;
  /** Card transaction sent to the fraud model (Time, Amount; V1–V28 stay server-side). */
  transaction: {
    time: number; // seconds since start of day, as in the fraud dataset
    amount: number;
  };
  /** Profile shared by the offers (Thera Bank) and churn models. */
  profile: {
    age: number;
    experience: number;
    income: number; // $000/year
    family: number;
    ccAvg: number; // card spending, $000/month
    education: EducationLevel;
    mortgage: number; // $000
    gender: "Male" | "Female";
    geography: Geography;
    creditScore: number;
    tenure: number; // years
    balance: number;
    numOfProducts: number;
    hasCrCard: 0 | 1; // always equals ownership of "CreditCard"
    isActiveMember: 0 | 1;
    estimatedSalary: number; // income * 1000
  };
  /** Products the customer already owns; excluded from recommendations. */
  ownedProducts: ProductId[];
}

export interface FraudPrediction {
  customerId: string;
  probability: number;
  threshold: number;
  flagged: boolean;
  transactionAmount: number;
  evaluatedAt: string;
}

export interface ChurnPrediction {
  customerId: string;
  probability: number;
  risk: ChurnRisk;
  drivers: ChurnDriver[];
  evaluatedAt: string;
}

export interface ChurnDriver {
  label: string;
  detail: string;
  impact: "increases" | "decreases";
}

export interface OfferRecommendation {
  product: ProductId;
  probability: number;
}

export interface OfferPrediction {
  customerId: string;
  /** "Retention Offers" when churn risk is High, otherwise "Recommended Offers". */
  sectionLabel: "Retention Offers" | "Recommended Offers";
  offers: OfferRecommendation[];
  evaluatedAt: string;
}

export interface Customer360Report {
  customer: DemoCustomer;
  fraud: FraudPrediction;
  churn: ChurnPrediction | null; // null when the transaction was flagged
  offers: OfferPrediction | null; // null when the transaction was flagged
  flagged: boolean;
  generatedAt: string;
}

export interface RecentActivity {
  customerId: string;
  customerName: string;
  action: string;
  detail: string;
  time: string;
}
