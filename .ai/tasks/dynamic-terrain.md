# Dynamic page terrain

## Intent / classification / risk

Turn DOM geometry into a deterministic, physical, stepped level with generated ledges and gaps while the original page remains recognizable. FEATURE, risk H: route correctness, DOM mutation, and page safety require incremental checks and independent review. Use `.ai/workflows/FEATURE.md` and the approved 2026-09-29 plan.

## Product decisions

- Draw terrain around DOM elements, leaving text and controls visible.
- Aim for 45–90 seconds on pages with enough content; do not guarantee every site.
- Keep a page's layout stable across restarts.
- Integrate DOM changes only at a grounded checkpoint; keep current and completed surfaces intact.
- No new permission, service, dependency, enemy, or mandatory power.

## Acceptance

- [x] Staircase, sparse, and dense controlled pages produce distinct physical terrain and a solver-validated route to a flag.
- [x] Generated ledges have collision and visible gaps; inspected slabs avoid readable content and controls on the fixtures.
- [x] The main route is winnable without the rune; spring, optional rune, respawn, restart, scroll, and exit still work.
- [x] Added/removed DOM content changes only the future route at a safe landing; the current surface does not vanish.
- [x] Deterministic generator tests cover duplicate anchors, dense/sparse/long/no-usable layouts, and impossible gaps.
- [x] Syntax/tests, headed-browser evidence, and independent review are recorded; unresolved compatibility gaps remain explicit.

## Incremental plan

1. Add a pure local terrain generator and physics reachability checks. Verify synthetic layouts.
2. Wire generated surfaces into drawing/collision and all three fixtures. Verify a full route in browser.
3. Add deferred mutation replanning and cleanup. Verify safe landing and exit.
4. Update project documentation, run full checks, obtain independent review, and present evidence for human acceptance.

## Evidence / review / acceptance

`npm run check` passes six deterministic tests and syntax/manifest checks. `git diff --check` passes. Browser runs on 2026-09-29 completed all three fixture routes with normal keys; staircase and dense grid completed without using the rune. Distinct routes: staircase 6 DOM + 5 generated surfaces / 8 hops; sparse 4 + 1 / 2 hops; dense grid 15 + 8 / 14 hops. Browser captures are in `output/playwright/terrain-*-start.png` and `terrain-*-win.png`. The staircase route also exercised spring, rune release and consumption, fall/respawn, restart, and exit cleanup. Future DOM removal/reinsertion was checked in flight and at grounded checkpoints; deleting every future card now gives an explicit no-route message, removes future platforms/goal, then recovers when cards return. A form/control insertion was checked before generation.

The independent H-risk review found ghost future platforms after a failed replan and form-containing candidate surfaces. Both were corrected and retested; the reviewer then found no further blocking issue. The solver uses the same dimensions and motion constants as gameplay, but its per-edge witness does not model every unrelated intermediate obstacle. Two ordinary-page probes produced one route (Wikipedia Platformer article, 163 DOM anchors, about 27 ms generation) and one explicit no-route result (W3C DOM Level 2 specification). MDN blocked direct injection by CSP; no bypass was attempted. Unpacked toolbar activation on ordinary pages, exceptionally long/infinite pages, complex transforms, frames, SPA navigation, zoom, and 45–90 second pacing remain unverified. Human product acceptance is pending.
