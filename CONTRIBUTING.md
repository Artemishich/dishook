# Contributing to Dishook

First off, thank you for considering contributing to Dishook! It's people like you that make Dishook such a great tool.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Pull Requests](#pull-requests)
- [Style Guides](#style-guides)
  - [Git Commit Messages](#git-commit-messages)
  - [JavaScript Style Guide](#javascript-style-guide)
  - [CSS Style Guide](#css-style-guide)
- [Additional Notes](#additional-notes)

## Code of Conduct

This project and everyone participating in it is governed by a code of conduct. By participating, you are expected to uphold this code:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for Dishook. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

**Before Submitting A Bug Report:**

- Check the [documentation](README.md) for a list of common questions and problems
- Check if the issue has already been reported in [Issues](https://github.com/Artemishich/dishook/issues)
- Try to reproduce the bug in the latest version

**How Do I Submit A Good Bug Report?**

Bugs are tracked as [GitHub issues](https://github.com/Artemishich/dishook/issues). Create an issue and provide the following information:

- **Use a clear and descriptive title** for the issue
- **Describe the exact steps to reproduce the problem** in as much detail as possible
- **Provide specific examples** to demonstrate the steps
- **Describe the behavior you observed** after following the steps
- **Explain which behavior you expected to see instead** and why
- **Include screenshots or animated GIFs** if applicable
- **Include details about your environment**:
  - Browser name and version
  - Operating system
  - Device type (desktop, mobile, tablet)

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for Dishook, including completely new features and minor improvements to existing functionality.

**Before Submitting An Enhancement Suggestion:**

- Check if the enhancement has already been suggested
- Check if there's a newer version that might already include the feature

**How Do I Submit A Good Enhancement Suggestion?**

Enhancement suggestions are tracked as [GitHub issues](https://github.com/Artemishich/dishook/issues). Create an issue and provide:

- **Use a clear and descriptive title** with `[Feature Request]` prefix
- **Provide a detailed description** of the suggested enhancement
- **Provide specific examples** to demonstrate use cases
- **Describe the current behavior** and explain how the enhancement would change it
- **Explain why this enhancement would be useful** to most Dishook users
- **Include mockups or examples** if applicable

### Your First Code Contribution

Unsure where to begin contributing? You can start by looking through these issues:

- `good-first-issue` - issues which should only require a few lines of code
- `help-wanted` - issues which should be a bit more involved than beginner issues

**Local Development Setup:**

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/dishook.git
   cd dishook
   ```
3. Open `index.html` in your browser or use a local server:
   ```bash
   python -m http.server 8000
   ```
4. Make your changes
5. Test thoroughly in multiple browsers

### Pull Requests

The process described here has several goals:

- Maintain Dishook's quality
- Fix problems that are important to users
- Engage the community in working toward the best possible Dishook
- Enable a sustainable system for maintainers to review contributions

**Pull Request Process:**

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit with clear messages

3. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Open a Pull Request with:
   - Clear title describing the change
   - Detailed description of what changed and why
   - Reference to related issues (e.g., "Fixes #123")
   - Screenshots if UI changes were made
   - Confirmation that you tested in multiple browsers

5. Wait for review and address any feedback

## Style Guides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Consider starting the commit message with an applicable emoji:
  - ✨ `:sparkles:` when adding a new feature
  - 🐛 `:bug:` when fixing a bug
  - 📝 `:memo:` when writing docs
  - 🎨 `:art:` when improving UI/style
  - ⚡ `:zap:` when improving performance
  - ♻️ `:recycle:` when refactoring code
  - ✅ `:white_check_mark:` when adding tests
  - 🔒 `:lock:` when dealing with security

**Example:**
```
✨ Add webhook export functionality

- Implement JSON export of all webhooks
- Add download button to dashboard
- Include webhook metadata in export

Fixes #42
```

### JavaScript Style Guide

**General Principles:**
- Use ES6+ features (const, let, arrow functions, async/await)
- Use meaningful and descriptive variable names
- Keep functions small and focused (single responsibility)
- Add JSDoc comments for public methods
- Use async/await instead of raw promises
- Handle errors appropriately

**Code Examples:**

```javascript
// Good
const fetchWebhookData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching webhook:', error);
        throw error;
    }
};

// Bad
function fetchWebhookData(url) {
    fetch(url).then(function(response) {
        return response.json();
    }).then(function(data) {
        return data;
    });
}
```

**Naming Conventions:**
- Variables and functions: `camelCase`
- Classes: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Private methods: prefix with underscore `_privateMethod`

**Comments:**
```javascript
/**
 * Sends a message through Discord webhook
 * @param {string} id - Webhook ID
 * @param {string} content - Message content
 * @returns {Promise<void>}
 * @throws {Error} If webhook not found or message fails
 */
async sendMessage(id, content) {
    // Implementation
}
```

### CSS Style Guide

**General Principles:**
- Use CSS custom properties (variables) for theme values
- Follow BEM naming convention for custom components
- Keep selectors specific but not overly nested
- Group related properties together
- Use shorthand properties when possible
- Add comments for complex sections

**Code Examples:**

```css
/* Good */
.webhook-card {
    background-color: var(--md-sys-color-surface);
    border-radius: 12px;
    padding: 16px;
    transition: all var(--md-sys-motion-duration-short) var(--md-sys-motion-easing-standard);
}

.webhook-card:hover {
    box-shadow: var(--md-sys-elevation-2);
}

/* Bad */
.webhook-card {
    background-color: #FFFFFF;
    border-radius: 12px;
    padding: 16px 16px 16px 16px;
}
```

**Property Order:**
1. Positioning (position, top, right, bottom, left, z-index)
2. Display & Box Model (display, flex, width, height, margin, padding)
3. Typography (font-*, line-height, text-*)
4. Visual (background, border, box-shadow)
5. Animation (transition, animation)
6. Misc (cursor, pointer-events)

## Additional Notes

### Issue and Pull Request Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good-first-issue` - Good for newcomers
- `help-wanted` - Extra attention is needed
- `question` - Further information is requested
- `wontfix` - This will not be worked on
- `duplicate` - This issue or pull request already exists

### Testing Guidelines

**Before submitting a PR, test:**

- ✅ All features work as expected
- ✅ No console errors
- ✅ UI looks correct on different screen sizes
- ✅ Works in Chrome, Firefox, Safari, Edge
- ✅ Theme switching works properly
- ✅ LocalStorage saves and loads correctly
- ✅ Error handling displays appropriate messages
- ✅ Animations are smooth

### Questions?

Don't hesitate to ask questions! You can:

- Open an issue with the `question` label
- Reach out to maintainers
- Join the Discord community (coming soon)

---

Thank you for contributing to Dishook! 🚀