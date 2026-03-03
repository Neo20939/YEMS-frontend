# External API Integration Guide

This guide explains how to integrate the education exam components with an external API.

## Overview

The project now includes a flexible API client (`lib/api`) that provides:
- **Type-safe API calls** with TypeScript interfaces
- **Automatic retry logic** with exponential backoff
- **Request/Response interceptors** for custom logic
- **Authentication support** (API Key or Bearer Token)
- **Error handling** with detailed error responses

## Quick Start

### 1. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Then fill in your API credentials:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_API_KEY=your-api-key-here
```

### 2. Initialize the API Client

```typescript
import { createApiClient } from "@/lib/api"

const api = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000,
  retries: 3,
})
```

### 3. Use in Your Components

See `examples/with-external-api.tsx` for a complete example of integrating the API with the `ObjectiveExamLayout` component.

```typescript
import { createApiClient } from "@/lib/api"

const api = createApiClient()

// Start an exam
const result = await api.startExam({ examId: "exam-123", studentId: "student-456" })

if (result.success) {
  const { exam, progress } = result.data!
  // Use exam data in your component
}
```

## API Client Methods

| Method | Description |
|--------|-------------|
| `getExam(examId)` | Fetch exam details |
| `startExam({ examId, studentId })` | Start or resume an exam |
| `getQuestion(examId, questionId)` | Get a specific question |
| `saveAnswer(examId, payload)` | Save an answer (draft or final) |
| `submitExam({ examId, studentId, answers })` | Submit the complete exam |
| `getProgress(examId, studentId)` | Get exam progress |
| `healthCheck()` | Check API health |

## Types

All API types are defined in `lib/api/types.ts`:

- `Exam` - Exam structure with sections and questions
- `ExamQuestion` - Question with options and metadata
- `Answer` - Student answer structure
- `ExamProgress` - Progress tracking
- `ApiResponse<T>` - Standard API response wrapper
- `ApiError` - Error structure

## Request Interceptors

Add custom logic to all requests:

```typescript
api.addRequestInterceptor((request) => {
  // Add custom headers
  request.headers = {
    ...request.headers,
    "X-Custom-Header": "value",
  }
  return request
})
```

## Response Interceptors

Process all responses:

```typescript
api.addResponseInterceptor(async (response) => {
  // Log responses, handle errors, etc.
  console.log("API Response:", response.status)
  return response
})
```

## Error Handling

All API methods return an `ApiResponse<T>` with either `data` or `error`:

```typescript
const result = await api.getExam("exam-123")

if (result.success) {
  // Use result.data
} else {
  // Handle result.error
  console.error(result.error?.message)
}
```

## Authentication

### API Key (Default)

```typescript
const api = createApiClient({
  auth: { apiKey: "your-api-key" }
})
```

### Bearer Token

```typescript
api.setToken({
  accessToken: "jwt-token",
  expiresIn: 3600,
  tokenType: "Bearer",
})
```

## Example: Complete Exam Flow

```typescript
import { createApiClient } from "@/lib/api"

const api = createApiClient()

// 1. Start exam
const startResult = await api.startExam({ examId: "exam-123", studentId: "student-456" })

// 2. Get questions
for (const section of startResult.data!.exam.sections) {
  for (const question of section.questions) {
    const qResult = await api.getQuestion("exam-123", question.id)
    // Display question
  }
}

// 3. Save answers
await api.saveAnswer("exam-123", {
  questionId: "q-1",
  selectedOptionIds: ["option-a"],
  isDraft: false,
})

// 4. Submit exam
await api.submitExam({
  examId: "exam-123",
  studentId: "student-456",
  answers: [...],
})
```

## Testing

Test the API integration:

```bash
# Run the development server
npm run dev

# Visit the example page
http://localhost:3000/objective-exam
```

## Server-Side API Routes

You can also create Next.js API routes that proxy to the external API:

```typescript
// app/api/exams/[examId]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { createApiClient } from "@/lib/api"

const api = createApiClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { examId: string } }
) {
  const result = await api.getExam(params.examId)
  
  if (result.success) {
    return NextResponse.json(result.data)
  } else {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }
}
```

## Migration Notes

### Changes from Previous Version

- **Removed flag functionality**: The flag for review feature has been removed from all components
- **QuestionStatus type**: No longer includes `"flagged"` status
- **Summary object**: No longer includes `flagged` count
- **Components updated**:
  - `QuestionPalette` - Removed flag color and status
  - `QuestionNavigation` - Removed flag button
  - `StickyActionBar` - Removed flag button
  - `ObjectiveExamLayout` - Removed flag props
  - `TheorySidebar` - Removed flag icon from Report Issue button

## Support

For issues or questions, please refer to the main README or open an issue.
