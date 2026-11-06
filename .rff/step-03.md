# S03 - Footer with automatic year and social icons

- **Plan:** [plan.md](plan.md)
- **Type:** Slice
- **Requirements covered:** FR-10; RFF §12 open question "Social links in the footer" (default: repeat the LinkedIn, GitHub and email icons, small); RFF §5 edge case "footer year falls back to the static 2026"; R-A11Y for the footer links (accessible names, contrast, visible focus)
- **Prerequisites:** the existing `<footer>` element (last child of `<main>`); the existing Bootstrap Icons CDN `<link>` (any version from 1.10.5 up, which all include `bi-linkedin`, `bi-github`, `bi-envelope`); the existing `/* Bootstrap overrides */` comment in `index.css`
- **Creates:** `#footer-year`

## 1. Goal

The footer replaces the outdated "Sérgio C Castelani Jr (2023)" line with:

- a row of three small icon links (LinkedIn, GitHub, Email) that act as a soft contact point, each with an accessible name;
- the line `© 2026 Sérgio C. Castelani Jr.`, where the year sits in `<span id="footer-year">` and a tiny inline script overwrites it with the visitor's current year. Without JavaScript the static "2026" stays.

When done, the footer is centered at the bottom of the page, shows `© <current year> Sérgio C. Castelani Jr.` and the three icons, which open LinkedIn and GitHub in a new tab and the mail client through `mailto:`.

## 2. Context

- Current markup (`index.html`, at the end of `<main>`):
  ```html
  <footer class="mt-5 text-center">
    <small class="blockquote-footer">Sérgio C Castelani Jr (2023)</small>
  </footer>
  ```
  `.blockquote-footer` adds an em dash before the text through `::before` and is meant for quotations, so it is dropped.
- The footer sits inside `<main>` on the white page background. `<main>` has no bottom padding, so the footer brings its own vertical padding.
- The global `a` rule in `index.css` colors links with a brand green and underlines them on hover. The footer icon links get their own class so they do not depend on that rule: a gray icon at rest (text-level contrast on white) and a brand-green hover without underline.
- Bootstrap Icons is already loaded from the CDN, so the icons are font glyphs (`<i class="bi bi-…">`), not inline SVGs.
- Contact URLs come from the existing hero buttons and `my-resume.txt`: `https://www.linkedin.com/in/sergiocastelani/`, `https://github.com/sergiocastelani`, `mailto:sergio.castelani@gmail.com`. No phone or address (RFF §9 Privacy).
- No test suite: verification is manual in a browser plus `grep` checks.
- Conventions (CLAUDE.md, plan §2): Bootstrap utility classes for layout, small custom CSS driven by the theme variables, one comment-headed CSS block per section inserted before `/* Bootstrap overrides */`, inline scripts placed next to the markup they serve.

## 3. Structure

### 3.1 Files

| File | Change | Responsibility |
|------|--------|----------------|
| `index.html` | modify | Replace the content and classes of the `<footer>` element only; add one inline `<script>` inside it |
| `index.css` | modify | Add a `/* Footer */` block before `/* Bootstrap overrides */` with the icon-link styling |

### 3.2 Markup (`index.html`, the `<footer>` element)

Replace the whole `<footer>…</footer>` element (it stays the last child of `<main>`, in the same position) with:

```html
<footer class="mt-5 py-4 text-center">
  <ul class="list-unstyled d-flex justify-content-center gap-2 mb-2">
    <li>
      <a class="footer-social-link" href="https://www.linkedin.com/in/sergiocastelani/"
         target="_blank" rel="noopener" aria-label="LinkedIn">
        <i class="bi bi-linkedin" aria-hidden="true"></i>
      </a>
    </li>
    <li>
      <a class="footer-social-link" href="https://github.com/sergiocastelani"
         target="_blank" rel="noopener" aria-label="GitHub">
        <i class="bi bi-github" aria-hidden="true"></i>
      </a>
    </li>
    <li>
      <a class="footer-social-link" href="mailto:sergio.castelani@gmail.com" aria-label="Email">
        <i class="bi bi-envelope" aria-hidden="true"></i>
      </a>
    </li>
  </ul>
  <p class="small text-body-secondary mb-0">
    &copy; <span id="footer-year">2026</span> Sérgio C. Castelani Jr.
  </p>
  <script>
    document.getElementById('footer-year').textContent = new Date().getFullYear();
  </script>
</footer>
```

Details:

- **`<footer>` classes:** `mt-5` (kept, separates it from the last section), `py-4` (new, own vertical spacing since `<main>` has no bottom padding), `text-center` (kept).
- **Icon list:** a `<ul class="list-unstyled …">` so screen readers announce "list, 3 items". `gap-2` spaces the links; `mb-2` separates the list from the copyright line. Order: LinkedIn, GitHub, Email (same order as the hero).
- **Links:** class `footer-social-link` (private to this step, see 3.3). Accessible names come from `aria-label`: exactly "LinkedIn", "GitHub", "Email". The `<i>` glyphs are `aria-hidden="true"`. LinkedIn and GitHub open in a new tab with `rel="noopener"`; the `mailto:` link has no `target`.
- **Copyright line:** a `<p>` (not a heading, not `.blockquote-footer`) with `small text-body-secondary` (Bootstrap's secondary text color, about 6.8:1 on white). Text: `&copy;`, a space, the year span, a space, `Sérgio C. Castelani Jr.` (with the periods after "C" and "Jr").
- **`#footer-year`** (shared item created here): a `<span>` whose static content is `2026`. Only the script below writes to it.
- **Script:** one statement, placed inside the footer right after the `<p>`. Because it runs synchronously while the parser reaches it, `#footer-year` already exists, so no `DOMContentLoaded` listener and no Bootstrap dependency are needed. `textContent` (not `innerHTML`) is used. No other script shares this `<script>` tag.

Untouched: everything outside the `<footer>` element.

### 3.3 Styles (`index.css`)

Add this block right before the `/* Bootstrap overrides */` comment:

```css
/* Footer */
.footer-social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.25rem;
  color: var(--bs-secondary-color);
}
.footer-social-link:hover {
  color: var(--my-secondary);
  text-decoration: none;
}
```

- `.footer-social-link`: a 40×40 px square hit area (meets the 24×24 px target-size check in Lighthouse) with the glyph centered and sized at 1.25rem (smaller than the hero's 50px buttons, so it reads as a soft secondary contact point). Rest color `--bs-secondary-color` gives the icon more than 3:1 non-text contrast on white. The class selector beats the global `a` element rule, so the brand-green link color does not apply at rest.
- `.footer-social-link:hover`: brand accent `--my-secondary` (about 3.3:1 on white, enough for an icon) and no underline (the global `a:hover` underline would draw a line under the glyph).
- No focus rule: the browser's (or any page-wide) `:focus-visible` outline must stay visible, so nothing here removes `outline`.
- No media query: the footer layout is the same at every width.

## 4. Logic flows

The only logic is one statement: when the script runs it writes the current year into `#footer-year`; when it does not run (JavaScript disabled or blocked) the static "2026" stays. No diagram is needed.

## 5. Edge cases and errors

| Case | Expected behavior |
|------|-------------------|
| JavaScript disabled or the inline script blocked | Footer shows `© 2026 Sérgio C. Castelani Jr.`; icons still work (plain links) |
| Bootstrap JS bundle fails to load (CDN blocked) | No effect: the script does not use Bootstrap, and the year still updates |
| Bootstrap Icons CSS fails to load | Glyphs do not render, but each link keeps its accessible name from `aria-label` and its 40×40 px hit area; the copyright line is unaffected. Accepted (the hero has the same dependency on the CDN) |
| Visitor's clock set to another year | The footer shows the visitor's device year (accepted: the RFF asks for `new Date().getFullYear()`) |
| Year changes while the page is open | Not updated until reload (accepted) |
| Narrow viewport (320 to 375px) | Three 40px links plus gaps fit on one line; the copyright line wraps if needed; no horizontal scroll |
| Keyboard user | Tab reaches the three links in order LinkedIn, GitHub, Email; each shows a visible focus outline; Enter activates the link |
| Mail client not configured | Browser's default `mailto:` handling (outside the page's control) |

## 6. Tests

### 6.1 Automated

None: the project has no test suite.

### 6.2 Manual

Serve the folder (`npx serve .` or `python -m http.server`) or open `index.html` directly.

- Given the page on a desktop browser, when you scroll to the bottom, then the footer is centered and shows three icons (LinkedIn, GitHub, Email) above the line `© <current year> Sérgio C. Castelani Jr.`, with no leading em dash. (Proves FR-10, footer social-links default.)
- Given the footer, when you click the LinkedIn icon, then `https://www.linkedin.com/in/sergiocastelani/` opens in a new tab; when you click the GitHub icon, then `https://github.com/sergiocastelani` opens in a new tab; when you click the Email icon, then the mail client opens a message to `sergio.castelani@gmail.com` and the page stays in the current tab. (Proves footer social-links default.)
- Given DevTools > Settings > Debugger > "Disable JavaScript" checked, when you reload, then the footer shows `© 2026 Sérgio C. Castelani Jr.`. Uncheck it afterwards. (Proves FR-10 fallback, RFF §5 edge case.)
- Given DevTools Console, when you run `document.getElementById('footer-year').textContent`, then it returns the current year as a string, and `new Date().getFullYear()` matches it. (Proves FR-10 automatic year.)
- Given the DevTools Accessibility pane, when you inspect each footer link, then its computed name is "LinkedIn", "GitHub" and "Email" respectively, and the icon glyphs are hidden from the tree. (Proves R-A11Y accessible names.)
- Given the keyboard only, when you Tab past the last section, then focus reaches the three footer links in order with a visible focus outline; pressing Enter on GitHub opens it in a new tab. (Proves R-A11Y focus states.)
- Given the mouse over a footer icon, then the icon turns brand green and no underline appears. (Proves the hover styling.)
- Given the DevTools color picker on a footer icon and on the copyright text, then the icon contrast on white is 3:1 or higher and the text contrast is 4.5:1 or higher. (Proves R-A11Y contrast.)
- Given a 375px-wide DevTools viewport, then the three icons fit on one line, the copyright line is readable and there is no horizontal scroll. (Proves responsiveness.)

### 6.3 Static checks

Run from `C:\Devel\portfolio2` (Git Bash):

- `grep -c 'id="footer-year"' index.html` → `1`
- `grep -n "(2023)\|blockquote-footer" index.html` → no output
- `grep -c 'class="footer-social-link"' index.html` → `3`
- `grep -n 'bi-linkedin\|bi-github\|bi-envelope' index.html` → three lines, all inside the `<footer>`
- `grep -n "getFullYear" index.html` → one line, inside the `<footer>`
- `grep -n "/\* Footer \*/" index.css` → one line, before the `/* Bootstrap overrides */` line

## 7. Implementation order

1. In `index.css`, add the `/* Footer */` block before `/* Bootstrap overrides */` (no visible change yet).
2. In `index.html`, replace the `<footer>` element with the new markup, including the icon list and the copyright `<p>` with the static `2026`.
3. Add the inline `<script>` inside the footer, after the `<p>`.
4. Run the static checks and the manual checks.

The page works after each sub-step.

## 8. Out of scope

- Does not change anything outside the `<footer>` element in `index.html`: not `<head>`, not the CDN `<link>` lines, not the `<main>` element or its classes, not the hero or any section.
- Does not edit any existing rule in `index.css` (theme variables, `a`, `strong`, Bootstrap overrides, media queries); it only adds the `/* Footer */` block.
- No contact section, email CTA button, CV download or "Open to work" badge (RFF non-goals).
- No phone number or address (RFF §9 Privacy).

## 9. Design notes

- **Icon fonts instead of copied SVGs:** the plan names Bootstrap Icons glyphs, which are already loaded. Copying the hero's inline SVGs would duplicate long path data (DRY) and couple the footer to the hero's markup.
- **Own link class instead of the global `a` color:** the footer must meet contrast on its own. The rest color uses Bootstrap's `--bs-secondary-color`; the hover uses the theme variable `--my-secondary` (CLAUDE.md: accents use the theme variables, not Bootstrap blue). The global `a:hover` underline is cancelled because it looks broken under an icon.
- **Inline script right after the span, synchronous:** the simplest code that works; no listener, no Bootstrap dependency, no guard needed because the element is parsed before the script. `textContent` avoids any HTML injection path.
- **`.blockquote-footer` dropped:** it prepends an em dash and is meant for quote attributions, which would break the required text `© 2026 Sérgio C. Castelani Jr.`.
- **List of links (`<ul>`) rather than a `<nav>`:** three contact links are not site navigation; a list gives screen readers the count without adding a second navigation landmark.
- **40×40 px hit area:** keeps the icons small visually while passing Lighthouse's target-size audit (part of the Accessibility score goal of 90+).
- **Rejected: clamping the year to at least 2026** (e.g. `Math.max(2026, …)`): extra logic the RFF does not ask for; a wrong device clock is accepted.
