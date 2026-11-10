# Design Contract: hash-exec

- **Plan:** [plan.md](plan.md)
- **Updated:** 2026-11-10

## 1. Step status
| Step | Title | Status | File |
|------|-------|--------|------|
| S01 | Exec hashes are parsed and dispatched to a command registry | approved | [step-01.md](step-01.md) |
| S02 | Highlighted-chip look | approved | [step-02.md](step-02.md) |
| S03 | `highlight` command marks matching chips and scrolls to the first | approved | [step-03.md](step-03.md) |

Status: pending | draft | approved

## 2. Shared items
Names that cross steps: element ids, CSS classes and variables, JS functions and objects, shared script or style regions, doc regions.

| Item | Kind | Created by | Used / extended by | Notes |
|------|------|-----------|--------------------|-------|
| `hash-tools.js` | file | S01 | S03 | single IIFE, no globals, loaded with `defer` from `<head>` right after the Bootstrap bundle; internal order: helpers, `// Commands` region, `// Router` region |
| `commands` | JS registry object | S01 | S03 | `Object.create(null)` at the top of the IIFE; lowercase keys; commands added as `commands.<name> = function (params) { … };` inside `// Commands`; called with a non-null `string[]` (possibly empty, not trimmed); exceptions caught and warned |
| `warn` | JS function | S01 | S03 | `warn(...args)` → `console.warn('[hash-tools]', ...args)` |
| `// Commands` | JS region in `hash-tools.js` | S01 | S03 | where commands are registered (empty after S01) |
| `// Router` | JS region in `hash-tools.js` | S01 | - | parse, validate, dispatch; initial run + `hashchange` listener |
| `[hash-tools]` | log prefix | S01 | S03 | every warning from the file starts with it (via `warn`) |
| **Hash tools** bullet | `CLAUDE.md` region | S01 | S03 | right after the Scripts bullet; commands append one sentence each |
| `.skill-chip-highlight` | CSS class | S02 | S03 | selector `.skill-chip.skill-chip-highlight`; add/remove on a `.skill-chip` is the whole on/off switch; includes `scroll-margin-top: calc(var(--main-nav-height) + 1rem)` |
| `/* Hash tools */` | CSS block in `index.css` | S02 | S03 (referenced in docs) | right before `/* Bootstrap overrides */`; styles used by `hash-tools.js` commands |
| `highlight` | registered command | S03 | - | `commands.highlight`; only code that adds/removes `skill-chip-highlight` |
| `.skill-chip` | CSS class | existing | S02, S03 | every tech chip; label is its `textContent` (rule in `index.css` line ~111) |
| `--my-primary-text`, `--main-nav-height` | CSS variables | existing | S02 | text green `#4f6e24`; navbar height `3.5rem` |

## 3. Decisions
Decisions approved during a step's review, each about that step's own work only.
- (S01) Router check order: name, then params (decode, JSON parse, array check), then registry lookup, then call; each failure logs exactly one `[hash-tools]` warning.
- (S01) Registry lookup only dispatches own entries that are functions (`Object.create(null)` + `typeof === 'function'`), so names such as `constructor` are "unknown command".
- (S01) Exact warning texts are as written in step-01.md.
- (S02) `.skill-chip.skill-chip-highlight` overrides `.skill-chip` by specificity (0,2,0), no `!important`; it changes only `color`, `background-color` and `scroll-margin-top`.
- (S02) The `CLAUDE.md` CSS organization bullet lists `/* Hash tools */` after `/* Education */` and states its classes are the exception to the one-section rule for classes (sentence placed after "Classes created for a section are used only inside that section.").
- (S03) `highlight` clears and sets the highlight in one `querySelectorAll('.skill-chip')` pass with `classList.toggle`; every chip is tested against every term (no early break).
- (S03) Scroll is `scrollIntoView({ block: 'start' })` with no `behavior` option; motion comes from the existing reduced-motion `html` rule.
- (S03) Warnings: one `highlight: no chip matches "<param>"` per unmatched term, quoting the untrimmed param; an empty list logs one `highlight: no terms given, highlight cleared` and returns. Exact texts as in step-03.md.
