# Supplied dark fantasy page backdrop

## Intent and classification

Show the user's `input/background.png` behind the recognizable webpage during an active Page Runner level. Type: FEATURE with visual and page-style safety concerns. Risk: H because changing the appearance of arbitrary pages can affect readability and behavior. Workflow: `.ai/workflows/FEATURE.md`.

## Current and expected behavior

The earlier controlled slice kept each page's background. The user approved a dark fantasy direction, then specified the image file. While game mode is active, this exact image should cover the viewport behind visible page content, pan with scrolling, and use a slight page-dependent zoom without exposing an edge. Real DOM geometry must remain the source of collision platforms. Exit must restore the page's prior appearance.

## Scope and constraints

- Package an unchanged local copy of the supplied image for the extension and preview it on controlled pages.
- Fit the image to viewport shape, adjust zoom gently with document length, and clamp its crop as the page scrolls.
- Keep page text and cards visible, using only temporary and reversible styling for root backgrounds and a bounded set of low-contrast text nodes.
- Keep explicit activation, local processing, the knight, flag, route, spring, and tablet.
- The image is finite. On very long pages the crop eventually reaches its lower bound and holds; this does not generate new art or extend the route.

## Non-goals

Backend art generation, downloaded runtime assets, replacing page text, infinite procedural gameplay, universal compatibility claims, broader browser permissions, storage, or page-content transfer.

## Human decisions and plan change

The user chose a dark fantasy knight world and approved the sprite and background direction. On 2026-09-29 the user specified `input/background.png` and a slight site-dependent zoom. This superseded the procedural-art implementation assumption, so the task returned to SPEC/PLAN. The foreground composition and controlled gameplay contract remain.

## Acceptance criteria and verification

- [x] The preview and game show the supplied image at top, deep, and narrow viewport crops without an exposed edge. Verify screenshots, image loading, and identical source/package hashes.
- [x] A controlled page remains readable and playable over the image; the knight can traverse DOM-derived platforms, scroll, and reach the flag. Verify screenshots and browser state.
- [x] The crop advances with page scrolling, and zoom changes gently with page length. Inspect renderer formula, screenshots, and `data-world-zoom` on two fixtures.
- [x] Exit restores the original page appearance and keyboard scrolling. Verify DOM hosts/classes/style and before/after browser behavior.
- [x] No new browser permissions, external service requests, persistent storage, or page-content transfer. Inspect manifest/source and browser requests.
- [ ] Syntax/full project checks pass and an independent review covers image integration, readability, cleanup, scope, and evidence.

## Risks and rollback

Opaque containers may hide the backdrop; dark text on transparent areas may lose contrast; complex stacking can cover a negative layer; very long pages repeat the image's final crop. The implementation limits temporary style changes and removes them on exit. Rollback is removal of the image renderer, its one manifest resource, and its temporary world layer, leaving the existing platform game intact.

## Incremental plan

1. Copy the supplied image unchanged; replace the renderer and verify preview framing.
2. Integrate it behind page content on one controlled fixture; verify collision, scrolling, and exit.
3. Verify sparse and narrow layouts, page-length zoom, privacy, and manifest scope.
4. Run full checks, obtain fresh independent review, document limits, and present the candidate for human acceptance.

## Evidence

- SHA-256 comparison confirms `input/background.png` and `extension/assets/background.png` are identical.
- Headed preview screenshots `output/playwright/image-world-preview.png`, `image-world-deep.png`, and `image-world-narrow.png` show the artwork at top, deep scroll, and a 640 x 720 viewport without an exposed edge.
- `output/playwright/image-game-start.png` shows readable page content, knight, spring, tablet, five DOM platforms, and zero helpers above the image. `image-game-win.png` shows the knight at the flag at document Y=1126 after scrollY=557; the rune was not needed.
- `output/playwright/image-game-sparse.png` shows two DOM platforms and four overlay helpers above the image.
- Browser diagnostics report zoom `1.053` for the 1818-pixel staircase and `1.051` for the 1761-pixel sparse page at the same viewport height. The formula increases zoom with page depth and clamps at 1.13.
- Escape removed both hosts, temporary style, and contrast classes. The staircase body background returned to `rgb(247, 245, 239)`, and ArrowDown scrolling resumed.
- A dynamically inserted password field received focus during play; the game and world hosts and temporary style were removed before the user could type into it.
- The PNG loads from the local extension resource URL or controlled fixture server. Manifest permissions remain `activeTab` and `scripting`; only the PNG is declared web-accessible with a dynamic URL.

## Review and acceptance

The previous procedural candidate received independent review, but its visual evidence was superseded by the supplied PNG.

### Independent review (fresh context, 2026-09-29)

Reviewed: this contract, `world-backdrop.js`, the world integration in `page-runner.js` (`installWorld`, `resize`, `draw`, `stop`), `manifest.json`, `background.js`, `scripts/serve.mjs`, and the cited captures. The reviewer inspected `image-game-start.png`, `image-game-win.png`, and `image-game-sparse.png` directly and recomputed the packaged asset hash rather than accepting the recorded conclusions. The reviewer shares the builder's model family, so this is one validation layer, not human acceptance.

**Verified**

- Criterion 1 (no exposed edge): the drawn rectangle always covers the viewport. The vertical factor `0.06 + progress * 0.88` and the horizontal factor `0.5 + (progress - 0.5) * 0.7` both stay inside `[0, 1]`, and the size uses `ceil`, so no gap can open. The captures agree.
- Criterion 3 (zoom): `1.025 + min(0.105, log2(pageDepth) * 0.028)` reproduces both recorded readings for a shared viewport height in the 914-920 px range and clamps at 1.13.
- Criterion 4 (readability and cleanup): the gameplay captures show white cards keeping their own backgrounds while headings and paragraphs over the artwork are recolored with a shadow; exit removes the stylesheet and every contrast class.
- Criterion 5 (privacy): the manifest keeps `activeTab` and `scripting` and declares only the bundled PNG with a dynamic URL; the game script contains no `fetch`, `XMLHttpRequest`, or storage call; the packaged copy is byte-identical to `input/background.png` (SHA-256 `7064F995…9704`, recomputed by the reviewer).
- `npm run check` passes.

**Findings**

#### [LOW] The fallback backdrop path points at the visited site

- **Type:** RISK
- **Blocking:** NO
- **Evidence:** `worldSource` falls back to `"/input/background.png"`. Injected scripts run in the isolated world, where `chrome.runtime.getURL` exists, so the extension path should not use the fallback; if it ever did, the request would go to the visited origin.
- **Why it matters:** a 404 request to the third-party page and a dark canvas. No page data leaves the browser.
- **Recommended action:** gate the fallback on the local preview instead of a bare path.

#### [LOW] The preview server serves the backdrop as `application/octet-stream`

- **Type:** FACT
- **Blocking:** NO
- **Evidence:** `scripts/serve.mjs` maps only `.html`, `.js`, and `.json`. The workflow renders only because browsers sniff the type; the captures prove it works today.
- **Recommended action:** add `'.png': 'image/png'`.

#### [LOW] Nothing validates `manifest.json`

- **Type:** FACT
- **Blocking:** NO
- **Evidence:** `npm run check` runs `node --check` on JavaScript only, and this task changed the manifest.
- **Recommended action:** parse the manifest inside the check script.

#### [LOW] Root background and contrast styling apply even when the artwork fails

- **Type:** RISK
- **Blocking:** NO
- **Evidence:** `installWorld()` returns early only when no renderer exists. A load failure leaves a dark canvas with the page's own background removed and dark text recolored. `docs/WORLD_DIRECTION.md` records this as intended.
- **Recommended action:** confirm the intended behavior, or defer the root-background override until the image reports loaded.

#### [LOW] Line endings are unmanaged

- **Type:** FACT
- **Blocking:** NO
- **Evidence:** Git reports that LF will be replaced by CRLF in 13 files, and no `.gitattributes` exists.
- **Recommended action:** add one before committing this work.

**Missing evidence**

- The recorded 12-step browser flow was not re-executed, so `data-world-ready`, `data-world-zoom`, platform counts, and the after-exit DOM state were not re-derived by the reviewer. Criterion 2 rests on the recorded captures and on code reading, not on a live run.
- Criterion 5 stays open: the independent review now exists, but the "full project checks" it names are the manual browser flow, which no automation covers.
- The two zoom readings do not record the viewport height that produced them.
- A real extension action on a non-fixture page remains an explicit compatibility evidence gap.

**Areas requiring human judgment**

- Whether the repository should carry the supplied PNG twice (source under `input/` and packaged under `extension/assets/`), since history is permanent.
- Whether the new `web_accessible_resources` entry is approved; project rules require explicit approval for manifest changes.

Human acceptance: pending.
