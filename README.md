# Page Runner

A local browser toy that turns selected DOM surfaces into a tiny platform game. The page stays visible. Page geometry and game state remain in the browser; there are no runtime packages, accounts, storage, or external service calls from the extension.

The broader product direction is in [the product vision](docs/PRODUCT_VISION.md). The current controlled slice includes the original animated knight, the supplied `input/background.png` framed behind the page, a spring pad, a rune tablet, and one optional empowered-jump reward.

## Review the world direction

Run `npm run serve`, then open `http://127.0.0.1:4173/design/world-lab.html`. Move the X and Y sliders or select **Avancer** to inspect the supplied dark fantasy backdrop used in game mode. The [world notes](docs/WORLD_DIRECTION.md) explain its framing and page-readability limits.

## Review the sprite direction

Run `npm run serve`, then open `http://127.0.0.1:4173/design/sprite-lab.html`. The lab shows the approved character direction: eight knight action states and four special-object studies. Pause, step frame by frame, mirror the knight, switch the preview background, and trigger the rune tile. The [sprite notes](docs/SPRITE_DIRECTION.md) record the character's equipment, pixel grid, palette, and timing. The knight, spring, tablet, and ascent rune are now playable; the blade remains a design study.

## Run the controlled slice

1. Run `npm run check` and `npm run serve`.
2. Open `http://127.0.0.1:4173/fixtures/staircase.html` in a desktop browser.
3. Press **G** to activate. Use **←/→** or **A/D** to move, **Space/↑/W** to jump, **R** to restart, and **Esc** to exit.
4. Open `/fixtures/sparse.html` to see the sparse-layout fallback.

On the staircase page, land on the narrow mint pad on the second card to bounce. Touch the rune tablet near the third card, then touch the released rune to arm one stronger jump. The rune is optional: the flag remains reachable without it. Restart re-arms the tablet.

To try the extension on an ordinary page, load `extension/` as an unpacked Chromium extension and click its toolbar action. Click again to exit. The extension requests only `activeTab` and `scripting`, so it runs only after that click and has no persistent host access.

## Current limits

This is a controlled playable slice, not a compatibility guarantee. It scans a bounded set of semantic elements and cards once at activation. Dynamic DOM changes, SPA navigation, iframes, transformed elements, sticky/fixed elements, and extreme page lengths are not handled. Resize redraws the canvas but does not rebuild the route. The game refuses to start on pages with password fields or common payment markers, and exits when an editable or form control receives focus. Chrome-controlled pages cannot be scripted. The generated route is heuristic and may still be awkward or unreachable on unfamiliar layouts. Opaque site containers can hide the world layer, and automatic contrast adjustment only covers a bounded set of text elements over transparent backgrounds.
