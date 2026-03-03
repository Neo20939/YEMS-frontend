# Exam Interface Components

Modular, editable Next.js components built with **shadcn/ui** and **Lucide Icons** for exam interfaces.

## 📦 Installation

### 1. Install dependencies

```bash
npm install lucide-react class-variance-authority clsx tailwind-merge @radix-ui/react-slot
```

### 2. Add to tailwind.config.js

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#137fec",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
      },
      fontFamily: {
        display: ["Lexend", "sans-serif"],
      },
    },
  },
  darkMode: "class",
}
```

### 3. Add font to layout.tsx

```tsx
import { Lexend } from "next/font/google"

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={lexend.variable}>
      <body className="font-display">{children}</body>
    </html>
  )
}
```

## 🧩 Components

### UI Components

| Component | Description |
|-----------|-------------|
| `Button` | Reusable button with variants (default, destructive, outline, secondary, ghost, amber, success) |

### Exam Components

| Component | Description |
|-----------|-------------|
| `ExamHeader` | Top navigation bar with exam info, timer, and user profile |
| `QuestionCard` | MCQ question card with options |
| `QuestionPalette` | Grid of question status indicators |
| `QuestionNavigation` | Previous/Save & Next/Flag buttons |
| `TextEditor` | Rich text editor for theory answers |
| `TheorySidebar` | Section navigator and question palette for theory exams |
| `StickyActionBar` | Fixed action bar for theory section |
| `ObjectiveExamLayout` | Complete layout for objective/MCQ exams |
| `TheoryExamLayout` | Complete layout for theory/descriptive exams |

## 📖 Usage Examples

### Objective (MCQ) Exam

```tsx
"use client"

import { ObjectiveExamLayout } from "@/components/exam"
import type { QuestionOption, QuestionPaletteItem } from "@/components/exam"

export default function ExamPage() {
  const options: QuestionOption[] = [
    { id: "a", label: "A", text: "Option A text" },
    { id: "b", label: "B", text: "Option B text" },
  ]

  const paletteQuestions: QuestionPaletteItem[] = [
    { number: 1, status: "answered" },
    { number: 2, status: "current" },
    { number: 3, status: "unvisited" },
  ]

  return (
    <ObjectiveExamLayout
      header={{
        title: "Mathematics - Midterm 2024",
        section: "Section A: MCQs",
        remainingTime: "01:42:15",
        studentName: "John Doe",
        studentId: "2024-1234",
      }}
      currentQuestion={2}
      totalQuestions={50}
      questionText="What is 2 + 2?"
      options={options}
      selectedOptionId="b"
      onOptionSelect={(id) => console.log("Selected:", id)}
      paletteQuestions={paletteQuestions}
      summary={{ answered: 1, flagged: 0, notAnswered: 0, unvisited: 48 }}
      onSaveAndNext={() => console.log("Save & Next")}
      onPrevious={() => console.log("Previous")}
      onFlag={() => console.log("Flag")}
      onPaletteQuestionClick={(num) => console.log("Jump to:", num)}
      onSubmitExam={() => console.log("Submit")}
    />
  )
}
```

### Theory Exam

```tsx
"use client"

import { TheoryExamLayout } from "@/components/exam"
import type { ExamSection, TheoryQuestion } from "@/components/exam"

export default function TheoryExamPage() {
  const sections: ExamSection[] = [
    {
      id: "section-a",
      name: "Section A: Objectives",
      type: "objectives",
      answeredCount: 20,
      totalCount: 20,
      progress: 100,
      status: "completed",
    },
    {
      id: "section-b",
      name: "Section B: Theory",
      type: "theory",
      answeredCount: 1,
      totalCount: 5,
      progress: 20,
      status: "in-progress",
    },
  ]

  const question: TheoryQuestion = {
    number: 1,
    text: "Explain synchronous vs asynchronous transmission.",
    marks: 10,
    suggestedWords: 250,
  }

  return (
    <TheoryExamLayout
      header={{
        title: "Computer Science - Final",
        remainingTime: "45:12 Remaining",
        studentName: "Jane Doe",
        studentId: "2021-5678",
      }}
      sections={sections}
      currentSectionId="section-b"
      currentQuestionNumber={1}
      totalQuestionsInSection={5}
      question={question}
      editorValue=""
      onEditorChange={(val) => console.log("Editor:", val)}
      onSectionChange={(id) => console.log("Section:", id)}
      onNext={() => console.log("Next")}
      onPrevious={() => console.log("Previous")}
      onClear={() => console.log("Clear")}
      onSaveDraft={() => console.log("Save draft")}
    />
  )
}
```

## 🎨 Customization

### Button Variants

```tsx
import { Button } from "@/components/ui/button"

<Button variant="default">Primary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="amber">Flag</Button>
<Button variant="success">Success</Button>
```

### Question Status Types

```tsx
type QuestionStatus = 
  | "answered"    // Green
  | "flagged"     // Amber
  | "not-answered" // Red
  | "unvisited"   // Gray
  | "current"     // Blue border
```

## 📁 File Structure

```
components/
├── ui/
│   ├── button.tsx
│   └── index.ts
├── exam/
│   ├── exam-header.tsx
│   ├── question-card.tsx
│   ├── question-palette.tsx
│   ├── question-navigation.tsx
│   ├── text-editor.tsx
│   ├── theory-sidebar.tsx
│   ├── sticky-action-bar.tsx
│   ├── objective-exam-layout.tsx
│   ├── theory-exam-layout.tsx
│   └── index.ts
lib/
└── utils.ts
examples/
├── objective-exam-example.tsx
└── theory-exam-example.tsx
```

## 🔧 Props Reference

See individual component files for full prop documentation. All components support:
- `className` - Additional CSS classes
- Dark mode via `dark:` classes
- Custom event handlers
