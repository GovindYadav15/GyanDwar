import {
  RoleName,
  ExamCategoryCode,
  DifficultyLevel,
  AssessmentType,
  AttemptStatus,
  PaymentGateway,
  PaymentStatus,
  OrderStatus,
  SubscriptionStatus,
  ResourceType,
} from '../enums';

export interface UserSummary {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string | null;
  roles: RoleName[];
  isActive: boolean;
  createdAt: string;
}

export interface ExamCategorySummary {
  id: string;
  code: ExamCategoryCode;
  title: string;
  description: string;
  iconUrl?: string | null;
  displayOrder: number;
  facultyCount?: number;
  subjectCount?: number;
}

export interface FacultySummary {
  id: string;
  categoryId: string;
  name: string;
  code: string;
  displayOrder: number;
}

export interface SubjectSummary {
  id: string;
  name: string;
  code: string;
  chapterCount?: number;
  displayOrder: number;
}

export interface ChapterSummary {
  id: string;
  subjectId: string;
  title: string;
  chapterNumber: number;
  description?: string | null;
  isFreePreview: boolean;
  questionCount?: number;
}

export interface LearningResourceSummary {
  id: string;
  chapterId: string;
  title: string;
  resourceType: ResourceType;
  content?: string | null;
  fileUrl?: string | null;
  fileSizeBytes?: number | null;
  isFreePreview: boolean;
}

export interface QuestionClientView {
  id: string;
  questionText: string;
  richMediaUrl?: string | null;
  difficulty: DifficultyLevel;
  marks: number;
  negativeMarks: number;
  options: {
    id: string;
    optionLabel: string;
    optionText: string;
  }[];
}

export interface AssessmentSummary {
  id: string;
  title: string;
  description?: string | null;
  type: AssessmentType;
  totalMarks: number;
  passMarks: number;
  durationMinutes: number;
  isFree: boolean;
  totalQuestions: number;
}

export interface AssessmentAttemptView {
  attemptId: string;
  assessmentId: string;
  assessmentTitle: string;
  type: AssessmentType;
  startedAt: string;
  expiresAt: string;
  durationMinutes: number;
  totalMarks: number;
  passMarks: number;
  questions: QuestionClientView[];
  savedResponses: Record<string, string>; // questionId -> selectedOptionId
  markedForReview: string[]; // questionIds
}

export interface AttemptResultDetail {
  questionId: string;
  questionText: string;
  selectedOptionId: string | null;
  correctOptionId: string;
  isCorrect: boolean;
  marksAwarded: number;
  negativeMarksDeducted: number;
  explanation: string;
  options: {
    id: string;
    optionLabel: string;
    optionText: string;
    isCorrect: boolean;
  }[];
}

export interface AssessmentResultView {
  attemptId: string;
  assessmentTitle: string;
  status: AttemptStatus;
  startedAt: string;
  submittedAt: string;
  scoreObtained: number;
  totalMarks: number;
  passMarks: number;
  isPassed: boolean;
  totalAnswered: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalUnanswered: number;
  accuracyRate: number;
  negativeDeduction: number;
  reviewItems: AttemptResultDetail[];
}

export interface SubscriptionPlanSummary {
  id: string;
  name: string;
  code: string;
  durationDays: number;
  priceNpr: number;
  discountNpr: number;
  features: string[];
  isPopular?: boolean;
}

export interface UserSubscriptionSummary {
  id: string;
  planId: string;
  planName: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  daysRemaining: number;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  amountNpr: number;
  status: OrderStatus;
  createdAt: string;
}

export interface PaymentInitiationResult {
  orderId: string;
  gateway: PaymentGateway;
  paymentUrl: string;
  formFields?: Record<string, string>;
  pidx?: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  orderId: string;
  gateway: PaymentGateway;
  status: PaymentStatus;
  gatewayTransactionId?: string;
  message: string;
}

// -------------------------------------------------------------
// Admin Studio & Content Management Contracts
// -------------------------------------------------------------

export interface AdminChapterDetail {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  categoryCode: string;
  title: string;
  chapterNumber: number;
  description?: string | null;
  isFreePreview: boolean;
  displayOrder: number;
  resources: LearningResourceSummary[];
  questionCount: number;
}

export interface CreateChapterResourceDto {
  chapterId: string;
  title: string;
  resourceType: ResourceType;
  content?: string | null;
  fileUrl?: string | null;
  fileSizeBytes?: number | null;
  isFreePreview?: boolean;
  displayOrder?: number;
}

export interface CreateChapterNotesDto {
  chapterId: string;
  title: string;
  content: string;
  isFreePreview?: boolean;
}

export interface ParsedMcqOption {
  optionLabel: string;
  optionText: string;
  isCorrect: boolean;
}

export interface ParsedMcqItem {
  questionText: string;
  difficulty: DifficultyLevel;
  marks: number;
  negativeMarks: number;
  explanationText?: string;
  options: ParsedMcqOption[];
}

export interface BulkMcqImportDto {
  chapterId: string;
  markdownContent: string;
}

export interface BulkMcqImportResult {
  totalParsed: number;
  createdCount: number;
  questions: { id: string; questionText: string }[];
  errors?: string[];
}

export interface AdminUserListItem {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string | null;
  roles: RoleName[];
  isActive: boolean;
  userType: 'STUDENT' | 'ADMIN_STAFF';
  activeSubscription?: string | null;
  createdAt: string;
}

export interface AdminOrderItem {
  id: string;
  orderNumber: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  planId: string;
  planName: string;
  durationDays: number;
  amountNpr: number;
  status: OrderStatus;
  paymentGateway?: PaymentGateway | null;
  gatewayTransactionId?: string | null;
  paymentStatus?: PaymentStatus | null;
  createdAt: string;
  hasActiveSubscription: boolean;
}

export interface VerifyOrderPaymentDto {
  orderId: string;
  notes?: string;
}
