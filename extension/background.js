chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  try {
    for (const file of ["src/world-backdrop.js", "src/knight-sprite.js", "src/game-objects.js", "src/terrain-generator.js", "src/page-runner.js"]) {
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: [file] });
    }
  } catch (error) {
    // Browser-controlled pages cannot be scripted. No page information is logged.
    console.warn("Page Runner cannot start on this tab:", error.message);
  }
});
