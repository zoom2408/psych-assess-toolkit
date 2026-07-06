// Analytics configuration — fill in your own IDs once you've created accounts.
// Leave a field blank/empty to skip loading that provider entirely (nothing
// is loaded and nothing is sent until you add a value here).
window.ANALYTICS_CONFIG = {
  // --- Privacy-friendly, cookieless analytics (recommended) ---
  // No cookies, no personal data, no EU cookie-consent banner required.
  // Sign up free at https://plausible.io (paid, hosted) or self-host an
  // open-source alternative with a compatible script (Umami, GoatCounter).
  // Set this to the domain you register with your analytics provider.
  plausibleDomain: "", // e.g. "zoom2408.github.io"
  plausibleScriptUrl: "https://plausible.io/js/script.js",

  // --- Optional: Google Analytics 4 ---
  // More detailed reporting, but sets identifier cookies. Given the
  // sensitive topics on this site (mental health, ADHD, attachment style),
  // if you enable this you should add a cookie-consent notice for EU/UK
  // visitors. This config applies privacy-reducing defaults (no ad
  // signals, no Google Signals, IP anonymization) but does not remove
  // the need for consent.
  ga4MeasurementId: "G-2LF8QNDGN9",
};
