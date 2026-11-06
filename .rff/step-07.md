# S07 - "What I bring" replaces Objectives

- **Plan:** [plan.md](plan.md)
- **Type:** Slice
- **Requirements covered:** FR-06; acceptance criterion "No 'Objectives' section remains"; acceptance criterion "no horizontal scroll at 375px" (this section's part); R-A11Y (heading hierarchy, icon contrast, decorative icons hidden)
- **Prerequisites:** `#value` (section shell with `<h2 id="value-heading">` "What I bring"; content is appended after the `<h2>` only), `--my-primary-text` (CSS variable), Bootstrap Icons CDN (`bi-diagram-3`, `bi-speedometer2`, `bi-lightbulb`, `bi-rocket-takeoff`), the `/* Bootstrap overrides */` comment in `index.css`; existing legacy "Objectives" `<section>` in `index.html` and the existing `#objectives-list` rules in `index.css`
- **Creates:** `.value-item` (CSS class, used only inside `#value`)

## 1. Goal

When this step is done:

- The "What I bring" section (`#value`) shows four value statements, in this order: End-to-end ownership, Performance mindset, Hard problems, practical solutions, Startup to enterprise. Each one has a green Bootstrap Icon, a bold lead-in (an `h3`) and one short sentence, with the copy from RFF §7.4.
- From 768px (`md`) up, the statements form a 2×2 grid. Below 768px they stack in one column. There is no horizontal scroll at 375px.
- The legacy "Objectives" section is gone from the page, and the `#objectives-list` rules are gone from `index.css`. Nothing in `index.html` or `index.css` mentions "objectives" any more.

## 2. Context

- `#value` is a white `.page-section` (no `.section-alt` band) holding only `<h2 id="value-heading" class="border-start border-5 border-primary ps-3 fw-bold mb-5">What I bring</h2>`. The `<section>` element, its classes and the `<h2>` must not change.
- The legacy section is `<section class="p-3 mt-5">` with `<h2 …>Objectives</h2>` and `<ul id="objectives-list" class="fs-5">` (four `<li>` with `<strong>` phrases). It sits between the legacy "Strongest Hard skills" section and the legacy "Showcase" section.
- `index.css` has three `#objectives-list` rules (`#objectives-list`, `#objectives-list li`, `#objectives-list li::before`) between the `#profile-img` rule and the `.social-btn` rule.
- Conventions (CLAUDE.md, plan section 2): Bootstrap utilities first, small variable-driven custom CSS, green text uses `--my-primary-text` (`#4f6e24`, 5.85:1 on white), new styles go in one comment-headed block inserted before `/* Bootstrap overrides */`. Sections use `h2`, so sub-items use `h3`.
- No test suite. Verification is manual in a browser plus `git grep` static checks.

## 3. Structure

### 3.1 Files

| File | Change | Responsibility |
|------|--------|----------------|
| `index.html` | modify | Content of `#value` after its `<h2>`; delete the legacy "Objectives" `<section>` |
| `index.css` | modify | Delete the three `#objectives-list` rules; add a `/* What I bring */` block with `.value-item` and `.value-item-icon` |

### 3.2 Markup (`index.html`)

**a) Content of `#value`.** Append directly after `</h2>` of `#value-heading`, before `</section>`:

```html
<ul class="row row-cols-1 row-cols-md-2 g-4 list-unstyled mb-0">
  <li class="col value-item">
    <i class="bi bi-diagram-3 value-item-icon" aria-hidden="true"></i>
    <div>
      <h3 class="h5 fw-bold mb-1">End-to-end ownership</h3>
      <p class="mb-0">I take features from database schema to polished UI and ship them.</p>
    </div>
  </li>
  <li class="col value-item">
    <i class="bi bi-speedometer2 value-item-icon" aria-hidden="true"></i>
    <div>
      <h3 class="h5 fw-bold mb-1">Performance mindset</h3>
      <p class="mb-0">Years of C++ and GPU work taught me to measure, profile and remove bottlenecks.</p>
    </div>
  </li>
  <li class="col value-item">
    <i class="bi bi-lightbulb value-item-icon" aria-hidden="true"></i>
    <div>
      <h3 class="h5 fw-bold mb-1">Hard problems, practical solutions</h3>
      <p class="mb-0">3D engines, real-time simulation, medical imaging, AI agents: I turn complex tech into working products.</p>
    </div>
  </li>
  <li class="col value-item">
    <i class="bi bi-rocket-takeoff value-item-icon" aria-hidden="true"></i>
    <div>
      <h3 class="h5 fw-bold mb-1">Startup to enterprise</h3>
      <p class="mb-0">I have been a CTO who built a platform from scratch and an engineer in large international teams.</p>
    </div>
  </li>
</ul>
```

- `<ul>` keeps the four statements announced as a list of 4. `list-unstyled` removes the bullets and the left padding, and `mb-0` removes the reboot bottom margin so the section padding alone sets the spacing.
- `row row-cols-1 row-cols-md-2 g-4`: one column below 768px and two columns from 768px up, which gives the 2×2 grid. `g-4` sets 1.5rem gaps between items in both directions.
- Each `<li>` is the grid column and the `.value-item` itself. The icon sits on the left and the text block on the right (layout in 3.3).
- Lead-ins are `h3` (styled `h5`, bold) under the section's `h2`, so the heading hierarchy stays valid and screen-reader users can jump between statements. They use the body text color. The trailing period from the RFF draft is dropped because a heading now separates the lead-in from its sentence (the wording is otherwise unchanged).
- Icons are decorative (`aria-hidden="true"`): the `h3` carries the meaning.

**b) Delete the legacy "Objectives" section.** Remove the whole `<section class="p-3 mt-5">` whose `<h2>` reads "Objectives", from its opening tag to its `</section>`, including the `<ul id="objectives-list">` and the blank line that separates it from the next section. The legacy "Strongest Hard skills" section before it and the legacy "Showcase" section after it stay untouched.

### 3.3 Styles (`index.css`)

**a) Delete** the three rules `#objectives-list { … }`, `#objectives-list li { … }` and `#objectives-list li::before { … }`, plus the blank line after them. The `#profile-img` rule before them and the `.social-btn` rule after them stay untouched.

**b) New block `/* What I bring */`.** Insert it immediately before the `/* Bootstrap overrides */` comment (after any other section blocks already there):

```css
/* What I bring */
.value-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.value-item-icon {
  flex-shrink: 0;
  font-size: 2rem;
  line-height: 1;
  color: var(--my-primary-text);   /* 5.85:1 on white, above the 3:1 non-text minimum */
}
```

What each rule does:

- **`.value-item`** (shared name, used only inside `#value`): lays out one statement as icon left, text right, aligned to the top so the icon lines up with the `h3`. It does not set a background, border or padding: the statements sit directly on the white section. It does not set width or gutters, which stay with the Bootstrap column classes on the same `<li>`.
- **`.value-item-icon`** (private to this step): sizes the icon to 2rem, keeps it from shrinking when the text wraps, and colors it with the accessible text green. `--my-primary` (`#86af49`, 2.55:1) is not used because it fails the 3:1 non-text contrast minimum on white.

No media query is needed: the column switch is done by `row-cols-md-2`.

## 4. Logic flows

No non-trivial logic: the step adds static markup and styles, and no script.

## 5. Edge cases and errors

| Case | Expected behavior |
|------|-------------------|
| Viewport 375px (and down to 320px) | One column. Icon and text sit side by side, the text wraps, and there is no horizontal scroll (the row's negative 0.75rem side margins fit inside the section's 1rem side padding). |
| Viewport exactly 768px | Two columns (2×2 grid). At 767px, one column. |
| Statements of unequal length in a row | Each item is top-aligned. Uneven heights within a row are fine, since items have no background or border. |
| Bootstrap Icons font fails to load | The icon `<i>` renders empty (2rem wide at most, no visible glyph). The headings and sentences stay fully readable, and nothing is announced for the icons. |
| Bootstrap CSS fails to load | Items render as a plain list with headings and paragraphs; all text remains visible. |
| JavaScript disabled | No effect: the section uses no script. |
| Screen reader | Announces a list of 4 items inside the "What I bring" region, each with a level-3 heading and a sentence. Icons are skipped. |

## 6. Tests

No automated suite exists, and this step does not add one.

### 6.1 Manual

Serve the folder (`npx serve .` or `python -m http.server`) and open it in Chrome or Edge.

1. Given a 1366×768 viewport, when you scroll to "What I bring", then 4 statements appear as a 2×2 grid in this order: End-to-end ownership, Performance mindset (top row), Hard problems, practical solutions, Startup to enterprise (bottom row). Each has a green icon (diagram, speedometer, lightbulb, rocket), a bold heading and the sentence from RFF §7.4, word for word. (FR-06)
2. Given a 768px DevTools viewport, then the grid is still 2×2. Given 767px, then the 4 statements stack in one column. (FR-06 layout)
3. Given a 375px viewport, then the statements stack, each icon stays left of its text, and `document.documentElement.scrollWidth === document.documentElement.clientWidth` in the console returns `true`. (375px acceptance criterion)
4. Given DevTools, when you inspect a `.value-item-icon`, then its computed color is `rgb(79, 110, 36)` and its font size is `32px`. (R-A11Y non-text contrast)
5. Given the DevTools Accessibility tree (or a screen reader), when you select the "What I bring" region, then it contains a list with 4 items, each with a heading level 3 and a paragraph, and no icon node is exposed. (R-A11Y heading hierarchy)
6. Given the whole page, when you scroll from top to bottom, then no "Objectives" heading or its four aspiration bullets appear anywhere, and the legacy "Strongest Hard skills" and "Showcase" sections (if still present) render as before. (Acceptance criterion "No 'Objectives' section remains"; no regression on neighboring sections)

### 6.2 Static checks

Run from the repo root:

- `git grep -n -i "objectives" -- index.html index.css` → no output. (Legacy section and `#objectives-list` rules removed; case-insensitive so the "Objectives" heading is caught too.)
- `git grep -c 'class="col value-item"' -- index.html` → `index.html:4`.
- `git grep -n "bi-diagram-3\|bi-speedometer2\|bi-lightbulb\|bi-rocket-takeoff" -- index.html` → exactly 4 lines, in that order.
- `git grep -n "/\* What I bring \*/\|/\* Bootstrap overrides \*/" -- index.css` → the "What I bring" line comes before the "Bootstrap overrides" line.

## 7. Implementation order

1. `index.css`: add the `/* What I bring */` block before `/* Bootstrap overrides */`. Nothing visible changes yet.
2. `index.html`: append the `<ul>` with the 4 statements after the `#value` `<h2>`. The section now shows the grid; the legacy Objectives section still renders lower down.
3. `index.html`: delete the legacy "Objectives" `<section>`.
4. `index.css`: delete the three `#objectives-list` rules (no markup uses them any more).
5. Run the manual checks (6.1) and static checks (6.2).

## 8. Out of scope

- Does not change the `#value` `<section>` element, its classes or its `<h2>`, and adds no navbar link to `#value`.
- Does not touch any other section's content, the legacy "Strongest Hard skills" and "Showcase" sections, the hero, the footer or `<head>`.
- Does not change the `html` variables, the global `a` / `strong` rules, any other CSS block, the project-card rules or the existing 768px media query.
- Does not touch `images/` or `CLAUDE.md`.

## 9. Design notes

- **Copy used as written** (RFF open question "Copy approval", default applied): the four lead-ins and sentences come from RFF §7.4 unchanged, except that each lead-in loses its trailing period because it is now a heading rather than inline bold text.
- **`h3` lead-ins instead of inline `<strong>`.** The plan asks for a bold lead-in. An `h3` gives the same bold look and adds heading navigation under the section's `h2`. An inline `<strong>` was rejected: the global `strong` rule colors it green with weight 500, which would need an override to look bold and adds no structure.
- **Icon color `--my-primary-text`, not `--my-primary`.** The icons are the only green accent in the section. `#86af49` is 2.55:1 on white, below the 3:1 non-text minimum, so the text green is used.
- **Plain items, no card or border (keep it simple).** The section is white and sits between gray bands; borderless icon-and-text items keep it visually lighter than the bordered stat tiles and expertise cards around it, and need only two small CSS rules.
- **Layout in utilities, item styling in one class (SRP).** Grid behavior (columns, gutters, breakpoint) stays in Bootstrap's `row-cols-*` / `g-4` classes; `.value-item` only arranges icon and text. This avoids a custom media query.
- **`<ul>` over plain `<div>`s.** The four statements are a set, so list semantics tell screen-reader users there are 4 of them. Bootstrap's `.row` works on a `<ul>` once `list-unstyled` and `mb-0` reset its padding and margin.
- **Delete after add.** The new content goes in before the legacy section and its CSS are removed, so the page never loses the content mid-step.
