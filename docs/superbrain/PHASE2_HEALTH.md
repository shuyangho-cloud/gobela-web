# Phase 2 health boundary

Implemented: per-account children, measurements, milestones, notes, timezone-aware reminder records, completion, export and deletion, plus a fresh-source clinic directory. Foreign keys enforce that a child and their records belong to the same account. Founders have no policy granting access to another family's children, measurements, memories or reminders. No health records enter recommendation prompts or marketing queries.

Not implemented: clinically reviewed growth percentiles/charts, automatic milestone assessment, vaccination recommendations, dosage advice, remote notification delivery, appointment booking, shared guardianship or medical decision-making. Do not imply that storing height/weight provides growth-chart interpretation. Do not display invented clinical reference data or seed actual clinic claims without verification.

Before launch: qualified review of reference data and wording, explicit health consent, purpose/retention policy, data-region and processor review, access/export/deletion UX, guardian ownership/sharing model and failure-tested notifications. API delete of children cascades health/reminder rows; integration with existing account deletion and backup-retention procedures remains necessary. Export currently covers module-owned family tables, not every existing GoBela record.

Web and Flutter screens explicitly say reminders are records with no background delivery connected. Add notification opt-in and cancellation on logout/account switch before implementing delivery. Never put child or medication details in lock-screen notification text by default. Time-critical notifications must not be represented as guaranteed.
