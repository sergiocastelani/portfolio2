# S02 - Highlighted-chip look

- **Plan:** [plan.md](plan.md)
- **Type:** Enabler
- **Requirements covered:** FR-10, FR-11 (scroll offset part), FR-15 (CSS organization bullet)
- **Prerequisites:** `--my-primary-text`, `--main-nav-height` (CSS variables on `html` in `index.css`); `.skill-chip` (CSS class)
- **Creates:** `.skill-chip-highlight` (CSS class), `/* Hash tools */` (CSS block in `index.css`)

## 1. Goal
Define the highlighted state of a tech chip as one CSS class. When done, any `<span class="badge skill-chip">` that also gets the class `skill-chip-highlight`:

- shows a solid `var(--my-primary-text)` (`#4f6e24`) background with white text (5.85:1, WCAG AA);
- keeps exactly the same size, padding, font and rounded badge shape as its neighbors;
- when scrolled into view with `element.scrollIntoView({ block: 'start' })`, stops `--main-nav-height + 1rem` below the top of the viewport, so it is not hidden behind the sticky navbar (same offset as the section headings).

Removing the class restores the normal chip look. Nothing on the page uses the class yet, so the page looks unchanged after this step.

## 2. Context
- `index.css` (CRLF in the working tree) has the `.skill-chip` rule in the `/* Layout and navigation */` block (line ~111): `color: var(--my-primary-text)`, `background-color: color-mix(in srgb, var(--my-primary) 15%, #fff)`, `font-weight: 500`. It is the only rule that targets `.skill-chip`; Bootstrap's `.badge` supplies padding, font size, radius and `white-space: nowrap`.
- All 119 chips in `index.html` use exactly `class="badge skill-chip"`; no chip carries extra color utilities.
- `section[id] { scroll-margin-top: calc(var(--main-nav-height) + 1rem); }` and the reduced-motion `html { scroll-behavior: smooth; }` rule already exist in `/* Layout and navigation */`. Chips are not `section[id]`, so they get no offset today.
- Block order in `index.css` ends with `/* Education */` (line ~275), `/* Bootstrap overrides */` (line ~280), `/* responsiveness */`. `CLAUDE.md` requires a new area to get its own commented block before `/* Bootstrap overrides */`, and new accent styling to use the theme variables.
- No test suite or build: verification is manual in a browser plus grep checks.

## 3. Structure

### 3.1 Files
| File | Change | Responsibility |
|------|--------|----------------|
| `index.css` | modify | New `/* Hash tools */` block holding the `.skill-chip.skill-chip-highlight` rule |
| `CLAUDE.md` | modify | CSS organization bullet lists the new block |

### 3.2 Styles (`index.css`)
Insert a new block between the end of the `/* Education */` block (after the `.education-icon { … }` rule and its blank line) and the `/* Bootstrap overrides */` comment. Keep one blank line before and after it, as the other blocks do. Nothing else in the file changes; in particular `.skill-chip`, `section[id]` and the reduced-motion rule stay as they are.

```css
/* Hash tools */
.skill-chip.skill-chip-highlight {
  color: #fff;                                             /* 5.85:1 on --my-primary-text */
  background-color: var(--my-primary-text);
  scroll-margin-top: calc(var(--main-nav-height) + 1rem);  /* land below the sticky navbar, like section headings */
}
```

Rule by rule:
- **Selector** `.skill-chip.skill-chip-highlight` (specificity 0,2,0) beats `.skill-chip` (0,1,0) regardless of source order, without `!important`. The compound selector also means the class has no effect on a non-chip element.
- **`color` / `background-color`**: the only visual change. White is written as `#fff`, matching the literal already used in the `.skill-chip` `color-mix`; the green comes from the theme variable, never a literal or Bootstrap blue.
- **`scroll-margin-top`**: same expression as `section[id]`, so the navbar height has one source of truth (`--main-nav-height`). It does not move the chip; it only affects where `scrollIntoView` stops.
- No `padding`, `font-*`, `border`, `border-radius`, `box-shadow`, `transition` or display change, so the chip keeps its badge size and shape and the row does not reflow.

### 3.3 Docs (`CLAUDE.md`)
Edit only the **CSS organization** bullet:

1. In the ordered list of blocks, append `` `/* Hash tools */` `` after `` `/* Education */` ``, so the list reads `…, `/* Professional highlights */`, `/* Education */`, `/* Hash tools */`; each holds …`.
2. Right after the sentence "Classes created for a section are used only inside that section." (the last sentence of the bullet), add one sentence:
   `` `/* Hash tools */` holds the styles applied by `hash-tools.js` commands across sections (`.skill-chip.skill-chip-highlight`: `--my-primary-text` background, white text, navbar `scroll-margin-top`), so its classes are the exception to the one-section rule for classes. ``

   Wording may be tightened, but it must name the block, say it serves `hash-tools.js`, say its class is applied across sections, and name the rule it is an exception to as the one-section rule for classes (not the 768px media-query exception or the "style a section only inside its own block" rule). No other bullet of `CLAUDE.md` changes.

## 4. Logic flows
No logic: a single static rule. The class is either present (highlight look and scroll offset) or absent (normal chip).

## 5. Edge cases and errors
| Case | Expected behavior |
|------|-------------------|
| Class added to a chip on the white band (`#projects-professional`) or the gray band (`#skills`, `#experience`) | Same dark green fill with white text; the chip still stands out on both bands. |
| Class added to an element without `.skill-chip` | No effect (compound selector). |
| Class removed | Chip returns to the light green tint with green text. |
| Chip near the bottom of the page, so the document cannot scroll far enough | Browser scrolls as far as it can; the chip stays visible (normal `scrollIntoView` behavior). |
| Viewport below 768px (navbar collapsed, same `--main-nav-height`) | Same offset; the chip lands below the navbar. |
| User prefers reduced motion | `scrollIntoView` jumps instead of animating, via the existing `html` rule; this step adds no motion. |
| Chip has keyboard focus | Not applicable: chips are non-focusable spans. |
| JavaScript disabled | Nothing adds the class, page unchanged. |

## 6. Tests

### 6.1 Automated
None: the project has no test suite.

### 6.2 Manual
Open `index.html` directly or via `npx serve .`, with the DevTools console. In the console, `const el = [...document.querySelectorAll('.skill-chip')].find(c => c.textContent.trim() === 'Qt');`.

- Given the page is open, when `el.classList.add('skill-chip-highlight')` runs, then that `Qt` chip has a dark green background and white text, and every other chip is unchanged. (FR-10)
- Given that chip highlighted, when its height is compared with another chip in the same list (`el.getBoundingClientRect().height` vs `[...el.closest('ul').querySelectorAll('.skill-chip')].find(c => c !== el).getBoundingClientRect().height`; each chip is the only child of its own `<li>`), then the heights match and the row's chips did not move or wrap differently. (FR-10, UI/UX "same badge size and shape")
- Given that chip highlighted, when DevTools' color picker or contrast checker is opened on it, then it reports about 5.85:1 (at least 4.5:1). (FR-10)
- Given that chip highlighted and the page scrolled to the bottom, when `el.scrollIntoView({ block: 'start' })` runs at a desktop width (e.g. 1280px), then the chip ends just below the navbar, fully visible, with about 1rem gap. (FR-11 offset)
- Given the same, when it runs at 375px width (DevTools device mode), then the chip also ends below the collapsed navbar. (FR-11 offset)
- Given DevTools "Emulate CSS prefers-reduced-motion: reduce", when `el.scrollIntoView({ block: 'start' })` runs, then the page jumps; without the emulation, it scrolls smoothly. (FR-11, regression on the existing rule)
- Given a highlighted chip in `#experience` (gray band) and one in `#projects-professional` (white band), when viewed, then both show the same look. (FR-10, "same look" for all matches)
- Given `el.classList.remove('skill-chip-highlight')`, then the chip is back to the light green tint. (on/off switch)
- Given the page without any class added, when compared with the page before the change, then nothing looks different. (regression)

### 6.3 Static checks
Run from the project root in Git Bash. They avoid end-of-line anchors because the working tree uses CRLF.

- `grep -c '^/\* Hash tools \*/' index.css` → `1`
- `awk '/^\/\* Education \*\//{e=NR} /^\/\* Hash tools \*\//{h=NR} /^\/\* Bootstrap overrides \*\//{b=NR} END{print (e<h && h<b) ? "order ok" : "order wrong"}' index.css` → `order ok`
- `grep -n '^\.skill-chip\.skill-chip-highlight {' index.css` → one line, after the `/* Hash tools */` line.
- `grep -c 'background-color: var(--my-primary-text);' index.css` → previous count + 1 (one more than before the change), and `grep -n 'scroll-margin-top: calc(var(--main-nav-height) + 1rem)' index.css` → two lines (`section[id]` and the new rule).
- `grep -c 'skill-chip-highlight' index.html` → `0` (no markup change).
- `grep -c '/\* Hash tools \*/' CLAUDE.md` → at least `1`, and the match is in the line starting `- **CSS organization**`.
- `git diff -- index.css` → the only change is the added `/* Hash tools */` block (no removed or modified lines elsewhere in the file).

## 7. Implementation order
1. Add the `/* Hash tools */` block with the rule to `index.css` before `/* Bootstrap overrides */`, keeping CRLF endings.
2. Run the manual checks in the browser and the static checks.
3. Update the CSS organization bullet in `CLAUDE.md`.

## 8. Out of scope
- Does not edit the `.skill-chip` rule, `section[id]`, the reduced-motion rule or any other existing CSS block.
- Does not change `index.html` and adds no JavaScript: nothing on the page adds or removes the class in this step.
- Does not add a different look for partial vs whole-label matches, hover or focus states, animations, or screen-reader text.
- Does not change any `CLAUDE.md` bullet other than CSS organization.

## 9. Design notes
- **Specificity over `!important`**: the compound selector wins over `.skill-chip` cleanly; `!important` is reserved in this project for overriding Bootstrap's own rules.
- **DRY offset**: `scroll-margin-top` reuses the `section[id]` expression and `--main-nav-height`, so a navbar height change updates both. A shared selector list (`section[id], .skill-chip-highlight`) was rejected because it would place the class outside its own block.
- **Single Responsibility**: one rule for one state (highlighted). The scroll offset lives on the class rather than on every `.skill-chip`, so ordinary chips are untouched and the class alone is the on/off switch.
- **Color choice**: `--my-primary-text` + white (5.85:1) instead of `--my-primary` + white (about 2.5:1, fails AA), per the RFF.
- **Cross-section class**: `CLAUDE.md` says section classes stay inside their section; the docs sentence records `/* Hash tools */` as the explicit exception, so the convention stays accurate.
