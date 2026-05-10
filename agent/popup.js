document.getElementById("autofill-btn").addEventListener("click", async () => {
  document.getElementById("status").innerText = "Agent is scanning page...";
  
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(tab.id, { action: "START_AGENT" }, (response) => {
    if (response && response.success) {
      document.getElementById("status").innerText = "Fields mapped successfully!";
    } else {
      document.getElementById("status").innerText = "Agent finished (or encountered an error).";
    }
  });
});