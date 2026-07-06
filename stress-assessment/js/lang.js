/* =========================================================================
   LANGUAGE / i18n HELPER
   Simple bilingual (EN/VI) support. Translatable content in the data and
   feedback files is stored as { en: "...", vi: "..." } objects (or plain
   strings for values that don't need translation, e.g. ids). L() resolves
   the current-language string from either shape, so old plain-string
   fields keep working if ever left untranslated.
   Language choice persists in localStorage and is shared with the hub
   page via the same key, so a user's choice carries across assessments.
========================================================================= */

const LANG_KEY = "psychAssessments.lang";

function getLang() {
  return localStorage.getItem(LANG_KEY) === "vi" ? "vi" : "en";
}

function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang === "vi" ? "vi" : "en");
}

/** Resolve a translatable value in the current language.
 *  Accepts { en, vi } objects, plain strings, or null/undefined. */
function L(value) {
  if (value == null) return value;
  if (typeof value === "object" && ("en" in value || "vi" in value)) {
    return value[getLang()] || value.en || value.vi || "";
  }
  return value;
}

/** Map an array of items whose translatable fields need resolving.
 *  fields: list of top-level keys on each item to resolve with L(). */
function localizeList(items, fields) {
  return items.map((item) => {
    const copy = { ...item };
    fields.forEach((f) => {
      if (f in copy) copy[f] = L(copy[f]);
    });
    return copy;
  });
}

function renderLangToggle() {
  const el = document.getElementById("langToggle");
  if (!el) return;
  const lang = getLang();
  el.innerHTML = `
    <button class="lang-btn ${lang === "en" ? "active" : ""}" data-lang="en">EN</button>
    <button class="lang-btn ${lang === "vi" ? "active" : ""}" data-lang="vi">VI</button>`;
  el.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.onclick = () => {
      if (btn.dataset.lang === lang) return;
      setLang(btn.dataset.lang);
      window.location.reload();
    };
  });
}

/** Apply translations to any static HTML element carrying data-en/data-vi
 *  (and data-en-html/data-vi-html for markup content). Lets index pages
 *  keep their bilingual copy declaratively without JS rendering it. */
function applyStaticTranslations() {
  const lang = getLang();
  document.querySelectorAll("[data-en]").forEach((el) => {
    const val = el.getAttribute(`data-${lang}`) || el.getAttribute("data-en");
    el.textContent = val;
  });
  document.querySelectorAll("[data-en-html]").forEach((el) => {
    const val = el.getAttribute(`data-${lang}-html`) || el.getAttribute("data-en-html");
    el.innerHTML = val;
  });
  document.documentElement.lang = lang;
}

document.addEventListener("DOMContentLoaded", () => {
  renderLangToggle();
  applyStaticTranslations();
});
