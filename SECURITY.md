# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the severity of the vulnerability:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within Dishook, please follow these steps:

### 1. Do Not Publicly Disclose

**Please do not** create a public GitHub issue for security vulnerabilities.

### 2. Contact Us Privately

Report security vulnerabilities by:

- **Email**: security@dishook.dev (coming soon)
- **GitHub Security Advisory**: Use the [Security Advisory](https://github.com/Artemishich/dishook/security/advisories/new) page

### 3. Provide Details

Include in your report:

- **Type of vulnerability** (XSS, CSRF, injection, etc.)
- **Full paths of affected source files**
- **Location of the affected code** (tag/branch/commit)
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the vulnerability** and how it can be exploited

### 4. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: 1-7 days
  - High: 7-14 days
  - Medium: 14-30 days
  - Low: 30-90 days

## Security Measures in Dishook

### Current Implementation

1. **Token Protection**
   - Webhook tokens are masked in UI
   - Tokens stored locally only (never transmitted to external servers)
   - Copy-to-clipboard requires user action

2. **Input Validation**
   - Strict webhook URL validation using regex
   - Content sanitization for user inputs
   - Length limits on text inputs

3. **API Security**
   - HTTPS-only connections to Discord API
   - Proper error handling for failed requests
   - Rate limiting awareness

4. **Data Storage**
   - LocalStorage usage only (no external databases)
   - No cookies or tracking
   - Clear data separation

### Known Limitations

1. **LocalStorage Security**
   - Data stored unencrypted in browser
   - Accessible to anyone with device access
   - Vulnerable to XSS attacks if present
   - **Mitigation**: Use only on trusted devices

2. **Client-Side Only**
   - No server-side validation
   - Relies on browser security
   - **Mitigation**: Keep browser updated

3. **Webhook Token Exposure**
   - Tokens visible in DevTools if accessed
   - Stored in plain text in localStorage
   - **Mitigation**: Clear sensitive data when not in use

## Security Best Practices for Users

### Do's ✅

- Use Dishook only on trusted devices
- Keep your browser updated
- Clear browser data when using shared computers
- Regularly review and delete unused webhooks
- Use Discord's webhook permissions appropriately
- Monitor webhook usage in Discord

### Don'ts ❌

- Don't share webhook tokens with others
- Don't use on public/shared computers
- Don't store critical webhooks in Dishook
- Don't abuse spam features (respect rate limits)
- Don't use on compromised networks

## Vulnerability Disclosure Policy

When we receive a security bug report, we will:

1. **Confirm** the problem and determine affected versions
2. **Audit** code to find similar problems
3. **Prepare** fixes for all supported versions
4. **Release** security updates as soon as possible
5. **Credit** the reporter (unless they prefer anonymity)

## Security Updates

Security updates will be:

- Released as patch versions (e.g., 1.0.1)
- Documented in CHANGELOG.md
- Announced in README.md
- Tagged with `security` label in releases

## Scope

### In Scope ✅

- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- Code injection vulnerabilities
- Authentication/Authorization issues
- Sensitive data exposure
- Insecure data storage
- Security misconfigurations

### Out of Scope ❌

- Social engineering attacks
- Physical access to unlocked devices
- Browser vulnerabilities (report to browser vendors)
- Discord API vulnerabilities (report to Discord)
- Denial of Service (DoS) attacks
- Spam or abuse of spam features

## PGP Key

Coming Soon - For encrypted communications

## Hall of Fame

We thank the following researchers for responsibly disclosing vulnerabilities:

- *No reports yet - be the first!*

## Contact

For security concerns:
- Email: security@dishook.dev (coming soon)
- GitHub: [@Artemishich](https://github.com/Artemishich)

---

*Last updated: February 2026*