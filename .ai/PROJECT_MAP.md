# Project Map

## Purpose

Page Runner is a local browser toy for people viewing ordinary web pages. It turns selected DOM element top edges into a short platform route, with an original character and flag drawn over the recognizable page.

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
fixtures/          Two controlled ordinary-page layouts
scripts/           Local fixture server
.ai/               Engineering method, task evidence, and verification contract
prompts/           Method prompts
```

## Entry points and flow

| Entry point | Responsibility |
|---|---|
| Extension toolbar action | Inject or toggle the game on the current tab |
| `extension/src/page-runner.js` | Scan DOM geometry; create overlay; run controls, physics, drawing, and cleanup |
| `npm run serve` | Serve controlled fixtures locally |
| Fixture G key | Explicitly inject the same game script for browser validation |

The worker calls `chrome.scripting.executeScript` after the user clicks the action. The injected script reads selected element boxes, derives a short route, and draws a fixed canvas inside a shadow root. Game state and collision geometry are ephemeral in the page. A small number of helper platforms may exist in the overlay when selected DOM platforms leave gaps. No state is persisted and no external service is called.

## Build and tests

Run `npm run check` for JavaScript syntax. Run `npm run serve` and follow `.ai/VERIFICATION.md` for the browser flow. No bundler, CI pipeline, unit suite, or deployment process exists.

## Sensitive boundary and constraints

The extension has temporary `activeTab` access and the `scripting` permission. It does not declare broad host permissions. The game refuses pages with password or common payment fields, ignores editable targets, and performs no network calls or storage. The overlay must be removable without rewriting page styles. Page layout compatibility is intentionally unproven beyond the fixtures.

## Open questions

- How often route generation fails on real pages, especially very long or dynamic layouts.
- Whether transformed, sticky, iframe, SPA, zoom, and resize behavior need support after observation.
- Which limited set of ordinary pages should define the next compatibility target.
