import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Lightbulb, LoaderCircle, Play, Trophy } from "lucide-react";
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
} from "@/components/finora/customer-panels";
import {
  DemoBadge,
  formatPct,
  PageHeader,
  ProbabilityBar,
  RiskBadge,
} from "@/components/finora/shared";
import { DEMO_CUSTOMERS, PRODUCT_CATALOG } from "@/data/mockData";
import {
  getCustomerById,
  predictChurn,
  predictOffers,
} from "@/services/predictionService";
import type { ChurnPrediction, OfferPrediction } from "@/types/finora";

export const Route = createFileRoute("/product-recommendations")({
  head: () => ({
    meta: [{ title: "Product Recommendations — FINORA Banking Intelligence" }],
  }),
  component: ProductRecommendationsPage,
});

function ProductRecommendationsPage() {
  const [customerId, setCustomerId] = useState("C004");
  const [churn, setChurn] = useState<ChurnPrediction | null>(null);
  const [offers, setOffers] = useState<OfferPrediction | null>(null);
  const [running, setRunning] = useState(false);
  const customer = getCustomerById(customerId) ?? DEMO_CUSTOMERS[0]!;

  const runRanking = async () => {
    setChurn(null);
    setOffers(null);
    setRunning(true);
    const nextChurn = await predictChurn(customer);
    const nextOffers = await predictOffers(customer, nextChurn.risk);
    setChurn(nextChurn);
    setOffers(nextOffers);
    setRunning(false);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
      <PageHeader
        title="Product Recommendations"
        description="Rank products that a synthetic customer does not already hold. The ranking is mock data behind a future-ready service boundary."
        actions={<DemoBadge />}
      />
      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer selection</CardTitle>
              <CardDescription>
                Existing products are always filtered before offers are shown.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CustomerSelect
                value={customer.demoId}
                onChange={(id) => {
                  setCustomerId(id);
                  setChurn(null);
                  setOffers(null);
                }}
                ariaLabel="Select a product recommendation demo customer"
              />
              <Button
                onClick={runRanking}
                disabled={running}
                className="w-full"
              >
                {running ? (
                  <>
                    <LoaderCircle className="animate-spin" /> Ranking offers…
                  </>
                ) : (
                  <>
                    <Play /> Rank eligible offers
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          <CustomerProfileCard customer={customer} showTransaction={false} />
          <OwnedProducts customer={customer} />
        </div>
        <div className="space-y-4">
          {offers && churn ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
                        Synthetic propensity ranking
                      </p>
                      <CardTitle className="mt-1 text-xl">
                        {offers.sectionLabel}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Top three eligible products. Owned products do not
                        appear in this list.
                      </CardDescription>
                    </div>
                    <RiskBadge risk={churn.risk} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  {offers.offers.map((offer, index) => (
                    <div
                      key={offer.product}
                      className="rounded-lg border border-border/70 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">
                              {offer.product}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {PRODUCT_CATALOG[offer.product]}
                            </p>
                          </div>
                        </div>
                        <span className="text-lg font-semibold text-primary">
                          {formatPct(offer.probability, 1)}
                        </span>
                      </div>
                      <ProbabilityBar
                        value={offer.probability}
                        className="mt-4"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border-primary/25 bg-primary/3">
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Trophy className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold">
                      {churn.risk === "High"
                        ? "Retain before cross-selling"
                        : "Offer opportunity identified"}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Churn risk is {formatPct(churn.probability, 1)}.{" "}
                      {offers.sectionLabel} remain mock probabilities and are
                      not a real product eligibility, pricing, or credit
                      decision.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
                <Lightbulb className="size-8 text-primary" />
                <h2 className="mt-3 text-lg font-semibold">
                  Rank eligible products
                </h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  The view first obtains a synthetic churn band solely to
                  determine the offer heading, then ranks only unowned products.
                </p>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Exclusion check</CardTitle>
              <CardDescription>
                FINORA suppresses all owned products before sorting
                recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {customer.ownedProducts.map((product) => (
                <div
                  key={product}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <Check className="size-4 text-success" /> {product} — owned,
                  excluded from ranking
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
