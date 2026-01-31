# Changelog

All notable changes to Dishook will be documented in this file.

## [1.1.0] - 2026-02-01

### Added
- ✨ **Multiple Embeds Support** - Send up to 10 embeds in a single message
- ✨ **Extended Embed Features**:
  - Author section with name, URL, and icon
  - Up to 25 fields with inline/regular layout options
  - Main image and thumbnail support
  - Footer with text and icon
  - Title URL support
- ✨ **Allowed Mentions Control** - Granular control over mentions:
  - Toggle @everyone and @here mentions
  - Toggle user mentions
  - Toggle role mentions
- ✨ **Live Embed Preview** - Real-time preview of embeds as you type
- ✨ **Search Button in Header** - Quick access to webhook status checker
- ✨ **Status Checker Modal** - Moved to dedicated modal dialog with:
  - Enhanced UI with backdrop blur
  - Full metadata viewer
  - Refresh capability
  - Better mobile experience
- ✨ **Form Subsections** - Better organized embed form with clear sections

### Changed
- 🔧 **Danger Button Colors** - Always red with white text in both light and dark modes
- 🔧 **Modal Backdrop** - Enhanced with blur effect for better focus
- 🔧 **Capabilities List** - Now shows only supported features (removed unsupported ones)
- 🔧 **Status Checker** - Moved from dashboard to modal dialog accessible via header search button
- 🔧 **Error Color in Dark Mode** - Changed from #F2B8B5 to #F44336 for consistency

### Improved
- 🚀 **UX** - Cleaner interface with better organization
- 🚀 **Accessibility** - Better keyboard navigation and focus states
- 🚀 **Mobile Experience** - Optimized modal dialogs for mobile devices
- 🚀 **Code Organization** - Better structured JavaScript with clear sections

### Technical Details
- Added `embedFields` array to WebhookManager state
- Implemented `renderEmbedFieldsList()` for field management
- Implemented `updateEmbedPreview()` for real-time preview
- Added Discord-style embed preview rendering
- Enhanced `sendMessage()` to support allowed_mentions parameter
- Updated capabilities list to show only implemented features

## [1.0.0] - 2026-01-30

### Initial Release
- ✅ Basic webhook management (add, edit, delete)
- ✅ Send text messages with custom username and avatar
- ✅ Basic embed support (title, description, color, URL)
- ✅ Text-to-Speech (TTS) support
- ✅ Webhook status checker
- ✅ Spam messages feature
- ✅ 8 Material Design themes
- ✅ Dark mode by default
- ✅ Metadata viewer
- ✅ localStorage persistence
- ✅ Responsive design

---

## Legend
- ✨ New feature
- 🔧 Changed/Updated
- 🐛 Bug fix
- 🚀 Performance/UX improvement
- 📝 Documentation
- 🚧 Work in progress