# S04 - Search and link-preview metadata

- **Plan:** [implementation-steps.md](implementation-steps.md)
- **Type:** Slice
- **Requirements covered:** FR-11; NFR SEO (RFF §9: descriptive `<title>`, meta description, OG/Twitter tags); R-SEO (Lighthouse SEO ≥ 90, meta part); acceptance criterion "Given the page URL pasted into LinkedIn or Slack, then the preview shows the title, description, and photo"
- **Prerequisites:** existing `<head>` in `index.html` (with `<meta charset="UTF-8">`, `<meta name="viewport">` and `<title>`); existing asset `images/photo2.png`
- **Creates:** none

## 1. Goal

The page identifies itself well to search engines and link-preview crawlers. When done:

- The browser tab reads `Sérgio C. Castelani Jr. | Senior Full-Stack Software Engineer`.
- `<head>` contains a meta description, a canonical link to `https://portfolio.castelani.dev.br/`, Open Graph tags and Twitter card tags, all with non-empty content and absolute URLs.
- Lighthouse SEO reports no "Document does not have a meta description" finding.
- Once deployed, a link-preview checker shows the title, the description and the profile photo.

Nothing visible on the page itself changes.

## 2. Context

- `index.html` `<head>` today (in order): `<meta charset="UTF-8">`, `<meta name="viewport" …>`, `<title>Sérgio C Castelani Jr</title>`, a blank line, then the CDN block (Bootstrap Icons `<link>`, Bootstrap CSS `<link>`, deferred Bootstrap bundle `<script>`), a blank line and `<link rel="stylesheet" href="index.css">`.
- `<html lang="en">` is already set (RFF §9 i18n); nothing to change there.
- `images/photo2.png` is a 1069 × 1069 PNG (about 1.5 MB). That is square, so it suits the `summary` Twitter card and the square OG layout, and it is under the 5 MB limit of LinkedIn, Slack and X. The file is not resized or changed here.
- Public URL (RFF open question resolved by the user, plan §7): `https://portfolio.castelani.dev.br/`. All URLs in this step are absolute and built from it.
- This step owns only the `<title>` line and the new `<meta>` / canonical `<link>` lines. The CDN `<link>`/`<script>` lines and the `index.css` link are not touched (one of them may already read a different Icons version when this step is implemented; leave it as found).
- No build, no test suite: verification is manual (DevTools, Lighthouse, link-preview checker) plus `grep` static checks.

## 3. Structure

### 3.1 Files

| File | Change | Responsibility |
|------|--------|----------------|
| `index.html` | modify | `<head>` only: replace the `<title>` text; insert the description, canonical, Open Graph and Twitter tags right after `<title>` |

No CSS, script, asset or doc changes.

### 3.2 Metadata (`index.html` `<head>`)

Replace the existing `<title>` line and insert the block below directly after it, before the blank line that precedes the CDN `<link>` lines. Keep the existing 2-space indentation. `<meta charset>` stays first and `<meta name="viewport">` second.

```html
  <title>Sérgio C. Castelani Jr. | Senior Full-Stack Software Engineer</title>
  <meta name="description" content="Senior Software Engineer with 27 years of experience: full-stack C#/.NET, TypeScript and React, AI agents, and deep C++ and computer graphics expertise.">
  <link rel="canonical" href="https://portfolio.castelani.dev.br/">

  <!-- Open Graph (LinkedIn, Slack, Facebook) -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://portfolio.castelani.dev.br/">
  <meta property="og:title" content="Sérgio C. Castelani Jr. | Senior Full-Stack Software Engineer">
  <meta property="og:description" content="Senior Software Engineer with 27 years of experience: full-stack C#/.NET, TypeScript and React, AI agents, and deep C++ and computer graphics expertise.">
  <meta property="og:image" content="https://portfolio.castelani.dev.br/images/photo2.png">
  <meta property="og:image:width" content="1069">
  <meta property="og:image:height" content="1069">
  <meta property="og:image:alt" content="Portrait of Sérgio C. Castelani Jr.">

  <!-- Twitter / X card -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="Sérgio C. Castelani Jr. | Senior Full-Stack Software Engineer">
  <meta name="twitter:description" content="Senior Software Engineer with 27 years of experience: full-stack C#/.NET, TypeScript and React, AI agents, and deep C++ and computer graphics expertise.">
  <meta name="twitter:image" content="https://portfolio.castelani.dev.br/images/photo2.png">
  <meta name="twitter:image:alt" content="Portrait of Sérgio C. Castelani Jr.">
```

Rules for the values:

| Item | Value | Why |
|------|-------|-----|
| Title (`<title>`, `og:title`, `twitter:title`) | `Sérgio C. Castelani Jr. \| Senior Full-Stack Software Engineer` (61 characters) | Text fixed by the plan and RFF §9; same string everywhere so tab, search result and preview agree |
| Description (`description`, `og:description`, `twitter:description`) | `Senior Software Engineer with 27 years of experience: full-stack C#/.NET, TypeScript and React, AI agents, and deep C++ and computer graphics expertise.` (152 characters) | Under about 155 characters, so search results do not truncate it; states seniority, years, primary stack (FR-02 positioning) and the C++/graphics differentiator |
| Canonical and `og:url` | `https://portfolio.castelani.dev.br/` (with trailing slash) | One canonical address for the page; must be identical in both tags |
| Image (`og:image`, `twitter:image`) | `https://portfolio.castelani.dev.br/images/photo2.png` | Crawlers require absolute URLs; same photo as the hero (RFF decision 19) |
| `og:image:width` / `og:image:height` | `1069` / `1069` | Real pixel size of `photo2.png`; lets LinkedIn and Facebook render the image on the first share without fetching it first |
| Image alt (`og:image:alt`, `twitter:image:alt`) | `Portrait of Sérgio C. Castelani Jr.` | Accessible description of the preview image |
| `og:type` | `website` | FR-11 |
| `twitter:card` | `summary` | Square photo: `summary` shows it as a thumbnail; `summary_large_image` would crop a portrait to 2:1 |

Encoding: the file is UTF-8 and `<meta charset="UTF-8">` comes first, so `é` is written literally (no entity). `C#/.NET` needs no escaping inside a double-quoted attribute. No value contains a double quote.

The two HTML comments are the only comments added; they group the tags for the next reader and contain no instructions.

## 4. Logic flows

None: static markup, no scripts or state.

## 5. Edge cases and errors

| Case | Expected behavior |
|------|-------------------|
| Page opened locally (`file://` or `npx serve .`) | Tags are present in DevTools; preview image URL points at the public site, so local previews are not testable. Expected; verify tags in DevTools only. |
| Public URL not yet serving the new page | Crawlers may fetch an old page or no image. Re-check with LinkedIn Post Inspector after deploying. |
| Crawler cached an old preview | LinkedIn Post Inspector "Inspect" refreshes LinkedIn's cache; Slack refreshes on its own schedule. Not fixable in markup. |
| JavaScript disabled or CDN blocked | No effect: all tags are static HTML in `<head>`. |
| Site reached through another host (e.g. `www.` or `http://`) | Canonical and `og:url` still point to `https://portfolio.castelani.dev.br/`, so search engines and crawlers consolidate on one URL. |
| `photo2.png` renamed or deleted in the future | Preview loses its image. Out of this step's control; the static check `test -f images/photo2.png && echo ok` in 6.2 detects the broken reference. |
| Non-ASCII characters (`é`) in title or alt | Rendered correctly because `<meta charset="UTF-8">` is the first element in `<head>` and stays first. |

## 6. Tests

No automated test suite exists; verification is manual plus static checks.

### 6.1 Manual

- Given `index.html` open in a desktop browser, when the page loads, then the tab title reads `Sérgio C. Castelani Jr. | Senior Full-Stack Software Engineer`. (Proves RFF §9 title, plan behavior.)
- Given DevTools Elements on `<head>`, then these exist, each with non-empty content: `meta[name=description]`, `link[rel=canonical]`, `og:type`, `og:url`, `og:title`, `og:description`, `og:image`, `og:image:width`, `og:image:height`, `og:image:alt`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `twitter:image:alt`; `og:url` and canonical equal `https://portfolio.castelani.dev.br/`; both image tags equal `https://portfolio.castelani.dev.br/images/photo2.png`; `og:type` is `website`; `twitter:card` is `summary`. (Proves FR-11.)
- Given DevTools Elements, then `<meta charset="UTF-8">` is still the first child of `<head>`, the viewport meta is second, and the CDN `<link>`/`<script>` lines and the `index.css` link are unchanged and still load (Network tab: no new 404s, page looks the same as before). (Regression.)
- Given the page served with `npx serve .`, when Lighthouse runs the SEO category (mobile and desktop), then there is no "Document does not have a meta description" finding. A canonical warning about pointing to another domain is expected on localhost and accepted. (Proves R-SEO, meta part.)
- Given the change is deployed, when Lighthouse runs the SEO category on `https://portfolio.castelani.dev.br/`, then there is no meta-description finding and the "Document has a valid `rel=canonical`" audit passes. (Proves R-SEO, meta part, on the real origin.)
- Given the change is deployed, when `https://portfolio.castelani.dev.br/` is inspected with LinkedIn Post Inspector, then the preview shows the title, the description and the profile photo, and no missing-property warnings for `og:title`, `og:description`, `og:image` or `og:url` appear. (Proves the "link pasted into LinkedIn or Slack" acceptance criterion.)
- Given the change is deployed, when the URL is pasted into a Slack message, then the unfurl shows the title, the description and the photo. (Same criterion.)

### 6.2 Static checks

Run from the repo root (Git Bash):

- `grep -c '<title>Sérgio C. Castelani Jr. | Senior Full-Stack Software Engineer</title>' index.html` → `1`
- `grep -c '<title>' index.html` → `1`
- `grep -Ec '<meta (name|property)="(description|og:type|og:url|og:title|og:description|og:image|og:image:width|og:image:height|og:image:alt|twitter:card|twitter:title|twitter:description|twitter:image|twitter:image:alt)"' index.html` → `14`
- `grep -c 'rel="canonical" href="https://portfolio.castelani.dev.br/"' index.html` → `1`
- `grep -c 'content="https://portfolio.castelani.dev.br/images/photo2.png"' index.html` → `2`
- `grep -E '(og:image|twitter:image|og:url|canonical)' index.html | grep -v 'https://portfolio.castelani.dev.br/'` → only the `og:image:width`, `og:image:height`, `og:image:alt` and `twitter:image:alt` lines (no relative URL)
- `test -f images/photo2.png && echo ok` → `ok`
- `git diff --stat -- index.html index.css images/` → only `index.html` listed; `git diff index.html` shows changes inside `<head>` only, none on the CDN `<link>`/`<script>` or `index.css` lines.

## 7. Implementation order

1. Replace the `<title>` text.
2. Insert the description and canonical lines right after `<title>`; reload and check the tab title and Lighthouse SEO.
3. Insert the Open Graph group, then the Twitter group; check them in DevTools and run the static checks.
4. After deployment, run Lighthouse SEO on the public URL and the LinkedIn Post Inspector and Slack checks.

## 8. Out of scope

- Does not change the CDN `<link>`/`<script>` lines, the `index.css` link or anything in `<body>`.
- Does not resize, compress, rename or replace `images/photo2.png`, and adds no dedicated preview image.
- No `robots.txt`, `sitemap.xml`, favicon, structured data (JSON-LD), `twitter:site`/`twitter:creator` handles, `og:locale` or `og:site_name`.
- No Portuguese or other alternate-language tags (RFF non-goal).
- No deployment or DNS work; post-deploy checks only verify.

## 9. Design notes

- **Single source per value, accepted duplication:** HTML has no way to reference one string from several tags, so the title, description and image URL are repeated across `<title>`/OG/Twitter. Twitter falls back to OG tags, but the plan asks for explicit matching Twitter tags, and explicit tags avoid differences between crawlers. The values are listed once in the table in 3.2 as the reference; edit all occurrences together.
- **`summary` over `summary_large_image`:** the only image is a square portrait; the large card would crop it to 2:1 and cut off the face.
- **`og:image:width` / `height` / `alt` added beyond the minimum list:** cheap, standard, and they make the first LinkedIn share render the image immediately and give the image an accessible description. Rejected alternative: leave them out and rely on the crawler fetching a 1.5 MB image on first share.
- **Description length kept to 152 characters** so Google does not truncate it, while still naming seniority, 27 years, the .NET/TypeScript focus and the C++/graphics differentiator (RFF §1 positioning). The copy is a draft under the RFF "Copy approval" default (use as written).
- **Canonical uses the exact `og:url` string with trailing slash**, so search engines and preview crawlers agree on one URL.
- **Tag placement right after `<title>`** keeps all metadata together and away from the CDN lines, so the change merges cleanly with any edit to those lines.
