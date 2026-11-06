# S02 - Hero presents the senior full-stack profile above the fold

- **Plan:** [plan.md](plan.md)
- **Type:** Slice
- **Requirements covered:** FR-02; R-A11Y (photo `alt`, `aria-label` on icon-only social buttons, single `h1`, valid heading hierarchy); RFF §10 criterion 1 (hero visible without scrolling on desktop)
- **Prerequisites:** `#profile` (existing hero section), `#profile-img` (existing photo element and CSS rule), `.social-btn` (existing class and CSS rule), `.btn-primary` theme override, `images/photo2.png`
- **Creates:** none

## 1. Goal

When the page loads, a recruiter sees in the hero, without scrolling on a 1366×768 desktop:

- the name **"Sérgio C. Castelani Jr."** as the page's only `h1`;
- the title **"Senior Software Engineer"**, styled like a subtitle but not a heading;
- a one-line tagline about full-stack .NET/TypeScript work and 27 years of experience;
- the photo `images/photo2.png` with descriptive `alt` text;
- the LinkedIn, GitHub and email round buttons, each with an accessible name.

From md (768px) up, the text is on the left and the photo on the right, vertically centered against each other. Below md they stack: text first, then photo. Nothing overflows horizontally at 375px. The outdated "more than 20 years ... deepening my skills at Growdev" paragraph is gone.

## 2. Context

Current `#profile` (`index.html`, inside `<main>`, before the legacy skills section):

```html
<section id="profile" class="row p-3 g-3">
  <div class="col-12 col-md-8">
    <h1>Sérgio C Castelani Jr</h1>
    <h3 class="mb-3 fw-light">Senior Software Engineer</h3>
    <p> Software engineer with more than 20 years ... <br/> Currently, I'm deepening ... Growdev. </p>
    <a class="social-btn btn btn-primary p-3" href="https://www.linkedin.com/in/sergiocastelani/"> <svg …/> </a>
    <a class="social-btn btn btn-primary p-2" href="https://github.com/sergiocastelani"> <svg …/> </a>
    <a class="social-btn btn btn-primary p-2" href="mailto:sergio.castelani@gmail.com"> <svg …/> </a>
  </div>
  <div class="col-12 col-md-4 d-flex justify-content-center align-items-center">
    <img id="profile-img" src="./images/photo2.png">
  </div>
</section>
```

Issues to fix: the name lacks the periods used in the resume (`my-resume.txt` line 1: "Sérgio C. Castelani Jr."); the subtitle is an `h3` directly after the `h1` (skips `h2`); the copy is outdated; the `<img>` has no `alt`; the icon-only buttons have no accessible name (their SVGs are already `aria-hidden="true" focusable="false"`); the external links open in the same tab; the text column is top-aligned while the photo is centered.

Current CSS (`index.css`): `#profile { background-color: var(--bs-gray-100); }`, `#profile-img { width: 95%; max-width: 300px; }`, `.social-btn { width: 50px; height: 50px; border-radius: 50%; }`. The photo is a square PNG of 1069×1069 px.

Conventions: Bootstrap 5.3.1 utilities for layout and typography, small variable-driven custom CSS, no build and no automated tests (manual verification in a browser). This step edits only the `#profile` section markup and the existing `#profile-img` rule.

## 3. Structure

### 3.1 Files

| File | Change | Responsibility |
|------|--------|----------------|
| `index.html` | modify (inside `<section id="profile">` only) | Hero content, semantics and accessibility |
| `index.css` | modify (existing `#profile-img` rule only) | Keep the photo's aspect ratio once `width`/`height` attributes are added |

### 3.2 Markup (`index.html`, `#profile`)

Target structure (SVG paths unchanged and abbreviated as `…`):

```html
<section id="profile" class="row p-3 g-3 align-items-md-center">
  <div class="col-12 col-md-8">
    <h1>Sérgio C. Castelani Jr.</h1>
    <p class="h3 mb-3 fw-light">Senior Software Engineer</p>

    <p class="lead">
      Full-stack engineer (C#/.NET, TypeScript, React) with 27 years of experience, from C++ graphics engines to AI agents.
    </p>

    <a class="social-btn btn btn-primary p-3" href="https://www.linkedin.com/in/sergiocastelani/"
       target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
      <svg class="align-baseline" aria-hidden="true" focusable="false" …>…</svg>
    </a>

    <a class="social-btn btn btn-primary p-2" href="https://github.com/sergiocastelani"
       target="_blank" rel="noopener noreferrer" aria-label="GitHub">
      <svg class="align-baseline" aria-hidden="true" focusable="false" …>…</svg>
    </a>

    <a class="social-btn btn btn-primary p-2" href="mailto:sergio.castelani@gmail.com" aria-label="Email">
      <svg … aria-hidden="true" focusable="false">…</svg>
    </a>
  </div>
  <div class="col-12 col-md-4 d-flex justify-content-center align-items-center">
    <img id="profile-img" src="./images/photo2.png" width="1069" height="1069"
         alt="Portrait of Sérgio C. Castelani Jr.">
  </div>
</section>
```

Change by change:

| Element | Change | Why |
|---------|--------|-----|
| `<section id="profile">` | add class `align-items-md-center`; keep `id`, `row p-3 g-3` | Vertically centers the text column against the photo from md up; on mobile the columns stack, so no alignment is needed |
| `<h1>` | text becomes `Sérgio C. Castelani Jr.` | Matches the resume; stays the page's only `h1` |
| subtitle | replace `<h3 class="mb-3 fw-light">` with `<p class="h3 mb-3 fw-light">`, same text | Same look, no heading level skipped (R-A11Y heading hierarchy) |
| intro paragraph | replace the whole `<p>` (two sentences and `<br/>`) with `<p class="lead">` holding the tagline | FR-02 tagline; `lead` gives subtitle-sized light text from Bootstrap, no custom CSS |
| LinkedIn `<a>` | add `target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"` | Accessible name; external profile opens in a new tab safely |
| GitHub `<a>` | add `target="_blank" rel="noopener noreferrer" aria-label="GitHub"` | Same |
| Email `<a>` | add `aria-label="Email"`; no `target` | `mailto:` opens the mail client, a new tab would only leave an empty tab |
| `<img id="profile-img">` | add `alt="Portrait of Sérgio C. Castelani Jr."`, `width="1069" height="1069"` | Descriptive `alt` (R-A11Y); intrinsic size lets the browser reserve space and avoid layout shift |

Unchanged: the SVG icons and their inline styles, button classes (`social-btn btn btn-primary p-3` / `p-2`), the column classes, the `mailto` address, the photo file. The photo is above the fold, so it gets no `loading="lazy"`.

Tagline copy is the plan's suggested draft and is used as written (RFF open question "Copy approval", default).

### 3.3 Styles (`index.css`, existing `#profile-img` rule)

```css
#profile-img {
  width: 95%;
  max-width: 300px;
  height: auto; /* keep the square ratio when the width/height attributes are present */
}
```

Only `height: auto` is added. Without it, the `height="1069"` attribute would stretch the photo vertically, because CSS overrides only the width. `#profile` and `.social-btn` rules stay as they are. No new CSS block is needed.

## 4. Logic flows

No non-trivial logic: the step is static markup with Bootstrap grid behavior (two columns from md, stacked below). No script is added.

## 5. Edge cases and errors

| Case | Expected behavior |
|------|-------------------|
| Photo fails to load | The `alt` text "Portrait of Sérgio C. Castelani Jr." shows in a box no larger than 300px wide; the text column is unaffected |
| JavaScript disabled or Bootstrap bundle blocked | Hero is unchanged: it uses no JS, and Bootstrap CSS is a separate `<link>` |
| 375px viewport | Columns stack (text, then photo). Name, subtitle and tagline wrap; the 3 buttons (3 × 50px plus gaps) fit on one line; no horizontal scroll |
| 768px (md) exactly | Two columns (8/4). The photo takes 95% of the 4-column content width (about 190px), stays square and is never wider than 300px |
| Screen reader on a social button | Announced as "LinkedIn, link", "GitHub, link", "Email, link"; the SVGs stay hidden from the accessibility tree |
| Middle-click or Ctrl+click on LinkedIn / GitHub | Opens in a new tab as usual; `rel="noopener noreferrer"` keeps the opened page from controlling this one |
| Keyboard user | Tab reaches the 3 buttons in order (LinkedIn, GitHub, Email), and each shows a visible focus indicator (at minimum Bootstrap's `.btn:focus-visible` box-shadow) |
| Very large text zoom (200%) | Content wraps; the hero may grow below the fold, which is acceptable (the criterion targets the default zoom) |

## 6. Tests

No automated test suite exists; verification is manual plus static `grep` checks.

### 6.2 Manual

Serve the folder (`npx serve .` or `python -m http.server`) or open `index.html` directly.

1. Given a 1366×768 desktop window at 100% zoom, when the page loads, then the name "Sérgio C. Castelani Jr.", "Senior Software Engineer", the tagline, the photo and the 3 social buttons are all visible without scrolling, with spare height below the buttons and photo. (Proves FR-02, RFF §10 criterion 1.)
2. Given a viewport of 768px or wider, then the text sits on the left and the photo on the right, and the text block is vertically centered against the photo. (Proves FR-02 / RFF §6 Hero layout.)
3. Given a 375px DevTools viewport, then text and photo stack (text first), the photo stays square, the 3 buttons are on one line, and the page has no horizontal scrollbar (`document.documentElement.scrollWidth === 375` in the console). (Proves FR-02 mobile layout.)
4. Given DevTools > Accessibility tree (or a screen reader), when you inspect each social button, then its accessible name is "LinkedIn", "GitHub" and "Email" respectively; the photo's accessible name is "Portrait of Sérgio C. Castelani Jr.". (Proves R-A11Y `aria-label`, `alt`.)
5. Given the console, when you run `document.querySelectorAll('h1').length`, then it returns `1`; and `document.querySelector('#profile h2, #profile h3, #profile h4')` returns `null`. (Proves R-A11Y single `h1`, no skipped heading level in the hero.)
6. When you click LinkedIn and GitHub, then each opens the correct profile in a new tab; when you click Email, then the mail client opens with `sergio.castelani@gmail.com` and no empty tab appears. (Proves FR-02 social buttons.)
7. Given keyboard only, when you Tab through the hero, then focus moves LinkedIn → GitHub → Email and each focused button shows a visible focus indicator. (Proves R-A11Y focus states for the hero.)
8. Given DevTools Network throttling "Slow 3G" and a reload, then the photo area keeps its square space while loading (no jump of the content below). (Proves the `width`/`height` + `height: auto` change.)
9. Given the subtitle, then it looks the same as before (h3 size, light weight). (Regression check for the `h3` → `p.h3` swap.)

### 6.3 Static checks

Run from `C:\Devel\portfolio2` (Git Bash):

- `grep -c "<h1" index.html` → `1`
- `grep -c "<h1>Sérgio C. Castelani Jr.</h1>" index.html` → `1`
- `grep -c '<p class="h3 mb-3 fw-light">Senior Software Engineer</p>' index.html` → `1`
- `grep -c '<h3 class="mb-3 fw-light">' index.html` → `0`
- In the browser console: `[...document.querySelectorAll('#profile a[aria-label]')].map(a => a.getAttribute('aria-label'))` → `["LinkedIn", "GitHub", "Email"]` (scoped to the hero, so labels elsewhere on the page do not affect it)
- `grep -c 'alt="Portrait of Sérgio C. Castelani Jr."' index.html` → `1`
- `grep -c "deepening my skills\|more than 20 years" index.html` → `0`
- `grep -A3 "#profile-img {" index.css` → shows `height: auto;`

## 7. Implementation order

1. Change the `h1` text and replace the `h3` subtitle with `<p class="h3 mb-3 fw-light">`. Reload: the hero looks the same apart from the name.
2. Replace the intro paragraph with the `<p class="lead">` tagline.
3. Add `aria-label` to the 3 social buttons, and `target="_blank" rel="noopener noreferrer"` to LinkedIn and GitHub.
4. Add `height: auto` to `#profile-img` in `index.css`, then add `alt`, `width` and `height` to the `<img>` (CSS first, so the photo is never stretched).
5. Add `align-items-md-center` to the `#profile` section.
6. Run the manual checks (desktop, 768px, 375px, accessibility tree) and the static checks.

## 8. Out of scope

- Does not touch anything outside `<section id="profile">` in `index.html`: not `<head>`, not `<main>`'s attributes, not other sections, not the footer.
- Does not add a new CSS block and does not edit any CSS rule other than `#profile-img`; `#profile` and `.social-btn` rules stay as they are.
- Does not replace, resize or recompress `images/photo2.png`.
- Does not change the social SVG artwork or the button styling.
- Adds no "Open to work", CV download or contact call to action (RFF decision 8).
- Does not change page-wide link, text or focus colors.

## 9. Design notes

- **Bootstrap utilities over custom CSS (Keep it simple, CLAUDE.md):** `align-items-md-center`, `h3` and `lead` give the layout and typography with no new rules; the only CSS change is `height: auto`, which the new `width`/`height` attributes require.
- **`<p class="h3">` instead of `h2` for the title:** a job title is not a section heading; making it `h2` would add a fake entry to the document outline. The `h3` class keeps the current look.
- **Text-first order on mobile:** the name and title are what a recruiter must see first; putting the photo first on mobile (`order-first`) was rejected because it would push the name below a 300px image.
- **`aria-label` text is exactly "LinkedIn", "GitHub", "Email":** short, matches the plan's expected accessible names. Adding "(opens in a new tab)" was considered but rejected to keep the names as specified; the new-tab behavior is standard for external profile links.
- **No `target` on the email link:** a `mailto:` link in a new tab leaves a blank tab behind in some browsers.
- **`width`/`height` attributes:** reserve the photo's square space while the 1.5 MB PNG loads, avoiding a layout shift; the file itself is not optimized here, since assets are outside this step's scope.
- **Tagline copy is a draft** used as written (RFF open question "Copy approval"); the user can edit the sentence in place without any structural change.
