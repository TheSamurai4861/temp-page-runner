# Sprite direction — knight candidate

The user approved this knight and the dark fantasy world direction. The knight's eight states are now wired to gameplay in `extension/src/knight-sprite.js`; the spring, rune tablet, and ascent rune have playable forms in `extension/src/game-objects.js`. The blade remains a design candidate. Open `design/sprite-lab.html` through `npm run serve` to inspect the original proposal and animation loops.

## Character

A compact **18 × 24 pixel** native drawing, shown at **24 × 32 pixels** in gameplay, provisionally called **Le Veilleur des Marges**. He is a small scout of webpage geometry: curious, cautious at rest, and quick to commit to a jump. The name and character story remain proposals for the user to accept or change.

His broad pale-steel helmet has a central ridge, a closed dark visor, two small copper rivets, and one warm visor glint. An asymmetric mint crest bends behind it. An amber scarf peeks out on the right and moves with the running frames. The torso carries a mint diamond on a light tabard. A tiny two-tone buckler hangs from the left arm; the right hand has a pale gauntlet. Reinforced boots have a single light toe pixel. These marks give the character identity without filling every pixel.

The silhouette must work before the details: helmet, narrow body, shield, separated boots. It has no cap, moustache, overalls, or other borrowed character cues. His movement personality is shown through the poses: shield guarded while idle, alternating gear during the run, shield lifted in a jump, arms spread in a fall, then a restrained blade salute on completion.

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

Keep the webpage content recognizable. The sprite and special objects use accent colors for action feedback and gameplay affordances against the darker game world.

## Review questions

- Does the helmet and stance read as a knight at native size?
- Does each action read without labels, especially jump versus fall and landing versus spring launch?
- Should the first reward be a spell that changes traversal, or should a weapon have a direct non-combat use?
