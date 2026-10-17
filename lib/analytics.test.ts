import { afterEach, describe, expect, it, vi } from "vitest";
const capture = vi.hoisted(() => vi.fn());
vi.mock("posthog-js", () => ({ default: { capture } }));
import { canTrack, events, excludedPath, track } from "./analytics";

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); capture.mockClear(); });
function browser(hostname = "gobela.sg", pathname = "/", dnt = "0") {
 vi.stubEnv("NODE_ENV", "production");
 vi.stubGlobal("window", { location: { hostname, pathname } });
 vi.stubGlobal("navigator", { doNotTrack: dnt });
}
describe("production analytics boundaries", () => {
 it.each(["gobela.sg", "www.gobela.sg"])("allows %s", (host) => { browser(host); expect(canTrack()).toBe(true); });
 it.each(["localhost", "gobela-web.vercel.app", "gobela.sg.evil.com"])("blocks %s", (host) => { browser(host); expect(canTrack()).toBe(false); });
 it.each(["/admin", "/admin/applications", "/auth/callback", "/reset-password", "/login"])("excludes %s", (path) => { browser("gobela.sg", path); expect(excludedPath(path)).toBe(true); expect(canTrack()).toBe(false); });
 it("blocks development and DNT", () => { browser(); vi.stubEnv("NODE_ENV", "development"); expect(canTrack()).toBe(false); browser("gobela.sg", "/", "1"); expect(canTrack()).toBe(false); });
 it("sends only the supplied coarse custom properties", () => { browser(); track(events.partnerPriceSelected, { location: "partners_page", price_period: "term" }); expect(capture).toHaveBeenCalledWith("partner_price_period_selected", { location: "partners_page", price_period: "term" }); });
 it("does not capture on excluded routes", () => { browser("gobela.sg", "/admin"); track(events.contactSubmitted, { location: "contact_page" }); expect(capture).not.toHaveBeenCalled(); });
 it("does not break UI when telemetry throws", () => { browser(); capture.mockImplementationOnce(() => { throw new Error("offline"); }); expect(() => track(events.contactSubmitted, { location: "contact_page" })).not.toThrow(); });
});
