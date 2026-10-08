import posthog from "posthog-js";
import { canTrack, excludedPath, trackCtaClick } from "./lib/analytics";

const PUBLIC_PROJECT_KEY = "phc_ndYn4HndEs7NMvaYyTQP6nWuGS6o2RTyobU5mVfmMKMy";
const EU_API_HOST = "https://eu.i.posthog.com";

if (canTrack()) {
 try {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || PUBLIC_PROJECT_KEY, {
   api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || EU_API_HOST,
   ui_host: "https://eu.posthog.com",
   capture_pageview: "history_change",
   autocapture: true,
   mask_all_text: true,
   mask_all_element_attributes: true,
   capture_exceptions: false,
   enable_recording_console_log: false,
   person_profiles: "identified_only",
   respect_dnt: true,
   session_recording: {
    maskAllInputs: true,
    maskTextSelector: "*",
    blockSelector: '.ph-no-capture',
    recordHeaders: false,
    recordBody: false,
    maskCapturedNetworkRequestFn: (request) => {
     try {
      const url = new URL(request.name, window.location.origin);
      if (excludedPath(url.pathname)) return null;
      return { ...request, name: url.origin + url.pathname, requestHeaders: undefined, responseHeaders: undefined, requestBody: undefined, responseBody: undefined };
     } catch { return null; }
    },
   },
   // Prevent URL queries, fragments, DOM text, contact hrefs and referrers
   // from leaking through automatic events. No identify() calls are made.
   before_send: (event) => {
    if (!event || !canTrack()) return null;
    for (const key of ["$current_url", "$referrer", "$initial_current_url", "$initial_referrer"]) {
     const value = event.properties[key];
     if (typeof value === "string") {
      try {
       const url = new URL(value);
       if (excludedPath(url.pathname)) return null;
       event.properties[key] = url.origin + url.pathname;
      } catch { delete event.properties[key]; }
     }
    }
    delete event.properties.$elements;
    delete event.properties.$element_text;
    delete event.properties.$el_text;
    delete event.properties.$href;
    delete event.properties.$set;
    delete event.properties.$set_once;
    delete event.properties.$initial_person_info;
    for (const key of Object.keys(event.properties)) {
     if (key.startsWith("$utm_") || key.startsWith("$initial_utm_") || ["$gclid", "$fbclid", "$msclkid"].includes(key)) delete event.properties[key];
    }
    return event;
   },
  });
  document.addEventListener("click", trackCtaClick);
 } catch { /* Analytics is optional; keep the website usable. */ }
}

// Stop replay before a client-side transition to an excluded route.
export function onRouterTransitionStart(url: string): void {
 if (excludedPath(new URL(url, window.location.origin).pathname)) {
  posthog.stopSessionRecording();
 }
}
