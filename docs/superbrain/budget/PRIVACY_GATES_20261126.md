# AI privacy and spending gates — 26 November 2026

Review-only follow-up to deployed PR9. No configuration, paid request, keys, team policy or production behavior changed by preparing this branch.

## Request protection

The budgeted server adapter now requests both zeroDataRetention and disallowPromptTraining, preserving its provider allowlist, empty model fallback list and zero SDK retries. It returns generated text only when response metadata confirms enabledZeroDataRetention=true. Missing confirmation withholds text but still records and settles a valid receipt, so privacy rejection cannot turn a billed generation into apparently free usage. No tools, files, images or health-record access are added.

Vercel documents per-request ZDR as having no additional charge; team-wide ZDR has a separate request fee. Eligibility requires an applicable paid plan, purchased credits or qualifying Token Pass. The adapter must fail closed on an eligibility error; do not automatically purchase credits, upgrade a plan or remove privacy filters. ZDR and no-training are distinct controls; provider flags do not establish Singapore residency or accepted processor terms. Short-lived provider caching and tool-specific exclusions require separate consideration. Initial use remains synchronous text only.

Sources checked 26 November:
- https://vercel.com/docs/ai-gateway/security-and-compliance/zdr
- https://vercel.com/docs/ai-gateway/security-and-compliance/disallow-prompt-training
- Installed @ai-sdk/gateway source gateway-provider-options.ts and bundled docs 00-ai-gateway.mdx (locked by package-lock.json).

## Budget backstop

CLI reads show no custom project, default project or team cap, and no routing overrides. Project usage returned no attributed records for the checked window; this is not account-wide zero spend. Do not change a team-wide cap or defaults that could affect unrelated projects.

Prepare only a GoBela project-scoped USD cap after verifying FX, tax/fees and authentication attribution. Provider weekly periods reset Monday00:00UTC (Monday08:00Singapore), and the crossing request completes. The provider cap is an extra soft guard; the atomic S$10 Singapore-week ledger remains authoritative. Do not substitute USD10 for the approved S$10 allowance. API-key/BYOK attribution must be verified before claiming the project cap covers all requests.

Source: https://vercel.com/docs/ai-gateway/observability-and-spend/budgets

## Still open before activation

- Verify current model endpoint pricing, account eligibility, team compliance fees and provider-key behavior.
- Verify an FX/fee/tax accounting ceiling and accepted processor/privacy arrangements; no live contract fabricated.
- Provision a guarded expiring cost contract and project cap consistent with S$10/week.
- Perform one separately permitted synthetic bounded billing acceptance; verify actual provider/model/privacy metadata and receipt settlement.
- Keep founder control and AI/Meta/execution off until separate activation approval.
