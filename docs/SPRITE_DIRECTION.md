# Sprite direction — knight candidate

The user chose a knight and rewards from a world of weapons and spells. This is a first visual proposal for human review, not final art and not yet wired into the extension. Open `design/sprite-lab.html` through `npm run serve` to see the animation loops.

## Character

A compact **18 × 24 pixel** knight with a closed pale-steel helmet, one narrow amber visor glint, a small asymmetric mint crest, a tiny shield, charcoal boots, and a short amber scarf. The silhouette is recognizable before the details: broad helmet, narrow torso, shield, and two separated boots. It has no cap, moustache, overalls, or other borrowed character cues.

| State | Frames | Timing | Motion cue |
|---|---:|---:|---|
| Idle | 3 | 180 ms | Small breath and crest sway |
| Run | 4 | 90 ms | Alternating boots and arms |
| Jump | 2 | 140 ms | Raised arms and tucked boots |
| Fall | 2 | 160 ms | Open arms and lowered boots |
| Land | 3 | 90 ms | Brief squash then recovery |
| Spring launch | 3 | 80 ms | Strong squash and vertical stretch |
| Bonus reaction | 3 | 130 ms | Raised arm and amber spark |
| Win | 4 | 150 ms | Small blade salute and spark |

Animation changes pixels only. Physics and collisions remain authoritative. Left-facing frames mirror the right-facing drawings. The design must remain readable at 1× on light and dark page backgrounds; a dark outline provides contrast.

## Special-object candidates

- **Rune tablet:** 20 × 20 pixel charcoal/stone square with an amber diamond glyph. Contact releases one reward, then the glyph goes dark. The lab holds the used state until explicitly reset for preview. It does not resemble a question-mark block.
- **Spring sigil:** 32 × 16 pixel mint coil on a dark base. A three-frame compression/release gives a clear launch cue while the real DOM surface remains visible.
- **Arc blade:** a small steel-and-amber weapon pickup. Its first gameplay use is undecided; without enemies, it can remain cosmetic or support traversal rather than imply combat.
- **Ascent rune:** a mint/amber spell pickup. Proposed first effect: empower the next jump. The exact strength, duration, and reset rule need playtesting.

## Palette

| Role | Color |
|---|---|
| Outline | `#202a32` |
| Pale steel | `#e9ece8` |
| Shadow steel | `#899ba0` |
| Mint magic | `#67d5b5` |
| Amber accent | `#e7b562` |
| Warm highlight | `#fff6d8` |

Keep the webpage visually dominant. The sprite and special objects should use accent colors only for action feedback and gameplay affordances.

## Review questions

- Does the helmet and stance read as a knight at native size?
- Does each action read without labels, especially jump versus fall and landing versus spring launch?
- Should the first reward be a spell that changes traversal, or should a weapon have a direct non-combat use?
