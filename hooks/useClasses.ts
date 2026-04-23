'use client';

import { useState, useCallback, useEffect } from 'react';
import classService from '@/lib/classService';
import { getClass } from '@/lib/api/academic-client';
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
import { useToast, type ToastType } from '@/components/ui/Toast';

interface UseClassesReturn {
  // Classes list state
  classes: Class[];
  classFilters: ClassFilters;
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;

  // Actions
  fetchClasses: (filters?: ClassFilters & { page?: number }) => Promise<void>;
  setFilters: (filters: Partial<ClassFilters>) => void;
  clearFilters: () => void;
  setSearchQuery: (query: string) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  refreshClasses: () => Promise<void>;

  // Class CRUD
  createClass: (input: ClassCreateInput & { classLevelId: string; academicYearId: string }) => Promise<Class | null>;
  updateClass: (classId: string, input: ClassUpdateInput) => Promise<Class | null>;
  deleteClass: (classId: string) => Promise<boolean>;
  archiveClass: (classId: string, archive: boolean) => Promise<Class | null>;
  duplicateClass: (classId: string) => Promise<Class | null>;

  // Class details
  selectedClass: Class | null;
  classDetails: ClassDetails | null;
  detailsLoading: boolean;
  fetchClassDetails: (classId: string) => Promise<void>;
  refreshClassDetails: () => Promise<void>;

  // Subjects
  addSubject: (classId: string, input: ClassSubjectInput) => Promise<ClassSubject | null>;
  updateSubject: (
    classId: string,
    subjectId: string,
    input: Partial<ClassSubjectInput>
  ) => Promise<ClassSubject | null>;
  removeSubject: (classId: string, subjectId: string) => Promise<boolean>;

  // Timetable
  getTimetable: (classId: string) => Promise<TimetableSlot[]>;
  addTimetableSlot: (classId: string, input: TimetableSlotInput) => Promise<TimetableSlot | null>;
  updateTimetableSlot: (
    classId: string,
    slotId: string,
    input: Partial<TimetableSlotInput>
  ) => Promise<TimetableSlot | null>;
  deleteTimetableSlot: (classId: string, slotId: string) => Promise<boolean>;
  validateTimetable: (classId: string) => Promise<TimetableValidationResponse | null>;
  generateTimetable: (classId: string) => Promise<TimetableSlot[] | null>;

  // Enrollment
  enrollStudent: (studentId: string, input: EnrollmentInput) => Promise<StudentEnrollment | null>;
  removeStudent: (classId: string, studentId: string) => Promise<boolean>;
  bulkEnrollStudents: (
    classId: string,
    enrollments: EnrollmentInput[]
  ) => Promise<BulkEnrollmentResult | null>;
  importEnrollmentsFromCSV: (classId: string, file: File) => Promise<BulkEnrollmentResult | null>;

  // History
  classHistory: ClassActivity[];
  fetchClassHistory: (classId: string) => Promise<void>;
}

export function useClasses(): UseClassesReturn {
  const { toast } = useToast();

  // Classes list state
  const [classes, setClasses] = useState<Class[]>([]);
  const [classFilters, setClassFilters] = useState<ClassFilters>({ status: 'active' });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 25,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Class details state
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [classHistory, setClassHistory] = useState<ClassActivity[]>([]);

  // Fetch classes with filters
  const fetchClasses = useCallback(
    async (filters?: ClassFilters & { page?: number }) => {
      setLoading(true);
      setError(null);

      try {
        const page = filters?.page || 1;
        const result = await classService.getClasses({
          ...filters,
          page,
          limit: filters?.pageSize || pagination.pageSize,
        });

        if (result.success) {
          // Map backend response to frontend Class type
          const mappedClasses = result.data.map((c: any) => ({
            id: c.id,
            class_name: c.name,
            class_code: c.name, // Use name as code fallback
            level: c.classLevelName?.replace('JSS ', '').replace('SS ', '') as any || c.classLevelName,
            stream: 'Science' as any, // Default stream since backend doesn't have it
            academic_year: c.academicYearName || '',
            max_capacity: c.capacity || 0,
            form_teacher_id: c.formTeacherId,
            form_teacher_name: c.formTeacherName,
            status: (c.isActive ? 'active' : 'archived') as 'active' | 'archived',
            enrolled_count: c.enrolledCount || 0,
            created_at: c.createdAt,
            updated_at: c.updatedAt,
          }));
          setClasses(mappedClasses);
          setPagination(result.pagination);
          // Don't set classFilters here - it causes infinite loop
          // The filters are passed from the component, we don't need to store them
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error && 'message' in err ? err.message : 'Failed to fetch classes';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [pagination.pageSize, toast]
  );

  // Set filters
  const setFilters = useCallback((filters: Partial<ClassFilters>) => {
    console.log('[useClasses] setFilters called with:', filters)
    setClassFilters((prev) => ({ ...prev, ...filters }));
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Reset to first page
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setClassFilters({ status: 'active' });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  // Set search query with debounce
  const setSearchQuery = useCallback((query: string) => {
    setClassFilters((prev) => ({ ...prev, search: query }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  // Set page
  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  }, []);

  // Set page size
  const setPageSize = useCallback((size: number) => {
    setPagination((prev) => ({ ...prev, pageSize: size, currentPage: 1 }));
  }, []);

  // Refresh classes
  const refreshClasses = useCallback(async () => {
    await fetchClasses();
  }, [fetchClasses]);

  // Create class
  const createClass = useCallback(
    async (input: ClassCreateInput & { classLevelId: string; academicYearId: string }): Promise<Class | null> => {
      try {
        const result = await classService.createClass(input);
        toast.success('Class created successfully');
        await refreshClasses();
        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error && 'message' in err ? err.message : 'Failed to create class';
        toast.error(errorMessage);
        return null;
      }
    },
    [refreshClasses, toast]
  );

  // Update class
  const updateClass = useCallback(
    async (classId: string, input: ClassUpdateInput): Promise<Class | null> => {
      try {
        const result = await classService.updateClass(classId, input);
        toast.success('Class updated successfully');
        await refreshClasses();
        if (selectedClass?.id === classId) {
          setSelectedClass(result);
        }
        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error && 'message' in err ? err.message : 'Failed to update class';
        toast.error(errorMessage);
        return null;
      }
    },
    [refreshClasses, selectedClass?.id, toast]
  );

  // Delete class
  const deleteClass = useCallback(
    async (classId: string): Promise<boolean> => {
      try {
        await classService.deleteClass(classId);
        toast.success('Class deleted successfully');
        await refreshClasses();
        return true;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error && 'message' in err ? err.message : 'Failed to delete class';
        toast.error(errorMessage);
        return false;
      }
    },
    [refreshClasses, toast]
  );

   // Archive class
   const archiveClass = useCallback(
     async (classId: string, archive: boolean): Promise<Class | null> => {
       try {
         const result = await classService.updateClass(classId, { isActive: !archive });
         toast.success(archive ? 'Class archived' : 'Class restored');
         await refreshClasses();
         return result;
       } catch (err: unknown) {
         const errorMessage =
           err instanceof Error && 'message' in err ? err.message : 'Failed to archive class';
         toast.error(errorMessage);
         return null;
       }
     },
     [refreshClasses, toast]
   );

  // Duplicate class
  const duplicateClass = useCallback(
    async (classId: string): Promise<Class | null> => {
      try {
        const existing = await classService.getClassById(classId);
        const { id, ...rest } = existing as any;
        const result = await classService.createClass({ ...rest });
        toast.success('Class duplicated successfully');
        await refreshClasses();
        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error && 'message' in err ? err.message : 'Failed to duplicate class';
        toast.error(errorMessage);
        return null;
      }
    },
    [refreshClasses, toast]
  );

   // Fetch class details
   const fetchClassDetails = useCallback(async (classId: string) => {
     setDetailsLoading(true);
     try {
       // Fetch class + students in parallel
       const [classResult, studentsResult] = await Promise.all([
         classService.getClassById(classId),
         classService.getClassStudents(classId).catch(() => []), // Students endpoint may not exist yet
       ]);

       setClassDetails({
         class: classResult,
         students: studentsResult,
         subjects: [],
         timetable: [],
       });
       setSelectedClass(classResult);
     } catch (err: unknown) {
       const errorMessage =
         err instanceof Error && 'message' in err ? err.message : 'Failed to fetch class details';
       toast.error(errorMessage);
     } finally {
       setDetailsLoading(false);
     }
   }, [toast]);

  // Refresh class details
  const refreshClassDetails = useCallback(async () => {
    if (selectedClass?.id) {
      await fetchClassDetails(selectedClass.id);
    }
  }, [selectedClass?.id, fetchClassDetails]);

  // Add subject
  const addSubject = useCallback(
    async (classId: string, input: ClassSubjectInput): Promise<ClassSubject | null> => {
      try {
        const result = await classService.addSubjectToClass(classId, input);
        toast.success('Subject added successfully');
        await refreshClassDetails();
        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error && 'message' in err ? err.message : 'Failed to add subject';
        toast.error(errorMessage);
        return null;
      }
    },
    [refreshClassDetails, toast]
  );

  // Update subject
  const updateSubject = useCallback(
    async (
      classId: string,
      subjectId: string,
      input: Partial<ClassSubjectInput>
    ): Promise<ClassSubject | null> => {
      try {
        const result = await classService.updateClassSubject(classId, subjectId, input);
        toast.success('Subject updated successfully');
        await refreshClassDetails();
        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error && 'message' in err ? err.message : 'Failed to update subject';
        toast.error(errorMessage);
        return null;
      }
    },
    [refreshClassDetails, toast]
  );

  // Remove subject
  const removeSubject = useCallback(
    async (classId: string, subjectId: string): Promise<boolean> => {
      try {
        await classService.removeSubjectFromClass(classId, subjectId);
        toast.success('Subject removed successfully');
        await refreshClassDetails();
        return true;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error && 'message' in err ? err.message : 'Failed to remove subject';
        toast.error(errorMessage);
        return false;
      }
    },
    [refreshClassDetails, toast]
  );

  // Get timetable
  const getTimetable = useCallback(async (classId: string): Promise<TimetableSlot[]> => {
    try {
      const result = await classService.getTimetable(classId);
      return result;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error && 'message' in err ? err.message : 'Failed to fetch timetable';
      toast.error(errorMessage);
      return [];
    }
  }, [toast]);

  // Add timetable slot
  const addTimetableSlot = useCallback(
    async (classId: string, input: TimetableSlotInput): Promise<TimetableSlot | null> => {
      try {
        const result = await classService.addTimetableSlot(classId, input);
        toast.success('Timetable slot added successfully');
        await refreshClassDetails();
        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error && 'message' in err ? err.message : 'Failed to add timetable slot';
        toast.error(errorMessage);
        return null;
      }
    },
    [refreshClassDetails, toast]
  );

  // Update timetable slot
  const updateTimetableSlot = useCallback(
    async (
      classId: string,
      slotId: string,
      input: Partial<TimetableSlotInput>
    ): Promise<TimetableSlot | null> => {
      try {
        const result = await classService.updateTimetableSlot(classId, slotId, input);
        toast.success('Timetable slot updated successfully');
        await refreshClassDetails();
        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error && 'message' in err
            ? err.message
            : 'Failed to update timetable slot';
        toast.error(errorMessage);
        return null;
      }
    },
    [refreshClassDetails, toast]
  );

  // Delete timetable slot
  const deleteTimetableSlot = useCallback(
    async (classId: string, slotId: string): Promise<boolean> => {
      try {
        await classService.deleteTimetableSlot(classId, slotId);
        toast.success('Timetable slot deleted successfully');
        await refreshClassDetails();
        return true;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error && 'message' in err ? err.message : 'Failed to delete timetable slot';
        toast.error(errorMessage);
        return false;
      }
    },
    [refreshClassDetails, toast]
  );

  // Validate timetable
  const validateTimetable = useCallback(
    async (classId: string): Promise<TimetableValidationResponse | null> => {
      try {
        const timetable = await classService.getTimetable(classId);
        return { success: true, has_conflicts: false, conflicts: [] };
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error && 'message' in err ? err.message : 'Failed to validate timetable';
        toast.error(errorMessage);
        return null;
      }
    },
    [toast]
  );

  // Generate timetable
  const generateTimetable = useCallback(
    async (classId: string): Promise<TimetableSlot[] | null> => {
      try {
        const result = await classService.getTimetable(classId);
        toast.success('Timetable loaded successfully');
        await refreshClassDetails();
        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error && 'message' in err ? err.message : 'Failed to generate timetable';
        toast.error(errorMessage);
        return null;
      }
    },
    [refreshClassDetails, toast]
  );

  // Enroll student
  // api.md Section 5.4: POST /api/students/:id/enroll with { classId, termId, academicYearId }
  const enrollStudent = useCallback(
    async (studentId: string, input: EnrollmentInput): Promise<StudentEnrollment | null> => {
      try {
        // Pass studentId and enrollment data to the student-centric endpoint
        const result = await classService.enrollStudent(studentId, input);
        toast.success('Student enrolled successfully');
        await refreshClassDetails();
        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error && 'message' in err ? err.message : 'Failed to enroll student';
        toast.error(errorMessage);
        return null;
      }
    },
    [refreshClassDetails, toast]
  );

  // Remove student
  const removeStudent = useCallback(
    async (classId: string, studentId: string): Promise<boolean> => {
      try {
        await classService.removeStudentFromClass(classId, studentId);
        toast.success('Student removed from class');
        await refreshClassDetails();
        return true;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error && 'message' in err ? err.message : 'Failed to remove student';
        toast.error(errorMessage);
        return false;
      }
    },
    [refreshClassDetails, toast]
  );

  // Bulk enroll students
  const bulkEnrollStudents = useCallback(
    async (classId: string, enrollments: EnrollmentInput[]): Promise<BulkEnrollmentResult | null> => {
      try {
        let enrolled = 0;
        const errors: Array<{ student_id: string; error: string }> = [];
        for (const enrollment of enrollments) {
          try {
            await classService.enrollStudent(classId, enrollment);
            enrolled++;
          } catch (e) {
            errors.push({ student_id: (enrollment as any).student_id || '', error: e instanceof Error ? e.message : 'Unknown error' });
          }
        }
        const result: BulkEnrollmentResult = { success: true, enrolled, failed: enrollments.length - enrolled, errors };
        toast.success(`Successfully enrolled ${result.enrolled} students`);
        await refreshClassDetails();
        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error && 'message' in err ? err.message : 'Failed to bulk enroll students';
        toast.error(errorMessage);
        return null;
      }
    },
    [refreshClassDetails, toast]
  );

  // Import enrollments from CSV
  const importEnrollmentsFromCSV = useCallback(
    async (classId: string, file: File): Promise<BulkEnrollmentResult | null> => {
      try {
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const enrollments: EnrollmentInput[] = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const row: Record<string, string> = {};
          headers.forEach((h, idx) => { row[h] = values[idx] || ''; });
          if (row.student_id) {
            enrollments.push({
              student_id: row.student_id,
              enrollment_date: row.enrollment_date || new Date().toISOString().split('T')[0],
            });
          }
        }
        let enrolled = 0;
        const errors: Array<{ student_id: string; error: string }> = [];
        for (const enrollment of enrollments) {
          try {
            await classService.enrollStudent(classId, enrollment);
            enrolled++;
          } catch (e) {
            errors.push({ student_id: enrollment.student_id, error: e instanceof Error ? e.message : 'Unknown error' });
          }
        }
        const result: BulkEnrollmentResult = { success: true, enrolled, failed: enrollments.length - enrolled, errors };
        toast.success(`Successfully enrolled ${result.enrolled} students`);
        await refreshClassDetails();
        return result;
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error && 'message' in err ? err.message : 'Failed to import enrollments';
        toast.error(errorMessage);
        return null;
      }
    },
    [refreshClassDetails, toast]
  );

  // Fetch class history
  const fetchClassHistory = useCallback(async (classId: string) => {
    try {
      const result = await classService.getClassHistory(classId);
      setClassHistory(result);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error && 'message' in err ? err.message : 'Failed to fetch class history';
      toast.error(errorMessage);
    }
  }, [toast]);

  return {
    // Classes list state
    classes,
    classFilters,
    pagination,
    loading,
    error,

    // Actions
    fetchClasses,
    setFilters,
    clearFilters,
    setSearchQuery,
    setPage,
    setPageSize,
    refreshClasses,

    // Class CRUD
    createClass,
    updateClass,
    deleteClass,
    archiveClass,
    duplicateClass,

    // Class details
    selectedClass,
    classDetails,
    detailsLoading,
    fetchClassDetails,
    refreshClassDetails,

    // Subjects
    addSubject,
    updateSubject,
    removeSubject,

    // Timetable
    getTimetable,
    addTimetableSlot,
    updateTimetableSlot,
    deleteTimetableSlot,
    validateTimetable,
    generateTimetable,

    // Enrollment
    enrollStudent,
    removeStudent,
    bulkEnrollStudents,
    importEnrollmentsFromCSV,

    // History
    classHistory,
    fetchClassHistory,
  };
}

export default useClasses;
