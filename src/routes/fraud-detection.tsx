import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  CircleCheck,
  LoaderCircle,
  Play,
  ShieldAlert,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CustomerSelect } from "@/components/finora/CustomerSelect";
import { CustomerProfileCard } from "@/components/finora/customer-panels";
import {
  DemoBadge,
  formatPct,
  formatTransactionTime,
  formatUsd,
  PageHeader,
  ProbabilityBar,
} from "@/components/finora/shared";
import { DEMO_CUSTOMERS } from "@/data/mockData";
import {
  getCustomerById,
  predictFraud,
  screenPortfolio,
} from "@/services/predictionService";
import type { FraudPrediction } from "@/types/finora";

export const Route = createFileRoute("/fraud-detection")({
  head: () => ({
    meta: [{ title: "Fraud Detection — FINORA Banking Intelligence" }],
  }),
  component: FraudDetectionPage,
});

const artifactMetrics = [
  ["Precision", "83.3%"],
  ["Recall", "60.8%"],
  ["F1 score", "70.3%"],
  ["PR-AUC", "75.7%"],
] as const;

function FraudDetectionPage() {
  const [customerId, setCustomerId] = useState("C001");
  const [prediction, setPrediction] = useState<FraudPrediction | null>(null);
  const [running, setRunning] = useState(false);
  const customer = getCustomerById(customerId) ?? DEMO_CUSTOMERS[0]!;
  const portfolio = screenPortfolio();
  const flagged = portfolio.filter((entry) => entry.flagged).slice(0, 3);

  const runScreening = async () => {
    setPrediction(null);
    setRunning(true);
    setPrediction(await predictFraud(customer));
    setRunning(false);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
      <PageHeader
        title="Fraud Detection"
        description="Screen one synthetic transaction against the frontend demonstration threshold. This page does not execute the bundled Python model."
        actions={<DemoBadge />}
      />

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Transaction context</CardTitle>
              <CardDescription>
                Select one demo transaction to screen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CustomerSelect
                value={customer.demoId}
                onChange={(id) => {
                  setCustomerId(id);
                  setPrediction(null);
                }}
                ariaLabel="Select a fraud screening demo customer"
              />
              <div className="rounded-lg bg-muted/60 p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Transaction
                </p>
                <p className="mt-1 text-sm font-medium">
                  {customer.demoTransactionType}
                </p>
                <dl className="mt-3 space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between gap-3">
                    <dt>Amount</dt>
                    <dd className="font-medium text-foreground">
                      {formatUsd(customer.transaction.amount)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt>Time</dt>
                    <dd className="font-medium text-foreground">
                      {formatTransactionTime(customer.transaction.time)}
                    </dd>
                  </div>
                </dl>
              </div>
              <Button
                onClick={runScreening}
                disabled={running}
                className="w-full"
              >
                {running ? (
                  <>
                    <LoaderCircle className="animate-spin" /> Screening…
                  </>
                ) : (
                  <>
                    <Play /> Screen transaction
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          <CustomerProfileCard customer={customer} showTransaction={false} />
        </div>

        <div className="space-y-4">
          {prediction ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                      Synthetic screening result
                    </p>
                    <CardTitle className="mt-1 text-xl">
                      {prediction.flagged
                        ? "Transaction flagged for review"
                        : "Transaction below review threshold"}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Probability comes from the replaceable mock service layer.
                    </CardDescription>
                  </div>
                  {prediction.flagged ? (
                    <ShieldAlert className="size-7 text-destructive" />
                  ) : (
                    <CircleCheck className="size-7 text-success" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="grid gap-5 md:grid-cols-[1fr_220px] md:items-center">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium">Fraud probability</span>
                    <span
                      className={
                        prediction.flagged
                          ? "font-semibold text-destructive"
                          : "font-semibold text-success"
                      }
                    >
                      {formatPct(prediction.probability, 2)}
                    </span>
                  </div>
                  <ProbabilityBar
                    value={prediction.probability}
                    tone={prediction.flagged ? "danger" : "success"}
                  />
                  <p className="mt-3 text-xs text-muted-foreground">
                    Review threshold: {formatPct(prediction.threshold, 2)}
                  </p>
                </div>
                <div
                  className={`rounded-lg border p-4 text-center ${prediction.flagged ? "border-destructive/35 bg-destructive/5" : "border-success/35 bg-success/5"}`}
                >
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Status
                  </p>
                  <p
                    className={`mt-1 font-semibold ${prediction.flagged ? "text-destructive" : "text-success"}`}
                  >
                    {prediction.flagged
                      ? "Review required"
                      : "Cleared for demo flow"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex min-h-52 flex-col items-center justify-center p-8 text-center">
                <ShieldAlert className="size-8 text-primary" />
                <h2 className="mt-3 text-lg font-semibold">
                  Screen the selected transaction
                </h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Use the button to produce a deterministic synthetic
                  demonstration score. The three review-path profiles show the
                  stopped-flow behavior.
                </p>
              </CardContent>
            </Card>
          )}

          {prediction?.flagged && (
            <Alert variant="destructive">
              <AlertTriangle className="size-4" />
              <AlertTitle>Risk signal, not proof</AlertTitle>
              <AlertDescription>
                This score indicates that the transaction should be reviewed. It
                is not evidence of fraud and must not be used as a real
                operational decision.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Supplied artifact metadata
                </CardTitle>
                <CardDescription>
                  Values embedded in the supplied fraud artifact, not computed
                  by this frontend.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-x-4">
                  <div className="space-y-3">
                    {artifactMetrics.slice(0, 2).map(([label, value]) => (
                      <div key={label}>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="text-lg font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {artifactMetrics.slice(2).map(([label, value]) => (
                      <div key={label}>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="text-lg font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-4 border-t pt-3 text-xs leading-relaxed text-muted-foreground">
                  Stored decision threshold: 93.87%. A confusion matrix was not
                  supplied, so none is displayed.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Review-path examples
                </CardTitle>
                <CardDescription>
                  Synthetic cases designed only to demonstrate the workflow
                  stop.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {flagged.map(({ customer: item, probability }) => (
                  <div
                    key={item.demoId}
                    className="flex items-center justify-between gap-3 border-b border-border/70 pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {item.demoId} · {item.demoName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.demoTransactionType}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-destructive">
                      {formatPct(probability, 1)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
