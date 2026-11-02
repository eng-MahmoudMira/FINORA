# FINORA — Beyond the Numbers

FINORA is a responsive banking-intelligence **frontend prototype**. It brings together a fraud-screening flow, a churn-risk view and ownership-aware product recommendations around one synthetic customer journey.

The application is deliberately frontend-only. It uses deterministic, typed mock predictions so the UI can be demonstrated without loading serialized Python machine-learning files in the browser. It is an educational portfolio project, not a production banking system or a decisioning tool.

## What is implemented

The app opens on the Overview dashboard and includes six working pages:

| Page                    | What it does                                                                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Overview                | Shows the synthetic demo portfolio, demo-only KPIs, restrained risk distribution charts, activity and navigation.                                                   |
| Customer 360            | Runs the guided workflow: select a customer → fraud screen → stop on review, or continue to churn and eligible offers → show a unified summary.                     |
| Fraud Detection         | Screens a selected synthetic transaction and shows the stored review cutoff alongside only the fraud metrics actually supplied in the serialized artifact metadata. |
| Customer Churn          | Assesses a selected synthetic profile and displays a mock probability, Low/Medium/High risk band and non-attribution “demo context cues.”                           |
| Product Recommendations | Shows owned products, excludes them strictly, then ranks the top three eligible mock offers.                                                                        |
| Model Insights          | Documents model tasks, feature contracts, source-backed fraud evidence, unavailable states and the Python replacement boundary.                                     |

## Run locally

Requirements: Node.js 22+ and pnpm 11.25.0 (Corepack can provide the pinned version).

```bash
pnpm install
pnpm dev
```

Open the local Vite URL printed in the terminal. Other useful commands:

```bash
pnpm build
pnpm test
pnpm lint
```

## Publishing this SSR app

FINORA uses TanStack Start server-side rendering, so its production build does not create a static `index.html` bundle. Publication uses the managed Node container defined in `Dockerfile`, with Nitro pinned to the `node-server` preset in `vite.config.ts`. The container builds with the committed pnpm lockfile and serves the generated `.output/server/index.mjs` listener on the platform-provided `PORT` (default `3000`).

This serving container hosts the frontend only. It does not add a database, login system, banking API, or machine-learning inference service.

## Demo data and mock predictions

`src/data/mockData.ts` contains 20 synthetic demo customers across seven scenarios. The data does not represent real bank customers; it exists to demonstrate how separately trained models might be presented in a single UI.

All displayed interactive predictions are produced in `src/services/predictionService.ts`. The service simulates asynchronous API behavior and returns deterministic mock outputs. It applies the fraud-first workflow gate, Low/Medium/High churn bands, and ownership filtering, but **does not execute a JavaScript or Python ML model**.

The frontend mirrors the supplied fraud artifact’s stored threshold of `0.9386608004570007` (93.866%) only to make the synthetic workflow gate consistent. The three synthetic review-path profiles are designed to cross that cutoff. A flagged result suppresses churn and offer results as a safety-oriented UX rule.

## Evidence and limitations

The fraud artifact embedded the following test metadata: Precision 0.8328, Recall 0.6083, F1 0.7031 and PR-AUC 0.7571. FINORA displays these values with provenance labels; it does not recalculate them. A user-provided churn evaluation report is also displayed in Model Insights: CatBoost test accuracy 0.87; class 1 precision 0.74, recall 0.49 and F1 0.59 (support 393/2,000). The report compares Random Forest, XGBoost, CatBoost, LightGBM and SVC; FINORA shows their reported test accuracy and class 1 metrics. These numbers are transcribed, not independently verified. The evidence does not identify the dataset, split methodology, class-1 meaning or decision threshold, so confirm those before interpreting class 1 as churn or using these as operational results. The original supplied report is preserved in `docs/evidence/churn_classification_reports.txt`.

The user-provided product-recommendation JSON is displayed as well. It marks CatBoost as `best_model`, with mean PR-AUC 0.4346, mean ROC-AUC 0.6346 and Precision@1 0.628; the UI compares all ten candidate models and shows CatBoost’s per-product scores alongside the supplied base rates. The values are transcribed, not independently recalculated. The JSON does not document dataset, evaluation split, sample counts, Precision@1 definition or model-selection protocol. The per-product metrics are uneven: for example, Securities Account PR-AUC (0.098) is below its base rate (0.1045), and Online PR-AUC (0.5964) is essentially equal to its base rate (0.5968), with ROC-AUC 0.4948. The exact supplied JSON is preserved in `docs/evidence/offer_metrics.json`.

The written specification describes a Kaggle fraud schema with `Time`, `V1`–`V28` and `Amount`. The supplied XGBoost artifact instead requires a different 17-field merchant/demographic schema. This mismatch must be resolved before any backend integration. The three model families were trained separately, and a real customer does not exist across all their public datasets. Any future production use would require verified data provenance, validation, calibration, monitoring, governance and human review.

A fraud score is a risk signal for review, not proof of fraud. Do not use this project to approve, block or decline real transactions, or to make real decisions about people.

## Future Python backend integration

The browser-facing UI already has a narrow API boundary:

- `src/types/finora.ts` defines `DemoCustomer`, `FraudPrediction`, `ChurnPrediction`, `OfferPrediction` and `Customer360Report` contracts.
- `src/services/predictionService.ts` is the only file that supplies predictions to components.
- A Python API can replace those mock functions with HTTP requests while retaining the same response shapes.

The backend should validate only the columns required for each model, return probabilities from 0–1, serve the fraud threshold from verified artifact metadata, enforce the fraud-first workflow gate, and never send `demo_*` scenario fields to a model. The React frontend should not contain model files or inference code.

## Project structure

```text
src/
├── assets/                 # Supplied FINORA logo assets
├── components/finora/      # Sidebar, selector and reusable FINORA presentation components
├── components/ui/          # Existing accessible UI primitives
├── data/mockData.ts        # Synthetic profiles, product catalogue, activity
├── routes/                 # Overview and the five model/customer routes
├── services/predictionService.ts  # Typed mock service; future Python API swap point
├── types/finora.ts         # Frontend/backend contracts
└── styles.css              # FINORA light-fintech design tokens
```

## Files added or completed during continuation

- `src/components/finora/customer-panels.tsx`
- `src/routes/customer-360.tsx`
- `src/routes/fraud-detection.tsx`
- `src/routes/customer-churn.tsx`
- `src/routes/product-recommendations.tsx`
- `src/routes/model-insights.tsx`
- `public/manus-routes.json`
- `plan.md` and `TODO.md`

Existing overview, navigation, data, service and types files were corrected and polished rather than replaced architecturally.
