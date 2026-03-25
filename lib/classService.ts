import axios from 'axios';
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
} from '@/types/class';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

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

async function handleResponse<T>(response: { data: T; status: number }): Promise<T> {
  if (!response.data) {
    throw new ApiError(response.status, 'Empty response from server');
  }
  return response.data;
}

// Classes API
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
    if (filters.academic_year) params.append('academic_year', filters.academic_year);
    if (filters.form_teacher_id) params.append('form_teacher_id', filters.form_teacher_id);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.order) params.append('order', filters.order);

    const response = await axios.get(`${API_BASE_URL}/admin/classes`, { params });
    return handleResponse(response);
  },

  // Get single class by ID
  async getClassById(classId: string): Promise<{ success: boolean; data: Class }> {
    const response = await axios.get(`${API_BASE_URL}/admin/classes/${classId}`);
    return handleResponse(response);
  },

  // Create new class
  async createClass(input: ClassCreateInput): Promise<{ success: boolean; data: Class }> {
    const response = await axios.post(`${API_BASE_URL}/admin/classes`, input);
    return handleResponse(response);
  },

  // Update class
  async updateClass(
    classId: string,
    input: ClassUpdateInput
  ): Promise<{ success: boolean; data: Class }> {
    const response = await axios.put(`${API_BASE_URL}/admin/classes/${classId}`, input);
    return handleResponse(response);
  },

  // Delete class
  async deleteClass(classId: string): Promise<{ success: boolean; message: string }> {
    const response = await axios.delete(`${API_BASE_URL}/admin/classes/${classId}`);
    return handleResponse(response);
  },

  // Archive/Unarchive class
  async archiveClass(classId: string, archive: boolean): Promise<{ success: boolean; data: Class }> {
    const response = await axios.patch(`${API_BASE_URL}/admin/classes/${classId}/archive`, { archive });
    return handleResponse(response);
  },

  // Duplicate class
  async duplicateClass(classId: string): Promise<{ success: boolean; data: Class }> {
    const response = await axios.post(`${API_BASE_URL}/admin/classes/${classId}/duplicate`);
    return handleResponse(response);
  },

  // Get class details (includes students, subjects, timetable)
  async getClassDetails(classId: string): Promise<{ success: boolean; data: ClassDetails }> {
    const response = await axios.get(`${API_BASE_URL}/admin/classes/${classId}/details`);
    return handleResponse(response);
  },

  // Get class students
  async getClassStudents(classId: string): Promise<{ success: boolean; data: StudentEnrollment[] }> {
    const response = await axios.get(`${API_BASE_URL}/admin/classes/${classId}/students`);
    return handleResponse(response);
  },

  // Subject Management
  async addSubjectToClass(
    classId: string,
    input: ClassSubjectInput
  ): Promise<{ success: boolean; data: ClassSubject }> {
    const response = await axios.post(`${API_BASE_URL}/admin/classes/${classId}/subjects`, input);
    return handleResponse(response);
  },

  async getClassSubjects(classId: string): Promise<{ success: boolean; data: ClassSubject[] }> {
    const response = await axios.get(`${API_BASE_URL}/admin/classes/${classId}/subjects`);
    return handleResponse(response);
  },

  async updateClassSubject(
    classId: string,
    subjectId: string,
    input: Partial<ClassSubjectInput>
  ): Promise<{ success: boolean; data: ClassSubject }> {
    const response = await axios.put(
      `${API_BASE_URL}/admin/classes/${classId}/subjects/${subjectId}`,
      input
    );
    return handleResponse(response);
  },

  async removeSubjectFromClass(
    classId: string,
    subjectId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await axios.delete(
      `${API_BASE_URL}/admin/classes/${classId}/subjects/${subjectId}`
    );
    return handleResponse(response);
  },

  // Timetable Management
  async getTimetable(classId: string): Promise<{ success: boolean; data: TimetableSlot[] }> {
    const response = await axios.get(`${API_BASE_URL}/admin/classes/${classId}/timetable`);
    return handleResponse(response);
  },

  async addTimetableSlot(
    classId: string,
    input: TimetableSlotInput
  ): Promise<{ success: boolean; data: TimetableSlot }> {
    const response = await axios.post(`${API_BASE_URL}/admin/classes/${classId}/timetable`, input);
    return handleResponse(response);
  },

  async updateTimetableSlot(
    classId: string,
    slotId: string,
    input: Partial<TimetableSlotInput>
  ): Promise<{ success: boolean; data: TimetableSlot }> {
    const response = await axios.put(
      `${API_BASE_URL}/admin/classes/${classId}/timetable/${slotId}`,
      input
    );
    return handleResponse(response);
  },

  async deleteTimetableSlot(
    classId: string,
    slotId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await axios.delete(
      `${API_BASE_URL}/admin/classes/${classId}/timetable/${slotId}`
    );
    return handleResponse(response);
  },

  async validateTimetable(classId: string): Promise<TimetableValidationResponse> {
    const response = await axios.post(
      `${API_BASE_URL}/admin/classes/${classId}/timetable/validate`
    );
    return handleResponse(response);
  },

  async generateTimetable(classId: string): Promise<{ success: boolean; data: TimetableSlot[] }> {
    const response = await axios.post(
      `${API_BASE_URL}/admin/classes/${classId}/timetable/generate`
    );
    return handleResponse(response);
  },

  // Enrollment Management
  async enrollStudent(
    classId: string,
    input: EnrollmentInput
  ): Promise<{ success: boolean; data: StudentEnrollment }> {
    const response = await axios.post(`${API_BASE_URL}/admin/classes/${classId}/enroll`, input);
    return handleResponse(response);
  },

  async getClassEnrollments(
    classId: string
  ): Promise<{ success: boolean; data: StudentEnrollment[] }> {
    const response = await axios.get(`${API_BASE_URL}/admin/classes/${classId}/enrollments`);
    return handleResponse(response);
  },

  async removeStudentFromClass(
    classId: string,
    studentId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await axios.delete(
      `${API_BASE_URL}/admin/classes/${classId}/enroll/${studentId}`
    );
    return handleResponse(response);
  },

  async bulkEnrollStudents(
    classId: string,
    enrollments: EnrollmentInput[]
  ): Promise<BulkEnrollmentResult> {
    const response = await axios.post(
      `${API_BASE_URL}/admin/classes/${classId}/enroll/bulk`,
      { enrollments }
    );
    return handleResponse(response);
  },

  async importEnrollmentsFromCSV(
    classId: string,
    file: File
  ): Promise<BulkEnrollmentResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(
      `${API_BASE_URL}/admin/classes/${classId}/enroll/import-csv`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return handleResponse(response);
  },

  // Activity History
  async getClassHistory(classId: string): Promise<{ success: boolean; data: ClassActivity[] }> {
    const response = await axios.get(`${API_BASE_URL}/admin/classes/${classId}/history`);
    return handleResponse(response);
  },

  // Export functions
  async exportClasses(filters?: ClassFilters): Promise<Blob> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.level) params.append('level', filters.level);
    if (filters?.stream) params.append('stream', filters.stream);
    if (filters?.status) params.append('status', filters.status);

    const response = await axios.get(`${API_BASE_URL}/admin/classes/export`, {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  async exportClassStudents(classId: string): Promise<Blob> {
    const response = await axios.get(`${API_BASE_URL}/admin/classes/${classId}/students/export`, {
      responseType: 'blob',
    });
    return response.data;
  },

  async exportClassTimetable(classId: string): Promise<Blob> {
    const response = await axios.get(`${API_BASE_URL}/admin/classes/${classId}/timetable/export`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default classService;
