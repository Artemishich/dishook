# MADE WITH AI ONLY!!!!!


# 🪝 Dishook - Discord Webhook Manager

A modern, Material Design 3 web application for managing Discord webhooks with advanced features.

## ✨ Features

### Core Functionality
- ✅ **Webhook Management** - Add, edit, refresh, and delete webhooks
- ✅ **Send Messages** - Custom username, avatar, and Text-to-Speech support
- ✅ **Multiple Embeds** - Send up to 10 embeds in a single message
- ✅ **Rich Embed Support**
  - Title, description, color, and URL
  - Author with name, URL, and icon
  - Up to 25 fields (inline and regular)
  - Main image and thumbnail
  - Footer with text and icon
  - Live preview as you type
- ✅ **Allowed Mentions** - Control who can be mentioned (@everyone, @users, @roles)
- ✅ **Webhook Status Checker** - Verify webhook status with metadata viewer
- ✅ **Spam Messages** - Send multiple messages with custom delay
- ✅ **Theme Customization** - 8 Material Design color themes
- ✅ **Dark Mode** - Built-in dark mode by default
- ✅ **Metadata Viewer** - View full webhook JSON data

### User Interface
- 🎨 Material Design 3 aesthetic
- 🌙 Dark mode by default with theme picker
- 📱 Fully responsive design
- ⚡ Smooth animations and transitions
- 🔍 Search button in header for quick status checks
- 👁️ Real-time embed preview

## 🚀 Getting Started

### Prerequisites
- A Discord server where you have webhook permissions
- A modern web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Artemishich/dishook.git
cd dishook
```

2. Open `index.html` in your web browser

That's it! No build process or dependencies required.

### Usage

1. **Add a Webhook**
   - Click the + button
   - Paste your Discord webhook URL
   - The webhook will be fetched and saved locally

2. **Send Messages**
   - Click on a webhook card
   - Fill in the message content
   - Optionally customize username and avatar
   - Configure allowed mentions
   - Click "Send Message"

3. **Create Embeds**
   - Navigate to the "Send Embed" section
   - Fill in embed fields (title, description, color, etc.)
   - Add author information, fields, images, and footer
   - Watch the live preview update
   - Click "Send Embed"

4. **Check Webhook Status**
   - Click the search icon in the header
   - Enter a webhook URL
   - View status, metadata, and creation date

## 📋 Webhook Capabilities

Dishook supports the following Discord webhook features:

| Feature | Description | Status |
|---------|-------------|--------|
| **Send Messages** | Send text messages with custom username and avatar | ✅ Supported |
| **Multiple Embeds** | Send up to 10 embeds in a single message | ✅ Supported |
| **Embed Fields** | Add inline and regular fields to embeds | ✅ Supported |
| **Embed Images** | Add images, thumbnails, author, and footer | ✅ Supported |
| **Text-to-Speech** | Send messages that will be read aloud | ✅ Supported |
| **Allowed Mentions** | Control which users/roles can be mentioned | ✅ Supported |

## 🎨 Themes

Dishook includes 8 beautiful Material Design themes:
- 🔵 Blue (Default)
- 🔴 Red
- 🟢 Green
- 🟣 Purple
- 🟠 Orange
- 🩵 Teal
- 🩷 Pink
- 🟦 Indigo

Change themes by clicking the palette icon in the header.

## 🔒 Privacy & Security

- **Local Storage Only** - All webhook data is stored in your browser's localStorage
- **No Server Communication** - Direct communication with Discord's API only
- **No Tracking** - No analytics or tracking of any kind
- **Open Source** - Fully transparent and auditable code

## 🛠️ Technology Stack

- **Pure HTML/CSS/JavaScript** - No frameworks or build tools
- **Material Design 3** - Modern design system
- **Discord API** - Direct webhook integration
- **localStorage** - Client-side data persistence

## 📝 API Reference

### Discord Webhook URL Format
```
https://discord.com/api/webhooks/{webhook_id}/{webhook_token}
```

### Supported Discord API Endpoints
- `GET /webhooks/{id}/{token}` - Fetch webhook info
- `POST /webhooks/{id}/{token}` - Send message
- `PATCH /webhooks/{id}/{token}` - Edit webhook
- `DELETE /webhooks/{id}/{token}` - Delete webhook

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Material Design 3](https://m3.material.io/) - Design system
- [Google Fonts](https://fonts.google.com/) - Roboto font
- [Material Icons](https://fonts.google.com/icons) - Icon set
- [Discord](https://discord.com/) - Webhook API

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on [GitHub](https://github.com/Artemishich/dishook/issues)
- Check existing issues for solutions

## 🗺️ Roadmap

Planned features for future releases:
- [ ] Webhook templates
- [ ] Message scheduling
- [ ] Bulk message operations
- [ ] Import/Export webhook collections
- [ ] File attachments support
- [ ] Message history

---

**Made with ❤️ by [Artemishich](https://github.com/Artemishich)**

**Star ⭐ this repository if you find it useful!**
