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

const API_BASE_URL = '/api'; // Use Next.js API proxy routes

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
  console.log('[handleResponse] response.data:', JSON.stringify(response.data, null, 2).substring(0, 500))
  
  // Check for success flag in response
  if (response.data && response.data.success === false) {
    const errorMsg = response.data.message || response.data.error || 'API request failed';
    throw new ApiError(response.status || 400, errorMsg);
  }
  
  // If response has a data property with pagination (success: true, data: [...], pagination: {...})
  if (response.data && response.data.success === true && response.data.data) {
    return response.data;
  }
  
  // If response has a data property, return it - could be wrapped or raw
  if (response.data && response.data.data) {
    return response.data.data;
  }
  
  // If response IS the data directly
  if (response.data) {
    return response.data;
  }

  return response;
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
    // Simplified params - just basic pagination to avoid backend issues
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', (filters.limit || 25).toString());

    console.log('[getClasses] Calling API with params:', params.toString())
    console.log('[getClasses] Full URL will be:', `/academic/classes?${params.toString()}`)
    const response = await apiClient.get(`academic/classes`, { params });
    console.log('[getClasses] Response:', response)
    console.log('[getClasses] Number of classes returned:', (response as any).data?.data?.length || 0)
    console.log('[getClasses] Full first class object:', JSON.stringify((response as any).data?.data?.[0], null, 2))
    return handleResponse(response);
  },

  // Get single class by ID
  async getClassById(classId: string): Promise<Class> {
    const response = await apiClient.get(`academic/classes/${classId}`);
    return handleResponse(response);
  },

  // Create new class
  async createClass(input: ClassCreateInput & { classLevelId: string; academicYearId: string }): Promise<Class> {
    console.log('[createClass] Input:', JSON.stringify(input, null, 2))
    try {
      const response = await apiClient.post(`academic/classes`, input);
      console.log('[createClass] Response:', response)
      return handleResponse(response);
    } catch (error: any) {
      // Log the full error response from backend
      console.error('[createClass] Error response:', error.response?.data)
      console.error('[createClass] Error status:', error.response?.status)
      throw error;
    }
  },

  // Update class
  async updateClass(
    classId: string,
    input: ClassUpdateInput
  ): Promise<Class> {
    console.log('[updateClass] Calling API with classId:', classId, 'input:', input);
    const response = await apiClient.patch(`academic/classes/${classId}`, input);
    console.log('[updateClass] Response:', response.data);
    return handleResponse(response);
  },

  // Delete class
  async deleteClass(classId: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`academic/classes/${classId}`);
    return handleResponse(response);
  },

  
  async getClassDetails(classId: string): Promise<any> {
    // Use correct endpoint: GET /api/academic/classes/:id
    const response = await apiClient.get(`academic/classes/${classId}`);
    return handleResponse(response);
  },

  // Get class students (separate endpoint)
  async getClassStudents(classId: string): Promise<StudentEnrollment[]> {
    const response = await apiClient.get(`academic/classes/${classId}/students`);
    return handleResponse(response);
  },

  // Subject Management
  async addSubjectToClass(
    classId: string,
    input: ClassSubjectInput
  ): Promise<ClassSubject> {
    const response = await apiClient.post(`academic/classes/${classId}/subjects`, input);
    return handleResponse(response);
  },

  async getClassSubjects(classId: string): Promise<ClassSubject[]> {
    const response = await apiClient.get(`academic/classes/${classId}/subjects`);
    return handleResponse(response);
  },

  async updateClassSubject(
    classId: string,
    subjectId: string,
    input: Partial<ClassSubjectInput>
  ): Promise<ClassSubject> {
    const response = await apiClient.put(
      `academic/classes/${classId}/subjects/${subjectId}`,
      input
    );
    return handleResponse(response);
  },

  async removeSubjectFromClass(
    classId: string,
    subjectId: string
  ): Promise<{ message: string }> {
    const response = await apiClient.delete(
      `academic/classes/${classId}/subjects/${subjectId}`
    );
    return handleResponse(response);
  },

  // Timetable Management
  async getTimetable(classId: string): Promise<TimetableSlot[]> {
    const response = await apiClient.get(`academic/classes/${classId}/timetable`);
    return handleResponse(response);
  },

  async addTimetableSlot(
    classId: string,
    input: TimetableSlotInput
  ): Promise<TimetableSlot> {
    const response = await apiClient.post(`academic/classes/${classId}/timetable`, input);
    return handleResponse(response);
  },

  async updateTimetableSlot(
    classId: string,
    slotId: string,
    input: Partial<TimetableSlotInput>
  ): Promise<TimetableSlot> {
    const response = await apiClient.put(
      `academic/classes/${classId}/timetable/${slotId}`,
      input
    );
    return handleResponse(response);
  },

  async deleteTimetableSlot(
    classId: string,
    slotId: string
  ): Promise<{ message: string }> {
    const response = await apiClient.delete(
      `academic/classes/${classId}/timetable/${slotId}`
    );
    return handleResponse(response);
  },

   // Enrollment Management
   // Note: Per api.md (Section 5.4), enrollment endpoint is student-centric:
   // POST /api/students/:id/enroll with body: { classId, termId, academicYearId }
   // We use the Next.js proxy at /api/admin/students/:studentId/enroll
    async enrollStudent(
      studentId: string,
      input: EnrollmentInput
    ): Promise<StudentEnrollment> {
      // CAPACITY VALIDATION: Check class capacity before enrollment
      try {
        const classResponse = await apiClient.get(`academic/classes/${input.classId}`);
        const classData = await handleResponse(classResponse) as any;
        const classObj = classData.data || classData;

        // Capacity check - backend returns `capacity` (nullable)
        const capacity = classObj.capacity;
        const currentCount = classObj.enrolled_count ??
                           classObj.student_count ??
                           0;

        if (capacity && capacity > 0 && currentCount >= capacity) {
          throw new Error(
            `CAPACITY_EXCEEDED: Class "${classObj.name}" is full (${currentCount}/${capacity} students).`
          );
        }
      } catch (error: any) {
        if (error.message?.includes('CAPACITY_EXCEEDED')) {
          throw error;
        }
        console.warn('[enrollStudent] Could not pre-validate capacity:', error.message);
      }

      const response = await apiClient.post(`admin/students/${studentId}/enroll`, input);
      return handleResponse(response);
    },

  async getStudentEnrollments(
    studentId: string
  ): Promise<StudentEnrollment[]> {
    const response = await apiClient.get(`admin/students/${studentId}/enrollments`);
    return handleResponse(response);
  },

  async removeStudentFromClass(
    studentId: string,
    classId: string
  ): Promise<{ message: string }> {
    const response = await apiClient.delete(
      `admin/students/${studentId}/enrollments/${classId}`
    );
    return handleResponse(response);
  },

  // Activity History
  async getClassHistory(classId: string): Promise<ClassActivity[]> {
    const response = await apiClient.get(`academic/classes/${classId}/history`);
    return handleResponse(response);
  },

  // Helper: Get all academic years
  async getAcademicYears(): Promise<AcademicYear[]> {
    const response = await apiClient.get(`academic/academic-years`);
    return handleResponse(response);
  },

  // Helper: Get class teacher assignments for frontend filtering
  async getClassTeacherAssignments(): Promise<Array<{ classId: string; teacherId: string }>> {
    try {
      const response = await apiClient.get(`academic/class-teacher-assignments`);
      const result = await handleResponse(response) as any;
      // Handle both wrapped and unwrapped responses
      const items = result.data || result;
      if (!Array.isArray(items)) {
        console.warn('[classService] getClassTeacherAssignments: data is not an array', result);
        return [];
      }
      // Map to simple format for easy filtering
      return items.map((item: any) => ({
        classId: item.classId || item.class?.id,
        teacherId: item.teacherId || item.teacher?.id || item.formTeacherId,
      }));
    } catch (error) {
      console.error('[classService] Failed to get class teacher assignments:', error);
      return [];
    }
  },

  // Create a class teacher assignment
  async createClassTeacherAssignment(input: {
    classId: string;
    teacherId: string;
    academicYearId: string;
  }): Promise<{ id: string; classId: string; teacherId: string; academicYearId: string }> {
    console.log('[classService] Creating class teacher assignment:', input);
    const response = await apiClient.post(`academic/class-teacher-assignments`, input);
    return handleResponse(response);
  },

  // Delete a class teacher assignment
  async deleteClassTeacherAssignment(assignmentId: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`academic/class-teacher-assignments/${assignmentId}`);
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

    const response = await apiClient.get(`academic/subjects?${queryParams}`);
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
    const response = await apiClient.post(`academic/subjects`, input);
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
    const response = await apiClient.get(`academic/subjects/${subjectId}`);
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
    const response = await apiClient.put(`academic/subjects/${subjectId}`, input);
    return handleResponse(response);
  },

  // Delete subject
  async deleteSubject(subjectId: string): Promise<{ message: string }> {
    const response = await apiClient.delete(`academic/subjects/${subjectId}`);
    return handleResponse(response);
  },
};

export default classService;
