import { axios } from '@/lib/axios-shim';
import type {
  Class,
  ClassFilters,
  ClassListResponse,
  ClassCreateInput,
  ClassUpdateInput,
  ClassDetails,
  ClassSubject,
  ClassSubjectInput,
  TimetableSlot,
  TimetableSlotInput,
  TimetableValidationResponse,
  StudentEnrollment,
  EnrollmentInput,
  BulkEnrollmentResult,
  ClassActivity,
  AcademicYear,
  ClassLevel as LevelType,
} from '@/types/class';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev';

// Helper to handle API errors
class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

async function handleResponse<T>(response: any): Promise<T> {
  if (!response.data.success) {
    throw new ApiError(400, 'API request failed');
  }
  return response.data.data;
}

// Get auth token from storage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  const authData = localStorage.getItem('auth_data');
  if (authData) {
    try {
      const parsed = JSON.parse(authData);
      return parsed.accessToken || null;
    } catch {
      return null;
    }
  }
  return null;
}

// Create axios instance with auth interceptor
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Classes API - Updated to match backend /api/academic/* endpoints
export const classService = {
  // Get all classes with filters and pagination
  async getClasses(
    filters: ClassFilters & { page?: number; limit?: number; sort?: string; order?: 'asc' | 'desc' }
  ): Promise<ClassListResponse> {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.level) params.append('level', filters.level);
    if (filters.stream) params.append('stream', filters.stream);
    if (filters.status) params.append('status', filters.status);
    if (filters.academic_year) params.append('academicYearId', filters.academic_year);
    if (filters.form_teacher_id) params.append('formTeacherId', filters.form_teacher_id);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.order) params.append('order', filters.order);

    const response = await apiClient.get(`api/academic/classes`, { params });
    return handleResponse(response);
  },

  // Get single class by ID
  async getClassById(classId: string): Promise<Class> {
    const response = await apiClient.get(`api/academic/classes/${classId}`);
    return handleResponse(response);
  },

  // Create new class
  async createClass(input: ClassCreateInput & { classLevelId: string; academicYearId: string }): Promise<Class> {
    const response = await apiClient.post(`api/academic/classes`, input);
    return handleResponse(response);
  },

  // Update class
  async updateClass(
    classId: string,
    input: ClassUpdateInput
  ): Promise<Class> {
    const response = await apiClient.put(`api/academic/classes/${classId}`, input);
    return handleResponse(response);
  },

  // Delete class
  async deleteClass(classId: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`api/academic/classes/${classId}`);
    return handleResponse(response);
  },

  // Get class details (includes students, subjects, timetable)
  async getClassDetails(classId: string): Promise<ClassDetails> {
    const response = await apiClient.get(`api/academic/classes/${classId}/details`);
    return handleResponse(response);
  },

  // Get class students
  async getClassStudents(classId: string): Promise<StudentEnrollment[]> {
    const response = await apiClient.get(`api/academic/classes/${classId}/students`);
    return handleResponse(response);
  },

  // Subject Management
  async addSubjectToClass(
    classId: string,
    input: ClassSubjectInput
  ): Promise<ClassSubject> {
    const response = await apiClient.post(`api/academic/classes/${classId}/subjects`, input);
    return handleResponse(response);
  },

  async getClassSubjects(classId: string): Promise<ClassSubject[]> {
    const response = await apiClient.get(`api/academic/classes/${classId}/subjects`);
    return handleResponse(response);
  },

  async updateClassSubject(
    classId: string,
    subjectId: string,
    input: Partial<ClassSubjectInput>
  ): Promise<ClassSubject> {
    const response = await apiClient.put(
      `api/academic/classes/${classId}/subjects/${subjectId}`,
      input
    );
    return handleResponse(response);
  },

  async removeSubjectFromClass(
    classId: string,
    subjectId: string
  ): Promise<{ message: string }> {
    const response = await apiClient.delete(
      `api/academic/classes/${classId}/subjects/${subjectId}`
    );
    return handleResponse(response);
  },

  // Timetable Management
  async getTimetable(classId: string): Promise<TimetableSlot[]> {
    const response = await apiClient.get(`api/academic/classes/${classId}/timetable`);
    return handleResponse(response);
  },

  async addTimetableSlot(
    classId: string,
    input: TimetableSlotInput
  ): Promise<TimetableSlot> {
    const response = await apiClient.post(`api/academic/classes/${classId}/timetable`, input);
    return handleResponse(response);
  },

  async updateTimetableSlot(
    classId: string,
    slotId: string,
    input: Partial<TimetableSlotInput>
  ): Promise<TimetableSlot> {
    const response = await apiClient.put(
      `api/academic/classes/${classId}/timetable/${slotId}`,
      input
    );
    return handleResponse(response);
  },

  async deleteTimetableSlot(
    classId: string,
    slotId: string
  ): Promise<{ message: string }> {
    const response = await apiClient.delete(
      `api/academic/classes/${classId}/timetable/${slotId}`
    );
    return handleResponse(response);
  },

  // Enrollment Management
  async enrollStudent(
    classId: string,
    input: EnrollmentInput
  ): Promise<StudentEnrollment> {
    const response = await apiClient.post(`api/academic/classes/${classId}/enrollments`, input);
    return handleResponse(response);
  },

  async getClassEnrollments(
    classId: string
  ): Promise<StudentEnrollment[]> {
    const response = await apiClient.get(`api/academic/classes/${classId}/enrollments`);
    return handleResponse(response);
  },

  async removeStudentFromClass(
    classId: string,
    studentId: string
  ): Promise<{ message: string }> {
    const response = await apiClient.delete(
      `api/academic/classes/${classId}/enrollments/${studentId}`
    );
    return handleResponse(response);
  },

  // Activity History
  async getClassHistory(classId: string): Promise<ClassActivity[]> {
    const response = await apiClient.get(`api/academic/classes/${classId}/history`);
    return handleResponse(response);
  },

  // Helper: Get all academic years
  async getAcademicYears(): Promise<AcademicYear[]> {
    const response = await apiClient.get(`api/academic/academic-years`);
    return handleResponse(response);
  },

  // Helper: Get available levels (JSS1, JSS2, etc.)
  async getLevels(): Promise<LevelType[]> {
    // Backend returns levels as part of classes or as a separate endpoint
    // For now, return the standard levels
    return ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'];
  },
};

// Subject Management API
export const subjectService = {
  // Get all subjects with pagination
  async getSubjects(params?: { page?: number; limit?: number; search?: string; active?: boolean }): Promise<{
    subjects: Array<{
      id: string;
      name: string;
      code: string;
      description?: string;
      isActive: boolean;
      isGeneral: boolean;
      createdAt: string;
    }>;
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());

    const response = await apiClient.get(`api/academic/subjects?${queryParams}`);
    return handleResponse(response);
  },

  // Create new subject
  async createSubject(input: {
    name: string;
    code: string;
    description?: string;
    isGeneral?: boolean;
  }): Promise<{
    id: string;
    name: string;
    code: string;
    description?: string;
    isActive: boolean;
    isGeneral: boolean;
  }> {
    const response = await apiClient.post(`api/academic/subjects`, input);
    return handleResponse(response);
  },

  // Get subject by ID
  async getSubjectById(subjectId: string): Promise<{
    id: string;
    name: string;
    code: string;
    description?: string;
    isActive: boolean;
    isGeneral: boolean;
  }> {
    const response = await apiClient.get(`api/academic/subjects/${subjectId}`);
    return handleResponse(response);
  },

  // Update subject
  async updateSubject(
    subjectId: string,
    input: {
      name?: string;
      code?: string;
      description?: string;
      isActive?: boolean;
      isGeneral?: boolean;
    }
  ): Promise<{
    id: string;
    name: string;
    code: string;
    description?: string;
    isActive: boolean;
    isGeneral: boolean;
  }> {
    const response = await apiClient.put(`api/academic/subjects/${subjectId}`, input);
    return handleResponse(response);
  },

  // Delete subject
  async deleteSubject(subjectId: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`api/academic/subjects/${subjectId}`);
    return handleResponse(response);
  },
};

export default classService;
