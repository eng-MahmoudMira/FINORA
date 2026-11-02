import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  LoaderCircle,
  Play,
} from "lucide-react";
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
  PageHeader,
  ProbabilityBar,
  RiskBadge,
} from "@/components/finora/shared";
import { DEMO_CUSTOMERS } from "@/data/mockData";
import { getCustomerById, predictChurn } from "@/services/predictionService";
import type { ChurnPrediction } from "@/types/finora";

export const Route = createFileRoute("/customer-churn")({
  head: () => ({
    meta: [{ title: "Customer Churn — FINORA Banking Intelligence" }],
  }),
  component: CustomerChurnPage,
});

function CustomerChurnPage() {
  const [customerId, setCustomerId] = useState("C011");
  const [prediction, setPrediction] = useState<ChurnPrediction | null>(null);
  const [running, setRunning] = useState(false);
  const customer = getCustomerById(customerId) ?? DEMO_CUSTOMERS[0]!;

  const runAssessment = async () => {
    setPrediction(null);
    setRunning(true);
    setPrediction(await predictChurn(customer));
    setRunning(false);
  };

  const tone =
    prediction?.risk === "High"
      ? "danger"
      : prediction?.risk === "Medium"
        ? "warning"
        : "success";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
      <PageHeader
        title="Customer Churn"
        description="Explore a synthetic retention-risk output with the same typed service contract a future Python backend will return."
        actions={<DemoBadge />}
      />
      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer selection</CardTitle>
              <CardDescription>
                Choose a synthetic profile for a retention demonstration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CustomerSelect
                value={customer.demoId}
                onChange={(id) => {
                  setCustomerId(id);
                  setPrediction(null);
                }}
                ariaLabel="Select a churn assessment demo customer"
              />
              <Button
                onClick={runAssessment}
                disabled={running}
                className="w-full"
              >
                {running ? (
                  <>
                    <LoaderCircle className="animate-spin" /> Assessing…
                  </>
                ) : (
                  <>
                    <Play /> Assess churn risk
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
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                      Synthetic retention estimate
                    </p>
                    <CardTitle className="mt-1 text-xl">
                      Customer churn risk
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Risk bands: Low &lt;30%, Medium 30–60%, High &gt;60%.
                    </CardDescription>
                  </div>
                  <RiskBadge risk={prediction.risk} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-5 md:grid-cols-[1fr_210px] md:items-center">
                  <div>
                    <div className="flex items-end justify-between gap-4">
                      <p className="text-4xl font-semibold tracking-tight">
                        {formatPct(prediction.probability, 1)}
                      </p>
                      <p className="text-sm font-medium text-muted-foreground">
                        {prediction.risk} risk
                      </p>
                    </div>
                    <ProbabilityBar
                      value={prediction.probability}
                      tone={tone}
                      className="mt-4"
                    />
                  </div>
                  <div className="rounded-lg border border-border/70 bg-muted/40 p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      Customer snapshot
                    </p>
                    <dl className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">Balance</dt>
                        <dd className="font-medium">
                          ${customer.profile.balance.toLocaleString()}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">Credit score</dt>
                        <dd className="font-medium">
                          {customer.profile.creditScore}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">Active</dt>
                        <dd className="font-medium">
                          {customer.profile.isActiveMember ? "Yes" : "No"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex min-h-52 flex-col items-center justify-center p-8 text-center">
                <Activity className="size-8 text-primary" />
                <h2 className="mt-3 text-lg font-semibold">
                  Assess a synthetic customer
                </h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  The service returns a deterministic mock probability and risk
                  band. It does not calculate a live machine-learning
                  prediction.
                </p>
              </CardContent>
            </Card>
          )}

          {prediction && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Demo context cues</CardTitle>
                <CardDescription>
                  These UI cues are based on the synthetic fixture rules—not
                  feature attributions or model explanations.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {prediction.drivers.length ? (
                  prediction.drivers.map((driver) => (
                    <div
                      key={driver.label}
                      className="rounded-lg border border-border/70 p-3"
                    >
                      <div className="flex items-center gap-2 text-sm font-medium">
                        {driver.impact === "increases" ? (
                          <ArrowUpRight className="size-4 text-destructive" />
                        ) : (
                          <ArrowDownRight className="size-4 text-success" />
                        )}
                        {driver.label}
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        {driver.detail}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No synthetic context cues were generated for this profile.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Evaluation availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                No churn evaluation metrics were included in the supplied
                artifact materials. FINORA intentionally shows an unavailable
                state instead of inventing accuracy, recall, F1, ROC-AUC,
                PR-AUC, or a confusion matrix.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
