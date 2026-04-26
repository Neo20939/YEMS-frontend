/**
 * Centralized Role Mapping
 * Single source of truth for role ID to role name mapping
 * Backend uses numeric role IDs (1-12). Frontend maps these to normalized role names.
 */

export const ROLE_ID_MAP: Record<number, string> = {
  1: 'admin',
  2: 'technician',
  3: 'subject_teacher',
  4: 'class_teacher',
  5: 'finance_staff',
  6: 'reserved',
  7: 'student_js1',
  8: 'student_js2',
  9: 'student_js3',
  10: 'student_ss1',
  11: 'student_ss2',
  12: 'student_ss3',
}

/**
 * Normalize a role ID or role name to a standard frontend role
 */
export function normalizeRole(role: number | string | undefined): string {
  if (!role) return 'student'
  
  if (typeof role === 'number') {
    return ROLE_ID_MAP[role] || 'student'
  }
  
  const normalized = role.toString().toLowerCase().trim()
  
  // Already a normalized role name
  if (['admin', 'technician', 'subject_teacher', 'class_teacher', 'finance_staff', 'student'].includes(normalized)) {
    return normalized
  }
  
  // Try to parse as number
  const roleNum = parseInt(normalized)
  if (!isNaN(roleNum)) {
    return ROLE_ID_MAP[roleNum] || 'student'
  }
  
  return 'student'
}

/**
 * Check if a role is a student variant
 */
export function isStudentRole(role: string): boolean {
  return normalizeRole(role) === 'student'
}

/**
 * Check if a role is an admin variant
 */
export function isAdminRole(role: string): boolean {
  const normalized = normalizeRole(role)
  return normalized === 'admin'
}

/**
 * Check if a role is a teacher variant
 */
export function isTeacherRole(role: string): boolean {
  const normalized = normalizeRole(role)
  return normalized === 'subject_teacher' || normalized === 'class_teacher'
}
