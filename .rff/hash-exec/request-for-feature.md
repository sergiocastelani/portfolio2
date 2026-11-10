# Feature Request: hash-exec

- **Date:** 2026-11-10
- **Source:** current session
- **Status:** Ready for implementation

## 1. Summary
Add a small URL-hash command router to the portfolio. When the browser location contains a hash in the form `#exec-<command>-<URL-encoded JSON array>`, the page calls the registered JavaScript function `<command>` and passes it the array elements as string parameters. The first and only command in this version is `highlight`. It visually emphasizes the tech chips (`.skill-chip`) whose labels match the parameters, then scrolls to the first match. A term of 3 or more characters matches any label that contains it (`c++` matches `C / C++`); a shorter term must equal the whole label (`Qt`, `C#`). This lets the owner send tailored links, for example to a recruiter looking for C++ and Qt, that open the portfolio with the relevant skills already highlighted.

## 2. Problem and goals
- **Problem:** the portfolio looks the same to every visitor. There is no way to share a link that points out the skills relevant to a specific role.
- **Goals / success criteria**
  - A link such as `index.html#exec-highlight-%5B%22C%2B%2B%22%2C%22Qt%22%5D` highlights every chip whose label contains `C++` (`C++`, `C/C++`, `C / C++`) and every chip labeled exactly `Qt`, then scrolls to the first one.
  - Adding a future command means only writing a function and registering it in the same file.
  - Normal anchors (`#about`, `#skills`, …) and the page without any hash behave exactly as before.
- **Non-goals**
  - No commands other than `highlight` in this version.
  - No visible error UI.
  - No global JS API for registering commands from other scripts.
  - No fuzzy, word-boundary or alias matching of chip labels (partial matching is a plain substring test only).
  - No different look for partial matches.
  - No removal of the hash from the URL after it runs.

## 3. Users and use cases
- As the **portfolio owner**, I want to send a link that highlights specific skills so that the reader sees at once what is relevant to them.
- As a **visitor (recruiter)** who opens such a link, I want the matching skills marked and brought into view so that I don't have to search the page.
- As the **owner**, I want a bad link to fail quietly and leave a hint in DevTools so that I can fix it without visitors noticing.

## 4. Functional requirements
- **FR-01** A new file `hash-tools.js` at the project root holds the router and every command. All future hash tools go in this same file.
- **FR-02** The router reads `window.location.hash` once when the page loads and again on every `hashchange` event.
- **FR-03** A hash is an exec hash when it starts with `#exec-` (prefix compared case-insensitively). Any other hash is ignored by the router, so normal anchor navigation is unchanged.
- **FR-04** Grammar: `#exec-<name>[-<params>]`.
  - `<name>` is one or more ASCII letters or digits (`[A-Za-z0-9]+`), compared case-insensitively (`exec-Highlight-…` = `exec-highlight-…`). The name ends at the first `-` after `exec-`, or at the end of the hash.
  - `<params>` is everything after that `-`. It is URL-decoded with `decodeURIComponent` and then parsed with `JSON.parse`.
  - If `-<params>` is missing, the parameter list is empty (`[]`).
- **FR-05** The parsed value must be an array. Each element is converted to a string with `String(element)`, and the command receives that list of strings.
- **FR-06** Commands live in a registry (an object or `Map` keyed by lowercase name) inside `hash-tools.js`. The router looks up `<name>` and calls the command with the string parameter list.
- **FR-07** Error cases are ignored silently: the page is not changed and a `console.warn` describes the problem. This covers:
  - a name that is empty or has invalid characters
  - an unknown command
  - `decodeURIComponent` or `JSON.parse` throwing
  - a parsed value that is not an array
  - an exception thrown by the command itself (caught by the router)
- **FR-08** `highlight` command matching. Let `term` be the trimmed parameter and `label` the chip's trimmed `textContent`, both compared case-insensitively (lowercased):
  - If `term.length >= 3` (length counted in characters after trimming, so `C++` = 3), the chip matches when `label` contains `term` as a substring. Example: `c++` matches `C++`, `C/C++` and `C / C++`; `sql` matches `MySQL`, `NoSQL`, `SQL Server`.
  - If `term.length < 3`, the chip matches only when `label` equals `term`. Example: `Qt` matches `Qt`; `C` does not match `C / C++`; `C#` matches only `C#`.
  - An empty or whitespace-only parameter falls under the `< 3` rule, so it matches no chip and is warned about by FR-13.
- **FR-09** Each `highlight` call first removes every highlight left by a previous call, then highlights all chips that match any parameter.
- **FR-10** A highlighted chip gets a CSS class (suggested name `skill-chip-highlight`), the same for whole-label and partial matches. The class sets the background to `var(--my-primary-text)` (`#4f6e24`) and the text color to white, about 5.9:1 contrast.
- **FR-11** When at least one chip matches, the page scrolls to the first match in document order. The chip lands below the sticky navbar, offset by `--main-nav-height` like the section headings. The scroll is smooth unless the user prefers reduced motion.
- **FR-12** If no chip matches at all, the previous highlight is still cleared and the page does not scroll.
- **FR-13** For each parameter that matches no chip, the command logs a `console.warn` naming that parameter, including when other parameters did match. An empty parameter list (`#exec-highlight` or `#exec-highlight-[]`) clears the highlight and logs a `console.warn`.
- **FR-14** A highlight stays until the next `highlight` call or a page reload. Navbar and anchor clicks to non-exec hashes do not remove it.
- **FR-15** `CLAUDE.md` is updated to describe `hash-tools.js`, the `#exec-` hash format, the `highlight` command and its CSS block. It replaces the statement that there is no JS file.

## 5. Behavior and flows
**Main flow (page load)**
1. A visitor opens `…/index.html#exec-highlight-%5B%22C%2B%2B%22%2C%22Qt%22%5D`.
2. The browser tries a native anchor jump. No element has that id, so nothing happens.
3. `hash-tools.js` runs once the DOM is ready. It parses name `highlight` and parameters `["C++", "Qt"]`.
4. Every `.skill-chip` whose label contains `C++` (3 characters, so partial matching applies) or equals `Qt` (2 characters, so whole label only), ignoring case, gets the highlight class.
5. The page scrolls to the first highlighted chip in document order, normally inside `#skills`.

**Alternative flow (hashchange):** while on the page, the visitor edits the URL to `#exec-highlight-%5B%22Python%22%5D`. The `C++` and Qt highlights are removed, Python chips are highlighted, and the page scrolls to the first one.

**Alternative flow (normal navigation):** after a highlight, the visitor clicks "Experience" in the navbar. The hash becomes `#experience`, the router ignores it, and the highlight stays.

**Edge cases**
- The same exec hash is entered again: browsers do not fire `hashchange` when the hash is unchanged, so nothing re-runs. This is accepted.
- A parameter such as `"Real-time simulation"` contains `-`. That is fine, because only the first `-` after the name splits name from parameters.
- Array elements that are not strings, such as `[1, true, null]`, become `"1"`, `"true"`, `"null"`. The length rule applies to the resulting string (`"1"` is whole-label only, `"null"` is partial).
- A partial term can match chips the link author did not intend, for example `java` matches `JavaScript / TypeScript` and `real` matches `Real-time simulation` and `Real-Time Systems`. This is accepted.
- A term with surrounding spaces, such as `" Qt "`, is trimmed before its length is measured.
- A browser shows the hash already decoded in `location.hash`. Assumption: decoding with `decodeURIComponent` once is safe because no chip label contains `%`. If decoding throws, FR-07 applies.
- No hash, or a normal anchor hash: the router does nothing.
- JavaScript is disabled: nothing happens and the page is unchanged.

**Error states:** see FR-07, FR-12 and FR-13. They never produce visible UI, only `console.warn`.

## 6. UI / UX
- Highlighted chips: solid `--my-primary-text` background with white text. They keep the same badge size and shape, and non-matching chips stay as they are.
- Chips appear in `#skills` (expertise cards and the "Full toolbox"), `#experience` (timeline) and `#projects-professional` (highlight cards). None are inside the closed `#more-projects` collapse, so no collapse needs to be opened.
- Scrolling respects the navbar height and `prefers-reduced-motion`.
- Accessibility: the highlight is visual only. Assumption: no screen-reader announcement is needed, and the text contrast meets WCAG AA.

## 7. Data model
- **Hash format:** `#exec-<name>[-<encodeURIComponent(JSON.stringify(array))>]`.
- **Registry:** a map from lowercase command name to `function (params: string[]): void`.
- No storage and no persistence.

## 8. Integration and technical notes
- **New file:** `hash-tools.js` at the project root.
  - Assumption: it is loaded from `index.html` `<head>` with `<script defer src="./hash-tools.js"></script>`, after the Bootstrap bundle, so it runs after the DOM is parsed.
  - Assumption: it is wrapped in an IIFE so it adds no globals, matching the style of the existing inline scripts.
  - It must not depend on `window.bootstrap`.
- **CSS:** the highlight class goes in `index.css`. Assumption: it gets a new block `/* Hash tools */` placed before `/* Bootstrap overrides */`, because the class applies across several sections and `CLAUDE.md` requires a new block for a new area. The rule must be specific enough to beat `.skill-chip`'s background and color.
- **Scroll offset:** chips are not `section[id]`, so the existing `scroll-margin-top` rule does not cover them. Assumption: the highlight class gets `scroll-margin-top: calc(var(--main-nav-height) + 1rem)` and the script calls `element.scrollIntoView({ block: 'start' })`. The existing `html { scroll-behavior: smooth; }` inside the reduced-motion media query then handles smooth scrolling.
- **Docs:** update the `CLAUDE.md` Overview ("just `index.html`, `index.css`, and `images/`"), the Scripts bullet ("there is no JS file") and the CSS organization bullet to mention `hash-tools.js` and the new CSS block.
- **Compatibility:** existing anchor links, the nav-menu inline script, the projects inline script and the footer script must keep working unchanged.

## 9. Non-functional requirements
- **Performance:** a single `querySelectorAll('.skill-chip')` pass per call (about 120 chips). The cost is negligible.
- **Security:** parameters are only compared to text and are never inserted into the DOM as HTML or evaluated. Only registered commands can run, and nothing in the hash can call an arbitrary function.
- **Logging:** `console.warn` only, with messages prefixed `[hash-tools]` (Assumption).
- **i18n:** not applicable.

## 10. Acceptance criteria
- [ ] Given the page is loaded with `#exec-highlight-%5B%22C%2B%2B%22%2C%22Qt%22%5D`, when it finishes loading, then every chip whose label contains `C++` and every chip labeled exactly `Qt` (ignoring case) is highlighted with a dark green background and white text, and the page has scrolled so the first such chip is visible below the navbar.
- [ ] Given `C++` chips are highlighted, when the hash changes to `#exec-highlight-%5B%22python%22%5D`, then the `C++` highlights are gone and the `Python` chips are highlighted.
- [ ] Given a highlight is active, when the visitor clicks a navbar link, then the highlight stays.
- [ ] Given `#exec-HIGHLIGHT-%5B%22qt%22%5D`, then the `Qt` chips are highlighted (command name and label match ignore case).
- [ ] Given `#exec-highlight-%5B%22c%2B%2B%22%5D`, then the `C++`, `C/C++` and `C / C++` chips are all highlighted.
- [ ] Given `#exec-highlight-%5B%22sql%22%5D`, then the `MySQL`, `NoSQL` and `SQL Server` chips are highlighted.
- [ ] Given `#exec-highlight-%5B%22C%22%5D` (1 character), then no chip is highlighted (`C / C++` and `C/C++` are not whole-label matches) and a `console.warn` names `C`.
- [ ] Given `#exec-highlight-%5B%22C%23%22%5D` (`C#`, 2 characters), then only chips labeled exactly `C#` are highlighted.
- [ ] Given `#exec-highlight-%5B%22%20qt%20%22%5D` (`" qt "`), then the term is trimmed to `qt` and only chips labeled exactly `Qt` are highlighted.
- [ ] Given a partial match and a whole-label match in the same call, then both chips have the same highlight look.
- [ ] Given a highlight is active, when the hash changes to `#exec-highlight-%5B%22Cobol%22%5D`, then no chip is highlighted, the page does not scroll, and a `console.warn` names `Cobol`.
- [ ] Given `#exec-highlight-%5B%22Qt%22%2C%22Cobol%22%5D`, then the `Qt` chips are highlighted and a `console.warn` names `Cobol`.
- [ ] Given `#exec-unknown-%5B%5D`, `#exec-highlight-notjson`, `#exec-highlight-%7B%7D` or `#exec-high_light-%5B%5D`, then the page is unchanged and a `console.warn` is logged.
- [ ] Given `#about`, `#projects`, or no hash, then the page behaves exactly as before the feature.
- [ ] Given the user prefers reduced motion, when a highlight runs, then the page jumps to the match instead of scrolling smoothly.
- [ ] `CLAUDE.md` describes `hash-tools.js`, the `#exec-` format and the `highlight` command.

## 11. Decisions log
| # | Question | Decision | Rationale |
|---|----------|----------|-----------|
| 1 | Purpose of `#exec-` links | Generic command registry | Extensible: new commands can be added over time |
| 2 | Commands in the first version | Only `highlight` (skills/chips) | User choice |
| 3 | Parameter format | URL-encoded JSON array after `exec-<function>-`; every element is a string | User's own format; handles `-`, `+`, `#`, `.` and `/` in labels |
| 4 | Chip matching | Case-insensitive; replaced by decisions 14–15 | Original exact-only rule superseded in the update |
| 5 | Highlight look | `--my-primary-text` background + white text | `#86af49` + white fails contrast (~2.5:1); this pair is ~5.9:1 |
| 6 | When it runs | On page load and on `hashchange`; scroll to first match; hash kept in URL | Shared links work; edits without reload work; reload re-applies |
| 7 | Invalid input | Ignore + `console.warn` | Visitors see nothing, the owner can debug |
| 8 | Persistence | Until the next `highlight` call or reload | Visitor can browse the highlighted page |
| 9 | Scroll target | First match in document order, below the navbar, smooth unless reduced motion | Same as the existing nav behavior |
| 10 | No chip matches | Clear the previous highlight, no scroll, warn | Consistent with "each call replaces the previous one" |
| 11 | Code location | New `hash-tools.js`; all future hash tools go there | User choice (overrides the "no JS file" convention) |
| 12 | Command name rules | Letters and digits, case-insensitive; ends at the first `-` after `exec-` | Unambiguous split; tolerant links |
| 13 | `CLAUDE.md` | Update it to document the feature | Keeps the project guide accurate |
| 14 | Partial matching for terms of 3+ characters | Plain case-insensitive substring of the trimmed label | User request ("c++" must match "C / C++"); simplest rule, accepts e.g. `sql` → `MySQL` |
| 15 | Short terms and how length is measured | Trimmed term shorter than 3 characters must equal the whole label; length counts all characters (`C++` = 3) | User request; character count fits the `c++` example |
| 16 | Look of partial vs whole-label matches | Same highlight class and look | One class, simple |

## 13. Future ideas
- More commands in `hash-tools.js`, for example opening and scrolling to a specific project (expanding `#more-projects`) or opening a section with extra behavior.
- A small helper or page that builds encoded `#exec-highlight-…` links from a list of skills.
