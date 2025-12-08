function getFonts() {
    const fonts = new Set();
    const elements = document.querySelectorAll('*');
  
    elements.forEach(el => {
      const style = window.getComputedStyle(el);
      if (style.fontFamily) {
        style.fontFamily.split(',').forEach(font => {
          fonts.add(font.trim().replace(/["']/g, ''));
        });
      }
    });
  
    return [...fonts];
  }
  
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "get_fonts") {
      sendResponse(getFonts());
    }
  });
  