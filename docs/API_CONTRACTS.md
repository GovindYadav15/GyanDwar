# API Contracts & REST Specifications

All endpoints are prefixed with `/api/v1` and documented live via Swagger OpenAPI at `/api/docs`.

## 1. Authentication Endpoints (`/api/v1/auth`)

### `POST /api/v1/auth/register`

- **Request Body**:
  ```json
  {
    "email": "student@example.com",
    "password": "Password123!",
    "fullName": "Aayush Sharma",
    "phoneNumber": "9841234567"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "accessToken": "eyJhbGciOi...",
    "user": {
      "id": "c1f7a4...",
      "email": "student@example.com",
      "fullName": "Aayush Sharma",
      "roles": ["STUDENT"]
    }
  }
  ```

### `POST /api/v1/auth/login`

- **Request Body**: `{"email": "...", "password": "..."}`
- **Response `200 OK`**: `{ "accessToken": "...", "user": { ... } }`

---

## 2. Content & Syllabus Navigation (`/api/v1/content`)

### `GET /api/v1/content/categories`

- **Response `200 OK`**: Array of examination categories (NEC, Lok Sewa, Diploma) with faculty counts and publication status.

### `GET /api/v1/content/categories/:categoryId/tree`

- **Response `200 OK`**: Nested tree of faculties, subjects, chapters, and preview availability.

### `GET /api/v1/content/chapters/:chapterId/notes`

- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**: Notes content and attached learning resources (Requires active entitlement if not marked `isFreePreview`).
- **Response `403 Forbidden`**: `{ "message": "Subscription required to access this resource" }`.

---

## 3. Assessment & Examination Engine (`/api/v1/assessments`)

### `GET /api/v1/assessments/available`

- **Query Params**: `?type=CHAPTER_PRACTICE&subjectId=...` or `?type=FULL_MOCK`
- **Response `200 OK`**: List of tests with mark distribution, time limits, and free/premium tags.

### `POST /api/v1/assessments/:assessmentId/start`

- **Description**: Generates a server-tracked examination attempt. Questions are returned with randomized option order, but **without** answer keys or explanations.
- **Response `201 Created`**:
  ```json
  {
    "attemptId": "a93b4...",
    "assessmentTitle": "NEC Civil Engineering 100-Mark Model Exam",
    "startedAt": "2026-10-12T10:15:00.000Z",
    "expiresAt": "2026-10-12T12:15:00.000Z",
    "durationMinutes": 120,
    "totalMarks": 100,
    "questions": [
      {
        "id": "q123",
        "questionText": "What is the slump value for pumpable concrete?",
        "options": [
          { "id": "opt1", "label": "A", "text": "25-50 mm" },
          { "id": "opt2", "label": "B", "text": "75-100 mm" },
          { "id": "opt3", "label": "C", "text": "125-150 mm" },
          { "id": "opt4", "label": "D", "text": "175-200 mm" }
        ],
        "marks": 1.0,
        "negativeMarks": 0.2
      }
    ]
  }
  ```

### `POST /api/v1/assessments/attempts/:attemptId/save-response`

- **Request Body**:
  ```json
  {
    "questionId": "q123",
    "selectedOptionId": "opt2",
    "timeSpentSeconds": 45,
    "isMarkedForReview": false
  }
  ```
- **Response `200 OK`**: `{ "saved": true }`

### `POST /api/v1/assessments/attempts/:attemptId/submit`

- **Description**: Submits and scores the examination. Computes marks awarded, penalties, accuracy, and releases full explanation reviews.
- **Response `200 OK`**:
  ```json
  {
    "attemptId": "a93b4...",
    "status": "SUBMITTED",
    "scoreObtained": 78.4,
    "totalMarks": 100,
    "passMarks": 50,
    "isPassed": true,
    "totalAnswered": 92,
    "totalCorrect": 82,
    "totalIncorrect": 10,
    "negativeDeduction": 2.0,
    "detailedReview": [
      {
        "questionId": "q123",
        "questionText": "What is the slump value for pumpable concrete?",
        "userSelectedOptionId": "opt2",
        "correctOptionId": "opt2",
        "isCorrect": true,
        "marksAwarded": 1.0,
        "explanation": "Pumpable concrete typically requires a slump between 75mm and 100mm to flow smoothly without segregation."
      }
    ]
  }
  ```

---

## 4. Payment & Subscriptions (`/api/v1/payments`)

### `POST /api/v1/payments/initiate`

- **Request Body**:
  ```json
  {
    "planId": "plan-monthly-1",
    "gateway": "ESEWA" // or "KHALTI"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "orderId": "ord_88291",
    "gateway": "ESEWA",
    "paymentUrl": "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
    "formFields": {
      "amount": "999",
      "tax_amount": "0",
      "total_amount": "999",
      "transaction_uuid": "txn_88291_172871...",
      "product_code": "EPAYTEST",
      "success_url": "http://localhost:3000/payments/verify/esewa",
      "failure_url": "http://localhost:3000/payments/failure",
      "signed_field_names": "total_amount,transaction_uuid,product_code",
      "signature": "kXj93h..."
    }
  }
  ```

### `POST /api/v1/payments/verify/esewa`

- **Request Body**:
  ```json
  {
    "data": "eyJ0b3RhbF9hbW91bnQiOiI5OTkiLCJ0cmFuc2FjdGlvbl91dWlkIjoi...\""
  }
  ```
- **Verification Rule**: Decodes base64 payload, calculates HMAC-SHA256 signature against secret key, compares hashes, confirms transaction via eSewa transaction status API, activates user subscription in a database transaction, and logs payment event.

### `POST /api/v1/payments/verify/khalti`

- **Request Body**:
  ```json
  {
    "pidx": "kPidx_98231...",
    "orderId": "ord_88291"
  }
  ```
- **Verification Rule**: Invokes Khalti server-side lookup endpoint `https://a.khalti.com/api/v2/epayment/lookup/` with secret header, confirms `status === "Completed"`, matches order amount, activates subscription idempotently.
