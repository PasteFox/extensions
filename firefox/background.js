// Context menu setup + welcome page on install
chrome.runtime.onInstalled.addListener(async (details) => {
  chrome.contextMenus.create({
    id: "pastefox-selection",
    title: "Share to PasteFox",
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "pastefox-page",
    title: "Share page content to PasteFox",
    contexts: ["page"],
  });

  // Open welcome page on first install
  if (details.reason === "install") {
    const settings = await getSettings();
    const baseUrl = settings.instanceUrl.replace(/\/$/, "");
    chrome.tabs.create({
      url: `${baseUrl}/extension/welcome?browser=firefox&token=pf-ext-installed`,
      active: true,
    });
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "pastefox-selection" && info.selectionText) {
    await createPaste(info.selectionText, tab?.title || "Selection");
  }

  if (info.menuItemId === "pastefox-page" && tab?.id) {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.innerText,
    });
    if (result?.result) {
      await createPaste(result.result, tab.title || "Page content");
    }
  }
});

// Listen for messages from popup/content scripts
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.action === "createPaste") {
    createPaste(msg.content, msg.title, msg.options).then(sendResponse);
    return true; // async response
  }
  if (msg.action === "getSettings") {
    getSettings().then(sendResponse);
    return true;
  }
  if (msg.action === "openSettings") {
    chrome.runtime.openOptionsPage();
    sendResponse({ success: true });
  }
});

// Settings helper
async function getSettings() {
  const defaults = {
    apiKey: "",
    instanceUrl: "https://pastefox.com",
    defaultVisibility: "UNLISTED",
    defaultExpiration: "never",
    openInNewTab: true,
    copyToClipboard: true,
    notifications: true,
  };
  const stored = await chrome.storage.sync.get(defaults);
  return { ...defaults, ...stored };
}

// Expiration map
const EXPIRATION_MS = {
  "10m": 10 * 60 * 1000,
  "1h": 60 * 60 * 1000,
  "1d": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

// Create paste via API
async function createPaste(content, title, options = {}) {
  const settings = await getSettings();

  if (!settings.apiKey) {
    chrome.runtime.openOptionsPage();
    return { success: false, error: "No API key configured. Please set your API key in the extension settings." };
  }

  const visibility = options.visibility || settings.defaultVisibility;
  const expiration = options.expiration || settings.defaultExpiration;
  const instanceUrl = settings.instanceUrl.replace(/\/$/, "");

  const body = {
    content: content.substring(0, 500000),
    title: (title || "Untitled").substring(0, 100),
    visibility,
  };

  if (options.language) body.language = options.language;
  if (expiration !== "never" && EXPIRATION_MS[expiration]) {
    body.expiresAt = new Date(Date.now() + EXPIRATION_MS[expiration]).toISOString();
  }

  try {
    const res = await fetch(`${instanceUrl}/api/v1/pastes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": settings.apiKey },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.success && data.data) {
      const pasteUrl = `${instanceUrl}/${data.data.slug}`;

      if (settings.copyToClipboard) {
        // Firefox handles clipboard via content script
      }

      if (settings.openInNewTab) {
        chrome.tabs.create({ url: pasteUrl, active: false });
      }

      return { success: true, url: pasteUrl, slug: data.data.slug };
    }

    return { success: false, error: data.error || "Failed to create paste" };
  } catch (err) {
    return { success: false, error: err.message || "Network error" };
  }
}
