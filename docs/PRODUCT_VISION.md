# Page Runner product direction

## The promise

Activate Page Runner on an ordinary webpage. The page remains recognizable, but its real structure becomes a compact platform level against the user's dark fantasy pixel backdrop. A tiny original pixel knight runs and jumps across selected elements, uses occasional special surfaces, finds a spell bonus, and reaches a flag.

This is a local browser game, not a service. The primary product test is whether a short clip makes the page-to-level idea immediately clear.

## Site coverage

Aim for broad compatibility with ordinary pages the user explicitly activates. "Every site" is a design ambition, not a guarantee. Browser-restricted pages, authentication/payment flows, and inaccessible frames are excluded. Treat layout failures as observable compatibility cases, not silently successful levels. Keep the existing `activeTab` and `scripting` permission model until evidence shows a specific need for more access.

Build coverage in steps: the two current fixtures; a small set of ordinary article, card, storefront, and documentation layouts without sensitive flows; then dynamic and long pages. Record the percentage of those pages that start, yield a traversable route, and cleanly exit. Do not declare universal support from fixture success.

## Game grammar

| Role | Page-derived input | Game behavior | Visual cue |
|---|---|---|---|
| Platform | Useful visible element top edge | Stand and jump from it | Thin mint edge |
| Spring | A small, isolated suitable surface selected sparingly | A stronger upward launch on landing | Compressing mint pad anchored to the element |
| Bonus tile | A reachable opening near a selected element | Touch from below or side to release one reward once | Small rune tablet with an amber diamond, then a dim used state |
| Reward | Overlay object released by a bonus tile | A short, clearly explained optional effect | Original knightly weapon or spell sprite |
| Goal | A route endpoint supported by reachable geometry | Complete the run | Existing original flag, to be refined with the art direction |

The actual page element remains untouched. The game may draw a pad or tile aligned with it, and collision stays in the game layer. Special elements are rare enough that the webpage still reads as a webpage. A page with little useful geometry may receive a minimal number of overlay helper platforms.

## Character animation contract

The knight needs idle, run, jump, fall, land, spring launch, bonus reaction, and completion states distinguishable at native size. Short loops and one-shot poses are sufficient. Movement and collision drive the state; animation does not alter physics. The sprite uses a small fixed pixel grid and a restricted palette so it can be drawn sharply over varied pages. The candidate design lives in `docs/SPRITE_DIRECTION.md` and `design/sprite-lab.html`.

## Current controlled slice

On the staircase fixture, one real DOM card supports a small spring pad and a later card anchors a rune tablet. Touching the tablet releases an ascent rune; collecting it arms one boosted jump. The knight's movement states drive his pixel animation. The world layer replaces the page's root background during play, while page content remains visible. A narrow, temporary contrast treatment helps dark text on transparent areas. The normal route still reaches the flag without using specials.

## Next slice

Measure activation, readability, traversability, and clean exit on a small set of ordinary eligible pages beyond the fixtures. Fix observed failures one class at a time; do not infer universal site support from the controlled slice.

## Product boundaries

- Explicit activation and clean exit remain mandatory.
- No page content leaves the device; no accounts, analytics, or backend.
- Do not interrupt editable, login, checkout, or payment experiences.
- No Nintendo/Mario visual assets, names, question-mark blocks, power-up appearances, sounds, or character cues. The abstract mechanic of a rewarded tile is allowed; its art and interaction language must be original.
- No enemies, combat, multiplayer, level editor, or economy in the next slice.

## Decisions still owned by the user

- Final knight name.
- The next spell or weapon effect after the current one-use boosted jump.
- How prominent special tiles should be as compatibility expands.
