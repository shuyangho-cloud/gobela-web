import posthog from "posthog-js";

export const events = {
 partnerFormViewed: "partner_form_viewed",
 partnerPriceSelected: "partner_price_period_selected",
 partnerSubmitted: "partner_form_submitted",
 partnerFailed: "partner_form_submission_failed",
 contactSubmitted: "contact_form_submitted",
 contactFailed: "contact_form_submission_failed",
 chatSubmitted: "bela_chat_submitted",
 chatFailed: "bela_chat_submission_failed",
 ctaClicked: "cta_clicked",
} as const;

type Location = "hero" | "footer" | "navigation" | "partners_page" | "contact_page" | "homepage" | "floating_chat" | "download" | "other_page";
type Properties = {
 location: Location;
 price_period?: "monthly" | "term";
 error_type?: "http" | "network" | "invalid_response";
 cta?: "app_store" | "google_play" | "whatsapp" | "email" | "become_partner" | "sign_up";
};

export function excludedPath(path: string): boolean {
 return /^\/(admin|auth|reset-password|login|signup|sign-up)(\/|$)/.test(path);
}

export function canTrack(): boolean {
 return typeof window !== "undefined" && process.env.NODE_ENV === "production" &&
  ["gobela.sg", "www.gobela.sg"].includes(window.location.hostname) &&
  !excludedPath(window.location.pathname) && navigator.doNotTrack !== "1" && navigator.doNotTrack !== "yes";
}

export function track(event: typeof events[keyof typeof events], properties: Properties): void {
 if (!canTrack()) return;
 // Analytics must never interrupt a form submission or navigation.
 try { posthog.capture(event, properties); } catch { /* optional telemetry */ }
}

// One delegated listener covers server-rendered footers as well as client links.
// Only classify targets locally; never send hrefs, link text or contact details.
export function trackCtaClick(event: MouseEvent): void {
 const link = event.target instanceof Element ? event.target.closest("a") : null;
 if (!link || !canTrack()) return;
 const href = link.getAttribute("href") ?? "";
 let cta: Properties["cta"];
 if (href.startsWith("https://apps.apple.com/")) cta = "app_store";
 else if (href.startsWith("https://play.google.com/")) cta = "google_play";
 else if (/^https:\/\/(wa.me|api.whatsapp.com)\//.test(href)) cta = "whatsapp";
 else if (href.startsWith("mailto:")) cta = "email";
 else if (href === "/partners" || href === "#apply") cta = "become_partner";
 else if (["/#waitlist", "#waitlist", "/subscribe", "/signup", "/sign-up"].includes(href)) cta = "sign_up";
 if (!cta) return;
 let location: Location = window.location.pathname === "/partners" ? "partners_page" : window.location.pathname === "/contact" ? "contact_page" : window.location.pathname === "/" ? "homepage" : "other_page";
 if (link.closest("footer")) location = "footer";
 else if (link.closest("nav")) location = "navigation";
 else if (link.closest('[data-analytics-location="hero"]')) location = "hero";
 else if (link.closest("#download")) location = "download";
 track(events.ctaClicked, { location, cta });
}
