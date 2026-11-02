import { CreditCard, Landmark, MapPin, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DemoCustomer } from "@/types/finora";
import {
  formatTransactionTime,
  formatUsd,
  InfoRow,
} from "@/components/finora/shared";

export function CustomerProfileCard({
  customer,
  className = "",
  showTransaction = true,
}: {
  customer: DemoCustomer;
  className?: string;
  showTransaction?: boolean;
}) {
  const { profile } = customer;

  return (
    <Card className={className}>
      <CardHeader className="border-b border-border/70">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
              {customer.demoId} · Synthetic profile
            </p>
            <CardTitle className="mt-1 text-lg">{customer.demoName}</CardTitle>
            <CardDescription className="mt-1">
              {customer.demoScenario}
            </CardDescription>
          </div>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
            <UserRound className="size-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 pt-4">
        <InfoRow label="Age" value={`${profile.age} years`} />
        <InfoRow
          label="Geography"
          value={
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5 text-muted-foreground" />
              {profile.geography}
            </span>
          }
        />
        <InfoRow
          label="Income"
          value={`${formatUsd(profile.income * 1000)} / year`}
        />
        <InfoRow label="Tenure" value={`${profile.tenure} years`} />
        <InfoRow
          label="Relationship"
          value={`${profile.numOfProducts} product${profile.numOfProducts === 1 ? "" : "s"}`}
        />
        <InfoRow
          label="Membership"
          value={profile.isActiveMember ? "Active" : "Inactive"}
        />
        {showTransaction && (
          <div className="mt-4 rounded-lg border border-border/70 bg-muted/45 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <CreditCard className="size-3.5 text-primary" /> Transaction to
              screen
            </div>
            <p className="mt-1 text-sm font-medium text-foreground">
              {customer.demoTransactionType}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatUsd(customer.transaction.amount)} ·{" "}
              {formatTransactionTime(customer.transaction.time)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function OwnedProducts({ customer }: { customer: DemoCustomer }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Landmark className="size-4 text-primary" /> Existing relationship
        </CardTitle>
        <CardDescription>
          Products already held are removed before offers are ranked.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {customer.ownedProducts.map((product) => (
          <Badge key={product} variant="secondary">
            {product}
          </Badge>
        ))}
      </CardContent>
    </Card>
  );
}

export function WorkflowStepper({
  stage,
}: {
  stage: "idle" | "fraud" | "stopped" | "churn" | "offers" | "done";
}) {
  const current =
    stage === "idle"
      ? 0
      : stage === "fraud" || stage === "stopped"
        ? 1
        : stage === "churn"
          ? 2
          : stage === "offers"
            ? 3
            : 4;
  const steps = ["Select", "Fraud", "Churn", "Offers", "Summary"];

  return (
    <ol
      className="grid grid-cols-5 gap-1"
      aria-label="Customer 360 workflow status"
    >
      {steps.map((label, index) => {
        const step = index + 1;
        const complete = current > step || stage === "done";
        const active = current === step;
        const stopped = stage === "stopped" && step === 2;
        return (
          <li key={label} className="min-w-0">
            <div
              className={`h-1.5 rounded-full ${stopped ? "bg-destructive" : complete ? "bg-success" : active ? "bg-primary" : "bg-border"}`}
            />
            <p
              className={`mt-2 truncate text-[11px] font-medium ${stopped ? "text-destructive" : active ? "text-primary" : complete ? "text-success" : "text-muted-foreground"}`}
            >
              {step}. {label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
