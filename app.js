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
        this.embedFields = [];
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
     * Refresh webhook data from Discord
     * @param {string} id - Webhook ID
     * @returns {Promise<Object>} Updated webhook data
     */
    async refreshWebhook(id) {
        const webhook = this.getWebhook(id);
        if (!webhook) {
            throw new Error('Webhook not found');
        }

        try {
            const response = await fetch(webhook.url);
            if (!response.ok) {
                throw new Error('Failed to fetch webhook data');
            }

            const data = await response.json();
            
            // Update local data
            webhook.name = data.name || 'Unknown Webhook';
            webhook.avatar = data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png` : this.getDefaultAvatar();
            webhook.token = data.token;
            webhook.channelId = data.channel_id;
            webhook.guildId = data.guild_id;
            webhook.metadata = data;
            
            this.saveWebhooks();
            return webhook;
        } catch (error) {
            throw new Error('Failed to refresh webhook: ' + error.message);
        }
    }

    /**
     * Check webhook status
     * @param {string} url - Discord webhook URL
     * @returns {Promise<Object>} Status data
     */
    async checkWebhookStatus(url) {
        if (!this.isValidWebhookUrl(url)) {
            throw new Error('Invalid webhook URL');
        }

        try {
            const response = await fetch(url);
            
            if (response.status === 404) {
                return {
                    exists: false,
                    name: 'Deleted Webhook',
                    avatar: this.getDeletedAvatar(),
                    date: 'Unknown',
                    metadata: null
                };
            }

            if (!response.ok) {
                throw new Error('Failed to fetch webhook');
            }

            const data = await response.json();
            
            return {
                exists: true,
                name: data.name || 'Unknown Webhook',
                avatar: data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png` : this.getDefaultAvatar(),
                date: this.formatSnowflakeDate(data.id),
                metadata: data
            };
        } catch (error) {
            throw new Error('Failed to check status: ' + error.message);
        }
    }

    /**
     * Format snowflake ID to date
     * @param {string} snowflake - Discord snowflake ID
     * @returns {string} Formatted date
     */
    formatSnowflakeDate(snowflake) {
        const timestamp = (BigInt(snowflake) >> 22n) + 1420070400000n;
        const date = new Date(Number(timestamp));
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Remove a webhook from panel only
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
     * @param {Object} payload - Message payload
     * @returns {Promise<void>}
     */
    async sendMessage(id, payload) {
        const webhook = this.getWebhook(id);
        if (!webhook) {
            throw new Error('Webhook not found');
        }

        if (!payload.content && !payload.embeds && !payload.files) {
            throw new Error('Message must have content, embeds, or files');
        }

        try {
            const response = await fetch(webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to send message');
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

    /**
     * Get deleted webhook avatar
     * @returns {string} Trash icon SVG
     */
    getDeletedAvatar() {
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23F44336"%3E%3Cpath d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/%3E%3C/svg%3E';
    }

    /**
     * Get webhook capabilities (only supported ones)
     * @returns {Array<Object>} List of capabilities
     */
    getWebhookCapabilities() {
        return [
            {
                name: 'Send Messages',
                description: 'Send text messages with custom username and avatar',
                icon: 'message',
                supported: true
            },
            {
                name: 'Multiple Embeds',
                description: 'Send up to 10 embeds in a single message',
                icon: 'view_carousel',
                supported: true
            },
            {
                name: 'Embed Fields',
                description: 'Add inline and regular fields to embeds',
                icon: 'view_module',
                supported: true
            },
            {
                name: 'Embed Images',
                description: 'Add images, thumbnails, author, and footer to embeds',
                icon: 'image',
                supported: true
            },
            {
                name: 'Text-to-Speech',
                description: 'Send messages that will be read aloud in voice channels',
                icon: 'record_voice_over',
                supported: true
            },
            {
                name: 'Allowed Mentions',
                description: 'Control which users/roles can be mentioned',
                icon: 'alternate_email',
                supported: true
            }
        ];
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
    
    const avatar = document.createElement('img');
    avatar.className = 'webhook-avatar';
    avatar.src = webhook.avatar;
    avatar.alt = webhook.name;
    
    const info = document.createElement('div');
    info.className = 'webhook-card-info';
    info.onclick = () => showWebhookDetail(webhook.id);
    
    const name = document.createElement('div');
    name.className = 'webhook-card-name';
    name.textContent = webhook.name;
    
    const token = document.createElement('div');
    token.className = 'webhook-card-token';
    token.textContent = maskToken(webhook.token);
    
    const refreshBtn = document.createElement('button');
    refreshBtn.className = 'icon-button';
    refreshBtn.title = 'Refresh';
    refreshBtn.innerHTML = '<span class="material-icons">refresh</span>';
    refreshBtn.onclick = async (e) => {
        e.stopPropagation();
        try {
            await manager.refreshWebhook(webhook.id);
            renderWebhooks();
            showSnackbar('Webhook refreshed');
        } catch (error) {
            showSnackbar(error.message);
        }
    };
    
    info.appendChild(name);
    info.appendChild(token);
    card.appendChild(avatar);
    card.appendChild(info);
    card.appendChild(refreshBtn);
    
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
    manager.embedFields = [];
    
    // Update UI
    document.getElementById('detail-avatar').src = webhook.avatar;
    document.getElementById('detail-name').textContent = webhook.name;
    document.getElementById('detail-token').textContent = maskToken(webhook.token);
    document.getElementById('edit-name').value = webhook.name;
    document.getElementById('message-username').value = '';
    document.getElementById('message-avatar').value = '';
    document.getElementById('message-content').value = '';
    document.getElementById('message-tts').checked = false;
    
    // Clear embed form
    clearEmbedForm();
    renderEmbedFieldsList();
    updateEmbedPreview();
    
    document.getElementById('webhook-metadata').textContent = JSON.stringify(webhook.metadata, null, 2);
    
    // Render capabilities
    renderCapabilities();
    
    switchView('detail-view');
}

/**
 * Clear embed form
 */
function clearEmbedForm() {
    document.getElementById('embed-title').value = '';
    document.getElementById('embed-description').value = '';
    document.getElementById('embed-color').value = '#2196F3';
    document.getElementById('embed-url').value = '';
    document.getElementById('embed-author-name').value = '';
    document.getElementById('embed-author-url').value = '';
    document.getElementById('embed-author-icon').value = '';
    document.getElementById('embed-footer-text').value = '';
    document.getElementById('embed-footer-icon').value = '';
    document.getElementById('embed-image-url').value = '';
    document.getElementById('embed-thumbnail-url').value = '';
    manager.embedFields = [];
}

/**
 * Render webhook capabilities
 */
function renderCapabilities() {
    const container = document.getElementById('capabilities-list');
    if (!container) return;
    
    container.innerHTML = '';
    const capabilities = manager.getWebhookCapabilities();
    
    capabilities.forEach(capability => {
        const item = document.createElement('div');
        item.className = 'capability-item';
        
        const icon = document.createElement('span');
        icon.className = 'material-icons capability-icon';
        icon.textContent = capability.icon;
        icon.style.color = 'var(--md-sys-color-primary)';
        
        const info = document.createElement('div');
        info.className = 'capability-info';
        
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.gap = '8px';
        
        const name = document.createElement('h4');
        name.textContent = capability.name;
        name.style.margin = '0';
        
        const badge = document.createElement('span');
        badge.className = 'status-badge status-active';
        badge.style.fontSize = '10px';
        badge.style.padding = '2px 8px';
        badge.textContent = 'Supported';
        
        header.appendChild(name);
        header.appendChild(badge);
        
        const description = document.createElement('p');
        description.textContent = capability.description;
        description.style.margin = '4px 0 0 0';
        description.style.fontSize = '14px';
        description.style.color = 'var(--md-sys-color-on-surface-variant)';
        
        info.appendChild(header);
        info.appendChild(description);
        
        item.appendChild(icon);
        item.appendChild(info);
        container.appendChild(item);
    });
}

/**
 * Mask webhook token
 * @param {string} token - Webhook token
 * @returns {string} Masked token
 */
function maskToken(token) {
    if (!token || token.length < 8) return '••••••••••••••••';
    return token.substring(0, 4) + '••••••••' + token.substring(token.length - 4);
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

/**
 * Render embed fields list
 */
function renderEmbedFieldsList() {
    const container = document.getElementById('embed-fields-list');
    if (!container) return;
    
    if (manager.embedFields.length === 0) {
        container.innerHTML = '<p style="color: var(--md-sys-color-on-surface-variant); font-size: 14px;">No fields added yet</p>';
        return;
    }
    
    container.innerHTML = '';
    manager.embedFields.forEach((field, index) => {
        const fieldItem = document.createElement('div');
        fieldItem.className = 'field-item';
        fieldItem.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 8px; background: var(--md-sys-color-surface-variant); border-radius: 8px; margin-bottom: 8px;';
        
        const fieldInfo = document.createElement('div');
        fieldInfo.style.flex = '1';
        
        const fieldName = document.createElement('div');
        fieldName.style.fontWeight = '500';
        fieldName.textContent = field.name;
        
        const fieldValue = document.createElement('div');
        fieldValue.style.fontSize = '12px';
        fieldValue.style.color = 'var(--md-sys-color-on-surface-variant)';
        fieldValue.textContent = field.value.substring(0, 50) + (field.value.length > 50 ? '...' : '');
        
        const fieldType = document.createElement('div');
        fieldType.style.fontSize = '10px';
        fieldType.style.color = 'var(--md-sys-color-outline)';
        fieldType.textContent = field.inline ? 'Inline' : 'Regular';
        
        fieldInfo.appendChild(fieldName);
        fieldInfo.appendChild(fieldValue);
        fieldInfo.appendChild(fieldType);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'icon-button';
        deleteBtn.innerHTML = '<span class="material-icons">delete</span>';
        deleteBtn.onclick = () => {
            manager.embedFields.splice(index, 1);
            renderEmbedFieldsList();
            updateEmbedPreview();
        };
        
        fieldItem.appendChild(fieldInfo);
        fieldItem.appendChild(deleteBtn);
        container.appendChild(fieldItem);
    });
}

/**
 * Update embed preview
 */
function updateEmbedPreview() {
    const preview = document.getElementById('embed-preview');
    if (!preview) return;
    
    const title = document.getElementById('embed-title').value.trim();
    const description = document.getElementById('embed-description').value.trim();
    const colorHex = document.getElementById('embed-color').value.trim();
    const url = document.getElementById('embed-url').value.trim();
    const authorName = document.getElementById('embed-author-name').value.trim();
    const authorUrl = document.getElementById('embed-author-url').value.trim();
    const authorIcon = document.getElementById('embed-author-icon').value.trim();
    const footerText = document.getElementById('embed-footer-text').value.trim();
    const footerIcon = document.getElementById('embed-footer-icon').value.trim();
    const imageUrl = document.getElementById('embed-image-url').value.trim();
    const thumbnailUrl = document.getElementById('embed-thumbnail-url').value.trim();
    
    if (!title && !description && manager.embedFields.length === 0) {
        preview.innerHTML = '<p style="color: var(--md-sys-color-on-surface-variant); text-align: center; padding: 32px;">Fill in some fields to see preview</p>';
        return;
    }
    
    preview.innerHTML = '';
    
    const embedDiv = document.createElement('div');
    embedDiv.style.cssText = `
        background: var(--md-sys-color-surface-variant);
        border-left: 4px solid ${colorHex || '#2196F3'};
        border-radius: 4px;
        padding: 16px;
        max-width: 520px;
    `;
    
    // Author
    if (authorName) {
        const authorDiv = document.createElement('div');
        authorDiv.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 8px;';
        
        if (authorIcon) {
            const authorImg = document.createElement('img');
            authorImg.src = authorIcon;
            authorImg.style.cssText = 'width: 24px; height: 24px; border-radius: 50%;';
            authorDiv.appendChild(authorImg);
        }
        
        const authorText = document.createElement('div');
        authorText.style.cssText = 'font-size: 14px; font-weight: 500;';
        if (authorUrl) {
            const authorLink = document.createElement('a');
            authorLink.href = authorUrl;
            authorLink.textContent = authorName;
            authorLink.style.color = 'var(--md-sys-color-primary)';
            authorLink.target = '_blank';
            authorText.appendChild(authorLink);
        } else {
            authorText.textContent = authorName;
        }
        authorDiv.appendChild(authorText);
        embedDiv.appendChild(authorDiv);
    }
    
    // Title
    if (title) {
        const titleDiv = document.createElement('div');
        titleDiv.style.cssText = 'font-size: 16px; font-weight: 600; margin-bottom: 8px; color: var(--md-sys-color-on-surface);';
        if (url) {
            const titleLink = document.createElement('a');
            titleLink.href = url;
            titleLink.textContent = title;
            titleLink.style.color = 'var(--md-sys-color-primary)';
            titleLink.target = '_blank';
            titleDiv.appendChild(titleLink);
        } else {
            titleDiv.textContent = title;
        }
        embedDiv.appendChild(titleDiv);
    }
    
    // Description
    if (description) {
        const descDiv = document.createElement('div');
        descDiv.style.cssText = 'font-size: 14px; margin-bottom: 8px; color: var(--md-sys-color-on-surface-variant); white-space: pre-wrap;';
        descDiv.textContent = description;
        embedDiv.appendChild(descDiv);
    }
    
    // Fields
    if (manager.embedFields.length > 0) {
        const fieldsDiv = document.createElement('div');
        fieldsDiv.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(0, 1fr)); gap: 8px; margin-top: 12px;';
        
        manager.embedFields.forEach(field => {
            const fieldDiv = document.createElement('div');
            fieldDiv.style.cssText = field.inline ? 'min-width: 0;' : 'grid-column: 1 / -1;';
            
            const fieldName = document.createElement('div');
            fieldName.style.cssText = 'font-size: 14px; font-weight: 600; margin-bottom: 4px; color: var(--md-sys-color-on-surface);';
            fieldName.textContent = field.name;
            
            const fieldValue = document.createElement('div');
            fieldValue.style.cssText = 'font-size: 14px; color: var(--md-sys-color-on-surface-variant); white-space: pre-wrap;';
            fieldValue.textContent = field.value;
            
            fieldDiv.appendChild(fieldName);
            fieldDiv.appendChild(fieldValue);
            fieldsDiv.appendChild(fieldDiv);
        });
        
        embedDiv.appendChild(fieldsDiv);
    }
    
    // Image
    if (imageUrl) {
        const imgDiv = document.createElement('img');
        imgDiv.src = imageUrl;
        imgDiv.style.cssText = 'max-width: 100%; border-radius: 4px; margin-top: 12px;';
        embedDiv.appendChild(imgDiv);
    }
    
    // Thumbnail (position absolute in real Discord)
    if (thumbnailUrl && !imageUrl) {
        const thumbDiv = document.createElement('img');
        thumbDiv.src = thumbnailUrl;
        thumbDiv.style.cssText = 'max-width: 80px; max-height: 80px; border-radius: 4px; float: right; margin-left: 16px;';
        embedDiv.insertBefore(thumbDiv, embedDiv.firstChild);
    }
    
    // Footer
    if (footerText) {
        const footerDiv = document.createElement('div');
        footerDiv.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-top: 12px; font-size: 12px; color: var(--md-sys-color-on-surface-variant);';
        
        if (footerIcon) {
            const footerImg = document.createElement('img');
            footerImg.src = footerIcon;
            footerImg.style.cssText = 'width: 20px; height: 20px; border-radius: 50%;';
            footerDiv.appendChild(footerImg);
        }
        
        const footerText_div = document.createElement('div');
        footerText_div.textContent = footerText;
        footerDiv.appendChild(footerText_div);
        
        embedDiv.appendChild(footerDiv);
    }
    
    preview.appendChild(embedDiv);
}

// ==================== EVENT HANDLERS ====================

// Search button (opens status checker modal)
document.getElementById('search-button').addEventListener('click', () => {
    document.getElementById('webhook-status-input').value = '';
    document.getElementById('status-result').classList.add('hidden');
    showDialog('status-checker-dialog');
});

// Webhook Status Checker
document.getElementById('check-status-button').addEventListener('click', async () => {
    const url = document.getElementById('webhook-status-input').value.trim();
    const resultContainer = document.getElementById('status-result');
    
    if (!url) {
        showSnackbar('Please enter a webhook URL');
        return;
    }
    
    try {
        const status = await manager.checkWebhookStatus(url);
        
        document.getElementById('status-avatar').src = status.avatar;
        document.getElementById('status-name').textContent = status.name;
        document.getElementById('status-date').textContent = `Created: ${status.date}`;
        
        const badge = document.getElementById('status-badge');
        if (status.exists) {
            badge.textContent = 'Active';
            badge.className = 'status-badge status-active';
            
            // Show metadata
            if (status.metadata) {
                document.getElementById('status-metadata').textContent = JSON.stringify(status.metadata, null, 2);
            }
        } else {
            badge.textContent = 'Deleted';
            badge.className = 'status-badge status-deleted';
            document.getElementById('status-metadata').textContent = 'Webhook not found';
        }
        
        resultContainer.classList.remove('hidden');
    } catch (error) {
        showSnackbar(error.message);
        resultContainer.classList.add('hidden');
    }
});

// Refresh status
document.getElementById('refresh-status-button').addEventListener('click', async () => {
    const url = document.getElementById('webhook-status-input').value.trim();
    if (url) {
        document.getElementById('check-status-button').click();
    }
});

document.getElementById('close-status-checker-button').addEventListener('click', () => {
    hideDialog('status-checker-dialog');
});

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

// Refresh webhook
document.getElementById('refresh-webhook-button').addEventListener('click', async () => {
    if (!manager.currentWebhook) return;
    
    try {
        await manager.refreshWebhook(manager.currentWebhook.id);
        showWebhookDetail(manager.currentWebhook.id);
        renderWebhooks();
        showSnackbar('Webhook refreshed from Discord');
    } catch (error) {
        showSnackbar(error.message);
    }
});

// Refresh metadata
document.getElementById('refresh-metadata-button').addEventListener('click', async () => {
    if (!manager.currentWebhook) return;
    
    try {
        await manager.refreshWebhook(manager.currentWebhook.id);
        document.getElementById('webhook-metadata').textContent = JSON.stringify(manager.currentWebhook.metadata, null, 2);
        showSnackbar('Metadata refreshed');
    } catch (error) {
        showSnackbar(error.message);
    }
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
    
    if (!name) {
        showSnackbar('Name cannot be empty');
        return;
    }
    
    try {
        await manager.updateWebhook(manager.currentWebhook.id, { name });
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
    const username = document.getElementById('message-username').value.trim();
    const avatarUrl = document.getElementById('message-avatar').value.trim();
    const tts = document.getElementById('message-tts').checked;
    
    if (!content) {
        showSnackbar('Message cannot be empty');
        return;
    }
    
    const payload = { content, tts };
    if (username) payload.username = username;
    if (avatarUrl) payload.avatar_url = avatarUrl;
    
    // Allowed Mentions
    const mentionEveryone = document.getElementById('mention-everyone').checked;
    const mentionUsers = document.getElementById('mention-users').checked;
    const mentionRoles = document.getElementById('mention-roles').checked;
    
    if (!mentionEveryone || !mentionUsers || !mentionRoles) {
        payload.allowed_mentions = {
            parse: []
        };
        if (mentionEveryone) payload.allowed_mentions.parse.push('everyone');
        if (mentionUsers) payload.allowed_mentions.parse.push('users');
        if (mentionRoles) payload.allowed_mentions.parse.push('roles');
    }
    
    try {
        await manager.sendMessage(manager.currentWebhook.id, payload);
        document.getElementById('message-content').value = '';
        showSnackbar('Message sent successfully');
    } catch (error) {
        showSnackbar(error.message);
    }
});

// Embed form change listeners
['embed-title', 'embed-description', 'embed-color', 'embed-url', 
 'embed-author-name', 'embed-author-url', 'embed-author-icon',
 'embed-footer-text', 'embed-footer-icon', 'embed-image-url', 'embed-thumbnail-url'
].forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('input', updateEmbedPreview);
    }
});

// Add embed field
document.getElementById('add-field-button').addEventListener('click', () => {
    const name = document.getElementById('field-name').value.trim();
    const value = document.getElementById('field-value').value.trim();
    const inline = document.getElementById('field-inline').checked;
    
    if (!name || !value) {
        showSnackbar('Field name and value are required');
        return;
    }
    
    manager.embedFields.push({ name, value, inline });
    document.getElementById('field-name').value = '';
    document.getElementById('field-value').value = '';
    document.getElementById('field-inline').checked = false;
    
    renderEmbedFieldsList();
    updateEmbedPreview();
});

// Send Embed
document.getElementById('send-embed-button').addEventListener('click', async () => {
    if (!manager.currentWebhook) return;
    
    const title = document.getElementById('embed-title').value.trim();
    const description = document.getElementById('embed-description').value.trim();
    const colorHex = document.getElementById('embed-color').value.trim();
    const url = document.getElementById('embed-url').value.trim();
    const authorName = document.getElementById('embed-author-name').value.trim();
    const authorUrl = document.getElementById('embed-author-url').value.trim();
    const authorIcon = document.getElementById('embed-author-icon').value.trim();
    const footerText = document.getElementById('embed-footer-text').value.trim();
    const footerIcon = document.getElementById('embed-footer-icon').value.trim();
    const imageUrl = document.getElementById('embed-image-url').value.trim();
    const thumbnailUrl = document.getElementById('embed-thumbnail-url').value.trim();
    
    if (!title && !description && manager.embedFields.length === 0) {
        showSnackbar('Embed must have title, description, or fields');
        return;
    }
    
    const embed = {};
    if (title) embed.title = title;
    if (description) embed.description = description;
    if (url) embed.url = url;
    
    // Convert hex to decimal
    if (colorHex) {
        const color = parseInt(colorHex.replace('#', ''), 16);
        embed.color = color;
    }
    
    // Author
    if (authorName) {
        embed.author = { name: authorName };
        if (authorUrl) embed.author.url = authorUrl;
        if (authorIcon) embed.author.icon_url = authorIcon;
    }
    
    // Footer
    if (footerText) {
        embed.footer = { text: footerText };
        if (footerIcon) embed.footer.icon_url = footerIcon;
    }
    
    // Images
    if (imageUrl) embed.image = { url: imageUrl };
    if (thumbnailUrl) embed.thumbnail = { url: thumbnailUrl };
    
    // Fields
    if (manager.embedFields.length > 0) {
        embed.fields = manager.embedFields;
    }
    
    const payload = { embeds: [embed] };
    
    try {
        await manager.sendMessage(manager.currentWebhook.id, payload);
        clearEmbedForm();
        renderEmbedFieldsList();
        updateEmbedPreview();
        showSnackbar('Embed sent successfully');
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
            await manager.sendMessage(manager.currentWebhook.id, { content: message });
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

// Remove from Panel
document.getElementById('remove-webhook-button').addEventListener('click', () => {
    if (!manager.currentWebhook) return;
    
    document.getElementById('confirm-title').textContent = 'Remove from Panel';
    document.getElementById('confirm-message').textContent = 
        `Remove "${manager.currentWebhook.name}" from this panel? The webhook will still exist on Discord.`;
    
    showDialog('confirm-dialog');
    
    // Set action for remove
    document.getElementById('confirm-action-button').onclick = async () => {
        if (!manager.currentWebhook) return;
        const webhookId = manager.currentWebhook.id;
        
        manager.removeWebhook(webhookId);
        hideDialog('confirm-dialog');
        switchView('dashboard-view');
        renderWebhooks();
        showSnackbar('Webhook removed from panel');
        manager.currentWebhook = null;
    };
});

// Delete Webhook from Discord
document.getElementById('delete-webhook-button').addEventListener('click', () => {
    if (!manager.currentWebhook) return;
    
    document.getElementById('confirm-title').textContent = 'Delete from Discord';
    document.getElementById('confirm-message').textContent = 
        `Permanently delete "${manager.currentWebhook.name}" from Discord? This action cannot be undone!`;
    
    showDialog('confirm-dialog');
    
    // Set action for delete
    document.getElementById('confirm-action-button').onclick = async () => {
        if (!manager.currentWebhook) return;
        const webhookId = manager.currentWebhook.id;
        
        try {
            await manager.deleteWebhookFromDiscord(webhookId);
            hideDialog('confirm-dialog');
            switchView('dashboard-view');
            renderWebhooks();
            showSnackbar('Webhook deleted from Discord');
            manager.currentWebhook = null;
        } catch (error) {
            hideDialog('confirm-dialog');
            showSnackbar(error.message);
        }
    };
});

document.getElementById('cancel-confirm-button').addEventListener('click', () => {
    hideDialog('confirm-dialog');
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
    // Set dark mode by default
    const savedTheme = localStorage.getItem('dishook_theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        const option = document.querySelector(`[data-color="${savedTheme}"]`);
        if (option) {
            option.classList.add('selected');
        }
    } else {
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