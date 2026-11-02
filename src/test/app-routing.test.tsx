import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without rendering. Rendering is exercised through the managed
// preview; this protects the file-based route registration from regressions.
describe("FINORA app routing", () => {
  const paths = [
    "/",
    "/customer-360",
    "/fraud-detection",
    "/customer-churn",
    "/product-recommendations",
    "/model-insights",
  ];

  it.each(paths)("matches %s instead of falling back to not found", (path) => {
    const router = createRouter({
      routeTree,
      context: { queryClient: new QueryClient() },
    });
    const matches = router.matchRoutes(path);
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
});
