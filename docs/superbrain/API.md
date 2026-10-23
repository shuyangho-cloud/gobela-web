# API contract

All endpoints live under `/api/superbrain/`. All require `Authorization: Bearer <current Supabase user access token>`; anonymous sign-ins are rejected. Founder routes additionally require an operator-created `gb_founders` membership. No service-role key is needed by this module's runtime. Errors are `{error:string}` with an appropriate non-200 status. Success is `{data:...}`. Responses are not cached. JSON request bodies are capped at 24 KB.

## Founder

- POST founder/ask: question. Searches the latest 200 knowledge records and returns matching sources plus an optional AI summary. Missing evidence is disclosed; no action tools or private health access.

- GET founder/summary: bounded business collections and tracking-coverage notice; excludes health/memory/children/reminders.
- GET founder/briefing: open tasks, pending approvals and overdue partners.
- GET founder/circle: moderation-visible posts without private verification evidence.
- POST founder/knowledge: title, content, scope(public/business), source_url, verified_at.
- POST founder/catalogue: title, provider, category, area, min_age, max_age, price_cents, source_url, verified_at.
- POST founder/campaigns: title, audience, category, objective. Produces a brand-template draft and unique tracking code.
- POST founder/partners: name, optional contact/stage/next_action/due_at.
- POST founder/tasks: title, optional due_at.
- POST founder/clinics: name, specialty, area, source_url, verified_at.
- PATCH founder/{knowledge|catalogue|campaigns|clinics}/ID: complete validated editable fields, same fields as creation. IDs and tracking codes cannot be assigned by callers.
- PATCH founder/tasks/ID: status(open/doing/done).
- PATCH founder/partners/ID: stage, next_action, optional due_at.
- PATCH founder/enquiries/ID: status(new/contacted/resolved).
- POST founder/controls: paused(boolean), execution_enabled(boolean), daily_budget_cents(integer).
- POST founder/actions: payload(channel,content,audience,campaign_id), reserved_cents(integer).
- PATCH founder/actions/ID: operation(approve/reject/execute/reconcile). Reconcile also requires receipt_id and actual_cost_cents. Exact approved payloads are immutable; revisions require a new request.
- POST founder/moderate: id, status(published/hidden). Resolves existing reports for the post and writes an audit event.
- POST founder/verify-review: id, kind(booking/attendance), evidence(private reference). Badges represent the founder's evidence review, not an automatic attendance check.

## Parents

- POST parent/recommend: age(whole years), budget_cents, optional area/category/question. Returns structured eligible listing cards and a concise description. Accounts are capped at 50 expensive/write requests per Singapore calendar day; the database enforces this before optional AI calls.
- POST parent/enquiries: listing_id, message, optional tracking_code. Records an enquiry, never a booking or payment.
- GET parent/knowledge; GET parent/clinics: recently verified public information.
- GET/POST parent/children: name, birth_date(YYYY-MM-DD).
- GET/POST parent/health: child_id, kind(height_cm/weight_kg/milestone/note), value(string), recorded_at.
- GET/POST parent/reminders: child_id, title, kind(vaccination/health_check/medication/appointment), due_at, optional timezone(default Asia/Singapore).
- GET/POST parent/memory: fact, consent:true for creation.
- PATCH parent/{children|health|memory}/ID: complete editable fields, same as creation.
- PATCH parent/reminders/ID: completed(boolean).
- DELETE parent/{children|health|reminders|memory}/ID: deletes own record; children cascade their health and reminder records.
- GET parent/export: export all module-owned family records for the signed-in account.

All timestamp inputs require an explicit timezone or Z. No caller-provided owner_id is trusted. RLS and child/owner composite foreign keys independently enforce access even if a client calls the database directly.

## Circle

- GET circle/posts: own posts plus published posts; founders can also see moderation records. Includes aggregate helpful counts for published posts.
- POST circle/posts: category, title, body, optional visited_on and photo_path. New posts always enter pending moderation.
- DELETE circle/posts/ID: remove own post.
- POST circle/votes/ID; DELETE circle/votes/ID: one helpful vote per user per published post.
- POST circle/reports/ID: reason.
- POST circle/consents/ID: specific purpose and granted(boolean). Only the author can grant or withdraw permission.
- POST circle/upload: extension(jpg/png/webp). Returns a signed upload token/path for the private gb-circle bucket. Upload with the authenticated Supabase client. Maximum 5 MB; storage restricts MIME types.
- POST circle/photo: path. Returns a 60-second signed read URL only if storage policies allow the current user. A signed URL issued before moderation changes may remain valid until its short expiry.

Categories: cook/eat/play/learn/shop. Photo upload is optional and requires the separate storage migration. Own orphan uploads can be deleted through storage; scheduled orphan cleanup is not included. Do not log raw health request bodies, access tokens or private image URLs in application monitoring.
