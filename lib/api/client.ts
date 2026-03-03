/**
 * External API Client
 * 
 * A flexible API client for connecting to external exam services.
 * Supports authentication, error handling, retries, and request/response interception.
 */

import type {
  ApiResponse,
  ApiError,
  ApiConfig,
  AuthToken,
  GetExamResponse,
  StartExamRequest,
  StartExamResponse,
  GetQuestionResponse,
  SaveAnswerRequest,
  SaveAnswerResponse,
  SubmitExamRequest,
  SubmitExamResponse,
  GetProgressResponse,
  Exam,
  ExamProgress,
} from "./types"

export class ApiClient {
  private config: Required<ApiConfig>
  private token: AuthToken | null = null
  private requestInterceptors: Array<(request: RequestInit) => RequestInit | Promise<RequestInit>> = []
  private responseInterceptors: Array<(response: Response) => Response | Promise<Response>> = []

  constructor(config: ApiConfig) {
    this.config = {
      baseUrl: config.baseUrl.replace(/\/$/, ""),
      timeout: config.timeout ?? 30000,
      retries: config.retries ?? 3,
      auth: config.auth ?? { apiKey: "" },
      headers: config.headers ?? {},
    }
  }

  // ============================================================================
  // Interceptor Methods
  // ============================================================================

  addRequestInterceptor(
    interceptor: (request: RequestInit) => RequestInit | Promise<RequestInit>
  ): void {
    this.requestInterceptors.push(interceptor)
  }

  addResponseInterceptor(
    interceptor: (response: Response) => Response | Promise<Response>
  ): void {
    this.responseInterceptors.push(interceptor)
  }

  // ============================================================================
  // Authentication Methods
  // ============================================================================

  setToken(token: AuthToken): void {
    this.token = token
  }

  clearToken(): void {
    this.token = null
  }

  isAuthenticated(): boolean {
    return !!this.config.auth.apiKey || !!this.token
  }

  // ============================================================================
  // Core Request Methods
  // ============================================================================

  private async applyRequestInterceptors(request: RequestInit): Promise<RequestInit> {
    let modifiedRequest = request
    for (const interceptor of this.requestInterceptors) {
      modifiedRequest = await interceptor(modifiedRequest)
    }
    return modifiedRequest
  }

  private async applyResponseInterceptors(response: Response): Promise<Response> {
    let modifiedResponse = response
    for (const interceptor of this.responseInterceptors) {
      modifiedResponse = await interceptor(modifiedResponse)
    }
    return modifiedResponse
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${endpoint}`

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...this.config.headers,
    }

    if (this.token?.accessToken) {
      headers.Authorization = `${this.token.tokenType} ${this.token.accessToken}`
    } else if (this.config.auth.apiKey) {
      headers["X-API-Key"] = this.config.auth.apiKey
    }

    let request: RequestInit = {
      ...options,
      headers,
      signal: AbortSignal.timeout(this.config.timeout),
    }

    request = await this.applyRequestInterceptors(request)

    let lastError: Error | null = null
    let attempts = 0

    while (attempts < this.config.retries) {
      try {
        const response = await fetch(url, request)
        const processedResponse = await this.applyResponseInterceptors(response)

        if (!processedResponse.ok) {
          const errorData = await processedResponse.json().catch(() => ({}))
          throw new ApiClientError(
            errorData.message || `HTTP ${processedResponse.status}`,
            processedResponse.status,
            errorData
          )
        }

        const data = await processedResponse.json()
        return { success: true, data, timestamp: new Date().toISOString() }
      } catch (error) {
        lastError = error as Error
        attempts++
        if (attempts < this.config.retries) {
          await this.delay(Math.pow(2, attempts) * 100)
        }
      }
    }

    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: lastError?.message || "Unknown error occurred",
      },
      timestamp: new Date().toISOString(),
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // ============================================================================
  // Exam API Methods
  // ============================================================================

  async getExam(examId: string): Promise<ApiResponse<GetExamResponse>> {
    return this.request<GetExamResponse>(`/exams/${examId}`)
  }

  async startExam(payload: StartExamRequest): Promise<ApiResponse<StartExamResponse>> {
    return this.request<StartExamResponse>("/exams/start", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async getQuestion(
    examId: string,
    questionId: string
  ): Promise<ApiResponse<GetQuestionResponse>> {
    return this.request<GetQuestionResponse>(`/exams/${examId}/questions/${questionId}`)
  }

  async saveAnswer(
    examId: string,
    payload: SaveAnswerRequest
  ): Promise<ApiResponse<SaveAnswerResponse>> {
    return this.request<SaveAnswerResponse>(`/exams/${examId}/answers`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async submitExam(
    payload: SubmitExamRequest
  ): Promise<ApiResponse<SubmitExamResponse>> {
    return this.request<SubmitExamResponse>("/exams/submit", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async getProgress(
    examId: string,
    studentId: string
  ): Promise<ApiResponse<GetProgressResponse>> {
    return this.request<GetProgressResponse>(`/exams/${examId}/progress/${studentId}`)
  }

  // ============================================================================
  // Health Check
  // ============================================================================

  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.request(`/health`)
  }
}

// ============================================================================
// Custom Error Class
// ============================================================================

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = "ApiClientError"
  }
}

// ============================================================================
// Default Export - Pre-configured Client
// ============================================================================

export const createApiClient = (config?: Partial<ApiConfig>): ApiClient => {
  return new ApiClient({
    baseUrl: config?.baseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api",
    timeout: config?.timeout,
    retries: config?.retries,
    auth: config?.auth?.apiKey
      ? { apiKey: config.auth.apiKey }
      : { apiKey: process.env.NEXT_PUBLIC_API_KEY ?? "" },
    headers: config?.headers,
  })
}

export default ApiClient
