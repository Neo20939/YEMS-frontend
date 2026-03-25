/**
 * External API Types and Interfaces
 * 
 * This module defines all types and interfaces for interacting with the external exam API.
 * Configure your API base URL and authentication in the environment variables.
 */

// ============================================================================
// Base Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
  timestamp?: string
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
}

// ============================================================================
// Authentication Types
// ============================================================================

export interface AuthCredentials {
  apiKey: string
  apiSecret?: string
}

export interface AuthToken {
  accessToken: string
  refreshToken?: string
  expiresIn: number
  tokenType: "Bearer"
}

// ============================================================================
// Exam Types
// ============================================================================

export type ExamType = "objective" | "theory" | "mixed"

export type ExamStatus = "not-started" | "in-progress" | "paused" | "completed" | "submitted"

export interface Exam {
  id: string
  title: string
  description?: string
  type: ExamType
  duration: number // in seconds
  totalMarks: number
  passingMarks: number
  status: ExamStatus
  startDate?: string
  endDate?: string
  submittedAt?: string
  sections: ExamSection[]
  createdAt: string
  updatedAt: string
}

export interface ExamSection {
  id: string
  name: string
  type: "objectives" | "theory"
  order: number
  totalQuestions: number
  totalMarks: number
  questions: ExamQuestion[]
}

// ============================================================================
// Question Types
// ============================================================================

export type QuestionType = "multiple-choice" | "single-choice" | "essay" | "short-answer"

export interface ExamQuestion {
  id: string
  sectionId: string
  type: QuestionType
  text: string
  order: number
  marks: number
  options?: QuestionOption[]
  metadata?: {
    difficulty?: "easy" | "medium" | "hard"
    topic?: string
    tags?: string[]
  }
}

export interface QuestionOption {
  id: string
  label: string
  text: string
}

// ============================================================================
// Answer Types
// ============================================================================

export interface Answer {
  id: string
  questionId: string
  examId: string
  studentId: string
  answerText?: string
  selectedOptionIds?: string[]
  isFlagged?: boolean
  isDraft: boolean
  createdAt: string
  updatedAt: string
}

export interface SaveAnswerRequest {
  questionId: string
  answerText?: string
  selectedOptionIds?: string[]
  isDraft: boolean
}

export interface SaveAnswerResponse {
  answer: Answer
  saved: boolean
}

// ============================================================================
// Student Types
// ============================================================================

export interface Student {
  id: string
  name: string
  studentId: string
  email?: string
  profileImage?: string
}

export interface ExamProgress {
  examId: string
  studentId: string
  totalQuestions: number
  answeredQuestions: number
  flaggedQuestions: number
  unvisitedQuestions: number
  progress: number
  timeSpent: number // in seconds
  lastVisitedQuestionId?: string
  lastActivityAt: string
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface GetExamRequest {
  examId: string
}

export interface GetExamResponse {
  exam: Exam
}

export interface StartExamRequest {
  examId: string
  studentId: string
}

export interface StartExamResponse {
  exam: Exam
  progress: ExamProgress
}

export interface GetQuestionRequest {
  examId: string
  questionId: string
}

export interface GetQuestionResponse {
  question: ExamQuestion
}

export interface SubmitExamRequest {
  examId: string
  studentId: string
  answers: Answer[]
}

export interface SubmitExamResponse {
  success: boolean
  submissionId: string
  submittedAt: string
  message?: string
}

export interface GetProgressRequest {
  examId: string
  studentId: string
}

export interface GetProgressResponse {
  progress: ExamProgress
}

// ============================================================================
// Pagination Types
// ============================================================================

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface ApiConfig {
  baseUrl: string
  timeout?: number
  retries?: number
  auth?: AuthCredentials
  headers?: Record<string, string>
}

// ============================================================================
// Note Management Types
// ============================================================================

export type NoteSubject = 
  | "mathematics" 
  | "english" 
  | "science" 
  | "history" 
  | "computer-studies"
  | "physics"
  | "chemistry"
  | "biology"
  | "literature"
  | "geography"
  | "economics"
  | string

export type NoteClassGrade =
  | "grade-9"
  | "grade-10"
  | "grade-11"
  | "grade-12"
  | "jss1"
  | "jss2"
  | "jss3"
  | "ss1"
  | "ss2"
  | "ss3"
  | string

export type NoteTerm = "first-term" | "second-term" | "third-term"

export type NoteFileType = 
  | "pdf" 
  | "docx" 
  | "doc" 
  | "pptx" 
  | "ppt" 
  | "mp4" 
  | "mp3" 
  | "other"

export interface Note {
  id: string
  title: string
  description?: string
  subject: NoteSubject
  classGrade: NoteClassGrade
  term: NoteTerm
  week?: string
  topic?: string
  tags?: string[]
  fileType: NoteFileType
  fileSize: number // in bytes
  fileName: string
  fileUrl: string
  thumbnailUrl?: string
  uploadedBy: {
    id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
  downloadCount: number
  isActive: boolean
}

export interface CreateNoteRequest {
  title: string
  description?: string
  subject: NoteSubject
  classGrade: NoteClassGrade
  term: NoteTerm
  week?: string
  topic?: string
  tags?: string[]
  file: File
}

export interface CreateNoteResponse {
  note: Note
  message: string
}

export interface UpdateNoteRequest {
  title?: string
  description?: string
  subject?: NoteSubject
  classGrade?: NoteClassGrade
  term?: NoteTerm
  week?: string
  topic?: string
  tags?: string[]
  isActive?: boolean
}

export interface UpdateNoteResponse {
  note: Note
  message: string
}

export interface GetNotesFilters {
  subject?: NoteSubject
  classGrade?: NoteClassGrade
  term?: NoteTerm
  week?: string
  search?: string
  uploadedBy?: string
}

export interface GetNotesRequest {
  filters?: GetNotesFilters
  pagination?: PaginationParams
}

export interface GetNotesResponse {
  notes: Note[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface DownloadNoteResponse {
  downloadUrl: string
  fileName: string
  expiresAt: string
}

export interface DeleteNoteResponse {
  success: boolean
  message: string
}

// ============================================================================
// System Metrics & Monitoring Types (Technician)
// ============================================================================

export interface SystemMetrics {
  uptime: number // in seconds
  memoryUsage: {
    rss: number
    heapUsed: number
    heapTotal: number
    external: number
  }
  cpuUsage: {
    user: number
    system: number
    percent: number
  }
  activeConnections: number
  requestsPerMinute: number
  errorRate: number
  timestamp: string
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical'
  version: string
  nodeVersion: string
  platform: string
  arch: string
  uptime: number
  lastRestart: string
  checks: {
    database: 'healthy' | 'unhealthy'
    cache: 'healthy' | 'unhealthy'
    storage: 'healthy' | 'unhealthy'
    externalApis: 'healthy' | 'unhealthy'
  }
  timestamp: string
}

export interface SystemDiagnostics {
  performance: {
    avgResponseTime: number
    slowestEndpoints: Array<{
      endpoint: string
      avgTime: number
      calls: number
    }>
    memoryTrend: 'increasing' | 'stable' | 'decreasing'
  }
  errors: {
    total24h: number
    byType: Array<{
      type: string
      count: number
      lastOccurrence: string
    }>
  }
  database: {
    connections: {
      active: number
      idle: number
      max: number
    }
    queriesPerSecond: number
    slowQueries: number
  }
  timestamp: string
}

export interface SystemLog {
  id: string
  level: 'error' | 'warn' | 'info' | 'debug'
  message: string
  source: string
  timestamp: string
  metadata?: Record<string, unknown>
  stack?: string
}

export interface GetLogsFilters {
  level?: 'error' | 'warn' | 'info' | 'debug'
  source?: string
  from?: string
  to?: string
  search?: string
  limit?: number
  offset?: number
}

export interface GetLogsResponse {
  logs: SystemLog[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

// ============================================================================
// Bulk Question Management Types
// ============================================================================

export interface BulkQuestionUpload {
  questions: Array<{
    type: 'multiple-choice' | 'single-choice'
    text: string
    options: Array<{
      label: string
      text: string
      isCorrect?: boolean
    }>
    correctAnswer?: string
    explanation?: string
    marks?: number
    difficulty?: 'easy' | 'medium' | 'hard'
    topic?: string
    tags?: string[]
  }>
}

export interface BulkUploadResult {
  success: boolean
  totalQuestions: number
  successful: number
  failed: number
  errors: Array<{
    index: number
    question: string
    error: string
  }>
  questionIds: string[]
  message?: string
}

export interface BulkUploadResponse {
  result: BulkUploadResult
}

// ============================================================================
// Theory Marking Queue Types
// ============================================================================

export interface TheoryMarkingItem {
  id: string
  examId: string
  examTitle: string
  questionId: string
  questionText: string
  studentId: string
  studentName: string
  answerText: string
  wordCount: number
  submittedAt: string
  status: 'pending' | 'marked' | 'review-required'
  marks?: number
  maxMarks: number
  feedback?: string
  markedBy?: string
  markedAt?: string
}

export interface MarkingQueueFilters {
  examId?: string
  status?: 'pending' | 'marked' | 'review-required'
  sortBy?: 'submittedAt' | 'studentName' | 'examTitle'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export interface MarkingQueueResponse {
  items: TheoryMarkingItem[]
  pagination: {
    total: number
    pending: number
    marked: number
    reviewRequired: number
    limit: number
    offset: number
    hasMore: boolean
  }
  statistics: {
    avgMarkingTime: number // in minutes
    avgScore: number
    totalSubmissions: number
  }
}

export interface SubmitMarkRequest {
  marks: number
  feedback?: string
  requiresReview?: boolean
}

export interface SubmitMarkResponse {
  success: boolean
  markingId: string
  markedAt: string
  message?: string
}

// ============================================================================
// All Questions Response Type
// ============================================================================

export interface GetAllQuestionsResponse {
  examId: string
  examTitle: string
  totalQuestions: number
  sections: Array<{
    id: string
    name: string
    type: 'objectives' | 'theory'
    questions: ExamQuestion[]
  }>
}
