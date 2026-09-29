(() => {
  const STEP = 1 / 60;
  const MAX_FLIGHT = 1.8;

  function normalize(rectangles) {
    const sorted = rectangles.filter((p) => Number.isFinite(p.x + p.y + p.width + p.height) && p.width >= 48 && p.height >= 8)
      .sort((a, b) => a.y - b.y || b.width - a.width || a.x - b.x);
    const kept = [];
    for (const p of sorted) {
      const duplicate = kept.some((other) => {
        const overlap = Math.max(0, Math.min(p.x + p.width, other.x + other.width) - Math.max(p.x, other.x));
        return Math.abs(p.y - other.y) < 50 && overlap / Math.min(p.width, other.width) > 0.65;
      });
      if (!duplicate) kept.push(p);
      if (kept.length >= 180) break;
    }
    return kept;
  }

  function witness(from, to, physics) {
    if (to.y < from.y - 100 || to.y - from.y > 700) return null;
    const { width, height, speed, jump, gravity } = physics;
    if (from.width < width + 6 || to.width < width + 6) return null;
    const starts = [from.x + 4, from.x + (from.width - width) / 2, from.x + from.width - width - 4];
    for (const launchX of starts) {
      for (const jumping of [false, true]) {
        for (const direction of [-1, 0, 1]) {
          for (const release of [0.25, 0.5, 0.9, MAX_FLIGHT]) {
            let x = launchX;
            let bottom = from.y;
            let vy = jumping ? -jump : 0;
            let walking = !jumping;
            for (let time = STEP; time <= MAX_FLIGHT; time += STEP) {
              const oldBottom = bottom;
              x += (time <= release ? direction * speed : 0) * STEP;
              if (walking) {
                if (x + width > from.x + 3 && x < from.x + from.width - 3) continue;
                walking = false;
              }
              vy = Math.min(900, vy + gravity * STEP);
              bottom += vy * STEP;
              if (vy >= 0 && oldBottom <= from.y + 5 && bottom >= from.y &&
                x + width > from.x + 3 && x < from.x + from.width - 3) break;
              if (vy >= 0 && oldBottom <= to.y + 5 && bottom >= to.y &&
                x + width > to.x + 3 && x < to.x + to.width - 3) {
                return { launchX: Math.round(launchX), direction, jumping, release, time: Math.round(time * 100) / 100 };
              }
              if (bottom > to.y + height + 30) break;
            }
          }
        }
      }
    }
    return null;
  }

  function clear(candidate, occupied, pageWidth) {
    if (candidate.x < 16 || candidate.x + candidate.width > pageWidth - 16) return false;
    return !occupied.some((box) => {
      const horizontal = Math.min(candidate.x + candidate.width, box.x + box.width) - Math.max(candidate.x, box.x);
      const vertical = Math.min(candidate.y + 13, box.y + box.height) - Math.max(candidate.y - 8, box.y);
      return horizontal > 8 && vertical > 2;
    });
  }

  function candidates(from, to, ratio, occupied, pageWidth) {
    const center = (from.x + from.width / 2) * (1 - ratio) + (to.x + to.width / 2) * ratio;
    const baseline = from.y + (to.y - from.y) * ratio;
    const width = 88 + Math.min(40, Math.round(Math.abs(to.x - from.x) / 9));
    const output = [];
    const offsets = [0, -70, 70, -140, 140, -Math.round(from.width / 2), Math.round(from.width / 2),
      -Math.round(to.width / 2), Math.round(to.width / 2)];
    for (const dy of [0, -30, 30]) {
      for (const dx of offsets) {
        const ledge = { x: Math.round(center + dx - width / 2), y: Math.round(baseline + dy), width, height: 13, helper: true, terrain: true };
        if (clear(ledge, occupied, pageWidth)) output.push(ledge);
      }
    }
    return output;
  }

  function bridge(from, to, occupied, pageWidth, physics, preferTerrain) {
    const direct = witness(from, to, physics);
    if (direct && !preferTerrain) return { pieces: [], witnesses: [direct] };
    for (const middle of candidates(from, to, 0.5, occupied, pageWidth)) {
      const first = witness(from, middle, physics);
      const second = first && witness(middle, to, physics);
      if (second) return { pieces: [middle], witnesses: [first, second] };
    }
    if (direct) return { pieces: [], witnesses: [direct] };
    const firstSet = candidates(from, to, 1 / 3, occupied, pageWidth);
    const secondSet = candidates(from, to, 2 / 3, occupied, pageWidth);
    for (const a of firstSet) {
      const first = witness(from, a, physics);
      if (!first) continue;
      for (const b of secondSet) {
        if (Math.max(a.x, b.x) < Math.min(a.x + a.width, b.x + b.width) && b.y - a.y < 40) continue;
        const second = witness(a, b, physics);
        const third = second && witness(b, to, physics);
        if (third) return { pieces: [a, b], witnesses: [first, second, third] };
      }
    }
    return null;
  }

  function generate({ anchors, occupied = [], page, viewport, physics, startSurface = null }) {
    const natural = normalize(anchors);
    const initial = startSurface || natural.find((p) => p.y > (page.scrollY || 0) + 85 && p.y < (page.scrollY || 0) + viewport.height * 0.85 &&
      p.x < (page.scrollX || 0) + viewport.width * 0.7 && p.width < viewport.width * 0.65) || natural[0];
    if (!initial) return { ok: false, reason: 'no-anchor', natural, surfaces: [], route: [] };
    const route = [initial];
    const witnesses = [];
    const generated = [];
    const used = new Set([initial]);
    let current = initial;
    const targetY = Math.min(page.height - 50, initial.y + Math.min(4000, Math.max(620, page.height - initial.y - 100)));
    for (let step = 0; step < 18 && current.y < targetY - 100; step++) {
      const options = natural.filter((p) => p !== current && !used.has(p) && p.y >= current.y + 90 && p.y <= current.y + 650)
        .sort((a, b) => Math.abs(a.y - current.y - 220) - Math.abs(b.y - current.y - 220) || a.x - b.x);
      let chosen = null;
      for (const target of options) {
        const link = bridge(current, target, occupied, page.width, physics, target.y - current.y >= 155);
        if (link) { chosen = { target, link }; break; }
      }
      if (!chosen) break;
      for (let index = 0; index < chosen.link.pieces.length; index++) {
        const piece = chosen.link.pieces[index];
        generated.push(piece);
        route.push(piece);
        witnesses.push(chosen.link.witnesses[index]);
      }
      route.push(chosen.target);
      witnesses.push(chosen.link.witnesses.at(-1));
      used.add(chosen.target);
      current = chosen.target;
    }
    if (route.length < 2) return { ok: false, reason: 'no-route', natural, surfaces: natural, route };
    const mainAnchors = route.filter((p) => !p.helper);
    const bonusBase = mainAnchors.length >= 4 ?
      (mainAnchors.slice(2, -1).find((p) => p.safeSpecial !== false) || mainAnchors.slice(1, -1).find((p) => p.safeSpecial !== false)) : null;
    let bonusSurface = null;
    if (bonusBase) {
      for (const side of [1, -1]) {
        const branch = { x: Math.round(side > 0 ? bonusBase.x + bonusBase.width + 34 : bonusBase.x - 130),
          y: Math.round(bonusBase.y - 65), width: 96, height: 13, helper: true, terrain: true, bonus: true };
        if (clear(branch, [...occupied, ...generated], page.width) && witness(bonusBase, branch, physics)) {
          bonusSurface = branch;
          break;
        }
      }
    }
    const goal = { x: current.x + Math.min(current.width - 24, Math.max(28, current.width * 0.65)), y: current.y - 40 };
    return { ok: true, natural, generated: bonusSurface ? [...generated, bonusSurface] : generated,
      surfaces: [...natural, ...generated, ...(bonusSurface ? [bonusSurface] : [])], route, witnesses,
      start: { x: initial.x + Math.min(28, initial.width / 3), y: initial.y - physics.height }, goal,
      specials: { springSurface: bonusSurface ? bonusBase : null, tabletSurface: bonusSurface },
      diagnostics: { dom: natural.length, generated: generated.length + Number(Boolean(bonusSurface)), hops: route.length - 1, depth: Math.round(current.y - initial.y) } };
  }

  globalThis.__pageRunnerTerrain = { generate, normalize, witness };
})();
