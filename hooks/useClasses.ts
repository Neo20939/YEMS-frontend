'use client';

import { useState, useCallback, useEffect } from 'react';
import classService from '@/lib/classService';
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
  createClass: (input: ClassCreateInput) => Promise<Class | null>;
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
  enrollStudent: (classId: string, input: EnrollmentInput) => Promise<StudentEnrollment | null>;
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
        const page = filters?.page || pagination.currentPage;
        const appliedFilters = { ...classFilters, ...filters };
        const result = await classService.getClasses({
          ...appliedFilters,
          page,
          limit: pagination.pageSize,
        });

        if (result.success) {
          setClasses(result.data);
          setPagination(result.pagination);
          setClassFilters(appliedFilters);
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
    [classFilters, pagination.currentPage, pagination.pageSize, toast]
  );

  // Set filters
  const setFilters = useCallback((filters: Partial<ClassFilters>) => {
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
    async (input: ClassCreateInput): Promise<Class | null> => {
      try {
        const result = await classService.createClass(input);
        if (result.success) {
          toast.success('Class created successfully');
          await refreshClasses();
          return result.data;
        }
        return null;
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
        if (result.success) {
          toast.success('Class updated successfully');
          await refreshClasses();
          if (selectedClass?.id === classId) {
            setSelectedClass(result.data);
          }
          return result.data;
        }
        return null;
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
        const result = await classService.deleteClass(classId);
        if (result.success) {
          toast.success('Class deleted successfully');
          await refreshClasses();
          return true;
        }
        return false;
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
        const result = await classService.archiveClass(classId, archive);
        if (result.success) {
          toast.success(archive ? 'Class archived' : 'Class restored');
          await refreshClasses();
          return result.data;
        }
        return null;
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
        const result = await classService.duplicateClass(classId);
        if (result.success) {
          toast.success('Class duplicated successfully');
          await refreshClasses();
          return result.data;
        }
        return null;
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
      const result = await classService.getClassDetails(classId);
      if (result.success) {
        setClassDetails(result.data);
        setSelectedClass(result.data.class);
      }
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
        if (result.success) {
          toast.success('Subject added successfully');
          await refreshClassDetails();
          return result.data;
        }
        return null;
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
        if (result.success) {
          toast.success('Subject updated successfully');
          await refreshClassDetails();
          return result.data;
        }
        return null;
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
        const result = await classService.removeSubjectFromClass(classId, subjectId);
        if (result.success) {
          toast.success('Subject removed successfully');
          await refreshClassDetails();
          return true;
        }
        return false;
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
      if (result.success) {
        return result.data;
      }
      return [];
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
        if (result.success) {
          toast.success('Timetable slot added successfully');
          await refreshClassDetails();
          return result.data;
        }
        return null;
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
        if (result.success) {
          toast.success('Timetable slot updated successfully');
          await refreshClassDetails();
          return result.data;
        }
        return null;
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
        const result = await classService.deleteTimetableSlot(classId, slotId);
        if (result.success) {
          toast.success('Timetable slot deleted successfully');
          await refreshClassDetails();
          return true;
        }
        return false;
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
        const result = await classService.validateTimetable(classId);
        return result;
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
        const result = await classService.generateTimetable(classId);
        if (result.success) {
          toast.success('Timetable generated successfully');
          await refreshClassDetails();
          return result.data;
        }
        return null;
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
  const enrollStudent = useCallback(
    async (classId: string, input: EnrollmentInput): Promise<StudentEnrollment | null> => {
      try {
        const result = await classService.enrollStudent(classId, input);
        if (result.success) {
          toast.success('Student enrolled successfully');
          await refreshClassDetails();
          return result.data;
        }
        return null;
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
        const result = await classService.removeStudentFromClass(classId, studentId);
        if (result.success) {
          toast.success('Student removed from class');
          await refreshClassDetails();
          return true;
        }
        return false;
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
        const result = await classService.bulkEnrollStudents(classId, enrollments);
        if (result.success) {
          toast.success(`Successfully enrolled ${result.enrolled} students`);
          await refreshClassDetails();
          return result;
        }
        return null;
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
        const result = await classService.importEnrollmentsFromCSV(classId, file);
        if (result.success) {
          toast.success(`Successfully enrolled ${result.enrolled} students`);
          await refreshClassDetails();
          return result;
        }
        return null;
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
      if (result.success) {
        setClassHistory(result.data);
      }
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
