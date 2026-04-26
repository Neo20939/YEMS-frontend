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
  6: 'student',
  7: 'student',
  8: 'student',
  9: 'student',
  10: 'student',
  11: 'student',
  12: 'student',
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
