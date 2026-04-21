import posthog from "posthog-js";

export function initPostHog() {
  if (typeof window === "undefined") return;

  posthog.init("phc_8ma4jqSXQrazu2Xu1sInpU4YxSNNJWDsjNnXAVBbfEV", {
    api_host: "https://us.i.posthog.com",
    person_profiles: "always",
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
  });
}

export { posthog };
