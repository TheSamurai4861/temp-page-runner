# Verification Contract

## Principle

Every claim of success must be supported by evidence appropriate to the task. Verification exists to demonstrate that the intended outcome was achieved without introducing unacceptable regressions. Evidence must correspond to the task's acceptance criteria.

---

## Evidence categories

Depending on the task, verification may include formatting, linting, static analysis, type checking, unit tests, integration tests, end-to-end tests, build validation, benchmarks, targeted manual validation, security scans, compatibility checks, migration dry-runs, and project-specific checks. Not every category is required for every task. The required evidence depends on task type, risk level, affected surface, acceptance criteria, known failure modes, and project-specific constraints.

---

## Verification levels

### FAST

Purpose: provide a short feedback loop during implementation. `FAST` should run the smallest useful set of checks that can catch likely defects quickly. Typical candidates include formatting checks, lint, type checking, targeted unit tests, tests for the modified component, and lightweight static analysis. `FAST` does not replace final validation for significant tasks.

### FULL

Purpose: validate a significant change before review or human acceptance. `FULL` should include all checks materially relevant to the task and project. Depending on the project, it may include full formatting validation, lint, static analysis, type checking, unit tests, integration tests, end-to-end tests, build, security checks, compatibility validation, benchmarks, migration dry-runs, and required targeted manual validation. For `M` and `H` tasks, `FULL` verification is expected unless the task documents why a specific check is not applicable or unavailable.

---

## Verification rules

1. **Never hide a failure.** A failing check must remain visible until it is resolved, explicitly accepted, or documented as unrelated with sufficient evidence.
2. **Never disable a test merely to obtain a green result.** A test may only be changed or removed when its expectation is demonstrably incorrect, obsolete, or intentionally changed by the task.
3. **Do not invent missing controls.** If the project does not currently provide a required verification mechanism, state that limitation explicitly.
4. **Passing tests do not automatically mean the task is complete.** Automated tests are evidence, not final proof of correctness.
5. **Evidence must map to acceptance criteria.** Important criteria must have a corresponding verification method.
6. **Use the narrowest useful check during iteration and broader checks before acceptance.**
7. **Do not weaken verification to accommodate the implementation.** If verification exposes a real defect, fix the defect or revisit the plan.
8. **Record material gaps.** Missing tests, unavailable environments, inaccessible services, or unverifiable claims must be stated explicitly before acceptance.

---

## Acceptance evidence

Before a task can be considered complete, record relevant commands, checks, test results, build results, benchmark results, security results, compatibility results, manual observations, and known gaps or limitations. For significant tasks, the evidence should be sufficient for an independent reviewer to understand how the result was validated.

---
# Project-specific configuration

## FAST verification

Command: `npm run check`.

This parses the game script, three local renderers, extension worker, and fixture server. It does not validate browser behavior.

## FULL verification

1. Run `npm run check`.
2. Run `npm run serve` and open `http://127.0.0.1:4173/fixtures/staircase.html` in a headed desktop browser.
3. Press G. Confirm the original knight and the supplied `input/background.png` behind readable page content, flag, five DOM platforms, zero helpers, one spring pad, and one rune tablet. The overlay host exposes platform counts, `data-world-ready`, and `data-world-zoom` for diagnostics.
4. Jump and observe player Y decrease, then return to the card top with `data-grounded="true"`; inspect `data-sprite-state` for movement and air states.
5. Land on the spring pad on card two. Confirm a stronger upward launch and `data-sprite-state="spring"`.
6. Touch the rune tablet near card three. Confirm `data-tablet-used="true"` and `data-pickup-visible="true"`. Touch the rune and confirm `data-rune-ready="true"`; jump again and confirm it is consumed.
7. Restart, then move through the page without the rune. Confirm scroll position increases, touch the flag, and confirm the win card and `data-completed="true"`.
8. Press R and confirm the player returns to the start, the tablet re-arms, and completion clears. Walk off the first card and confirm `data-fall-respawns` increases.
9. Press Escape. Confirm both overlay hosts, temporary style, and contrast classes are gone; the original body background and ArrowDown scrolling return.
10. Open `/fixtures/sparse.html`, press G, and confirm overlay-only helper platforms appear while the page remains readable. Exit and confirm restoration.
11. Inspect `extension/manifest.json` and the injected scripts for permission scope, storage, network calls, and page modifications.
12. For art review, open `/design/sprite-lab.html` and `/design/world-lab.html` in a headed browser. Inspect native sprite states and the supplied image at top, deep, and narrow viewport crops. Compare the packaged PNG hash with `input/background.png`. These labs supplement, but do not replace, gameplay checks.

A screenshot is needed for the visual claim. The extension action on a non-fixture page is a separate compatibility spot check. No formatter, linter, type checker, unit suite, benchmark, CI, or build step is configured. This is a known verification limit, not a passing result.
