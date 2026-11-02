# FINORA Frontend Continuation Plan

## Scope and constraints

Continue the supplied Lovable React + TypeScript + Tailwind + TanStack Start project. Keep this phase frontend-only: no authentication, database, payments, new business backend service, JavaScript ML inference, or external integrations. Preserve the existing file-based router, sidebar, shadcn/Radix components, Lucide icons, Recharts, synthetic 20-customer data, and prediction-service boundary. Complete the five destinations already advertised in the sidebar and repair existing build blockers. Treat prediction outputs as clearly labelled mock demonstrations. Do not invent model-evaluation metrics. Where real fraud-artifact metadata is available, label it as supplied artifact metadata and disclose that the serialized fraud model's input schema does not match the written Kaggle PCA schema; do not claim that artifact is connected to the frontend. After the user explicitly requested publication, configure the existing TanStack Start SSR runtime for managed Node-container deployment; this serves the UI only and does not add banking APIs or ML inference.

## Implementation approach

- Fix missing Lovable-generated logo sidecar imports by importing the supplied PNG assets directly, without changing the artwork.
- Use TanStack file-based route modules for `/`, `/customer-360`, `/fraud-detection`, `/customer-churn`, `/product-recommendations`, and `/model-insights`; allow the existing plugin to regenerate the route tree.
- Keep customer fixtures in `src/data/mockData.ts`, domain/API response contracts in `src/types/finora.ts`, and all mock prediction behavior in `src/services/predictionService.ts`. No component computes a prediction.
- Add the guided Customer 360 run/step states and preserve the fraud-first stop; flagged reports have no churn or offers. Isolate the separate model explorers so each has a working customer selector and action.
- Reuse the current sidebar, UI primitives, shared Finora components, muted blue palette, Inter typography, and responsive utility classes. Add only small shared UI elements needed for clear mock disclosure, customer context, metrics and explanations.
- Update the app README with exact run/build/test instructions, completed pages, which outputs are mocked, current artifact evidence and limitations, and a future Python API contract boundary.

## Design

**Movement:** Premium, clean light banking interface as explicitly requested. **Principles:** quiet confidence; clear risk hierarchy; data-first density without clutter; honest distinction between demo values and verified metadata. **Palette:** logo-derived muted blue as primary, white and #F5F8FC surfaces, #1E293B ink, #64748B secondary text, #E2E8F0 borders; use restrained semantic risk colors only for risk state. **Layout:** fixed desktop navigation rail with a responsive mobile drawer, compact top context bar, aligned page headers and modular content regions. **Signature elements:** supplied geometric F icon; fine blue active-state rule; consistently labelled “Demo data” disclosures. **Interaction:** ordinary controls with visible labels, keyboard focus and explicit loading/empty/error states; no hidden hover-only actions. **Motion:** restrained transitions only for navigation/loading feedback, honor reduced-motion settings, no decorative animation. **Typography:** Inter/system sans; strong hierarchy via size/weight rather than display novelty. **Brand essence:** a banking-intelligence prototype that joins transaction risk, retention and offer signals for analysts; precise, composed, transparent. **Brand voice:** direct and evidence-conscious. Example: “Run the guided review.” “A risk signal—not proof.” **Wordmark/logo:** use the attached official logo/icon exactly, never redraw or distort. **Signature color:** the supplied muted logo blue.

## Project structure and responsibilities

- `src/routes/`: Overview plus five requested route pages; route files compose reusable features.
- `src/components/finora/`: persistent app navigation, customer selection and shared FINORA-specific presentation components.
- `src/components/ui/`: existing primitive UI components; reuse rather than replacing.
- `src/data/mockData.ts`: fixed synthetic demo profiles, product catalogue, activity, and any clearly labeled static artifact metadata.
- `src/services/predictionService.ts`: async mock predictions, overview aggregates, and fraud-gated orchestration; eventual Python API swap point.
- `src/types/finora.ts`: customer, prediction and report interfaces matching the UI/backend boundary.
- `src/styles.css`: existing Tailwind v4 theme tokens and app-wide styles.
- `public/manus-routes.json`: exact static route manifest, synchronized with TanStack routes.

## Integration boundary

The first-phase app uses deterministic mock predictions only. A later Python service can replace the mock service functions while retaining the TypeScript response contracts. Real artifact metrics shown in Model Insights are static sourced metadata only, not an indication that the frontend is calling that artifact. The fraud artifact provenance/schema mismatch must be resolved before any backend integration or operational use.
