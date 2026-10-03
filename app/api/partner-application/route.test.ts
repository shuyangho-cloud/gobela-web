import { describe, it, expect, vi, beforeEach } from "vitest";

const insertMock = vi.fn();
const updateIlikeMock = vi.fn().mockResolvedValue({ error: null });

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn((table: string) => {
      if (table === "partner_applications") {
        return { insert: insertMock };
      }
      if (table === "outreach_contacts") {
        return { update: vi.fn(() => ({ ilike: updateIlikeMock })) };
      }
      return {};
    }),
  })),
}));

const upsertBrevoContactMock = vi.fn();
vi.mock("@/lib/brevo", () => ({
  upsertBrevoContact: upsertBrevoContactMock,
  PROVIDER_LIST_ID: 8,
}));

vi.mock("@/lib/rateLimit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue(true),
  clientIdentifier: vi.fn().mockReturnValue("127.0.0.1"),
}));

// Avoid depending on the real Brevo notification email during tests —
// that's a separate, pre-existing concern this task doesn't touch.
const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
vi.stubGlobal("fetch", fetchMock);

const { POST } = await import("./route.js");

function makeRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/partner-application", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

const validApplication = {
  businessName: "Little Stars Enrichment",
  contactName: "Sarah Tan",
  email: "sarah@littlestars.sg",
  partnerType: "activity",
};

describe("POST /api/partner-application", () => {
  beforeEach(() => {
    insertMock.mockReset();
    upsertBrevoContactMock.mockReset();
    upsertBrevoContactMock.mockResolvedValue({ ok: true });
    fetchMock.mockClear();
  });

  it("creates a new provider signup and syncs it to Brevo's provider list", async () => {
    insertMock.mockResolvedValue({ error: null });

    const res = await POST(makeRequest(validApplication));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true });
    expect(upsertBrevoContactMock).toHaveBeenCalledWith({
      email: "sarah@littlestars.sg",
      listId: 8,
      attributes: { PROVIDER_STATUS: "pending" },
    });
  });

  it("rejects an invalid email before touching the database", async () => {
    const res = await POST(
      makeRequest({ ...validApplication, email: "not-an-email" }),
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toMatch(/valid email/i);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("rejects when required fields are missing", async () => {
    const res = await POST(makeRequest({ email: "sarah@littlestars.sg" }));
    expect(res.status).toBe(400);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("still returns success to the client when Brevo sync fails", async () => {
    insertMock.mockResolvedValue({ error: null });
    upsertBrevoContactMock.mockResolvedValue({ ok: false, error: "brevo responded 500" });

    const res = await POST(makeRequest(validApplication));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true });
  });

  it("still returns success to the client when BREVO_API_KEY is missing", async () => {
    insertMock.mockResolvedValue({ error: null });
    upsertBrevoContactMock.mockResolvedValue({ ok: false, error: "not configured" });

    const res = await POST(makeRequest(validApplication));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
  });

  it("silently succeeds without writing anything when the honeypot field is filled", async () => {
    const res = await POST(makeRequest({ ...validApplication, company: "Acme" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true });
    expect(insertMock).not.toHaveBeenCalled();
    expect(upsertBrevoContactMock).not.toHaveBeenCalled();
  });
});
