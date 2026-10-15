# Stripe return and expired link verification — 15 October 2026

Returning from Stripe now directs partners to refresh actual status in the GoBela Partner Portal. It does not claim connected status or payout approval. Expired links direct partners to request a new link from the portal; status=expired with a provider parameter does not trigger the legacy automatic refresh route.

Validated on remote production base b9d5e68 in an isolated checkout. All 19 Vitest tests passed and the Next.js16.2.4 production build passed. Safari local production-server visual checks passed for status=complete and status=expired&provider=fixture. No real onboarding link, partner account mutation, email, or payment was triggered. Shared website redesign changes preserved.
