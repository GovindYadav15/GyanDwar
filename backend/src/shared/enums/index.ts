export enum RoleName {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  CONTENT_EDITOR = 'CONTENT_EDITOR',
  INSTRUCTOR = 'INSTRUCTOR',
  STUDENT = 'STUDENT',
}

export enum ExamCategoryCode {
  NEC = 'NEC',
  LOK_SEWA = 'LOK_SEWA',
  DIPLOMA = 'DIPLOMA',
}

export enum DifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}

export enum QuestionType {
  MCQ = 'MCQ',
  MULTIPLE_SELECT = 'MULTIPLE_SELECT',
  NUMERICAL = 'NUMERICAL',
}

export enum PublicationStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export enum AssessmentType {
  CHAPTER_PRACTICE = 'CHAPTER_PRACTICE',
  SUBJECT_MOCK = 'SUBJECT_MOCK',
  FULL_MOCK = 'FULL_MOCK',
}

export enum AttemptStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
  EXPIRED = 'EXPIRED',
  ABANDONED = 'ABANDONED',
}

export enum PaymentGateway {
  ESEWA = 'ESEWA',
  KHALTI = 'KHALTI',
}

export enum PaymentStatus {
  INITIATED = 'INITIATED',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum SubscriptionStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

export enum ResourceType {
  NOTES = 'NOTES',
  PDF = 'PDF',
  SYLLABUS = 'SYLLABUS',
  EXTERNAL_LINK = 'EXTERNAL_LINK',
}
