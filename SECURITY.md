# Security Policy

## Reporting Security Issues

We take the security of ExamSathi Nepal seriously. If you discover a security vulnerability, please do NOT create a public GitHub issue.

Please report security issues responsibly by emailing:
**security@examsathi.com.np**

Please provide:

- A description of the vulnerability.
- Steps or proof of concept to reproduce the issue.
- Potential impact and affected endpoints or components.

## Security Controls & Principles

1. **Never Trust the Client**: Assessment timers, entitlement verification, and payment confirmation are authoritative on the backend.
2. **Payment Callback Verification**: Neither eSewa nor Khalti frontend success redirects activate subscriptions. Activation requires server-side signature validation and API status verification.
3. **Assessment Answer Protection**: Question explanations, correct answer choices, and scoring keys are stripped from responses during active attempts.
4. **Secret Hygiene**: Merchant secrets, JWT private keys, and database passwords must never be stored in frontend bundles or committed to source control.
5. **Least Privilege**: Role-based access control (RBAC) is enforced on all administrative and mutation operations.
