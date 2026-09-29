import test from 'node:test';
import assert from 'node:assert/strict';
await import('../extension/src/terrain-generator.js');

const terrain = globalThis.__pageRunnerTerrain;
const physics = { width: 24, height: 32, speed: 250, jump: 545, gravity: 1400 };
const viewport = { width: 900, height: 700 };
const rect = (x, y, width = 160, height = 100) => ({ x, y, width, height, helper: false });
const build = (anchors, width = 900, height = 1800) => terrain.generate({ anchors, occupied: anchors, page: { width, height, scrollX: 0, scrollY: 0 }, viewport, physics });

test('dense page produces a deterministic route with physical terrain pieces', () => {
  const anchors = [rect(80, 220), rect(300, 430), rect(360, 640), rect(570, 850), rect(640, 1060)];
  const first = build(anchors);
  const again = build(anchors);
  assert.equal(first.ok, true);
  assert.ok(first.generated.length > 0);
  assert.deepEqual(first.generated, again.generated);
  assert.equal(first.witnesses.length, first.route.length - 1);
  first.route.slice(1).forEach((to, index) => assert.ok(terrain.witness(first.route[index], to, physics)));
  for (const piece of first.generated) {
    assert.equal(anchors.some((anchor) =>
      Math.min(piece.x + piece.width, anchor.x + anchor.width) - Math.max(piece.x, anchor.x) > 8 &&
      Math.min(piece.y + 13, anchor.y + anchor.height) - Math.max(piece.y - 8, anchor.y) > 2), false);
  }
  if (first.specials.tabletSurface) assert.equal(first.route.includes(first.specials.tabletSurface), false);
});

test('sparse gap uses at most two connecting pieces', () => {
  const anchors = [rect(80, 220), rect(440, 760), rect(480, 1240)];
  const result = build(anchors);
  assert.equal(result.ok, true);
  assert.ok(result.generated.length >= 1);
  assert.ok(result.generated.length <= 4);
  assert.ok(result.route.some((surface) => surface === anchors[1]));
});

test('a sufficiently long page can generate a route beyond the first screenfuls', () => {
  const anchors = Array.from({ length: 18 }, (_, index) => rect(110 + (index % 3) * 145, 220 + index * 210));
  const result = build(anchors, 900, 4300);
  assert.equal(result.ok, true);
  assert.ok(result.diagnostics.depth > 2500);
  assert.equal(result.witnesses.length, result.route.length - 1);
});

test('a wide starting block cannot be fallen through to an interior ledge', () => {
  assert.equal(terrain.witness(rect(250, 373, 780, 180), rect(596, 687, 88, 13), physics), null);
});

test('nested overlapping anchors collapse to one usable surface', () => {
  const anchors = [rect(100, 220, 220), rect(110, 225, 180), rect(350, 450)];
  assert.equal(terrain.normalize(anchors).length, 2);
});

test('empty and impossible layouts fail explicitly', () => {
  assert.equal(build([]).reason, 'no-anchor');
  const impossible = build([rect(30, 220), rect(1710, 850)], 1900, 1700);
  assert.equal(impossible.ok, false);
  assert.equal(impossible.reason, 'no-route');
});
