const list = document.getElementById("fontList");
const scanBtn = document.getElementById("scan");
const currentUrlDiv = document.getElementById("currentUrl");
const savedFontsContainer = document.getElementById("savedFontsContainer");
const tabs = document.querySelectorAll(".tab");
const currentView = document.getElementById("currentView");
const savedView = document.getElementById("savedView");
const searchInput = document.getElementById("searchInput");
const darkModeToggle = document.getElementById("darkModeToggle");
const exportJsonBtn = document.getElementById("exportJson");
const exportCsvBtn = document.getElementById("exportCsv");
const importFileInput = document.getElementById("importFile");

let currentPageUrl = "";
let currentPageTitle = "";
let allSavedFonts = [];
let currentSearchQuery = "";

// Dark Mode
function loadDarkMode() {
  chrome.storage.local.get("darkMode", (data) => {
    if (data.darkMode) {
      document.body.classList.add("dark-mode");
      darkModeToggle.textContent = "☀️";
    }
  });
}

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  darkModeToggle.textContent = isDark ? "☀️" : "🌙";
  chrome.storage.local.set({ darkMode: isDark });
});

// Tab switching
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const tabName = tab.dataset.tab;

    // Update active tab
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    // Show/hide content
    if (tabName === "current") {
      currentView.classList.add("active");
      savedView.classList.remove("active");
    } else {
      currentView.classList.remove("active");
      savedView.classList.add("active");
      renderSavedFonts();
    }
  });
});

function canInject(tab) {
  if (!tab || !tab.url) return false;
  return !tab.url.startsWith("chrome://") &&
    !tab.url.startsWith("chromewebstore://") &&
    !tab.url.startsWith("about:");
}

function getSiteName(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log("Copied to clipboard:", text);
  }).catch(err => {
    console.error("Failed to copy:", err);
  });
}

function renderFonts(fonts, url, title) {
  list.innerHTML = "";
  currentPageUrl = url;
  currentPageTitle = title || getSiteName(url);

  // Display current URL
  currentUrlDiv.textContent = `From: ${currentPageTitle}`;
  currentUrlDiv.style.display = "block";

  if (!fonts || fonts.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No custom fonts detected on this page.";
    li.className = "no-fonts";
    list.appendChild(li);
    return;
  }

  fonts.forEach((fontData) => {
    const fontName = typeof fontData === 'string' ? fontData : fontData.name;
    const usageCount = typeof fontData === 'object' ? fontData.count : null;

    const li = document.createElement("li");
    li.className = "font-item";

    const fontInfo = document.createElement("div");
    fontInfo.className = "font-info-current";

    const fontNameDiv = document.createElement("div");
    fontNameDiv.className = "font-name-with-preview";

    const fontSpan = document.createElement("span");
    fontSpan.textContent = fontName;
    fontSpan.className = "font-name";
    fontSpan.style.fontFamily = `"${fontName}", sans-serif`;

    fontNameDiv.appendChild(fontSpan);

    if (usageCount) {
      const usageSpan = document.createElement("span");
      usageSpan.className = "usage-count";
      usageSpan.textContent = `${usageCount} elements`;
      usageSpan.title = `This font is used on ${usageCount} elements`;
      fontNameDiv.appendChild(usageSpan);
    }

    fontInfo.appendChild(fontNameDiv);

    const actions = document.createElement("div");
    actions.className = "font-actions";

    // Copy button
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "📋";
    copyBtn.className = "action-btn copy-btn";
    copyBtn.title = "Copy font name";
    copyBtn.addEventListener("click", () => {
      copyToClipboard(fontName);
      copyBtn.textContent = "✓";
      setTimeout(() => copyBtn.textContent = "📋", 1000);
    });

    // Save button
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.className = "save-btn";
    saveBtn.addEventListener("click", () => {
      saveFont(fontName, currentPageUrl, currentPageTitle);
      saveBtn.textContent = "Saved!";
      saveBtn.disabled = true;
    });

    actions.appendChild(copyBtn);
    actions.appendChild(saveBtn);

    li.appendChild(fontInfo);
    li.appendChild(actions);
    list.appendChild(li);
  });
}

function saveFont(fontName, url, title, tags = []) {
  chrome.storage.local.get("savedFonts", (data) => {
    const savedFonts = data.savedFonts || [];

    // Check if font is already saved
    const exists = savedFonts.some(f => f.name === fontName && f.url === url);
    if (!exists) {
      savedFonts.push({
        name: fontName,
        url: url,
        site: title || getSiteName(url),
        savedAt: new Date().toISOString(),
        tags: tags
      });

      chrome.storage.local.set({ savedFonts }, () => {
        console.log("Font saved:", fontName);
      });
    }
  });
}

function renderSavedFonts(searchQuery = "") {
  chrome.storage.local.get("savedFonts", (data) => {
    allSavedFonts = data.savedFonts || [];

    // Filter by search query
    let filteredFonts = allSavedFonts;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredFonts = allSavedFonts.filter(font =>
        font.name.toLowerCase().includes(query) ||
        font.site.toLowerCase().includes(query) ||
        (font.tags && font.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    savedFontsContainer.innerHTML = "";

    if (filteredFonts.length === 0) {
      const message = searchQuery
        ? `<p class='no-fonts'>No fonts found matching "${searchQuery}"</p>`
        : "<p class='no-fonts'>No saved fonts yet. Scan a page and save some fonts!</p>";
      savedFontsContainer.innerHTML = message;
      return;
    }

    // Group fonts by site
    const fontsBySite = {};
    filteredFonts.forEach(font => {
      if (!fontsBySite[font.site]) {
        fontsBySite[font.site] = [];
      }
      fontsBySite[font.site].push(font);
    });

    // Render grouped fonts
    Object.keys(fontsBySite).sort().forEach(site => {
      const siteGroup = document.createElement("div");
      siteGroup.className = "site-group";

      const siteHeader = document.createElement("div");
      siteHeader.className = "site-header";
      siteHeader.textContent = site;
      siteGroup.appendChild(siteHeader);

      const fontsList = document.createElement("ul");
      fontsList.className = "saved-fonts-list";

      fontsBySite[site].forEach(font => {
        const li = document.createElement("li");
        li.className = "saved-font-item";

        const fontInfo = document.createElement("div");
        fontInfo.className = "font-info";

        const fontNameDiv = document.createElement("div");
        fontNameDiv.className = "font-name-preview";
        fontNameDiv.style.fontFamily = `"${font.name}", sans-serif`;
        fontNameDiv.textContent = font.name;

        fontInfo.appendChild(fontNameDiv);

        // Tags
        if (font.tags && font.tags.length > 0) {
          const tagsDiv = document.createElement("div");
          tagsDiv.className = "tags";
          font.tags.forEach(tag => {
            const tagSpan = document.createElement("span");
            tagSpan.className = "tag";
            tagSpan.textContent = tag;
            tagsDiv.appendChild(tagSpan);
          });
          fontInfo.appendChild(tagsDiv);
        }

        const actions = document.createElement("div");
        actions.className = "saved-actions";

        // Copy button
        const copyBtn = document.createElement("button");
        copyBtn.textContent = "📋";
        copyBtn.className = "action-btn copy-btn";
        copyBtn.title = "Copy font name";
        copyBtn.addEventListener("click", () => {
          copyToClipboard(font.name);
          copyBtn.textContent = "✓";
          setTimeout(() => copyBtn.textContent = "📋", 1000);
        });

        // Edit tags button
        const editBtn = document.createElement("button");
        editBtn.textContent = "🏷️";
        editBtn.className = "action-btn edit-btn";
        editBtn.title = "Edit tags";
        editBtn.addEventListener("click", () => {
          editTags(font);
        });

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "×";
        deleteBtn.className = "delete-btn";
        deleteBtn.title = "Delete this font";
        deleteBtn.addEventListener("click", () => {
          deleteFont(font.name, font.url);
        });

        actions.appendChild(copyBtn);
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(fontInfo);
        li.appendChild(actions);
        fontsList.appendChild(li);
      });

      siteGroup.appendChild(fontsList);
      savedFontsContainer.appendChild(siteGroup);
    });
  });
}

function editTags(font) {
  const currentTags = font.tags || [];
  const tagsString = currentTags.join(", ");
  const newTagsString = prompt(`Edit tags for "${font.name}" (comma-separated):`, tagsString);

  if (newTagsString !== null) {
    const newTags = newTagsString
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    chrome.storage.local.get("savedFonts", (data) => {
      const savedFonts = data.savedFonts || [];
      const fontIndex = savedFonts.findIndex(f => f.name === font.name && f.url === font.url);

      if (fontIndex !== -1) {
        savedFonts[fontIndex].tags = newTags;
        chrome.storage.local.set({ savedFonts }, () => {
          renderSavedFonts(currentSearchQuery);
        });
      }
    });
  }
}

function deleteFont(fontName, url) {
  chrome.storage.local.get("savedFonts", (data) => {
    const savedFonts = data.savedFonts || [];
    const filtered = savedFonts.filter(f => !(f.name === fontName && f.url === url));

    chrome.storage.local.set({ savedFonts: filtered }, () => {
      renderSavedFonts(currentSearchQuery);
    });
  });
}

// Search functionality
searchInput.addEventListener("input", (e) => {
  currentSearchQuery = e.target.value;
  renderSavedFonts(currentSearchQuery);
});

// Export to JSON
exportJsonBtn.addEventListener("click", () => {
  chrome.storage.local.get("savedFonts", (data) => {
    const savedFonts = data.savedFonts || [];
    const json = JSON.stringify(savedFonts, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `font-collection-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
});

// Export to CSV
exportCsvBtn.addEventListener("click", () => {
  chrome.storage.local.get("savedFonts", (data) => {
    const savedFonts = data.savedFonts || [];

    // Create CSV header
    let csv = "Font Name,Website,Source URL,Saved Date,Tags\n";

    // Add data rows
    savedFonts.forEach(font => {
      const tags = (font.tags || []).join("; ");
      const date = new Date(font.savedAt).toLocaleDateString();
      csv += `"${font.name}","${font.site}","${font.url}","${date}","${tags}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `font-collection-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  });
});

// Import from JSON
importFileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const importedFonts = JSON.parse(event.target.result);

      if (!Array.isArray(importedFonts)) {
        alert("Invalid file format. Please import a valid JSON file.");
        return;
      }

      chrome.storage.local.get("savedFonts", (data) => {
        const existingFonts = data.savedFonts || [];

        // Merge fonts, avoiding duplicates
        const mergedFonts = [...existingFonts];
        importedFonts.forEach(importedFont => {
          const exists = existingFonts.some(f =>
            f.name === importedFont.name && f.url === importedFont.url
          );
          if (!exists) {
            mergedFonts.push(importedFont);
          }
        });

        chrome.storage.local.set({ savedFonts: mergedFonts }, () => {
          alert(`Imported ${mergedFonts.length - existingFonts.length} new fonts!`);
          renderSavedFonts();
        });
      });
    } catch (error) {
      alert("Error reading file. Please make sure it's a valid JSON file.");
    }
  };
  reader.readAsText(file);

  // Reset input
  e.target.value = "";
});

function renderMessage(msg) {
  list.innerHTML = "";
  currentUrlDiv.style.display = "none";
  const li = document.createElement("li");
  li.textContent = msg;
  li.className = "no-fonts";
  list.appendChild(li);
}

function sendGetFonts(tabId, url, title) {
  chrome.tabs.sendMessage(tabId, { action: "get_fonts" }, (fonts) => {
    if (chrome.runtime.lastError) {
      renderMessage("Cannot access this page. Try another site.");
      return;
    }
    renderFonts(fonts, url, title);
  });
}

function injectContentScript(tab) {
  return new Promise((resolve) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ["content.js"],
      },
      () => {
        if (chrome.runtime.lastError) {
          renderMessage("Cannot access this page. Try another site.");
          resolve(false);
          return;
        }
        resolve(true);
      }
    );
  });
}

scanBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0];
    if (!tab?.id) {
      renderMessage("No active tab found.");
      return;
    }

    if (!canInject(tab)) {
      renderMessage("Cannot run on this page (browser-protected).");
      return;
    }

    chrome.tabs.sendMessage(tab.id, { action: "get_fonts" }, async (fonts) => {
      if (chrome.runtime.lastError) {
        const injected = await injectContentScript(tab);
        if (injected) {
          sendGetFonts(tab.id, tab.url, tab.title);
        }
        return;
      }

      renderFonts(fonts, tab.url, tab.title);
    });
  });
});

// Initialize
loadDarkMode();

// Auto-scan on popup open
chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
  const tab = tabs[0];
  if (!tab?.id || !canInject(tab)) return;

  chrome.tabs.sendMessage(tab.id, { action: "get_fonts" }, async (fonts) => {
    if (chrome.runtime.lastError) {
      const injected = await injectContentScript(tab);
      if (injected) {
        setTimeout(() => sendGetFonts(tab.id, tab.url, tab.title), 100);
      }
      return;
    }

    renderFonts(fonts, tab.url, tab.title);
  });
});