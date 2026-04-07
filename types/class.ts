// Class/Course Management Types

export type ClassLevel = 'JSS1' | 'JSS2' | 'JSS3' | 'SS1' | 'SS2' | 'SS3';
export type ClassStream = 'Science' | 'Arts' | 'Commercial';
export type ClassStatus = 'active' | 'archived';

export interface Class {
  id: string;
  class_name: string;
  class_code: string;
  level: ClassLevel;
  stream: ClassStream;
  academic_year: string;
  max_capacity: number;
  form_teacher_id?: string;
  form_teacher_name?: string;
  status: ClassStatus;
  enrolled_count?: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
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
  pagination: ClassPagination;
}

export interface ClassCreateInput {
  class_name: string;
  level: ClassLevel;
  stream: ClassStream;
  academic_year: string;
  max_capacity: number;
  form_teacher_id: string;
}

export interface ClassUpdateInput {
  class_name?: string;
  level?: ClassLevel;
  stream?: ClassStream;
  max_capacity?: number;
  form_teacher_id?: string;
  status?: ClassStatus;
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
  is_compulsory: boolean;
}

// Timetable
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface TimetableSlot {
  id: string;
  class_id: string;
  day_of_week: DayOfWeek;
  start_time: string;
  end_time: string;
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
  student_id: string;
  enrollment_date: string;
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
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  schoolId?: string;
  createdAt: string;
  updatedAt: string;
}
