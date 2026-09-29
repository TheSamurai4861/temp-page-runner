# Page Runner

A local browser toy that turns selected DOM surfaces into a tiny platform game. The page stays visible. Page geometry and game state remain in the browser; there are no runtime packages, accounts, storage, or network calls from the extension.

## Run the controlled slice

1. Run `npm run check` and `npm run serve`.
2. Open `http://127.0.0.1:4173/fixtures/staircase.html` in a desktop browser.
3. Press **G** to activate. Use **←/→** or **A/D** to move, **Space/↑/W** to jump, **R** to restart, and **Esc** to exit.
4. Open `/fixtures/sparse.html` to see the sparse-layout fallback.

To try the extension on an ordinary page, load `extension/` as an unpacked Chromium extension and click its toolbar action. Click again to exit. The extension requests only `activeTab` and `scripting`, so it runs only after that click and has no persistent host access.

## Current limits

This is a first playable slice, not a compatibility guarantee. It scans a bounded set of semantic elements and cards once at activation. Dynamic DOM changes, SPA navigation, iframes, transformed elements, sticky/fixed elements, and extreme page lengths are not handled. Resize redraws the canvas but does not rebuild the route. The game refuses to start on pages with password fields or common payment markers. Chrome-controlled pages cannot be scripted. The generated route is heuristic and may still be awkward or unreachable on unfamiliar layouts.
