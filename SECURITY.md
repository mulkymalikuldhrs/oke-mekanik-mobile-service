# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 5.8.x   | :white_check_mark: |
| 5.7.x   | :white_check_mark: |
| < 5.7   | :x:                |

## Reporting a Vulnerability

We take the security of Oke Mekanik Mobile Service seriously. If you believe you have found a security vulnerability, please report it responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to:

**[mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com)**

Please include the following information in your report:

1. **Type of vulnerability** (e.g., XSS, SQL injection, authentication bypass, etc.)
2. **Full paths of source file(s)** related to the vulnerability
3. **The location of the affected source code** (tag/branch/commit or direct URL)
4. **Any special configuration** required to reproduce the issue
5. **Step-by-step instructions** to reproduce the issue
6. **Proof-of-concept or exploit code** (if possible)
7. **Impact of the issue**, including how an attacker might exploit it

### Response Timeline

We are committed to responding to security reports promptly:

| Stage | Timeline |
|-------|----------|
| **Acknowledgment** | Within 48 hours of report |
| **Initial Assessment** | Within 5 business days |
| **Status Update** | Every 7 days until resolution |
| **Fix Development** | Within 30 days (critical), 60 days (high), 90 days (medium/low) |
| **Disclosure** | After fix is released and users have had time to update |

### Disclosure Policy

- We follow **responsible disclosure** practices
- We ask that you give us a reasonable amount of time to fix the issue before public disclosure
- We will credit you in the security advisory (unless you prefer to remain anonymous)
- We will notify affected users through GitHub Security Advisories

### Security Best Practices for Contributors

When contributing to this project, please follow these security guidelines:

- **Never commit secrets**, API keys, passwords, or tokens to the repository
- **Use environment variables** for all sensitive configuration (`.env` files are gitignored)
- **Validate and sanitize** all user inputs on both client and server
- **Use parameterized queries** for all database operations (Better-SQLite3 prepared statements)
- **Follow the principle of least privilege** for API endpoints and middleware
- **Keep dependencies updated** and respond to security audit findings
- **Use `helmet`** middleware for security headers (already configured)
- **Use `express-rate-limit`** to prevent brute force attacks (already configured)
- **Hash passwords** with `bcryptjs` (already implemented)
- **Use JWT** with appropriate expiration for authentication (already implemented)

### Scope

The following are **in scope** for our security program:

- Oke Mekanik Mobile Service application code
- Express API endpoints (`server/`)
- Authentication and authorization logic
- Database queries and data handling
- WebSocket/Socket.io connections
- PWA service worker and manifest

The following are **out of scope**:

- Third-party services we do not control
- Denial of Service (DoS) attacks
- Social engineering attacks
- Physical attacks
- Attacks requiring privileged network access

### Contact

For any security-related questions or concerns:

- **Email:** [mulkymalikuldhaher@email.com](mailto:mulkymalikuldhaher@email.com)
- **GitHub:** [@mulkymalikuldhrs](https://github.com/mulkymalikuldhrs)

Thank you for helping keep Oke Mekanik and our users safe!
