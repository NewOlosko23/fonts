document.getElementById("scan").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "get_fonts" }, (fonts) => {
        if (!fonts) return;
  
        const list = document.getElementById("fontList");
        list.innerHTML = "";
  
        chrome.storage.local.set({ savedFonts: fonts });
  
        fonts.forEach(f => {
          const li = document.createElement("li");
          li.textContent = f;
          list.appendChild(li);
        });
      });
    });
  });
  
  // Load previous saved fonts
  chrome.storage.local.get("savedFonts", (data) => {
    const list = document.getElementById("fontList");
    if (data.savedFonts) {
      data.savedFonts.forEach(f => {
        const li = document.createElement("li");
        li.textContent = f;
        list.appendChild(li);
      });
    }
  });
  