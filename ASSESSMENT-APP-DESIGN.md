# Psychology Assessment App — Design Reference

Internal reference doc for this Claude Project. Paste this whole file into a new chat to resume work on `career-personality-assessment`, or use it as a starting template for building another assessment tool in this project. It captures architecture decisions, data conventions, and — importantly — a few non-obvious bugs already hit and fixed, so they don't get reintroduced.

## 1. What this is

A static, client-side career/personality assessment web app (no backend, no build step, no database) combining three frameworks in one flow:

- **MBTI-style** (4 dichotomies: EI / SN / TF / JP) — originally-written items inspired by Jungian typology, not reproductions of the proprietary MBTI instrument.
- **DISC** (4 independent scales: D / I / S / C — Marston's model, public domain).
- **RIASEC / Holland Code** (6 independent scales: R / I / A / S / E / C).

Output: a single combined report per user — detailed MBTI breakdown (dichotomy %, cognitive function stack, day-to-day description), DISC style, Holland code, merged strengths/growth areas, career/major matches by age group, and an action plan.

Built for: Teens (13–17), Young Adults (18–25), Adults (26+). Two length tiers: **Quick** (50 items, ~10 min) and **Full** (160 items, ~25–30 min).

Deployment target: GitHub Pages (pure static files). Live location for this specific build: `career-personality-assessment/` folder in this project, with its own `README.md` covering GitHub Pages deployment steps.

## 2. File structure

```
career-personality-assessment/
├── index.html          # page shell; loads scripts in dependency order
├── css/style.css        # all styling — "modern & energetic" gradient theme
├── js/
│   ├── data-mbti.js      # MBTI_QUESTIONS, MBTI_QUESTIONS_CORE, MBTI_TYPES (16 profiles)
│   ├── data-disc.js      # DISC_QUESTIONS, DISC_QUESTIONS_CORE, DISC_STYLES (4 profiles)
│   ├── data-riasec.js    # RIASEC_QUESTIONS, RIASEC_QUESTIONS_CORE, RIASEC_THEMES (6 profiles)
│   ├── scoring.js         # pure scoring functions, no DOM/state dependencies
│   └── app.js             # state machine, rendering, localStorage, PDF/PNG export
└── README.md             # end-user-facing deployment guide (GitHub Pages steps)
```

Script load order in `index.html` matters: CDN libs (html2canvas, jsPDF) → data files → `scoring.js` → `app.js` (each later file assumes globals from earlier ones — no bundler, no modules, everything is plain `<script>` tags sharing `window` scope).

## 3. Data model conventions

Every question object looks like:

```js
// MBTI: { id, dichotomy: "EI"|"SN"|"TF"|"JP", pole: "E"|"I"|"S"|"N"|"T"|"F"|"J"|"P", text }
// DISC:  { id, scale: "D"|"I"|"S"|"C", text }
// RIASEC:{ id, scale: "R"|"I"|"A"|"S"|"E"|"C", text }
```

**ID prefixes**: `ei##`/`sn##`/`tf##`/`jp##` (MBTI), `d##`/`i##`/`s##`/`c##` (DISC), `r##`/`iv##`/`a##`/`so##`/`e##`/`co##` (RIASEC — note `iv` for Investigative and `so` for Social to avoid colliding with DISC's `i`/`s` prefixes when read by a human, though the actual namespaces never mix in code).

**Quick-version subset mechanism**: rather than maintaining a second parallel item bank, a `core: true` flag is set on a curated subset of the full array (via an `..._CORE_IDS` list + `.forEach` marking pass at the bottom of each data file), and a derived `..._QUESTIONS_CORE` filtered array is exported alongside the full one. Current split:

| Framework | Full | Quick | Quick ratio |
|---|---|---|---|
| MBTI | 72 (9/pole × 8 poles) | 24 (3/pole × 8 poles) | even across all 4 dichotomies |
| DISC | 28 (7/scale × 4) | 8 (2/scale × 4) | even across all 4 scales |
| RIASEC | 60 (10/scale × 6) | 18 (3/scale × 6) | even across all 6 scales |
| **Total** | **160 (~25-30 min)** | **50 (~10 min)** | |

**Always keep pole/scale balance even** when changing item counts — uneven splits bias the scoring toward whichever pole has more items. Verify with a node script that counts items per pole/scale after any edit (see §8).

**Profile objects** (`MBTI_TYPES`, `DISC_STYLES`, `RIASEC_THEMES`) are hand-written content, not derived from scores. `RIASEC_THEMES[x]` additionally carries `teens` / `youngAdults` / `adults` career-list arrays used directly by the report (age-tiering logic: teens = school electives/clubs, youngAdults = majors/entry roles, adults = established careers/pivots).

## 4. Scoring engine (`scoring.js`)

Pure functions, no side effects, all accept an explicit question list so Quick/Full can share one engine:

```js
scoreMBTI(answers, questions = MBTI_QUESTIONS)     // -> { type, dichotomies, profile }
scoreDISC(answers, questions = DISC_QUESTIONS)     // -> { scores, primary, secondary, primaryProfile, secondaryProfile }
scoreRIASEC(answers, questions = RIASEC_QUESTIONS) // -> { scores, ranked, hollandCode, topThemes }
buildCombinedReport(ageGroup, mbti, disc, riasec)  // -> { strengths, growthAreas, careers, actionPlan, topField }
```

Math: MBTI sums per-pole Likert totals then converts to a percentage split (`pctA + pctB === 100` always); DISC/RIASEC min-max normalize each scale independently to 0–100 based on item count (`(sum - min) / (max - min) * 100`). Unanswered items default to neutral (3). Ties default to the first-listed pole (e.g., E over I) — deterministic, not a bug.

**Always pass the actual question array used** (`sections.find(s => s.key === "mbti").questions`, etc.) when scoring — passing the full array while only Quick-mode items were answered will silently dilute results toward neutral for all the unanswered full-set items.

## 5. App state machine (`app.js`)

Screens, in order: `welcome` → `age` → `version` → `section-intro` → `question` (loops per section) → `results`.

`state` shape:
```js
{ ageGroup: "teen"|"youngAdult"|"adult", version: "concise"|"full",
  screen, sectionIndex, questionIndex,
  answers: { mbti: {}, disc: {}, riasec: {} }, completedAt }
```

Persistence: entire `state` object JSON-serialized to `localStorage` under key `psychAssessment.v1` after every single answer. On load, `hasInProgressSession()` checks for a non-trivial saved session and offers a Resume/Start Over prompt. Retake clears the key and resets to a fresh default state object (there are 3 places in the code that reset to this default shape — keep them in sync if the shape changes).

`currentSections()` returns `VERSIONS[state.version].sections` — this is the single source of truth for "which item set is active"; question rendering, progress %, and final scoring all read through it rather than hardcoding `SECTIONS_FULL`/`SECTIONS_CORE` directly.

## 6. Styling

"Modern & energetic" theme: purple→pink→orange gradient identity (`#7c3aed` / `#ec4899` / `#f97316`), rounded cards, CSS Grid/Flexbox with `gap`, mobile-responsive via `@media (max-width: 640px)`, print stylesheet (`@media print`) hides nav/buttons for browser-native printing as a PDF fallback.

**Important constraint**: any gradient/color that needs to render inside the PDF/PNG-exported region (`#results-report`) must use **literal hex values, not `var(--custom-property)`**, in its `background`/`background-image` declaration. See §7 for why.

## 7. PDF/PNG export — bugs already hit (don't reintroduce these)

Export uses `html2canvas` → canvas → `jsPDF` (multi-page slice) or direct PNG download. Three real bugs were found and fixed here, in order:

1. **Gradients rendering as flat white in the export.** Root cause: CSS gradients defined via `var(--gradient-1)` etc. are a documented html2canvas failure mode — it doesn't always resolve custom properties inside `linear-gradient()`. **Fix**: hardcode literal hex colors for every gradient inside `#results-report` (`.badge`, `.bar-fill`, `.bar-fill.riasec`). Solid-color properties (`border-color`, `color`) using `var()` were left alone — those resolve fine.
2. **Exported PDF came back completely blank.** Cause: adding `foreignObjectRendering: true` to the `html2canvas()` call (attempted as a fix for #1) silently produces an empty canvas in some browsers — no thrown error, so a try/catch fallback never triggers. **Fix**: removed `foreignObjectRendering` entirely; rely only on the literal-hex fix from #1 with html2canvas's default renderer.
3. **Exported image looked correctly colored but uniformly washed out/faded** (headings, paragraphs, bars all low-opacity). Cause: every `.card` has a `fadeIn` CSS keyframe animation; html2canvas clones the DOM into an offscreen iframe to render it, which **restarts the animation from its 0% keyframe**, and the snapshot is taken before the 0.35s fade completes. **Fix**: use html2canvas's `onclone(clonedDoc)` callback to force `animation: none; opacity: 1; transform: none` on every `.card` in the clone right before capture — this only affects the export path, the live page keeps its fade-in.

There's also a plain **Download PNG** button (`exportPNG()` / `downloadCanvas()`) added as a simpler, more reliable fallback alongside PDF — it skips jsPDF's page-slicing math entirely, so it's a good first thing to suggest if a user reports the PDF looking wrong again.

If more export bugs surface: the fix pattern is almost always either (a) something in the captured CSS depends on a `var()` inside a shorthand property html2canvas mis-parses, or (b) something relies on animation/transition timing that the clone doesn't preserve. Check those two first before assuming it's a data/logic bug.

## 8. How this was verified

Two-layer QA pattern worth reusing for any future assessment built in this project:

1. **Automated math/data audit** (Node, run directly against the data/scoring files via `require()` + a `global.X = X` shim since they're plain browser scripts, not modules): duplicate-ID checks, per-pole/scale distribution counts, 200+ randomized-answer trials asserting percentages sum to 100 and stay in [0, 100], deterministic edge cases (all-min/all-max/all-neutral/tie-break), and completeness checks on every profile object (16 MBTI types, 4 DISC styles, 6 RIASEC themes all have every required field).
2. **Independent content-accuracy review**: a fresh subagent with zero prior context sampled items against their claimed pole/scale for face validity, checked MBTI type write-ups against canonical cognitive-function stacks, and sanity-checked career/age-tier mappings. This caught two real (minor) issues automated checks couldn't: a near-duplicate item pair, and a cross-framework letter collision (DISC "C" vs RIASEC "C") worth a UI label clarification.

## 9. Reusable pattern for a new assessment in this project

To build another assessment (different frameworks, e.g. Big Five / Enneagram) reusing this architecture:

1. Keep `app.js`'s state machine and localStorage/resume/retake logic as-is — it's framework-agnostic (just reads whatever `SECTIONS`/`VERSIONS` you define).
2. Write new `data-*.js` files following the same shape: flat question array with a scale/pole tag + `text`, a profile lookup object, and a `core: true` marking pass for a balanced Quick subset.
3. Write a new `scoring.js` (or extend this one) following the same contract: pure functions, explicit `questions` parameter, percentage math that always sums correctly, deterministic tie-breaks.
4. Reuse `style.css` wholesale (just retheme the 3 gradient hex vars in `:root` if you want a different palette) — remember the literal-hex-in-gradient rule for anything that'll be captured by html2canvas.
5. Re-run the two-layer QA pattern from §8 before calling it done.

## 10. Status as of last session

Both PDF export bugs (#2 blank canvas, #3 washed-out fade) and the misleading single-fill MBTI bar chart are fixed and synced to `career-personality-assessment/`. Two known minor polish items were flagged but are cosmetic, not correctness bugs: a couple of MBTI items are "noisier" than ideal (e.g. `jp07`, `tf08` — still correctly tagged, just slightly confounded with adjacent traits), and DISC/RIASEC sharing the letter "C" for different constructs is mitigated by spelling out full names in the UI but could get a more explicit visual distinction if it ever causes user confusion.

## Feedback Collection (standard for all assessments)

Every assessment includes `js/feedback.js` (identical shared module) plus a small config block in `index.html`:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script>
  window.FEEDBACK_CONFIG = { appId: "unique-app-id", appName: "Display Name" };
</script>
<script src="js/feedback.js"></script>
```

Behavior:
- A "💬 Feedback" FAB appears at the bottom-right **only on the results screen** (watches `state.screen === "results"`).
- Form fields: satisfaction 1–5 stars (required), what they liked, what they expect more, optional email.
- Every submission is stored persistently in `localStorage` (`feedback_entries_<appId>`).
- **Live CSV**: "Connect live CSV" (Chrome/Edge, File System Access API) lets you pick a `.csv` file once; it is rewritten with all responses on every new submission. The file handle persists across sessions via IndexedDB.
- **Export anytime**: Download CSV (UTF-8 BOM, Excel-compatible) or Download Excel (.xlsx via SheetJS).
- Columns: Timestamp, App, Test Version, Audience/Context, Satisfaction (1-5), What they liked, What they expect more, Email.
- Styles live in a `/* Feedback FAB & modal */` block appended to each app's `css/style.css` (uses the app's own CSS variables, so it inherits each theme). Hidden in print/PDF export.

When creating a NEW assessment: copy `js/feedback.js` from an existing app, add the config + script tags, and append the feedback CSS block.
