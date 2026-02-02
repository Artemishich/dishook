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
        this.attachmentFiles = [];
        this.MAX_ATTACHMENTS = 10;
        this.loadWebhooks();
    }

    loadWebhooks() {
        try {
            const stored = localStorage.getItem('dishook_webhooks');
            this.webhooks = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load webhooks:', error);
            this.webhooks = [];
        }
    }

    saveWebhooks() {
        try {
            localStorage.setItem('dishook_webhooks', JSON.stringify(this.webhooks));
        } catch (error) {
            console.error('Failed to save webhooks:', error);
            showSnackbar('Failed to save webhooks');
        }
    }

    loadMessageHistory(id) {
        try {
            const key = `dishook_history_${id}`;
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Failed to load message history:', error);
            return [];
        }
    }

    saveMessageHistory(id, history) {
        try {
            const key = `dishook_history_${id}`;
            localStorage.setItem(key, JSON.stringify(history));
        } catch (error) {
            console.error('Failed to save message history:', error);
        }
    }

    addMessageToHistory(webhookId, messageId, content) {
        const history = this.loadMessageHistory(webhookId);
        history.unshift({
            id: messageId,
            content: content,
            timestamp: Date.now()
        });
        
        if (history.length > 50) {
            history.splice(50);
        }
        
        this.saveMessageHistory(webhookId, history);
    }

    clearMessageHistory(id) {
        try {
            const key = `dishook_history_${id}`;
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Failed to clear message history:', error);
        }
    }

    parseMentions(content) {
        if (!content) return null;

        const mentions = {
            parse: [],
            users: [],
            roles: []
        };

        if (content.includes('@everyone')) {
            mentions.parse.push('everyone');
        }

        if (content.includes('@here')) {
            mentions.parse.push('everyone');
        }

        const userMentions = content.match(/<@!?(\d+)>/g);
        if (userMentions) {
            mentions.parse.push('users');
            userMentions.forEach(mention => {
                const id = mention.match(/\d+/)[0];
                if (!mentions.users.includes(id)) {
                    mentions.users.push(id);
                }
            });
        }

        const roleMentions = content.match(/<@&(\d+)>/g);
        if (roleMentions) {
            mentions.parse.push('roles');
            roleMentions.forEach(mention => {
                const id = mention.match(/\d+/)[0];
                if (!mentions.roles.includes(id)) {
                    mentions.roles.push(id);
                }
            });
        }

        if (mentions.parse.length === 0 && mentions.users.length === 0 && mentions.roles.length === 0) {
            return null;
        }

        if (mentions.users.length === 0) delete mentions.users;
        if (mentions.roles.length === 0) delete mentions.roles;
        if (mentions.parse.length === 0) delete mentions.parse;

        return mentions;
    }

    async addWebhook(url) {
        if (!this.isValidWebhookUrl(url)) {
            throw new Error('Invalid webhook URL');
        }

        const existingWebhook = this.webhooks.find(w => w.url === url);
        if (existingWebhook) {
            throw new Error('Webhook already exists');
        }

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

    async checkWebhookStatus(url) {
        if (!this.isValidWebhookUrl(url)) {
            throw new Error('Invalid webhook URL');
        }

        try {
            const response = await fetch(url);
            
            if (response.status === 404) {
                return {
                    exists: false,
                    url: url,
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
                url: url,
                name: data.name || 'Unknown Webhook',
                avatar: data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png` : this.getDefaultAvatar(),
                date: this.formatSnowflakeDate(data.id),
                metadata: data
            };
        } catch (error) {
            throw new Error('Failed to check status: ' + error.message);
        }
    }

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

    removeWebhook(id) {
        this.webhooks = this.webhooks.filter(w => w.id !== id);
        this.clearMessageHistory(id);
        this.saveWebhooks();
    }

    getWebhook(id) {
        return this.webhooks.find(w => w.id === id) || null;
    }

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
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update webhook on Discord');
            }

            const data = await response.json();
            
            webhook.name = data.name || webhook.name;
            webhook.avatar = data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png` : webhook.avatar;
            webhook.metadata = data;
            
            this.saveWebhooks();
            return webhook;
        } catch (error) {
            throw new Error('Failed to update webhook: ' + error.message);
        }
    }

    async sendMessage(id, payload, files = []) {
        const webhook = this.getWebhook(id);
        if (!webhook) {
            throw new Error('Webhook not found');
        }

        if (!payload.content && !payload.embeds && files.length === 0) {
            throw new Error('Message must have content, embeds, or files');
        }

        if (payload.content) {
            const mentions = this.parseMentions(payload.content);
            if (mentions) {
                payload.allowed_mentions = mentions;
            }
        }

        try {
            let response;
            
            if (files.length > 0) {
                const formData = new FormData();
                formData.append('payload_json', JSON.stringify(payload));
                
                files.forEach((file, index) => {
                    formData.append(`files[${index}]`, file);
                });
                
                response = await fetch(webhook.url + '?wait=true', {
                    method: 'POST',
                    body: formData
                });
            } else {
                response = await fetch(webhook.url + '?wait=true', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
            }

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to send message');
            }

            const messageData = await response.json();
            
            const preview = payload.content || (payload.embeds && payload.embeds[0] ? 
                (payload.embeds[0].title || payload.embeds[0].description || 'Embed message') : 
                'Message with attachments');
            
            this.addMessageToHistory(id, messageData.id, preview.substring(0, 100));
            
            return messageData.id;
        } catch (error) {
            throw new Error('Failed to send message: ' + error.message);
        }
    }

    async deleteMessage(webhookId, messageId) {
        const webhook = this.getWebhook(webhookId);
        if (!webhook) {
            throw new Error('Webhook not found');
        }

        try {
            const response = await fetch(`${webhook.url}/messages/${messageId}`, {
                method: 'DELETE'
            });

            if (!response.ok && response.status !== 404) {
                throw new Error('Failed to delete message');
            }

            const history = this.loadMessageHistory(webhookId);
            const filtered = history.filter(msg => msg.id !== messageId);
            this.saveMessageHistory(webhookId, filtered);
        } catch (error) {
            throw new Error('Failed to delete message: ' + error.message);
        }
    }

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

    async deleteWebhookByUrl(url) {
        try {
            const response = await fetch(url, {
                method: 'DELETE'
            });

            if (!response.ok && response.status !== 404) {
                throw new Error('Failed to delete webhook from Discord');
            }
        } catch (error) {
            throw new Error('Failed to delete webhook: ' + error.message);
        }
    }

    isValidWebhookUrl(url) {
        const webhookRegex = /^https:\/\/(discord\.com|discordapp\.com)\/api\/webhooks\/\d+\/[\w-]+$/;
        return webhookRegex.test(url);
    }

    getDefaultAvatar() {
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666"%3E%3Cpath d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/%3E%3C/svg%3E';
    }

    getDeletedAvatar() {
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23F44336"%3E%3Cpath d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/%3E%3C/svg%3E';
    }
}

const manager = new WebhookManager();

// ==================== UI MANAGEMENT ====================

function showSnackbar(message) {
    const snackbar = document.getElementById('snackbar');
    const messageElement = document.getElementById('snackbar-message');
    
    messageElement.textContent = message;
    snackbar.classList.add('show');
    
    setTimeout(() => {
        snackbar.classList.remove('show');
    }, 3000);
}

function switchView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewId).classList.add('active');
}

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
    
    const actions = document.createElement('div');
    actions.style.cssText = 'display: flex; gap: 4px;';
    
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
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'icon-button';
    removeBtn.title = 'Remove from Panel';
    removeBtn.innerHTML = '<span class="material-icons">remove_circle</span>';
    removeBtn.onclick = async (e) => {
        e.stopPropagation();
        if (confirm(`Remove "${webhook.name}" from panel? (Webhook stays on Discord)`)) {
            manager.removeWebhook(webhook.id);
            renderWebhooks();
            showSnackbar('Webhook removed from panel');
        }
    };
    
    actions.appendChild(refreshBtn);
    actions.appendChild(removeBtn);
    
    info.appendChild(name);
    info.appendChild(token);
    card.appendChild(avatar);
    card.appendChild(info);
    card.appendChild(actions);
    
    return card;
}

function renderMessageHistory() {
    if (!manager.currentWebhook) return;
    
    const container = document.getElementById('message-history-container');
    const history = manager.loadMessageHistory(manager.currentWebhook.id);
    
    if (history.length === 0) {
        container.innerHTML = '<p style="color: var(--md-sys-color-on-surface-variant); text-align: center; padding: 16px;">No messages sent yet</p>';
        return;
    }
    
    container.innerHTML = '';
    
    history.forEach(msg => {
        const item = document.createElement('div');
        item.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--md-sys-color-surface-variant); border-radius: 8px; margin-bottom: 8px;';
        
        const content = document.createElement('div');
        content.style.flex = '1';
        content.style.marginRight = '12px';
        
        const text = document.createElement('div');
        text.style.cssText = 'font-size: 14px; margin-bottom: 4px; word-break: break-word;';
        text.textContent = msg.content.substring(0, 100) + (msg.content.length > 100 ? '...' : '');
        
        const meta = document.createElement('div');
        meta.style.cssText = 'font-size: 12px; color: var(--md-sys-color-on-surface-variant);';
        const date = new Date(msg.timestamp);
        meta.textContent = `ID: ${msg.id} • ${date.toLocaleString()}`;
        
        content.appendChild(text);
        content.appendChild(meta);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'icon-button';
        deleteBtn.title = 'Delete Message';
        deleteBtn.innerHTML = '<span class="material-icons">delete</span>';
        deleteBtn.onclick = async () => {
            if (confirm('Delete this message from Discord?')) {
                try {
                    await manager.deleteMessage(manager.currentWebhook.id, msg.id);
                    renderMessageHistory();
                    showSnackbar('Message deleted');
                } catch (error) {
                    showSnackbar(error.message);
                }
            }
        };
        
        item.appendChild(content);
        item.appendChild(deleteBtn);
        container.appendChild(item);
    });
}

function showWebhookDetail(id) {
    const webhook = manager.getWebhook(id);
    if (!webhook) {
        showSnackbar('Webhook not found');
        return;
    }
    
    manager.currentWebhook = webhook;
    manager.embedFields = [];
    manager.attachmentFiles = [];
    
    document.getElementById('detail-avatar').src = webhook.avatar;
    document.getElementById('detail-name').textContent = webhook.name;
    document.getElementById('detail-token').textContent = maskToken(webhook.token);
    document.getElementById('edit-name').value = webhook.name;
    document.getElementById('edit-avatar-url').value = '';
    document.getElementById('message-username').value = '';
    document.getElementById('message-avatar-url').value = '';
    document.getElementById('message-content').value = '';
    document.getElementById('message-tts').checked = false;
    document.getElementById('message-attachments').value = '';
    document.getElementById('attachments-preview').innerHTML = '';
    updateAttachmentButtonState();
    
    clearEmbedForm();
    renderEmbedFieldsList();
    updateEmbedPreview();
    renderMessageHistory();
    
    document.getElementById('webhook-metadata').textContent = JSON.stringify(webhook.metadata, null, 2);
    
    switchView('detail-view');
}

function clearEmbedForm() {
    document.getElementById('embed-title').value = '';
    document.getElementById('embed-description').value = '';
    document.getElementById('embed-color').value = '#2196F3';
    document.getElementById('embed-url').value = '';
    document.getElementById('embed-author-name').value = '';
    document.getElementById('embed-author-url').value = '';
    document.getElementById('embed-author-icon-url').value = '';
    document.getElementById('embed-footer-text').value = '';
    document.getElementById('embed-footer-icon-url').value = '';
    document.getElementById('embed-image-url').value = '';
    document.getElementById('embed-thumbnail-url').value = '';
    document.getElementById('embed-username').value = '';
    document.getElementById('embed-avatar-url').value = '';
    
    manager.embedFields = [];
    
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.classList.remove('selected');
        if (swatch.dataset.color === '#2196F3') {
            swatch.classList.add('selected');
        }
    });
}

function maskToken(token) {
    if (!token || token.length < 8) return '••••••••••••••••';
    return token.substring(0, 4) + '••••••••' + token.substring(token.length - 4);
}

function showDialog(dialogId) {
    document.getElementById(dialogId).classList.add('active');
}

function hideDialog(dialogId) {
    document.getElementById(dialogId).classList.remove('active');
}

function renderEmbedFieldsList() {
    const container = document.getElementById('embed-fields-list');
    if (!container) return;
    
    if (manager.embedFields.length === 0) {
        container.innerHTML = '<p style="color: var(--md-sys-color-on-surface-variant); font-size: 14px; text-align: center; padding: 16px;">No fields added yet</p>';
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

function updateAttachmentButtonState() {
    const addBtn = document.getElementById('btn-add-attachments');
    if (!addBtn) return;
    
    if (manager.attachmentFiles.length >= manager.MAX_ATTACHMENTS) {
        addBtn.disabled = true;
        addBtn.title = `Maximum ${manager.MAX_ATTACHMENTS} attachments reached`;
    } else {
        addBtn.disabled = false;
        addBtn.title = 'Add Images';
    }
}

async function updateEmbedPreview() {
    const preview = document.getElementById('embed-preview');
    if (!preview) return;
    
    const title = document.getElementById('embed-title').value.trim();
    const description = document.getElementById('embed-description').value.trim();
    const colorHex = document.getElementById('embed-color').value.trim();
    const url = document.getElementById('embed-url').value.trim();
    const authorName = document.getElementById('embed-author-name').value.trim();
    const authorUrl = document.getElementById('embed-author-url').value.trim();
    const authorIcon = document.getElementById('embed-author-icon-url').value.trim();
    const footerText = document.getElementById('embed-footer-text').value.trim();
    const footerIcon = document.getElementById('embed-footer-icon-url').value.trim();
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
    
    if (description) {
        const descDiv = document.createElement('div');
        descDiv.style.cssText = 'font-size: 14px; margin-bottom: 8px; color: var(--md-sys-color-on-surface-variant); white-space: pre-wrap;';
        descDiv.textContent = description;
        embedDiv.appendChild(descDiv);
    }
    
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
    
    if (imageUrl) {
        const imgDiv = document.createElement('img');
        imgDiv.src = imageUrl;
        imgDiv.style.cssText = 'max-width: 100%; border-radius: 4px; margin-top: 12px;';
        embedDiv.appendChild(imgDiv);
    }
    
    if (thumbnailUrl && !imageUrl) {
        const thumbDiv = document.createElement('img');
        thumbDiv.src = thumbnailUrl;
        thumbDiv.style.cssText = 'max-width: 80px; max-height: 80px; border-radius: 4px; float: right; margin-left: 16px;';
        embedDiv.insertBefore(thumbDiv, embedDiv.firstChild);
    }
    
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

// ==================== EVENT LISTENERS ====================

document.addEventListener('DOMContentLoaded', () => {
    renderWebhooks();
    
    // Add webhook button
    document.getElementById('add-webhook-fab').addEventListener('click', () => {
        showDialog('add-webhook-dialog');
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
            document.getElementById('webhook-url-input').value = '';
            renderWebhooks();
            showSnackbar('Webhook added successfully');
        } catch (error) {
            showSnackbar(error.message);
        }
    });
    
    document.getElementById('cancel-add-button').addEventListener('click', () => {
        hideDialog('add-webhook-dialog');
        document.getElementById('webhook-url-input').value = '';
    });
    
    // Search button
    document.getElementById('search-button').addEventListener('click', () => {
        showDialog('status-checker-dialog');
    });
    
    // FIX 1: Check status button with Add/Delete buttons
    document.getElementById('check-status-button').addEventListener('click', async () => {
        const statusInput = document.getElementById('webhook-status-input');
        const url = statusInput.value.trim();
        
        if (!url) {
            showSnackbar('Please enter webhook URL');
            return;
        }
        
        try {
            const status = await manager.checkWebhookStatus(url);
            const resultDiv = document.getElementById('status-result');
            const actionsDiv = document.getElementById('status-actions');
            
            resultDiv.classList.remove('hidden');
            document.getElementById('status-avatar').src = status.avatar;
            document.getElementById('status-name').textContent = status.name;
            document.getElementById('status-date').textContent = `Created: ${status.date}`;
            document.getElementById('status-metadata').textContent = status.metadata ? JSON.stringify(status.metadata, null, 2) : 'No metadata';
            
            const badge = document.getElementById('status-badge');
            if (status.exists) {
                badge.textContent = 'Active';
                badge.className = 'status-badge active';
                // ПОКАЗАТЬ КНОПКИ
                actionsDiv.style.display = 'flex';
            } else {
                badge.textContent = 'Deleted';
                badge.className = 'status-badge deleted';
                // СКРЫТЬ КНОПКИ
                actionsDiv.style.display = 'none';
            }
            
            // ОБРАБОТЧИКИ ДЛЯ КНОПОК ADD/DELETE
            document.getElementById('add-from-search-button').onclick = async () => {
                try {
                    await manager.addWebhook(url);
                    renderWebhooks();
                    showSnackbar('Webhook added to panel');
                    hideDialog('status-checker-dialog');
                } catch (error) {
                    showSnackbar(error.message);
                }
            };
            
            document.getElementById('delete-from-search-button').onclick = async () => {
                if (confirm(`Delete "${status.name}" from Discord permanently?`)) {
                    try {
                        await manager.deleteWebhookByUrl(url);
                        showSnackbar('Webhook deleted from Discord');
                        // Обновить статус
                        document.getElementById('check-status-button').click();
                    } catch (error) {
                        showSnackbar(error.message);
                    }
                }
            };
            
        } catch (error) {
            showSnackbar(error.message);
        }
    });
    
    document.getElementById('refresh-status-button').addEventListener('click', () => {
        document.getElementById('check-status-button').click();
    });
    
    document.getElementById('close-status-checker-button').addEventListener('click', () => {
        hideDialog('status-checker-dialog');
    });
    
    // Back button
    document.getElementById('back-button').addEventListener('click', () => {
        switchView('dashboard-view');
    });
    
    // Refresh webhook button
    document.getElementById('refresh-webhook-button').addEventListener('click', async () => {
        if (!manager.currentWebhook) return;
        
        try {
            await manager.refreshWebhook(manager.currentWebhook.id);
            document.getElementById('detail-name').textContent = manager.currentWebhook.name;
            document.getElementById('detail-avatar').src = manager.currentWebhook.avatar;
            document.getElementById('edit-name').value = manager.currentWebhook.name;
            document.getElementById('webhook-metadata').textContent = JSON.stringify(manager.currentWebhook.metadata, null, 2);
            renderWebhooks();
            showSnackbar('Webhook refreshed');
        } catch (error) {
            showSnackbar(error.message);
        }
    });
    
    // Copy token button
    document.getElementById('copy-token-button').addEventListener('click', () => {
        if (!manager.currentWebhook) return;
        
        navigator.clipboard.writeText(manager.currentWebhook.token)
            .then(() => showSnackbar('Token copied to clipboard'))
            .catch(() => showSnackbar('Failed to copy token'));
    });
    
    // FIX 2: Save changes button with avatar URL
    document.getElementById('save-changes-button').addEventListener('click', async () => {
        if (!manager.currentWebhook) return;
        
        const name = document.getElementById('edit-name').value.trim();
        const avatarUrl = document.getElementById('edit-avatar-url').value.trim();
        
        if (!name && !avatarUrl) {
            showSnackbar('Please provide name or avatar URL');
            return;
        }
        
        try {
            const updates = {};
            
            if (name) {
                updates.name = name;
            }
            
            if (avatarUrl) {
                // Загрузить картинку и конвертировать в base64
                const response = await fetch(avatarUrl);
                if (!response.ok) throw new Error('Failed to fetch image');
                
                const blob = await response.blob();
                const base64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
                updates.avatar = base64;
            }
            
            await manager.updateWebhook(manager.currentWebhook.id, updates);
            
            document.getElementById('detail-avatar').src = manager.currentWebhook.avatar;
            document.getElementById('detail-name').textContent = manager.currentWebhook.name;
            document.getElementById('edit-avatar-url').value = '';
            
            renderWebhooks();
            showSnackbar('Webhook updated successfully');
        } catch (error) {
            showSnackbar(error.message);
        }
    });
    
    // Send message button
    document.getElementById('send-message-button').addEventListener('click', async () => {
        if (!manager.currentWebhook) return;
        
        const content = document.getElementById('message-content').value.trim();
        const username = document.getElementById('message-username').value.trim();
        const avatarUrl = document.getElementById('message-avatar-url').value.trim();
        const tts = document.getElementById('message-tts').checked;
        const fileInput = document.getElementById('message-attachments');
        const files = Array.from(fileInput.files);
        
        if (!content && files.length === 0) {
            showSnackbar('Please enter a message or attach files');
            return;
        }
        
        try {
            const payload = {};
            if (content) payload.content = content;
            if (username) payload.username = username;
            if (avatarUrl) payload.avatar_url = avatarUrl;
            if (tts) payload.tts = true;
            
            await manager.sendMessage(manager.currentWebhook.id, payload, files);
            
            document.getElementById('message-content').value = '';
            document.getElementById('message-username').value = '';
            document.getElementById('message-avatar-url').value = '';
            document.getElementById('message-tts').checked = false;
            fileInput.value = '';
            document.getElementById('attachments-preview').innerHTML = '';
            manager.attachmentFiles = [];
            updateAttachmentButtonState();
            
            renderMessageHistory();
            showSnackbar('Message sent successfully');
        } catch (error) {
            showSnackbar(error.message);
        }
    });
    
    // Attachments handling
    document.getElementById('message-attachments').addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        manager.attachmentFiles = files;
        
        const preview = document.getElementById('attachments-preview');
        preview.innerHTML = '';
        
        files.forEach((file, index) => {
            const item = document.createElement('div');
            item.style.cssText = 'display: flex; align-items: center; gap: 8px; padding: 8px; background: var(--md-sys-color-surface-variant); border-radius: 4px; margin-top: 8px;';
            
            const icon = document.createElement('span');
            icon.className = 'material-icons';
            icon.textContent = 'image';
            
            const name = document.createElement('span');
            name.textContent = file.name;
            name.style.flex = '1';
            
            const size = document.createElement('span');
            size.textContent = (file.size / 1024).toFixed(2) + ' KB';
            size.style.fontSize = '12px';
            size.style.color = 'var(--md-sys-color-on-surface-variant)';
            
            item.appendChild(icon);
            item.appendChild(name);
            item.appendChild(size);
            preview.appendChild(item);
        });
        
        updateAttachmentButtonState();
    });
    
    document.querySelector('.btn-file-trigger').addEventListener('click', () => {
        document.getElementById('message-attachments').click();
    });
    
    // Embed tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            
            tab.classList.add('active');
            const panel = document.querySelector(`.tab-panel[data-panel="${tab.dataset.tab}"]`);
            if (panel) panel.classList.add('active');
        });
    });
    
    // Embed color swatches
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', () => {
            document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
            swatch.classList.add('selected');
            document.getElementById('embed-color').value = swatch.dataset.color;
            updateEmbedPreview();
        });
    });
    
    // Embed live preview
    const embedInputs = [
        'embed-title', 'embed-description', 'embed-color', 'embed-url',
        'embed-author-name', 'embed-author-url', 'embed-author-icon-url',
        'embed-footer-text', 'embed-footer-icon-url',
        'embed-image-url', 'embed-thumbnail-url'
    ];
    
    embedInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', updateEmbedPreview);
        }
    });
    
    // Add field button
    document.getElementById('add-field-button').addEventListener('click', () => {
        const name = document.getElementById('field-name').value.trim();
        const value = document.getElementById('field-value').value.trim();
        const inline = document.getElementById('field-inline').checked;
        
        if (!name || !value) {
            showSnackbar('Please fill in field name and value');
            return;
        }
        
        manager.embedFields.push({ name, value, inline });
        
        document.getElementById('field-name').value = '';
        document.getElementById('field-value').value = '';
        document.getElementById('field-inline').checked = false;
        
        renderEmbedFieldsList();
        updateEmbedPreview();
    });
    
    // Send embed button
    document.getElementById('send-embed-button').addEventListener('click', async () => {
        if (!manager.currentWebhook) return;
        
        const title = document.getElementById('embed-title').value.trim();
        const description = document.getElementById('embed-description').value.trim();
        const color = document.getElementById('embed-color').value.trim();
        const url = document.getElementById('embed-url').value.trim();
        const authorName = document.getElementById('embed-author-name').value.trim();
        const authorUrl = document.getElementById('embed-author-url').value.trim();
        const authorIcon = document.getElementById('embed-author-icon-url').value.trim();
        const footerText = document.getElementById('embed-footer-text').value.trim();
        const footerIcon = document.getElementById('embed-footer-icon-url').value.trim();
        const imageUrl = document.getElementById('embed-image-url').value.trim();
        const thumbnailUrl = document.getElementById('embed-thumbnail-url').value.trim();
        const username = document.getElementById('embed-username').value.trim();
        const avatarUrl = document.getElementById('embed-avatar-url').value.trim();
        
        if (!title && !description && manager.embedFields.length === 0) {
            showSnackbar('Please fill in some embed fields');
            return;
        }
        
        try {
            const embed = {};
            if (title) embed.title = title;
            if (description) embed.description = description;
            if (color) embed.color = parseInt(color.replace('#', ''), 16);
            if (url) embed.url = url;
            
            if (authorName) {
                embed.author = { name: authorName };
                if (authorUrl) embed.author.url = authorUrl;
                if (authorIcon) embed.author.icon_url = authorIcon;
            }
            
            if (manager.embedFields.length > 0) {
                embed.fields = manager.embedFields;
            }
            
            if (imageUrl) embed.image = { url: imageUrl };
            if (thumbnailUrl) embed.thumbnail = { url: thumbnailUrl };
            
            if (footerText) {
                embed.footer = { text: footerText };
                if (footerIcon) embed.footer.icon_url = footerIcon;
            }
            
            const payload = { embeds: [embed] };
            if (username) payload.username = username;
            if (avatarUrl) payload.avatar_url = avatarUrl;
            
            await manager.sendMessage(manager.currentWebhook.id, payload);
            
            clearEmbedForm();
            renderEmbedFieldsList();
            updateEmbedPreview();
            renderMessageHistory();
            showSnackbar('Embed sent successfully');
        } catch (error) {
            showSnackbar(error.message);
        }
    });
    
    // FIX 3: Delete message by ID dialog
    document.getElementById('clear-history-button').addEventListener('click', () => {
        if (!manager.currentWebhook) return;
        
        if (confirm('Clear all message history? This will not delete messages from Discord.')) {
            manager.clearMessageHistory(manager.currentWebhook.id);
            renderMessageHistory();
            showSnackbar('History cleared');
        }
    });
    
    // Cancel delete message
    document.getElementById('cancel-delete-message-button').addEventListener('click', () => {
        hideDialog('delete-message-dialog');
        document.getElementById('delete-message-id').value = '';
    });
    
    // Confirm delete message by ID
    document.getElementById('confirm-delete-message-button').addEventListener('click', async () => {
        const messageId = document.getElementById('delete-message-id').value.trim();
        
        if (!messageId || !manager.currentWebhook) {
            showSnackbar('Please enter message ID');
            return;
        }
        
        try {
            await manager.deleteMessage(manager.currentWebhook.id, messageId);
            renderMessageHistory();
            hideDialog('delete-message-dialog');
            document.getElementById('delete-message-id').value = '';
            showSnackbar('Message deleted');
        } catch (error) {
            showSnackbar(error.message);
        }
    });
    
    // Danger zone buttons
    document.getElementById('spam-button').addEventListener('click', () => {
        showDialog('spam-dialog');
    });
    
    document.getElementById('remove-webhook-button').addEventListener('click', () => {
        if (!manager.currentWebhook) return;
        
        if (confirm(`Remove "${manager.currentWebhook.name}" from panel? Webhook will stay on Discord.`)) {
            const webhookId = manager.currentWebhook.id;
            manager.removeWebhook(webhookId);
            switchView('dashboard-view');
            renderWebhooks();
            showSnackbar('Webhook removed from panel');
        }
    });
    
    document.getElementById('delete-webhook-button').addEventListener('click', () => {
        if (!manager.currentWebhook) return;
        
        if (confirm(`Delete "${manager.currentWebhook.name}" from Discord permanently? This cannot be undone!`)) {
            const webhookId = manager.currentWebhook.id;
            manager.deleteWebhookFromDiscord(webhookId)
                .then(() => {
                    switchView('dashboard-view');
                    renderWebhooks();
                    showSnackbar('Webhook deleted from Discord');
                })
                .catch(error => showSnackbar(error.message));
        }
    });
    
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
    
    // Spam dialog
    document.getElementById('confirm-spam-button').addEventListener('click', async () => {
        if (!manager.currentWebhook) return;
        
        const message = document.getElementById('spam-message').value.trim();
        const delay = parseInt(document.getElementById('spam-delay').value);
        const count = parseInt(document.getElementById('spam-count').value);
        
        if (!message) {
            showSnackbar('Please enter a message');
            return;
        }
        
        hideDialog('spam-dialog');
        
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
        
        renderMessageHistory();
        showSnackbar(`Spam completed: ${sent}/${count} messages sent`);
    });
    
    document.getElementById('cancel-spam-button').addEventListener('click', () => {
        hideDialog('spam-dialog');
    });
    
    // Theme settings
    document.getElementById('settings-button').addEventListener('click', () => {
        showDialog('theme-dialog');
    });
    
    document.getElementById('close-theme-button').addEventListener('click', () => {
        hideDialog('theme-dialog');
    });
    
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', () => {
            const color = option.dataset.color;
            document.documentElement.setAttribute('data-accent', color);
            localStorage.setItem('dishook_accent', color);
            showSnackbar(`Theme changed to ${color}`);
        });
    });
    
    // Load saved theme
    const savedAccent = localStorage.getItem('dishook_accent');
    if (savedAccent) {
        document.documentElement.setAttribute('data-accent', savedAccent);
    }
    
    // Close dialogs on overlay click
    document.querySelectorAll('.dialog-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });
});
