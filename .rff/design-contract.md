# Design Contract: Recruiter-Ready Portfolio Refresh

- **Plan:** [implementation-steps.md](implementation-steps.md)
- **Updated:** 2026-11-06

## 1. Step status
| Step | Title | Status | File |
|------|-------|--------|------|
| S01 | Page shell with sticky navigation and section anchors | approved | [step-01.md](step-01.md) |
| S02 | Hero presents the senior full-stack profile above the fold | approved | [step-02.md](step-02.md) |
| S03 | Footer with automatic year and social icons | approved | [step-03.md](step-03.md) |
| S04 | Search and link-preview metadata | approved | [step-04.md](step-04.md) |
| S05 | About section with summary and key-numbers strip | approved | [step-05.md](step-05.md) |
| S06 | Expertise cards and full toolbox replace the stock-image skills | approved | [step-06.md](step-06.md) |
| S07 | "What I bring" replaces Objectives | approved | [step-07.md](step-07.md) |
| S08 | Experience timeline with all six roles | approved | [step-08.md](step-08.md) |
| S09 | Professional highlight cards for Sysphera and Audaces | approved | [step-09.md](step-09.md) |
| S10 | Personal project cards with a "More projects" toggle | approved | [step-10.md](step-10.md) |
| S11 | Education and languages | approved | [step-11.md](step-11.md) |
| S12 | Updated architecture docs and final acceptance audit | approved | [step-12.md](step-12.md) |

Status: pending | draft | approved

## 2. Shared items
Names that cross steps: element ids, CSS classes and variables, data attributes, JS functions, shared script or style regions.

| Item | Kind | Created by | Used / extended by | Notes |
|------|------|-----------|--------------------|-------|
| `#main-nav` | element id | S01 | S12 (docs) | Sticky navbar before `<main>`; brand links to `#profile`; links to `#about`, `#skills`, `#experience`, `#projects`, `#education` |
| `#about` | element id | S01 | S05 | Section shell, `<h2 id="about-heading">` "About"; others append after the `<h2>` only |
| `#skills` | element id | S01 | S06 | Section shell (`.section-alt`), `<h2>` "Expertise" |
| `#value` | element id | S01 | S07 | Section shell, `<h2>` "What I bring" |
| `#experience` | element id | S01 | S08 | Section shell (`.section-alt`), `<h2>` "Experience" |
| `#projects` | element id | S01 | S09, S10 | Section shell, `<h2>` "Featured Work", holds the two containers below |
| `#projects-professional` | element id | S01 | S09 | Empty `<div>` in `#projects`, filled entirely by its owner |
| `#projects-personal` | element id | S01 | S10 | Empty `<div>` in `#projects`, after `#projects-professional` |
| `#education` | element id | S01 | S11 | Section shell (`.section-alt`), `<h2>` "Education & Languages" |
| `.page-section` | CSS class | S01 | S12 (docs) | Section vertical padding; applied by S01 only |
| `.section-alt` | CSS class | S01 | S12 (docs) | `--bs-gray-100` band; applied by S01 only |
| `section[id]` scroll offset | CSS rule | S01 | all sections | `scroll-margin-top: calc(navbar height + 1rem)`; smooth scroll unless `prefers-reduced-motion` |
| `--my-primary-text` | CSS variable | S01 | S05, S06, S07, S08, S11 | Text green `#4f6e24` (5.85:1 on white, 5.55:1 on `--bs-gray-100`); `--my-primary` stays the fill/accent color |
| `.skill-chip` | CSS class | S01 | S06, S08, S09 | `<span class="badge skill-chip">` light-green tint chip (`#edf3e4` bg, `--my-primary-text` text, Bootstrap badge radius) |
| Bootstrap Icons 1.11.3 | CDN link | S01 | S06, S07, S09, S11 | Icons `<link>` line in `<head>` |
| `#footer-year` | element id | S03 | - | `<span>` in the footer copyright line, static "2026", set by the footer's own inline script |
| `.stat-tile` | CSS class | S05 | - | Inside `#about` only; white tile with Bootstrap border and `--bs-border-radius-lg` (`.about-summary`, `.stat-tile-icon`, `.stat-tile-number` stay private to S05) |
| `.expertise-card` | CSS class | S06 | - | Inside `#skills` only (`.expertise-card-icon`, `.expertise-card-years`, `.toolbox-group`, `#toolbox-heading` stay private to S06) |
| `.value-item` | CSS class | S07 | - | Inside `#value` only (`.value-item-icon` stays private to S07) |
| `.timeline`, `.timeline-item`, `.timeline-date` | CSS classes | S08 | - | Inside `#experience` only (`.timeline-company` and `--timeline-*` custom properties stay private to S08) |
| `.highlight-card` | CSS class | S09 | - | Inside `#projects-professional` only (`.highlight-card-icon`, `#projects-professional-heading` stay private to S09) |
| `#more-projects` | element id | S10 | S12 (docs) | Bootstrap collapse, starts closed; placed after the toggle inside `#projects-personal` |
| `#more-projects-toggle` | element id | S10 | - | Green outline toggle button ("Show more projects" / "Show fewer projects"), label switched by its owner's script |
| `#profile`, `#profile-img`, `.social-btn` | existing ids / class | existing code | S02 | Hero markup and styles |
| `.project-card-img`, `.project-img-overlay`, 768px media query | existing CSS | existing code | S10 (only editor) | Clickable screenshot card pattern |
| Legacy "Strongest Hard skills" / "Objectives" / "Showcase" sections, `#objectives-list` CSS | existing markup / CSS | existing code | removed by S06 / S07 / S10 | Untouched until removed by their owner |
| CSS section blocks | style region convention | plan §2 | all styling steps | One comment-headed block per step, inserted before `/* Bootstrap overrides */` |

## 3. Decisions
Decisions approved during a step's review, each about that step's own work only.
- (S01) Navbar brand shows the full name "Sérgio C. Castelani Jr." from 576px (`sm`) up and the initials "SCCJ" below; its accessible name is "Sérgio C. Castelani Jr. (SCCJ)" at every width.
- (S01) Below 320px wide (or at large zoom) the navbar may wrap and partly cover a heading after a link click; accepted (the RFF targets 375px and up).
- (S01) Navbar links and brand show only a color change on hover, no underline.
- (S01) In the open mobile menu, a link click closes the menu first and then replays the click as a native anchor navigation (also re-scrolls when the same link is used twice).
- (S01) A brief link flicker when the mobile menu is left open and the viewport is widened past 768px is accepted.
- (S01) `<main>` uses `container-lg p-3 p-md-5 pb-0 pb-md-0` (no bottom padding at any width).
- (S01) Remaining review issues after 3 automatic rounds were fixed at the user's request and approved without a further review round.
- (S02) Hero tagline used as written: "Full-stack engineer (C#/.NET, TypeScript, React) with 27 years of experience, from C++ graphics engines to AI agents."
- (S02) Hero social buttons' accessible names are exactly "LinkedIn", "GitHub", "Email" (no "opens in a new tab" hint); LinkedIn/GitHub open in a new tab, Email does not.
- (S02) `images/photo2.png` (1.5 MB) is not resized in the hero work.
- (S03) Footer icon links are gray (`--bs-secondary-color`) at rest and brand green (`--my-secondary`) on hover, no underline.
- (S03) Footer year comes from the visitor's device clock (`new Date().getFullYear()`), not clamped; static "2026" is the no-JS fallback.
- (S04) Meta description used as written (also for `og:description` and `twitter:description`): "Senior Software Engineer with 27 years of experience: full-stack C#/.NET, TypeScript and React, AI agents, and deep C++ and computer graphics expertise."
- (S04) Extra tags kept beyond the plan's minimum: `og:image:width`/`og:image:height` (1069), `og:image:alt` and `twitter:image:alt` ("Portrait of Sérgio C. Castelani Jr.").
- (S04) `twitter:card=summary` (square photo); `images/photo2.png` used as is for the preview image.
- (S04) A cross-domain canonical warning in a localhost Lighthouse run is expected and accepted; the canonical audit is checked after deployment.
- (S05) Summary copy from RFF §7.3 used as written; tile icons `bi-calendar-check`, `bi-building`, `bi-briefcase`, `bi-cpu`.
- (S05) Label "yrs C++" kept exactly as written (no expansion or visually hidden text).
- (S05) Tiles are white with a border on the white About section (no tint or gray fill).
- (S05) Screen readers in browse mode may announce a tile's number and label as two lines within the same list item; accepted.
- (S05) Approved without user questions: the user accepted all recommended options for this run.
- (S06) "Visual Studio" (resume, Graebert) added to the toolbox under Tools & Platforms so every experience technology appears once; toolbox keeps the resume's exact wording (46 chips).
- (S06) Card chip "GitHub Copilot / Codex / Claude" stays one chip as in RFF §7.2 (split into three chips in the toolbox); inferred chips "Profiling" and "LLM integration" kept; card blurbs used as written.
- (S06) "~2 years" is read by screen readers as "About 2 years" (visually hidden text, "~" hidden).
- (S06) Toolbox group spacing: `.toolbox-group + .toolbox-group { margin-top: 1rem; padding-top: 0.5rem; }` for even 1rem gaps around each divider.
- (S06) Below ~340px the longest card chip may overflow its card; accepted (RFF targets 375px+).
- (S06) Approved without user questions: the user accepted all recommended options for this run.
- (S07) Statements laid out as `<ul class="row row-cols-1 row-cols-md-2 g-4 list-unstyled">` of `<li class="col value-item">`; lead-ins are `<h3 class="h5 fw-bold">` headings (trailing period dropped), RFF §7.4 sentences used as written.
- (S07) Items are plain (no card/border/background); only the icons are green (`--my-primary-text`), headings use body text color.
- (S07) Legacy "Objectives" section and `#objectives-list` rules deleted after the new content is in; leftover check is case-insensitive.
- (S07) Approved without user questions: the user accepted all recommended options for this run.
- (S08) Timeline is `<ol class="timeline list-unstyled" role="list">`; each role heading is an `h3` "Role at Company"; chip lists are `<ul role="list" aria-label="Technologies used at {Company}">`.
- (S08) Content from RFF §7.1 exactly (Tech6 context line as written); Pixeon's thin-client and cost/reporting bullets merged (4 bullets); resume-only tools not shown as chips.
- (S08) Project names in bullets use `fw-semibold`, not `strong` (avoids link-green look).
- (S08) No Bootstrap Icons in the timeline (green dots are the per-role marker); deviation from RFF §6 accepted.
- (S08) Approved without user questions: the user accepted all recommended options for this run.
- (S09) `#projects-professional` holds an `h3` "Professional highlights" and two `<article class="card h-100 highlight-card">` in `row row-cols-1 row-cols-lg-2 g-4 mb-5`; card titles are `h4` naming the article via `aria-labelledby`.
- (S09) RFF §7.5 copy used as written (including "SPA"); icons `bi-bar-chart-line` (Sysphera) and `bi-badge-vr` (Audaces), decorative, in `--my-primary`.
- (S09) Cards are non-interactive by construction (no links, tabindex, onclick, hover/cursor CSS); no explicit `cursor: default`.
- (S09) Approved without user questions: the user accepted all recommended options for this run.
- (S10) `#projects-personal`: `h3` "Personal projects" (`h4 fw-bold mb-4`), featured `row g-3` (GrowTweet, 3D Viewer, Bat-Flappy; 2 + 1 on lg), then the toggle, then `#more-projects` (5 demos).
- (S10) Screenshot divs get `role="link" tabindex="0" aria-label="<Title> live demo"`, overlay `aria-hidden`; Enter handled by one delegated `keydown` listener calling `click()` (inline `onclick` stays the single URL source); card titles become `h4.card-title.h5`.
- (S10) Project-card CSS rules stay in place, become the `/* Personal projects */` block; overlay also shows on `:focus-visible`; toggle is a green outline button using `--my-primary-text` (white on green on hover/active).
- (S10) Copy changes limited to: typo fixes, `&amp;` escaping, `rel="noopener"`, dropping GrowTweet's trailing `<br/>`, trimming Bat-Flappy's trailing space; no "opens in a new tab" hint on source links.
- (S10) Approved without user questions: the user accepted all recommended options for this run.
- (S11) `#education` content: `row row-cols-1 row-cols-md-2 g-4`, two `h3.h4` subheadings ("Education", "Languages") with decorative `bi-mortarboard` / `bi-translate` icons, and `<ul class="list-unstyled" role="list">` lists with `fw-semibold` labels.
- (S11) Short institution name "UFSC" (FR-09 wording); no `<abbr>`, cards or borders; one private rule `.education-icon` in `--my-primary-text`.
- (S11) Approved without user questions: the user accepted all recommended options for this run.
- (S12) `CLAUDE.md` keeps title, Overview and the CDN bullet; the rest of Architecture is replaced with bullets describing the code as built (code names win over planned text; any difference is recorded as a finding).
- (S12) `.rff/acceptance-report.md` records AC-01..AC-11 (RFF §10), Lighthouse mobile/desktop (Incognito, median of up to 3 runs, desktop 1366×768) and supplementary checks SC-01..SC-10; the audit never edits page files.
- (S12) SEO < 90 caused only by the localhost canonical warning is recorded as Pending until re-run on the deployed URL; `loading="lazy"` counts as met (only `<img>` is the above-the-fold hero photo).
- (S12) Approved without user questions: the user accepted all recommended options for this run.
