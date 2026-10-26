> Core database/web release completed on 26 October 2026. Read DEPLOYED_2026-10-26.md first. Earlier pending-approval/deployment statements below describe preparation and are superseded for this release. Execution/publishing/clinical/Circle/mobile gates remain in force.

# Release gates

Production is not authorized. Server execution and legacy admin mutations default off. Mobile SUPERBRAIN_ENABLED defaults false. Family records do not provide clinical interpretation or delivered notifications.

Before enabling: verified founder Auth UUID, development signed-in multi-account tests, account-specific publisher/suppression and receipt reconciliation, real Storage/Auth tests, consent and retention review, catalogue metadata review and Circle reconciliation. Existing gobela_reviews, review_helpful, review_flags and user_reports remain primary; the additive gb_circle workspace must not replace existing Circle navigation or accept production contributions until reconciliation is validated.

Live read-only inspection on 2026-10-23 found GoBela in ap-northeast-1, contrary to the older Singapore-region note. Review residency before health launch. No gb_* tables are deployed. Existing advisor findings include three security-definer views and callable trigger functions. These require scoped review; no production policies were changed.

Current Meta blocker: server Page token invalid (190); Chrome session is valid but its old app token lacks the required scopes. instagram_basic is configured for testing on business-owned app 26670802669196958. Facebook Page use-case activation was rejected by automatic approval review because Manage everything on your Page is broader than the two approved scopes. Explicit authorization for that broader capability and owner-controlled credential completion are required before proceeding.


2026-10-23 follow-up: owner explicitly approved the broader Manage everything on your Page use case. Chrome now visibly lists that use case on business-owned GoBela app 26670802669196958. pages_manage_posts was added individually and visibly marked Ready for testing. instagram_basic was previously marked Ready for testing. This supersedes the earlier scope-authorization blocker. A fresh owner-authorized token and real API verification are still required; the old server Page token remains invalid. No publishing, ads or execution flags were enabled.
