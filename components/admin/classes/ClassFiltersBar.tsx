"use client";

import React, { useState, useCallback } from "react";
import { SearchInput, Select, Button, Badge } from "@/components/ui";
import { Filter, X, Download } from "lucide-react";
import type { ClassFilters, ClassLevel, ClassStream, ClassStatus } from "@/types/class";

interface ClassFiltersBarProps {
  filters: ClassFilters;
  onFilterChange: (filters: Partial<ClassFilters>) => void;
  onClearFilters: () => void;
  onExport?: () => void;
  academicYears?: string[];
  teachers?: Array<{ id: string; name: string }>;
}

export function ClassFiltersBar({
  filters,
  onFilterChange,
  onClearFilters,
  onExport,
  academicYears = ["2024/2025", "2023/2024", "2022/2023"],
  teachers = [],
}: ClassFiltersBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters =
    filters.level ||
    filters.stream ||
    filters.status !== "active" ||
    filters.academic_year ||
    filters.form_teacher_id;

  const handleSearch = useCallback(
    (query: string) => {
      onFilterChange({ search: query });
    },
    [onFilterChange]
  );

  const handleLevelChange = useCallback(
    (value: string | number) => {
      onFilterChange({ level: (value as ClassLevel) || undefined });
    },
    [onFilterChange]
  );

  const handleStreamChange = useCallback(
    (value: string | number) => {
      onFilterChange({ stream: (value as ClassStream) || undefined });
    },
    [onFilterChange]
  );

  const handleStatusChange = useCallback(
    (value: string | number) => {
      onFilterChange({ status: (value as ClassStatus) || undefined });
    },
    [onFilterChange]
  );

  const handleYearChange = useCallback(
    (value: string | number) => {
      onFilterChange({ academic_year: (value as string) || undefined });
    },
    [onFilterChange]
  );

  const handleTeacherChange = useCallback(
    (value: string | number) => {
      onFilterChange({ form_teacher_id: (value as string) || undefined });
    },
    [onFilterChange]
  );

  const getActiveFilterTags = () => {
    const tags: Array<{ key: string; label: string; onRemove: () => void }> = [];

    if (filters.level) {
      tags.push({
        key: "level",
        label: `Level: ${filters.level}`,
        onRemove: () => onFilterChange({ level: undefined }),
      });
    }

    if (filters.stream) {
      tags.push({
        key: "stream",
        label: `Stream: ${filters.stream}`,
        onRemove: () => onFilterChange({ stream: undefined }),
      });
    }

    if (filters.status && filters.status !== "active") {
      tags.push({
        key: "status",
        label: `Status: ${filters.status}`,
        onRemove: () => onFilterChange({ status: undefined }),
      });
    }

    if (filters.academic_year) {
      tags.push({
        key: "academic_year",
        label: `Year: ${filters.academic_year}`,
        onRemove: () => onFilterChange({ academic_year: undefined }),
      });
    }

    if (filters.form_teacher_id) {
      const teacher = teachers.find((t) => t.id === filters.form_teacher_id);
      tags.push({
        key: "form_teacher_id",
        label: `Teacher: ${teacher?.name || "Unknown"}`,
        onRemove: () => onFilterChange({ form_teacher_id: undefined }),
      });
    }

    return tags;
  };

  const activeFilterTags = getActiveFilterTags();

  return (
    <div className="space-y-3">
      {/* Top bar with search and actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchInput
            value={filters.search || ""}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by class name or code..."
            debounceMs={300}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={showFilters || hasActiveFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center">
                {activeFilterTags.length}
              </span>
            )}
          </Button>

          {onExport && (
            <Button variant="outline" onClick={onExport} className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-stone-50 dark:bg-stone-900/50 rounded-xl border border-stone-200 dark:border-stone-800 animate-slide-down">
          <Select
            label="Level"
            options={[
              { value: "", label: "All Levels" },
              { value: "JSS1", label: "JSS 1" },
              { value: "JSS2", label: "JSS 2" },
              { value: "JSS3", label: "JSS 3" },
              { value: "SS1", label: "SS 1" },
              { value: "SS2", label: "SS 2" },
              { value: "SS3", label: "SS 3" },
            ]}
            value={filters.level || ""}
            onChange={handleLevelChange}
            placeholder="Select level"
          />

          <Select
            label="Stream"
            options={[
              { value: "", label: "All Streams" },
              { value: "Science", label: "Science" },
              { value: "Arts", label: "Arts" },
              { value: "Commercial", label: "Commercial" },
            ]}
            value={filters.stream || ""}
            onChange={handleStreamChange}
            placeholder="Select stream"
          />

          <Select
            label="Status"
            options={[
              { value: "", label: "All Statuses" },
              { value: "active", label: "Active" },
              { value: "archived", label: "Archived" },
            ]}
            value={filters.status || ""}
            onChange={handleStatusChange}
            placeholder="Select status"
          />

          <Select
            label="Academic Year"
            options={[
              { value: "", label: "All Years" },
              ...academicYears.map((year) => ({ value: year, label: year })),
            ]}
            value={filters.academic_year || ""}
            onChange={handleYearChange}
            placeholder="Select year"
          />

          <Select
            label="Form Teacher"
            options={[
              { value: "", label: "All Teachers" },
              ...teachers.map((t) => ({ value: t.id, label: t.name })),
            ]}
            value={filters.form_teacher_id || ""}
            onChange={handleTeacherChange}
            placeholder="Select teacher"
            searchable
            searchPlaceholder="Search teachers..."
          />
        </div>
      )}

      {/* Active filter tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-500">Active filters:</span>
          {activeFilterTags.map((tag) => (
            <Badge key={tag.key} variant="neutral" size="sm" className="gap-1 pl-2 pr-1">
              {tag.label}
              <button
                onClick={tag.onRemove}
                className="p-0.5 hover:bg-black/10 rounded-full transition-colors"
                aria-label={`Remove ${tag.label} filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-slate-500 hover:text-slate-700"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}

export default ClassFiltersBar;
