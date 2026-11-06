# S06 - Expertise cards and full toolbox replace the stock-image skills

- **Plan:** [implementation-steps.md](implementation-steps.md)
- **Type:** Slice
- **Requirements covered:** FR-04, FR-05, FR-12 (stock images part); R-PERF (icons replace photos); acceptance criteria "Skills section has exactly 5 expertise cards ... followed by a grouped Full toolbox containing every skill from the resume", "No stock skill images remain in the repo or the page", "Given a 375px-wide viewport ... cards stack ... no horizontal scroll" (Expertise part)
- **Prerequisites:** `#skills` (section shell with `.section-alt` and `<h2 id="skills-heading">` "Expertise"; content is appended after the `<h2>`), `.skill-chip` (CSS class), `--my-primary` and `--my-primary-text` (CSS variables), Bootstrap Icons 1.11.3 CDN link, the existing `/* Bootstrap overrides */` comment in `index.css`, the existing legacy "Strongest Hard skills" `<section>` in `index.html`, the files `images/desktop.jpg`, `images/web-dev.jpeg`, `images/so.jpg`
- **Creates:** `.expertise-card` (CSS class). Private to this step: `.expertise-card-icon`, `.expertise-card-years`, `.toolbox-group` (CSS classes), `#toolbox-heading` (element id)

## 1. Goal

When this step is done:

- The Expertise section (`#skills`, gray band) shows exactly 5 white cards, in this order: Full-Stack Web, AI Agents, C++ & Performance, Computer Graphics & GPU, Medical Imaging. Each card shows a green Bootstrap Icon, a title, a years label in text green ("5+ years", "~2 years", "13+ years", "12+ years", "7 years"), a 1–2 line blurb and the tech chips from RFF §7.2. A green top border marks each card.
- Grid: 3 cards per row on lg and up (3 + 2, the second row centered), 2 per row on md (2 + 2 + 1, the last card centered), 1 per row below 768px. Cards in a row have equal height, and their chip lists line up at the bottom.
- Below the cards, a white "Full toolbox" card lists 46 skills as `.skill-chip` badges in 5 groups: Languages, Frameworks & Libraries, Databases, Tools & Platforms, Specialized. From 768px up, each group name sits in a narrow left column with its chips on the right. Below 768px, the name sits above its chips. Thin dividers separate the groups.
- The legacy "Strongest Hard skills" section is gone from the page, and `images/desktop.jpg`, `images/web-dev.jpeg` and `images/so.jpg` are deleted from the repo.
- The cards are not interactive: no links, no hover effect, no pointer cursor, nothing focusable.

## 2. Context

- `#skills` is an empty shell: `<section id="skills" class="page-section section-alt" aria-labelledby="skills-heading">` holding only its `<h2>`. Only content after the `<h2>` may be added. The `<section>` element, its classes and the `<h2>` must not change.
- The legacy section is the first `<section class="p-3 mt-5">` after the new section shells. It contains `<h2 ...>Strongest Hard skills</h2>` and three Bootstrap `card`s with `<img>` stock photos and plain `<ul>` lists. No CSS rule targets it, so deleting it needs no CSS change.
- `.skill-chip` is used as `<span class="badge skill-chip">Tech</span>`, usually inside a `d-flex flex-wrap gap-2` wrapper. Its text color (`--my-primary-text` on `#edf3e4`) passes 5.17:1.
- Conventions: Bootstrap utilities first, small variable-driven custom CSS, no Bootstrap blue. Each step adds one comment-headed CSS block before `/* Bootstrap overrides */` and never edits another block. Project cards and other repeated blocks are hard-coded HTML, copy-pasted (no templating, no JS).
- Heading levels: section `h2`, so card titles and the "Full toolbox" title are `h3`, and toolbox group names are `h4`.
- Content source: RFF §7.2 for the cards (years confirmed by the user, blurbs used as written per the "Copy approval" default, the inferred chips "Profiling" and "LLM integration" kept). `my-resume.txt` for the toolbox ("Technical Skills" plus the "Technologies" lists of the experience entries).
- There is no test suite. Verification is manual in a browser, plus `git grep` static checks.

## 3. Structure

### 3.1 Files

| File | Change | Responsibility |
|------|--------|----------------|
| `index.html` | modify | Expertise cards and Full toolbox inside `#skills` after its `<h2>`; delete the legacy "Strongest Hard skills" `<section>` |
| `index.css` | modify | New `/* Expertise */` block before `/* Bootstrap overrides */` |
| `images/desktop.jpg` | delete | Stock photo, no longer used |
| `images/web-dev.jpeg` | delete | Stock photo, no longer used |
| `images/so.jpg` | delete | Stock photo, no longer used |

### 3.2 Markup (`index.html`)

**a) Expertise cards.** Insert directly after `<h2 id="skills-heading" ...>Expertise</h2>`, inside `#skills`:

```html
<div class="row g-4 justify-content-center">

  <div class="col-12 col-md-6 col-lg-4">
    <div class="card h-100 expertise-card">
      <div class="card-body d-flex flex-column">
        <i class="bi bi-window-stack expertise-card-icon mb-3" aria-hidden="true"></i>
        <h3 class="h5 card-title fw-bold">Full-Stack Web</h3>
        <p class="expertise-card-years small fw-semibold mb-2">5+ years</p>
        <p class="card-text">End-to-end SPAs and APIs for enterprise analytics and real-estate platforms, from database to UI.</p>
        <ul class="list-unstyled d-flex flex-wrap gap-2 mt-auto mb-0">
          <li><span class="badge skill-chip">C#</span></li>
          <li><span class="badge skill-chip">ASP.NET</span></li>
          <!-- one <li> per chip, in the order of the table below -->
        </ul>
      </div>
    </div>
  </div>

  <!-- four more cards with the same structure -->

</div>
```

The five cards, in this order (chips in the order listed; `&` is written `&amp;` in HTML):

| # | Icon class | Title (`h3`) | Years label | Blurb | Chips |
|---|-----------|--------------|-------------|-------|-------|
| 1 | `bi-window-stack` | Full-Stack Web | 5+ years | End-to-end SPAs and APIs for enterprise analytics and real-estate platforms, from database to UI. | C#, ASP.NET, TypeScript, React, Redux, Node.js, Express, SQL Server, PostgreSQL, Azure, Docker |
| 2 | `bi-robot` | AI Agents | ~2 years (see below) | Built T6-GPT, an AI assistant that operates a BI platform and turns data into insights. | Microsoft Agent Framework, LLM integration, Python, GitHub Copilot / Codex / Claude |
| 3 | `bi-cpu` | C++ & Performance | 13+ years | High-performance native systems for CAD, fashion 3D and medical imaging, with a focus on removing bottlenecks. | C/C++, Boost, Qt, Multithreading, Visual Studio, Profiling |
| 4 | `bi-badge-3d` | Computer Graphics & GPU | 12+ years | Graphics engines, real-time cloth simulation and 3D medical rendering. | OpenGL, CUDA, WebGL, Three.js, Unity, Real-time simulation |
| 5 | `bi-heart-pulse` | Medical Imaging | 7 years | Radiology thin-client systems and 3D visualization at Pixeon. | DICOM, 3D rendering, Thin-client architecture, Pipeline processing |

- "GitHub Copilot / Codex / Claude" is one chip, as in RFF §7.2.
- **AI Agents years label.** Screen readers read "~" as "tilde", so the label hides the symbol and adds hidden words. The visible text stays "~2 years":

  ```html
  <p class="expertise-card-years small fw-semibold mb-2"><span aria-hidden="true">~</span><span class="visually-hidden">About </span>2 years</p>
  ```

- Grid: `col-12 col-md-6 col-lg-4` gives 1 / 2 / 3 per row. `justify-content-center` on the `row` centers the incomplete last row (2 cards on lg, 1 card on md). `g-4` sets 1.5rem gutters.
- Equal height: `h-100` on the card and `d-flex flex-column` on the body. `mt-auto` pushes the chip list to the bottom so chip rows line up across a row of cards.
- Chips are a `<ul>` of `<li>`s, so screen readers announce "list, N items". `list-unstyled` removes bullets and the left padding.
- The icon is decorative (`aria-hidden="true"`): the title carries the meaning.
- No `<img>`, no link, no `tabindex`, no `onclick`: the cards are static content.

**b) Full toolbox.** Insert directly after the cards' `row` `</div>`, still inside `#skills`:

```html
<div class="card mt-5">
  <div class="card-body p-4">
    <h3 id="toolbox-heading" class="h5 fw-bold mb-4">Full toolbox</h3>

    <div class="toolbox-group row g-2">
      <div class="col-12 col-md-3">
        <h4 class="h6 text-uppercase text-body-secondary fw-semibold mb-0">Languages</h4>
      </div>
      <div class="col-12 col-md-9">
        <ul class="list-unstyled d-flex flex-wrap gap-2 mb-0">
          <li><span class="badge skill-chip">C#</span></li>
          <!-- one <li> per item, in the order of the table below -->
        </ul>
      </div>
    </div>

    <!-- four more .toolbox-group blocks with the same structure -->

  </div>
</div>
```

The five groups, in this order (items in the order listed; written exactly as shown):

| # | Group (`h4`) | Items | Count |
|---|--------------|-------|-------|
| 1 | Languages | C#, JavaScript / TypeScript, PHP, Python, HTML / CSS, C / C++, Java, Assembly | 8 |
| 2 | Frameworks & Libraries | ASP.NET, Microsoft Agent Framework, React, Redux, Qt, Boost, Bootstrap, Express, Node.js, Unity, Three.js, WebGL | 12 |
| 3 | Databases | PostgreSQL, SQL Server, MySQL, NoSQL | 4 |
| 4 | Tools & Platforms | Visual Studio, VS Code, Git, Docker, Azure, GitHub Copilot CLI, Codex, Claude, AWS, Jenkins, Jira | 12 |
| 5 | Specialized | Fullstack web development, Computer Graphics, OpenGL, CUDA, Multithreading, DICOM / Medical Imaging, VoIP / SIP, Real-Time Systems, TCP/IP, iOS | 10 |

Total: 46 chips, each item exactly once.

How the list was built (this is the verification source for the toolbox):

- Each resume "Technical Skills" item keeps its resume wording, in resume order, in the matching group (Programming Languages → Languages, Specialized Areas → Specialized). The resume bullet "GitHub Copilot CLI, Codex, Claude" becomes three chips.
- Technologies that appear only in the resume's experience entries are appended to the closest group: Java, Assembly → Languages; Node.js, Unity, Three.js, WebGL (named in the experience text and the expertise cards) → Frameworks & Libraries; Visual Studio, AWS, Jenkins, Jira → Tools & Platforms; TCP/IP, iOS → Specialized.
- Experience technologies already covered by a combined chip are not repeated: TypeScript → "JavaScript / TypeScript", C++ → "C / C++", HTML and CSS → "HTML / CSS", SIP and VoIP → "VoIP / SIP", DICOM → "DICOM / Medical Imaging".
- Legacy items not in the resume (Windows, Linux, macOS) are dropped.
- Card-only chips that describe practices rather than named technologies (LLM integration, Profiling, Real-time simulation, 3D rendering, Thin-client architecture, Pipeline processing) stay on the cards only.

- The group name column is `col-md-3` from 768px up. Below 768px both columns are `col-12`, so the name sits above the chips.
- The `ul` sits inside a `col-*` `div`, not on the column itself: Bootstrap's `.row > *` gutter padding would otherwise fight with `list-unstyled`'s `padding-left: 0`.
- `#toolbox-heading` is the only new id. It is a hook for the static checks and for screen reader heading navigation.

**c) Delete the legacy section.** Remove the whole `<section class="p-3 mt-5">` element whose `<h2>` reads "Strongest Hard skills", from its opening tag to its `</section>` (the three image cards included). Do not touch the "Objectives" and "Showcase" sections that follow it.

### 3.3 Styles (`index.css`)

Add this block immediately before `/* Bootstrap overrides */` (after any other section blocks already there; do not edit them):

```css
/* Expertise */
.expertise-card {
  border-top: 0.25rem solid var(--my-primary);   /* brand accent on the white card */
}

.expertise-card-icon {
  font-size: 2rem;
  line-height: 1;
  color: var(--my-primary);                       /* decorative fill color (aria-hidden) */
}

.expertise-card-years {
  color: var(--my-primary-text);                  /* text green: 5.85:1 on the white card */
}

.toolbox-group + .toolbox-group {
  border-top: var(--bs-border-width) solid var(--bs-border-color);
  margin-top: 1rem;     /* replaces the row's -0.5rem gutter margin: 1rem gap above the divider */
  padding-top: 0.5rem;  /* the row's 0.5rem column gutter completes the 1rem gap below the divider */
}
```

What each rule does:

- **`.expertise-card`**: overrides only the top side of Bootstrap's card border with a 4px brand-green accent. It loads after Bootstrap with equal specificity, so it wins. The other sides and the card radius stay Bootstrap's. No hover or cursor rule, so the card does not look clickable.
- **`.expertise-card-icon`**: a 2rem icon in the fill green. The icon is `aria-hidden`, so text contrast rules do not apply. `line-height: 1` stops the icon glyph from adding extra vertical space.
- **`.expertise-card-years`**: the years label in the accessible text green. Size and weight come from the `small fw-semibold` utilities.
- **`.toolbox-group + .toolbox-group`**: a thin divider between groups, none above the first, with an even 1rem gap on each side of it. It uses Bootstrap's border variables, so it matches the card border. The spacing accounts for `.toolbox-group` sitting on the `row g-2` element. Bootstrap gives that row `margin-top: calc(-1 * var(--bs-gutter-y))` (-0.5rem) and each of its columns `margin-top: var(--bs-gutter-y)` (+0.5rem). This rule (specificity 0,2,0) replaces the row's -0.5rem with `margin-top: 1rem`, which gives 1rem above the divider. Below it, `padding-top: 0.5rem` plus the columns' own +0.5rem make 1rem. The first group keeps the row's -0.5rem margin, which cancels its columns' +0.5rem, so it starts flush with the content above it.

No media query is needed: the grid and the toolbox columns respond through Bootstrap classes.

## 4. Logic flows

None. The step adds static markup and styles, with no script and no state.

## 5. Edge cases and errors

| Case | Expected behavior |
|------|-------------------|
| Bootstrap Icons CDN fails | The icons do not render (empty, `aria-hidden`). Titles, years, blurbs and chips stay visible. The layout does not break. |
| Bootstrap bundle (JS) fails or JS is disabled | No effect: the section uses no JavaScript. |
| Bootstrap CSS fails | Content stays readable as plain headings, paragraphs and lists, in source order. |
| 375px viewport | One card per row, the toolbox group names sit above their chips, chips wrap, and there is no horizontal scroll. The longest chip ("GitHub Copilot / Codex / Claude", about 216px) fits in the card body (about 253px). |
| Viewport narrower than about 340px | `.badge` uses `white-space: nowrap`, so the longest card chip may stick out of its card and cause a small horizontal scroll. Accepted, as elsewhere on the page: the RFF targets 375px and up. |
| md viewport (768px–991px) | 2 + 2 + 1 cards, the fifth card centered. |
| lg viewport (992px and up) | 3 + 2 cards, the second row centered. |
| Cards with different blurb or chip lengths | All cards in a row have the same height, and their chip lists line up at the bottom. |
| Hover or Tab over a card | Nothing happens: no pointer cursor, no hover effect, no focus stop. Tab skips the section entirely (no focusable element). |
| Screen reader on "~2 years" | Reads "About 2 years". |
| Legacy sections below | "Objectives" and "Showcase" still render, unchanged. |

## 6. Tests

No automated suite exists, and this step does not add one.

### 6.1 Manual

Serve the folder (`npx serve .` or `python -m http.server`) and open it in Chrome or Edge.

1. Given a 1366×768 viewport, when you scroll to Expertise, then exactly 5 cards appear in a 3 + 2 layout with the second row centered, in the order Full-Stack Web, AI Agents, C++ & Performance, Computer Graphics & GPU, Medical Imaging. Each card shows its icon, title, years label ("5+ years", "~2 years", "13+ years", "12+ years", "7 years"), blurb and chips exactly as in the table in 3.2 a (compare against RFF §7.2). (FR-04; acceptance criterion "exactly 5 expertise cards")
2. Given the same viewport, then cards in the same row have equal height and their chip rows start at the same height at the bottom, each card has a green top border, and the cards stand out white on the gray band. (FR-04; RFF §6 expertise cards)
3. Given an 800px viewport, then cards show 2 per row (2 + 2 + 1, the last one centered). Given a 375px viewport, then cards show 1 per row, and `document.documentElement.scrollWidth === document.documentElement.clientWidth` in the console returns `true`. (FR-04 grid; 375px acceptance criterion)
4. Given the "Full toolbox" card, then it follows the expertise cards and shows the groups Languages, Frameworks & Libraries, Databases, Tools & Platforms, Specialized in that order, with dividers between them. At 1366px each group name is on the left of its chips; at 375px each name is above its chips. In DevTools, the distance from the bottom of a group's chips to the divider below it is 16px, and from that divider to the top of the next group's name is also 16px. (FR-05)
5. Given the console, when you run the snippet below, then it prints `[] [] true 46`: no expected item is missing, no unexpected chip exists, no chip is duplicated, and the count is 46. Then compare the "Technical Skills" section and every "Technologies:" line of `my-resume.txt` against the table in 3.2 b and the coverage rules under it: every item is present in its group. (FR-05; acceptance criterion "Full toolbox containing every skill from the resume")

   ```js
   const expected = ['C#','JavaScript / TypeScript','PHP','Python','HTML / CSS','C / C++','Java','Assembly',
     'ASP.NET','Microsoft Agent Framework','React','Redux','Qt','Boost','Bootstrap','Express','Node.js','Unity','Three.js','WebGL',
     'PostgreSQL','SQL Server','MySQL','NoSQL',
     'Visual Studio','VS Code','Git','Docker','Azure','GitHub Copilot CLI','Codex','Claude','AWS','Jenkins','Jira',
     'Fullstack web development','Computer Graphics','OpenGL','CUDA','Multithreading','DICOM / Medical Imaging','VoIP / SIP','Real-Time Systems','TCP/IP','iOS'];
   const chips = [...document.querySelectorAll('#skills .toolbox-group .skill-chip')].map(c => c.textContent.trim());
   console.log(expected.filter(e => !chips.includes(e)), chips.filter(c => !expected.includes(c)), chips.length === new Set(chips).size, chips.length);
   ```

6. Given DevTools, when you inspect a years label, then its color is `rgb(79, 110, 36)` and the contrast picker reports at least 4.5:1 on the white card. When you inspect a toolbox group name, then the contrast picker reports at least 4.5:1. (R-A11Y contrast)
7. Given the page, when you hover over a card, then the cursor stays the default arrow and nothing changes. When you press Tab from the navbar onward, then no element inside `#skills` receives focus. (Cards are static content)
8. Given the DevTools Accessibility tree, then the five card titles and "Full toolbox" are `h3`, the five group names are `h4`, each chip list is a list with the right item count, the icons are not exposed, and the AI Agents years label's accessible text is "About 2 years". (R-A11Y heading hierarchy)
9. Given the page, then no "Strongest Hard skills" heading and no stock photo appears anywhere, and the "Objectives" and "Showcase" sections below still render as before. Given the DevTools Network tab on reload, then no request is made for `desktop.jpg`, `web-dev.jpeg` or `so.jpg`. (FR-12; acceptance criterion "no stock skill images remain"; R-PERF)
10. Given DevTools with the `bootstrap-icons.css` request blocked, when you reload, then the cards still show title, years, blurb and chips, without layout breakage. (Edge case: Icons CDN fails)

### 6.2 Static checks

Run from the repo root:

- `git grep -c 'class="card h-100 expertise-card"' index.html` → `index.html:5`. (FR-04)
- `git grep -c 'class="toolbox-group row g-2"' index.html` → `index.html:5`. (FR-05)
- `git grep -n 'id="toolbox-heading"' index.html` → one line. (FR-05)
- `git grep -n "bi-window-stack\|bi-robot\|bi-badge-3d\|bi-heart-pulse" index.html` → four lines, one per icon, inside `#skills`; `git grep -n "bi bi-cpu expertise-card-icon" index.html` → one line. (FR-04 icons)
- `git grep -n "Strongest Hard skills" -- index.html index.css` → nothing. (FR-12, legacy section removed)
- `git grep -n "desktop.jpg\|web-dev.jpeg\|so.jpg" -- . ":!request-for-feature.md" ":!.rff"` → nothing. The RFF and the plan files name the images on purpose, so they are excluded. (FR-12)
- `git ls-files images/desktop.jpg images/web-dev.jpeg images/so.jpg` → nothing, and `ls images` lists none of the three files. (FR-12)
- `git grep -n "card-img-top" index.html` → nothing (only the legacy cards used it).
- `git grep -n "/\* Expertise \*/\|/\* Bootstrap overrides \*/" index.css` → the "Expertise" line comes before the "Bootstrap overrides" line. (CSS ownership rule)

## 7. Implementation order

1. `index.css`: add the `/* Expertise */` block before `/* Bootstrap overrides */`. Nothing visible changes yet.
2. `index.html`: insert the cards `row` after the `#skills` `<h2>`. Check manual tests 1–3 and 7.
3. `index.html`: insert the Full toolbox card after the cards. Check manual tests 4–6 and 8.
4. `index.html`: delete the legacy "Strongest Hard skills" `<section>`. The page still renders "Objectives" and "Showcase" below.
5. Delete the images with `git rm images/desktop.jpg images/web-dev.jpeg images/so.jpg`.
6. Run manual tests 9–10 and all static checks (6.2).

## 8. Out of scope

- Does not change the `#skills` `<section>` element, its classes or its `<h2>`, and adds nothing outside `#skills` apart from deleting the legacy "Strongest Hard skills" section.
- Does not change `.skill-chip`, `--my-primary`, `--my-primary-text`, the `a` / `strong` rules or any other CSS block; adds only the `/* Expertise */` block.
- Does not touch the "Objectives" or "Showcase" sections, the hero, the navbar, the footer, `<head>`, `CLAUDE.md`, `my-resume.txt` or any image other than the three stock photos.
- Adds no "Real-Time & VoIP" card (dropped by the user, RFF decision 9), no skill levels or progress bars, and no JavaScript.

## 9. Design notes

- **Defaults applied (user accepts all recommended options):** blurbs from RFF §7.2 used as written; inferred chips "Profiling" and "LLM integration" kept; "GitHub Copilot / Codex / Claude" kept as one card chip, as written in §7.2.
- **Resume wording kept in the toolbox** ("Fullstack web development", "C / C++", "VoIP / SIP"), even where a card writes the same thing differently ("C/C++"). The toolbox is the keyword mirror of the resume, and exact wording makes the completeness check mechanical.
- **Years label below the title, not in a corner.** The DOM order matches the visual order (icon, title, years, blurb, chips), so a screen reader jumping to the title hears the years right after it.
- **Hidden "About" for "~2 years".** It is a one-line fix for a "tilde" announcement while keeping the plan's visible text. Alternative rejected: writing "About 2 years" visibly, which breaks the compact "N+ years" pattern.
- **Group names as `h4` with Bootstrap utilities.** They keep the heading hierarchy (section `h2` → "Full toolbox" `h3` → group `h4`) and need no custom CSS. `--bs-secondary-color` text passes 4.5:1 on white. A `<dl>` was rejected: heading navigation across 5 groups is more useful than a definition list.
- **Copy-pasted card markup (no JS templating).** It follows the project's convention for repeated blocks (static HTML, no build). The data tables in 3.2 are the single source the markup is built from.
- **Group divider spacing tuned to the row gutter.** `.toolbox-group` stays on the `row g-2` element, so there is no extra wrapper `<div>`. The divider rule's margin and padding are set so that, combined with Bootstrap's gutter margins on the row and its columns, the gap is an even 1rem above and below the divider. Alternative rejected: a plain wrapper `<div class="toolbox-group">` around the row. It would separate the spacing from the gutter, but it adds a nesting level to each of the five groups.
- **Minimal custom CSS (four rules).** Layout, spacing, typography and the grid all come from Bootstrap utilities. Custom rules exist only where a brand color or the group divider is needed, and every color comes from a variable.
- **No hover effect on cards.** The cards are not links, so lift or shadow effects on hover would suggest a click target that does not exist.
- **Trade-off: chip overflow below about 340px.** `.badge` does not wrap, so the longest card chip can overflow at very narrow widths. Making chips wrap would mean changing `.skill-chip`, which this step does not own, and the RFF targets 375px and up.
