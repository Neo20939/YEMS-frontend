export interface StatCardProps {
  title: string
  value: string
  subtext?: string
  icon: string
  color?: "primary" | "amber" | "rose" | "sage"
}

export interface Role {
  id: string
  name: string
  description: string
  users: number
  status: "active" | "inactive"
  icon: string
  iconColor: string
}

export interface PermissionMatrix {
  permission: string
  superAdmin: boolean
  teacher: boolean
  student: boolean
  registrar: boolean
}
