# Dishook Setup Guide

## Quick Start

### Option 1: Use GitHub Pages (Recommended)

1. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to "Pages" section
   - Under "Source", select "GitHub Actions"
   - The workflow will automatically deploy your site

2. **Access Your Site**:
   - Your site will be available at: `https://artemishich.github.io/dishook`
   - Wait a few minutes for initial deployment
   - Check the "Actions" tab to see deployment status

3. **Use Dishook**:
   - Open the URL in your browser
   - Start adding webhooks!

### Option 2: Local Development

#### Using Python HTTP Server

```bash
# Clone repository
git clone https://github.com/Artemishich/dishook.git
cd dishook

# Start server
python -m http.server 8000

# Open browser
open http://localhost:8000
```

#### Using Node.js HTTP Server

```bash
# Install http-server globally
npm install -g http-server

# Start server
http-server -p 8000

# Open browser
open http://localhost:8000
```

#### Using PHP Built-in Server

```bash
php -S localhost:8000
open http://localhost:8000
```

#### Direct File Opening

1. Navigate to the `dishook` folder
2. Double-click `index.html`
3. It will open in your default browser

**Note**: Some features (like clipboard API) require HTTPS, so using a local server is recommended.

## GitHub Pages Configuration

### Automatic Deployment

The repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to `main`.

**Workflow File**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:
```

### Manual Deployment Trigger

1. Go to "Actions" tab
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Select branch (main)
5. Click "Run workflow" button

### Custom Domain (Optional)

1. **Purchase Domain**: Buy a domain from a registrar
2. **Configure DNS**:
   ```
   Type: CNAME
   Name: www (or @)
   Value: artemishich.github.io
   ```
3. **Add to GitHub**:
   - Go to Settings > Pages
   - Enter custom domain
   - Enable "Enforce HTTPS"

## Environment Setup

### Prerequisites

- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Internet connection (for Discord API calls)
- No backend or database required!

### Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Core App | 90+ | 88+ | 14+ | 90+ |
| Clipboard API | 66+ | 63+ | 13.1+ | 79+ |
| LocalStorage | All | All | All | All |
| CSS Grid | 57+ | 52+ | 10.1+ | 16+ |

### Required Permissions

- **Clipboard Access**: For copying webhook tokens
- **LocalStorage Access**: For saving webhook data
- **Network Access**: For Discord API calls

## Configuration

### Default Settings

Dishook works out-of-the-box with no configuration needed!

**Default Theme**: Blue
**Default View**: Dashboard
**Storage**: LocalStorage (automatic)

### Customization

#### Change Default Theme

Edit `styles.css`, line 2-9:

```css
:root {
    /* Change these values for different default theme */
    --md-sys-color-primary: #2196F3; /* Blue */
    --md-sys-color-primary-container: #BBDEFB;
    /* ... */
}
```

#### Add Custom Theme

1. Add color option in `index.html`:
```html
<button class="color-option" data-color="custom" style="background-color: #YOUR_COLOR;"></button>
```

2. Add theme variant in `styles.css`:
```css
[data-theme="custom"] {
    --md-sys-color-primary: #YOUR_COLOR;
    --md-sys-color-primary-container: #YOUR_LIGHT_COLOR;
    --md-sys-color-on-primary-container: #YOUR_DARK_COLOR;
}
```

#### Modify UI Text

Edit `index.html` to change any text:

```html
<!-- Change app title -->
<h1 class="app-title">Dishook</h1>
<!-- to -->
<h1 class="app-title">Your Custom Name</h1>
```

## Deployment Options

### 1. GitHub Pages (Free, Recommended)

**Pros**:
- Free hosting
- Automatic HTTPS
- Custom domain support
- Automatic deployments
- CDN included

**Cons**:
- Public repository required (for free)
- GitHub uptime dependency

**Steps**: See "Option 1" above

### 2. Netlify

1. Sign up at [netlify.com](https://netlify.com)
2. Click "Add new site" > "Import an existing project"
3. Connect to GitHub
4. Select `dishook` repository
5. Deploy!

**Build Settings**: None needed (static site)

### 3. Vercel

1. Sign up at [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect GitHub repository
4. Deploy!

### 4. Cloudflare Pages

1. Sign up at [pages.cloudflare.com](https://pages.cloudflare.com)
2. Create new project
3. Connect GitHub
4. Select repository
5. Deploy!

### 5. Self-Hosted

#### Using Nginx

```nginx
server {
    listen 80;
    server_name dishook.yourdomain.com;
    
    root /var/www/dishook;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Using Apache

```apache
<VirtualHost *:80>
    ServerName dishook.yourdomain.com
    DocumentRoot /var/www/dishook
    
    <Directory /var/www/dishook>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

## Troubleshooting

### GitHub Pages Not Working

**Problem**: Site not accessible after setup

**Solutions**:
1. Check Actions tab for deployment errors
2. Ensure GitHub Pages is enabled in Settings
3. Wait 5-10 minutes for DNS propagation
4. Clear browser cache
5. Try incognito/private mode

### Local Server Issues

**Problem**: "Address already in use"

**Solution**:
```bash
# Use different port
python -m http.server 8001
# or
http-server -p 8001
```

**Problem**: CORS errors in console

**Solution**: Use HTTP server instead of opening file directly

### Build/Deploy Errors

**Problem**: GitHub Actions workflow fails

**Solutions**:
1. Check Actions logs for specific error
2. Ensure repository permissions are correct
3. Verify workflow file syntax
4. Re-run workflow manually

## Security Considerations

### HTTPS Requirement

Some features (clipboard API) require HTTPS:

- ✅ GitHub Pages (automatic HTTPS)
- ✅ Netlify (automatic HTTPS)
- ✅ Vercel (automatic HTTPS)
- ⚠️ Local development (use localhost)
- ❌ HTTP-only hosting (some features won't work)

### Content Security Policy (Optional)

Add to `index.html` `<head>` for enhanced security:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               font-src https://fonts.gstatic.com; 
               connect-src https://discord.com;">
```

## Performance Optimization

### Enable Caching

For self-hosted deployments, add caching headers:

**Nginx**:
```nginx
location ~* \.(css|js|jpg|png|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

**Apache**:
```apache
<filesMatch "\.(css|js|jpg|png|svg)$">
    Header set Cache-Control "max-age=31536000, public"
</filesMatch>
```

### Enable Compression

**Nginx**:
```nginx
gzip on;
gzip_types text/css application/javascript image/svg+xml;
```

**Apache**:
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/css application/javascript
</IfModule>
```

## Monitoring

### GitHub Pages Analytics

1. Go to repository Insights
2. Click "Traffic"
3. View visitor statistics

### Add Google Analytics (Optional)

Add before closing `</head>` in `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Updates and Maintenance

### Getting Updates

```bash
# Pull latest changes
git pull origin main

# If you forked, sync fork:
git fetch upstream
git merge upstream/main
```

### Automatic Updates (Forked Repos)

1. Enable GitHub Actions in your fork
2. Install "Pull" app from GitHub Marketplace
3. Configure automatic upstream syncing

## Support

If you encounter issues:

1. Check [Troubleshooting](#troubleshooting) section
2. Review [GitHub Issues](https://github.com/Artemishich/dishook/issues)
3. Read [Documentation](../README.md)
4. Open new issue with:
   - Setup method used
   - Error messages
   - Browser and OS
   - Steps to reproduce

---

**Need help?** Open an issue or join our community!

**Quick Links**:
- [Main README](../README.md)
- [Contributing Guide](../CONTRIBUTING.md)
- [Security Policy](../SECURITY.md)
- [Usage Examples](../examples/usage-examples.md)