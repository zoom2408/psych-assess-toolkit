// Lightweight analytics loader. Loads only the providers configured in
// shared/analytics-config.js. Page views are tracked automatically by
// whichever provider's script is loaded below — no extra code needed for
// that. window.trackAssessmentEvent() is the one custom hook used by each
// assessment's app.js, fired once when a user reaches their results screen.
// It never sends answers, scores, or any personally identifying data —
// only the assessment's name and the event name (e.g. "assessment_completed").
(function () {
  var cfg = window.ANALYTICS_CONFIG || {};

  // --- Plausible (privacy-friendly, cookieless) ---
  if (cfg.plausibleDomain) {
    var p = document.createElement("script");
    p.defer = true;
    p.setAttribute("data-domain", cfg.plausibleDomain);
    p.setAttribute("data-api", (cfg.plausibleApiHost || "") || undefined);
    p.src = cfg.plausibleScriptUrl || "https://plausible.io/js/script.js";
    // Enable custom events (Plausible's "script.js" + manual plausible() calls
    // is the standard combo; no extra "tagged-events" variant needed here).
    document.head.appendChild(p);
    window.plausible =
      window.plausible ||
      function () {
        (window.plausible.q = window.plausible.q || []).push(arguments);
      };
  }

  // --- Google Analytics 4 ---
  if (cfg.ga4MeasurementId) {
    var g = document.createElement("script");
    g.async = true;
    g.src = "https://www.googletagmanager.com/gtag/js?id=" + cfg.ga4MeasurementId;
    document.head.appendChild(g);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", cfg.ga4MeasurementId, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
  }

  // --- Unified custom-event helper used by each assessment's app.js ---
  window.trackAssessmentEvent = function (eventName, assessmentId) {
    try {
      if (window.plausible) {
        window.plausible(eventName, { props: { assessment: assessmentId } });
      }
      if (window.gtag) {
        window.gtag("event", eventName, { assessment_id: assessmentId });
      }
    } catch (e) {
      // Analytics must never break the assessment itself.
    }
  };
})();
