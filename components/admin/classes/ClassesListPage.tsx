"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useClasses } from "@/hooks/useClasses";
import AdminLayout from "@/components/admin/AdminLayout";
import { ClassesTable } from "@/components/admin/classes/ClassesTable";
import { ClassFiltersBar } from "@/components/admin/classes/ClassFiltersBar";
import ClassFormModal from "@/components/admin/classes/ClassFormModal";
import { Pagination, Button, ToastContainer, useToast } from "@/components/ui";
import { Plus, Archive, Trash2, Download } from "lucide-react";
import type { Class } from "@/types/class";
import classService from "@/lib/classService";
import { getUsers, User } from "@/lib/api/admin-client";
import { getAcademicYears, AcademicYear } from "@/lib/api/academic-client";

export default function ClassesListPage() {
  const [academicYearsList, setAcademicYearsList] = useState<AcademicYear[]>([]);
  const {
    classes,
    classFilters,
    pagination,
    loading,
    error,
    fetchClasses,
    setFilters,
    clearFilters,
    setSearchQuery,
    setPage,
    setPageSize,
    createClass,
    updateClass,
    deleteClass,
    archiveClass,
    duplicateClass,
  } = useClasses();

  const { toasts, toast, removeToast } = useToast();

  // UI state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState<Class | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<string>("class_name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock teachers data - replace with actual API call
  const [teachers, setTeachers] = useState<Array<{ id: string; name: string; email: string }>>([]);

  useEffect(() => {
    // Fetch teachers and academic years for dropdowns
    const fetchData = async () => {
      try {
        // Fetch teachers from admin users API
        const users = await getUsers();
        // Filter for teacher roles only
        const teacherUsers = users
          .filter((u: User) => {
            const role = String(u.role).toLowerCase();
            return role === 'subject_teacher' || role === 'class_teacher' || role === 'teacher';
          })
          .map((t: User) => ({
            id: t.id,
            name: t.name,
            email: t.email,
          }));
        setTeachers(teacherUsers);

        // Fetch academic years from API
        const years = await getAcademicYears();
        setAcademicYearsList(Array.isArray(years) ? years : years?.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Fallback to mock data if API fails
        const mockTeachers = [
          { id: "1", name: "John Doe", email: "john.doe@school.edu" },
          { id: "2", name: "Jane Smith", email: "jane.smith@school.edu" },
          { id: "3", name: "Mike Johnson", email: "mike.johnson@school.edu" },
        ];
        setTeachers(mockTeachers);
        setAcademicYearsList([]);
      }
    };

    fetchData();
  }, []);

  // Fetch classes when filters change or page changes
  useEffect(() => {
    console.log('[ClassesListPage] useEffect triggered', { 
      classFilters, 
      currentPage: pagination.currentPage,
      sortKey,
      sortOrder 
    })
    const fetchParams = {
      ...classFilters,
      page: pagination.currentPage,
      sort: sortKey,
      order: sortOrder,
    };
    console.log('[ClassesListPage] Calling fetchClasses with:', fetchParams)
    fetchClasses(fetchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage, classFilters]);

  // Handle create/edit submit
  const handleSubmitClass = async (data: any) => {
    setIsSubmitting(true);

    try {
      if (classToEdit) {
        await updateClass(classToEdit.id, data);
      } else {
        await createClass(data);
      }
      setIsCreateModalOpen(false);
      setClassToEdit(null);
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle row selection
  const handleRowSelect = useCallback((id: string | number, selected: boolean) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(id.toString());
      } else {
        next.delete(id.toString());
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected) {
      setSelectedRows(new Set(classes.map((c) => c.id)));
    } else {
      setSelectedRows(new Set());
    }
  }, [classes]);

  // Handle sort
  const handleSort = useCallback((key: string, order: "asc" | "desc") => {
    setSortKey(key);
    setSortOrder(order);
  }, []);

  // Handle bulk actions
  const handleBulkArchive = async () => {
    if (selectedRows.size === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to archive ${selectedRows.size} class(es)?`
    );
    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      for (const id of selectedRows) {
        await archiveClass(id, true);
      }
      toast.success(`Archived ${selectedRows.size} class(es)`);
      setSelectedRows(new Set());
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.size === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedRows.size} class(es)? This action cannot be undone.`
    );
    if (!confirmed) return;

    setIsSubmitting(true);
    try {
      for (const id of selectedRows) {
        await deleteClass(id);
      }
      toast.success(`Deleted ${selectedRows.size} class(es)`);
      setSelectedRows(new Set());
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle export - TODO: implement export functionality
  const handleExport = async () => {
    toast.info("Export functionality coming soon");
  };

  // Navigation handlers
  const handleView = (classItem: Class) => {
    window.location.href = `/admin/classes/${classItem.id}`;
  };

  const handleEdit = (classItem: Class) => {
    setClassToEdit(classItem);
    setIsCreateModalOpen(true);
  };

  const handleDelete = async (classItem: Class) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${classItem.class_name}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    await deleteClass(classItem.id);
  };

  const handleArchive = async (classItem: Class) => {
    const action = classItem.status === "active" ? "archive" : "restore";
    const confirmed = window.confirm(
      `Are you sure you want to ${action} "${classItem.class_name}"?`
    );
    if (!confirmed) return;

    await archiveClass(classItem.id, classItem.status === "active");
  };

  const handleDuplicate = async (classItem: Class) => {
    const confirmed = window.confirm(
      `Create a duplicate of "${classItem.class_name}"?`
    );
    if (!confirmed) return;

    await duplicateClass(classItem.id);
  };

  const handleManageSubjects = (classItem: Class) => {
    window.location.href = `/admin/classes/${classItem.id}/subjects`;
  };

  const handleViewTimetable = (classItem: Class) => {
    window.location.href = `/admin/classes/${classItem.id}/timetable`;
  };

  const handleManageEnrollment = (classItem: Class) => {
    window.location.href = `/admin/classes/${classItem.id}/enrollment`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Classes Management
            </h1>
            <p className="text-slate-500 mt-1">
              Manage all classes in the system
            </p>
          </div>

          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="w-5 h-5" />
            New Class
          </Button>
        </div>

        {/* Bulk Actions Toolbar */}
        {selectedRows.size > 0 && (
          <div className="flex items-center gap-3 p-4 bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20">
            <span className="text-sm font-medium text-primary">
              {selectedRows.size} class(es) selected
            </span>
            <div className="h-4 w-px bg-primary/20" />
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkArchive}
              disabled={isSubmitting}
              className="gap-2"
            >
              <Archive className="w-4 h-4" />
              Archive
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkDelete}
              disabled={isSubmitting}
              className="gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRows(new Set())}
              className="ml-auto"
            >
              Clear selection
            </Button>
          </div>
        )}

        {/* Filters */}
        <ClassFiltersBar
          filters={classFilters}
          onFilterChange={setFilters}
          onClearFilters={clearFilters}
          onExport={handleExport}
          academicYears={academicYearsList.map(y => y.name)}
          teachers={teachers}
        />

        {/* Table */}
        <ClassesTable
          classes={classes}
          loading={loading}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          onArchive={handleArchive}
          onDuplicate={handleDuplicate}
          onManageSubjects={handleManageSubjects}
          onViewTimetable={handleViewTimetable}
          onManageEnrollment={handleManageEnrollment}
          selectedRows={selectedRows}
          onRowSelect={handleRowSelect}
          onSelectAll={handleSelectAll}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSort={handleSort}
        />

        {/* Pagination */}
        {!loading && classes.length > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.total}
            pageSize={pagination.pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        )}

        {/* Create/Edit Modal */}
        <ClassFormModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setClassToEdit(null);
          }}
          onSubmit={handleSubmitClass}
          classToEdit={classToEdit}
          teachers={teachers}
          loading={isSubmitting}
        />
      </div>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </AdminLayout>
  );
}
