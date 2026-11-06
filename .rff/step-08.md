# S08 - Experience timeline with all six roles

- **Plan:** [plan.md](plan.md)
- **Type:** Slice
- **Requirements covered:** FR-07; acceptance criteria "Experience timeline lists 6 roles newest first, with Tech6 'Oct 2023 – Oct 2026' and Pixeon 'Feb 2005 – Jan 2012'" and "at 375px the timeline is readable and there is no horizontal scroll" (timeline part); RFF §6 timeline UI notes (green line, dot per role, muted date badge, mobile layout; Bootstrap Icons deliberately omitted, see design notes); R-A11Y (heading hierarchy, text contrast) for this section
- **Prerequisites:** `#experience` (section shell with `<h2 id="experience-heading">`; content is appended after the `<h2>` only), `.skill-chip` (CSS class), `--my-primary` and `--my-primary-text` (CSS variables), `/* Bootstrap overrides */` comment in `index.css`, Bootstrap 5.3.1 CSS (`.badge`, `--bs-secondary-bg`, `--bs-secondary-color`, `--bs-gray-100`, `list-unstyled` and the spacing, flex and text utilities used below)
- **Creates:** `.timeline`, `.timeline-item`, `.timeline-date`

## 1. Goal

When this step is done, the Experience section shows, below its heading:

- A vertical brand-green line (`--my-primary`) with one green dot per role, and 6 entries in this order, newest first: Tech6, Graebert, Audaces, ITM Apps, AGM, Pixeon.
- Each entry shows a heading "Role at Company" (company in the accessible text green), the date range in a muted gray badge, the one-line company context, 2 to 4 bullets and the tech chips, with the data of RFF §7.1 (Tech6 "Oct 2023 – Oct 2026", Pixeon "Feb 2005 – Jan 2012").
- From 768px up, the dates sit in a fixed-width column left of the line, the line runs between the dates and the content, and the content sits to the right.
- Below 768px, the line moves to the left edge, the date badge sits under the heading, and the content takes the full remaining width with no horizontal scroll at 375px.
- "Drapo" and "T6-GPT" are plain text: the section contains no links.

## 2. Context

- `#experience` is a `<section class="page-section section-alt">` (gray `--bs-gray-100` band, `3rem 1rem` padding) holding only `<h2 id="experience-heading" … mb-5>Experience</h2>`. This step appends its markup right after that `<h2>` and changes nothing else in the section.
- Global styles in force: `a` and `strong` are colored `--my-primary-text` (`#4f6e24`, 5.55:1 on `--bs-gray-100`), and `strong` has `font-weight: 500`. Links are not underlined at rest, so green `strong` text looks like a link; this step therefore does not use `strong` for the project names in the bullets.
- `.skill-chip` is used as `<span class="badge skill-chip">…</span>`.
- CSS convention (plan §2): one comment-headed block per step, inserted immediately before `/* Bootstrap overrides */`, holding its own media query. Bootstrap utilities first; custom CSS small and variable-driven.
- Content source: RFF §7.1 wins over `my-resume.txt` where they differ (the resume links Drapo and lists extra tools such as "Visual Studio", "Jira" and "Git" in some roles; §7.1 does not, so those chips are not shown here).
- No test suite: verification is manual in a browser plus `git grep` / console checks.

## 3. Structure

### 3.1 Files

| File | Change | Responsibility |
|------|--------|----------------|
| `index.html` | modify | Timeline markup inside `#experience`, after `<h2 id="experience-heading">` |
| `index.css` | modify | New `/* Experience timeline */` block before `/* Bootstrap overrides */` |

### 3.2 Markup (`index.html`, inside `#experience`)

Append directly after `<h2 id="experience-heading" …>Experience</h2>`, before `</section>`:

```html
<ol class="timeline list-unstyled mb-0" role="list">
  <li class="timeline-item">
    <h3 class="h5 fw-bold mb-1">Senior Full-Stack Web Developer at <span class="timeline-company">Tech6</span></h3>
    <span class="badge timeline-date">Oct 2023 – Oct 2026</span>
    <p class="text-body-secondary mb-2">Software company: business analytics and enterprise web platforms</p>
    <ul class="mb-3">
      <li><span class="fw-semibold">Sysphera</span>: C#/TypeScript/MSSQL SPA for data storage and OLAP-cube analysis.</li>
      <li><span class="fw-semibold">Drapo</span>: TypeScript framework for frontend development.</li>
      <li><span class="fw-semibold">T6-GPT</span>: AI assistant to operate Sysphera and surface data insights (Microsoft Agent Framework).</li>
      <li>Real estate management platform for a major U.S. client.</li>
    </ul>
    <ul class="list-unstyled d-flex flex-wrap gap-2 mb-0" role="list" aria-label="Technologies used at Tech6">
      <li><span class="badge skill-chip">C#</span></li>
      <!-- one <li><span class="badge skill-chip">…</span></li> per technology, in table order -->
    </ul>
  </li>
  <!-- five more .timeline-item entries with the same structure -->
</ol>
```

Structure of every `li.timeline-item`, in this DOM order:

1. `<h3 class="h5 fw-bold mb-1">{Role} at <span class="timeline-company">{Company}</span></h3>`: one heading per role, under the section `h2`. The heading reads naturally to screen readers ("Software Engineer at Graebert") and stays unique even though "Software Engineer" appears three times.
2. `<span class="badge timeline-date">{Dates}</span>`: the date range, after the heading in the DOM so heading navigation lands on the role first and the date is read next.
3. `<p class="text-body-secondary mb-2">{Context}</p>`: the one-line company context.
4. `<ul class="mb-3">`: 2 to 4 bullets, default disc markers, each ending with a period.
5. `<ul class="list-unstyled d-flex flex-wrap gap-2 mb-0" role="list" aria-label="Technologies used at {Company}">`: one `<li><span class="badge skill-chip">{Tech}</span></li>` per technology.

Notes:

- `<ol>` keeps the order announced to screen readers. `role="list"` on the `<ol>` and on every chip `<ul>` is deliberately redundant: Safari/VoiceOver drops list semantics from lists styled with `list-style: none` (`list-unstyled`), and the explicit role restores them. On the chip lists it also keeps the `aria-label` on an element with a role, so the name is announced. The bullet `<ul>`s keep their default disc markers and need no role.
- `.timeline-company` is a private class of this step (company name in `--my-primary-text`).
- Dates use the en dash `–` (U+2013) with a normal space on each side, exactly as in RFF §7.1. Characters are typed literally (the file is UTF-8, as the existing `é` shows).
- No `<a>` element anywhere in the timeline. Project names in bullets use `<span class="fw-semibold">` (body color), not `strong`, so they do not look like links.

**Content (exact text, from RFF §7.1).** Entries in this order:

| # | Role (h3) | Company | Dates | Context | Bullets | Chips (in this order) |
|---|-----------|---------|-------|---------|---------|-----------------------|
| 1 | Senior Full-Stack Web Developer | Tech6 | Oct 2023 – Oct 2026 | Software company: business analytics and enterprise web platforms | (1) **Sysphera**: C#/TypeScript/MSSQL SPA for data storage and OLAP-cube analysis. (2) **Drapo**: TypeScript framework for frontend development. (3) **T6-GPT**: AI assistant to operate Sysphera and surface data insights (Microsoft Agent Framework). (4) Real estate management platform for a major U.S. client. | C#, ASP.NET, TypeScript, React, Redux, PostgreSQL, SQL Server, Docker, Azure, Microsoft Agent Framework |
| 2 | Software Engineer | Graebert | Sep 2022 – Mar 2023 | Leading international CAD platform | (1) Contributed mainly to the graphics engine. (2) Removed performance bottlenecks. (3) Investigated and fixed defects. | C++, OpenGL, Qt, Multithreading |
| 3 | Senior Software Engineer | Audaces | May 2017 – Sep 2022 | Multinational fashion-technology company (software and hardware) | (1) Contributed to Audaces 4D (3D fashion design). (2) Built 3D modeling and real-time cloth-simulation tools. (3) Led prototypes: VR try-on mirror (Unity + body tracking), WebGL garment viewer, Industry 4.0 integrations with SENAI/SP. | C++, OpenGL, Qt, Computer Graphics, Multithreading, Jenkins |
| 4 | CTO / Lead Developer | ITM Apps | Sep 2014 – Aug 2016 | Startup: condominium management | (1) Designed and built APControle from scratch. (2) Cloud-based condo management platform. (3) Full AWS integration. | PHP, PostgreSQL, HTML, CSS, AWS |
| 5 | Software Engineer | AGM | Feb 2012 – Jan 2013 | Telecommunications software | (1) Tools integrated with Cisco VoIP solutions. (2) Improved development processes. (3) Standardized tools and environments. | C++, SIP, VoIP, TCP/IP |
| 6 | Software Engineer | Pixeon | Feb 2005 – Jan 2012 | Medical imaging software | (1) High-performance thin-client radiology systems, with lower maintenance costs and more flexible reporting. (2) Scalable pipeline-processing frameworks. (3) Advanced 3D rendering for medical visualization. (4) 1 year of iOS development. | C++, Python, Java, Assembly, OpenGL, CUDA, DICOM, Multithreading |

- Bold in the bullets column means `<span class="fw-semibold">Name</span>` followed by the colon in plain text.
- Pixeon has 5 source bullets in §7.1. The first and fourth ("High-performance thin-client radiology systems" and "Lower maintenance costs, more flexible reporting") are merged into bullet (1), which keeps every 2–4 bullet limit and loses no fact.
- `&` does not appear in the content; `C#`, `C++`, `TCP/IP`, `SENAI/SP` and `+` need no escaping.
- Bullet counts: 4, 3, 3, 3, 3, 4. Chip counts: 10, 4, 6, 5, 4, 8.

### 3.3 Styles (`index.css`)

Insert this block immediately before `/* Bootstrap overrides */` (after any other section blocks already there). Nothing else in `index.css` changes.

```css
/* Experience timeline */
.timeline {
  --timeline-axis: 0.5rem;          /* x position of the line's center; left edge on mobile */
  --timeline-gap: 1.5rem;           /* space between the line and the content (and the date column) */
  --timeline-line-width: 3px;
  --timeline-dot-size: 1rem;
  --timeline-dot-ring: 4px;         /* band-colored ring that separates the dot from the line */
  --timeline-row-height: 1.5rem;    /* first line of an .h5 heading: 1.25rem x 1.2 line-height */
  --timeline-date-width: 9.5rem;    /* date column from 768px up; fits "Oct 2023 – Oct 2026" */
  position: relative;
}

.timeline::before {                 /* the vertical line */
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--timeline-axis);
  width: var(--timeline-line-width);
  background-color: var(--my-primary);
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  padding-left: calc(var(--timeline-axis) + var(--timeline-gap));
}
.timeline-item:not(:last-child) {
  padding-bottom: 2.5rem;
}

.timeline-item::before {            /* the dot, centered on the line and on the heading's first line */
  content: "";
  position: absolute;
  left: var(--timeline-axis);
  top: calc((var(--timeline-row-height) - var(--timeline-dot-size)) / 2);
  width: var(--timeline-dot-size);
  height: var(--timeline-dot-size);
  border-radius: 50%;
  background-color: var(--my-primary);
  box-shadow: 0 0 0 var(--timeline-dot-ring) var(--bs-gray-100);
  transform: translateX(-50%);
}

.timeline-company {
  color: var(--my-primary-text);
}

.timeline-date {
  --bs-badge-padding-y: 0;
  line-height: var(--timeline-row-height);
  color: var(--bs-secondary-color);
  background-color: var(--bs-secondary-bg);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

@media (min-width: 768px) {
  .timeline {
    --timeline-axis: calc(var(--timeline-date-width) + var(--timeline-gap));
  }
  .timeline-date {
    position: absolute;
    top: 0;
    left: 0;
    width: var(--timeline-date-width);
    white-space: normal;
  }
}
```

What each rule does:

- **`.timeline` variables:** the only geometry source. On mobile the line sits 0.5rem from the left edge. From 768px up, `--timeline-axis` moves the line to the right of the date column, so the date, the line and the content keep one `--timeline-gap` between each other. No magic numbers in the other rules.
- **`.timeline::before`:** the full-height brand-green line on the `<ol>`.
- **`.timeline-item`:** positioning context for its dot and (from 768px) its date; left padding puts the content one gap to the right of the line; 2.5rem space between entries.
- **`.timeline-item::before`:** a 1rem brand-green dot on the line, vertically centered on the first line of the `h3`. The ring uses `--bs-gray-100`, the `#experience` band color, so the line visibly stops around each dot.
- **`.timeline-company`:** company name in the accessible text green (5.55:1 on the band).
- **`.timeline-date`:** a muted badge: Bootstrap's secondary text on the secondary background (about 6.2:1), medium weight instead of the badge's bold, and a line height equal to the heading row so the badge lines up with the heading and the dot. It overrides `.badge`'s white color with the same specificity and wins because `index.css` loads after Bootstrap. Below 768px it stays in the flow under the heading.
- **`@media (min-width: 768px)`:** moves the line right of the date column and takes the date out of the flow into that column (left edge of the item, fixed width, top aligned with the heading). `white-space: normal` lets the date wrap inside its column instead of overlapping the line if the text is ever wider (large zoom, fallback font).

## 5. Edge cases and errors

| Case | Expected behavior |
|------|-------------------|
| 375px viewport | Line at the left edge (0.5rem in), dots on it, content from 2rem to the right edge; heading, then date badge, then context, bullets, chips. No horizontal scroll (content area is about 279px; the widest chip "Microsoft Agent Framework" and the date badge are narrower and chips wrap). |
| 768px to 991px (narrowest desktop layout) | Date column 9.5rem, line 1.5rem to its right, content about 440px wide; headings and chips wrap within it. |
| Date text wider than the column (large zoom, fallback font) | The badge wraps inside its 9.5rem column (each line 1.5rem tall); it never overlaps the line or the content. |
| Long heading that wraps to two lines | The dot and the date stay aligned with the heading's first line. |
| 200% browser zoom on desktop | Behaves like a narrower viewport: the mobile layout applies below 768 CSS px; no horizontal scroll. |
| Forced colors / Windows high contrast | The line and dots (background colors) may disappear; all text, headings and lists remain. Accepted: the line and dots are decorative, the order is carried by the `<ol>` and the dates. |
| JavaScript disabled or Bootstrap bundle blocked | No effect: the section is static HTML and CSS. |
| Screen reader | Announces a list of 6 items; each item starts with the `h3` "Role at Company", then the date, context, a list of bullets and a list "Technologies used at Company". Heading navigation lists 6 unique `h3`s under "Experience". |
| Safari / VoiceOver with `list-style: none` | Both the timeline `<ol>` and each chip `<ul>` keep list semantics through `role="list"`, and each chip list keeps its name "Technologies used at {Company}". |
| Content mismatch with `my-resume.txt` (Drapo link, extra tools) | RFF §7.1 wins: no links; only the §7.1 chips are shown. |

## 6. Tests

No automated suite exists, and this step does not add one.

### 6.1 Manual

Serve the folder (`npx serve .` or `python -m http.server`) and open it in Chrome or Edge.

1. Given a 1366×768 viewport, when you scroll to Experience, then 6 entries appear in the order Tech6, Graebert, Audaces, ITM Apps, AGM, Pixeon, each with a heading "Role at Company", a gray date badge in a column left of a green vertical line, a green dot on the line next to each heading, a gray context line, bullets and green chips. (FR-07; RFF §6 timeline)
2. Given the same page, when you compare each entry with the table in section 3.2 and with RFF §7.1, then every company, role, date, context line, bullet and chip matches; Tech6 reads "Oct 2023 – Oct 2026" and Pixeon "Feb 2005 – Jan 2012". (FR-07; acceptance criterion "Experience timeline")
3. Given the console, when you run
   `[...document.querySelectorAll('#experience .timeline-item')].map(li => [li.querySelector('h3').textContent, li.querySelector('.timeline-date').textContent, li.querySelectorAll(':scope > ul')[0].children.length, [...li.querySelectorAll('.skill-chip')].map(c => c.textContent).join(', ')])`,
   then it returns 6 rows: headings in the order above, the six date ranges, bullet counts `4, 3, 3, 3, 3, 4` (each between 2 and 4), and chip lists equal to the "Chips" column. (FR-07: 2–4 bullets, tech chips)
4. Given a 375px DevTools viewport, when you scroll to Experience, then the line sits at the left edge, each date badge is under its heading, text is readable without zooming, and `document.documentElement.scrollWidth === document.documentElement.clientWidth` returns `true`. (FR-07 mobile; acceptance criterion "375px: timeline readable, no horizontal scroll")
5. Given a viewport resized from 767px to 768px, then the date badges move from under the headings into the left column and the line moves right of them, with no overlap between date, line and text. (RFF §6 "on mobile the line moves to the left edge")
6. Given the Tech6 entry, when you hover or click "Sysphera", "Drapo" or "T6-GPT", then nothing happens (default cursor, no underline, no navigation); `document.querySelectorAll('#experience a').length` returns `0`. (FR-07; RFF decision 17 "Drapo / T6-GPT no link")
7. Given the DevTools contrast picker, then the company name (`rgb(79, 110, 36)` on `rgb(248, 249, 250)`), the date badge text, the context line and the chips each report at least 4.5:1. (R-A11Y contrast)
8. Given the DevTools Accessibility tree, then `#experience` contains a list with 6 list items, each starting with a level-3 heading "Role at Company" (for example "Software Engineer at Graebert"), and each chip list is a list named "Technologies used at {Company}" (in Safari too, through `role="list"`). The page still has exactly one `h1`. (R-A11Y heading hierarchy; plan "semantic `<ol>`")
9. Given a 1366px viewport and 200% browser zoom, then the timeline switches to the mobile layout and there is no horizontal scroll. (Edge case: zoom)

### 6.2 Static checks

Run from the repo root:

- `git grep -c 'class="timeline-item"' index.html` → `index.html:6`.
- `git grep -n -o 'at <span class="timeline-company">[^<]*' index.html` → six lines, in order: Tech6, Graebert, Audaces, ITM Apps, AGM, Pixeon.
- `git grep -n -o 'class="badge timeline-date">[^<]*' index.html` → six lines, in order: `Oct 2023 – Oct 2026`, `Sep 2022 – Mar 2023`, `May 2017 – Sep 2022`, `Sep 2014 – Aug 2016`, `Feb 2012 – Jan 2013`, `Feb 2005 – Jan 2012`.
- `sed -n '/<section id="experience"/,/<\/section>/p' index.html | grep -c "<a "` → `0`.
- `git grep -n "spadrapo" index.html` → no output.
- `sed -n '/<section id="experience"/,/<\/section>/p' index.html | grep -c 'role="list"'` → `7` (the `<ol>` and six chip lists).
- `sed -n '/<section id="experience"/,/<\/section>/p' index.html | grep -c 'class="bi '` → `0` (no icons, by design).
- `git grep -n "/\* Experience timeline \*/\|/\* Bootstrap overrides \*/" index.css` → the "Experience timeline" line comes before the "Bootstrap overrides" line.
- `git grep -n "\.timeline" index.css` → matches only inside the `/* Experience timeline */` block.

## 7. Implementation order

1. `index.css`: add the `/* Experience timeline */` block before `/* Bootstrap overrides */`. Nothing on the page uses it yet.
2. `index.html`: append the `<ol class="timeline …">` with the Tech6 entry after the `#experience` heading. Check the desktop and 375px layouts with one entry.
3. Add the remaining five entries in order, copying the Tech6 structure and filling in the section 3.2 table.
4. Run the manual checks (6.1) and static checks (6.2).

## 8. Out of scope

- Does not change the `#experience` `<section>` element, its classes or its `<h2>`, or any other section.
- Does not change `.skill-chip`, the theme variables, the global `a` / `strong` rules or any existing CSS rule; adds only its own block.
- Adds no links (Drapo, company sites), no pre-2005 roles, no JavaScript, no Bootstrap Icons and no images (see the design note on icons).
- Does not edit `my-resume.txt` (its wrong Pixeon dates and "Out 2026" are fixed separately, per the RFF note).
- Does not touch `CLAUDE.md`, `images/`, the `<head>`, the navbar or the footer.

## 9. Design notes

- **Defaults applied (user accepts recommended options):** the inferred Tech6 context line is used as written; Pixeon's thin-client and cost/reporting bullets are merged; only RFF §7.1 chips are shown (resume-only "Visual Studio", "Jira", "Git" are left out of the timeline); the timeline uses no Bootstrap Icon, a deviation from RFF §6 "Visual direction" (which lists the timeline among the places using icons) for the user to confirm.
- **No Bootstrap Icon in the timeline.** The green dot on the line is the per-role marker that the RFF §6 timeline note asks for ("a dot per role"). An icon inside a 1rem dot would be too small to read, and enlarging the dots to hold icons would crowd the line and the date column. The plan's behavior for this timeline lists no icon. Adding a second marker next to each heading would repeat the dot for no information gain. If the user wants an icon later, a decorative `<i class="bi bi-briefcase" aria-hidden="true"></i>` before the role text is the smallest change.
- **Heading "Role at Company" (the role title is the `h3`, as the plan asks).** Including the company in the heading makes the six headings unique for heading navigation and reads as natural language, with no separator characters for screen readers to pronounce. Rejected: role-only `h3` (three identical "Software Engineer" headings) and "Company · Role" (the middle dot is read aloud by some screen readers).
- **Date after the heading in the DOM, moved left by CSS.** Screen-reader and heading navigation hit the role first; from 768px absolute positioning places the date in its own column, so one markup serves both layouts without duplicating the date or reordering with CSS grid.
- **One geometry source.** All positions come from the `.timeline` custom properties; the 768px media query only changes `--timeline-axis` and the date's placement (DRY, no magic numbers).
- **Names in bullets use `fw-semibold`, not `strong`.** The global `strong` color equals the link color and links have no underline at rest, so green bold names would look clickable, which the RFF forbids for Drapo and T6-GPT.
- **Decorative line and dots.** They are not required to understand the content (the `<ol>` order and the dates carry it), so the brand green `#86af49` can be used for them despite its 2.4:1 contrast on the band. Text uses `--my-primary-text` or Bootstrap's secondary text color.
- **Trade-off: dot ring tied to the band color.** The ring uses `--bs-gray-100` because the timeline lives only inside `#experience`, whose band is that gray. If the timeline were placed on another background the ring would need a different color; that reuse is not planned (YAGNI).
- **Trade-off: line runs the full list height.** It continues a little past the last dot down to the end of the Pixeon entry; trimming it would need per-item segments for no real gain.
