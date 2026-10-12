# Product Requirements Document (PRD) — ExamSathi Nepal

## 1. Vision & Purpose

ExamSathi Nepal (ज्ञानद्वार) is an online preparation platform designed specifically for Nepal's engineering graduates and competitive public service aspirants. The initial focus spans three primary domains:

1. **NEC License Examination Preparation**: Mandatory certification exam conducted by Nepal Engineering Council for engineering practice (Civil, Electrical, Mechanical, Computer, Electronics, etc.).
2. **Lok Sewa Aayog (Public Service Commission) Preparation**: Competitive recruitment examinations for technical officer/assistant levels (Gazetted 7th level, Non-Gazetted 5th level).
3. **Diploma License Examination Preparation**: Licensing for diploma engineers and technical technicians.

---

## 2. Target Personas

- **Prakash (Engineering Graduate)**: Preparing for the NEC license exam; needs realistic 100-mark mock tests that replicate the 2-hour exam format with 1-mark questions and negative marking.
- **Sita (Lok Sewa Aspirant)**: Preparing for the Ministry of Physical Infrastructure technical officer post; needs chapter-wise syllabus tracking, structured notes, and practice drills.
- **Bikram (Content Administrator & Author)**: Uploads official-aligned syllabi, creates MCQs with detailed explanations, reviews questions, and sets up test blueprints.

---

## 3. Functional Requirements

### 3.1 Content Hierarchy & Navigation

- Multi-tier classification:
  `Exam Category` → `Faculty/Discipline` → `Course/Track` → `Subject` → `Chapter` → `Learning Materials & Assessments`
- Extensibility: Adding new disciplines (e.g., Medical Council, Bar Council) must not require schema rewrites.
- Draft, published, and archived state machine for all curriculum content.

### 3.2 Learning Materials

- Formatted notes and chapter overview.
- Resource attachments (PDF download links, architectural diagrams).
- Free preview indicators for trial users.

### 3.3 Assessment Engine

- **Chapter-wise Practice Tests**:
  - Un-timed or flexible timed mode.
  - Immediate explanation reveal toggle.
  - Review flags and question bookmarking.
- **Full-Length Mock Examinations (100 Marks)**:
  - Strict server-authoritative timer (120 minutes standard).
  - Blueprinted question selection across multiple subjects.
  - Negative marking deduction (configurable, default 20% / 0.20 marks deduction per wrong answer).
  - Response auto-save every 30 seconds or on option selection.
  - Secure submission and detailed scorecard breakdown (Subject-wise accuracy, total score, pass/fail status).

### 3.4 Entitlements & Subscription Tiers

- Free trial tier (selected preview chapters, diagnostic tests).
- Paid plans:
  - 1 Month Pass (NPR 999)
  - 3 Month Pass (NPR 2,499)
  - 1 Year Pass (NPR 5,999)
- Server-side entitlement validation on notes and assessment start endpoints.

### 3.5 Payment Gateways (eSewa & Khalti)

- Native integration with eSewa EPAY v2 and Khalti ePayment v2.
- Cryptographic hash verification (HMAC-SHA256).
- Idempotency guards preventing double activation or replay attacks.

### 3.6 Student Dashboard & Analytics

- Enrolled categories and active subscription status.
- Recent assessment history with scores, accuracy, and timestamps.
- Subject-wise strength/weakness heatmaps and recommended next topics.

### 3.7 Administrative Controls

- Management of users, roles, categories, subjects, chapters, questions, and blueprints.
- Audit logging of critical actions (role changes, blueprint modification, transaction reconciliation).
