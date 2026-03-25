# API Endpoints Reference

Base URL: `https://kennedi-ungnostic-unconvulsively.ngrok-free.dev`

## Health & Monitoring
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Service health check |
| GET | `/status/metrics` | Status metrics |
| GET | `/metrics` | Application metrics |
| GET | `/admin/health` | Admin health check |
| GET | `/technician/system/health` | System health (Technician) |
| GET | `/technician/system/diagnostics` | System diagnostics |
| GET | `/technician/system/logs` | System logs |
| GET | `/technician/rbac/policies` | RBAC policies |

## Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login with email/password |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/auth/me` | Get current user info |

## Admin Panel Operations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/users` | Create user (email, name, password, role) |
| GET | `/admin/users` | List all users |
| GET | `/admin/users/{id}` | Get user by ID |
| DELETE | `/admin/users/{id}` | Delete user by ID |
| PATCH | `/admin/users/{id}/role` | Update user role |
| POST | `/admin/subjects` | **Create subject** (name, code, description, iconType) |
| GET | `/admin/subjects` | **List all subjects** |
| GET | `/admin/subjects/{id}` | Get subject by ID |
| PUT | `/admin/subjects/{id}` | Update subject |
| DELETE | `/admin/subjects/{id}` | Delete subject |

## Exam Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/exams/` | List all exams |
| POST | `/exams` | **Create a new exam** |
| GET | `/exams/type/{type}` | Get exams by type |
| GET | `/exams/{id}` | Get exam by ID |
| POST | `/exams/start` | Start an exam (examId, studentId) |
| POST | `/exams/submit` | Submit exam answers |
| GET | `/exams/{id}/progress/{studentId}` | Get student exam progress |

## Question Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/exams/{id}/questions` | Get all questions for an exam |
| POST | `/exams/{id}/questions` | Create question |
| GET | `/exams/{id}/questions/{questionId}` | Get specific question |
| PUT | `/exams/{id}/questions/{questionId}` | Update question |
| DELETE | `/exams/{id}/questions/{questionId}` | Delete question |
| POST | `/exams/{id}/questions/objective/bulk` | Bulk create objective questions |
| POST | `/exams/{id}/questions/theory/upload` | Bulk create theory questions |
| GET | `/exams/{id}/questions/theory/marking-queue` | Get theory marking queue |

## Answer Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/exams/{id}/answers` | Submit/save answer |

## Role-Based Access
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/teacher/exams` | Teacher exam access |
| GET | `/student/exams` | Student exam access |
