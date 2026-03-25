# Teacher Exam Setup Guide

## Teacher Login Credentials

**Test Teacher Account:**
- **Email:** `teacher@yems.local`
- **Password:** `TeacherPass123!`

## Creating an Exam

### Step 1: Login
1. Go to `/login`
2. Enter the teacher credentials above
3. You'll be redirected to the teacher dashboard

### Step 2: Create New Exam
1. Navigate to **Teachers → Create Exam** (`/teachers/exams/create`)
2. Fill in the exam details:
   - **Exam Title** (required) - e.g., "Mathematics Midterm Exam"
   - **Description** - What the exam covers
   - **Exam Type**: Objective, Theory, or Mixed
   - **Duration** - Time limit in minutes
   - **Total Marks** - Maximum score
   - **Passing Score** - Minimum percentage required
   - **Subject** - e.g., "Mathematics"
   - **Icon** - Visual identifier for the exam
   - **Instructions** - Special instructions for students

3. Click **Create Exam**

### Step 3: Add Questions
1. After creating the exam, you'll be redirected to **Add Questions** (`/teachers/exams/setup`)
2. Select the exam you just created from the dropdown
3. Fill in question details:
   - **Question Type**: Multiple Choice, Single Choice, Essay, or Short Answer
   - **Question Text** - The actual question
   - **Options** (for MCQs) - Answer choices with correct answer marked
   - **Marks** - Points for this question
   - **Order** - Question number/sequence
   - **Difficulty** - Easy, Medium, or Hard
   - **Topic** - Subject area
   - **Tags** - Comma-separated tags for categorization

4. Click **Create Question**

## API Endpoints Used

### Create Exam
```
POST /exams
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "type": "objective|theory|mixed",
  "duration": number,
  "totalMarks": number,
  "subject": "string",
  "iconType": "math|science|english|philosophy|history|computer",
  "passingScore": number,
  "instructions": "string"
}
```

### Get Teacher Exams
```
GET /teacher/exams
Authorization: Bearer {token}
```

### Create Question
```
POST /exams/{examId}/questions
Authorization: Bearer {token}
Content-Type: application/json

{
  "sectionId": "string",
  "type": "multiple-choice|single-choice|essay|short-answer",
  "text": "string",
  "order": number,
  "marks": number,
  "options": [
    { "id": "string", "label": "string", "text": "string" }
  ],
  "metadata": {
    "difficulty": "easy|medium|hard",
    "topic": "string",
    "tags": ["string"]
  }
}
```

## Navigation

- **Create Exam**: `/teachers/exams/create`
- **Add Questions**: `/teachers/exams/setup`
- **Teacher Dashboard**: `/teachers`

## Files Modified/Created

### Created:
- `app/teachers/exams/create/page.tsx` - Exam creation form
- `app/admin/subjects/page.tsx` - Subject management (admin)

### Modified:
- `lib/api/exam-client.ts` - Added `createExam()` function
- `lib/api/admin-client.ts` - Added subject management functions
- `components/teachers/TeacherSidebar.tsx` - Updated navigation

## Troubleshooting

### "No exams in dropdown"
- Make sure you're logged in as a teacher
- Check if exams exist in the backend
- The page uses `/teacher/exams` endpoint to fetch your exams

### "Authentication failed"
- Verify credentials: `teacher@yems.local` / `TeacherPass123!`
- Check if the API server is running
- Ensure `.env.local` has correct `NEXT_PUBLIC_API_BASE_URL`

### "Failed to create exam"
- Check browser console for error messages
- Verify API endpoint `/exams` is available on the backend
- Ensure you have a valid auth token
