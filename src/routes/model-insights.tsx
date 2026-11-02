import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Braces,
  Database,
  Info,
  ShieldCheck,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DemoBadge, PageHeader } from "@/components/finora/shared";

export const Route = createFileRoute("/model-insights")({
  head: () => ({
    meta: [{ title: "Model Insights — FINORA Banking Intelligence" }],
  }),
  component: ModelInsightsPage,
});

const models = [
  {
    name: "Fraud Detection",
    model: "XGBoost pipeline",
    output: "Transaction fraud probability + review flag",
    inputs:
      "17 transaction, merchant and demographic fields in supplied artifact",
    status: "Metrics supplied",
    metrics: ["Precision 83.3%", "Recall 60.8%", "F1 70.3%", "PR-AUC 75.7%"],
  },
  {
    name: "Customer Churn",
    model: "CatBoost classifier",
    output: "Churn probability + Low / Medium / High band",
    inputs:
      "10 profile fields: score, geography, gender, age, tenure, balance, products, card, activity, salary",
    status: "Report supplied",
    metrics: [
      "Test accuracy 87%",
      "Class 1 precision 74%",
      "Class 1 recall 49%",
      "Class 1 F1 59%",
      "Macro F1 76%",
      "Weighted F1 86%",
    ],
  },
  {
    name: "Product Recommendations",
    model: "CatBoost multi-label model",
    output: "Probability for five products, filtered to unowned products",
    inputs:
      "7 profile fields: age, experience, income, family, card spend, education, mortgage",
    status: "Report supplied",
    metrics: [
      "Mean PR-AUC 43.46%",
      "Mean ROC-AUC 63.46%",
      "Precision@1 62.8%",
      "Reported best model",
    ],
  },
];

const churnClassifierComparison = [
  {
    model: "Random Forest",
    accuracy: "86%",
    precision: "74%",
    recall: "47%",
    f1: "58%",
  },
  {
    model: "XGBoost",
    accuracy: "87%",
    precision: "74%",
    recall: "50%",
    f1: "59%",
  },
  {
    model: "CatBoost",
    accuracy: "87%",
    precision: "74%",
    recall: "49%",
    f1: "59%",
  },
  {
    model: "LightGBM",
    accuracy: "87%",
    precision: "75%",
    recall: "49%",
    f1: "59%",
  },
  { model: "SVC", accuracy: "86%", precision: "73%", recall: "47%", f1: "57%" },
];

const recommendationModelComparison = [
  {
    model: "CatBoost",
    meanPrAuc: "43.46%",
    meanRocAuc: "63.46%",
    precisionAt1: "62.8%",
  },
  {
    model: "XGBoost",
    meanPrAuc: "43.19%",
    meanRocAuc: "63.12%",
    precisionAt1: "63.1%",
  },
  {
    model: "Random Forest",
    meanPrAuc: "42.97%",
    meanRocAuc: "64.22%",
    precisionAt1: "62.8%",
  },
  {
    model: "SVM (RBF)",
    meanPrAuc: "42.87%",
    meanRocAuc: "63.12%",
    precisionAt1: "62.3%",
  },
  {
    model: "Gradient Boosting",
    meanPrAuc: "42.85%",
    meanRocAuc: "64.09%",
    precisionAt1: "62.6%",
  },
  {
    model: "Bagging",
    meanPrAuc: "41.92%",
    meanRocAuc: "61.96%",
    precisionAt1: "59.4%",
  },
  {
    model: "AdaBoost",
    meanPrAuc: "41.90%",
    meanRocAuc: "63.50%",
    precisionAt1: "59.7%",
  },
  {
    model: "Decision Tree",
    meanPrAuc: "41.66%",
    meanRocAuc: "62.71%",
    precisionAt1: "43.7%",
  },
  {
    model: "KNN",
    meanPrAuc: "40.87%",
    meanRocAuc: "61.61%",
    precisionAt1: "58.0%",
  },
  {
    model: "Logistic Regression",
    meanPrAuc: "38.88%",
    meanRocAuc: "63.58%",
    precisionAt1: "31.3%",
  },
];

const catBoostOfferMetrics = [
  {
    product: "Personal Loan",
    baseRate: "9.60%",
    prAuc: "98.66%",
    rocAuc: "99.77%",
  },
  {
    product: "Securities Account",
    baseRate: "10.45%",
    prAuc: "9.80%",
    rocAuc: "48.83%",
  },
  {
    product: "CD Account",
    baseRate: "6.05%",
    prAuc: "19.55%",
    rocAuc: "70.46%",
  },
  { product: "Online", baseRate: "59.68%", prAuc: "59.64%", rocAuc: "49.48%" },
  {
    product: "CreditCard",
    baseRate: "29.42%",
    prAuc: "29.64%",
    rocAuc: "48.78%",
  },
];

function ModelInsightsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
      <PageHeader
        title="Model Insights"
        description="A transparent view of model tasks, input contracts, available evaluation evidence and integration boundaries."
        actions={<DemoBadge />}
      />

      <Alert>
        <Info className="size-4" />
        <AlertTitle>Frontend prediction mode</AlertTitle>
        <AlertDescription>
          All interactive scores in this React app are deterministic mock
          outputs from a typed service. This UI does not load or execute the
          supplied Python model files.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 xl:grid-cols-3">
        {models.map((model) => (
          <Card key={model.name} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">{model.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {model.model}
                  </CardDescription>
                </div>
                <div
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${model.metrics.length ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}
                >
                  {model.status}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 text-sm">
              <div>
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Output
                </p>
                <p className="mt-1 leading-relaxed">{model.output}</p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Input contract
                </p>
                <p className="mt-1 leading-relaxed text-muted-foreground">
                  {model.inputs}
                </p>
              </div>
              <div className="mt-auto border-t border-border/70 pt-4">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Evaluation evidence
                </p>
                {model.metrics.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {model.metrics.map((metric) => (
                      <span
                        key={metric}
                        className="rounded-md bg-primary/7 px-2 py-1 text-xs font-medium text-primary"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    No evaluation report was supplied. FINORA intentionally does
                    not infer or fabricate model performance.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Churn classifier evaluation
          </CardTitle>
          <CardDescription>
            User-provided test-set classification reports · 2,000 rows (class 0:
            1,607; class 1: 393)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto rounded-lg border border-border/70">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-muted/60 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Classifier</th>
                  <th className="px-4 py-3 font-semibold">Accuracy</th>
                  <th className="px-4 py-3 font-semibold">Class 1 precision</th>
                  <th className="px-4 py-3 font-semibold">Class 1 recall</th>
                  <th className="px-4 py-3 font-semibold">Class 1 F1</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {churnClassifierComparison.map((result) => (
                  <tr
                    key={result.model}
                    className={
                      result.model === "CatBoost" ? "bg-primary/5" : ""
                    }
                  >
                    <th scope="row" className="px-4 py-3 font-medium">
                      {result.model}
                    </th>
                    <td className="px-4 py-3 tabular-nums">
                      {result.accuracy}
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {result.precision}
                    </td>
                    <td className="px-4 py-3 tabular-nums">{result.recall}</td>
                    <td className="px-4 py-3 tabular-nums">{result.f1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-3 rounded-lg border border-border/70 bg-muted/25 p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                CatBoost · train (8,000)
              </p>
              <p className="mt-1 text-sm">
                Class 1: precision 83% · recall 53% · F1 64%
              </p>
              <p className="text-xs text-muted-foreground">
                Class 1 support: 1,644 · accuracy: 88%
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                CatBoost · test (2,000)
              </p>
              <p className="mt-1 text-sm">
                Class 1: precision 74% · recall 49% · F1 59%
              </p>
              <p className="text-xs text-muted-foreground">
                Class 1 support: 393 · accuracy: 87%
              </p>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Metrics are transcribed from the supplied report, not recalculated
            by FINORA. The report labels classes 0 and 1 but does not state
            whether class 1 means churn, identify the dataset, or document the
            split method or decision threshold. Confirm those details before
            interpreting these as churn-specific or operational results.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Product recommendation evaluation
          </CardTitle>
          <CardDescription>
            User-provided JSON · CatBoost is marked as `best_model` · five
            product labels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="overflow-x-auto rounded-lg border border-border/70">
            <table className="w-full min-w-[620px] text-left text-sm">
              <caption className="sr-only">
                Aggregate reported ranking metrics for all ten recommendation
                models
              </caption>
              <thead className="bg-muted/60 text-xs text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Model</th>
                  <th className="px-4 py-3 font-semibold">Mean PR-AUC</th>
                  <th className="px-4 py-3 font-semibold">Mean ROC-AUC</th>
                  <th className="px-4 py-3 font-semibold">Precision@1</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {recommendationModelComparison.map((result) => (
                  <tr
                    key={result.model}
                    className={
                      result.model === "CatBoost" ? "bg-primary/5" : ""
                    }
                  >
                    <th scope="row" className="px-4 py-3 font-medium">
                      {result.model}
                      {result.model === "CatBoost" ? (
                        <span className="ml-2 text-xs text-primary">
                          reported best
                        </span>
                      ) : null}
                    </th>
                    <td className="px-4 py-3 tabular-nums">
                      {result.meanPrAuc}
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {result.meanRocAuc}
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {result.precisionAt1}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold">
              CatBoost results by product
            </h3>
            <div className="overflow-x-auto rounded-lg border border-border/70">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="bg-muted/60 text-xs text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Product</th>
                    <th className="px-4 py-3 font-semibold">Base rate</th>
                    <th className="px-4 py-3 font-semibold">PR-AUC</th>
                    <th className="px-4 py-3 font-semibold">ROC-AUC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {catBoostOfferMetrics.map((result) => (
                    <tr key={result.product}>
                      <th scope="row" className="px-4 py-3 font-medium">
                        {result.product}
                      </th>
                      <td className="px-4 py-3 tabular-nums">
                        {result.baseRate}
                      </td>
                      <td className="px-4 py-3 tabular-nums">{result.prAuc}</td>
                      <td className="px-4 py-3 tabular-nums">
                        {result.rocAuc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 text-xs leading-relaxed text-muted-foreground">
            <p>
              Results are uneven across products. Personal Loan is strong in the
              supplied report (PR-AUC 98.66%, ROC-AUC 99.77%). Securities
              Account PR-AUC (9.80%) is below its reported base rate (10.45%);
              Online PR-AUC (59.64%) is essentially equal to its base rate
              (59.68%), and its ROC-AUC is 49.48%. CreditCard ROC-AUC is also
              near 0.50 (48.78%). Compare per-product PR-AUC with prevalence
              rather than relying on the aggregate alone.
            </p>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Metrics are transcribed from `offer_metrics.json`, not independently
            recalculated. The JSON does not identify the dataset, evaluation
            split or sample counts, and does not define the Precision@1
            calculation or model-selection protocol. Treat CatBoost as the
            file’s reported selection, not as independently validated; XGBoost
            has the highest reported Precision@1 (63.1%), while Random Forest
            has the highest mean ROC-AUC (64.22%).
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Braces className="size-4 text-primary" />
              <CardTitle className="text-base">
                Python API replacement contract
              </CardTitle>
            </div>
            <CardDescription>
              The UI is intentionally separated from model inference.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              Every interactive prediction passes through{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                src/services/predictionService.ts
              </code>
              . The pages consume typed{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                FraudPrediction
              </code>
              ,{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                ChurnPrediction
              </code>
              ,{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                OfferPrediction
              </code>{" "}
              and{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
                Customer360Report
              </code>{" "}
              responses.
            </p>
            <p>
              A future Python service can replace the mock implementation with
              API requests while retaining the UI contracts. Each backend
              endpoint must validate its model-specific fields, return
              probabilities from 0–1, preserve the fraud-first gate, and never
              treat the synthetic scenario markers as model features.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="size-4 text-primary" />
              <CardTitle className="text-base">Evidence provenance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground">Fraud metrics</p>
              <p className="mt-1 text-xs leading-relaxed">
                Copied from metadata embedded in the supplied serialized fraud
                artifact. They were not recalculated in the frontend.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Threshold</p>
              <p className="mt-1 text-xs leading-relaxed">
                93.866% stored in the same supplied fraud artifact metadata;
                mirrored here solely for a consistent mock workflow gate.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Churn evidence</p>
              <p className="mt-1 text-xs leading-relaxed">
                User-provided classification reports. Class 1 is shown as the
                positive class only; its meaning is not identified in the
                report.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">
                Recommendation evidence
              </p>
              <p className="mt-1 text-xs leading-relaxed">
                User-provided `offer_metrics.json`; values are transcribed, not
                independently recalculated. Dataset and evaluation details are
                not included.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert variant="destructive">
        <AlertTriangle className="size-4" />
        <AlertTitle>Compatibility and responsible-use boundary</AlertTitle>
        <AlertDescription>
          The written project brief describes Kaggle PCA fraud features (Time,
          V1–V28, Amount), whereas the supplied XGBoost artifact requires a
          different 17-field merchant/demographic schema. Resolve provenance and
          schema before backend integration. FINORA is an educational prototype;
          a risk score is not proof of fraud and must not be used to approve,
          block or decline real transactions.
        </AlertDescription>
      </Alert>

      <Card className="border-success/30 bg-success/4">
        <CardContent className="flex gap-3 p-5">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" />
          <div>
            <p className="font-semibold">
              What this frontend demonstrates safely
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              A cohesive analyst workflow: upstream fraud review, conditional
              retention context, and ownership-aware offers—using clearly
              labelled synthetic profiles and replaceable service contracts.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
