chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["src/page-runner.js"]
    });
  } catch (error) {
    // Browser-controlled pages cannot be scripted. No page information is logged.
    console.warn("Page Runner cannot start on this tab:", error.message);
  }
});
