# Integration review

Founder is the verified shuyangho@gmail.com Auth UUID 07aeee08-37ac-4c04-8078-18bc1fd776aa. The bootstrap script verifies both UUID and confirmed email, rejects additional founders, and has not run in production.

Web changes add /superbrain, /bela, /family, preview /circle, authenticated /api/superbrain, founder-protected legacy admin, and opt-in paused legacy partner mutations. Direct legacy broadcast is retired. Runtime superbrain requests use user tokens and RLS. AI, external execution, Circle preview and mobile feature navigation default off. No schedules, sends, publications or clinical features were enabled.

Catalogue retrieval overlays reviewed eligibility/source metadata on enrichment_classes. Existing IDs, provider, price and active state stay authoritative. Optional age_months is compatible with whole-year clients; conflicting age inputs are rejected. Metadata must be curated with real verification timestamps. No bulk import pretends existing data has been verified today.

Existing Circle remains primary. Founder can inspect the same existing gobela_reviews, user_reports and review_flags; the new gb_circle photo/consent/moderation workflow is a disabled preview. Full consolidation is a release gate, not a completed migration.

Private family consent is recorded and enforced for inserts/updates by restrictive RLS. Withdrawal preserves read/export/deletion. Account deletion removes private Circle storage objects before auth deletion cascades family data. Private records never enter founder knowledge or marketing. Backup retention, region/processor review and clinical reference review remain external dependencies.

Campaign reporting exposes explicit enquiry and booking linkage only. The booking linkage column and composite foreign key reject cross-family joins. The existing booking UI does not yet carry the new enquiry ID automatically. No revenue, ad click or impression claims are made.

Dependency security: original Next 16.2.4 and Vitest 3 had critical advisories. Integration uses patched Next 16.4.2, Vitest 5.0.5 and compatible Node 22 type definitions, with a regenerated lockfile. Final compatible dependency fixes reported zero vulnerabilities.

The non-sending adapter accepts only gobela-development-review-only, costs zero and produces clearly marked test receipts. Exact payload immutability and no duplicate claims remain database enforced. A real account-specific publisher, suppression checks and receipt reconciliation are not enabled.

Chrome verification confirmed the logged-in GoBela Business Suite, Facebook Page 1105312236002694 and business 1477768230559626. The GoBela Graph Explorer's existing user token successfully listed that Page with CREATE_CONTENT/MANAGE tasks on API v25.0. The old server Page token is invalid (Meta 190). Browser login does not refresh the server token. Instagram business-account fields were empty/disallowed with the current token. No token is included in source, patches or this report.

A disabled organic Facebook adapter now verifies the Page token identity, exact `facebook:<page-id>:public` audience, zero cost, a database-claimed immutable action and the published post's content/permalink before returning a receipt. It performs no retries after uncertainty; the database prevents a second claim. Instagram media publishing remains a separate release gate. No live publication was attempted.

Live read-only migration history: latest 20261020015701/outreach_sends_provider_message_id; none of these new migrations are deployed. Six cron jobs exist; outreach-send-daily remains inactive. No scheduler was created or modified.

Owner approved requesting pages_manage_posts and instagram_basic. Chrome currently shows two GoBela apps: business-owned 26670802669196958 (Instagram management and app-ad use cases) and 1000783625771679. The old operational IG_APP_ID is a third ID, 2729893310707671. These are not silently treated as the same app. Account/app consolidation and verified Page credentials remain blocked until the correct app's permissions and credential lifecycle are resolved. Existing live browser session is valid; the old server credential is not.

Approved Meta scope work: instagram_basic was individually added to business-owned GoBela app 26670802669196958 and visibly marked Ready for testing. This does not mean an account token has granted it. pages_manage_posts is not available in the current use case. Meta requires adding Manage everything on your Page; automatic approval review rejected saving that broader use case because the owner approved only two specific scopes. No bypass or retry was attempted. No Page use case, refreshed server credential, publication or ads were enabled.

Final code validation: 25 module tests passed, one opt-in live test skipped in the normal run. Next 16.4.2 production build passed. Dart analysis of the five integrated files passed with no issues. Local real PostgreSQL accepted all six migrations against reduced legacy-schema fixtures. Separate live Auth journey failed before creating synthetic accounts: local Auth-to-database requests time out even after isolated hostname mapping repair. Real Auth/Storage signed-in acceptance remains unverified.


2026-10-23 follow-up: owner explicitly approved the broader Manage everything on your Page use case. Chrome now visibly lists that use case on business-owned GoBela app 26670802669196958. pages_manage_posts was added individually and visibly marked Ready for testing. instagram_basic was previously marked Ready for testing. This supersedes the earlier scope-authorization blocker. A fresh owner-authorized token and real API verification are still required; the old server Page token remains invalid. No publishing, ads or execution flags were enabled.

Graph API Explorer handoff prepared: selected the business-owned app configuration (its available permissions match newly configured pages_manage_posts and instagram_basic), selected exactly those two scopes, and opened Get Token. The next owner action is Get Page Access Token and completion of Meta authorization. No new credential was generated by the agent. Browser credential-change rules require owner completion.
