// Bridge script — injected only on PasteFox pages
// Listens for postMessage from the webpage to open extension settings

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data?.type === "PASTEFOX_OPEN_SETTINGS") {
    chrome.runtime.sendMessage({ action: "openSettings" });
  }
});
