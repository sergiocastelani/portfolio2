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
| S06 | Expertise cards and full toolbox replace the stock-image skills | pending | - |
| S07 | "What I bring" replaces Objectives | pending | - |
| S08 | Experience timeline with all six roles | pending | - |
| S09 | Professional highlight cards for Sysphera and Audaces | pending | - |
| S10 | Personal project cards with a "More projects" toggle | pending | - |
| S11 | Education and languages | pending | - |
| S12 | Updated architecture docs and final acceptance audit | pending | - |

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
| Bootstrap Icons 1.11.3 | CDN link | S01 | S06, S11 | Icons `<link>` line in `<head>` |
| `#footer-year` | element id | S03 | - | `<span>` in the footer copyright line, static "2026", set by the footer's own inline script |
| `.stat-tile` | CSS class | S05 | - | Inside `#about` only; white tile with Bootstrap border and `--bs-border-radius-lg` (`.about-summary`, `.stat-tile-icon`, `.stat-tile-number` stay private to S05) |
| `.expertise-card` | CSS class | S06 | - | Inside `#skills` only |
| `.value-item` | CSS class | S07 | - | Inside `#value` only |
| `.timeline`, `.timeline-item`, `.timeline-date` | CSS classes | S08 | - | Inside `#experience` only |
| `.highlight-card` | CSS class | S09 | - | Inside `#projects-professional` only |
| `#more-projects` | element id | S10 | S12 (docs) | Bootstrap collapse, starts closed |
| `#more-projects-toggle` | element id | S10 | - | Toggle button, label switched by its owner's script |
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
