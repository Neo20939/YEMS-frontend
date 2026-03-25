"use client";

import React from "react";
import { Table, Badge, Button } from "@/components/ui";
import type { Class, ClassLevel, ClassStream, ClassStatus } from "@/types/class";
import type { Column } from "@/components/ui/Table";
import { MoreVertical, Eye, Pencil, Copy, Archive, Trash2, BookOpen, CalendarDays, Users } from "lucide-react";

interface ClassesTableProps {
  classes: Class[];
  loading?: boolean;
  onEdit: (classItem: Class) => void;
  onView: (classItem: Class) => void;
  onDelete: (classItem: Class) => void;
  onArchive: (classItem: Class) => void;
  onDuplicate: (classItem: Class) => void;
  onManageSubjects?: (classItem: Class) => void;
  onViewTimetable?: (classItem: Class) => void;
  onManageEnrollment?: (classItem: Class) => void;
  selectedRows?: Set<string>;
  onRowSelect?: (id: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (key: string, order: "asc" | "desc") => void;
}

export function ClassesTable({
  classes,
  loading = false,
  onEdit,
  onView,
  onDelete,
  onArchive,
  onDuplicate,
  onManageSubjects,
  onViewTimetable,
  onManageEnrollment,
  selectedRows,
  onRowSelect,
  onSelectAll,
  sortKey,
  sortOrder,
  onSort,
}: ClassesTableProps) {
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);

  const handleAction = (action: () => void, classId: string) => {
    action();
    setOpenMenuId(null);
  };

  const getStatusBadge = (status: ClassStatus) => {
    return (
      <Badge variant={status === "active" ? "success" : "neutral"} size="sm">
        {status === "active" ? "Active" : "Archived"}
      </Badge>
    );
  };

  const getEnrollmentDisplay = (classItem: Class) => {
    const enrolled = classItem.enrolled_count || 0;
    const max = classItem.max_capacity;
    const percentage = (enrolled / max) * 100;

    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-[80px]">
          <div className="h-2 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                percentage >= 90
                  ? "bg-red-500"
                  : percentage >= 75
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 min-w-[48px] text-right">
          {enrolled}/{max}
        </span>
      </div>
    );
  };

  const columns: Column<Class>[] = [
    {
      key: "class_name",
      header: "Class Name",
      sortable: true,
      render: (item) => (
        <div className="font-semibold text-slate-900 dark:text-slate-100">
          {item.class_name}
        </div>
      ),
    },
    {
      key: "class_code",
      header: "Code",
      sortable: true,
      className: "font-mono text-sm",
    },
    {
      key: "level",
      header: "Level",
      sortable: true,
      render: (item) => (
        <Badge variant="info" size="sm">
          {item.level}
        </Badge>
      ),
    },
    {
      key: "stream",
      header: "Stream",
      sortable: true,
      render: (item) => (
        <Badge variant="neutral" size="sm">
          {item.stream}
        </Badge>
      ),
    },
    {
      key: "form_teacher_name",
      header: "Form Teacher",
      sortable: true,
      render: (item) => (
        <span className="text-slate-700 dark:text-slate-300">
          {item.form_teacher_name || "—"}
        </span>
      ),
    },
    {
      key: "enrollment",
      header: "Enrollment",
      sortable: true,
      render: (item) => getEnrollmentDisplay(item),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => getStatusBadge(item.status),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      headerClassName: "text-right",
      render: (item) => (
        <div className="relative flex justify-end">
          <Button
            variant="ghost"
            size="iconSm"
            onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
            aria-label="Open menu"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>

          {openMenuId === item.id && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setOpenMenuId(null)}
              />
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-stone-900 rounded-xl shadow-lg border border-stone-200 dark:border-stone-800 z-20 overflow-hidden">
                <button
                  onClick={() => handleAction(() => onView(item), item.id)}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button
                  onClick={() => handleAction(() => onEdit(item), item.id)}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
                {onManageSubjects && (
                  <button
                    onClick={() => handleAction(() => onManageSubjects(item), item.id)}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Manage Subjects
                  </button>
                )}
                {onViewTimetable && (
                  <button
                    onClick={() => handleAction(() => onViewTimetable(item), item.id)}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                  >
                    <CalendarDays className="w-4 h-4" />
                    View Timetable
                  </button>
                )}
                {onManageEnrollment && (
                  <button
                    onClick={() => handleAction(() => onManageEnrollment(item), item.id)}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Manage Enrollment
                  </button>
                )}
                <div className="border-t border-stone-200 dark:border-stone-800" />
                <button
                  onClick={() => handleAction(() => onDuplicate(item), item.id)}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button
                  onClick={() => handleAction(() => onArchive(item), item.id)}
                  className="w-full px-4 py-2.5 text-left text-sm hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                >
                  <Archive className="w-4 h-4" />
                  {item.status === "active" ? "Archive" : "Unarchive"}
                </button>
                <div className="border-t border-stone-200 dark:border-stone-800" />
                <button
                  onClick={() => handleAction(() => onDelete(item), item.id)}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                  disabled={(item.enrolled_count || 0) > 0}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                  {(item.enrolled_count || 0) > 0 && (
                    <span className="text-xs">(Has students)</span>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={classes}
      loading={loading}
      emptyMessage="No classes found. Create your first class to get started."
      onSort={onSort}
      sortKey={sortKey}
      sortOrder={sortOrder}
      selectedRows={selectedRows}
      onRowSelect={onRowSelect}
      onSelectAll={onSelectAll}
      rowKey="id"
    />
  );
}

export default ClassesTable;
