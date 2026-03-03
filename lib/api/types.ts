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
