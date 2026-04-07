"use client";

import React, { useState, useEffect } from "react";
import { useClasses } from "@/hooks/useClasses";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button, Badge, Pagination, ToastContainer, useToast, Modal, Input, Select } from "@/components/ui";
import { ArrowLeft, Pencil, Users, BookOpen, CalendarDays, History, UserCircle, Clock, FileText, Download, Plus, Search, Trash2, Edit2 } from "lucide-react";
import type { Class, ClassSubject, StudentEnrollment, TimetableSlot, ClassActivity } from "@/types/class";
import { cn } from "@/lib/utils";

interface ClassDetailsPageProps {
  classId: string;
}

type TabType = "students" | "subjects" | "timetable" | "teachers" | "history";

export function ClassDetailsPage({ classId }: ClassDetailsPageProps) {
  const {
    classDetails,
    selectedClass,
    detailsLoading,
    fetchClassDetails,
    classHistory,
    fetchClassHistory,
    removeStudent,
    removeSubject,
    enrollStudent,
    addSubject,
    addTimetableSlot,
  } = useClasses();

  const { toasts, toast, removeToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("students");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Enrollment modal state
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [enrollmentDate, setEnrollmentDate] = useState(new Date().toISOString().split("T")[0]);

  // Subject modal state
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [creditHours, setCreditHours] = useState("");
  const [passMark, setPassMark] = useState("");
  const [isCompulsory, setIsCompulsory] = useState(true);

  // Mock data - replace with actual API calls
  const [students, setStudents] = useState<StudentEnrollment[]>([]);
  const [subjects, setSubjects] = useState<ClassSubject[]>([]);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [teachers, setTeachers] = useState<Array<{ id: string; name: string; email: string; subject?: string }>>([]);
  const [availableSubjects, setAvailableSubjects] = useState<Array<{ id: string; name: string; description?: string }>>([]);
  const [availableStudents, setAvailableStudents] = useState<Array<{ id: string; name: string; admissionNo: string }>>([]);

  useEffect(() => {
    if (classId) {
      fetchClassDetails(classId);
      fetchClassHistory(classId);
    }
  }, [classId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (classDetails) {
      setStudents(classDetails.students || []);
      setSubjects(classDetails.subjects || []);
      setTimetable(classDetails.timetable || []);

      // Extract teachers from subjects
      const subjectTeachers = (classDetails.subjects || []).map((s) => ({
        id: s.teacher_id,
        name: s.teacher_name,
        email: "",
        subject: s.subject_name,
      }));
      setTeachers(subjectTeachers);
    }
  }, [classDetails]);

  // Mock available data - replace with actual API calls
  useEffect(() => {
    setAvailableSubjects([
      { id: "1", name: "Mathematics", description: "Core mathematics" },
      { id: "2", name: "English Language", description: "English studies" },
      { id: "3", name: "Biology", description: "Life sciences" },
      { id: "4", name: "Chemistry", description: "Chemical sciences" },
      { id: "5", name: "Physics", description: "Physical sciences" },
    ]);

    setAvailableStudents([
      { id: "101", name: "Sarah Adeyemi", admissionNo: "001" },
      { id: "102", name: "Michael Okafor", admissionNo: "002" },
      { id: "103", name: "Grace Eze", admissionNo: "003" },
      { id: "104", name: "David Okonkwo", admissionNo: "004" },
      { id: "105", name: "Blessing Osei", admissionNo: "005" },
    ]);
  }, []);

  const handleBack = () => {
    window.location.href = "/admin/classes";
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  // Student enrollment
  const handleEnrollStudent = async () => {
    if (!selectedStudentId || !enrollmentDate) {
      toast.error("Please select a student and enrollment date");
      return;
    }

    try {
      await enrollStudent(classId, { student_id: selectedStudentId, enrollment_date: enrollmentDate });
      setIsEnrollModalOpen(false);
      setSelectedStudentId("");
      setEnrollmentDate(new Date().toISOString().split("T")[0]);
      fetchClassDetails(classId);
    } catch (error) {
      // Error handled by hook
    }
  };

  // Remove student
  const handleRemoveStudent = async (studentId: string, studentName: string) => {
    const confirmed = window.confirm(`Remove ${studentName} from this class?`);
    if (!confirmed) return;

    await removeStudent(classId, studentId);
    fetchClassDetails(classId);
  };

  // Add subject
  const handleAddSubject = async () => {
    if (!selectedSubjectId || !selectedTeacherId) {
      toast.error("Please select a subject and teacher");
      return;
    }

    try {
      await addSubject(classId, {
        subject_id: selectedSubjectId,
        teacher_id: selectedTeacherId,
        credit_hours: creditHours ? parseInt(creditHours, 10) : undefined,
        pass_mark: passMark ? parseInt(passMark, 10) : undefined,
        is_compulsory: isCompulsory,
      });
      setIsSubjectModalOpen(false);
      setSelectedSubjectId("");
      setSelectedTeacherId("");
      setCreditHours("");
      setPassMark("");
      setIsCompulsory(true);
      fetchClassDetails(classId);
    } catch (error) {
      // Error handled by hook
    }
  };

  // Remove subject
  const handleRemoveSubject = async (subjectId: string, subjectName: string) => {
    const confirmed = window.confirm(`Remove ${subjectName} from this class?`);
    if (!confirmed) return;

    await removeSubject(classId, subjectId);
    fetchClassDetails(classId);
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "students":
        return renderStudentsTab();
      case "subjects":
        return renderSubjectsTab();
      case "timetable":
        return renderTimetableTab();
      case "teachers":
        return renderTeachersTab();
      case "history":
        return renderHistoryTab();
      default:
        return null;
    }
  };

  // Students Tab
  const renderStudentsTab = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 25;

    const filteredStudents = students.filter(
      (s) =>
        s.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.student_admission_no?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredStudents.length / pageSize);
    const paginatedStudents = filteredStudents.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students..."
              className="w-full pl-10 pr-4 py-2.5 border border-stone-300 dark:border-stone-700 rounded-xl bg-white dark:bg-stone-900 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <Button onClick={() => setIsEnrollModalOpen(true)} className="gap-2">
            <Plus className="w-5 h-5" />
            Enroll Students
          </Button>
        </div>

        {/* Students Table */}
        {paginatedStudents.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {students.length === 0 ? "No students enrolled yet" : "No students found"}
            </h3>
            <p className="text-slate-500 mt-1">
              {students.length === 0
                ? "Enroll students through the Enrollment system"
                : "Try adjusting your search"}
            </p>
            {students.length === 0 && (
              <Button onClick={() => setIsEnrollModalOpen(true)} className="mt-4 gap-2">
                <Plus className="w-5 h-5" />
                Enroll First Student
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-xl border border-stone-200 dark:border-stone-800">
              <table className="w-full">
                <thead className="bg-stone-50 dark:bg-stone-900/50 border-b border-stone-200 dark:border-stone-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                      Student ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                      Admission Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                  {paginatedStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-stone-50 dark:hover:bg-stone-900/30">
                      <td className="px-4 py-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                        {student.student_admission_no || student.student_id}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                        {student.student_name}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(student.enrollment_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <Badge
                          variant={student.status === "active" ? "success" : "neutral"}
                          size="sm"
                        >
                          {student.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveStudent(student.student_id, student.student_name)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredStudents.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    );
  };

  // Subjects Tab
  const renderSubjectsTab = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Assigned Subjects ({subjects.length})
          </h3>
          <Button onClick={() => setIsSubjectModalOpen(true)} className="gap-2">
            <Plus className="w-5 h-5" />
            Add Subject
          </Button>
        </div>

        {subjects.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              No subjects assigned
            </h3>
            <p className="text-slate-500 mt-1">
              Add subjects to this class to begin organizing the curriculum
            </p>
            <Button onClick={() => setIsSubjectModalOpen(true)} className="mt-4 gap-2">
              <Plus className="w-5 h-5" />
              Add First Subject
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                      {subject.subject_name}
                    </h4>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {subject.teacher_name}
                    </p>
                  </div>
                  {subject.is_compulsory && (
                    <Badge variant="info" size="sm">
                      Compulsory
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {subject.credit_hours && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{subject.credit_hours} hrs/wk</span>
                    </div>
                  )}
                  {subject.pass_mark && (
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>Pass: {subject.pass_mark}%</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {/* Edit subject */}}
                    className="flex-1 gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSubject(subject.id, subject.subject_name)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Timetable Tab
  const renderTimetableTab = () => {
    const days: Array<{ key: string; label: string }> = [
      { key: "Monday", label: "Mon" },
      { key: "Tuesday", label: "Tue" },
      { key: "Wednesday", label: "Wed" },
      { key: "Thursday", label: "Thu" },
      { key: "Friday", label: "Fri" },
    ];

    const timeSlots = [
      "8:00 AM",
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
    ];

    const getSlot = (day: string, time: string) => {
      return timetable.find(
        (t) => t.day_of_week === day && t.start_time.startsWith(time.split(" ")[0])
      );
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Weekly Timetable
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {/* Generate timetable */}} className="gap-2">
              <CalendarDays className="w-4 h-4" />
              Generate
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {timetable.length === 0 ? (
          <div className="text-center py-12">
            <CalendarDays className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              No timetable created yet
            </h3>
            <p className="text-slate-500 mt-1">
              Create a schedule for this class
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50">
                    Time
                  </th>
                  {days.map((day) => (
                    <th
                      key={day.key}
                      className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 min-w-[120px]"
                    >
                      {day.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time) => (
                  <tr key={time}>
                    <td className="px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50">
                      {time}
                    </td>
                    {days.map((day) => {
                      const slot = getSlot(day.key, time);
                      return (
                        <td
                          key={day.key}
                          className={cn(
                            "px-3 py-2 border border-stone-200 dark:border-stone-800 min-h-[80px]",
                            slot
                              ? "bg-primary/5 dark:bg-primary/10"
                              : "bg-white dark:bg-stone-900"
                          )}
                        >
                          {slot ? (
                            <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                              <div className="font-semibold text-sm text-primary dark:text-primary-light">
                                {slot.subject_name}
                              </div>
                              <div className="text-xs text-slate-600 dark:text-slate-400">
                                {slot.teacher_name}
                              </div>
                              {slot.room && (
                                <div className="text-xs text-slate-500 mt-1">
                                  {slot.room}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-300 dark:text-stone-700 text-xs">
                              Free
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // Teachers Tab
  const renderTeachersTab = () => {
    const formTeacher = selectedClass?.form_teacher_name;

    return (
      <div className="space-y-6">
        {/* Form Teacher */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Form Teacher
          </h3>
          {formTeacher ? (
            <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCircle className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    {formTeacher}
                  </h4>
                  <p className="text-sm text-slate-500">
                    {selectedClass?.class_name} - Form Teacher
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-center">
              <p className="text-slate-500">No form teacher assigned</p>
            </div>
          )}
        </div>

        {/* Subject Teachers */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Subject Teachers ({teachers.length})
          </h3>

          {teachers.length === 0 ? (
            <div className="p-5 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 text-center">
              <p className="text-slate-500">No subject teachers assigned yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCircle className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">
                        {teacher.name}
                      </h4>
                      {teacher.subject && (
                        <p className="text-sm text-slate-500">{teacher.subject}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // History Tab
  const renderHistoryTab = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Activity History
          </h3>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {classHistory.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              No activity yet
            </h3>
            <p className="text-slate-500 mt-1">
              Activity will be recorded as changes are made to this class
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {classHistory.map((activity) => (
              <div
                key={activity.id}
                className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <History className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {activity.action}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                        {activity.details}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        By {activity.changed_by_name} •{" "}
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (detailsLoading || !selectedClass) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading class details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const enrollmentPercentage = ((selectedClass.enrolled_count || 0) / selectedClass.max_capacity) * 100;

  const tabs: Array<{ key: TabType; label: string; icon: React.ReactNode; count?: number }> = [
    { key: "students", label: "Students", icon: <Users className="w-4 h-4" />, count: students.length },
    { key: "subjects", label: "Subjects", icon: <BookOpen className="w-4 h-4" />, count: subjects.length },
    { key: "timetable", label: "Timetable", icon: <CalendarDays className="w-4 h-4" /> },
    { key: "teachers", label: "Teachers", icon: <UserCircle className="w-4 h-4" />, count: teachers.length },
    { key: "history", label: "History", icon: <History className="w-4 h-4" /> },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={handleBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                {selectedClass.class_name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="info">{selectedClass.level}</Badge>
                <Badge variant="neutral">{selectedClass.stream}</Badge>
                <Badge variant={selectedClass.status === "active" ? "success" : "neutral"}>
                  {selectedClass.status}
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={handleEdit} className="gap-2">
            <Pencil className="w-4 h-4" />
            Edit Class
          </Button>
        </div>

        {/* Overview Card */}
        <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-slate-500">Class Code</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100 font-mono mt-1">
                {selectedClass.class_code}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Academic Year</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {selectedClass.academic_year}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Capacity</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {selectedClass.max_capacity} students
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Enrollment</p>
              <div className="mt-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {selectedClass.enrolled_count || 0}/{selectedClass.max_capacity}
                  </span>
                  <span className="text-slate-500">{Math.round(enrollmentPercentage)}%</span>
                </div>
                <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      enrollmentPercentage >= 90
                        ? "bg-red-500"
                        : enrollmentPercentage >= 75
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(enrollmentPercentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {selectedClass.form_teacher_name && (
            <div className="mt-6 pt-6 border-t border-stone-200 dark:border-stone-800">
              <p className="text-sm text-slate-500">Form Teacher</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {selectedClass.form_teacher_name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div>
          <div className="flex overflow-x-auto gap-2 border-b border-stone-200 dark:border-stone-800 pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                )}
              >
                {tab.icon}
                {tab.label}
                {tab.count !== undefined && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-stone-200 dark:bg-stone-700">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-6">{renderTabContent()}</div>
        </div>
      </div>

      {/* Enrollment Modal */}
      <Modal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        title="Enroll Student"
        description="Add a student to this class"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsEnrollModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEnrollStudent}>Enroll Student</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Student"
            options={availableStudents.map((s) => ({
              value: s.id,
              label: s.name,
              description: `ID: ${s.admissionNo}`,
            }))}
            value={selectedStudentId}
            onChange={(value) => setSelectedStudentId(value as string)}
            placeholder="Select student"
            searchable
            searchPlaceholder="Search students..."
            required
          />
          <Input
            label="Enrollment Date"
            type="date"
            value={enrollmentDate}
            onChange={(e) => setEnrollmentDate(e.target.value)}
            required
          />
        </div>
      </Modal>

      {/* Subject Modal */}
      <Modal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        title="Add Subject"
        description="Assign a subject to this class"
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsSubjectModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubject}>Add Subject</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Subject"
            options={availableSubjects.map(s => ({ value: s.id, label: s.name, description: s.description }))}
            value={selectedSubjectId}
            onChange={(value) => setSelectedSubjectId(value as string)}
            placeholder="Select subject"
            searchable
            required
          />
          <Select
            label="Teacher"
            options={[
              { value: "1", label: "John Doe", description: "Mathematics" },
              { value: "2", label: "Jane Smith", description: "English" },
              { value: "3", label: "Mike Johnson", description: "Science" },
            ]}
            value={selectedTeacherId}
            onChange={(value) => setSelectedTeacherId(value as string)}
            placeholder="Select teacher"
            searchable
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Credit Hours"
              type="number"
              min="0"
              max="10"
              value={creditHours}
              onChange={(e) => setCreditHours(e.target.value)}
              placeholder="3"
              helperText="Hours per week"
            />
            <Input
              label="Pass Mark"
              type="number"
              min="0"
              max="100"
              value={passMark}
              onChange={(e) => setPassMark(e.target.value)}
              placeholder="40"
              helperText="Percentage"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isCompulsory}
              onChange={(e) => setIsCompulsory(e.target.checked)}
              className="w-4 h-4 rounded border-stone-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Compulsory subject
            </span>
          </label>
        </div>
      </Modal>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </AdminLayout>
  );
}

export default ClassDetailsPage;
