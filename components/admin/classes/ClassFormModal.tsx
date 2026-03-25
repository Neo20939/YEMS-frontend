"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Modal, Input, Select, Button } from "@/components/ui";
import type { Class, ClassCreateInput, ClassUpdateInput, ClassLevel, ClassStream } from "@/types/class";

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClassCreateInput | ClassUpdateInput) => Promise<void>;
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

export function ClassFormModal({
  isOpen,
  onClose,
  onSubmit,
  classToEdit,
  academicYears = ["2024/2025", "2023/2024", "2022/2023"],
  teachers = [],
  loading = false,
}: ClassFormModalProps) {
  const isEditMode = !!classToEdit;

  // Form state
  const [className, setClassName] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [level, setLevel] = useState<ClassLevel | "">("");
  const [stream, setStream] = useState<ClassStream | "">("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [formTeacherId, setFormTeacherId] = useState("");

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (classToEdit) {
      setClassName(classToEdit.class_name);
      setAcademicYear(classToEdit.academic_year);
      setLevel(classToEdit.level);
      setStream(classToEdit.stream);
      setMaxCapacity(classToEdit.max_capacity.toString());
      setFormTeacherId(classToEdit.form_teacher_id || "");
    } else {
      // Reset form for create mode
      setClassName("");
      setAcademicYear(academicYears[0] || "");
      setLevel("");
      setStream("");
      setMaxCapacity("40");
      setFormTeacherId("");
    }
    setErrors({});
    setTouched({});
  }, [classToEdit, isOpen, academicYears]);

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
      const data = {
        class_name: className.trim(),
        academic_year: academicYear,
        level: level as ClassLevel,
        stream: stream as ClassStream,
        max_capacity: parseInt(maxCapacity, 10),
        form_teacher_id: formTeacherId,
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
          disabled={isSubmitting}
        />

        {/* Academic Year */}
        <Select
          label="Academic Year"
          options={academicYears.map((year) => ({ value: year, label: year }))}
          value={academicYear}
          onChange={(value) => setAcademicYear(value as string)}
          placeholder="Select academic year"
          error={touched.academicYear && !!errors.academicYear}
          errorMessage={touched.academicYear ? errors.academicYear : undefined}
          required
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
          disabled={isSubmitting || teachers.length === 0}
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

export default ClassFormModal;
