import { describe, it, expect, vi, beforeEach } from "vitest";

const insertMock = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({ insert: insertMock })),
  })),
}));

const upsertBrevoContactMock = vi.fn();
vi.mock("@/lib/brevo", () => ({
  upsertBrevoContact: upsertBrevoContactMock,
  PARENT_LIST_ID: 7,
}));

vi.mock("@/lib/rateLimit", () => ({
  checkRateLimit: vi.fn().mockResolvedValue(true),
  clientIdentifier: vi.fn().mockReturnValue("127.0.0.1"),
}));

// Imported after the mocks above so the route picks up the mocked modules.
const { POST } = await import("./route.js");

function makeRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/waitlist", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/waitlist", () => {
  beforeEach(() => {
    insertMock.mockReset();
    upsertBrevoContactMock.mockReset();
    upsertBrevoContactMock.mockResolvedValue({ ok: true });
  });

  it("creates a new parent signup and syncs it to Brevo's parent list", async () => {
    insertMock.mockResolvedValue({ error: null });

    const res = await POST(
      makeRequest({
        name: "Sarah Tan",
        email: "sarah@example.com",
        child_age: "3-4",
        interests: "swimming",
        preferred_area: "Bishan",
      }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, duplicate: false });
    expect(insertMock).toHaveBeenCalledWith({
      name: "Sarah Tan",
      email: "sarah@example.com",
      child_age: "3-4",
    });
    expect(upsertBrevoContactMock).toHaveBeenCalledWith({
      email: "sarah@example.com",
      listId: 7,
      attributes: {
        CHILD_AGE_GROUP: "3-4",
        INTERESTS: "swimming",
        PREFERRED_AREA: "Bishan",
      },
    });
  });

  it("treats a duplicate signup (Postgres 23505) as success and still syncs to Brevo", async () => {
    insertMock.mockResolvedValue({ error: { code: "23505" } });

    const res = await POST(
      makeRequest({ name: "Sarah Tan", email: "sarah@example.com" }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, duplicate: true });
    // Existing parent updating their info should still reach Brevo so
    // CHILD_AGE_GROUP/INTERESTS/PREFERRED_AREA changes land there too.
    expect(upsertBrevoContactMock).toHaveBeenCalledTimes(1);
  });

  it("rejects an invalid email before touching the database or Brevo", async () => {
    const res = await POST(
      makeRequest({ name: "Sarah Tan", email: "not-an-email" }),
    );
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toMatch(/valid email/i);
    expect(insertMock).not.toHaveBeenCalled();
    expect(upsertBrevoContactMock).not.toHaveBeenCalled();
  });

  it("still returns success to the client when Brevo sync fails", async () => {
    insertMock.mockResolvedValue({ error: null });
    upsertBrevoContactMock.mockResolvedValue({ ok: false, error: "brevo responded 500" });

    const res = await POST(
      makeRequest({ name: "Sarah Tan", email: "sarah@example.com" }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, duplicate: false });
  });

  it("still returns success to the client when BREVO_API_KEY is missing (lib/brevo reports not configured)", async () => {
    insertMock.mockResolvedValue({ error: null });
    upsertBrevoContactMock.mockResolvedValue({ ok: false, error: "not configured" });

    const res = await POST(
      makeRequest({ name: "Sarah Tan", email: "sarah@example.com" }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
  });

  it("silently succeeds without writing anything when the honeypot field is filled", async () => {
    const res = await POST(
      makeRequest({ name: "Bot", email: "bot@example.com", company: "Acme" }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true });
    expect(insertMock).not.toHaveBeenCalled();
    expect(upsertBrevoContactMock).not.toHaveBeenCalled();
  });
});
