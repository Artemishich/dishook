/**
 * Dishook - Discord Webhook Manager
 * A modern web application for managing Discord webhooks with Material Design 3
 * 
 * @author Artemishich
 * @license MIT
 */

// ==================== STATE MANAGEMENT ====================

class WebhookManager {
    constructor() {
        this.webhooks = [];
        this.currentWebhook = null;
        this.loadWebhooks();
    }

    /**
     * Load webhooks from localStorage
     */
    loadWebhooks() {
        try {
            const stored = localStorage.getItem('dishook_webhooks');
            this.webhooks = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load webhooks:', error);
            this.webhooks = [];
        }
    }

    /**
     * Save webhooks to localStorage
     */
    saveWebhooks() {
        try {
            localStorage.setItem('dishook_webhooks', JSON.stringify(this.webhooks));
        } catch (error) {
            console.error('Failed to save webhooks:', error);
            showSnackbar('Failed to save webhooks');
        }
    }

    /**
     * Add a new webhook
     * @param {string} url - Discord webhook URL
     * @returns {Promise<Object>} Webhook data
     */
    async addWebhook(url) {
        // Validate URL
        if (!this.isValidWebhookUrl(url)) {
            throw new Error('Invalid webhook URL');
        }

        // Check for duplicates
        const existingWebhook = this.webhooks.find(w => w.url === url);
        if (existingWebhook) {
            throw new Error('Webhook already exists');
        }

        // Fetch webhook data from Discord
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch webhook data');
            }

            const data = await response.json();
            const webhook = {
                id: data.id,
                url: url,
                token: data.token,
                name: data.name || 'Unknown Webhook',
                avatar: data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png` : this.getDefaultAvatar(),
                channelId: data.channel_id,
                guildId: data.guild_id,
                metadata: data
            };

            this.webhooks.push(webhook);
            this.saveWebhooks();
            return webhook;
        } catch (error) {
            throw new Error('Failed to add webhook: ' + error.message);
        }
    }

    /**
     * Remove a webhook
     * @param {string} id - Webhook ID
     */
    removeWebhook(id) {
        this.webhooks = this.webhooks.filter(w => w.id !== id);
        this.saveWebhooks();
    }

    /**
     * Get webhook by ID
     * @param {string} id - Webhook ID
     * @returns {Object|null} Webhook data
     */
    getWebhook(id) {
        return this.webhooks.find(w => w.id === id) || null;
    }

    /**
     * Update webhook data
     * @param {string} id - Webhook ID
     * @param {Object} updates - Updated fields
     * @returns {Promise<Object>} Updated webhook
     */
    async updateWebhook(id, updates) {
        const webhook = this.getWebhook(id);
        if (!webhook) {
            throw new Error('Webhook not found');
        }

        try {
            const response = await fetch(webhook.url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });

            if (!response.ok) {
                throw new Error('Failed to update webhook on Discord');
            }

            const data = await response.json();
            
            // Update local data
            webhook.name = data.name || webhook.name;
            webhook.avatar = data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png` : webhook.avatar;
            webhook.metadata = data;
            
            this.saveWebhooks();
            return webhook;
        } catch (error) {
            throw new Error('Failed to update webhook: ' + error.message);
        }
    }

    /**
     * Send a message through webhook
     * @param {string} id - Webhook ID
     * @param {string} content - Message content
     * @returns {Promise<void>}
     */
    async sendMessage(id, content) {
        const webhook = this.getWebhook(id);
        if (!webhook) {
            throw new Error('Webhook not found');
        }

        if (!content || content.trim().length === 0) {
            throw new Error('Message content cannot be empty');
        }

        try {
            const response = await fetch(webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            throw new Error('Failed to send message: ' + error.message);
        }
    }

    /**
     * Delete webhook from Discord
     * @param {string} id - Webhook ID
     * @returns {Promise<void>}
     */
    async deleteWebhookFromDiscord(id) {
        const webhook = this.getWebhook(id);
        if (!webhook) {
            throw new Error('Webhook not found');
        }

        try {
            const response = await fetch(webhook.url, {
                method: 'DELETE'
            });

            if (!response.ok && response.status !== 404) {
                throw new Error('Failed to delete webhook from Discord');
            }

            this.removeWebhook(id);
        } catch (error) {
            throw new Error('Failed to delete webhook: ' + error.message);
        }
    }

    /**
     * Validate Discord webhook URL
     * Supports both discord.com and discordapp.com domains
     * @param {string} url - Webhook URL
     * @returns {boolean} Is valid
     */
    isValidWebhookUrl(url) {
        // Support both discord.com and discordapp.com
        const webhookRegex = /^https:\/\/(discord\.com|discordapp\.com)\/api\/webhooks\/\d+\/[\w-]+$/;
        return webhookRegex.test(url);
    }

    /**
     * Get default avatar URL
     * @returns {string} Default avatar URL
     */
    getDefaultAvatar() {
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666"%3E%3Cpath d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/%3E%3C/svg%3E';
    }
}

// Initialize manager
const manager = new WebhookManager();

// ==================== UI MANAGEMENT ====================

/**
 * Show snackbar notification
 * @param {string} message - Notification message
 */
function showSnackbar(message) {
    const snackbar = document.getElementById('snackbar');
    const messageElement = document.getElementById('snackbar-message');
    
    messageElement.textContent = message;
    snackbar.classList.add('show');
    
    setTimeout(() => {
        snackbar.classList.remove('show');
    }, 3000);
}

/**
 * Switch between views
 * @param {string} viewId - View ID to show
 */
function switchView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewId).classList.add('active');
}

/**
 * Render webhooks grid
 */
function renderWebhooks() {
    const grid = document.getElementById('webhooks-grid');
    const emptyState = document.getElementById('empty-state');
    
    if (manager.webhooks.length === 0) {
        grid.classList.add('hidden');
        emptyState.style.display = 'flex';
        return;
    }
    
    grid.classList.remove('hidden');
    emptyState.style.display = 'none';
    grid.innerHTML = '';
    
    manager.webhooks.forEach(webhook => {
        const card = createWebhookCard(webhook);
        grid.appendChild(card);
    });
}

/**
 * Create webhook card element
 * @param {Object} webhook - Webhook data
 * @returns {HTMLElement} Card element
 */
function createWebhookCard(webhook) {
    const card = document.createElement('div');
    card.className = 'webhook-card';
    card.onclick = () => showWebhookDetail(webhook.id);
    
    const avatar = document.createElement('img');
    avatar.className = 'webhook-avatar';
    avatar.src = webhook.avatar;
    avatar.alt = webhook.name;
    
    const info = document.createElement('div');
    info.className = 'webhook-card-info';
    
    const name = document.createElement('div');
    name.className = 'webhook-card-name';
    name.textContent = webhook.name;
    
    const token = document.createElement('div');
    token.className = 'webhook-card-token';
    token.textContent = maskToken(webhook.token);
    
    info.appendChild(name);
    info.appendChild(token);
    card.appendChild(avatar);
    card.appendChild(info);
    
    return card;
}

/**
 * Show webhook detail view
 * @param {string} id - Webhook ID
 */
function showWebhookDetail(id) {
    const webhook = manager.getWebhook(id);
    if (!webhook) {
        showSnackbar('Webhook not found');
        return;
    }
    
    manager.currentWebhook = webhook;
    
    // Update UI
    document.getElementById('detail-avatar').src = webhook.avatar;
    document.getElementById('detail-name').textContent = webhook.name;
    document.getElementById('detail-token').textContent = '•'.repeat(16);
    document.getElementById('edit-name').value = webhook.name;
    document.getElementById('edit-avatar').value = webhook.avatar !== manager.getDefaultAvatar() ? webhook.avatar : '';
    document.getElementById('message-content').value = '';
    document.getElementById('webhook-metadata').textContent = JSON.stringify(webhook.metadata, null, 2);
    
    switchView('detail-view');
}

/**
 * Mask webhook token
 * @param {string} token - Webhook token
 * @returns {string} Masked token
 */
function maskToken(token) {
    if (!token || token.length < 8) return '•'.repeat(16);
    return token.substring(0, 4) + '•'.repeat(8) + token.substring(token.length - 4);
}

/**
 * Show dialog
 * @param {string} dialogId - Dialog ID
 */
function showDialog(dialogId) {
    document.getElementById(dialogId).classList.add('active');
}

/**
 * Hide dialog
 * @param {string} dialogId - Dialog ID
 */
function hideDialog(dialogId) {
    document.getElementById(dialogId).classList.remove('active');
}

// ==================== EVENT HANDLERS ====================

// Add Webhook
document.getElementById('add-webhook-fab').addEventListener('click', () => {
    document.getElementById('webhook-url-input').value = '';
    showDialog('add-webhook-dialog');
});

document.getElementById('cancel-add-button').addEventListener('click', () => {
    hideDialog('add-webhook-dialog');
});

document.getElementById('confirm-add-button').addEventListener('click', async () => {
    const url = document.getElementById('webhook-url-input').value.trim();
    
    if (!url) {
        showSnackbar('Please enter a webhook URL');
        return;
    }
    
    try {
        await manager.addWebhook(url);
        hideDialog('add-webhook-dialog');
        renderWebhooks();
        showSnackbar('Webhook added successfully');
    } catch (error) {
        showSnackbar(error.message);
    }
});

// Navigation
document.getElementById('back-button').addEventListener('click', () => {
    switchView('dashboard-view');
    manager.currentWebhook = null;
});

// Copy Token
document.getElementById('copy-token-button').addEventListener('click', async () => {
    if (!manager.currentWebhook) return;
    
    try {
        await navigator.clipboard.writeText(manager.currentWebhook.token);
        showSnackbar('Token copied to clipboard');
    } catch (error) {
        showSnackbar('Failed to copy token');
    }
});

// Save Changes
document.getElementById('save-changes-button').addEventListener('click', async () => {
    if (!manager.currentWebhook) return;
    
    const name = document.getElementById('edit-name').value.trim();
    const avatar = document.getElementById('edit-avatar').value.trim();
    
    if (!name) {
        showSnackbar('Name cannot be empty');
        return;
    }
    
    try {
        const updates = { name };
        if (avatar) {
            updates.avatar = avatar;
        }
        
        await manager.updateWebhook(manager.currentWebhook.id, updates);
        showSnackbar('Webhook updated successfully');
        
        // Refresh detail view
        showWebhookDetail(manager.currentWebhook.id);
        renderWebhooks();
    } catch (error) {
        showSnackbar(error.message);
    }
});

// Send Message
document.getElementById('send-message-button').addEventListener('click', async () => {
    if (!manager.currentWebhook) return;
    
    const content = document.getElementById('message-content').value.trim();
    
    if (!content) {
        showSnackbar('Message cannot be empty');
        return;
    }
    
    try {
        await manager.sendMessage(manager.currentWebhook.id, content);
        document.getElementById('message-content').value = '';
        showSnackbar('Message sent successfully');
    } catch (error) {
        showSnackbar(error.message);
    }
});

// Spam Messages
document.getElementById('spam-button').addEventListener('click', () => {
    document.getElementById('spam-message').value = '';
    document.getElementById('spam-delay').value = '1000';
    document.getElementById('spam-count').value = '5';
    showDialog('spam-dialog');
});

document.getElementById('cancel-spam-button').addEventListener('click', () => {
    hideDialog('spam-dialog');
});

document.getElementById('confirm-spam-button').addEventListener('click', async () => {
    if (!manager.currentWebhook) return;
    
    const message = document.getElementById('spam-message').value.trim();
    const delay = parseInt(document.getElementById('spam-delay').value);
    const count = parseInt(document.getElementById('spam-count').value);
    
    if (!message) {
        showSnackbar('Message cannot be empty');
        return;
    }
    
    if (delay < 100) {
        showSnackbar('Delay must be at least 100ms');
        return;
    }
    
    if (count < 1 || count > 100) {
        showSnackbar('Count must be between 1 and 100');
        return;
    }
    
    hideDialog('spam-dialog');
    
    // Send messages with delay
    let sent = 0;
    for (let i = 0; i < count; i++) {
        try {
            await manager.sendMessage(manager.currentWebhook.id, message);
            sent++;
            showSnackbar(`Sent ${sent}/${count} messages`);
            
            if (i < count - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        } catch (error) {
            showSnackbar(`Failed after ${sent} messages: ${error.message}`);
            break;
        }
    }
    
    if (sent === count) {
        showSnackbar(`All ${count} messages sent successfully`);
    }
});

// Delete Webhook
document.getElementById('delete-webhook-button').addEventListener('click', () => {
    if (!manager.currentWebhook) return;
    
    document.getElementById('confirm-title').textContent = 'Delete Webhook';
    document.getElementById('confirm-message').textContent = 
        `Are you sure you want to delete "${manager.currentWebhook.name}"? This action cannot be undone and will delete the webhook from Discord.`;
    
    showDialog('confirm-dialog');
});

document.getElementById('cancel-confirm-button').addEventListener('click', () => {
    hideDialog('confirm-dialog');
});

document.getElementById('confirm-action-button').addEventListener('click', async () => {
    if (!manager.currentWebhook) return;
    
    const webhookId = manager.currentWebhook.id;
    
    try {
        await manager.deleteWebhookFromDiscord(webhookId);
        hideDialog('confirm-dialog');
        switchView('dashboard-view');
        renderWebhooks();
        showSnackbar('Webhook deleted successfully');
        manager.currentWebhook = null;
    } catch (error) {
        hideDialog('confirm-dialog');
        showSnackbar(error.message);
    }
});

// Theme Picker
document.getElementById('settings-button').addEventListener('click', () => {
    showDialog('theme-dialog');
});

document.getElementById('close-theme-button').addEventListener('click', () => {
    hideDialog('theme-dialog');
});

document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', () => {
        const color = option.dataset.color;
        document.documentElement.setAttribute('data-theme', color);
        localStorage.setItem('dishook_theme', color);
        
        // Update selected state
        document.querySelectorAll('.color-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');
        
        showSnackbar(`Theme changed to ${color}`);
    });
});

// Dialog overlay click to close
document.querySelectorAll('.dialog-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
        }
    });
});

// ==================== INITIALIZATION ====================

/**
 * Initialize application
 */
function init() {
    // Set dark mode by default if no theme is saved
    const savedTheme = localStorage.getItem('dishook_theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        const option = document.querySelector(`[data-color="${savedTheme}"]`);
        if (option) {
            option.classList.add('selected');
        }
    } else {
        // Default to dark theme
        document.documentElement.setAttribute('data-color-scheme', 'dark');
        document.querySelector('[data-color="blue"]')?.classList.add('selected');
    }
    
    // Render initial webhooks
    renderWebhooks();
    
    console.log('Dishook initialized successfully with dark mode');
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}