# Page Runner

A local browser toy that turns selected DOM surfaces into a tiny platform game. The page stays visible. Page geometry and game state remain in the browser; there are no runtime packages, accounts, storage, or external service calls from the extension.

The broader product direction is in [the product vision](docs/PRODUCT_VISION.md). The current controlled slice generates stepped terrain around page elements, with physical ledges and gaps, an animated 24 × 32 pixel knight, the supplied `input/background.png`, a spring, and an optional rune reward.

## Review the world direction

Run `npm run serve`, then open `http://127.0.0.1:4173/design/world-lab.html`. Move the X and Y sliders or select **Avancer** to inspect the supplied dark fantasy backdrop used in game mode. The [world notes](docs/WORLD_DIRECTION.md) explain its framing and page-readability limits.

## Review the sprite direction

Run `npm run serve`, then open `http://127.0.0.1:4173/design/sprite-lab.html`. The lab shows the approved character direction: eight knight action states and four special-object studies. Pause, step frame by frame, mirror the knight, switch the preview background, and trigger the rune tile. The [sprite notes](docs/SPRITE_DIRECTION.md) record the character's equipment, pixel grid, palette, and timing. The knight, spring, tablet, and ascent rune are now playable; the blade remains a design study.

## Run the controlled slice

1. Run `npm run check` and `npm run serve`.
2. Open `http://127.0.0.1:4173/fixtures/staircase.html` in a desktop browser.
3. Press **G** to activate. Use **←/→** or **A/D** to move, **Space/↑/W** to jump, **R** to restart, and **Esc** to exit.
4. Open `/fixtures/sparse.html` and `/fixtures/dense-grid.html` to compare levels generated from different layouts.

The turquoise stone ledges between page elements are physical terrain. On the staircase page, the spring appears on a route card beneath an optional side ledge with a rune tablet. Touching the released rune arms one stronger jump. The main route remains reachable without it. Restart re-arms the tablet and keeps the same terrain.

To try the extension on an ordinary page, load `extension/` as an unpacked Chromium extension and click its toolbar action. Click again to exit. The extension requests only `activeTab` and `scripting`, so it runs only after that click and has no persistent host access.

## Current limits

This is a controlled playable slice, not a compatibility guarantee. The generator scans a bounded set of visible elements, validates a route against the knight's jump physics, and adds at most two physical ledges between DOM anchors. DOM changes and resize are integrated at the next grounded checkpoint; completed terrain stays stable. If no route can be built, the game says so. SPA navigation, iframes, transformed elements, sticky/fixed elements, and extreme page lengths remain unproven. The game refuses pages with password fields or common payment markers, and exits when an editable or form control receives focus. Chrome-controlled pages cannot be scripted. Opaque site containers can hide the world layer, and contrast adjustment covers only a bounded set of text elements.
