import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  CreditCard,
  Gauge,
  Lightbulb,
  UserRoundSearch,
  Users,
} from "lucide-react";
import finoraLogo from "@/assets/finora-logo.png";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KpiCard, DemoBadge, PageHeader } from "@/components/finora/shared";
import { RECENT_ACTIVITY } from "@/data/mockData";
import { getDemoOverview } from "@/services/predictionService";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — FINORA Banking Intelligence" },
      {
        name: "description",
        content:
          "Demo portfolio overview: fraud screening outcomes, churn risk distribution and cross-sell opportunities across 20 demo customers.",
      },
      {
        property: "og:title",
        content: "Overview — FINORA Banking Intelligence",
      },
      {
        property: "og:description",
        content:
          "Fraud screening, churn risk and product offer intelligence across the FINORA demo portfolio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const churnBandColors = {
  Low: "var(--color-success)",
  Medium: "var(--color-warning)",
  High: "var(--color-destructive)",
};

function Index() {
  const overview = getDemoOverview();
  const churnMax = Math.max(
    1,
    ...overview.churnBands.map((entry) => entry.count),
  );
  const scenarioMax = Math.max(
    1,
    ...overview.scenarios.map((entry) => entry.count),
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
      <PageHeader
        title="Overview"
        description="Your demo portfolio at a glance — transaction screening, churn risk and cross-sell opportunity across the demo customer base."
        actions={<DemoBadge />}
      />

      {/* Welcome */}
      <Card className="overflow-hidden">
        <CardContent className="flex flex-col gap-0 p-0 md:flex-row md:items-stretch">
          <div className="flex-1 p-6 md:p-8">
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              Welcome back
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Banking intelligence, one customer at a time.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Screen card transactions for fraud, assess churn risk and rank
              product offers for each demo customer. All predictions are clearly
              labeled mock data, structured for a Python model backend.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/customer-360" search={{ customer: "C001" }}>
                  Open Customer 360 <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/model-insights">View Model Insights</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-28 w-full shrink-0 md:h-auto md:w-[380px]">
            <img
              src={finoraLogo}
              alt="FINORA — Beyond the Numbers"
              className="absolute inset-0 h-full w-full bg-primary object-contain p-6 md:rounded-l-none md:rounded-r-xl"
            />
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={<Users className="size-5" />}
          title="Demo customers"
          value={String(overview.totalCustomers)}
          hint="7 demo scenarios in the portfolio"
        />
        <KpiCard
          icon={<AlertTriangle className="size-5" />}
          title="Flagged transactions"
          value={`${overview.flaggedCount} of ${overview.totalCustomers}`}
          hint="Above the fraud decision threshold"
        />
        <KpiCard
          icon={<UserRoundSearch className="size-5" />}
          title="High churn risk"
          value={String(overview.retentionFocus)}
          hint="Customers receiving retention offers"
        />
        <KpiCard
          icon={<Lightbulb className="size-5" />}
          title="Offer opportunities"
          value={String(overview.offerOpportunities)}
          hint="Top-3 products across eligible customers"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Churn risk distribution</CardTitle>
            <CardDescription>
              Demo customers per churn risk band (Low &lt; 30%, Medium 30–60%,
              High &gt; 60%)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-1">
            {overview.churnBands.map((entry) => (
              <div key={entry.band}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-foreground">
                    {entry.band}
                  </span>
                  <span className="text-muted-foreground">
                    {entry.count} customer{entry.count === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(entry.count / churnMax) * 100}%`,
                      backgroundColor: churnBandColors[entry.band],
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Demo scenarios</CardTitle>
            <CardDescription>
              Customers per scenario in the demo portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            {overview.scenarios.map((entry) => (
              <div
                key={entry.scenario}
                className="grid grid-cols-[minmax(0,160px)_1fr_24px] items-center gap-3"
              >
                <span
                  className="truncate text-xs font-medium text-foreground"
                  title={entry.scenario}
                >
                  {entry.scenario}
                </span>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(entry.count / scenarioMax) * 100}%` }}
                  />
                </div>
                <span className="text-right text-xs text-muted-foreground">
                  {entry.count}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Activity + quick navigation */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent demo activity</CardTitle>
            <CardDescription>
              Latest screening runs and completed Customer 360 flows
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {RECENT_ACTIVITY.map((activity) => (
              <Link
                key={`${activity.customerId}-${activity.time}`}
                to="/customer-360"
                search={{ customer: activity.customerId }}
                className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-accent"
              >
                <div
                  className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${activity.action.includes("flagged") ? "bg-destructive/10 text-destructive" : "bg-primary/8 text-primary"}`}
                >
                  {activity.action.includes("flagged") ? (
                    <CreditCard className="size-4" />
                  ) : (
                    <UserRoundSearch className="size-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {activity.customerName} · {activity.action}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {activity.detail}
                  </p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Customer 360</CardTitle>
            <CardDescription>
              The guided decision flow: transaction screening → churn risk →
              personalized offers, summarized for one customer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg bg-accent p-4">
              <p className="text-xs leading-relaxed text-accent-foreground">
                Pick one of the 20 demo customers and run the full intelligence
                workflow. If a transaction is flagged, the flow stops — no
                offers are made on suspicious transactions.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                {
                  to: "/fraud-detection",
                  label: "Fraud Detection",
                  icon: CreditCard,
                },
                { to: "/customer-churn", label: "Churn", icon: Gauge },
                {
                  to: "/product-recommendations",
                  label: "Offers",
                  icon: Lightbulb,
                },
              ].map((item) => (
                <Button key={item.to} asChild variant="outline" size="sm">
                  <Link to={item.to}>
                    <item.icon className="size-4" /> {item.label}
                  </Link>
                </Button>
              ))}
            </div>
            <Button asChild className="w-full">
              <Link to="/customer-360" search={{ customer: "C001" }}>
                Run Customer 360 <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
