/* =========================================================================
   SHARED MULTILINGUAL (i18n) MODULE — Psychology Assessments project
   -------------------------------------------------------------------------
   Simple bilingual (EN/VI) support shared across every app in this project
   (stress-assessment, career-personality-assessment, and any future
   assessment). Translatable content in the data and feedback files is
   stored as { en: "...", vi: "..." } objects (or plain strings for values
   that don't need translation, e.g. ids). L() resolves the current-language
   string from either shape, so old plain-string fields keep working if
   ever left untranslated.

   Any app gets bilingual support just by including:
     <script src="../shared/i18n.js"></script>
   (loaded BEFORE the app's data/*.js and app.js/feedback.js files, since
   those reference the globals defined here: getLang, setLang, L,
   localizeList, renderLangToggle, applyStaticTranslations).

   Language choice persists in localStorage under the key
   "psychAssessments.lang" — this key is shared across ALL apps in the
   project, so a user's language choice carries across assessments (e.g.
   choosing Vietnamese on the stress check-in keeps it Vietnamese when they
   later open the career & personality assessment).

   Adding a new language later (e.g. French) just means:
     1. Adding a new key (e.g. "fr") to each { en, vi } content object.
     2. Adding a matching button for it in renderLangToggle() below.
   No other changes to L()/localizeList() are needed since they already
   resolve generically by the current language key.
========================================================================= */

const LANG_KEY = "psychAssessments.lang";

function getLang() {
  return localStorage.getItem(LANG_KEY) === "vi" ? "vi" : "en";
}

function setLang(lang) {
  localStorage.setItem(LANG_KEY, lang === "vi" ? "vi" : "en");
}

function L(value) {
  if (value == null) return value;
  if (typeof value === "object" && ("en" in value || "vi" in value)) {
    return value[getLang()] || value.en || value.vi || "";
  }
  return value;
}

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
