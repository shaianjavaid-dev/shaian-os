import posthog from "posthog-js";

// Session recording is ON. Policy matches the BananaTab pages (same PostHog project):
// record what's on screen, but never the contents of sensitive fields, and never the
// login page — server.mjs renders that itself and does not load PostHog at all, so the
// password is never in a recording.
const SENSITIVE = /phone|tel|email|password|card|cvc|ssn|routing|account/i;

export function initPostHog() {
  if (typeof window === "undefined") return;

  posthog.init("phc_8ma4jqSXQrazu2Xu1sInpU4YxSNNJWDsjNnXAVBbfEV", {
    api_host: "https://us.i.posthog.com",
    person_profiles: "always",
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
    disable_session_recording: false,
    session_recording: {
      maskAllInputs: false,
      maskInputOptions: { password: true },
      maskInputFn: (text: string, element?: HTMLElement) => {
        const el = (element ?? {}) as HTMLInputElement;
        const type = (el.type || "").toLowerCase();
        const hint = `${el.name || ""} ${el.id || ""} ${el.autocomplete || ""} ${el.placeholder || ""}`.toLowerCase();
        if (type === "password" || type === "tel" || type === "email" || SENSITIVE.test(hint)) {
          return "*".repeat(text.length);
        }
        return text;
      },
      maskTextSelector: "[data-ph-mask]",
      blockSelector: "[data-ph-block]",
      recordCrossOriginIframes: false,
    },
  });
}

export { posthog };
