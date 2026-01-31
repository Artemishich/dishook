# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-01

### Added

#### Core Features
- ✨ Complete Discord webhook manager with Material Design 3 styling
- 🎨 8 customizable accent color themes (Blue, Red, Green, Purple, Orange, Teal, Pink, Indigo)
- 📊 Webhook dashboard with grid view layout
- 🔧 Add/remove webhooks via Discord webhook URLs
- 📝 Full webhook detail page with editing capabilities
- 📧 Send messages through webhooks
- ⚠️ Danger Zone with spam messages and webhook deletion
- 💾 LocalStorage-based data persistence
- 🔐 Token security with masking and clipboard copy
- 🌍 Responsive design for all screen sizes

#### UI/UX
- Smooth animations and transitions following Material Design guidelines
- Floating Action Button (FAB) for quick webhook addition
- Modal dialogs for user confirmations
- Snackbar notifications for user feedback
- Empty state with helpful guidance
- Material Icons integration
- Roboto font typography

#### Technical
- Modern ES6+ JavaScript with async/await
- Modular code architecture with WebhookManager class
- Discord Webhook API integration
- Comprehensive error handling
- URL validation using regex
- Clipboard API integration
- Theme persistence in localStorage

#### Documentation
- 📚 Comprehensive README with features, installation, and usage guide
- 🤝 CONTRIBUTING guide with code style guidelines
- 🔒 SECURITY policy with vulnerability reporting
- 📄 MIT License
- 🐛 GitHub issue templates for bugs and features
- 📝 CODE_OF_CONDUCT for community guidelines
- 📝 CHANGELOG for version tracking

### Security
- Implemented webhook token masking in UI
- Added strict URL validation
- HTTPS-only connections to Discord API
- LocalStorage data isolation
- Input sanitization and validation

### Developer Experience
- Clean, well-commented code
- JSDoc documentation for public methods
- Modular and extensible architecture
- .gitignore for common files
- No build process required (pure HTML/CSS/JS)

---

## [Unreleased]

### Planned for v1.1.0
- Export/Import webhook configurations
- Webhook groups and folders
- Message templates
- Embed message builder
- Message scheduling

### Planned for v1.2.0
- Multiple webhook selection
- Batch operations
- Webhook statistics
- Message history
- Search and filter functionality

### Planned for v2.0.0
- Progressive Web App (PWA) support
- Offline functionality
- Desktop app (Electron)
- Browser extension
- Optional cloud sync

---

## Version History

### How to Read This Changelog

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements

### Semantic Versioning

Given a version number MAJOR.MINOR.PATCH:
- **MAJOR**: Incompatible API changes
- **MINOR**: New functionality (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

---

[1.0.0]: https://github.com/Artemishich/dishook/releases/tag/v1.0.0
[Unreleased]: https://github.com/Artemishich/dishook/compare/v1.0.0...HEAD