# S09 - Professional highlight cards for Sysphera and Audaces

- **Plan:** [implementation-steps.md](implementation-steps.md)
- **Type:** Slice
- **Requirements covered:** FR-08 (professional highlights part); RFF §5 edge case "Professional project cards have no links ... no hover overlay and no pointer cursor"; RFF §6 "Professional highlight cards"; RFF §10 acceptance criterion "Sysphera and Audaces appear as non-clickable highlight cards" (professional part); R-A11Y (heading hierarchy, chip contrast) for this content
- **Prerequisites:** `#projects` (section shell with `<h2 id="projects-heading">` "Featured Work"), `#projects-professional` (empty `<div>` inside `#projects`), `.skill-chip` (CSS class), `--my-primary` (CSS variable), `/* Bootstrap overrides */` comment in `index.css`, Bootstrap 5.3 CSS and Bootstrap Icons from the CDN
- **Creates:** `.highlight-card` (CSS class)

## 1. Goal

When this step is done, the Featured Work section starts with:

- An `h3` subheading "Professional highlights".
- Two cards, side by side from 992px (`lg`) up and stacked below that:
  - **Sysphera**, company **Tech6**, a large `bi-bar-chart-line` icon, the description from RFF §7.5 and the chips C#, ASP.NET, TypeScript, SQL Server.
  - **Audaces 4D & VR Try-on Mirror**, company **Audaces**, a large `bi-badge-vr` icon, the description from RFF §7.5 and the chips C++, OpenGL, Qt, Unity.
- The cards are plain content: no link, no `onclick`, no `tabindex`, no hover overlay or hover effect, and the mouse cursor stays the default one. Tab skips them entirely.
- Each card has a thin brand-green accent on its top edge, so it reads as a highlight without looking like a button.

## 2. Context

- `#projects` is a white section (no `.section-alt`) holding `<h2 id="projects-heading">` "Featured Work", then `<div id="projects-professional"></div>` and `<div id="projects-personal"></div>`. This step writes only inside `#projects-professional`. The `<div>` itself (its id and attributes), the `<h2>` and `#projects-personal` are not touched.
- The legacy "Showcase" section with `.project-card-img` / `.project-img-overlay` stays as it is. Those classes give clickable image cards (pointer cursor, hover overlay) and must not be reused here.
- `.skill-chip` is used as `<span class="badge skill-chip">…</span>`: light-green tint `#edf3e4`, text `--my-primary-text`, 5.17:1 contrast.
- Conventions (CLAUDE.md, plan §2): Bootstrap utilities first, small variable-driven custom CSS, no Bootstrap blue for accents, one comment-headed CSS block per step inserted before `/* Bootstrap overrides */`.
- Heading levels on the page: one `h1` (hero), `h2` per section. Inside `#projects` the subheadings are `h3`, so the card titles here are `h4`.
- No test suite exists. Verification is manual in a browser plus `git grep` and console checks.

## 3. Structure

### 3.1 Files

| File | Change | Responsibility |
|------|--------|----------------|
| `index.html` | modify | Content inside `#projects-professional` only: subheading and two highlight cards |
| `index.css` | modify | New `/* Professional highlights */` block with `.highlight-card` and the private `.highlight-card-icon` |

### 3.2 Markup (`index.html`)

Insert this between `<div id="projects-professional">` and its closing `</div>`. Nothing else in the file changes.

```html
<div id="projects-professional">
  <h3 id="projects-professional-heading" class="h4 fw-bold mb-4">Professional highlights</h3>

  <div class="row row-cols-1 row-cols-lg-2 g-4 mb-5">

    <div class="col">
      <article class="card h-100 highlight-card" aria-labelledby="highlight-sysphera-title">
        <div class="card-body p-4">
          <i class="bi bi-bar-chart-line highlight-card-icon d-block mb-3" aria-hidden="true"></i>
          <h4 id="highlight-sysphera-title" class="h5 card-title fw-bold mb-1">Sysphera</h4>
          <p class="text-body-secondary mb-3">Tech6</p>
          <p class="card-text">An enterprise SPA for data storage and analysis with OLAP cubes.</p>
          <ul class="list-unstyled d-flex flex-wrap gap-2 mb-0" role="list" aria-label="Technologies used in Sysphera">
            <li><span class="badge skill-chip">C#</span></li>
            <li><span class="badge skill-chip">ASP.NET</span></li>
            <li><span class="badge skill-chip">TypeScript</span></li>
            <li><span class="badge skill-chip">SQL Server</span></li>
          </ul>
        </div>
      </article>
    </div>

    <div class="col">
      <article class="card h-100 highlight-card" aria-labelledby="highlight-audaces-title">
        <div class="card-body p-4">
          <i class="bi bi-badge-vr highlight-card-icon d-block mb-3" aria-hidden="true"></i>
          <h4 id="highlight-audaces-title" class="h5 card-title fw-bold mb-1">Audaces 4D &amp; VR Try-on Mirror</h4>
          <p class="text-body-secondary mb-3">Audaces</p>
          <p class="card-text">A 3D fashion design platform with real-time cloth simulation, plus a VR mirror prototype built with Unity and body-tracking sensors.</p>
          <ul class="list-unstyled d-flex flex-wrap gap-2 mb-0" role="list" aria-label="Technologies used in Audaces 4D &amp; VR Try-on Mirror">
            <li><span class="badge skill-chip">C++</span></li>
            <li><span class="badge skill-chip">OpenGL</span></li>
            <li><span class="badge skill-chip">Qt</span></li>
            <li><span class="badge skill-chip">Unity</span></li>
          </ul>
        </div>
      </article>
    </div>

  </div>
</div>
```

Details:

- **Subheading:** `h3` styled as `h4` so it sits visually below the section `h2`. `#projects-professional-heading` is private to this step (it gives the heading a stable anchor for tests and future `aria-labelledby` use; nothing else references it).
- **Grid:** `row-cols-1 row-cols-lg-2 g-4` gives one column below 992px and two equal columns from 992px up. `h-100` on the cards makes both cards the same height on lg. `mb-5` on the row separates this block from the content that follows in `#projects` (the container `<div>` itself is not given classes).
- **Card element:** `<article>` named by its title (`aria-labelledby`), because each card is a self-contained item. The title ids `highlight-sysphera-title` and `highlight-audaces-title` are private to this step.
- **Icon:** decorative (`aria-hidden="true"`); the title already says what the card is. `bi-bar-chart-line` and `bi-badge-vr` exist in Bootstrap Icons 1.10.5 and 1.11.3, so the icons render with either CDN version.
- **Company line:** a plain paragraph in `text-body-secondary` (about 6.9:1 on white). It is not a heading.
- **Description:** RFF §7.5 text used as written (RFF open question "Copy approval", default: use as written). The Audaces text runs to 2–3 lines at lg card width. The Sysphera text is shorter (about 1 line on lg, 2 on mobile) and is kept as written.
- **Chips:** RFF §7.5 tech lists, in that order, in a `<ul role="list">` with an `aria-label`, so screen readers announce "list, 4 items" with a name. `role="list"` is kept because Safari/VoiceOver drops list semantics from `list-style: none` lists.
- **No interactivity:** the cards contain no `<a>`, `<button>`, `onclick`, `tabindex` or `data-bs-*` attribute, and they do not use `.project-card-img` or `.project-img-overlay`.

### 3.3 Styles (`index.css`)

Insert this block immediately before the `/* Bootstrap overrides */` comment (after any other section blocks already there). No other rule changes.

```css
/* Professional highlights */
.highlight-card {
  border-top: 4px solid var(--my-primary);   /* brand accent; static, no hover state */
}

.highlight-card-icon {
  font-size: 2.5rem;
  line-height: 1;
  color: var(--my-primary);
}
```

- `.highlight-card` (shared, created here): the non-clickable highlight card used only inside `#projects-professional`. It overrides `.card`'s top border (same specificity; `index.css` loads after Bootstrap, so it wins). It deliberately has no `:hover`, `cursor`, `transition` or `transform` rule: the browser's default cursor (arrow, or I-beam over text) is what "not clickable" means.
- `.highlight-card-icon` (private to this step): sizes and colors the large icon. `line-height: 1` removes the extra space Bootstrap Icons' `::before` gets from the body line height. The icon is decorative, so the 3:1 non-text contrast rule does not apply to it; the brand fill green `--my-primary` is used, as for other accents.

## 4. Edge cases and errors

| Case | Expected behavior |
|------|-------------------|
| Mouse hovers a card | Nothing changes: no overlay, no shadow, no color change. The cursor is the default arrow (I-beam over text). |
| Keyboard user presses Tab through Featured Work | Focus skips both cards and everything in them, going from the previous focusable element straight to the next one after `#projects-professional`. |
| Click or tap on a card | Nothing happens (no navigation, no new tab). |
| Viewport below 992px (tablet, 375px phone) | Cards stack full width, one per row, with 1.5rem gaps. No horizontal scroll at 375px; chips wrap to new lines. |
| Long title "Audaces 4D & VR Try-on Mirror" at 375px | Wraps onto two lines inside the card; no overflow. |
| Unequal description lengths on lg | Both cards have the same height (`h-100`); the Sysphera card, with the shorter description, has empty space at the bottom. |
| Bootstrap Icons CSS fails to load | The icon area is empty; title, company, description and chips still render. No error. |
| JavaScript disabled or Bootstrap bundle blocked | No effect: the block uses no JavaScript. |
| Screen reader | Announces heading level 3 "Professional highlights", then each card as an article named by its `h4` title, the company, the description, and "Technologies used in …, list, 4 items". The icons are not announced. |

## 5. Tests

No automated suite exists, and this step does not add one.

### 5.1 Manual

Serve the folder (`npx serve .` or `python -m http.server`) and open it in Chrome or Edge.

1. Given a 1366×768 viewport, when you scroll to Featured Work, then "Professional highlights" appears right below the "Featured Work" heading and before any personal project, followed by two equal-height cards side by side: Sysphera (bar-chart icon, "Tech6") on the left and Audaces 4D & VR Try-on Mirror (VR icon, "Audaces") on the right. (FR-08 professional highlights; RFF §6)
2. Given the two cards, then their descriptions match RFF §7.5 word for word, and the chips read C#, ASP.NET, TypeScript, SQL Server (Sysphera) and C++, OpenGL, Qt, Unity (Audaces), in that order, with green text on a light green tint. (FR-08; RFF §7.5)
3. Given either card, when you hover over the icon, title, description, chips and empty card area, then the cursor is never a pointer (hand), no overlay appears and the card does not change. When you click anywhere on it, nothing happens. (RFF §5 edge case; §10 "non-clickable highlight cards")
4. Given the keyboard only, when you Tab from the last element before Featured Work, then focus never lands on either card or anything inside it. (Plan: "not focusable")
5. Given a 768px viewport and a 375px viewport, then the cards stack one per row at full width, the chips wrap, and `document.documentElement.scrollWidth === document.documentElement.clientWidth` returns `true` in the console. (Plan: "stacked on mobile"; RFF 375px criterion)
6. Given the DevTools contrast picker, when you inspect a chip, the company line and the description, then each reports 4.5:1 or higher. (R-A11Y contrast)
7. Given the DevTools Accessibility tree, then "Professional highlights" is a heading level 3 inside the "Featured Work" region, each card is an article named "Sysphera" / "Audaces 4D & VR Try-on Mirror" with a level-4 heading, each chip list is named "Technologies used in …", and the icons are not in the tree. (R-A11Y heading hierarchy)
8. Given the top edge of each card, then a 4px brand-green (`rgb(134, 175, 73)`) border is visible and the icon is the same green. (RFF §6 visual direction; `.highlight-card`)

### 5.2 Static checks

Run from the repo root:

- `git grep -n "highlight-card" index.html` → 4 lines: two `class="card h-100 highlight-card"` and two `highlight-card-icon`.
- `git grep -n "Professional highlights" index.html` → one line, the `h3` with `id="projects-professional-heading"`.
- `git grep -n "/\* Professional highlights \*/\|/\* Bootstrap overrides \*/" index.css` → the "Professional highlights" line comes before the "Bootstrap overrides" line.
- `awk '/\/\* Professional highlights \*\//{f=1;next} f&&/^\/\* /{f=0} f' index.css | grep -iE "cursor|hover|transition|transform"` → no output (no clickable styling; reads only this step's block, from its comment up to the next top-level `/* … */` comment).
- In the browser console: `document.querySelectorAll('#projects-professional :is(a, button, [tabindex], [onclick], [data-bs-toggle], .project-card-img, .project-img-overlay)').length` → `0`.
- In the browser console: `[...document.querySelectorAll('#projects-professional .skill-chip')].map(c => c.textContent).join(', ')` → `C#, ASP.NET, TypeScript, SQL Server, C++, OpenGL, Qt, Unity`.

## 6. Implementation order

1. `index.css`: add the `/* Professional highlights */` block before `/* Bootstrap overrides */`. Nothing visible changes yet.
2. `index.html`: add the subheading and the row with the Sysphera card inside `#projects-professional`. Reload and check it renders.
3. `index.html`: add the Audaces card in the same row.
4. Run the manual checks (5.1) and static checks (5.2).

## 7. Out of scope

- Does not change the `#projects` `<section>`, its `<h2>`, the `#projects-professional` `<div>` element itself, or `#projects-personal`.
- Does not touch the legacy "Showcase" section, `.project-card-img`, `.project-img-overlay` or the existing 768px media query.
- Does not change `.skill-chip`, `--my-primary` or any other shared rule or variable.
- Adds no links, demos, screenshots or images for the professional projects (proprietary work), and no JavaScript.
- Does not touch `<head>`, the navbar, other sections, `images/` or `CLAUDE.md`.

## 8. Design notes

- **Plain Bootstrap card plus one modifier class (Open/Closed, keep it simple).** `.highlight-card` only adds the accent border to `.card`; layout and spacing come from Bootstrap utilities. Reusing the clickable `.project-card-img` pattern was rejected because it brings a pointer cursor and a hover overlay, which the RFF forbids for these cards.
- **"Not clickable" by absence, not by override.** No `cursor: default` rule is added: the cards contain nothing interactive, so the browser already shows the default cursor (and the I-beam over text, which is normal for content). Forcing `cursor: default` would hide the text-selection cue for no gain.
- **Icon above the title, not beside it.** It keeps the card one column wide at every breakpoint, so no extra mobile rule is needed. The 2.5rem size makes it the "large icon" the RFF asks for without competing with the title.
- **Decorative icon in `--my-primary`.** The icon is `aria-hidden` and the title carries the meaning, so the fill green is used, as for other brand accents. All text in the card (title, company, description, chips) meets 4.5:1.
- **Heading levels:** `h3` subheading styled as `h4`, card titles `h4` styled as `h5`, so the outline stays h2 → h3 → h4 without skipping levels and the visual sizes stay modest.
- **Chip list as `<ul role="list">` with an `aria-label`.** A screen-reader user hears how many technologies there are and what they belong to. The label names the project, since both cards sit in the same region.
- **Copy:** descriptions and the Audaces title are taken from RFF §7.5 as written ("Copy approval" default). "SPA" is kept as written; if the user prefers "single-page application", only that text changes.
- **Audaces icon:** `bi-badge-vr` was picked over the alternative `bi-box` named in RFF §6, because the VR mirror is the distinctive part of the card and the plan names it.
