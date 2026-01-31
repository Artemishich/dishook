# Dishook Usage Examples

This document provides practical examples of using Dishook for various scenarios.

## Table of Contents

- [Basic Setup](#basic-setup)
- [Common Use Cases](#common-use-cases)
- [Advanced Features](#advanced-features)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Basic Setup

### Getting Your First Webhook

1. **In Discord**:
   - Open your Discord server
   - Right-click on a channel → Edit Channel
   - Go to Integrations → Webhooks
   - Click "New Webhook"
   - Customize name and avatar (optional)
   - Click "Copy Webhook URL"

2. **In Dishook**:
   - Open Dishook in your browser
   - Click the **+** button
   - Paste webhook URL
   - Click "Add"
   - Done! Your webhook appears in the dashboard

### Sending Your First Message

```javascript
// What Dishook does behind the scenes:
const webhookUrl = 'https://discord.com/api/webhooks/YOUR_ID/YOUR_TOKEN';

await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        content: 'Hello from Dishook!'
    })
});
```

In Dishook UI:
1. Click on your webhook card
2. Scroll to "Send Message" section
3. Type: `Hello from Dishook!`
4. Click "Send Message"
5. Check your Discord channel!

## Common Use Cases

### 1. Server Announcements

**Scenario**: You manage a gaming community and need to post regular announcements.

**Setup**:
1. Create webhook in #announcements channel
2. Add to Dishook with descriptive name: "Community Announcements"
3. Save announcement templates as drafts (coming in v1.1)

**Usage**:
```
Message: 📢 Server Maintenance

Our servers will be down for maintenance on Saturday, 2PM-4PM EST.

Thank you for your patience!
```

### 2. Content Publishing

**Scenario**: You run a news website and want to post articles to Discord.

**Setup**:
1. Create webhook in #news channel
2. Add to Dishook: "News Feed"
3. Configure with your website's branding (avatar, name)

**Usage**:
```
Message: 📰 New Article Published!

**Title**: "10 Tips for Better Web Development"
**Author**: John Doe
**Link**: https://yoursite.com/article/10-tips

Check it out and let us know what you think!
```

### 3. Bot Notifications

**Scenario**: You're developing a bot and want to send notifications.

**Setup**:
1. Create webhook in #bot-notifications
2. Add to Dishook: "Bot Alerts"
3. Test messages before implementing in code

**Usage**:
```
Message: ⚠️ System Alert

Database backup completed successfully.
Time: 2026-02-01 03:00 AM
Size: 2.4 GB
Status: ✅ Success
```

### 4. Team Collaboration

**Scenario**: Your team needs quick updates in Discord.

**Setup**:
1. Create webhooks for different channels:
   - #team-updates
   - #bug-reports
   - #feature-requests
2. Add all to Dishook with clear names
3. Share Dishook setup with team

**Usage**:
```
Message (Team Updates): 📣 Sprint Update

**Completed**: 15 tasks
**In Progress**: 8 tasks
**Blocked**: 2 tasks

Great work team! Let's tackle those blockers tomorrow.
```

### 5. Personal Reminders

**Scenario**: You want personal reminders in your private Discord server.

**Setup**:
1. Create personal server in Discord
2. Create webhook in reminder channel
3. Add to Dishook: "Personal Reminders"

**Usage**:
```
Message: ⏰ Reminder

Don't forget:
• Doctor appointment at 2 PM
• Pick up groceries
• Call mom
```

## Advanced Features

### Webhook Editing

**Change Webhook Name**:
1. Open webhook detail
2. Edit Name field: `Production Bot` → `Prod Bot v2.0`
3. Click "Save Changes"
4. Name updates in Discord immediately

**Change Webhook Avatar**:
1. Upload avatar image to image host (imgur, discord CDN, etc.)
2. Copy direct image URL
3. Paste in Avatar URL field
4. Click "Save Changes"
5. Avatar updates across all messages

### Spam Messages (Responsible Use)

**Testing Bot Resilience**:
```
Scenario: Testing if your bot can handle rapid messages

Configuration:
- Message: "Test message #"
- Delay: 2000ms (2 seconds)
- Count: 10

Result: 10 messages sent over 20 seconds
```

**Event Countdown**:
```
Scenario: Build hype for an event

Configuration:
- Message: "🎉 Event starts in X minutes!"
- Delay: 60000ms (1 minute)
- Count: 5

Result: Countdown messages every minute
```

**⚠️ Warning**: 
- Respect Discord rate limits (5 requests per 2 seconds)
- Don't spam public channels
- Use responsibly or risk webhook deletion

### Token Management

**Copying Token Securely**:
1. Open webhook detail
2. Click copy icon next to masked token
3. Token copied to clipboard
4. Use in your application
5. **Never share token publicly**

**When to Regenerate Token**:
- Token accidentally exposed
- Suspicious webhook activity
- Regular security rotation

**How to Regenerate** (in Discord):
1. Go to Discord webhook settings
2. Delete old webhook
3. Create new webhook
4. Add new webhook to Dishook
5. Update applications using old token

### Raw Metadata Inspection

**What You'll See**:
```json
{
  "id": "123456789012345678",
  "type": 1,
  "name": "My Webhook",
  "avatar": "abcdef1234567890",
  "channel_id": "987654321098765432",
  "guild_id": "567890123456789012",
  "token": "long_secret_token_here"
}
```

**Use Cases**:
- Debugging webhook issues
- Verifying channel/guild IDs
- Checking webhook type
- Understanding Discord data structure

## Troubleshooting

### Common Issues

#### "Invalid webhook URL"

**Problem**: URL doesn't match Discord format

**Solution**:
```
❌ Wrong: discord.com/webhooks/123/abc
❌ Wrong: https://discord.gg/invite
✅ Correct: https://discord.com/api/webhooks/123456/abcdef
```

#### "Failed to fetch webhook data"

**Possible Causes**:
1. Webhook was deleted in Discord
2. Network connection issue
3. Discord API temporarily down

**Solutions**:
1. Verify webhook exists in Discord
2. Check internet connection
3. Try again in a few minutes

#### "Webhook already exists"

**Problem**: Trying to add duplicate webhook

**Solution**:
1. Check if webhook is already in dashboard
2. If you need fresh data, delete old one first
3. Add webhook again

#### "Failed to send message"

**Possible Causes**:
1. Empty message content
2. Message too long (>2000 characters)
3. Webhook deleted
4. Rate limited

**Solutions**:
1. Ensure message has content
2. Shorten message
3. Verify webhook in Discord
4. Wait before sending again

### Browser Issues

#### LocalStorage Not Working

**Symptoms**: Webhooks disappear after refresh

**Solutions**:
1. Check browser privacy settings
2. Ensure cookies/storage not disabled
3. Try different browser
4. Clear cache and reload

#### Clipboard Copy Fails

**Symptoms**: "Failed to copy token" error

**Solutions**:
1. Check clipboard permissions
2. Use HTTPS (required for clipboard API)
3. Manually select and copy token from metadata

## Best Practices

### Security

1. **Token Protection**:
   ```javascript
   // ✅ Good: Use environment variables in production
   const token = process.env.WEBHOOK_TOKEN;
   
   // ❌ Bad: Hardcode in public code
   const token = "12345_secret_token";
   ```

2. **Access Control**:
   - Only share webhooks with trusted team members
   - Use Discord role permissions to limit webhook creation
   - Regularly audit active webhooks

3. **Data Hygiene**:
   - Delete unused webhooks from Dishook
   - Clear browser data on shared computers
   - Don't store critical webhooks in Dishook

### Organization

1. **Naming Convention**:
   ```
   ✅ Good: "Production Alerts", "Dev Bot Notifications", "Team Updates"
   ❌ Bad: "Webhook", "Test", "Bot123"
   ```

2. **Channel Structure**:
   - One webhook per purpose
   - Separate dev/prod webhooks
   - Use channel categories in Discord

3. **Documentation**:
   - Note webhook purpose in Discord description
   - Document which applications use each webhook
   - Keep inventory of all webhooks

### Performance

1. **Rate Limits**:
   - Discord allows 5 requests per 2 seconds per webhook
   - Spread out messages if sending multiple
   - Use 2000ms+ delay for spam feature

2. **Message Size**:
   - Keep messages under 2000 characters
   - Split large content into multiple messages
   - Use embeds for structured data (requires API)

3. **Webhook Lifecycle**:
   - Delete webhooks you no longer use
   - Update webhook names to reflect purpose
   - Archive old project webhooks

## Integration Examples

### With GitHub Actions

```yaml
name: Discord Notification
on: [push]
jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Send Discord notification
        run: |
          curl -X POST ${{ secrets.DISCORD_WEBHOOK }} \
            -H "Content-Type: application/json" \
            -d '{"content": "New commit pushed!"}'
```

### With Python

```python
import requests

webhook_url = "YOUR_WEBHOOK_URL"
message = {"content": "Hello from Python!"}

response = requests.post(webhook_url, json=message)
print(f"Status: {response.status_code}")
```

### With Node.js

```javascript
const fetch = require('node-fetch');

const webhookUrl = 'YOUR_WEBHOOK_URL';
const message = { content: 'Hello from Node.js!' };

await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
});
```

## Tips & Tricks

### Quick Tips

1. **Keyboard Shortcuts** (coming soon):
   - `Ctrl/Cmd + K`: Quick add webhook
   - `Esc`: Close dialogs
   - `/`: Focus search (future feature)

2. **Theme Shortcuts**:
   - Blue: Professional, default
   - Red: Urgent, alerts
   - Green: Success, positive
   - Purple: Creative, unique

3. **Message Formatting** (Discord markdown):
   ```
   **Bold text**
   *Italic text*
   __Underline__
   ~~Strikethrough~~
   `Code`
   ```code block```
   ```

### Power User Features

1. **Browser DevTools**:
   - View localStorage: `Application > Local Storage`
   - Export data: `JSON.stringify(localStorage)`
   - Import data: `localStorage.setItem(...)`

2. **URL Parameters** (future feature):
   - `?webhook=ID`: Open specific webhook
   - `?theme=red`: Set theme
   - `?message=text`: Pre-fill message

3. **Backup Strategies**:
   ```javascript
   // Export webhooks
   const backup = localStorage.getItem('dishook_webhooks');
   console.log(backup);
   
   // Import webhooks
   localStorage.setItem('dishook_webhooks', backup);
   ```

---

## Need More Help?

- 📚 [Read the Full Documentation](../README.md)
- 🐛 [Report Issues](https://github.com/Artemishich/dishook/issues)
- 💬 [Join Discord Community](https://discord.gg/dishook) (coming soon)
- ❓ [Check FAQ](../README.md#support) (coming soon)

---

*Last updated: February 2026*