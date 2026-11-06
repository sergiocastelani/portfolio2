# S11 - Education and languages

- **Plan:** [plan.md](plan.md)
- **Type:** Slice
- **Requirements covered:** FR-09; R-A11Y (heading hierarchy, decorative icons hidden, text contrast); acceptance criterion "no horizontal scroll at 375px" (this section's part)
- **Prerequisites:** `#education` (section shell with `<h2 id="education-heading">` "Education & Languages"; content is appended after the `<h2>` only), `--my-primary-text` (CSS variable), Bootstrap Icons 1.11.3 (CDN link), the existing `/* Bootstrap overrides */` comment in `index.css`
- **Creates:** none

## 1. Goal

When this step is done, the Education & Languages section shows two columns from 768px (`md`) up and stacks them below that:

- **Education** (green `bi-mortarboard` icon): "B.Sc. in Computer Science", UFSC, 2003, and "Full-Stack Web Development", Growdev, 2023–2024.
- **Languages** (green `bi-translate` icon): "Portuguese: Native / C2" and "English: Upper Intermediate / B2".

Each column has an `h3` subheading under the section's `h2`. The icons are decorative and hidden from assistive tech. No script is involved.

## 2. Context

- `#education` is a section shell (`class="page-section section-alt"`, light-gray `--bs-gray-100` band) holding only its `<h2>`. The `<section>` element, its classes and the `<h2>` are final and must not change.
- Content source: `my-resume.txt` "Education" and "Languages" blocks, and RFF FR-09. The resume says "Bachelor's Degree in Computer Science, Universidade Federal de Santa Catarina (UFSC), 2003" and "Full-Stack Web Development, Growdev, 2023 – 2024"; FR-09 shortens these to "B.Sc. in Computer Science from UFSC (2003)" and "Full-Stack Web Development at Growdev (2023–2024)". This step uses the FR-09 wording.
- Conventions: Bootstrap utilities first, small variable-driven custom CSS, green text through `--my-primary-text` (Bootstrap's `text-primary` is the default blue and must not be used). Subheadings inside a section are `h3`. New styles go in one comment-headed block inserted before `/* Bootstrap overrides */`.
- There is no test suite. Verification is manual in a browser plus `git grep` static checks.

## 3. Structure

### 3.1 Files

| File | Change | Responsibility |
|------|--------|----------------|
| `index.html` | modify | Content inside `#education`, after its `<h2>` |
| `index.css` | modify | New `/* Education */` block (icon color only) before `/* Bootstrap overrides */` |

### 3.2 Markup (`index.html`, inside `#education`)

Insert directly after `<h2 id="education-heading" …>Education &amp; Languages</h2>` and before `</section>`:

```html
<div class="row row-cols-1 row-cols-md-2 g-4">
  <div class="col">
    <h3 class="h4 fw-bold mb-3">
      <i class="bi bi-mortarboard education-icon me-2" aria-hidden="true"></i>Education
    </h3>
    <ul class="list-unstyled d-flex flex-column gap-3 mb-0" role="list">
      <li>
        <span class="d-block fw-semibold">B.Sc. in Computer Science</span>
        <span class="text-body-secondary">UFSC, 2003</span>
      </li>
      <li>
        <span class="d-block fw-semibold">Full-Stack Web Development</span>
        <span class="text-body-secondary">Growdev, 2023–2024</span>
      </li>
    </ul>
  </div>
  <div class="col">
    <h3 class="h4 fw-bold mb-3">
      <i class="bi bi-translate education-icon me-2" aria-hidden="true"></i>Languages
    </h3>
    <ul class="list-unstyled d-flex flex-column gap-3 mb-0" role="list">
      <li><span class="fw-semibold">Portuguese:</span> Native / C2</li>
      <li><span class="fw-semibold">English:</span> Upper Intermediate / B2</li>
    </ul>
  </div>
</div>
```

- **Grid:** `row-cols-1 row-cols-md-2` gives one column below 768px and two from 768px up; `g-4` is the gutter (the same spacing used by the other content grids).
- **Headings:** `h3` keeps the hierarchy (`h1` hero → `h2` section → `h3` column). `class="h4"` sizes them like the other in-section subheadings, so they do not compete with the `h2`.
- **Lists:** both columns use `<ul class="list-unstyled">`, so screen readers announce "list, 2 items". The vertical gap comes from `d-flex flex-column gap-3` (no per-item margin, no trailing space after the last item). `mb-0` removes the default list margin; the section padding provides the bottom space.
- **`role="list"`:** `list-unstyled` sets `list-style: none`, and WebKit (Safari/VoiceOver) then drops the list semantics. The explicit role restores them, so every browser announces "list, 2 items".
- **Education items:** the degree is the semibold first line (`d-block`), and "institution, year" is the muted second line. The year range uses an en dash with no spaces ("2023–2024"), as in FR-09.
- **Language items:** one line each, "Language:" in semibold followed by the level, exactly as in FR-09 ("Native / C2", "Upper Intermediate / B2").
- **Icons:** `<i class="bi …">` inside the heading, `aria-hidden="true"` so the heading's accessible name is just "Education" / "Languages". `me-2` separates icon and text.
- No ids are added (nothing links to these elements). No `strong` is used for labels: `strong` is colored green page-wide, and these labels should stay in the body text color.

### 3.3 Styles (`index.css`)

Insert this block immediately before `/* Bootstrap overrides */`:

```css
/* Education */
.education-icon {
  color: var(--my-primary-text);
}
```

- `.education-icon` is private to this step and is used only on the two heading icons inside `#education`. It is needed because Bootstrap has no utility for the theme green.
- The icon inherits the `h3` font size; no size rule is needed.
- Everything else (grid, spacing, weights, muted text) uses Bootstrap utilities.

## 4. Logic flows

None. The section is static markup with no script and no states.

## 5. Edge cases and errors

| Case | Expected behavior |
|------|-------------------|
| Viewport below 768px (375px target included) | The Languages column stacks under Education with the `g-4` gap; text wraps inside the column; no horizontal scroll. |
| Viewport 768px and up | Education on the left, Languages on the right, equal widths, headings top-aligned. |
| Bootstrap Icons CDN fails | Icons do not render; headings and all text stay visible and readable. Accessible names are unaffected (icons are `aria-hidden`). |
| Bootstrap CSS fails | The content renders as plain headings and lists in one column; all text remains. |
| JavaScript disabled or Bootstrap bundle fails | No effect: the section uses no script. |
| Muted text on the gray band | `text-body-secondary` (Bootstrap 5.3 `--bs-secondary-color`, `rgba(33, 37, 41, 0.75)`) on `--bs-gray-100` measures about 6.6:1, above 4.5:1. |
| Green icons on the gray band | `--my-primary-text` on `--bs-gray-100` is 5.55:1 (decorative icon, above the 3:1 non-text minimum anyway). |
| Screen reader | Reads "heading level 3, Education", "list, 2 items", each degree and "UFSC, 2003" / "Growdev, 2023–2024"; then "heading level 3, Languages" and the two language lines. |
| Browser zoom 200% at 375px | Text wraps; no clipping and no horizontal scroll. |

## 6. Tests

No automated suite exists, and this step does not add one.

### 6.1 Manual

Serve the folder (`npx serve .` or `python -m http.server`) and open it in Chrome or Edge.

1. Given a 1366×768 viewport, when you navigate to `#education` (or click "Education" in the navbar), then the section shows two columns: "Education" with a green mortarboard icon listing "B.Sc. in Computer Science / UFSC, 2003" and "Full-Stack Web Development / Growdev, 2023–2024", and "Languages" with a green translate icon listing "Portuguese: Native / C2" and "English: Upper Intermediate / B2". (FR-09)
2. Given a 375px DevTools viewport, when you scroll to Education & Languages, then "Languages" sits below "Education" (stacked), all text is readable, and `document.documentElement.scrollWidth === document.documentElement.clientWidth` returns `true` in the console. (FR-09 stacking; 375px acceptance criterion)
3. Given a 768px viewport, then the two columns sit side by side; at 767px they stack. (Breakpoint `md`)
4. Given the DevTools Accessibility tree, when you inspect the section, then it contains exactly two `h3` headings named "Education" and "Languages" (no icon text in the names), each followed by a list of 2 items, and the icons are not exposed. If Safari is available, the Web Inspector's Accessibility panel (or VoiceOver) also reports each `ul` as a list with 2 items. (R-A11Y heading hierarchy, list semantics, decorative icons)
5. Given DevTools, when you inspect an icon, then its computed color is `rgb(79, 110, 36)`; when you inspect "UFSC, 2003", then the contrast picker reports at least 4.5:1 against the band background `rgb(248, 249, 250)`. (R-A11Y contrast)
6. Given DevTools with the request for `bootstrap-icons.css` blocked, when you reload, then the headings "Education" and "Languages" and all four entries are still shown (without icons). (Edge case: icon font fails)
7. Compare every entry with FR-09: degree, institution, year, the two languages and their levels match exactly. (FR-09)

### 6.2 Static checks

Run from the repo root:

- `git grep -n "bi-mortarboard\|bi-translate" index.html` → exactly 2 lines, both inside `#education`, both with `aria-hidden="true"`.
- `git grep -n "B.Sc. in Computer Science\|UFSC, 2003\|Full-Stack Web Development\|Growdev, 2023–2024\|Native / C2\|Upper Intermediate / B2" index.html` → 6 lines, all inside `#education`.
- `git grep -n "education-icon" index.html index.css` → 2 lines in `index.html` and 1 rule in `index.css`.
- `git grep -n "/\* Education \*/\|/\* Bootstrap overrides \*/" index.css` → the "Education" line comes before the "Bootstrap overrides" line.
- `git grep -n 'role="list"' index.html` → includes exactly 2 lines inside `#education` (the two `<ul class="list-unstyled …">`).
- `git diff HEAD -- index.html`, run on a working tree whose only uncommitted change to `index.html` is this step's work (or `git diff <commit before this step> -- index.html` once it is committed) → no change to the `<section id="education" …>` line or its `<h2>`; all added lines sit between that `<h2>` and the section's `</section>`.

## 7. Implementation order

1. `index.css`: add the `/* Education */` block with `.education-icon` before `/* Bootstrap overrides */`. Nothing visible changes yet.
2. `index.html`: insert the row with the two columns after the `#education` `<h2>`.
3. Run the manual checks (6.1) and static checks (6.2).

## 8. Out of scope

- Does not change the `#education` `<section>` element, its classes or its `<h2>`, nor any other section, the navbar, the hero, the footer or `<head>`.
- Does not edit `--my-primary-text` or any shared CSS rule, and adds no CSS outside its own `/* Education */` block.
- Does not edit `my-resume.txt`, `images/` or `CLAUDE.md`.
- Adds no certificates, course links or language-toggle features (RFF non-goal: no Portuguese version or language toggle).

## 9. Design notes

- **FR-09 wording, short institution name (default chosen).** "UFSC" is shown as in FR-09 instead of the full "Universidade Federal de Santa Catarina": it keeps the line short in a half-width column. An `<abbr title>` expansion was rejected because the tooltip is unreachable on touch and keyboard. Recommended default: keep "UFSC"; if the user wants the full name, only that one text node changes.
- **Two-line education items, one-line language items.** A degree and its institution/year are two facts a recruiter scans separately, so the degree is bold on its own line. Language levels are short pairs, so "Language: level" on one line matches FR-09 literally.
- **`<ul>` over `<dl>` for languages.** A description list is semantically closer for key/value pairs, but it would need extra CSS to lay out `dt`/`dd` inline and would differ from the Education column. Two parallel `<ul role="list">`s keep both columns identical in structure (DRY) with Bootstrap utilities only.
- **Semibold spans, not `strong`.** The page colors every `strong` green, which would make the labels look like links; `fw-semibold` keeps them neutral.
- **Minimal custom CSS (KISS).** The only custom rule is the icon color, because Bootstrap's `text-primary` is blue and the theme asks for green accents. Layout, spacing and muted text use Bootstrap utilities.
- **No cards or borders.** The section sits on a gray band and holds only four short facts; plain columns keep it light and avoid styling that would need more custom CSS.
