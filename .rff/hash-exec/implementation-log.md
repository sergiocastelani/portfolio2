# Implementation Log

- **Updated:** 2026-11-10
- **Branch:** `hash-exec` (baseline `fb5da30`); checkpoint mode: commit each step

| Step | File | Status | Rounds | Checkpoint | Notes |
|------|------|--------|--------|-----------|-------|
| S01 | [step-01.md](step-01.md) | done | 1 | `6156686` | no deviations; no needs-human checks |
| S02 | [step-02.md](step-02.md) | done | 1 | `5a6505d` | no deviations; reduced-motion check was marked needs-human by the implementer but verified by the reviewer via CDP emulation, so nothing deferred |
| S03 | [step-03.md](step-03.md) | done | 2 | (pending commit) | round 1 failed (first match landed under the navbar on cold smooth loads); fixed by waiting for `document.fonts.ready`; reduced-motion verified by the reviewer via CDP, nothing deferred |

Status: pending | in-progress | done | skipped | blocked

## Deviations
Deviations from a step file's implementation suggestions, as reported by its implementer and accepted by its reviewer.
- (S03) The scroll to the first match runs inside `document.fonts.ready.then(...)` instead of immediately, so a late Bootstrap Icons font load cannot leave the chip under the navbar during a smooth scroll. The call is still `scrollIntoView({ block: 'start' })` with no `behavior` option. It now runs outside the router's try/catch, which is harmless because `scrollIntoView` does not throw.

## Checks pending for the user
`needs-human` checks, collected from each step and verified by the user only after the run (section 4).
