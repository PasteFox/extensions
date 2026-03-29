const $ = (id) => document.getElementById(id);

let settings = {};

async function init() {
  settings = await chrome.runtime.sendMessage({ action: "getSettings" });

  if (!settings.apiKey) {
    $("no-key").classList.remove("hidden");
    $("form").classList.add("hidden");
  } else {
    $("no-key").classList.add("hidden");
    $("form").classList.remove("hidden");
    $("visibility").value = settings.defaultVisibility || "UNLISTED";
    $("expiration").value = settings.defaultExpiration || "never";
  }

  // Try to get selected text from active tab
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.getSelection()?.toString() || "",
      });
      if (result?.result) {
        $("content").value = result.result;
        $("title").value = tab.title?.substring(0, 100) || "";
      }
    }
  } catch { /* no access to page */ }
}

$("btn-settings").addEventListener("click", () => chrome.runtime.openOptionsPage());
$("btn-options").addEventListener("click", (e) => { e.preventDefault(); chrome.runtime.openOptionsPage(); });

$("btn-create").addEventListener("click", async () => {
  const content = $("content").value.trim();
  if (!content) { $("content").focus(); return; }

  $("form").classList.add("hidden");
  $("loading").classList.add("active");
  $("result").classList.add("hidden");

  const result = await chrome.runtime.sendMessage({
    action: "createPaste",
    content,
    title: $("title").value || "Untitled",
    options: {
      visibility: $("visibility").value,
      expiration: $("expiration").value,
    },
  });

  $("loading").classList.remove("active");
  $("result").classList.remove("hidden");

  if (result.success) {
    $("result").className = "result success";
    $("result").innerHTML = `
      <p>Paste created!</p>
      <a href="${result.url}" target="_blank" class="slug">${result.url}</a>
    `;

    // Copy to clipboard
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (text) => navigator.clipboard.writeText(text),
          args: [result.url],
        });
      }
    } catch { /* clipboard failed */ }
  } else {
    $("result").className = "result error";
    $("result").innerHTML = `<p>${result.error}</p>`;
    setTimeout(() => {
      $("result").classList.add("hidden");
      $("form").classList.remove("hidden");
    }, 3000);
  }
});

$("btn-from-page").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;

    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.innerText,
    });

    if (result?.result) {
      $("content").value = result.result.substring(0, 500000);
      $("title").value = tab.title?.substring(0, 100) || "Page content";
    }
  } catch {
    $("content").placeholder = "Could not access page content";
  }
});

init();
