# Existing GoBela catalogue integration

The bundle deliberately does not mutate `enrichment_classes`, `trial_bookings`, `community_reviews` or other existing tables. `gb_*` is an isolated staging boundary. In the integration checkout, inspect the deployed schema and choose one catalogue authority; do not operate two independently edited catalogues after launch.

Local legacy definitions show `id`, `name`, `provider`, `category`, `location`, `trial_price`, `age_range` and `is_active`. Verify current columns first. Map `name` to title, `location` to area, `trial_price` in SGD to integer price_cents, and retain the original ID as legacy_id. Define a reviewed mapping from detailed activity categories into Cook/Eat/Play/Learn/Shop. Do not infer age limits blindly from prose: ages in months need explicit handling. The initial recommendation API accepts whole years; supporting babies by months requires a deliberate compatible contract update before launch.

Every staged record needs a trustworthy HTTPS source, actual verification time, minimum/maximum age and explicit active state. Import time must not be presented as verification time. The existing legacy schema alone is not enough to supply all of these. Implement and test a reviewed import or a server-side adapter once those fields are established.

The enquiry function records interest and hands it to the founder queue. It does not create a payment or booking, promise provider acceptance, or replace the existing booking flow. A campaign tracking code attaches to a recorded enquiry when supplied. Paid booking attribution, ad impressions, clicks and retention still need existing-analytics integration and attribution design.

Circle is also isolated. Reconcile the existing `gobela_community_service.dart` / `community_service.dart` models before making the new Circle UI primary. Do not split reviews, votes and reports between systems silently. Existing notifications and booking messages must continue to use their current verified flow until an explicit migration is tested.
