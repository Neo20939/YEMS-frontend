# Education Platform

A modern, feature-rich education management system built with Next.js 16 and TypeScript. Provides a complete platform for students to access exams, assignments, notes, and live lessons.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?logo=tailwind-css)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)

## 🎯 Features

### Student Dashboard
- Centralized hub displaying exams, classes, notes, and deadlines
- Real-time school news and announcements
- Quick access cards for all platform features
- Time-based personalized greetings

### Exam System

#### Objective Exams (MCQ)
- Interactive question palette with status tracking (answered, unvisited, not-answered, current)
- Real-time timer with warning states
- Question navigation (Previous, Save & Next, Jump to question)
- Visual progress indicators
- Exam submission flow with confirmation

#### Theory Exams
- Rich text editor with formatting toolbar
- Word and character count tracking
- Auto-save functionality with status indicator
- Section navigation sidebar
- Question navigator for multi-section exams

### Additional Features
- **Live Lessons** - Interactive online session interface
- **Assignments** - View and submit assignments with deadline tracking
- **Notes Dashboard** - Access study materials and course notes

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16.1.6 |
| **Language** | TypeScript 5.3.0 |
| **Styling** | Tailwind CSS 3.4.1 |
| **UI Components** | shadcn/ui patterns, Radix UI Primitives |
| **Icons** | Lucide React |
| **Package Manager** | Bun |
| **Font** | Raleway (Google Fonts) |

## 📁 Project Structure

```
education/
├── app/                          # Next.js App Router pages
│   ├── dashboard/                # Student dashboard
│   ├── objective-exam/           # MCQ exam interface
│   ├── theory-exam/              # Theory exam interface
│   ├── live-lessons/             # Live lessons page
│   ├── assignments/              # Assignments page
│   ├── notes/                    # Notes dashboard
│   └── exams/                    # Exam listing pages
│
├── components/
│   ├── exam/                     # Exam-specific components
│   │   ├── exam-header.tsx
│   │   ├── question-card.tsx
│   │   ├── question-palette.tsx
│   │   ├── text-editor.tsx
│   │   ├── theory-sidebar.tsx
│   │   └── ...
│   ├── layout/                   # Dashboard layout components
│   │   ├── Sidebar.tsx
│   │   ├── DashboardHeader.tsx
│   │   ├── DashboardHero.tsx
│   │   └── ...
│   └── ui/                       # Base UI components
│
├── lib/
│   └── api/                      # API client with retry logic
│
├── public/                       # Static assets
└── examples/                     # Example implementations
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Neo20939/education.git
cd education
```

2. Install dependencies:
```bash
bun install
```

3. Copy the environment example file:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📱 Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Home page with feature links |
| `/dashboard` | Student dashboard |
| `/objective-exam` | MCQ exam demo |
| `/theory-exam` | Theory exam demo |
| `/live-lessons` | Live lessons |
| `/assignments` | Assignments |
| `/notes` | Notes dashboard |
| `/exams` | Exam listing |

## 🎨 Design System

### Color Palette
- **Primary**: Rose/Pink (`#E11D48`)
- **Success**: Green shades
- **Destructive**: Red for danger actions
- **Dark Mode**: Full dark theme support

### Typography
- **Font Family**: Raleway (via Google Fonts)
- **CSS Variables**: Custom font configuration

### Component Styling
- Tailwind-first utility classes
- `cn()` utility for conditional class merging
- Consistent border radius scale (12px - 32px)

## 🔌 API Integration

The platform includes a robust API client (`lib/api/client.ts`) with:

- **Retry Logic**: Exponential backoff for failed requests
- **Authentication**: Support for API Key and Bearer token
- **Interceptors**: Request/response customization
- **Type Safety**: Full TypeScript interfaces for API responses

See [API_INTEGRATION.md](./API_INTEGRATION.md) for detailed usage.

## 📦 Key Components

### Exam Components
- `ObjectiveExamLayout` - Complete MCQ exam wrapper
- `TheoryExamLayout` - Complete theory exam wrapper
- `QuestionCard` - MCQ display with options
- `QuestionPalette` - Status-tracked question grid
- `TextEditor` - Rich text editor with auto-save
- `ExamHeader` - Sticky header with timer

### Layout Components
- `Sidebar` - Collapsible navigation
- `DashboardHero` - Welcome banner
- `DashboardCards` - Feature access cards
- `DeadlinesPanel` - Assignment tracker
- `SchoolNews` - Announcements panel

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

For issues and questions, please open an issue on the GitHub repository.
