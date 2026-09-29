# Broader page levels and sprite direction

## Intent
Evolve Page Runner into an original game that can make many ordinary webpages playable, with DOM-derived surfaces, spring surfaces, bonus tiles, pickups, and a character whose small animations communicate action at a glance.

## Classification
- Type: FEATURE (product design and sprite exploration; later gameplay implementation is separate).
- Risk: H for the new compatibility target and future page interaction/security boundary. This change set itself is reversible documentation and art prototyping.
- Workflow: `.ai/workflows/FEATURE.md` plus the method's H review requirement.

## Current behavior
The first slice runs on two controlled pages. It reads selected DOM rectangles for top-only platforms, draws a static procedural character and flag, and supports moving, jumping, scrolling, respawning, and completion. Extension toolbar activation on an unrelated page remains unverified. No springs, bonus tiles, pickups, or action animation exist.

## Expected behavior
The product direction is broad coverage of ordinary webpages after explicit activation. Page structure remains visible. Selected elements may support platform, spring, or bonus interactions, while game-only visuals and rewards live in the overlay. Character animation clearly indicates movement and events. A small playable route and reachable flag remain the core loop.

## Scope of this task
- Update durable project guidance to reflect the expanded vision and explicit compatibility limits.
- Define the semantics of platforms, springs, bonus tiles, and one original reward candidate without committing to a full powers system.
- Produce a reviewable original pixel knight direction with action states and mini animations.
- Record the next incremental gameplay slice and observable verification criteria.

## Non-goals of this task
Implementing the new mechanics, changing browser permissions, claiming support for every website, publishing a release, copying recognizable Nintendo assets or another creator's characters, or building a full art pipeline.

## Constraints and assumptions
- Existing explicit activation, local processing, privacy, clean exit, and input/payment exclusions remain in force.
- "All sites" is interpreted as a target of broad compatibility with ordinary eligible web pages; restricted browser pages and inaccessible cross-origin frames cannot be promised.
- Springs and bonus tiles are gameplay overlays anchored to useful DOM geometry. The source page is not destructively rewritten.
- Visuals must be original and readable over varied page backgrounds.
- The user chose a knight and a weapon/spell reward family. Details of the silhouette and effects remain reviewable candidates.

## Human decisions
- User: broaden the ambition beyond the controlled fixtures; add animated action states, spring surfaces, and bonus squares with rewards.
- User: the character is a knight; rewards belong to a knightly weapon and spell world.
- Candidate for review: a compact steel knight with a teal crest, an amber scarf, a rune tablet, a short blade, and a motion rune.
- Pending: exact future power effects and how frequently bonus tiles appear.

## Acceptance criteria and verification
- [x] Product guidance states the new loop, target site classes, exclusions, privacy boundary, and staged compatibility approach. Verified against this task and current extension behavior.
- [x] Guidance defines distinguishable platform, spring, and bonus interactions with a route/goal principle. Verified by document review; gameplay implementation remains the next slice.
- [x] A sprite lab shows an original knight with idle, run, jump, fall, land, bounce, bonus reaction, and win states using mini animations; spring, rune tile, weapon, and spell candidates are visible. Verified visually in a browser at native and enlarged pixel scales.
- [x] Existing slice still passes `npm run check`; no permission or behavior changes are introduced. Verified by syntax check and diff/manifest inspection.
- [x] Independent review checks originality, scope, project-rule consistency, and evidence. Findings and corrections are recorded below; human acceptance remains pending.

## Risks
Literal universal coverage is impossible on restricted pages; arbitrary DOM may yield weak routes. Too many game overlays could obscure page content. Mario-like bonus language could drift into visual copying. Candidate animation may not read at native size. Future powers could make route generation and collision balance harder.

## Plan
1. Update product guidance and note what the current implementation actually does.
2. Build a small, dependency-free sprite lab with candidate animation states and three interactive object types.
3. Inspect native-size legibility and animation timing in a real browser; adjust the art.
4. Run project checks and obtain independent review. Present the design and open creative choices for human judgment.

## Evidence
- `npm run check` passed. `git diff --check` reported no whitespace errors.
- Headed browser opened `/design/sprite-lab.html`: eight knight states and four object cards, no console errors or warnings.
- Manual frame stepping produced distinct frame counts `[3,4,2,2,3,3,3,4]` for the character. The object sprites have two active plus one persistent used tablet state, three spring frames, two blade frames, and four rune frames.
- Pause, next frame, mirror, and light-background controls responded; full-page captures are `output/playwright/sprite-lab.png` and `sprite-lab-light.png`.
- Native-size preview background changed from `rgb(38, 49, 57)` to `rgb(232, 232, 223)` with the contrast control. The tablet's used canvas stayed identical after 750 ms; `output/playwright/rune-tile-used.png` captures it.
- Current extension manifest and gameplay script were not changed. The new mechanics are documented candidates, not claimed as playable.

## Review
Independent review found three issues: the native-size background did not follow the contrast control, spring dimensions disagreed with the art notes, and the rune tablet looped back to active after its used frame. All three were corrected and checked in the browser. The independent reviewer rechecked those fixes and found no remaining issue in them. Review also confirmed the broad-coverage target is staged and does not claim restricted pages, the user-selected knight/weapon/spell direction is recorded, and the art is original and separate from the gameplay script.

## Human acceptance
- Accepted: No.
