> Core database/web release completed on 26 October 2026. Read DEPLOYED_2026-10-26.md first. Earlier pending-approval/deployment statements below describe preparation and are superseded for this release. Execution/publishing/clinical/Circle/mobile gates remain in force.

# Latest validation — 26 October 2026

72 tests, TypeScript and webpack production build pass. Full application schema rehearsal covers 53 tables/39 functions/four views and preserves 81 original policies/135 constraints. The twelve-migration transaction plus guarded founder bootstrap and history registration passed locally in 0.270s; lock contention aborted and fully rolled back in 2.213s. Managed platform differences, synthetic data, deployment-only asset checks and pre-existing production advisor findings are detailed in PREDEPLOY_REVIEW_2026-10-26.md. No production schema/application release is claimed.

## Latest release review follow-up — 25 October 2026

67 tests pass after adding the captured-production-contract rehearsal and a regression for audited moderation. Twelve reviewed migrations apply successfully in both PGlite and a separate local PostgreSQL database. Actual PostgreSQL synthetic checks pass for founder/parent moderation boundaries, audit creation, unchanged parent text, legacy booking triggers and paused zero-budget controls. TypeScript passes. See SCHEMA_REHEARSAL_2026-10-25.md for the seven-table scope and explicit platform/project-wide limitations. This supersedes the earlier eleven-migration/63-test count below.

# Current validation checkpoint — 25 October 2026

The original package record below is historical and superseded for integrated development acceptance by the 24 October packet. That packet records 63 passing tests plus the separately enabled full local Auth/Storage journey, TypeScript and webpack production build, real decision-memory API verification, and clear local security/performance advisors. It does not prove production deployment or the complete actual-production-schema rehearsal. Evidence: childassist/outputs/superbrain-integration-2026-10-24/.

On 25 October the temporary source directories were recovered from verified bundles. Existing Docker volumes retained three decisions and eight campaigns. Auth health responded, and database control remained paused=true, execution=false, budget=0. The read-only migration checksum check matched all eleven reviewed files. All 63 tests passed again on restored source. Signed-in desktop Chrome acceptance completed for Today headline, priorities, prepared drafts, three persisted decisions and a direct next-action answer. Founder summary/community/results and ask routes returned HTTP 200. No external actions were requested.

## Historical package validation

# Validation record — 23 October 2026

Checks performed in the isolated package, not in production GoBela:

- TypeScript strict type checking.
- Optimized Next.js production build.
- 20 regression tests across five Vitest suites, with real PostgreSQL-compatible PGlite execution of the core SQL migration and storage policies. Storage's table/function surface is mocked for policy testing, not a real Supabase Storage service.
- Database tests cover founder/parent isolation, child ownership, private health access, cascade deletion, default-grant protection, immutable approvals, pause, cost reservations, expired/duplicate execution, uncertain outcomes, request limits, moderation, badge evidence privacy, photo visibility and consent ownership.
- Domain/API tests cover filtered recommendations, stale/future listing exclusion, explicit availability uncertainty, invalid channels/timestamps, hidden internal errors, unsigned access rejection and no-AI fallback.
- Integration helper tests cover dry run, preserving an existing root layout, avoiding package replacement and refusing all copying on a conflicting file.
- Dart analysis of the injected mobile client and discovery/family screens, using the existing GoBela dependency resolution, reports no issues. No mobile build or device test was performed.
- HTTP smoke checks: all four pages return 200 with the expected headings; unsigned founder, family-health and Circle API requests return 401.
- Browser inspection of built founder and parent sign-in screens and navigation. No production credentials were entered. Signed-in screens have not been tested against live Supabase.

Run `bash scripts/verify.sh` from the package for reproducible web checks. Use `npm ci` first on a fresh machine. Dart package resolution used for local analysis is machine-specific and excluded from the downloadable archive; integrate the files into the existing app and run its standard analyzer/tests.

Not verified: production schema/migration history, real Supabase Auth/Storage/PostgREST integration, the entire signed-in UI journey, existing catalogue/Circle mapping, live AI generations, real channel publication, remote push/reminder delivery, provider availability, payments, ad metrics or clinical reference data. No deployment, production data mutation, email, outreach or credit-consuming generation was performed.

The package's core transaction tests exercise PostgreSQL semantics, but PGlite is a single-process environment. Row locks serialize action claims in the code; multi-connection contention and real network interruption recovery must also be tested against development Postgres/Supabase before enabling dispatch.
