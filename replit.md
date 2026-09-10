# مَكانا | Makana

منصة عربية موحّدة تجمع العقارات، التشطيبات، المنزل الذكي، الخدمات المهنية، والمشتريات في تجربة واحدة.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/makana` — the deployable Arabic RTL web experience and brand system.
- `artifacts/api-server/src/routes/makana.ts` — MVP API routes for properties, viewing requests, finishing, professionals, products, orders, and dashboard summaries.
- `artifacts/api-server/src/lib/makana-data.ts` — seeded MVP domain data used by the API.
- `lib/api-spec/openapi.yaml` — source of truth for the API contract.
- `artifacts/makana/src/index.css` — Makana design tokens, typography, and global visual system.

## Architecture decisions

- The product is one unified platform with modular domain routes, not four separate sites.
- Public property pages intentionally expose no owner identity; viewing requests go through the platform.
- New properties start as `Pending Review` and only seeded/approved properties appear in public discovery.
- Finishing estimates explicitly label labor-only pricing and keep the service catalog admin-driven through the API contract.

## Product

- Arabic RTL discovery homepage with Makana identity and navigation across the four MVP domains.
- Searchable/filterable properties with details, favorites, viewing request submission, and property submission workflow.
- Finishing and Smart Home catalog with a labor-only quote calculator.
- Professional directory with search and appointment request flow.
- Marketplace browsing with cart and checkout request flow.
- Customer/admin dashboard summary surface.

## User preferences

- The user asked for a memorable platform name and a custom logo; the current brand is “مَكانا | Makana”.

## Gotchas

- API server routes are mounted under `/api`; the frontend uses the generated client rather than hardcoded service ports.
- Regenerate client/Zod files with `pnpm --filter @workspace/api-spec run codegen` after OpenAPI changes.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
