const $ = (id) => document.getElementById(id);

const DEFAULTS = {
  apiKey: "",
  instanceUrl: "https://pastefox.com",
  defaultVisibility: "UNLISTED",
  defaultExpiration: "never",
  openInNewTab: true,
  copyToClipboard: true,
  notifications: true,
};

async function load() {
  const settings = await chrome.storage.sync.get(DEFAULTS);
  $("apiKey").value = settings.apiKey;
  $("instanceUrl").value = settings.instanceUrl;
  $("defaultVisibility").value = settings.defaultVisibility;
  $("defaultExpiration").value = settings.defaultExpiration;
  $("openInNewTab").checked = settings.openInNewTab;
  $("copyToClipboard").checked = settings.copyToClipboard;
  $("notifications").checked = settings.notifications;
}

$("btn-save").addEventListener("click", async () => {
  await chrome.storage.sync.set({
    apiKey: $("apiKey").value.trim(),
    instanceUrl: ($("instanceUrl").value.trim() || DEFAULTS.instanceUrl).replace(/\/$/, ""),
    defaultVisibility: $("defaultVisibility").value,
    defaultExpiration: $("defaultExpiration").value,
    openInNewTab: $("openInNewTab").checked,
    copyToClipboard: $("copyToClipboard").checked,
    notifications: $("notifications").checked,
  });
  $("saved").classList.add("show");
  setTimeout(() => $("saved").classList.remove("show"), 2000);
});

$("btn-clear").addEventListener("click", async () => {
  $("apiKey").value = "";
  await chrome.storage.sync.set({ apiKey: "" });
  $("saved").classList.add("show");
  setTimeout(() => $("saved").classList.remove("show"), 2000);
});

load();
