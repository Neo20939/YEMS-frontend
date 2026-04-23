"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Modal, Input, Select, Button } from "@/components/ui";
import type { ClassLevel, AcademicYear, Department } from "@/lib/api/academic-client";
import { getClassLevels, getAcademicYears, getDepartments } from "@/lib/api/academic-client";

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClassCreateInput | ClassUpdateInput) => Promise<void>;
  classToEdit?: Class | null;
  initialAcademicYear?: string;
  loading?: boolean;
}

interface Class {
  id: string;
  class_name: string;
  class_level: string;
  level: string;
  stream?: string;
  max_capacity: number;
  academic_year: string;
  form_teacher_id?: string;
  department_id?: string;
  status?: 'active' | 'archived';
}

interface ClassCreateInput {
  classLevelId: string;
  academicYearId: string;
  name?: string;
  arm?: string;
  departmentId?: string | null;
  capacity?: number | null;
  isActive?: boolean;
}

interface ClassUpdateInput {
  name?: string;
  arm?: string;
  classLevelId?: string;
  departmentId?: string | null;
  capacity?: number | null;
  isActive?: boolean;
}

const LEVELS = [
  { value: "JS1", label: "JSS 1" },
  { value: "JS2", label: "JSS 2" },
  { value: "JS3", label: "JSS 3" },
  { value: "SS1", label: "SS 1" },
  { value: "SS2", label: "SS 2" },
  { value: "SS3", label: "SS 3" },
];

export default function ClassFormModal({
  isOpen,
  onClose,
  onSubmit,
  classToEdit,
  initialAcademicYear = "2024/2025",
  loading,
}: ClassFormModalProps) {
  const [className, setClassName] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [level, setLevel] = useState("");
  const [stream, setStream] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [capacity, setCapacity] = useState("40");
  const [useGeneratedName, setUseGeneratedName] = useState(false);
  const [arm, setArm] = useState("A");
  const [isActive, setIsActive] = useState(true);

  const [classLevels, setClassLevels] = useState<ClassLevel[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const prevIsOpen = useRef(isOpen);
  const isEditMode = !!classToEdit;

  const debug = useCallback((msg: string) => {
    console.log(`[ClassFormModal] ${msg}`);
    setDebugLog(prev => [...prev.slice(-10), msg]);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    async function loadData() {
      try {
        debug("Loading API data...");
        const [levelsRes, yearsRes, deptsRes] = await Promise.all([
          getClassLevels(),
          getAcademicYears(),
          getDepartments(),
        ]);

        const levels = Array.isArray(levelsRes) ? levelsRes : (levelsRes as any)?.data || [];
        const years = Array.isArray(yearsRes) ? yearsRes : (yearsRes as any)?.data || [];
        const depts = Array.isArray(deptsRes) ? deptsRes : (deptsRes as any)?.data || [];

        setClassLevels(levels);
        setAcademicYears(years);
        setDepartments(depts);

        debug(`Loaded: ${levels.length} levels, ${years.length} years, ${depts.length} departments`);
      } catch (error) {
        debug(`Error loading data: ${error}`);
        console.error("[ClassFormModal] Failed to load API data:", error);
      }
    }

    loadData();
  }, [isOpen, debug]);

  useEffect(() => {
    if (prevIsOpen.current === false && isOpen === true) {
      if (classToEdit) {
        setClassName(classToEdit.class_name);
        setAcademicYear(classToEdit.academic_year);
        setLevel(classToEdit.level);
        setDepartmentId(classToEdit.department_id || "");
        setCapacity(classToEdit.max_capacity.toString());
        setIsActive(classToEdit.status === 'active' ? true : false);
        setUseGeneratedName(false);
        setArm("A");
      } else {
        setClassName("");
        setAcademicYear(initialAcademicYear);
        setLevel("");
        setDepartmentId("");
        setCapacity("40");
        setIsActive(true);
        setUseGeneratedName(false);
        setArm("A");
      }
      setErrors({});
      setDebugLog([]);
      debug("Form reset for " + (classToEdit ? "edit" : "create") + " mode");
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, classToEdit, initialAcademicYear, debug]);

  const validateField = useCallback((field: string, value: string): string => {
    switch (field) {
      case "className":
        if (!value.trim()) return "Class name is required";
        if (value.trim().length < 2) return "Class name must be at least 2 characters";
        if (!/^[a-zA-Z0-9\s\-_]+$/.test(value)) return "Only letters, numbers, spaces, hyphens allowed";
        break;
      case "academicYear":
        if (!value) return "Academic year is required";
        break;
      case "level":
        if (!value) return "Level is required";
        break;
      case "department":
        if (level.startsWith("SS") && !value) return "Department is required for SS classes";
        break;
      case "capacity":
        const cap = parseInt(value, 10);
        if (isNaN(cap) || cap < 1 || cap > 200) return "Capacity must be 1-200";
        break;
      case "arm":
        if (useGeneratedName && !value.trim()) return "Arm/stream suffix is required for generated names";
        break;
    }
    return "";
  }, [level, useGeneratedName]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (useGeneratedName) {
      const armErr = validateField("arm", arm);
      if (armErr) newErrors.arm = armErr;
    } else {
      const nameErr = validateField("className", className);
      if (nameErr) newErrors.className = nameErr;
    }

    const yearErr = validateField("academicYear", academicYear);
    if (yearErr) newErrors.academicYear = yearErr;

    const levelErr = validateField("level", level);
    if (levelErr) newErrors.level = levelErr;

    const deptErr = validateField("department", departmentId);
    if (deptErr) newErrors.department = deptErr;

    const capErr = validateField("capacity", capacity);
    if (capErr) newErrors.capacity = capErr;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      debug("Validation failed: " + JSON.stringify(newErrors));
    }

    return Object.keys(newErrors).length === 0;
  }, [className, academicYear, level, departmentId, capacity, arm, useGeneratedName, validateField, debug]);

  const findClassLevelId = useCallback((levelValue: string): string | null => {
    if (!levelValue || classLevels.length === 0) {
      debug(`No classLevels loaded, cannot find ID for ${levelValue}`);
      return null;
    }

    const exact = classLevels.find(l => l.name === levelValue);
    if (exact) {
      debug(`Found classLevelId (exact): ${exact.id}`);
      return exact.id;
    }

    const normalized = levelValue.replace(" ", "");
    const normMatch = classLevels.find(l => l.name?.replace(" ", "") === normalized);
    if (normMatch) {
      debug(`Found classLevelId (normalized): ${normMatch.id}`);
      return normMatch.id;
    }

    const prefix = classLevels.find(l => {
      const name = l.name || "";
      return name.startsWith(normalized) || normalized.startsWith(name.replace(" ", ""));
    });
    if (prefix) {
      debug(`Found classLevelId (prefix): ${prefix.id}`);
      return prefix.id;
    }

    debug(`Could not find classLevelId for "${levelValue}". Available: ${JSON.stringify(classLevels.map(l => l.name))}`);
    return null;
  }, [classLevels, debug]);

  const findAcademicYearId = useCallback((yearValue: string): string | null => {
    if (!yearValue || academicYears.length === 0) {
      debug(`No academicYears loaded, cannot find ID for ${yearValue}`);
      return null;
    }

    const exact = academicYears.find(y => y.name === yearValue);
    if (exact) {
      debug(`Found academicYearId (exact): ${exact.id}`);
      return exact.id;
    }

    const partial = academicYears.find(y => y.name?.includes(yearValue.split("/")[0]));
    if (partial) {
      debug(`Found academicYearId (partial): ${partial.id}`);
      return partial.id;
    }

    debug(`Could not find academicYearId for "${yearValue}". Available: ${JSON.stringify(academicYears.map(y => y.name))}`);
    return null;
  }, [academicYears, debug]);

  const generateClassName = useCallback((levelValue: string, armValue: string, deptId: string, depts: Department[]): string => {
    const isSS = levelValue.startsWith("SS");
    if (isSS) {
      const dept = depts.find(d => d.id === deptId);
      const deptName = dept ? dept.name : "";
      return `${levelValue} ${deptName} ${armValue}`.trim().replace(/\s+/g, " ");
    }
    return `${levelValue}${armValue}`;
  }, []);

  const derivedClassName = useMemo(() => {
    if (!useGeneratedName || !level || !arm) return "";
    const deptId = departmentId || departments.find(d => d.name === stream)?.id || "";
    return generateClassName(level, arm, deptId, departments);
  }, [useGeneratedName, level, arm, departmentId, stream, departments, generateClassName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    debug("=== SUBMIT CLICKED ===");

    if (!validateForm()) {
      debug("Form validation failed, not submitting");
      return;
    }

    setIsSubmitting(true);

     try {
       const classLevelId = findClassLevelId(level);
       const academicYearId = findAcademicYearId(academicYear);

       debug(`Level: ${level} -> ${classLevelId}`);
       debug(`Year: ${academicYear} -> ${academicYearId}`);

       if (!classLevelId) {
         alert(`Could not find class level "${level}". Please refresh the page and try again.`);
         debug("FAILED: No classLevelId");
         setIsSubmitting(false);
         return;
       }

       if (!academicYearId) {
         alert(`Could not find academic year "${academicYear}". Please refresh the page and try again.`);
         debug("FAILED: No academicYearId");
         setIsSubmitting(false);
         return;
       }

       const isSeniorSecondary = level.startsWith("SS");

       if (isEditMode) {
         // UPDATE mode — only mutable fields
         const updatePayload: ClassUpdateInput = {
           isActive,
         };

         // Choose naming source
         if (useGeneratedName) {
           updatePayload.arm = arm;
           updatePayload.name = undefined; // Don't send name when using arm
         } else {
           updatePayload.name = className.trim();
           updatePayload.arm = undefined;
         }

         // Department handling
         if (isSeniorSecondary) {
           if (!departmentId) {
             alert("Department is required for senior secondary classes");
             setIsSubmitting(false);
             return;
           }
           updatePayload.departmentId = departmentId;
         } else {
           updatePayload.departmentId = null; // Clear department for JS (backend rejects)
         }

         updatePayload.capacity = parseInt(capacity, 10) || null;

         debug("Submitting update: " + JSON.stringify(updatePayload));
         await onSubmit(updatePayload);
       } else {
         // CREATE mode
         const createPayload: ClassCreateInput = {
           classLevelId,
           academicYearId,
           capacity: parseInt(capacity, 10) || null,
           isActive: true,
         };

         if (useGeneratedName) {
           createPayload.arm = arm;
           // name derived by backend
         } else {
           createPayload.name = className.trim();
         }

         if (isSeniorSecondary) {
           if (!departmentId) {
             alert("Department is required for senior secondary classes");
             setIsSubmitting(false);
             return;
           }
           createPayload.departmentId = departmentId;
         } else {
           createPayload.departmentId = undefined; // Omit for JS levels
         }

         debug("Submitting create: " + JSON.stringify(createPayload));
         await onSubmit(createPayload);
       }

       debug("SUCCESS: Class created/updated");
       handleClose();
     } catch (error) {
      debug(`ERROR: ${error}`);
      console.error("[ClassFormModal] Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const isFormValid =
    !!academicYear &&
    !!level &&
    !!capacity &&
    parseInt(capacity, 10) >= 1 &&
    parseInt(capacity, 10) <= 200 &&
    (useGeneratedName
      ? arm.trim().length > 0
      : className.trim().length >= 2);

  const showDepartment = level.startsWith("SS");

  const filteredDepartments = showDepartment
    ? departments.map(d => ({ value: d.id, label: d.name, description: d.code }))
    : [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? `Edit ${classToEdit?.class_name}` : "Create New Class"}
      description={isEditMode ? "Update class details" : "Add a new class to the system"}
      size="md"
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
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
        {/* Debug Log */}
        {process.env.NODE_ENV === "development" && debugLog.length > 0 && (
          <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-xs font-mono">
            {debugLog.map((log, i) => (
              <div key={i} className="text-slate-600 dark:text-slate-400">{log}</div>
            ))}
          </div>
        )}

        {/* Naming Strategy Toggle — Create mode only */}
        {!isEditMode && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Naming Strategy <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setUseGeneratedName(false); setClassName(""); }}
                className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  !useGeneratedName
                    ? "border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-500/10"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                Custom Name
              </button>
              <button
                type="button"
                onClick={() => { setUseGeneratedName(true); setArm("A"); }}
                className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  useGeneratedName
                    ? "border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-500/10"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                Auto-Generated
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              {useGeneratedName
                ? "Class name will be auto-generated from level, department (if SS), and arm suffix"
                : "Enter a custom name for this class (e.g., 'JS1 Gold')"}
            </p>
          </div>
        )}

        {/* Class Name OR Arm Selector */}
        {useGeneratedName ? (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Arm / Stream Suffix <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {['A', 'B', 'C', 'D', 'E'].map(letter => (
                <button
                  key={letter}
                  type="button"
                  onClick={() => setArm(letter)}
                  className={`w-12 h-10 rounded-lg border-2 text-sm font-bold transition-all ${
                    arm === letter
                      ? "border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-500/10"
                      : "border-slate-200 dark:border-slate-700 hover:border-rose-300"
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
            {derivedClassName && (
              <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500 mb-1">Generated class name:</p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{derivedClassName}</p>
              </div>
            )}
            {errors.arm && <p className="mt-1 text-sm text-red-500">{errors.arm}</p>}
          </div>
        ) : (
          <Input
            label="Class Name"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder={isEditMode ? "" : "e.g., JS1 Gold, SS1 Science A"}
            error={!!errors.className}
            errorMessage={errors.className}
            helperText={isEditMode ? "Update the display name" : "Custom name for this class"}
            required={!useGeneratedName}
          />
        )}

        {/* Academic Year */}
        <Select
          label="Academic Year"
          value={academicYear}
          onChange={(value) => setAcademicYear(value as string)}
          options={academicYears.map(y => ({
            value: y.name,
            label: y.name,
            description: y.isCurrent ? "Current" : undefined,
          }))}
          placeholder="Select year"
          error={!!errors.academicYear}
          errorMessage={errors.academicYear}
          required
        />

        {/* Level Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Level <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {LEVELS.map((lvl) => (
              <button
                key={lvl.value}
                type="button"
                onClick={() => {
                  setLevel(lvl.value);
                  setDepartmentId("");
                }}
                className={`px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                  level === lvl.value
                    ? "border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-500/10"
                    : "border-slate-200 dark:border-slate-700 hover:border-rose-300"
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
          {errors.level && <p className="mt-1 text-sm text-red-500">{errors.level}</p>}
        </div>

        {/* Department — only for SS levels */}
        {showDepartment && (
          <Select
            label="Department"
            value={departmentId}
            onChange={(value) => setDepartmentId(value as string)}
            options={filteredDepartments}
            placeholder="Select department"
            error={!!errors.department}
            errorMessage={errors.department}
            required
          />
        )}

        {/* Capacity */}
        <Input
          label="Maximum Capacity"
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          placeholder="40"
          min="1"
          max="200"
          error={!!errors.capacity}
          errorMessage={errors.capacity}
          helperText="Recommended: 30-50 students per class"
          required
        />

        {/* Active Status Toggle — Edit mode only */}
        {isEditMode && (
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Class Status</p>
              <p className="text-xs text-slate-500">Archived classes are hidden from enrollment</p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`w-14 h-8 rounded-full transition-colors relative ${
                isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
              }`}
              aria-label={isActive ? "Set inactive" : "Set active"}
            >
              <span
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${
                  isActive ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
        )}
      </form>
    </Modal>
  )
}
