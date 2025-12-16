// Generic font families to filter out
const GENERIC_FONTS = new Set([
  'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui',
  'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded',
  'emoji', 'math', 'fangsong'
]);

// Common fallback fonts to filter out
const COMMON_FALLBACKS = new Set([
  'arial', 'helvetica', 'times new roman', 'times', 'courier new', 'courier',
  'verdana', 'georgia', 'palatino', 'garamond', 'bookman', 'comic sans ms',
  'trebuchet ms', 'arial black', 'impact', 'lucida sans unicode', 'tahoma',
  'lucida console', 'monaco', 'brush script mt', 'copperplate', 'papyrus'
]);

function getFonts() {
  const fontUsage = new Map(); // Track usage count for each font
  const elements = document.querySelectorAll('*');

  elements.forEach(el => {
    const style = window.getComputedStyle(el);
    if (style.fontFamily) {
      // Split by comma and process each font
      const fontList = style.fontFamily.split(',');

      fontList.forEach(font => {
        const cleanFont = font.trim().replace(/["']/g, '');
        const lowerFont = cleanFont.toLowerCase();

        // Filter out generic and common fallback fonts
        if (!GENERIC_FONTS.has(lowerFont) && !COMMON_FALLBACKS.has(lowerFont)) {
          // Increment usage count
          fontUsage.set(cleanFont, (fontUsage.get(cleanFont) || 0) + 1);
        }
      });
    }
  });

  // Convert to array with usage info and sort by name
  return Array.from(fontUsage.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "get_fonts") {
    sendResponse(getFonts());
  }
});