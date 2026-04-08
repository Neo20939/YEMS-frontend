"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Modal, Input, Select, Button } from "@/components/ui";
import type { Class, ClassCreateInput, ClassUpdateInput, ClassLevel, ClassStream } from "@/types/class";
import { getClassLevels, getAcademicYears, getCurrentAcademicYear, ClassLevel as ApiClassLevel, AcademicYear } from "@/lib/api/academic-client";

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  classToEdit?: Class | null;
  academicYears?: string[];
  teachers?: Array<{ id: string; name: string; email: string }>;
  loading?: boolean;
}

const LEVELS: { value: ClassLevel; label: string }[] = [
  { value: "JSS1", label: "JSS 1" },
  { value: "JSS2", label: "JSS 2" },
  { value: "JSS3", label: "JSS 3" },
  { value: "SS1", label: "SS 1" },
  { value: "SS2", label: "SS 2" },
  { value: "SS3", label: "SS 3" },
];

const STREAMS: { value: ClassStream; label: string }[] = [
  { value: "Science", label: "Science" },
  { value: "Arts", label: "Arts" },
  { value: "Commercial", label: "Commercial" },
];

export default function ClassFormModal({
  isOpen,
  onClose,
  onSubmit,
  classToEdit,
  academicYears: propAcademicYears,
  teachers = [],
  loading,
}: ClassFormModalProps) {
  const [className, setClassName] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [level, setLevel] = useState<ClassLevel | "">("");
  const [stream, setStream] = useState<ClassStream | "">("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [formTeacherId, setFormTeacherId] = useState("");
  
  // API data for transformation
  const [classLevels, setClassLevels] = useState<ApiClassLevel[]>([]);
  const [academicYearsData, setAcademicYearsData] = useState<AcademicYear[]>([]);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine if we're in edit mode
  const isEditMode = !!classToEdit;

  // Track previous isOpen state to detect opening transitions
  const prevIsOpenRef = React.useRef<boolean>(isOpen);

  // Fetch class levels and academic years
  useEffect(() => {
    async function loadApiData() {
      try {
        const [levels, years] = await Promise.all([
          getClassLevels(),
          getAcademicYears()
        ]);
        // Handle both array response and object response { data: [...] }
        setClassLevels(Array.isArray(levels) ? levels : levels?.data || []);
        const yearsData = Array.isArray(years) ? years : years?.data || [];
        setAcademicYearsData(yearsData);
      } catch (error) {
        console.error('Failed to load class levels or academic years:', error);
        setClassLevels([]);
        setAcademicYearsData([]);
      }
    }
    if (isOpen) {
      loadApiData();
    }
  }, [isOpen]);

  // Populate form when editing or when modal opens
  useEffect(() => {
    // Only reset form when modal is opening (transitioning from closed to open)
    if (!prevIsOpenRef.current && isOpen) {
      if (classToEdit) {
        setClassName(classToEdit.class_name);
        setAcademicYear(classToEdit.academic_year);
        setLevel(classToEdit.level);
        setStream(classToEdit.stream);
        setMaxCapacity(classToEdit.max_capacity.toString());
        setFormTeacherId(classToEdit.form_teacher_id || "");
      } else {
        // Reset form for create mode - use stable default
        setClassName("");
        setAcademicYear(propAcademicYears?.[0] || "2024/2025");
        setLevel("");
        setStream("");
        setMaxCapacity("40");
        setFormTeacherId("");
      }
      setErrors({});
      setTouched({});
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, classToEdit, propAcademicYears]);

  // Validate field
  const validateField = useCallback((field: string, value: string) => {
    switch (field) {
      case "className":
        if (!value.trim()) return "Class name is required";
        if (value.trim().length < 2) return "Class name must be at least 2 characters";
        if (!/^[a-zA-Z0-9\s]+$/.test(value)) return "Class name can only contain letters, numbers, and spaces";
        break;
      case "academicYear":
        if (!value) return "Academic year is required";
        break;
      case "level":
        if (!value) return "Level is required";
        break;
      case "stream":
        if (!value) return "Stream is required";
        break;
      case "maxCapacity":
        if (!value) return "Maximum capacity is required";
        const capacity = parseInt(value, 10);
        if (isNaN(capacity) || capacity < 1 || capacity > 200) {
          return "Capacity must be between 1 and 200";
        }
        break;
      case "formTeacherId":
        if (!value) return "Form teacher is required";
        break;
    }
    return "";
  }, []);

  // Handle blur
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const classNameError = validateField("className", className);
    if (classNameError) newErrors.className = classNameError;

    const yearError = validateField("academicYear", academicYear);
    if (yearError) newErrors.academicYear = yearError;

    const levelError = validateField("level", level);
    if (levelError) newErrors.level = levelError;

    const streamError = validateField("stream", stream);
    if (streamError) newErrors.stream = streamError;

    const capacityError = validateField("maxCapacity", maxCapacity);
    if (capacityError) newErrors.maxCapacity = capacityError;

    const teacherError = validateField("formTeacherId", formTeacherId);
    if (teacherError) newErrors.formTeacherId = teacherError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      className: true,
      academicYear: true,
      level: true,
      stream: true,
      maxCapacity: true,
      formTeacherId: true,
    });

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Find the classLevelId from the selected level (match by partial name or code)
      const selectedLevel = classLevels.find(l => 
        l.name?.includes(level.replace('JSS', '').replace('SS', '')) || 
        l.name === level
      );
      
      const selectedYear = academicYearsData.find(y => 
        y.name === academicYear || y.name?.includes(academicYear.split('/')[0])
      );

      // Transform to backend API format with classLevelId and academicYearId
      const data = {
        name: className.trim(),
        level: level as ClassLevel,
        stream: stream as ClassStream,
        academic_year: academicYear,
        max_capacity: parseInt(maxCapacity, 10),
        form_teacher_id: formTeacherId || undefined,
        // Add classLevelId and academicYearId for the API
        classLevelId: selectedLevel?.id || "",
        academicYearId: selectedYear?.id || "",
      };

      await onSubmit(data);
      handleClose();
    } catch (error) {
      // Error is handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle close
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  // Check if form is valid
  const isFormValid =
    className.trim().length >= 2 &&
    academicYear !== "" &&
    level !== "" &&
    stream !== "" &&
    maxCapacity !== "" &&
    parseInt(maxCapacity, 10) >= 1 &&
    parseInt(maxCapacity, 10) <= 200 &&
    formTeacherId !== "";

  const teacherOptions = teachers.map((t) => ({
    value: t.id,
    label: t.name,
    description: t.email,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? `Edit ${classToEdit?.class_name}` : "New Class"}
      description={isEditMode ? "Update class information" : "Create a new class for the academic year"}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Create Class"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Class Name */}
        <Input
          label="Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          onBlur={() => handleBlur("className")}
          placeholder="e.g., Class 10A"
          error={touched.className && !!errors.className}
          errorMessage={touched.className ? errors.className : undefined}
          helperText="Enter a descriptive name for the class"
          required
        />

        {/* Academic Year */}
        <Select
          label="Academic Year"
          options={academicYearsData.map((year) => ({ value: year.name, label: year.name, description: year.isCurrent ? 'Current' : undefined }))}
          value={academicYear}
          onChange={(value) => setAcademicYear(value as string)}
          placeholder="Select academic year"
          error={touched.academicYear && !!errors.academicYear}
          errorMessage={touched.academicYear ? errors.academicYear : undefined}
          required
        />

        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Level <span className="text-primary">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {LEVELS.map((lvl) => (
              <button
                key={lvl.value}
                type="button"
                onClick={() => {
                  setLevel(lvl.value);
                  handleBlur("level");
                }}
                className={cn(
                  "px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all",
                  level === lvl.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-stone-200 dark:border-stone-700 hover:border-primary/50"
                )}
              >
                {lvl.label}
              </button>
            ))}
          </div>
          {touched.level && errors.level && (
            <p className="mt-1.5 text-sm text-red-600" role="alert">
              {errors.level}
            </p>
          )}
        </div>

        {/* Stream */}
        <Select
          label="Stream"
          options={STREAMS}
          value={stream}
          onChange={(value) => setStream(value as ClassStream)}
          placeholder="Select stream"
          error={touched.stream && !!errors.stream}
          errorMessage={touched.stream ? errors.stream : undefined}
          required
        />

        {/* Maximum Capacity */}
        <Input
          label="Maximum Capacity"
          type="number"
          min="1"
          max="200"
          value={maxCapacity}
          onChange={(e) => setMaxCapacity(e.target.value)}
          onBlur={() => handleBlur("maxCapacity")}
          placeholder="40"
          error={touched.maxCapacity && !!errors.maxCapacity}
          errorMessage={touched.maxCapacity ? errors.maxCapacity : undefined}
          helperText="Recommended: 30-50 students"
          required
        />

        {/* Form Teacher */}
        <Select
          label="Form Teacher"
          options={teacherOptions}
          value={formTeacherId}
          onChange={(value) => setFormTeacherId(value as string)}
          placeholder="Search teachers..."
          searchable
          searchPlaceholder="Search by name or email..."
          error={touched.formTeacherId && !!errors.formTeacherId}
          errorMessage={touched.formTeacherId ? errors.formTeacherId : undefined}
          required
          disabled={teachers.length === 0}
          clearable
        />
      </form>
    </Modal>
  );
}

// Import cn utility
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
