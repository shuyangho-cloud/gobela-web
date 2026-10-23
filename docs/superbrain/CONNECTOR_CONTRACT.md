# Approved-action connector

The code calls only the fixed HTTPS URL configured by the deployment operator. It never accepts a tool URL from a parent, campaign or model. Execution is disabled by default in both server configuration and database controls.

Request: POST, `Authorization: Bearer <server secret>`, `Idempotency-Key: <action UUID>`.

```json
{"action_id":"UUID","payload":{"campaign_id":"UUID","channel":"email","audience":"approved recipient group","content":"exact approved text"},"maximum_cost_cents":0}
```

Response only after confirmed publication/send:

```json
{"receipt_id":"platform receipt","actual_cost_cents":0}
```

An adapter must validate the exact audience, channel authority and content, enforce cost limits before spending, and make repeated requests with the same key return the original receipt without repeating the send. The adapter must reject an altered payload using an existing key. A request acknowledgement or queued-job ID is not proof of publication; do not return it as a publication receipt.

Timeout, interruption or invalid receipt leaves an action executing or uncertain, with its reservation retained. There is no automatic retry. Find the channel-side result using the action UUID, then use founder reconciliation with independently verified receipt and actual cost. A genuinely failed unsent action currently needs operator reconciliation; do not clear its reservation or resend without evidence. Costs above the approved maximum are recorded honestly and automatically pause new execution.

No real platform adapter is bundled: account-specific Meta/email/push adapters, unsubscribe suppression, permissions, publication assets, token rotation and platform policy checks remain integration tasks. Do not point this endpoint at the existing unauthenticated Bela route or a generic automation webhook without implementing this contract.

AI summaries use AI Gateway separately. Their provider spending is not charged against the marketing action budget. AI is off by default, requests are capped per account, and the operator must configure a provider-side spending cap before enabling it. Deterministic recommendations and campaign drafting work without paid AI.
