# Rune and spring vertical slice

## Intent and classification
Add one optional knightly interaction to the existing page-to-level loop: a spring on a real page surface and an original rune tablet that awards one empowered jump. Type: FEATURE. Risk: H because route behavior and arbitrary-page overlays can regress playability; use `.ai/workflows/FEATURE.md`, incremental verification, and independent review.

## Current behavior
The game now draws the accepted knight and dark fantasy world on the controlled staircase. Its route is five real DOM platforms with no special surfaces. The sprite lab contains validated candidate art for a spring, tablet, and ascent rune, but those objects are not yet part of gameplay.

## Expected behavior and scope
- Select at most one reachable natural route platform for a small spring pad and one later natural route platform for a rune tablet.
- Draw special objects only in the game canvas, aligned to DOM-derived geometry; do not alter page elements.
- Landing on the pad launches the knight upward with a short spring pose.
- Touching the tablet releases an ascent rune. Touching the rune stores one empowered jump; using that jump consumes it.
- The normal route and flag remain reachable without these objects.
- Restart resets object state; exit removes everything.

## Non-goals and constraints
No combat, enemies, weapon mechanics, inventory, persistent rewards, new permissions, or mandatory special-object use. Sparse pages may have no eligible specials. Do not place an object over forms or editable controls. Keep platform selection deterministic.

## Acceptance and verification
- [x] On the staircase fixture, one pad and one rune tablet appear anchored to different real cards, with no mutation of card content or geometry. Inspect screenshot and DOM/style diff.
- [x] A landing on the pad produces a stronger upward velocity and spring animation. Inspect player coordinates/state in a headed browser.
- [x] Touching the tablet changes it to its used state and releases one rune; collecting the rune arms one jump, and jumping consumes it. Inspect visual and diagnostic state.
- [x] The player can still traverse to the flag without collecting the rune. Verify end to end.
- [x] Restart re-arms the objects; exit restores the page. Verify keyboard flow and after-exit state.
- [x] `npm run check`, full relevant browser checks, and independent review pass. Human acceptance remains separate.

## Plan
1. Add shared small procedural object drawings and inject them before the game; verify sprite rendering alone.
2. Choose sparse, deterministic overlay placements from route platforms and add collision/one-use state. Verify on staircase.
3. Verify the original flag route, restart, exit, and sparse fixture; document limits and review.

## Evidence and review
- `output/playwright/image-game-start.png` shows the spring pad on card two and the rune tablet above card three with the supplied background. They are canvas drawings; the cards' DOM structure remains intact.
- `output/playwright/mechanics-rune-released.png` and `mechanics-rune-jump.png` were captured while the earlier procedural backdrop was still in use, so they show a world that the current build no longer draws. The mechanics they demonstrate are unchanged, and the recorded state transitions still describe the same code paths.
- Spring landing samples showed the knight rise from document Y=524 through 473 and 435 to 408 while `data-sprite-state="spring"`.
- Tablet touch set `data-tablet-used="true"` and `data-pickup-visible="true"`; `output/playwright/mechanics-rune-released.png` shows the rune. Collecting set `data-rune-ready="true"`; the next jump cleared it. Browser diagnostics recorded the transition.
- A separate run reached `data-completed="true"` at the flag with `data-tablet-used="false"` and `data-rune-ready="false"`; `output/playwright/image-game-win.png`.
- R reset completion and tablet state. Escape removed overlays and restored the original background. Sparse fixture had two natural platforms and four helpers; no special object was placed on a helper.
- `npm run check` and `git diff --check` passed. Independent review found that selected cards could contain controls, allowing specials to overlap them. The selection now excludes links, buttons, form/editable controls, and their role equivalents as surfaces or descendants. In a browser check, adding controls to the second and third cards disabled both specials while retaining five DOM platforms. The reviewer rechecked this fix and found no further concrete defect.
- The reviewer also identified a fixture activation race; repeated G presses now leave one active game and G followed by Escape during loading leaves none.
- A non-fixture extension spot check remains unverified. The acceptance evidence is for the controlled vertical slice.

## Independent review (fresh context, 2026-09-29)

Reviewed: this contract, the complete diff of `extension/src/page-runner.js`, the new `game-objects.js`, both fixtures, `background.js`, `manifest.json`, `package.json`, and the cited captures. The reviewer read the code paths and inspected `image-game-start.png`, `image-game-win.png`, `mechanics-rune-released.png`, and `staircase-start.png` directly instead of accepting the recorded conclusions. Runtime claims were not re-executed; see Missing evidence. The reviewer shares the builder's model family, so this is one validation layer, not human acceptance.

Criterion 6 is recorded as passing. This review raises two MEDIUM findings the builder did not record, so that line should be read together with this section. Both were corrected in the working tree after the review, at the human's direction; the corrections have not been browser-verified and were not independently re-reviewed.

### [MEDIUM] `R` restart does not reset the checkpoint — corrected 2026-09-29

- **Type:** FACT
- **Blocking:** NO — recommended before acceptance
- **Evidence:** `respawn(true)` reassigns `player` from `start` and resets the tablet, pickup, rune, and pose timers, but `checkpoint` keeps the last landing position written in the landing branch of `update()`. `checkpoint` is otherwise written only by `buildRoute()` at activation.
- **Why it matters:** after restarting mid-route, the first fall returns the knight to the pre-restart position, so a restart does not restart the run. The recorded check pressed R from the start, which hides the effect.
- **Recommended action:** add `checkpoint = { ...start };` to the `fromStart` branch.
- **Status:** Corrected in the working tree at the human's direction; `checkpoint = { ...start };` is now the first statement of the `fromStart` branch of `respawn()`. Not yet re-verified in a browser, and not independently re-reviewed: the acceptance run should restart mid-route, fall once, and confirm the knight returns to the start pose.

### [MEDIUM] Special objects can be anchored to the goal platform — corrected 2026-09-29

- **Type:** RISK
- **Blocking:** NO — recommended before the compatibility slice
- **Evidence:** `spring` uses `route[1]` and `tablet` uses `route[2]`. The route loop advances by at least 420 px and each step moves at most 300 px, so the route always holds at least three platforms and `route[1]` is never the goal. `route[2]` is the goal whenever the threshold is reached on the second step (a route that stops while it holds exactly three platforms), which needs the two selected platforms to advance the route by about 420 px or more. With a 150 px goal platform the tablet spans x offsets 83-103 and the flag pole starts at 97.5.
- **Why it matters:** on those pages the tablet sits on the goal platform and its graphic overlaps the flag pole and the left edge of the flag. Completion still works, since the flag test runs on any frame regardless of grounding, but two objects claim the same platform. Neither fixture shows it: the staircase route is five platforms, and the sparse route steps are overlay helpers, which the selection correctly excludes.
- **Recommended action:** exclude the goal platform from special bases, or require a route long enough that `route[2]` cannot be the goal.
- **Status:** Corrected in the working tree at the human's direction; `buildRoute()` now derives `goalPlatform` from the last route platform and both bases require `route[n] !== goalPlatform`. On a route that stops with three platforms the tablet is therefore no longer placed and `data-tablet` reports `false`. The fixtures cannot exercise the case, so this correction rests on code reading, and the contract on line 10 already asked for a later platform, which the code now honours. The recorded staircase evidence stays valid, because its five-platform route never put `route[2]` on the goal.

### [MEDIUM] Mechanics evidence predates the supplied backdrop

- **Type:** FACT
- **Blocking:** NO
- **Evidence:** `mechanics-rune-released.png` and `mechanics-rune-jump.png` show the procedural dark fantasy renderer, while `image-game-*.png` show the supplied PNG. Both files are listed above without a date or a stale marker.
- **Why it matters:** a reviewer or the human accepting the task can read the older capture as the current integrated state.
- **Recommended action:** mark the two files as captured before the backdrop replacement, or re-capture the rune sequence under the current build.

### [LOW] Special placement is not verifiable from diagnostics

- **Type:** SUGGESTION
- **Blocking:** NO
- **Evidence:** the host exposes `data-spring` and `data-tablet` as booleans but no coordinates or anchor identity, so "anchored to different real cards" can only be checked by eye.
- **Recommended action:** expose an anchor index or coordinates, for example `data-spring-anchor` and `data-tablet-anchor`.

### [LOW] The controls-exclusion check is not reproducible from the repository

- **Type:** FACT
- **Blocking:** NO
- **Evidence:** the recorded browser check added controls to route cards by editing the fixture; the committed fixtures contain no controls.
- **Recommended action:** add a fixture, or a documented snippet, with a link or button inside a route card so the exclusion stays testable.

### Verified and not reported as defects

- `safeSurface` excludes links, buttons, form controls, role equivalents, and helper platforms.
- The spring is anchored by platform identity (`landing === spring.platform`), so it cannot fire from a helper or an unrelated surface.
- Restart re-arms the tablet and clears the pickup, rune, cooldown, and pose timers; exit removes the overlay, the world host, the temporary stylesheet, and every contrast class.
- The rune is consumed on the next jump input in the same frame, and the boosted velocity is 1.25 x.
- The game script contains no network, storage, or telemetry call.
- Duplicate goal drawing was suspected from the left-hand amber shapes in the captures and then discarded: `staircase-start.png` (no backdrop) shows no such shape, and `image-game-win.png` shows one flag at the goal on the fifth card. Those shapes belong to the supplied artwork.

### Missing evidence

- The browser flow was not re-executed, so the diagnostic transitions and the acceptance checks that depend on live state rest on the builder's captures.
- The two corrected defects have not been browser-verified. The human acceptance run is the first live check of both, and the goal-platform case is not reachable from either committed fixture.
- No automated coverage exists for object placement, the spring launch, the pickup, or restart state.

## Human acceptance
Pending.
