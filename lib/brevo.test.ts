import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { upsertBrevoContact, PARENT_LIST_ID } from "./brevo";

describe("upsertBrevoContact", () => {
  const originalKey = process.env.BREVO_API_KEY;

  beforeEach(() => {
    process.env.BREVO_API_KEY = "test-key";
  });

  afterEach(() => {
    process.env.BREVO_API_KEY = originalKey;
    vi.restoreAllMocks();
  });

  it("returns ok on a 201 (new contact created)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 201 })),
    );

    const result = await upsertBrevoContact({
      email: "parent@example.com",
      listId: PARENT_LIST_ID,
      attributes: { CHILD_AGE_GROUP: "3-4" },
    });

    expect(result).toEqual({ ok: true });
    expect(fetch).toHaveBeenCalledWith(
      "https://api.brevo.com/v3/contacts",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "api-key": "test-key" }),
      }),
    );
  });

  it("returns ok on a 204 (existing contact updated)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
    );

    const result = await upsertBrevoContact({
      email: "parent@example.com",
      listId: PARENT_LIST_ID,
    });

    expect(result).toEqual({ ok: true });
  });

  it("sends updateEnabled:true so repeat submissions never error as duplicates", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    await upsertBrevoContact({ email: "parent@example.com", listId: PARENT_LIST_ID });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.updateEnabled).toBe(true);
    expect(body.listIds).toEqual([PARENT_LIST_ID]);
  });

  it("omits empty/undefined attributes rather than overwriting with blanks", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }));
    vi.stubGlobal("fetch", fetchMock);

    await upsertBrevoContact({
      email: "parent@example.com",
      listId: PARENT_LIST_ID,
      attributes: { CHILD_AGE_GROUP: "3-4", INTERESTS: undefined, PREFERRED_AREA: "" },
    });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.attributes).toEqual({ CHILD_AGE_GROUP: "3-4" });
  });

  it("returns a failure result (not a thrown error) when Brevo responds with an error status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("bad request", { status: 400 })),
    );

    const result = await upsertBrevoContact({
      email: "parent@example.com",
      listId: PARENT_LIST_ID,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("400");
      expect(result.error).not.toContain("parent@example.com"); // never echoes request content
    }
  });

  it("fails closed without attempting a network call when BREVO_API_KEY is missing", async () => {
    delete process.env.BREVO_API_KEY;
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const result = await upsertBrevoContact({
      email: "parent@example.com",
      listId: PARENT_LIST_ID,
    });

    expect(result).toEqual({ ok: false, error: "not configured" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("never throws even if fetch itself rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    const result = await upsertBrevoContact({
      email: "parent@example.com",
      listId: PARENT_LIST_ID,
    });

    expect(result.ok).toBe(false);
  });
});
