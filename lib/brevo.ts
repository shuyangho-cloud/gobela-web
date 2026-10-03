// Reusable server-side Brevo client. Never import this from client components —
// BREVO_API_KEY must only ever be read here, on the server.

export const PARENT_LIST_ID = 7;
export const PROVIDER_LIST_ID = 8;

const BREVO_CONTACTS_URL = "https://api.brevo.com/v3/contacts";
const TIMEOUT_MS = 8000;

type BrevoAttributes = Record<string, string | number | boolean | null | undefined>;

type UpsertResult = { ok: true } | { ok: false; error: string };

/**
 * Creates or updates a Brevo contact by email, adding it to the given list.
 * Uses updateEnabled:true so repeat submissions never produce a
 * duplicate-contact error and existing attributes we don't pass are left
 * alone (Brevo merges, it doesn't overwrite the whole contact).
 *
 * Never throws — callers can fire-and-forget this without risking the
 * caller's own response. Failures are returned, not thrown, so the caller
 * decides how (or whether) to log them.
 */
export async function upsertBrevoContact({
  email,
  listId,
  attributes,
}: {
  email: string;
  listId: number;
  attributes?: BrevoAttributes;
}): Promise<UpsertResult> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "not configured" };
  }

  // Only send attributes that were actually supplied, so we never clobber
  // an existing value with an explicit null/undefined on a partial update.
  const cleanAttributes: BrevoAttributes = {};
  if (attributes) {
    for (const [key, value] of Object.entries(attributes)) {
      if (value !== undefined && value !== null && value !== "") {
        cleanAttributes[key] = value;
      }
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const resp = await fetch(BREVO_CONTACTS_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        attributes: cleanAttributes,
        updateEnabled: true,
      }),
      signal: controller.signal,
    });

    // 201 = created, 204 = updated (no body). Both are success.
    if (resp.status === 201 || resp.status === 204) {
      return { ok: true };
    }

    // Don't surface the raw response body (it echoes the request, including
    // the email) into logs/caller — just a short, safe summary.
    return { ok: false, error: `brevo responded ${resp.status}` };
  } catch (err) {
    const message = err instanceof Error ? err.name : "unknown error";
    return { ok: false, error: message === "AbortError" ? "timed out" : message };
  } finally {
    clearTimeout(timeout);
  }
}
