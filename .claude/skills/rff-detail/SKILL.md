---
name: rff-detail
description: Turn each step of ".rff/implementation-steps.md" (written by rff-breakdown) into a deep, implementation-ready design file ".rff/step-NN.md", one step at a time. Each step is designed in a fresh, clean context, reviewed with the user until approved, and only then does the next step start. Each file specifies the structure to build or change (files, classes, interfaces, enums, methods, attributes, or the stack's equivalents such as HTML sections, CSS classes and JS functions), the complex logic flows as mermaid diagrams, and exactly what must be tested, while keeping SOLID, DRY and Clean Code principles. Use when the user wants to detail, design, deepen or spec out the implementation steps of a feature request.
argument-hint: "[step ids, e.g. S03 or S02,S05 | path to implementation-steps file]"
---

# rff-detail

Turn the plan in `.rff/implementation-steps.md` into one detailed design file per step (`.rff/step-01.md`, `.rff/step-02.md`, ...), **one step at a time**:

1. Each step is designed in a **fresh, clean context** (a new subagent that knows only that step, the shared contract and the approved files it depends on).
2. The step is **reviewed** (by you, then by the user) and revised until the user approves it.
3. Only then does the **next step** start.

You are the orchestrator. Keep your own context light: you do not design steps yourself and you do not read the codebase in depth. The detailed design rules live in `step-design.md`, next to this `SKILL.md` (in this skill's base directory).

Design only. No step is implemented.

## 1. Load the plan

1. **Find the plan.**
   - If `$ARGUMENTS` contains a path to a `.md` file, use it.
   - Otherwise use `.rff/implementation-steps.md` at the project root. If several `implementation-steps*.md` files exist in `.rff/`, ask which one with `AskUserQuestion`.
   - If none exists, tell the user to run `rff-breakdown` first, and stop.
2. **Read the whole plan**: overview, layers, every step, stages, coverage and assumptions. Skim the source RFF it names, only enough to know its requirements and non-goals.
3. **Pick the steps to detail.**
   - If `$ARGUMENTS` lists step ids (`S03`, `S02,S05`, `S04-S07`), detail only those.
   - Otherwise detail every step that is not yet `approved` in the contract (section 2).
4. **Order them** by the plan's execution stages, then by step id, so every step comes after the steps it depends on. If a selected step depends on a step that is not approved yet, warn the user and offer to detail the dependency first.

## 2. Create or load the design contract

The contract, `.rff/design-contract.md`, is the memory shared by all the clean contexts. It is how one step's decisions reach the next step without carrying the whole conversation.

If it does not exist, create it from the plan (and a quick look at the files the plan names, only to confirm existing names):

```markdown
# Design Contract: <Feature name>

- **Plan:** [implementation-steps.md](implementation-steps.md)
- **Updated:** <YYYY-MM-DD>

## 1. Step status
| Step | Title | Status | File |
|------|-------|--------|------|
| S01 | ... | pending | - |

Status: pending | draft | approved

## 2. Shared items
Names that cross steps: types, interfaces, enums, DTOs, tables, routes, events, config keys; for front-end or static projects: element ids, CSS classes and variables, data attributes, JS functions, shared script or style regions.

| Item | Kind | Created by | Used / extended by | Notes |
|------|------|-----------|--------------------|-------|
| `#projects-more` | element id | S01 | S09, S10 | container |

## 3. Decisions
Cross-step decisions made during review, with the step where they were made.
- (S01) ...
```

Keep every name the plan already gives. If the plan contradicts itself or the code, ask the user with `AskUserQuestion` (recommended option first) before starting the loop, and record the answer under Decisions.

If the contract exists, read it, and resume: steps marked `approved` are skipped unless the user named them in `$ARGUMENTS`. If a requested step file already exists and is `approved`, ask whether to redo it or skip it.

## 3. The step loop

For each step, in order, run the full cycle below. Never start the next step before the current one is approved or explicitly skipped by the user.

### 3.1 Design in a clean context

Start a **new** subagent with the Agent tool (`subagent_type: general-purpose`; never `fork`, which would carry this conversation). Each step gets its own new subagent. Brief it with:

- The step id and title, and the output path (`.rff/step-NN.md`).
- Absolute paths to: `step-design.md` (in this skill's base directory), the plan, the source RFF, `.rff/design-contract.md`, and the **approved** step files of the steps this one depends on.
- The instruction: "Follow `step-design.md` exactly. Detail only this step. Write only the step file. Report back in the format at the end of `step-design.md`."
- Any user decisions relevant to this step that are not yet in the contract.

Do not paste the plan, the code or other step files into the brief; the subagent reads what it needs from the paths. Keep its agent id: revisions go back to the same subagent.

Set the step's status to `draft` in the contract.

### 3.2 Review it yourself

When the subagent reports, read the step file and check:

- It covers every requirement and acceptance criterion the plan gives this step, and each has a test or check.
- Names, ids and paths match the contract, the plan and the dependency step files.
- Shared items are defined in full only by the step that creates them; other steps reference them.
- The design respects SOLID, DRY, Clean Code and keep-it-simple, at the scale of this project (no over-engineering).
- Mermaid diagrams exist for the non-trivial logic and their syntax is valid.
- Nothing belongs to a non-goal or to another step.

If something fails, send the problems back to the same subagent with `SendMessage` and wait for the corrected file. Repeat until your review passes (at most 3 rounds; then bring the remaining issues to the user).

### 3.3 Review it with the user

Present the step to the user:

- A clickable link to the step file.
- The subagent's summary (3 to 6 bullets), the shared items it creates, the contract changes it proposes and its open questions.

Then ask with `AskUserQuestion` (one question, plus up to three for the subagent's open questions or proposed contract changes, each with options and your recommendation first):

- **Approve**: the step is final.
- **Revise**: the user gives feedback ("Other" or a follow-up message).
- **Redo from scratch**: discard and redesign in a brand-new subagent, with the user's guidance.
- **Skip for now**: leave it as `draft` and move on (only if no later selected step depends on it).

On **Revise**, send the user's feedback, in their words, to the same subagent with `SendMessage`, then repeat 3.2 and 3.3. Loop until the user approves.

### 3.4 Close the step

When the user approves:

1. Update the contract: status `approved` with the file link, add or update the shared items this step creates or extends, and record the decisions made during review.
2. If an approved decision changes something a later step relied on, note it in the contract so the next subagents see it.
3. Tell the user in one line that the step is approved and which step comes next, then start 3.1 for the next step.

The contract is the only thing carried forward: the next step's subagent starts clean and learns about earlier steps only through the contract and the approved files it depends on.

## 4. Finish

When every selected step is approved or skipped:

- List the step files, as clickable markdown links, with one line each and their status.
- List the cross-step decisions recorded in the contract, any steps left as `draft`, and any problems found in the plan (for example a missing dependency) that the user may want to fix with `rff-breakdown`.

## Fallback without subagents

If the Agent tool is not available, still work one step at a time: design the step yourself by following `step-design.md`, run 3.2 and 3.3, close it with 3.4, and then tell the user to clear the context (`/clear`) and run `rff-detail` again. The contract makes the next run resume at the next pending step.

## Guidelines

- One step at a time, always. No parallel subagents, no batching of steps.
- The plan is the source of truth for scope and ownership. If the design shows the plan is wrong, record it in the contract and report it; do not silently change the plan.
- Forward the user's feedback faithfully; do not reinterpret it.
- Write in the same language as the plan.
