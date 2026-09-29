(() => {
  // Crop the supplied local artwork into the viewport. The crop follows document
  // progress and clamps to image bounds, so scrolling never reveals an edge.
  function createRenderer(source = '/input/background.png') {
    const artwork = new Image();
    artwork.decoding = 'async';
    artwork.src = source;
    let ready = false;
    let currentZoom = 1;
    let dirty = true;
    let lastKey = '';
    artwork.onload = () => { ready = true; dirty = true; };
    artwork.onerror = () => { ready = false; dirty = true; };
    return {
      get ready() { return ready; },
      get zoom() { return currentZoom; },
      invalidate() { dirty = true; },
      draw(target, width, height, cameraX = 0, cameraY = 0, documentWidth = width, documentHeight = height) {
        const w = Math.max(1, width), h = Math.max(1, height);
        const pageWidth = Math.max(w, documentWidth), pageHeight = Math.max(h, documentHeight);
        const verticalProgress = Math.min(1, Math.max(0, cameraY / Math.max(1, pageHeight - h)));
        const horizontalProgress = Math.min(1, Math.max(0, cameraX / Math.max(1, pageWidth - w)));
        const key = [w, h, Math.round(verticalProgress * 1000), Math.round(horizontalProgress * 1000), pageHeight, pageWidth, ready].join(':');
        if (!dirty && key === lastKey) return;
        dirty = false;
        lastKey = key;
        target.clearRect(0, 0, w, h);
        target.fillStyle = '#0b0e19';
        target.fillRect(0, 0, w, h);
        if (!ready) return;

        const pageDepth = Math.max(1, pageHeight / h);
        const zoom = 1.025 + Math.min(0.105, Math.log2(pageDepth) * 0.028);
        currentZoom = zoom;
        const cover = Math.max(w / artwork.naturalWidth, h / artwork.naturalHeight);
        const drawWidth = artwork.naturalWidth * cover * zoom;
        const drawHeight = artwork.naturalHeight * cover * zoom;
        const overflowX = Math.max(0, drawWidth - w);
        const overflowY = Math.max(0, drawHeight - h);
        const x = -overflowX * (0.5 + (horizontalProgress - 0.5) * 0.7);
        const y = -overflowY * (0.06 + verticalProgress * 0.88);
        target.imageSmoothingEnabled = false;
        target.drawImage(artwork, Math.round(x), Math.round(y), Math.ceil(drawWidth), Math.ceil(drawHeight));
      }
    };
  }
  globalThis.__pageRunnerWorld = { createRenderer };
})();
