# Page Runner: first playable slice

## Intent
Make the structure of an ordinary webpage feel like a small, immediately understandable platform game: a tiny original character crosses real page elements and reaches a flag.

## Classification
- Type: GREENFIELD (security and interaction design are secondary concerns).
- Risk: H. The project chooses a browser injection boundary and handles keyboard input on third-party pages. These choices need explicit constraints, incremental verification, and independent review.
- Workflow: `.ai/workflows/GREENFIELD.md`.

## Current behavior
The repository contains only engineering-method documents and prompts. There is no application, build, test, or deployment pipeline.

## Product vision and expected behavior
For a person viewing an ordinary non-sensitive webpage, explicit activation draws a small game over the recognizable page. Selected DOM rectangles are platforms. Arrow/A-D movement and a jump cross them, page scrolling follows the character, and a reachable flag completes the run. Exiting restores normal interaction.

## Scope
MUST: one controlled page, user activation, deterministic platform extraction, original procedural pixel art, horizontal movement, jump/gravity/top-surface collision, page following, a flag, respawn, completion, clean exit. SHOULD within the MVP: a minimal helper platform only if needed to connect a short route on sparse pages, a second fixture, resize handling. LATER: broader compatibility work based on observed failures.

## Non-goals
Enemies, combat, coins, power-ups, accounts, analytics, backend, level editor, mobile/gamepad controls, iframe traversal, global site compatibility, polished art, publishing.

## Constraints
- All geometry and state stay local; no page contents are transmitted or stored.
- Explicit user initiation. Browser permission scope is `activeTab` plus `scripting`; no persistent host permissions.
- The webpage stays visible and its styles are not rewritten. The game layer is removed completely on exit.
- Keyboard capture is limited to active game controls; editable/input targets must keep normal behavior.
- Avoid login, payment, and other sensitive form flows.
- No runtime dependencies for the slice.

## Understanding and unknowns
There is no existing code or verification command. Real-world page geometry, sticky elements, SPA navigation, transformed elements, zoom, very long/infinite pages, and aggressive z-index remain unknown. The first slice is measured on controlled fixtures, with compatibility limits documented rather than assumed away.

## Consequential decisions
- Human direction already establishes a local browser toy, visible source webpage, original art, and flag objective.
- Proposed architecture: a dependency-free content script injected by a Manifest V3 action using temporary `activeTab` access. The same script runs on local fixtures for fast validation. The overlay is a fixed canvas in a shadow root; it reads DOM boxes but does not change page content or styles. This is the smallest route to testing both the interaction and future arbitrary-page activation. Packaging for other browsers is deferred.
- No irreversible product or data decision is required for this local prototype. Publication would require separate human approval.

## Acceptance criteria and verification
- [x] On a controlled page, explicit activation shows the original character, DOM-derived platform markers, and goal while original content remains readable. Verified by browser screenshot and extraction diagnostics.
- [x] Left/right and jump produce responsive motion; falling lands on DOM-derived top surfaces. Verified by browser input and position/platform observations.
- [x] Page scroll follows a player beyond the first viewport. Verified by browser input and observing scroll position increase.
- [x] The chosen flag is reachable on the fixture and touching it shows completion. Verified by an end-to-end browser run and screenshot.
- [x] Falling respawns at the latest safe position or start; restart works. Verified by targeted browser interaction.
- [x] Exit removes overlay/listeners and normal page keyboard/scroll behavior resumes. Verified by DOM and interaction observations.
- [x] Local extension uses no network calls, persistent storage, or broad host permissions. Verified by source/manifest inspection.
- [x] The project has documented repeatable verification commands and a second layout fixture. Verified by running those commands and inspecting both layouts.

## Risks
DOM boxes may be over-filtered or create an impossible course; page CSS can overlap the overlay; browser input interception can disrupt forms; camera scrolling can shift geometry; injected scripts can be blocked on browser-controlled pages. Limit the first claim to tested pages.

## Incremental plan
1. Create the content script and a controlled fixture. Verify extraction and on-screen drawing.
2. Add fixed-step physics, collision, keyboard lifecycle, and scrolling. Verify one traversable run.
3. Add pragmatic route/goal selection, sparse-page helpers, respawn, completion, and clean exit. Verify two fixtures.
4. Add the thin extension wrapper, documented commands, and targeted automated checks. Perform full browser validation and independent review.

## Evidence
- `npm run check` passed for the game, worker, and local server.
- Headed Playwright on `staircase.html`: five DOM-derived platforms, zero helpers; screenshot shows character standing on the first real card. Space moved player Y from 334 to 256 after 180 ms, then it returned to Y 334 with `grounded=true`.
- Moving through the cards raised `scrollY` to 761. Touching the flag set `completed=true` and showed the win card in a screenshot.
- R cleared completion and returned to the start. Walking off the first card increased `fallRespawns` to 1. Escape removed the overlay, then ArrowDown scrolled the page 40 px.
- Headed Playwright on `sparse.html`: two DOM platforms and four overlay-only helpers; screenshot shows source content still visible.
- Source inspection: manifest permissions are `activeTab` and `scripting`, with no broad host pattern; game and worker contain no fetch, storage, or telemetry calls.
- Playwright screenshots: `output/playwright/staircase-start.png`, `staircase-complete.png`, and `sparse-helpers.png`.
- Editable input and empty-attribute contenteditable tests: ArrowRight and Escape reached the focused editable element and the game remained active.
- Limits: the extension toolbar action has not yet been exercised as an installed extension on an unrelated page. The route heuristic is proven only on the two fixtures.

## Review
Independent review found two keyboard issues: Escape initially bypassed the editable guard, and the guard missed valid contenteditable states. Both were fixed and verified in a headed browser; `npm run check` passes afterward. The reviewer found the architecture suitably small and confirmed the controlled visual evidence. The toolbar action as an installed extension remains an explicit compatibility evidence gap.

## Human acceptance
- Accepted: No; candidate implementation and evidence will be presented for human judgment.
