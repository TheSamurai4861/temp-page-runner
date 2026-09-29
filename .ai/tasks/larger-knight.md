# Larger playable knight

## Intent and classification

Make the knight easier to see while the user tries Page Runner. Type: FEATURE. Risk: M because changing the player's size can affect landings, special-object contact, and the flag route. Workflow: `.ai/workflows/FEATURE.md`.

## Current and expected behavior

The native procedural sprite and game collision box are 18 x 24 pixels. Keep the original artwork and its eight action states, but render it at 24 x 32 pixels in gameplay and use the same dimensions for collision. The standalone sprite lab remains a native-size art preview.

## Scope and non-goals

Change the gameplay sprite size and collision dimensions, update the size documentation, and give the user a direct test path. Do not change movement speed, jump strength, level generation, power behavior, or sprite design.

## Constraints and human decisions

The user requested a slightly larger knight and wants to test the game. A 4/3 scale is an ordinary reversible implementation choice; no further product decision is needed. Preserve hard pixel edges and the existing local-only extension behavior.

## Acceptance criteria and verification

- [x] The knight appears at 24 x 32 pixels in gameplay, with pixel edges and all action states intact. Inspect the renderer and a headed browser screenshot.
- [x] His visible feet and collision feet land together on DOM-derived platforms. Jump and land on the staircase fixture, inspect coordinates and grounded state.
- [x] The larger knight can still traverse the staircase and reach the flag. Play the controlled route to `data-completed=true`.
- [x] Restart and exit still work; the sparse fixture starts with helper platforms. Verify in browser.
- [x] `npm run check` and `git diff --check` pass.

## Plan

1. Apply one gameplay scale factor to sprite rendering and physical width/height.
2. Run syntax checks, visually inspect the start, then traverse to the flag.
3. Verify restart, exit, and sparse route; update the user instructions and record evidence.

## Evidence and review

- The 18 x 24 source sprite is drawn into a small buffer and enlarged with nearest-neighbor rendering. The 4/3 scale gives a 24 x 32 visual and collision box. All animation states still use the same sprite renderer.
- Headed browser captures: `output/playwright/larger-knight-start.png`, `larger-knight-win.png`, and `larger-knight-sparse.png`. The first and last show the knight's feet aligned with a real card top; the sparse page shows overlay helpers.
- On the 1280 x 720 staircase, a jump from the first card landed on the second at player Y=532, exactly 32 pixels above its top at Y=564. The player then landed on cards three, four, and five and reached `data-completed=true` at X=1065, Y=1162. The route used five DOM platforms and zero helpers.
- A missed first jump caused a safe respawn. Restart after movement reset X from 210 to 131, Y to 322, and cleared completion. Escape removed game/world/style nodes. The sparse fixture started with four DOM platforms and four helpers at this viewport.
- `npm run check` and `git diff --check` passed. The visual change and controlled route were reviewed in a headed browser; ordinary-site compatibility remains unproven.

## Human acceptance

Pending user test.
