# Project-specific configuration

## FAST verification

Run `npm run check`. This parses the injected scripts and manifest and runs deterministic terrain-generator tests with Node's built-in test runner. It does not establish browser playability.

## FULL verification

1. Run `npm run check` and `git diff --check`.
2. Run `npm run serve`. In a headed browser, activate G on `/fixtures/staircase.html`, `/fixtures/sparse.html`, and `/fixtures/dense-grid.html`. Confirm different DOM/terrain counts, visible physical stone ledges and gaps, readable page content, and `data-terrain-route` diagnostics.
3. Complete each generated route to `data-completed="true"` using normal controls. Confirm the main route works without a rune; on staircase also trigger the spring, collect the optional rune, and consume it with a jump.
4. Walk off a surface to verify respawn; press R to verify restart preserves the deterministic layout and resets completion and reward. Press Escape and verify both overlay hosts, temporary style and classes are removed.
5. While airborne, add or remove a future DOM element. Verify `data-terrain-generation` stays fixed until landing, then increments while the player's current landing surface remains stable. Focus an input to verify immediate exit.
6. Check generated slabs against visible text and controls. Inspect manifest permissions and confirm there is no external page-data transfer or persistent storage.
7. Spot check ordinary eligible pages and record both successes and failures. A page with no validated route should show a clear message rather than an unreachable flag. An installed toolbar action on a non-fixture page remains a separate compatibility check.

Observed on 2026-09-29: a Wikipedia article produced a route from 163 DOM anchors in about 27 ms. A W3C specification page produced the explicit `no-route` result; its long, wide text layout did not give the current extractor a usable sequence. Direct script injection on MDN was blocked by CSP and was not bypassed. These checks do not establish installed-extension compatibility on those sites. The first 2,500 scanned nodes bound startup cost but can omit distant sections of very long pages.

Visual claims need screenshots. Existing `design/sprite-lab.html` and `design/world-lab.html` remain art previews. No bundler, CI pipeline, or universal site-compatibility suite is configured.
