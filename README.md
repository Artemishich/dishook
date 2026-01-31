# 🎯 Dishook

<div align="center">

![Dishook Logo](https://img.shields.io/badge/Dishook-Discord%20Webhook%20Manager-5865F2?style=for-the-badge&logo=discord&logoColor=white)

**A modern Discord webhook manager with Material Design 3 styling**

Manage, send, and organize your Discord webhooks with a beautiful, intuitive interface

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with Love](https://img.shields.io/badge/Made%20with-Love-red.svg)](https://github.com/Artemishich/dishook)

[Features](#features) • [Demo](#demo) • [Installation](#installation) • [Usage](#usage) • [API](#api) • [Contributing](#contributing)

</div>

---

## ✨ Features

### 🎨 Beautiful Material Design 3 Interface
- **Modern UI**: Smooth animations and transitions following Material You guidelines
- **Dark Mode by Default**: Comfortable dark theme that's easy on the eyes
- **Customizable Themes**: Choose from 8 accent colors (Blue, Red, Green, Purple, Orange, Teal, Pink, Indigo)
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Dark/Light Adaptation**: Automatic theme switching based on system preferences

### 📊 Webhook Dashboard
- **Grid View**: Display all your webhooks in an organized card layout
- **Quick Access**: Click any webhook card to view details and manage it
- **Avatar Preview**: Visual identification with webhook avatars
- **Token Security**: Partially masked tokens for security (only first/last 4 chars visible)
- **Empty State**: Friendly guidance when no webhooks are added

### 🔧 Webhook Management
- **Easy Addition**: Add webhooks via Discord webhook URL
- **Multiple URL Formats**: Supports both `discord.com` and `discordapp.com` domains
- **Automatic Validation**: URL format validation before adding
- **Duplicate Prevention**: Prevents adding the same webhook twice
- **Real-time Sync**: Fetches live webhook data from Discord API

### 📝 Webhook Detail Page
- **Full Information**: View complete webhook details including avatar, name, and metadata
- **Edit Capabilities**: Update webhook name and avatar directly through Discord API
- **Token Management**: Secure token display with one-click copy to clipboard
- **Message Sending**: Send messages through webhooks instantly
- **Raw Data Display**: View complete JSON metadata for debugging

### ⚠️ Danger Zone
- **Spam Messages**: Send multiple messages with configurable delay and repeat count
  - Custom message text
  - Adjustable delay (minimum 100ms)
  - Repeat count (1-100 messages)
  - Progress tracking
- **Delete Webhook**: Permanently remove webhook from Discord with confirmation dialog
- **Safety Confirmations**: All destructive actions require user confirmation

### 💾 Data Persistence
- **Local Storage**: All webhook data saved on device using localStorage
- **Persistent Theme**: Remember your selected accent color
- **No Backend Required**: Fully client-side application
- **Privacy First**: Your data never leaves your browser

### 🔐 Security Features
- **Token Masking**: Webhook tokens are never displayed in full
- **URL Validation**: Strict validation of Discord webhook URLs (supports both discord.com and discordapp.com)
- **HTTPS Only**: Enforces secure connections to Discord API
- **Error Handling**: Comprehensive error catching and user-friendly messages

---

## 🚀 Demo

### Screenshots

#### Dashboard View
![Dashboard](https://via.placeholder.com/800x450/1C1B1F/E0E0E0?text=Dashboard+View+-+Dark+Mode)
*Clean, organized webhook dashboard with Material Design cards in dark mode*

#### Webhook Detail
![Detail View](https://via.placeholder.com/800x450/1C1B1F/E0E0E0?text=Webhook+Detail+View+-+Dark+Mode)
*Comprehensive webhook management interface*

#### Theme Customization
![Themes](https://via.placeholder.com/800x450/1C1B1F/E0E0E0?text=Theme+Customization)
*Choose from 8 beautiful accent colors*

### Live Demo

🌐 **[Try Dishook Live](https://artemishich.github.io/dishook)** (Coming Soon)

---

## 📦 Installation

### Option 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/Artemishich/dishook.git

# Navigate to project directory
cd dishook

# Open in browser
# Simply open index.html in your web browser
# Or use a local server:
python -m http.server 8000
# Then visit http://localhost:8000
```

### Option 2: Download ZIP

1. Download the [latest release](https://github.com/Artemishich/dishook/archive/refs/heads/main.zip)
2. Extract the ZIP file
3. Open `index.html` in your web browser

### Option 3: Use CDN (Coming Soon)

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Artemishich/dishook@main/styles.css">
</head>
<body>
    <div id="dishook-app"></div>
    <script src="https://cdn.jsdelivr.net/gh/Artemishich/dishook@main/app.js"></script>
</body>
</html>
```

---

## 📖 Usage

### Adding Your First Webhook

1. **Get your Discord webhook URL**:
   - Go to your Discord server
   - Navigate to Server Settings → Integrations → Webhooks
   - Create a new webhook or copy existing one
   - Copy the webhook URL

2. **Supported URL Formats**:
   - `https://discord.com/api/webhooks/ID/TOKEN` ✅
   - `https://discordapp.com/api/webhooks/ID/TOKEN` ✅

3. **Add to Dishook**:
   - Click the **+** (Add) button in the top right
   - Paste your webhook URL
   - Click "Add"
   - Your webhook appears in the dashboard!

### Sending Messages

1. Click on any webhook card in the dashboard
2. Scroll to "Send Message" section
3. Type your message
4. Click "Send Message"
5. Message appears in your Discord channel!

### Editing Webhook

1. Open webhook detail view
2. In "Edit Webhook" section:
   - Update the webhook name
   - Change the avatar URL (must be a valid image URL)
3. Click "Save Changes"
4. Changes sync with Discord immediately

### Using Spam Feature (Use Responsibly! ⚠️)

1. Open webhook detail view
2. In "Danger Zone", click "Configure" on Spam Messages
3. Enter:
   - Message to send
   - Delay between messages (milliseconds)
   - Number of times to repeat (max 100)
4. Click "Start Spam"
5. Watch progress in notifications

### Deleting Webhooks

1. Open webhook detail view
2. In "Danger Zone", click "Delete"
3. Confirm deletion in dialog
4. Webhook is permanently removed from Discord

### Customizing Theme

1. Click the **palette icon** (🎨) in top right
2. Choose your favorite accent color
3. Theme applies instantly and is saved automatically

---

## 🛠️ Technical Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Material Design 3 implementation with CSS custom properties
- **JavaScript (ES6+)**: Modern vanilla JavaScript with async/await

### APIs
- **Discord Webhook API**: Direct integration for webhook management
- **LocalStorage API**: Client-side data persistence
- **Clipboard API**: One-click token copying

### Design System
- **Material Design 3 (Material You)**: Latest Google design guidelines
- **Google Material Icons**: Comprehensive icon set
- **Roboto Font**: Official Material Design typography
- **Dark Mode**: Default dark theme for comfortable viewing

### Browser Support
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

---

## 📁 Project Structure

```
dishook/
│
├── index.html          # Main HTML structure
├── styles.css          # Material Design 3 styles with theme system
├── app.js              # Core application logic and Discord API integration
├── README.md           # This file
├── LICENSE             # MIT License
└── .gitignore          # Git ignore rules
```

---

## 🔌 API Reference

### WebhookManager Class

Core class for managing webhooks.

#### Methods

##### `addWebhook(url: string): Promise<Object>`
Adds a new webhook by URL. Supports both `discord.com` and `discordapp.com` domains.

```javascript
// Both formats work!
const webhook1 = await manager.addWebhook('https://discord.com/api/webhooks/...');
const webhook2 = await manager.addWebhook('https://discordapp.com/api/webhooks/...');
```

##### `removeWebhook(id: string): void`
Removes a webhook from local storage.

```javascript
manager.removeWebhook('123456789');
```

##### `getWebhook(id: string): Object|null`
Retrieves webhook data by ID.

```javascript
const webhook = manager.getWebhook('123456789');
```

##### `updateWebhook(id: string, updates: Object): Promise<Object>`
Updates webhook on Discord.

```javascript
await manager.updateWebhook('123456789', { name: 'New Name' });
```

##### `sendMessage(id: string, content: string): Promise<void>`
Sends a message through webhook.

```javascript
await manager.sendMessage('123456789', 'Hello, Discord!');
```

##### `deleteWebhookFromDiscord(id: string): Promise<void>`
Deletes webhook from Discord.

```javascript
await manager.deleteWebhookFromDiscord('123456789');
```

---

## 🎨 Customization

### Changing Default Theme

Edit `styles.css` and modify the `:root` CSS variables:

```css
:root {
    --md-sys-color-primary: #YOUR_COLOR;
    --md-sys-color-primary-container: #YOUR_LIGHT_COLOR;
}
```

### Adding New Theme Colors

1. Add color option to `index.html`:
```html
<button class="color-option" data-color="cyan" style="background-color: #00BCD4;"></button>
```

2. Add theme variant to `styles.css`:
```css
[data-theme="cyan"] {
    --md-sys-color-primary: #00BCD4;
    --md-sys-color-primary-container: #B2EBF2;
    --md-sys-color-on-primary-container: #006064;
}
```

### Extending Functionality

The modular code structure makes it easy to add features:

```javascript
// Add custom webhook action
WebhookManager.prototype.customAction = async function(id, data) {
    const webhook = this.getWebhook(id);
    // Your custom logic here
};
```

---

## 🔒 Security Considerations

### What Dishook Does
- ✅ Stores webhook data locally (never sent to external servers)
- ✅ Masks webhook tokens in UI
- ✅ Validates URLs before processing (supports both discord.com and discordapp.com)
- ✅ Uses HTTPS for all Discord API calls

### What You Should Know
- ⚠️ Webhook tokens are stored in browser localStorage (unencrypted)
- ⚠️ Anyone with access to your browser can access stored webhooks
- ⚠️ Clear browser data will delete all saved webhooks
- ⚠️ Use spam feature responsibly (rate limits apply)

### Best Practices
- 🔐 Only use on trusted devices
- 🔐 Don't share webhook tokens
- 🔐 Regularly review and delete unused webhooks
- 🔐 Be cautious with spam feature to avoid Discord rate limits

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Bugs

1. Check if the bug is already reported in [Issues](https://github.com/Artemishich/dishook/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser and version

### Suggesting Features

1. Open a new issue with `[Feature Request]` prefix
2. Describe the feature and why it would be useful
3. Include mockups or examples if possible

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- Use ES6+ JavaScript features
- Follow existing code formatting
- Add comments for complex logic
- Keep functions focused and modular
- Use meaningful variable names

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### TL;DR
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ No liability
- ❌ No warranty

---

## 🙏 Acknowledgments

- **Discord**: For providing the webhook API
- **Google**: For Material Design 3 guidelines and icons
- **Material Design Community**: For design inspiration
- **Open Source Community**: For tools and libraries

---

## 📞 Support

### Documentation
- 📚 [Full Documentation](https://github.com/Artemishich/dishook/wiki) (Coming Soon)
- 💬 [Discord Community](https://discord.gg/dishook) (Coming Soon)
- 🐛 [Issue Tracker](https://github.com/Artemishich/dishook/issues)

### Contact
- GitHub: [@Artemishich](https://github.com/Artemishich)
- Email: support@dishook.dev (Coming Soon)

---

## 🗺️ Roadmap

### Version 1.1 (Coming Soon)
- [ ] Export/Import webhook configurations
- [ ] Webhook groups and folders
- [ ] Message templates
- [ ] Embed message builder
- [ ] Message scheduling
- [ ] Light mode toggle

### Version 1.2
- [ ] Multiple webhook selection
- [ ] Batch operations
- [ ] Webhook statistics
- [ ] Message history
- [ ] Search and filter

### Version 2.0
- [ ] Progressive Web App (PWA)
- [ ] Offline support
- [ ] Desktop app (Electron)
- [ ] Browser extension
- [ ] Cloud sync (optional)

---

## 💖 Support the Project

If you find Dishook useful, consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 🔀 Contributing code
- 📢 Sharing with others

---

<div align="center">

**Made with ❤️ by [Artemishich](https://github.com/Artemishich)**

[⬆ Back to Top](#-dishook)

</div>