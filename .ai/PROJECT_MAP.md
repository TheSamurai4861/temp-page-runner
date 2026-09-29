# Project Map

## Purpose

Page Runner is a local browser toy for people viewing ordinary web pages. It generates a stepped physical route around selected DOM element top edges, with an original character and flag drawn over the recognizable page.

## Stack

| Area | Observed technology |
|---|---|
| Language | Plain JavaScript, HTML, CSS |
| Browser runtime | Chromium Manifest V3 extension; local fixture pages |
| Development runtime | Node.js 24 for syntax checks and local HTTP server |
| Dependencies | No runtime or package dependencies |

## Repository structure

```text
extension/         Manifest, action worker, and injected game script
fixtures/          Three controlled ordinary-page layouts
scripts/           Local fixture server
design/            Standalone sprite and world previews; not loaded by the extension
docs/              Current product direction and design notes
.ai/               Engineering method, task evidence, and verification contract
prompts/           Method prompts
```

## Entry points and flow

| Entry point | Responsibility |
|---|---|
| Extension toolbar action | Inject or toggle the game on the current tab |
| `extension/src/page-runner.js` | Scan DOM geometry; create overlays; run controls, physics, special-object state, drawing, and cleanup |
| `extension/src/terrain-generator.js` | Normalize DOM rectangles, simulate reachability, and build deterministic physical terrain |
| `extension/src/world-backdrop.js` | Frame the supplied local pixel backdrop as the page scrolls |
| `extension/src/knight-sprite.js` | Draw action-dependent knight frames |
| `extension/src/game-objects.js` | Draw the spring, rune tablet, and ascent rune |
| `npm run serve` | Serve controlled fixtures locally |
| Fixture G key | Explicitly inject the same game script for browser validation |
| `design/sprite-lab.html` | Preview candidate knight and special-object animations |
| `design/world-lab.html` | Preview the supplied backdrop at camera offsets and viewport sizes |

The worker calls `chrome.scripting.executeScript` after the user clicks the action. It injects the local renderers, terrain generator, then game script. A bounded DOM scan feeds the generator, which simulates jump reachability and inserts up to two overlay ledges between selected DOM anchors. The game draws the knight, rocky ledges, objects, and flag in a fixed shadow-root canvas. A negative-layer canvas displays the packaged copy of `input/background.png` behind page content while temporary styling makes root backgrounds transparent and adjusts a bounded set of low-contrast text nodes. A MutationObserver marks future terrain dirty; the game replans it after landing while preserving the current and completed surfaces. The manifest exposes only the PNG as a web-accessible resource with a dynamic URL. No state is persisted and no external service is called.

## Build and tests

Run `npm run check` for JavaScript syntax and deterministic generator tests. Run `npm run serve` and follow `.ai/VERIFICATION.md` for the browser flow. No bundler, CI pipeline, or deployment process exists.

The sprite and world labs remain design previews. The world lab and gameplay share `extension/src/world-backdrop.js`. The game uses the approved pixel drawings in `extension/src/knight-sprite.js` and `extension/src/game-objects.js`.

## Sensitive boundary and constraints

The extension has temporary `activeTab` access and the `scripting` permission. It does not declare broad host permissions. The game refuses pages with password or common payment fields, ignores editable targets, and performs no network calls or storage. Exit must remove both overlays and the temporary stylesheet/classes, restoring the page. Page layout compatibility is intentionally unproven beyond the fixtures.

## Open questions

- How often route generation fails on real pages, especially very long or dynamic layouts.
- Whether transformed, sticky, iframe, SPA, zoom, and resize behavior need support after observation.
- Which limited set of ordinary pages should define the next compatibility target.
- Which ordinary page layouts need a different world layering or contrast strategy.
