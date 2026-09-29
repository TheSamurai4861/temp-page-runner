# Give the Page Runner knight more character detail

## Intent
Make the user-selected knight feel more distinctive and readable, with visible equipment and personality at sprite scale.

## Classification
- Type: FEATURE, visual design refinement.
- Risk: M. The work changes several sprite poses and visual documentation, but is local, reversible, and does not change gameplay or permissions.
- Workflow: `.ai/workflows/FEATURE.md`.

## Current behavior
The standalone sprite lab shows an original 18 × 24 pixel knight with a broad helmet, mint crest, shield, scarf, tabard, and eight action loops. Its equipment and identity are still minimal. The sprite is not integrated into the extension.

## Expected behavior
The same compact knight gets a clearer helmet, armor, shield emblem, scarf/cape motion, and character description. Action poses and original color language remain recognizable at 1× over light and dark backgrounds.

## Scope
Refine the knight drawings in `design/sprite-lab.html`, document the character's visual identity and movement personality, and update visual evidence. Keep object sprites and the gameplay extension unchanged.

## Non-goals
New mechanics, combat, sprite integration into the extension, a complete lore story, or a larger asset pipeline.

## Constraints and assumptions
Keep the 18 × 24 grid and current palette. Avoid recognizable Nintendo or other game character cues. Details must not turn into noise at native size. The user has chosen a knight; name and final silhouette remain theirs to accept.

## Human decisions
User: make the knight more detailed. Routine choices for armor marks and motion are proposed for review.

## Acceptance criteria and verification
- [x] A distinct equipment silhouette and identifying marks are visible in the lab. Verified in enlarged and native previews on both backgrounds.
- [x] Idle, run, jump, fall, land, spring, bonus, and win still have their documented distinct frame counts. Verified by frame stepping and comparing native canvas pixels.
- [x] Character notes explain silhouette, palette, equipment, and pose personality without implying new implemented gameplay. Verified by document review.
- [x] No gameplay/permission changes; project checks pass. Verified by diff and `npm run check`.

## Risks
Extra pixels can reduce native-size legibility or obscure pose changes. The shield or scarf may clip during raised-arm frames.

## Plan
1. Add a few identifying marks to the existing frame drawing while preserving the grid.
2. Extend the character design notes and lab explanation.
3. Inspect native and enlarged previews on both backgrounds and compare action frames.
4. Run checks, record evidence, and push the design update to the already authorized repository.

## Evidence
- `npm run check` passed and `git diff --check` reported no whitespace errors.
- The headed sprite lab opened with zero browser console errors or warnings. It shows the new equipment marks and a separate character portrait.
- Distinct frame counts remained `[3,4,2,2,3,3,3,4]` across the eight states.
- Native and portrait preview backgrounds both changed to `rgb(232, 232, 223)` in light mode; screenshots are `output/playwright/knight-detail.png`, `knight-detail-light.png`, and `knight-portrait.png`.
- Extension gameplay and manifest files have no changes in this task.

## Review
Visual review on both backgrounds found the helmet, scarf, buckler, tabard mark, gauntlet, and boots legible at the enlarged scale; the native sprite still reads primarily through silhouette. Frame comparison found no lost state variation. The character name and exact look remain a candidate for human judgment.

## Human acceptance
- Accepted: The knight sprite direction was approved by the user on 2026-09-29.
