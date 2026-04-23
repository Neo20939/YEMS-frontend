// Class/Course Management Types
// Based on api.md Section 5.4 (Classes) response shape and request bodies

export type ClassLevel = 'JSS1' | 'JSS2' | 'JSS3' | 'SS1' | 'SS2' | 'SS3';
export type ClassStream = 'Science' | 'Arts' | 'Commercial';
export type ClassStatus = 'active' | 'archived';

// Backend response shape for a class
// Primary fields (new API shape per api.md):
//   name, classLevelId, classLevelName, departmentId, departmentName,
//   academicYearId, academicYearName, capacity, isActive, schoolId, createdAt, updatedAt
// Legacy/alternative fields that may also appear: class_name, max_capacity, level, stream, academic_year, status
export interface Class {
  id: string;
  name?: string;                    // Preferred: display label (from name or arm+level+dept)
  class_name?: string;              // Fallback for old backend responses
  classLevelId?: string;
  classLevelName?: string;
  departmentId?: string | null;
  departmentName?: string | null;
  academicYearId?: string;
  academicYearName?: string;
  capacity?: number | null;         // Preferred capacity field
  max_capacity?: number;            // Legacy capacity field
  isActive?: boolean;
  status?: 'active' | 'archived';   // Legacy status field
  schoolId?: string;
  createdAt?: string;
  updatedAt?: string;
  // Optional enrichment
  form_teacher_id?: string | null;
  form_teacher_name?: string | null;
  // Counts
  enrolled_count?: number;
  student_count?: number;
  // Legacy/aliases used by older frontend code
  level?: string;
  stream?: string;
  academic_year?: string;
}

// Helper to get standardized values from Class object
export function getClassName(classObj: Class): string {
  return classObj.name || classObj.class_name || '';
}

export function getClassCapacity(classObj: Class): number | undefined {
  return classObj.capacity ?? classObj.max_capacity;
}

export function getEnrolledCount(classObj: Class): number {
  return classObj.enrolled_count || classObj.student_count || 0;
}

export function getClassLevelName(classObj: Class): string {
  return classObj.classLevelName || classObj.level || classObj.class_level || '';
}

export function getAcademicYearName(classObj: Class): string {
  return classObj.academicYearName || classObj.academic_year || '';
}

export function isClassActive(classObj: Class): boolean {
  return classObj.isActive ?? (classObj.status === 'active');
}

export interface ClassFilters {
  search?: string;
  level?: ClassLevel;
  stream?: ClassStream;
  status?: ClassStatus;
  academic_year?: string;
  form_teacher_id?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ClassPagination {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ClassListResponse {
  success: boolean;
  data: Class[];
  pagination?: ClassPagination;
}

// Request body for POST /api/academic/classes (create)
// api.md: "Send classLevelId and academicYearId. Send departmentId only when selected level requires it.
// Choose ONE naming strategy: name (custom) OR arm (generated). Optionally send capacity."
export interface ClassCreateInput {
  classLevelId: string;            // Required: reference to class_levels table
  academicYearId: string;          // Required: reference to academic_years table
  name?: string;                   // Optional: custom human-readable label (e.g., "JS1 Gold")
  arm?: string;                    // Optional: generated suffix (e.g., "A", "Science A") — produces "JS1A", "SS1 Science A"
  departmentId?: string;           // Optional: required for SS levels, rejected for JS levels
  capacity?: number | null;        // Optional: max seats. null/omit = unlimited
  // Note: isActive defaults to true; schoolId copied from academic year
}

// Request body for PATCH /api/academic/classes/:id (update)
// api.md: "name wins over arm if both are sent. departmentId required for SS, rejected for JS."
export interface ClassUpdateInput {
  name?: string;                   // Optional: update display label
  arm?: string;                    // Optional: update arm suffix
  classLevelId?: string;           // Optional: change level (may require department adjustment)
  departmentId?: string | null;    // Optional: set/clear department. SS requires it, JS rejects it
  capacity?: number | null;        // Optional: update max seats
  isActive?: boolean;              // Optional: activate/archive class
  // academicYearId is NOT updable — class is tied to a single academic year
}

// Subject Management
export interface ClassSubject {
  id: string;
  class_id: string;
  subject_id: string;
  subject_name: string;
  teacher_id: string;
  teacher_name: string;
  credit_hours?: number;
  pass_mark?: number;
  is_compulsory: boolean;
  created_at: string;
}

export interface ClassSubjectInput {
  subject_id: string;
  teacher_id: string;
  credit_hours?: number;
  pass_mark?: number;
  is_compulsory?: boolean;
}

// Timetable
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface TimetableSlot {
  id: string;
  class_id: string;
  day_of_week: DayOfWeek;
  start_time: string;              // HH:MM format
  end_time: string;                // HH:MM format
  subject_id: string;
  subject_name: string;
  teacher_id: string;
  teacher_name: string;
  room?: string;
  created_at: string;
}

export interface TimetableSlotInput {
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
  subject_id: string;
  teacher_id: string;
  room?: string;
}

export interface TimetableConflict {
  type: 'teacher_conflict' | 'room_conflict' | 'time_overlap';
  slot1: TimetableSlot;
  slot2: TimetableSlot;
  message: string;
}

export interface TimetableValidationResponse {
  success: boolean;
  has_conflicts: boolean;
  conflicts: TimetableConflict[];
}

// Enrollment
export interface StudentEnrollment {
  id: string;
  class_id: string;
  student_id: string;
  student_name: string;
  student_admission_no?: string;
  enrollment_date: string;
  status: 'active' | 'transferred' | 'dropped';
  enrolled_by?: string;
  created_at: string;
}

export interface EnrollmentInput {
  // Per api.md Section 5.4 - Student enrollment requires:
  classId: string;
  termId: string;
  academicYearId?: string;
  enrollment_date?: string;
  // Note: student_id is in URL path, not body
}

export interface BulkEnrollmentResult {
  success: boolean;
  enrolled: number;
  failed: number;
  errors: Array<{
    student_id: string;
    error: string;
  }>;
}

// Class Details (combined response)
export interface ClassDetails {
  class: Class;
  students: StudentEnrollment[];
  subjects: ClassSubject[];
  timetable: TimetableSlot[];
}

// Activity History
export interface ClassActivity {
  id: string;
  class_id: string;
  action: string;
  changed_by: string;
  changed_by_name: string;
  details: string;
  created_at: string;
}

// Academic Year
export interface AcademicYear {
  id: string;
  name: string;                    // e.g., "2024/2025"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  schoolId?: string;
  createdAt: string;
  updatedAt: string;
}

// Class Level (lookup)
export interface ClassLevel {
  id: string;
  name: string;                    // e.g., "JSS1", "SS2"
  description?: string;
  order: number;
  is_active: boolean;
}

// Department (lookup)
export interface Department {
  id: string;
  name: string;                    // e.g., "Science", "Arts"
  code: string;                    // e.g., "SCI", "ARTS"
  description?: string;
  is_active: boolean;
}
