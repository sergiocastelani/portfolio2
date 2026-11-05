# Feature Request: Recruiter-Ready Portfolio Refresh

- **Date:** 2026-11-05
- **Source:** `C:\Users\sgcas\Downloads\Simple Resume.txt` + grill-me session
- **Status:** Ready for implementation (minor open questions with defaults)

## 1. Summary

Rework the single-page portfolio (`index.html` + `index.css`) so that it reflects Sérgio's current resume: a Senior Software Engineer with 27 years of experience. The page should present him mainly as a **Senior Full-Stack engineer (.NET / TypeScript)**, with deep C++/graphics expertise as a differentiator. Today the page undersells him. It says "20+ years… deepening skills at Growdev", shows three generic skill cards with stock photos, has a career-changer "Objectives" section, and lists only course demos. The new page follows a classic resume flow that a recruiter can scan quickly: hero, About with key numbers, expertise cards, experience timeline, featured work, and education and languages.

## 2. Problem and goals

**Problem**
- The content is out of date and does not match the resume. None of the six professional roles appears.
- Skills are generic lists (Windows, Linux, HTML…) with no context, depth, or years of use.
- The "Objectives" section reads as personal aspirations, not value to an employer.
- The Showcase has only small course projects, and some of them have typos.

**Goals / success criteria**
- A recruiter can find role, seniority, years of experience, core stack, and current or last employer within about 10 seconds above the fold.
- Every job, date, and technology on the page matches the corrected resume data in section 7.
- The page looks modern and polished while keeping the existing brand green (`#86af49`) and the Bootstrap 5.3 CDN stack. There is still no build step.
- The page is fully responsive (mobile, tablet, desktop), and Lighthouse Accessibility and SEO scores are 90 or higher.

**Non-goals**
- No "Open to work" badge, no CV/PDF download, and no dedicated email CTA button or contact section.
- No Portuguese version or language toggle. The page stays in English only.
- No pre-2012 roles, even though the hero says 27 years.
- No framework, bundler, or package manager.
- No dark theme or full redesign.

## 3. Users and use cases

- As a **technical recruiter**, I want to see role, seniority, and core stack at a glance so I can decide quickly whether to shortlist.
- As a **hiring manager**, I want to see concrete projects, the technologies used, and the impact so I can judge depth.
- As a **recruiter on mobile** opening a LinkedIn link, I want the page to load fast and read well on a phone.
- As **anyone sharing the link** on LinkedIn or Slack, I want a professional link preview (title, description, photo).

## 4. Functional requirements

- **FR-01** Add a sticky top navbar with the name or initials on the left and anchor links: About, Skills, Experience, Projects, Education. It collapses to a hamburger menu on small screens (Bootstrap navbar). Links scroll smoothly to the sections.
- **FR-02** Hero section (`#profile`): name, the title "Senior Software Engineer", a one-line tagline for full-stack .NET/TypeScript with 27 years of experience, the current photo (`images/photo2.png`), and the existing LinkedIn, GitHub, and email icon buttons.
- **FR-03** About section (`#about`): a short professional summary based on the resume, plus a **key-numbers strip** with 4 stat tiles: `27 years experience` · `6 industries` · `6 companies` · `13+ yrs C++`.
- **FR-04** Expertise section (`#skills`): exactly **5 expertise cards**, each with a Bootstrap Icon, title, a 1–2 line impact blurb, a "N+ years" label, and badge chips for related tech (section 7.2).
- **FR-05** Below the expertise cards, add a compact **"Full toolbox"** block that lists every skill from the resume, grouped (Languages, Frameworks & Libraries, Databases, Tools & Platforms, Specialized) and shown as small badge chips. *(Assumption: this keeps all resume keywords on the page for recruiter keyword searches.)*
- **FR-06** Replace "Objectives" with a **"What I bring"** section (`#value`): 4 value statements aimed at employers (draft copy in section 7.4).
- **FR-07** Experience section (`#experience`): a **vertical timeline**, newest first, with all 6 roles. Each entry shows company, role, date range, a one-line company context, 2–4 bullets, and tech chips.
- **FR-08** Projects section (`#projects`, heading "Featured Work"):
  - **Professional highlights**: 2 text and icon cards (no screenshots) for **Sysphera** and **Audaces 4D + VR try-on mirror**.
  - **Personal projects**: 3 cards in the existing image-card pattern for **GrowTweet**, **3D Viewer**, and **Bat-Flappy**, keeping their current images, live links, and source links.
  - **"More projects"**: a collapsed section (Bootstrap `collapse` with a "Show more projects" toggle button) containing Spider-man Fanpage, Rick & Morty API, Growflix, Nikel, and DOM Challenge in the same card pattern.
  - **HashMarks is removed** from the page.
- **FR-09** Education and Languages section (`#education`): a B.Sc. in Computer Science from UFSC (2003), Full-Stack Web Development at Growdev (2023–2024), and languages (Portuguese: Native / C2; English: Upper Intermediate / B2).
- **FR-10** Footer: `© 2026 Sérgio C. Castelani Jr.`. The year is set automatically with a tiny inline script (`new Date().getFullYear()`), and the static text "2026" is the fallback.
- **FR-11** In `<head>`, add a `meta description`, Open Graph tags (`og:title`, `og:description`, `og:image` → `images/photo2.png`, `og:type=website`), and a matching Twitter card.
- **FR-12** Delete `images/desktop.jpg`, `images/web-dev.jpeg`, and `images/so.jpg` (replaced by icons). Delete `images/projects/hashmarks.png` because it is no longer used.
- **FR-13** Fix existing typos in copy that is kept: "pactice" becomes "practice", and "Boostrap" becomes "Bootstrap".

## 5. Behavior and flows

**Main flow (recruiter):** opens the link → sees the hero (name, title, tagline, photo, social links) → scrolls or uses the navbar → About with stats → Expertise cards → What I bring → Experience timeline → Featured work → Education.

**Alternative flows**
- Clicking a personal project image opens the live demo in a new tab (existing `onclick` behavior). Source links open in a new tab.
- Clicking "Show more projects" expands the collapsed list, and the button label changes to "Show fewer projects". The collapse starts closed.
- Navbar links on mobile close the hamburger menu after a click.

**Edge cases**
- If JavaScript fails (CDN blocked), all content is still visible. Exception: the "More projects" collapse stays closed, which is acceptable. The footer year falls back to the static "2026".
- Professional project cards have no links (proprietary work). They must not look clickable: no hover overlay and no pointer cursor.

## 6. UI / UX

- **Visual direction:** a modern refresh of the current look. Keep Bootstrap 5.3 and the green `--my-primary` / `--my-secondary` variables. Keep the existing section-heading pattern (`border-start border-5 border-primary ps-3 fw-bold`). Use Bootstrap Icons (already loaded) on the expertise cards, stats, timeline, and education. Use white or light-gray alternating section backgrounds for rhythm.
- **Hero:** a two-column layout on md and up (text left, photo right), stacked on mobile. Keep the light-gray background (`--bs-gray-100`).
- **Stats strip:** 4 tiles in a row on lg, 2×2 on mobile. Big number in the brand green, small label under it.
- **Expertise cards:** a grid with 3 per row on lg (the fifth card centered or in a 3+2 layout), 2 per row on md, 1 on mobile. Chips use a light green tint background with green text, defined as a custom `.skill-chip` class that uses the CSS variables.
- **Timeline:** a vertical line in the brand green with a dot per role. Dates sit in a muted badge. On mobile the line moves to the left edge and the content goes full width.
- **Professional highlight cards:** a large Bootstrap Icon (e.g. `bi-bar-chart-line` for Sysphera, `bi-badge-vr` / `bi-box` for Audaces), title, company name, 2–3 line description, and tech chips.
- **Accessibility:** `alt` text on the profile photo and images. `aria-label` on the icon-only social buttons. Heading hierarchy (single `h1`, sections use `h2`). Text contrast of 4.5:1 or higher (check the green on white: use `--my-secondary` or a darker green for text if `#86af49` fails). Visible focus states. Project image divs that act as buttons get `role="link"`, `tabindex="0"`, and keyboard (Enter) support.
- **Responsive:** keep the existing ≤768px rule for project image corners.

## 7. Data model (content)

All content is hard-coded HTML. The corrected source data follows.

### 7.1 Experience (newest first)

| Company | Role | Dates | Context | Bullets | Tech |
|---|---|---|---|---|---|
| Tech6 | Senior Full-Stack Web Developer | Oct 2023 – Oct 2026 | Software company: business analytics and enterprise web platforms | **Sysphera**: C#/TypeScript/MSSQL SPA for data storage and OLAP-cube analysis · **Drapo**: TypeScript framework for frontend development (plain text, no link) · **T6-GPT**: AI assistant to operate Sysphera and surface data insights (Microsoft Agent Framework) · Real estate management platform for a major U.S. client | C#, ASP.NET, TypeScript, React, Redux, PostgreSQL, SQL Server, Docker, Azure, Microsoft Agent Framework |
| Graebert | Software Engineer | Sep 2022 – Mar 2023 | Leading international CAD platform | Contributed mainly to the graphics engine · Removed performance bottlenecks · Investigated and fixed defects | C++, OpenGL, Qt, Multithreading |
| Audaces | Senior Software Engineer | May 2017 – Sep 2022 | Multinational fashion-technology company (software and hardware) | Contributed to Audaces 4D (3D fashion design) · Built 3D modeling and real-time cloth-simulation tools · Led prototypes: VR try-on mirror (Unity + body tracking), WebGL garment viewer, Industry 4.0 integrations with SENAI/SP | C++, OpenGL, Qt, Computer Graphics, Multithreading, Jenkins |
| ITM Apps | CTO / Lead Developer | Sep 2014 – Aug 2016 | Startup: condominium management | Designed and built APControle from scratch · Cloud-based condo management platform · Full AWS integration | PHP, PostgreSQL, HTML, CSS, AWS |
| AGM | Software Engineer | Feb 2012 – Jan 2013 | Telecommunications software | Tools integrated with Cisco VoIP solutions · Improved development processes · Standardized tools and environments | C++, SIP, VoIP, TCP/IP |
| Pixeon | Software Engineer | **Feb 2005 – Jan 2012** *(corrected; the resume says 2012–2013)* | Medical imaging software | High-performance thin-client radiology systems · Scalable pipeline-processing frameworks · Advanced 3D rendering for medical visualization · Lower maintenance costs, more flexible reporting · 1 year of iOS development | C++, Python, Java, Assembly, OpenGL, CUDA, DICOM, Multithreading |

Note: The **resume file itself** still has the wrong Pixeon dates and "Out 2026". Fix it separately.

### 7.2 Expertise cards (years confirmed by user)

| # | Title | Years | Icon (suggested) | Chips | Blurb (draft) |
|---|---|---|---|---|---|
| 1 | Full-Stack Web | 5+ | `bi-window-stack` | C#, ASP.NET, TypeScript, React, Redux, Node.js, Express, SQL Server, PostgreSQL, Azure, Docker | End-to-end SPAs and APIs for enterprise analytics and real-estate platforms, from database to UI. |
| 2 | AI Agents | ~2 | `bi-robot` | Microsoft Agent Framework, LLM integration, Python, GitHub Copilot / Codex / Claude | Built T6-GPT, an AI assistant that operates a BI platform and turns data into insights. |
| 3 | C++ & Performance | 13+ | `bi-cpu` | C/C++, Boost, Qt, Multithreading, Visual Studio, Profiling | High-performance native systems for CAD, fashion 3D and medical imaging, with a focus on removing bottlenecks. |
| 4 | Computer Graphics & GPU | 12+ | `bi-badge-3d` | OpenGL, CUDA, WebGL, Three.js, Unity, Real-time simulation | Graphics engines, real-time cloth simulation and 3D medical rendering. |
| 5 | Medical Imaging | 7 | `bi-heart-pulse` | DICOM, 3D rendering, Thin-client architecture, Pipeline processing | Radiology thin-client systems and 3D visualization at Pixeon. |

*Assumption:* the "Profiling" and "LLM integration" chips are inferred, not taken word for word from the resume. Remove them if unwanted.

### 7.3 About and stats

- **Summary (draft):** "Senior Software Engineer with 27 years of experience building software across real estate, finance, CAD, fashion technology, telecommunications and medical imaging. Today I focus on full-stack development with C#/.NET, TypeScript and React, plus AI agents. Behind that is a deep background in C++, computer graphics and performance optimization. I have worked in startups, scale-ups and international companies, and I like solving hard technical problems in ways that create measurable business value."
- **Stats:** 27 years experience · 6 industries · 6 companies · 13+ yrs C++.

### 7.4 "What I bring" (draft copy)

1. **End-to-end ownership.** I take features from database schema to polished UI and ship them.
2. **Performance mindset.** Years of C++ and GPU work taught me to measure, profile and remove bottlenecks.
3. **Hard problems, practical solutions.** 3D engines, real-time simulation, medical imaging, AI agents: I turn complex tech into working products.
4. **Startup to enterprise.** I have been a CTO who built a platform from scratch and an engineer in large international teams.

### 7.5 Projects

- **Sysphera** (Tech6): an enterprise SPA for data storage and analysis with OLAP cubes. Tech: C#, ASP.NET, TypeScript, SQL Server.
- **Audaces 4D & VR Try-on Mirror** (Audaces): a 3D fashion design platform with real-time cloth simulation, plus a VR mirror prototype built with Unity and body-tracking sensors. Tech: C++, OpenGL, Qt, Unity.
- **Personal, featured:** GrowTweet, 3D Viewer, Bat-Flappy. Reuse the existing markup, images, and links.
- **Personal, "More projects" (collapsed):** Spider-man Fanpage, Rick & Morty API, Growflix, Nikel, DOM Challenge.

## 8. Integration and technical notes

- Files: `index.html` (rewrite of the body and head meta), `index.css` (new classes: navbar, stats, `.skill-chip`, timeline, highlight cards; remove `#objectives-list` styles), `images/` (deletions per FR-12).
- Keep Bootstrap 5.3.1 and Bootstrap Icons 1.10.5 from the jsDelivr CDN. Verify that every chosen icon exists in 1.10.5, or bump to the latest 1.11.x.
- Keep custom CSS small and variable-driven, as described in CLAUDE.md. New accents use `--my-primary` / `--my-secondary`, not Bootstrap blue.
- Keep the existing `project-card-img` / `project-img-overlay` pattern for personal projects.
- Update `CLAUDE.md` "Page sections" so it describes the new structure.

## 9. Non-functional requirements

- **Performance:** no new heavy assets. Icons come from the icon font, and the only images are the photo and project screenshots. Add `loading="lazy"` to images below the fold.
- **SEO:** a descriptive `<title>` (e.g. "Sérgio C. Castelani Jr. | Senior Full-Stack Software Engineer"), a meta description, and OG/Twitter tags.
- **i18n:** English only, `lang="en"`.
- **Privacy:** only the email already on the page (mailto). No phone number or address.

## 10. Acceptance criteria

- [ ] **Given** a desktop browser, **when** the page loads, **then** name, "Senior Software Engineer", tagline, photo, and social links are visible without scrolling.
- [ ] **Given** the About section, **then** it shows the summary and 4 stats (27 years, 6 industries, 6 companies, 13+ yrs C++).
- [ ] **Given** the Skills section, **then** there are exactly 5 expertise cards with icon, blurb, years, and chips matching section 7.2, followed by a grouped "Full toolbox" containing every skill from the resume.
- [ ] **Given** the Experience timeline, **then** it lists 6 roles newest first, with Tech6 "Oct 2023 – Oct 2026" and Pixeon "Feb 2005 – Jan 2012".
- [ ] **Given** the Projects section, **then** Sysphera and Audaces appear as non-clickable highlight cards, GrowTweet, 3D Viewer, and Bat-Flappy appear as clickable image cards, and HashMarks appears nowhere.
- [ ] **When** "Show more projects" is clicked, **then** the 5 remaining demos expand, and clicking again collapses them.
- [ ] **Given** a 375px-wide viewport, **then** the navbar collapses to a hamburger menu, cards stack, the timeline is readable, and there is no horizontal scroll.
- [ ] **When** a navbar link is clicked, **then** the page scrolls to the section and the heading is not hidden under the sticky navbar (`scroll-margin-top`).
- [ ] **Given** the page URL pasted into LinkedIn or Slack, **then** the preview shows the title, description, and photo.
- [ ] No "Objectives" section remains. No stock skill images remain in the repo or the page.
- [ ] Lighthouse Accessibility ≥ 90 and SEO ≥ 90.

## 11. Decisions log

| # | Question | Decision | Rationale |
|---|----------|----------|-----------|
| 1 | Page structure | Full resume flow | Matches the order recruiters scan in |
| 2 | Objectives section | Replace with "What I bring" | Value to an employer beats personal goals |
| 3 | Showcase | Curate and add professional projects | Lead with professional work |
| 4 | Primary positioning | Senior Full-Stack (.NET/TS) | User's target role; C++/graphics as differentiator |
| 5 | AGM/Pixeon date clash | Pixeon = Feb 2005 – Jan 2012 | User correction |
| 6 | Tech6 end date | Oct 2023 – Oct 2026 (past role) | User confirmed |
| 7 | Pre-2012 career | Show only listed roles; keep "27 years" | User choice |
| 8 | Open-to-work / CV download / email CTA | None | User: "no need for that" |
| 9 | Skills presentation | 5 expertise cards (Real-Time & VoIP dropped) + chips | User edited the proposal |
| 10 | Years per skill | 5+, ~2, 13+, 12+, 7 | User confirmed estimates |
| 11 | Visual direction | Modern refresh, keep green | Polished without a rebrand |
| 12 | Stock skill images | Replace with icons, delete files | Lighter, more professional |
| 13 | Featured professional projects | Sysphera, Audaces 4D + VR mirror | User choice |
| 14 | Featured personal demos | GrowTweet, 3D Viewer, Bat-Flappy | User choice |
| 15 | Other demos | Collapsed "More projects" | User choice |
| 16 | HashMarks | Removed | User choice |
| 17 | Drapo / T6-GPT | Timeline bullets, no link | User choice |
| 18 | Key-numbers strip | Yes | Quick scan for recruiters |
| 19 | Language / photo / footer / meta | English only, keep photo2.png, footer 2026 (auto), add SEO/OG meta | User choice |

## 12. Open questions

- **Copy approval:** the summary, tagline, card blurbs, and "What I bring" texts are drafts written from the resume. *Default:* use them as written. The user reviews them on the rendered page.
- **Tech6 company context line** ("business analytics and enterprise web platforms") is inferred. *Default:* use it unless the user corrects it.
- **Public URL for `og:url`:** not known (the demos use `castelani.dev.br`). *Default:* omit `og:url`, and use a relative path for `og:image`, or an absolute one once the domain is confirmed.
- **Social links in the footer:** *Default:* repeat the LinkedIn, GitHub, and email icons in the footer (small) as a soft contact point, since there is no contact section.

## 13. Future ideas

- A Portuguese version or language toggle.
- A CV PDF download and an "Open to work" badge, if job-search status changes.
- Screenshots or short videos for the professional projects, if allowed.
- Earlier roles (pre-2005) to back up the 27-year figure.
