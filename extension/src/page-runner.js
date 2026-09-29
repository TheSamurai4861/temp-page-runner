(() => {
  const previous = globalThis.__pageRunnerInstance;
  if (previous) {
    previous.stop();
    delete globalThis.__pageRunnerInstance;
    return;
  }

  if (!document.body || document.querySelector('input[type="password"], input[autocomplete="cc-number"], form[action*="checkout" i]')) return;

  const knight = globalThis.__pageRunnerKnight;
  const objects = globalThis.__pageRunnerObjects;
  const terrainEngine = globalThis.__pageRunnerTerrain;
  if (!knight || !objects || !globalThis.__pageRunnerWorld || !terrainEngine) return;
  const PLAYER_SCALE = 4 / 3;
  const WIDTH = Math.round(knight.width * PLAYER_SCALE);
  const HEIGHT = Math.round(knight.height * PLAYER_SCALE);
  const SPEED = 250;
  const JUMP = 545;
  const GRAVITY = 1400;
  const MAX_STEP = 1 / 30;
  const keys = new Set();
  let jumpBuffered = 0;
  let coyote = 0;
  let active = true;
  let completed = false;
  let lastTime = 0;
  let frame = 0;
  let platforms = [];
  let route = [];
  let goal;
  let start;
  let checkpoint;
  let player;
  let completionTime = 0;
  let pageSize;
  let fallRespawns = 0;
  let facingLeft = false;
  let landUntil = 0;
  let springUntil = 0;
  let springCooldown = 0;
  let bonusUntil = 0;
  let spring;
  let tablet;
  let pickup;
  let runeReady = false;
  let levelReady = false;
  let terrainDirty = false;
  let lastMutation = 0;
  let terrainGeneration = 0;
  let cameraTargetY = null;
  let observer;

  const host = document.createElement("div");
  host.id = "page-runner-overlay";
  host.style.cssText = "all:initial;position:fixed;inset:0;z-index:2147483647;pointer-events:none;display:block";
  const shadow = host.attachShadow({ mode: "open" });
  shadow.innerHTML = `<style>
    :host{all:initial} canvas{display:block;width:100vw;height:100vh;pointer-events:none}
    .hud{position:fixed;top:12px;left:12px;padding:8px 11px;background:#15191de8;color:#fff;font:12px/1.4 ui-monospace,monospace;border:2px solid #f5f4eb;box-shadow:3px 3px 0 #111;letter-spacing:.02em}
    .power{color:#7ad9b2;font-weight:700}
    .win{display:none;position:fixed;left:50%;top:25%;transform:translateX(-50%);padding:13px 18px;background:#15191d;color:#fff;border:3px solid #7ad9b2;box-shadow:5px 5px 0 #111;font:600 17px ui-monospace,monospace;white-space:nowrap}
    .win.show{display:block}
  </style><canvas aria-hidden="true"></canvas><div class="hud">PAGE RUNNER&nbsp; ← → / A D move&nbsp; ·&nbsp; Space jump&nbsp; ·&nbsp; R restart&nbsp; ·&nbsp; Esc exit<span class="power"></span></div><div class="win">FLAG FOUND ✦</div>`;
  document.documentElement.appendChild(host);
  const canvas = shadow.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const spriteCanvas = document.createElement("canvas");
  spriteCanvas.width = knight.width;
  spriteCanvas.height = knight.height;
  const spriteCtx = spriteCanvas.getContext("2d");
  const win = shadow.querySelector(".win");
  const power = shadow.querySelector(".power");
  const fixture = location.protocol === "http:" && ["127.0.0.1", "localhost"].includes(location.hostname) && location.port === "4173";
  const worldSource = globalThis.chrome?.runtime?.getURL?.("assets/background.png") || (fixture ? "/input/background.png" : null);
  const worldRenderer = worldSource && globalThis.__pageRunnerWorld?.createRenderer(worldSource);
  let worldHost;
  let worldCanvas;
  let worldCtx;
  let worldStyle;
  const contrastNodes = [];
  const contrastClass = `page-runner-world-contrast-${Math.random().toString(36).slice(2)}`;

  function installWorld() {
    if (!worldRenderer) return;
    worldStyle = document.createElement("style");
    worldStyle.id = "page-runner-world-style";
    worldStyle.textContent = `html,body{background:transparent!important;background-image:none!important}
      .${contrastClass}{color:#e9ece8!important;text-shadow:0 1px 2px #0b0e19!important}`;
    const clearBackdrop = new WeakMap();
    function hasClearBackdrop(node) {
      if (!node || node === document.body || node === document.documentElement) return true;
      if (clearBackdrop.has(node)) return clearBackdrop.get(node);
      const style = getComputedStyle(node);
      const alpha = Number(style.backgroundColor.match(/[\d.]+(?=\))/)?.[0] ?? 1);
      const clear = style.backgroundImage === "none" &&
        (style.backgroundColor === "transparent" || style.backgroundColor.startsWith("rgba(") && alpha < 0.4) &&
        hasClearBackdrop(node.parentElement);
      clearBackdrop.set(node, clear);
      return clear;
    }
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    let scanned = 0;
    let matched = 0;
    while (scanned < 2500 && matched < 1200 && walker.nextNode()) {
      const node = walker.currentNode;
      scanned++;
      if (!node.matches("h1,h2,h3,h4,h5,h6,p,a,small,span,li,label")) continue;
      matched++;
      if (node.closest("form,[contenteditable='true']") || !hasClearBackdrop(node)) continue;
      const style = getComputedStyle(node);
      if (style.visibility !== "visible" || style.display === "none") continue;
      const rgb = style.color.match(/[\d.]+/g)?.slice(0, 3).map(Number);
      if (!rgb || rgb[0] * 0.21 + rgb[1] * 0.72 + rgb[2] * 0.07 > 160) continue;
      node.classList.add(contrastClass);
      contrastNodes.push(node);
    }
    document.head.appendChild(worldStyle);
    worldHost = document.createElement("div");
    worldHost.id = "page-runner-world";
    worldHost.style.cssText = "all:initial;position:fixed;inset:0;z-index:-1;pointer-events:none;display:block";
    const worldShadow = worldHost.attachShadow({ mode: "open" });
    worldShadow.innerHTML = '<style>canvas{display:block;width:100vw;height:100vh;image-rendering:pixelated;pointer-events:none}</style><canvas aria-hidden="true"></canvas>';
    worldCanvas = worldShadow.querySelector("canvas");
    worldCtx = worldCanvas.getContext("2d");
    document.body.prepend(worldHost);
  }

  function documentSize() {
    return {
      width: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth, innerWidth),
      height: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, innerHeight)
    };
  }

  function extractPlatforms() {
    const size = documentSize();
    const nodes = document.querySelectorAll("h1,h2,h3,h4,img,article,section,nav,footer,aside,li,main,[role='article'],.card");
    const candidates = [];
    const pinnedCache = new WeakMap();
    function isPinned(node) {
      if (!node || node === document.body) return false;
      if (pinnedCache.has(node)) return pinnedCache.get(node);
      const position = getComputedStyle(node).position;
      const result = position === "fixed" || position === "sticky" || isPinned(node.parentElement);
      pinnedCache.set(node, result);
      return result;
    }
    for (let index = 0; index < Math.min(nodes.length, 2500); index++) {
      const el = nodes[index];
      if (host.contains(el) || el.isContentEditable || el.closest("form,[aria-hidden='true']")) continue;
      if (el.querySelector("form,input,button,textarea,select,[contenteditable],[role='button'],[role='textbox']")) continue;
      if (el.matches("nav,li") && el.querySelector("a,button,input,select,textarea,[role='button'],[role='link']")) continue;
      const style = getComputedStyle(el);
      if (style.display === "none" || style.visibility !== "visible" || Number(style.opacity) < 0.15) continue;
      if (style.position === "fixed" || style.position === "sticky" || style.transform !== "none") continue;
      const box = el.getBoundingClientRect();
      let x = box.left + scrollX;
      const y = box.top + scrollY;
      const maxWidth = el.matches("section,article,[role='article'],.card") ? 0.95 : 0.8;
      let width = box.width;
      if (width > innerWidth * maxWidth && el.matches("h1,h2,h3,h4,li")) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const textBox = range.getBoundingClientRect();
        if (textBox.width >= 65 && textBox.width <= innerWidth * maxWidth) { x = textBox.left + scrollX; width = textBox.width; }
      }
      if (width < 65 || box.height < 16 || width > innerWidth * maxWidth) continue;
      if (box.height > Math.max(650, innerHeight * 1.2) || x < -10 || y < 35 || x > size.width || y > size.height) continue;
      if (isPinned(el.parentElement)) continue;
      const controls = "a,button,form,input,textarea,select,[contenteditable],[role='button'],[role='link'],[role='textbox']";
      candidates.push({ x, y, width, height: box.height, element: el, helper: false,
        safeSpecial: !el.matches(controls) && !el.querySelector(controls) });
    }
    candidates.sort((a, b) => a.y - b.y || b.width - a.width);
    const chosen = [];
    for (const candidate of candidates) {
      const duplicate = chosen.some((other) => {
        const horizontal = Math.max(0, Math.min(candidate.x + candidate.width, other.x + other.width) - Math.max(candidate.x, other.x));
        return Math.abs(other.y - candidate.y) < 55 && horizontal / Math.min(candidate.width, other.width) > 0.65;
      });
      if (!duplicate) chosen.push(candidate);
      if (chosen.length >= 180) break;
    }
    return chosen;
  }

  function occupiedRects() {
    const nodes = document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,a,button,form,input,textarea,select,img,article,section,nav,footer,aside,li,[role='article'],.card");
    const boxes = [];
    for (let index = 0; index < Math.min(nodes.length, 2500); index++) {
      const node = nodes[index];
      if (host.contains(node) || node.closest('[aria-hidden="true"]')) continue;
      const style = getComputedStyle(node);
      if (style.display === "none" || style.visibility !== "visible" || style.position === "fixed" || style.position === "sticky") continue;
      let rect = node.getBoundingClientRect();
      if (rect.width > innerWidth * 0.92 && node.matches("h1,h2,h3,h4,h5,h6,li,p")) {
        const range = document.createRange();
        range.selectNodeContents(node);
        const textBox = range.getBoundingClientRect();
        if (textBox.width <= innerWidth * 0.92) rect = textBox;
      }
      if (rect.width < 6 || rect.height < 6 || rect.width > innerWidth * 0.92 || rect.height > 420) continue;
      boxes.push({ x: rect.left + scrollX, y: rect.top + scrollY, width: rect.width, height: rect.height });
    }
    return boxes;
  }

  function makePlan(from = null) {
    const began = performance.now();
    const plan = terrainEngine.generate({ anchors: extractPlatforms(), occupied: occupiedRects(),
      page: { ...pageSize, scrollX, scrollY }, viewport: { width: innerWidth, height: innerHeight },
      physics: { width: WIDTH, height: HEIGHT, speed: SPEED, jump: JUMP, gravity: GRAVITY }, startSurface: from });
    host.dataset.terrainBuildMs = (performance.now() - began).toFixed(1);
    return plan;
  }

  function setSpecials(plan) {
    const base = plan.specials?.springSurface?.safeSpecial === false ? null : plan.specials?.springSurface;
    const bonus = plan.specials?.tabletSurface;
    spring = base ? { x: base.x + Math.round(base.width * 0.56), y: base.y - 16, width: 32, height: 16, platform: base } : null;
    tablet = bonus ? { x: bonus.x + Math.round(bonus.width * 0.45), y: bonus.y - 28, width: 20, height: 20, used: false } : null;
    host.dataset.spring = String(Boolean(spring));
    host.dataset.tablet = String(Boolean(tablet));
  }

  function updateDiagnostics(plan) {
    host.dataset.domPlatforms = String(plan.diagnostics.dom);
    host.dataset.helperPlatforms = String(plan.diagnostics.generated);
    host.dataset.routePlatforms = String(route.length);
    host.dataset.terrainGeneration = String(++terrainGeneration);
    host.dataset.terrainHops = String(plan.diagnostics.hops);
    host.dataset.terrainRoute = route.map((p) => `${Math.round(p.x)},${Math.round(p.y)},${Math.round(p.width)}`).join("|");
  }

  function buildRoute() {
    const plan = makePlan();
    if (!plan.ok) { host.dataset.levelError = plan.reason; return false; }
    platforms = plan.surfaces;
    route = plan.route;
    start = plan.start;
    goal = plan.goal;
    checkpoint = { ...start };
    player = { ...start, vx: 0, vy: 0, grounded: true };
    setSpecials(plan);
    updateDiagnostics(plan);
    levelReady = true;
    return true;
  }

  function rebuildFuture(landing) {
    pageSize = documentSize();
    const plan = makePlan(landing);
    terrainDirty = false;
    const completedSurfaces = platforms.filter((p) => p.y <= landing.y + 1 || p === landing);
    if (!plan.ok) {
      platforms = completedSurfaces;
      route = route.filter((p) => p.y <= landing.y + 1);
      goal = null;
      if (spring?.platform.y > landing.y) spring = null;
      if (tablet && tablet.y + 28 > landing.y) { tablet = null; pickup = null; }
      win.textContent = "NO PLAYABLE ROUTE · R RETRY · ESC EXIT";
      win.classList.add("show");
      host.dataset.terrainRebuild = plan.reason;
      host.dataset.terrainRoute = route.map((p) => `${Math.round(p.x)},${Math.round(p.y)},${Math.round(p.width)}`).join("|");
      return;
    }
    platforms = [...completedSurfaces, ...plan.surfaces.filter((p) => p.y > landing.y + 1)];
    route = [...route.filter((p) => p.y <= landing.y + 1), ...plan.route.slice(1)];
    goal = plan.goal;
    if (spring?.platform.y > landing.y) spring = null;
    if (tablet && tablet.y + 28 > landing.y) { tablet = null; pickup = null; }
    if (plan.specials?.tabletSurface && plan.specials.tabletSurface.y > landing.y) setSpecials(plan);
    win.textContent = "FLAG FOUND ✦";
    win.classList.remove("show");
    host.dataset.spring = String(Boolean(spring));
    host.dataset.tablet = String(Boolean(tablet));
    updateDiagnostics(plan);
    host.dataset.terrainRebuild = "ok";
  }

  function resize() {
    pageSize = documentSize();
    const scale = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(innerWidth * scale);
    canvas.height = Math.round(innerHeight * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    if (worldCanvas) {
      worldCanvas.width = innerWidth;
      worldCanvas.height = innerHeight;
      worldRenderer.invalidate();
    }
    if (levelReady && observer) { terrainDirty = true; lastMutation = performance.now(); }
  }

  function respawn(fromStart = false) {
    const where = fromStart ? start : checkpoint;
    if (!fromStart) host.dataset.fallRespawns = String(++fallRespawns);
    player = { ...where, vx: 0, vy: 0, grounded: true };
    if (fromStart) {
      checkpoint = { ...start };
      completed = false;
      win.classList.remove("show");
      if (tablet) tablet.used = false;
      pickup = null;
      runeReady = false;
      springCooldown = 0;
      springUntil = 0;
      bonusUntil = 0;
      landUntil = 0;
      facingLeft = false;
    }
    cameraTargetY = Math.max(0, Math.min(pageSize.height - innerHeight, player.y - innerHeight * 0.45));
    window.scrollTo({ top: cameraTargetY, behavior: "instant" });
  }

  function editable(target) {
    return target instanceof Element && (target.isContentEditable || Boolean(target.closest("input,textarea,select,[role='textbox']")));
  }

  function onFocusIn(event) {
    if (event.target instanceof Element &&
      (editable(event.target) || event.target.closest("form,button,[role='button']"))) stop();
  }

  function onKeyDown(event) {
    if (editable(event.target) || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "Escape") { event.preventDefault(); stop(); return; }
    if (!levelReady) return;
    const key = event.key.toLowerCase();
    if (["arrowleft", "arrowright", "arrowup", " ", "a", "d", "w", "r"].includes(key)) {
      event.preventDefault();
      event.stopPropagation();
      keys.add(key);
      if ([" ", "arrowup", "w"].includes(key) && !event.repeat) jumpBuffered = 0.13;
      if (key === "r" && !event.repeat) {
        if (goal || buildRoute()) respawn(true);
      }
    }
  }
  function onKeyUp(event) { keys.delete(event.key.toLowerCase()); }
  function onBlur() { keys.clear(); }

  function update(dt) {
    if (completed) return;
    const wasGrounded = player.grounded;
    jumpBuffered = Math.max(0, jumpBuffered - dt);
    coyote = player.grounded ? 0.09 : Math.max(0, coyote - dt);
    const left = keys.has("arrowleft") || keys.has("a");
    const right = keys.has("arrowright") || keys.has("d");
    player.vx = (Number(right) - Number(left)) * SPEED;
    if (player.vx) facingLeft = player.vx < 0;
    if (jumpBuffered > 0 && coyote > 0) {
      player.vy = -JUMP * (runeReady ? 1.25 : 1);
      runeReady = false;
      player.grounded = false;
      jumpBuffered = 0;
      coyote = 0;
    }
    const oldBottom = player.y + HEIGHT;
    player.x = Math.max(0, Math.min(pageSize.width - WIDTH, player.x + player.vx * dt));
    player.vy = Math.min(900, player.vy + GRAVITY * dt);
    player.y += player.vy * dt;
    player.grounded = false;
    if (player.vy >= 0) {
      let landing = null;
      for (const p of platforms) {
        if (oldBottom <= p.y + 5 && player.y + HEIGHT >= p.y && player.x + WIDTH > p.x + 3 && player.x < p.x + p.width - 3) {
          if (!landing || p.y < landing.y) landing = p;
        }
      }
      if (landing) {
        if (player.vy > 100 && !wasGrounded) landUntil = performance.now() + 150;
        player.y = landing.y - HEIGHT;
        player.vy = 0;
        player.grounded = true;
        checkpoint = { x: Math.max(landing.x + 5, Math.min(player.x, landing.x + landing.width - WIDTH - 5)), y: player.y };
        if (terrainDirty && performance.now() - lastMutation > 300) rebuildFuture(landing);
        if (spring && !wasGrounded && landing === spring.platform && performance.now() > springCooldown &&
          player.x + WIDTH > spring.x + 4 && player.x < spring.x + spring.width - 4) {
          player.vy = -JUMP * 1.2;
          player.grounded = false;
          coyote = 0;
          springUntil = performance.now() + 240;
          springCooldown = performance.now() + 550;
        }
      }
    }
    if (tablet && !tablet.used && player.x < tablet.x + tablet.width && player.x + WIDTH > tablet.x &&
      player.y < tablet.y + tablet.height && player.y + HEIGHT > tablet.y) {
      tablet.used = true;
      pickup = { x: tablet.x + 1, y: tablet.y - 25, width: 18, height: 24 };
    }
    if (pickup && player.x < pickup.x + pickup.width && player.x + WIDTH > pickup.x &&
      player.y < pickup.y + pickup.height && player.y + HEIGHT > pickup.y) {
      pickup = null;
      runeReady = true;
      bonusUntil = performance.now() + 350;
    }
    if (player.y > checkpoint.y + 590 || player.y > pageSize.height + 100) respawn();
    if (goal && Math.abs(player.x + WIDTH / 2 - goal.x) < 25 && Math.abs(player.y + HEIGHT - (goal.y + 40)) < 48) {
      completed = true;
      completionTime = performance.now();
      win.classList.add("show");
    }
    const screenY = player.y - scrollY;
    if (screenY > innerHeight * 0.64 || screenY < innerHeight * 0.19) {
      cameraTargetY = Math.max(0, Math.min(pageSize.height - innerHeight, player.y - innerHeight * 0.44));
    }
    if (cameraTargetY !== null) cameraTargetY = Math.max(0, Math.min(cameraTargetY, pageSize.height - innerHeight));
    if (cameraTargetY !== null && Math.abs(cameraTargetY - scrollY) > 0.5) {
      const nextY = scrollY + (cameraTargetY - scrollY) * (1 - Math.exp(-8 * dt));
      window.scrollTo({ top: nextY, behavior: "instant" });
    }
    host.dataset.playerX = String(Math.round(player.x));
    host.dataset.playerY = String(Math.round(player.y));
    host.dataset.grounded = String(player.grounded);
    host.dataset.completed = String(completed);
    host.dataset.runeReady = String(runeReady);
    host.dataset.tabletUsed = String(Boolean(tablet?.used));
    host.dataset.pickupVisible = String(Boolean(pickup));
    power.textContent = runeReady ? "  ·  RUNE READY" : "";
  }

  function pixelRect(x, y, w, h, color) { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), w, h); }
  function draw() {
    if (worldCtx) {
      worldRenderer.draw(worldCtx, innerWidth, innerHeight, scrollX, scrollY, pageSize.width, pageSize.height);
      host.dataset.worldReady = String(worldRenderer.ready);
      host.dataset.worldZoom = worldRenderer.zoom.toFixed(3);
    }
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of platforms) {
      const x = p.x - scrollX, y = p.y - scrollY;
      if (y < -30 || y > innerHeight + 30 || x > innerWidth || x + p.width < 0) continue;
      pixelRect(x, y - 3, p.width, 4, p.bonus ? "#e7b562" : p.terrain ? "#67d5b5" : "#57b89d");
      if (p.terrain) {
        pixelRect(x, y + 1, p.width, 11, "#263844");
        pixelRect(x + 6, y + 12, Math.max(8, p.width - 20), 4, "#192831");
        for (let dot = 9; dot < p.width - 8; dot += 19) {
          pixelRect(x + dot, y + 4, 7, 3, dot % 2 ? "#52676a" : "#e7b562");
        }
      } else {
        pixelRect(x, y + 1, Math.min(p.width, 7), 6, "#1d3d39");
        pixelRect(x + p.width - 7, y + 1, 7, 6, "#1d3d39");
      }
    }
    const now = performance.now();
    if (spring) objects.pad(ctx, spring.x - scrollX, spring.y - scrollY, now);
    if (tablet) objects.tablet(ctx, tablet.x - scrollX, tablet.y - scrollY, tablet.used, now);
    if (pickup) objects.rune(ctx, pickup.x - scrollX, pickup.y - scrollY + Math.sin(now / 180) * 2, now);
    if (goal) {
      const gx = goal.x - scrollX, gy = goal.y - scrollY;
      pixelRect(gx, gy, 3, 40, "#21333b");
      pixelRect(gx + 3, gy + 1, 21, 14, "#e4ac57");
      pixelRect(gx + 5, gy + 4, 8, 3, "#263844");
      pixelRect(gx + 15, gy + 8, 5, 3, "#263844");
      pixelRect(gx - 5, gy + 39, 13, 3, "#21333b");
    }
    const x = player.x - scrollX, y = player.y - scrollY;
    const state = completed ? "win" : now < springUntil ? "spring" : now < bonusUntil ? "bonus" : !player.grounded ? player.vy < 0 ? "jump" : "fall" :
      now < landUntil ? "land" : player.vx ? "run" : "idle";
    host.dataset.spriteState = state;
    const bounce = completed ? Math.round(Math.sin((now - completionTime) / 90) * 4) : 0;
    spriteCtx.clearRect(0, 0, knight.width, knight.height);
    knight.draw(spriteCtx, 0, 0, state, now, facingLeft);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(spriteCanvas, Math.round(x), Math.round(y + bounce), WIDTH, HEIGHT);
    if (completed) {
      for (let i = 0; i < 9; i++) {
        const angle = i * Math.PI * 2 / 9;
        const radius = 18 + Math.min(38, (performance.now() - completionTime) / 15);
        pixelRect(x + 7 + Math.cos(angle) * radius, y + 8 + Math.sin(angle) * radius, 4, 4, i % 2 ? "#e4ac57" : "#57b89d");
      }
    }
  }

  function tick(time) {
    if (!active) return;
    const dt = Math.min(MAX_STEP, Math.max(0, (time - (lastTime || time)) / 1000));
    lastTime = time;
    update(dt);
    draw();
    frame = requestAnimationFrame(tick);
  }

  function stop() {
    if (!active) return;
    active = false;
    cancelAnimationFrame(frame);
    window.removeEventListener("keydown", onKeyDown, true);
    window.removeEventListener("keyup", onKeyUp, true);
    document.removeEventListener("focusin", onFocusIn, true);
    window.removeEventListener("blur", onBlur);
    window.removeEventListener("resize", resize);
    observer?.disconnect();
    host.remove();
    worldHost?.remove();
    worldStyle?.remove();
    for (const node of contrastNodes) node.classList.remove(contrastClass);
    if (globalThis.__pageRunnerInstance?.stop === stop) delete globalThis.__pageRunnerInstance;
  }

  pageSize = documentSize();
  const routeReady = buildRoute();
  if (routeReady) {
    installWorld();
    resize();
    observer = new MutationObserver((records) => {
      if (records.some((record) => record.target !== worldHost && !worldHost?.contains(record.target))) {
        terrainDirty = true;
        lastMutation = performance.now();
      }
    });
    observer.observe(document.body, { subtree: true, childList: true, characterData: true,
      attributes: true, attributeFilter: ["class", "style", "hidden"] });
  } else {
    win.textContent = "NO PLAYABLE ROUTE · ESC EXIT";
    win.classList.add("show");
  }
  window.addEventListener("keydown", onKeyDown, true);
  window.addEventListener("keyup", onKeyUp, true);
  document.addEventListener("focusin", onFocusIn, true);
  window.addEventListener("blur", onBlur);
  window.addEventListener("resize", resize);
  globalThis.__pageRunnerInstance = { stop };
  onFocusIn({ target: document.activeElement });
  if (active && routeReady) frame = requestAnimationFrame(tick);
})();
