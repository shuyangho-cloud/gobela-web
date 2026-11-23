# Weekly budget ledger — disabled review, 23 November 2026

Owner allocation: S$50 Meta ads + S$10 Superbrain AI + S$10 held reserve each Singapore Monday–Sunday. No carry-forward, reserve spending or category transfers. Spendable total is S$60, not S$70 plus reserve. The legacy daily limit is not a weekly approval.

Companion childassist migration: 20261123012648_superbrain_weekly_budget.sql. Adds private, RLS-enabled tables and service-only reserve/settle RPCs; no anonymous/parent access or direct service table writes. Policy starts disabled. Existing production controls remain unchanged. All reservations serialize on the control/policy rows; unsettled costs from any prior week remain held. Fixed category ceilings prevent transferring unused allowance. Settled past-week costs stay attributed to their original week. A replay returns acquired=false and MUST NOT cause another provider call.

Positive-cost founder action transitions now require a matching, unsettled current-week ads reservation keyed by action UUID. The existing daily limit, founder approval, expiry and execution controls still apply as additional restrictions. Zero-cost flows are unchanged. This does not create an ads adapter or label generic paid actions as verified Meta advertising.

Settlement requires a trusted provider receipt and SGD cost, including all taxes, fees and currency conversion. Never infer no charge from a network error. Actual overruns are preserved and halt new paid reservations. Zero-cost settlement requires positive evidence that the provider charged nothing. No automatic expiry, cancellation, retry, refund credit or release of unknown holds is provided. Action completion does not automatically settle the monetary ledger; a trusted billing reconciliation must do so.

## Activation remains blocked

- This is a foundation, not complete weekly enforcement for all providers. Existing optional assistant generateText calls are not yet routed through this ledger: keep SUPERBRAIN_AI_ENABLED off. Do not enable AI from an environment flag until a reviewed adapter provides a verifiable maximum SGD cost per attempt, bounded input/output, no hidden retries/fallbacks, reservation-before-call and receipt reconciliation afterward.
- Reconcile Meta's historic October campaign, current-week spend and all outstanding commitments before enabling a paid adapter. A ledger cannot cap ads created in Ads Manager or other applications. Any Meta activation needs account-wide controls, compatible provider limits, fresh billing evidence and treatment of late reported charges.
- Import externally incurred spend/commitments through an audited, reviewed reconciliation procedure; this migration intentionally provides no unverified reconciliation/enable RPC. Never initialize an empty ledger as proof of zero external spend.
- Rehearse on the exact production Postgres/Supabase version with two independent connections to verify row-lock contention and lock ordering. PGlite tests validate functional serialization and boundary behavior, not a true multiprocess contention benchmark. Rehearse all project migrations and run local advisors before production approval.
- Review migration and service adapter credentials before deployment. No new production rollout/activation authorization is inferred from the earlier disabled rollout approval.

Tests cover Singapore week boundaries, fixed caps, held reserve, idempotency, unresolved prior-week charges, evidence requirements, overrun preservation/halt, disabled/missing controls, grants, service-only access and the real founder command on the existing additive schema. No providers are contacted or billed by tests.
