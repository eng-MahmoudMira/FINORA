import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ChurnRisk } from "@/types/finora";

// ── Formatting helpers ───────────────────────────────────────────────────────

export const formatPct = (v: number, digits = 1) =>
  `${(v * 100).toFixed(digits)}%`;

export const formatUsd = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    v,
  );

/** Fraud dataset `Time` is seconds since the start of the day. */
export const formatTransactionTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600) % 24;
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

// ── Small building blocks ────────────────────────────────────────────────────

export function DemoBadge({ className = "" }: { className?: string }) {
  return (
    <Badge
      variant="outline"
      className={`border-primary/30 bg-primary/5 text-primary ${className}`}
    >
      Demo data
    </Badge>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function KpiCard({
  icon,
  title,
  value,
  hint,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="flex items-start gap-3 pt-5">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {title}
          </p>
          <p className="mt-1 text-2xl font-semibold text-foreground">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

const riskStyles: Record<ChurnRisk, string> = {
  Low: "bg-success/10 text-success",
  Medium: "bg-warning/15 text-warning",
  High: "bg-destructive/10 text-destructive",
};

export function RiskBadge({ risk }: { risk: ChurnRisk }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${riskStyles[risk]}`}
    >
      {risk} risk
    </span>
  );
}

const barTones = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
};

export function ProbabilityBar({
  value,
  tone = "primary",
  className = "",
}: {
  value: number;
  tone?: keyof typeof barTones;
  className?: string;
}) {
  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-muted ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-700 ${barTones[tone]}`}
        style={{ width: `${Math.round(value * 100)}%` }}
      />
    </div>
  );
}

export function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 py-2 last:border-0">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">
        {value}
      </span>
    </div>
  );
}
