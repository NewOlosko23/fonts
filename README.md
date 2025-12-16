# Font Saver - Chrome Extension

A professional-grade Chrome extension for discovering, collecting, and managing fonts from any website.

## 🌟 Features

### Core Features
- ✅ **Smart Font Detection** - Automatically filters out generic fonts (Arial, sans-serif, etc.)
- ✅ **Two-Tab Interface** - Separate views for current page and saved collection
- ✅ **Save Fonts** - One-click saving with source tracking
- ✅ **Organized Library** - Fonts grouped by source website

### Advanced Features
- 📊 **Usage Count** - See how many elements use each font
- 🎨 **Font Preview** - View fonts in their actual typeface
- 📋 **Clipboard Copy** - One-click font name copying
- 🔍 **Search & Filter** - Find fonts instantly by name, site, or tags
- 🌙 **Dark Mode** - Eye-friendly dark theme with persistence
- 📤 **Export** - JSON and CSV formats for backup and sharing
- 📥 **Import** - Merge font collections from JSON files
- 🏷️ **Tags** - Organize fonts with custom categories

## 🚀 Installation

1. Navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right)
3. Click **Load unpacked**
4. Select the extension directory
5. Pin the extension for easy access

## 📖 Usage

### Scanning Fonts
1. Visit any website
2. Click the extension icon
3. Extension auto-scans and shows only custom fonts
4. Click "Scan Fonts" to refresh

### Saving Fonts
1. Review detected fonts in "Current Page" tab
2. Check usage counts to identify primary fonts
3. Click **Save** button next to fonts you like
4. Fonts are saved with source website

### Managing Collection
1. Switch to **Saved Fonts** tab
2. Search fonts by name, site, or tag
3. Add tags by clicking 🏷️ button
4. Copy font names with 📋 button
5. Delete fonts with × button

### Export & Import
- **Export JSON**: Full backup with metadata and tags
- **Export CSV**: Spreadsheet-friendly format
- **Import**: Merge collections (auto-detects duplicates)

### Dark Mode
- Click 🌙/☀️ in header to toggle
- Preference saved across sessions

## 🎯 Use Cases

- **Design Systems** - Build and document font libraries
- **Web Development** - Discover and reference fonts from sites
- **Typography Research** - Collect inspiration from design sites
- **Team Collaboration** - Share font collections via export/import
- **Client Projects** - Track fonts used across different sites

## 🔧 Technical Details

**Manifest Version**: 3  
**Permissions**: activeTab, tabs, storage, scripting  
**Browser Support**: Chrome 88+, Edge 88+, Brave  

**Storage**: Chrome local storage (~10MB limit)  
**Privacy**: All processing local, no external requests  

## 📁 File Structure

```
/
├── manifest.json      # Extension configuration
├── content.js         # Font detection & usage tracking
├── popup.html         # Extension UI structure
├── popup.js           # Logic for all features
├── styles.css         # Styling with dark mode
└── README.md          # This file
```

## 🎨 Keyboard Shortcuts

*(To be configured in chrome://extensions/shortcuts)*

- Open extension popup
- Toggle dark mode
- Quick save current page fonts

## 💡 Pro Tips

1. **Bulk Collection**: Visit font showcases like Google Fonts and save categories
2. **Consistent Tags**: Use system like `style:serif`, `use:headings`, `mood:modern`
3. **Regular Backups**: Export to JSON monthly
4. **Team Sync**: Share JSON exports via team drives
5. **CSV Documentation**: Import to Google Sheets for design system docs

## 🐛 Known Limitations

- Cannot run on browser-protected pages (chrome://, about:, etc.)
- Font preview works only if font is loaded in browser
- Usage count reflects current page state only

## 🔮 Roadmap

Potential future enhancements:
- Google Fonts API integration
- Font pairing suggestions
- Cloud sync across devices
- Visual font specimens
- License information lookup

## 📄 License

MIT License - Feel free to modify and distribute

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Additional export formats
- Better font preview rendering
- Integration with design tools
- Cloud storage options

## 📧 Support

For issues or feature requests, please file an issue on the repository.

---

**Version**: 2.0  
**Last Updated**: December 2025  
**Author**: Font Saver Team
