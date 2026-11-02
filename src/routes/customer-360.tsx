import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  LoaderCircle,
  Play,
  ShieldAlert,
  Sparkles,
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
import {
  CustomerProfileCard,
  OwnedProducts,
  WorkflowStepper,
} from "@/components/finora/customer-panels";
import {
  DemoBadge,
  formatPct,
  formatUsd,
  PageHeader,
  ProbabilityBar,
  RiskBadge,
} from "@/components/finora/shared";
import { DEMO_CUSTOMERS } from "@/data/mockData";
import { getCustomerById, runCustomer360 } from "@/services/predictionService";
import type { Customer360Report } from "@/types/finora";

export const Route = createFileRoute("/customer-360")({
  validateSearch: (search: Record<string, unknown>) => ({
    customer:
      typeof search["customer"] === "string" ? search["customer"] : "C001",
  }),
  head: () => ({
    meta: [{ title: "Customer 360 — FINORA Banking Intelligence" }],
  }),
  component: Customer360Page,
});

type ViewStage = "idle" | "fraud" | "stopped" | "done";

function Customer360Page() {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const customer = getCustomerById(search.customer) ?? DEMO_CUSTOMERS[0]!;
  const [report, setReport] = useState<Customer360Report | null>(null);
  const [stage, setStage] = useState<ViewStage>("idle");
  const [running, setRunning] = useState(false);

  const changeCustomer = (demoId: string) => {
    setReport(null);
    setStage("idle");
    navigate({ search: { customer: demoId }, replace: true });
  };

  const runWorkflow = async () => {
    setReport(null);
    setStage("fraud");
    setRunning(true);
    const nextReport = await runCustomer360(customer);
    setReport(nextReport);
    setStage(nextReport.flagged ? "stopped" : "done");
    setRunning(false);
  };

  const activeStage =
    stage === "done"
      ? "done"
      : stage === "stopped"
        ? "stopped"
        : stage === "fraud"
          ? "fraud"
          : "idle";

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
      <PageHeader
        title="Customer 360"
        description="Run a guided, synthetic demonstration of transaction screening, customer risk assessment, and eligible product ranking."
        actions={<DemoBadge />}
      />

      <Card>
        <CardContent className="grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="customer-360-select"
            >
              Demo customer
            </label>
            <CustomerSelect
              value={customer.demoId}
              onChange={changeCustomer}
              ariaLabel="Select a Customer 360 demo customer"
            />
          </div>
          <Button onClick={runWorkflow} disabled={running} className="min-w-48">
            {running ? (
              <>
                <LoaderCircle className="size-4 animate-spin" /> Screening
                profile…
              </>
            ) : (
              <>
                <Play className="size-4" /> Run guided review
              </>
            )}
          </Button>
        </CardContent>
        <div className="border-t border-border/70 px-5 py-4">
          <WorkflowStepper stage={activeStage} />
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4">
          <CustomerProfileCard customer={customer} />
          <OwnedProducts customer={customer} />
        </div>

        <div className="space-y-4">
          {!report && !running && (
            <Card className="border-dashed bg-card/70">
              <CardContent className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="size-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold">
                  Ready for a guided review
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                  FINORA evaluates the selected synthetic transaction first. A
                  flagged screening ends the flow; otherwise, the demo continues
                  to churn and eligible products.
                </p>
              </CardContent>
            </Card>
          )}

          {running && (
            <Card>
              <CardContent className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
                <LoaderCircle className="size-8 animate-spin text-primary" />
                <h2 className="mt-4 text-lg font-semibold">
                  Running the synthetic workflow
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Fraud screening runs first; downstream stages remain gated
                  until it completes.
                </p>
              </CardContent>
            </Card>
          )}

          {report && (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                        Step 1 · Fraud screening
                      </p>
                      <CardTitle className="mt-1 text-lg">
                        {report.fraud.flagged
                          ? "Transaction flagged for review"
                          : "Transaction below review threshold"}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Synthetic score from the mock service; the stored cutoff
                        is shown for workflow demonstration.
                      </CardDescription>
                    </div>
                    {report.fraud.flagged ? (
                      <ShieldAlert className="size-6 text-destructive" />
                    ) : (
                      <CheckCircle2 className="size-6 text-success" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="grid gap-5 md:grid-cols-[1fr_180px] md:items-center">
                  <div>
                    <div className="mb-2 flex justify-between gap-4 text-sm">
                      <span className="font-medium">Fraud probability</span>
                      <span
                        className={
                          report.fraud.flagged
                            ? "font-semibold text-destructive"
                            : "font-semibold text-success"
                        }
                      >
                        {formatPct(report.fraud.probability, 2)}
                      </span>
                    </div>
                    <ProbabilityBar
                      value={report.fraud.probability}
                      tone={report.fraud.flagged ? "danger" : "success"}
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Review threshold: {formatPct(report.fraud.threshold, 2)} ·
                      Transaction: {formatUsd(report.fraud.transactionAmount)}
                    </p>
                  </div>
                  <div
                    className={`rounded-lg border p-4 text-center ${report.fraud.flagged ? "border-destructive/35 bg-destructive/5" : "border-success/35 bg-success/5"}`}
                  >
                    <p className="text-xs font-medium text-muted-foreground uppercase">
                      Screening result
                    </p>
                    <p
                      className={`mt-1 text-sm font-semibold ${report.fraud.flagged ? "text-destructive" : "text-success"}`}
                    >
                      {report.fraud.flagged
                        ? "Review required"
                        : "Continue workflow"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {report.flagged ? (
                <Alert variant="destructive">
                  <AlertTriangle className="size-4" />
                  <AlertTitle>
                    Workflow stopped after fraud screening
                  </AlertTitle>
                  <AlertDescription>
                    The transaction crossed the review threshold. Churn and
                    product offers are deliberately suppressed. This synthetic
                    score is a risk signal for review, not proof of fraud.
                  </AlertDescription>
                </Alert>
              ) : report.churn && report.offers ? (
                <>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-3">
                        <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                          Step 2 · Customer churn
                        </p>
                        <div className="flex items-center justify-between gap-3">
                          <CardTitle className="text-lg">
                            Retention risk
                          </CardTitle>
                          <RiskBadge risk={report.churn.risk} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-end justify-between gap-4">
                          <div>
                            <p className="text-3xl font-semibold tracking-tight">
                              {formatPct(report.churn.probability, 1)}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Low &lt;30% · Medium 30–60% · High &gt;60%
                            </p>
                          </div>
                          <div className="text-right text-xs text-muted-foreground">
                            Synthetic output
                            <br />
                            for interface testing
                          </div>
                        </div>
                        <ProbabilityBar
                          value={report.churn.probability}
                          tone={
                            report.churn.risk === "High"
                              ? "danger"
                              : report.churn.risk === "Medium"
                                ? "warning"
                                : "success"
                          }
                          className="mt-4"
                        />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                          Step 3 · {report.offers.sectionLabel}
                        </p>
                        <CardTitle className="text-lg">
                          Eligible product ranking
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {report.offers.offers.map((offer, index) => (
                          <div key={offer.product}>
                            <div className="mb-1 flex items-center justify-between text-sm">
                              <span className="font-medium">
                                {index + 1}. {offer.product}
                              </span>
                              <span className="font-semibold text-primary">
                                {formatPct(offer.probability, 1)}
                              </span>
                            </div>
                            <ProbabilityBar value={offer.probability} />
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-primary/25 bg-primary/3">
                    <CardHeader className="pb-3">
                      <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                        Step 4 · Customer 360 summary
                      </p>
                      <CardTitle className="text-lg">
                        {report.churn.risk === "High"
                          ? "Retention should be the focus"
                          : "Relationship opportunity identified"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-lg border border-primary/15 bg-background/65 p-3">
                          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                            Profile
                          </p>
                          <p className="mt-1 text-sm font-semibold">
                            {report.customer.demoName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {report.customer.demoScenario}
                          </p>
                        </div>
                        <div className="rounded-lg border border-success/25 bg-success/5 p-3">
                          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                            Fraud screen
                          </p>
                          <p className="mt-1 text-sm font-semibold text-success">
                            Passed · {formatPct(report.fraud.probability, 2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Below {formatPct(report.fraud.threshold, 2)} cutoff
                          </p>
                        </div>
                        <div className="rounded-lg border border-primary/15 bg-background/65 p-3">
                          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                            Churn risk
                          </p>
                          <p className="mt-1 text-sm font-semibold">
                            {report.churn.risk} ·{" "}
                            {formatPct(report.churn.probability, 1)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Synthetic retention estimate
                          </p>
                        </div>
                        <div className="rounded-lg border border-primary/15 bg-background/65 p-3">
                          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                            Top offer
                          </p>
                          <p className="mt-1 text-sm font-semibold">
                            {report.offers.offers[0]?.product ?? "No offer"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {report.offers.sectionLabel}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        The transaction passed screening. This synthetic profile
                        has{" "}
                        <strong className="font-semibold text-foreground">
                          {report.churn.risk.toLowerCase()} churn risk
                        </strong>
                        , so FINORA ranks only products not already owned.{" "}
                        {report.offers.sectionLabel} are demonstration outputs
                        and require a future Python model API before any
                        operational use.
                      </p>
                    </CardContent>
                  </Card>
                </>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
