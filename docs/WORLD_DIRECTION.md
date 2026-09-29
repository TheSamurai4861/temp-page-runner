# World backdrop — supplied artwork

The game uses the user's `input/background.png` as its dark fantasy pixel backdrop. An unchanged copy is packaged at `extension/assets/background.png` so an unpacked browser extension can load it locally. The procedural landscape explored earlier has been replaced. The page's real text and cards remain in front of the artwork, and DOM geometry remains the source of platforms.

## Framing rule

`extension/src/world-backdrop.js` draws the image with its original aspect ratio and enough scale to cover the viewport. It adds a restrained zoom from **1.025× to 1.13×**, increasing slightly with document length. At the top of a page, the crop favors the upper part of the artwork; as the page scrolls, it pans downward to reveal its deeper regions. On a horizontally scrollable page, the small horizontal crop follows horizontal progress. The crop is clamped inside the image, so no blank edge appears. On very long pages it eventually reaches the bottom of this finite image and holds there. It does not generate endless new art or extend the game route.

The renderer redraws only when its framing changes or the viewport is resized. If the image fails to load, the world canvas stays dark and the game remains usable. The overlay exposes `data-world-ready` and `data-world-zoom` for diagnostics.

## Page composition and privacy

During game mode, a negative-layer canvas sits behind the page. A temporary stylesheet makes the root background transparent and recolors a bounded set of dark text elements on transparent areas. Cards with their own light backgrounds keep their normal colors. Exit removes the world host, stylesheet, and added contrast classes. Focusing an editable or form control also exits game mode, including when a sensitive field appeared after activation. Opaque site containers, complex stacking, and dynamic text can still hide the image or weaken readability; broad compatibility remains unproven.

The extension requests no new browser permission. Manifest V3 declares only the bundled PNG as a web-accessible resource for web pages, using a per-session dynamic URL. Chrome requires that declaration for an image displayed inside page DOM; it does not transmit page content. [Chrome's resource documentation](https://developer.chrome.com/docs/extensions/reference/manifest/web-accessible-resources) describes this behavior. No runtime asset is loaded from a third-party service.

## Evidence

- The source and packaged PNG have identical SHA-256 hashes.
- [Top crop in gameplay](../output/playwright/image-game-start.png), [deeper crop at the flag](../output/playwright/image-game-win.png), and [sparse page](../output/playwright/image-game-sparse.png) show the image behind readable page content and DOM platforms.
- The [preview](../output/playwright/image-world-preview.png) and [deep offset](../output/playwright/image-world-deep.png) show different parts of the same supplied artwork without an exposed edge. [Narrow viewport](../output/playwright/image-world-narrow.png) shows the crop at 640 × 720.
- On the staircase fixture, five DOM platforms and zero helpers remained; the knight reached the flag at document Y=1126 after scrolling to Y=557. Escape restored the original body background and normal keyboard scrolling. The sparse fixture retained two DOM platforms and four helpers.

The installed toolbar action on an unrelated webpage still needs a separate compatibility spot check. The controlled fixtures prove the integrated interaction, not uniform behavior on every site.
