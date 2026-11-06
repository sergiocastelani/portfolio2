# S05 - About section with summary and key-numbers strip

- **Plan:** [plan.md](plan.md)
- **Type:** Slice
- **Requirements covered:** FR-03; acceptance criterion "Given the About section, then it shows the summary and 4 stats (27 years, 6 industries, 6 companies, 13+ yrs C++)"; R-A11Y (text contrast of the numbers and labels, decorative icons hidden from assistive tech); 375px acceptance criterion "no horizontal scroll" (About part)
- **Prerequisites:** `#about` section shell with its `<h2 id="about-heading">` (content is appended after the `<h2>` only), `--my-primary-text` and `--my-primary` CSS variables, Bootstrap Icons CDN link (version 1.11.3), the `/* Bootstrap overrides */` comment in `index.css`, Bootstrap 5.3.1 CSS
- **Creates:** `.stat-tile` (CSS class)

## 1. Goal

When this step is done, the About section shows, below its "About" heading:

1. The professional summary from RFF §7.3, word for word, as one lead paragraph with a comfortable line length.
2. A key-numbers strip of 4 tiles, in this order:

| # | Number | Label | Icon |
|---|--------|-------|------|
| 1 | `27` | years experience | `bi-calendar-check` |
| 2 | `6` | industries | `bi-building` |
| 3 | `6` | companies | `bi-briefcase` |
| 4 | `13+` | yrs C++ | `bi-cpu` |

Each tile shows the icon on top, the big number in the accessible text green below it, and the small gray label under the number. The tiles sit 4 in a row from 992px (`lg`) up and in a 2×2 grid below that, all of equal height. Each tile is one list item whose content is the number followed by the label (for example "27 years experience"); assistive tech skips the icons.

## 2. Context

- `#about` is a white section (`.page-section`, no `.section-alt`) whose only child is `<h2 id="about-heading" class="border-start border-5 border-primary ps-3 fw-bold mb-5">About</h2>`. The `<section>` element, its classes and the `<h2>` must not change; this step appends after the `<h2>`.
- `index.css` already defines `--my-primary` (`#86af49`, fill/accent) and `--my-primary-text` (`#4f6e24`, 5.85:1 on white). New styles go in one comment-headed block inserted before `/* Bootstrap overrides */`.
- CLAUDE.md: Bootstrap utilities first, small variable-driven custom CSS, no Bootstrap default blue for accents.
- There is no test suite. Verification is manual in a browser plus `git grep` static checks.
- Copy: the summary is used as written (RFF open question "Copy approval", default applied).

## 3. Structure

### 3.1 Files

| File | Change | Responsibility |
|------|--------|----------------|
| `index.html` | modify | Summary paragraph and key-numbers list inside `#about`, after its `<h2>` |
| `index.css` | modify | New `/* About */` block: `.about-summary`, `.stat-tile`, `.stat-tile-icon`, `.stat-tile-number` |

### 3.2 Markup (`index.html`, inside `#about`, directly after `</h2>`)

```html
<p class="about-summary lead mb-5">
  Senior Software Engineer with 27 years of experience building software across real estate, finance, CAD, fashion technology, telecommunications and medical imaging. Today I focus on full-stack development with C#/.NET, TypeScript and React, plus AI agents. Behind that is a deep background in C++, computer graphics and performance optimization. I have worked in startups, scale-ups and international companies, and I like solving hard technical problems in ways that create measurable business value.
</p>

<ul class="row row-cols-2 row-cols-lg-4 g-3 list-unstyled mb-0" aria-label="Key numbers">
  <li class="col">
    <div class="stat-tile d-flex flex-column align-items-center gap-1 h-100 p-3 text-center">
      <i class="bi bi-calendar-check stat-tile-icon" aria-hidden="true"></i>
      <span class="stat-tile-number fs-1 fw-bold lh-1">27</span>
      <span class="small text-body-secondary">years experience</span>
    </div>
  </li>
  <li class="col">
    <div class="stat-tile d-flex flex-column align-items-center gap-1 h-100 p-3 text-center">
      <i class="bi bi-building stat-tile-icon" aria-hidden="true"></i>
      <span class="stat-tile-number fs-1 fw-bold lh-1">6</span>
      <span class="small text-body-secondary">industries</span>
    </div>
  </li>
  <li class="col">
    <div class="stat-tile d-flex flex-column align-items-center gap-1 h-100 p-3 text-center">
      <i class="bi bi-briefcase stat-tile-icon" aria-hidden="true"></i>
      <span class="stat-tile-number fs-1 fw-bold lh-1">6</span>
      <span class="small text-body-secondary">companies</span>
    </div>
  </li>
  <li class="col">
    <div class="stat-tile d-flex flex-column align-items-center gap-1 h-100 p-3 text-center">
      <i class="bi bi-cpu stat-tile-icon" aria-hidden="true"></i>
      <span class="stat-tile-number fs-1 fw-bold lh-1">13+</span>
      <span class="small text-body-secondary">yrs C++</span>
    </div>
  </li>
</ul>
```

- **Summary:** the RFF §7.3 text, unchanged. `lead` gives the larger, lighter intro style; `about-summary` caps the line length. `mb-5` separates it from the strip.
- **List:** a `<ul>` because the four numbers are a set of peers; `aria-label="Key numbers"` names the list for screen readers. `row row-cols-2 row-cols-lg-4 g-3` gives the 2×2 grid below `lg` and one row of 4 from `lg` up. `list-unstyled` removes bullets and the default left padding, so the row's negative gutter margins line up with the summary. `mb-0`: the section padding provides the bottom space.
- **Tile:** layout, spacing and typography come from Bootstrap utilities (`d-flex flex-column align-items-center gap-1 h-100 p-3 text-center`, `fs-1 fw-bold lh-1`, `small text-body-secondary`). `h-100` makes the tiles in a row the same height when a label wraps. No headings inside tiles, so the page's heading hierarchy is unchanged.
- **Icons:** decorative, so `aria-hidden="true"`; the number and label carry the meaning.
- **Number and label** are separate flex items (blockified by the `flex-column` container) inside one `<li>`. The whitespace between the two spans makes the item's text "27 years experience", so the list item's content is the number followed by the label. Some screen readers in browse mode may announce the number and the label as two lines within the same item; that is acceptable, because both stay in the same list item and in that order.
- The tiles are not links and are not focusable.

### 3.3 Styles (`index.css`)

Insert this block immediately before `/* Bootstrap overrides */`, after any blocks already there. Do not edit any other rule.

```css
/* About */
.about-summary {
  max-width: 75ch;                                  /* readable line length for the summary */
}

.stat-tile {
  background-color: #fff;
  border: var(--bs-border-width) solid var(--bs-border-color);
  border-radius: var(--bs-border-radius-lg);
}

.stat-tile-icon {
  font-size: 1.75rem;
  line-height: 1;
  color: var(--my-primary);                         /* decorative accent, aria-hidden */
}

.stat-tile-number {
  color: var(--my-primary-text);                    /* 5.85:1 on white */
}
```

What each rule does:

- **`.about-summary`** (private to this step): limits the paragraph to about 75 characters per line on wide screens. On narrow screens the column is already narrower, so it has no effect there.
- **`.stat-tile`** (shared class, used only inside `#about`): the tile surface, white with a light Bootstrap border and the large Bootstrap radius, taken from Bootstrap variables so it matches cards elsewhere. It holds no layout or typography; those stay in utilities.
- **`.stat-tile-icon`** (private): icon size and the brand fill green. The icon is decorative, so the text-contrast rule does not apply.
- **`.stat-tile-number`** (private): the accessible text green for the big number. `fs-1` renders it bold at about 27.6px at 375px and 40px from 1200px up, so it is large text (3:1 minimum); at 5.85:1 it also passes the 4.5:1 normal-text level.
- The label uses Bootstrap's `text-body-secondary` (`rgba(33, 37, 41, 0.75)`, about 6.8:1 on white), so no custom rule is needed.
- No media query: the responsive behavior comes from `row-cols-2` / `row-cols-lg-4` and the responsive `fs-1`.

## 4. Logic flows

No non-trivial logic: the step adds static markup and styles, and no script.

## 5. Edge cases and errors

| Case | Expected behavior |
|------|-------------------|
| 375px viewport | Tiles form a 2×2 grid (each about 147px wide), the labels fit or wrap inside their tile, the tiles in a row keep equal height, and there is no horizontal scroll. |
| Viewport 576px to 991px | Still 2×2; tiles are wider. |
| Viewport 992px and up | One row of 4 tiles of equal width and height. |
| A label wraps to two lines (narrow width or large text setting) | The tile grows; `h-100` keeps its row partner at the same height. |
| Browser zoom up to 400% on a 1280px window (a 320 CSS px viewport, WCAG reflow) | The grid still holds 2 tiles per row, the labels wrap inside their tile, and there is no horizontal scroll. |
| Bootstrap Icons font fails to load | Icons are empty; number and label still show and convey the full meaning. |
| Bootstrap CSS fails to load | Tiles fall back to a plain list showing the 4 numbers and labels in reading order; content stays readable. |
| JavaScript disabled | No effect: the section has no script. |
| Screen reader | Announces a list "Key numbers" with 4 items; each item's content is the number followed by the label (possibly on two lines in browse mode); icons are skipped. |
| Windows high-contrast / forced colors | The border and text use system colors; each tile stays visible through its border. |

## 6. Tests

No automated suite exists, and this step does not add one.

### 6.1 Manual

Serve the folder (`npx serve .` or `python -m http.server`) and open it in Chrome or Edge.

1. Given a 1366×768 viewport, when you open `index.html#about`, then the About section shows the summary paragraph exactly as in RFF §7.3 (compare the text), followed by 4 tiles in one row reading "27 years experience", "6 industries", "6 companies", "13+ yrs C++", in that order, each with an icon above the number. (FR-03; acceptance criterion "About shows the summary and 4 stats")
2. Given a 1366px viewport, then the 4 tiles have the same width and height, and the summary lines are no wider than about 75 characters. (FR-03 layout)
3. Given a 375px DevTools viewport, then the tiles form a 2×2 grid with equal-height tiles in each row, and `document.documentElement.scrollWidth === document.documentElement.clientWidth` returns `true` in the console. (FR-03 mobile layout; 375px acceptance criterion)
4. Given an 800px viewport, then the tiles still form a 2×2 grid; at 992px they switch to one row of 4. (FR-03 breakpoint)
5. Given DevTools, when you inspect a big number, then its computed color is `rgb(79, 110, 36)` and the contrast picker reports at least 4.5:1 against the white tile. When you inspect a label, then the contrast picker reports at least 4.5:1. (R-A11Y contrast; plan check "big numbers reach 4.5:1")
6. Given the DevTools Accessibility tree, then the About region contains a list named "Key numbers" with 4 list items, each item's text is the number and label (for example "27 years experience"), the icons are not exposed, and there is no new heading inside the section. (R-A11Y)
7. Given Tab navigation through the page, then no tile receives focus. (Tiles are not interactive)
8. Given DevTools with the `bootstrap-icons.css` request blocked, when you reload, then the tiles still show every number and label. (Edge case: icon font fails)
9. Given a 320px DevTools viewport (the CSS width of a 1280px window at 400% zoom), then the tiles stay 2 per row, every label fits or wraps inside its tile, and `document.documentElement.scrollWidth === document.documentElement.clientWidth` returns `true` in the console. (Edge case: browser zoom; 375px acceptance criterion "no horizontal scroll")
10. Given DevTools with the `bootstrap.min.css` request blocked, when you reload, then the About section shows the summary and then the 4 numbers and labels in the order 27 years experience, 6 industries, 6 companies, 13+ yrs C++. (Edge case: Bootstrap CSS fails)
11. Given DevTools Rendering panel with `forced-colors: active` emulated, then each tile's border is visible and the numbers and labels are readable. (Edge case: forced colors)

### 6.2 Static checks

Run from the repo root:

- `git grep -n -c "stat-tile d-flex" index.html` → `index.html:4`.
- `git grep -n "bi-calendar-check\|bi-building\|bi-briefcase\|bi-cpu" index.html` → four lines inside `#about`, in this order (other sections may add their own matches below `#about`).
- `git grep -n "measurable business value" index.html` → one line, inside `#about`.
- `git grep -n 'aria-label="Key numbers"' index.html` → one line.
- `git grep -n "/\* About \*/\|/\* Bootstrap overrides \*/" index.css` → the "About" line comes before the "Bootstrap overrides" line.
- `git grep -n "stat-tile" index.css` → only lines inside the `/* About */` block.

## 7. Implementation order

1. `index.css`: add the `/* About */` block before `/* Bootstrap overrides */`. Nothing visible changes yet.
2. `index.html`: append the summary paragraph after the About `<h2>`. Reload and check the text.
3. `index.html`: append the key-numbers `<ul>` after the summary.
4. Run the manual checks (6.1) and static checks (6.2).

## 8. Out of scope

- Does not change the `#about` `<section>` element, its classes or its `<h2>`, nor any other section, the navbar, the hero, the footer or `<head>`.
- Does not change the `html` variables, the `a` / `strong` rules, `.page-section`, `.section-alt`, `.skill-chip` or any existing CSS rule.
- Adds no script, no count-up animation and no links on the tiles.
- Does not touch `images/` or `CLAUDE.md`.

## 9. Design notes

- **Copy used as written (resolved by recommendation).** The summary is the RFF §7.3 draft, word for word, as the plan's note requires.
- **Icons (resolved by recommendation).** The plan's suggested icons are used: `bi-calendar-check` (years), `bi-building` (industries), `bi-briefcase` (companies), `bi-cpu` (C++).
- **Label "yrs C++" kept verbatim (resolved by recommendation).** It matches FR-03 and the acceptance criterion. Expanding it to "years of C++" or adding a visually hidden expansion was rejected as unnecessary: screen readers read "yrs" understandably, and the visible text stays identical to the spec.
- **Utilities first, minimal CSS.** Layout, spacing and typography use Bootstrap utilities; `.stat-tile` only defines the surface, and two private classes hold the two colors. This keeps the custom block small, as CLAUDE.md asks, and keeps color tokens in variables.
- **`<ul>` over `<dl>`.** A description list would put the label (`<dt>`) before the number in source order while the design shows the number first. A plain list named "Key numbers" reads naturally ("27 years experience") with no reordering tricks.
- **Number in `--my-primary-text`, icon in `--my-primary`.** Text must pass contrast, so the number uses the text green. The icon is decorative and hidden from assistive tech, so it uses the brighter brand fill to keep the accent recognizable.
- **White tile with a border on the white section.** A tinted or gray tile background was rejected: the gray is reserved for the alternating section bands, and a green tint would compete with the chip style. The border separates the tiles without adding a new color token.
- **Trade-off: four near-identical tile blocks.** The markup repeats per tile. With no templating in a static page, repetition of four short blocks is simpler than a script that renders them, and it keeps the content visible without JavaScript.
