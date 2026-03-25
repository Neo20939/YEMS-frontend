# Notes Management API Integration

This document explains the notes management system for both teachers (upload/create) and students (download/view).

## Overview

The notes management system allows:
- **Teachers**: Upload, manage, and delete study materials (notes)
- **Students**: View, search, filter, and download notes for their classes

## Backend API Endpoints Required

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/notes/upload` | Upload a new note (multipart/form-data) | Teacher only |
| `GET` | `/api/notes` | List notes with filters | All authenticated |
| `GET` | `/api/notes/:id/download` | Get download URL for a note | All authenticated |
| `PUT` | `/api/notes/:id` | Update note metadata | Teacher (owner) |
| `DELETE` | `/api/notes/:id` | Delete a note | Teacher (owner) |
| `GET` | `/api/notes/subjects` | Get available subjects | Optional |
| `GET` | `/api/notes/class-grades` | Get available class grades | Optional |

## File Structure

```
education/
├── lib/api/
│   ├── types.ts                    # Note-related types added
│   ├── notes-client.ts             # Notes API client (NEW)
│   └── index.ts                    # Updated exports
│
├── components/
│   ├── ui/
│   │   ├── FileUploadZone.tsx      # Drag-and-drop upload (NEW)
│   │   ├── UploadProgress.tsx      # Upload progress UI (NEW)
│   │   └── Toast.tsx               # Notification toasts (NEW)
│   └── NotesDashboard.tsx          # Updated with loading states
│
└── app/
    ├── teachers/
    │   └── notes/upload/
    │       └── page.tsx            # Teacher upload page (UPDATED)
    └── notes/
        └── page.tsx                # Student notes page (UPDATED)
```

## Types

### Core Note Type

```typescript
interface Note {
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
  fileSize: number
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
```

### Request/Response Types

- `CreateNoteRequest` - Upload note with file and metadata
- `CreateNoteResponse` - Response with created note
- `UpdateNoteRequest` - Update note metadata
- `UpdateNoteResponse` - Response with updated note
- `GetNotesFilters` - Filter options for listing notes
- `GetNotesResponse` - Paginated list of notes
- `DownloadNoteResponse` - Download URL response
- `DeleteNoteResponse` - Delete confirmation

## API Client Usage

### Upload a Note

```typescript
import { uploadNote } from "@/lib/api/notes-client"

const payload: CreateNoteRequest = {
  title: "Introduction to Algebra",
  description: "Basic algebra concepts",
  subject: "mathematics",
  classGrade: "grade-10",
  term: "first-term",
  week: "01",
  topic: "Algebra Basics",
  tags: ["basics", "intro"],
  file: selectedFile, // HTML File object
}

const result = await uploadNote(payload, (progress) => {
  console.log(`Upload progress: ${progress}%`)
})

if (result.success) {
  console.log("Note uploaded:", result.data.note)
} else {
  console.error("Upload failed:", result.error)
}
```

### Get Notes with Filters

```typescript
import { getNotes } from "@/lib/api/notes-client"

const result = await getNotes(
  {
    subject: "mathematics",
    classGrade: "grade-10",
    term: "first-term",
    search: "algebra",
  },
  {
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  }
)

if (result.success) {
  console.log("Notes:", result.data.notes)
  console.log("Pagination:", result.data.pagination)
}
```

### Download a Note

```typescript
import { triggerFileDownload } from "@/lib/api/notes-client"

const result = await triggerFileDownload(noteId, fileName)

if (result.success) {
  console.log("Download started")
} else {
  console.error("Download failed:", result.error)
}
```

### Delete a Note

```typescript
import { deleteNote } from "@/lib/api/notes-client"

const result = await deleteNote(noteId)

if (result.success) {
  console.log("Note deleted")
} else {
  console.error("Delete failed:", result.error)
}
```

## Component Usage

### FileUploadZone Component

```tsx
import { FileUploadZone } from "@/components/ui"

<FileUploadZone
  file={selectedFile}
  onFileSelect={(file) => setSelectedFile(file)}
  onFileClear={() => setSelectedFile(null)}
  acceptedFileTypes={[
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "video/mp4",
  ]}
  maxFileSize={50} // MB
  disabled={isUploading}
/>
```

### UploadProgress Component

```tsx
import { UploadProgress } from "@/components/ui"

<UploadProgress
  progress={uploadProgress}
  status={uploadStatus} // "uploading" | "success" | "error"
  fileName={selectedFile.name}
  fileSize={selectedFile.size}
  errorMessage={errorMessage}
  onCancel={() => setUploadStatus("idle")}
/>
```

### Toast Notifications

```tsx
import { useToast, ToastContainer } from "@/components/ui"

export default function MyComponent() {
  const { toasts, toast, removeToast } = useToast()

  return (
    <>
      {/* Your content */}
      <button onClick={() => toast.success("Upload successful!")}>
        Upload
      </button>
      
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  )
}
```

## Teacher Upload Page Features

### Form Fields
- **File Upload** (required) - Drag-and-drop or click to upload
- **Note Title** (required) - Name of the note
- **Subject** (required) - Dropdown from API
- **Class/Grade** (required) - Dropdown from API
- **Term** - First, Second, or Third Term
- **Week** - Week number (e.g., "01", "02")
- **Topic** - Specific topic name
- **Tags** - Comma-separated tags
- **Description** - Brief description

### Features
- ✅ File type validation (PDF, DOCX, PPTX, MP4, etc.)
- ✅ File size validation (max 50MB)
- ✅ Upload progress tracking
- ✅ Drag-and-drop file upload
- ✅ Form validation
- ✅ Success/error notifications
- ✅ List of uploaded notes with filters
- ✅ Search functionality
- ✅ Delete notes
- ✅ Download notes

### Filters for Notes List
- Search by title/description
- Filter by subject
- Filter by class/grade

## Student Notes Page Features

### Display Features
- ✅ Notes table with subject icons
- ✅ Search functionality
- ✅ Term filter (First, Second, Third)
- ✅ Loading skeleton states
- ✅ Empty state when no notes
- ✅ Download button for each note
- ✅ Pagination support

### Note Information Displayed
- Subject with icon
- Week number
- Title and description
- Term badge
- Upload date
- Download action

## Supported File Types

| Type | MIME Type | Extension |
|------|-----------|-----------|
| PDF | `application/pdf` | .pdf |
| Word | `application/msword` | .doc |
| Word (Modern) | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | .docx |
| PowerPoint | `application/vnd.ms-powerpoint` | .ppt |
| PowerPoint (Modern) | `application/vnd.openxmlformats-officedocument.presentationml.presentation` | .pptx |
| Video | `video/mp4` | .mp4 |
| Audio | `audio/mpeg` | .mp3 |

## Environment Variables

Add to `.env.local`:

```env
# API Base URL (already configured)
NEXT_PUBLIC_API_BASE_URL=https://your-api.ngrok-free.dev

# Authentication (handled automatically via auth context)
```

## Authentication

The notes API client automatically handles authentication:
- Retrieves token from `localStorage` (`auth_data`)
- Adds `Authorization: Bearer <token>` header to requests
- Handles token expiration gracefully

## Error Handling

All API methods return a standardized response:

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, string[]>
  }
  timestamp: string
}
```

Always check `result.success` before using `result.data`.

## Backend Implementation Notes

### Expected Request Format (Upload)

```http
POST /api/notes/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

file: <binary>
title: "Introduction to Algebra"
description: "Basic concepts"
subject: "mathematics"
classGrade: "grade-10"
term: "first-term"
week: "01"
topic: "Algebra Basics"
tags: '["basics", "intro"]'
```

### Expected Response Format

```json
{
  "success": true,
  "data": {
    "note": {
      "id": "note-123",
      "title": "Introduction to Algebra",
      "subject": "mathematics",
      "classGrade": "grade-10",
      "term": "first-term",
      "fileUrl": "https://storage.example.com/notes/note-123.pdf",
      "fileName": "algebra-intro.pdf",
      "fileSize": 1048576,
      "uploadedBy": {
        "id": "teacher-456",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2026-01-15T10:30:00Z"
    },
    "message": "Note uploaded successfully"
  }
}
```

## Testing Checklist

### Teacher Upload
- [ ] Upload PDF file
- [ ] Upload DOCX file
- [ ] Upload PPTX file
- [ ] Upload MP4 video
- [ ] Drag-and-drop file
- [ ] File size validation (>50MB rejected)
- [ ] File type validation (invalid types rejected)
- [ ] Form validation (required fields)
- [ ] Upload progress display
- [ ] Success notification
- [ ] Error notification
- [ ] Note appears in list
- [ ] Delete note functionality
- [ ] Search notes
- [ ] Filter by subject
- [ ] Filter by class

### Student Download
- [ ] View notes list
- [ ] Loading skeleton displays
- [ ] Empty state displays
- [ ] Search notes
- [ ] Filter by term
- [ ] Download note (PDF)
- [ ] Download note (video)
- [ ] Download error handling

## Troubleshooting

### "Failed to upload note"
- Check file size is under 50MB
- Verify file type is supported
- Ensure authentication token is valid
- Check backend API is running

### "Failed to download note"
- Verify note exists and is active
- Check authentication token
- Ensure download URL is accessible

### "No notes available"
- Upload notes from teacher account
- Check term filter matches uploaded notes
- Verify API is returning data

## Future Enhancements

- [ ] Note preview before download
- [ ] Thumbnail generation for uploads
- [ ] Note categories/topics hierarchy
- [ ] Student note ratings/feedback
- [ ] Note sharing between teachers
- [ ] Bulk upload functionality
- [ ] Note versioning
- [ ] Analytics (download counts, popular notes)
