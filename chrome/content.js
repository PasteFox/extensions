// Content script — listens for messages from the background script
// Minimal footprint, only activates when needed

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.action === "getSelection") {
    sendResponse({ text: window.getSelection()?.toString() || "" });
  }
  if (msg.action === "getPageContent") {
    sendResponse({ text: document.body.innerText || "" });
  }
  if (msg.action === "copyToClipboard") {
    navigator.clipboard.writeText(msg.text).then(
      () => sendResponse({ success: true }),
      () => sendResponse({ success: false })
    );
    return true; // async
  }
});
