"use client"

import * as React from "react"
import { useUser } from "@/contexts/UserContext"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { MonitoringPanel } from "@/components/technician/MonitoringPanel"
import { SystemLogsViewer } from "@/components/technician/SystemLogsViewer"
import { getRbacPolicies } from "@/lib/api/monitoring-client"

interface RBACPolicy {
  id: string
  name: string
  role: string
  permissions: string[]
  status: 'active' | 'inactive'
  userCount: number
  lastModified: string
}

export default function TechnicianDashboardPage() {
  const { user, isLoading: userLoading } = useUser()
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState<'overview' | 'logs' | 'rbac'>('overview')
  const [rbacPolicies, setRbacPolicies] = React.useState<RBACPolicy[]>([])
  const [isLoadingRbac, setIsLoadingRbac] = React.useState(false)
  const [selectedPolicy, setSelectedPolicy] = React.useState<RBACPolicy | null>(null)

  React.useEffect(() => {
    if (!userLoading && user) {
      // Handle role as either string or number
      const userRole = String(user.role).toLowerCase()
      if (userRole !== 'technician' && userRole !== 'platform_admin') {
        router.push('/dashboard')
      }
    }
  }, [user, userLoading, router])

  React.useEffect(() => {
    loadRbacPolicies()
  }, [])

  async function loadRbacPolicies() {
    setIsLoadingRbac(true)
    try {
      const result = await getRbacPolicies()
      if (result.success && result.data) {
        setRbacPolicies(result.data)
      } else {
        console.warn('Failed to load RBAC policies:', result.error)
      }
    } catch (error) {
      console.warn('Failed to load RBAC policies:', error)
    } finally {
      setIsLoadingRbac(false)
    }
  }

  const getPermissionBadgeColor = (permission: string) => {
    if (permission === '*') return 'bg-purple-100 text-purple-700'
    if (permission.includes('create')) return 'bg-emerald-100 text-emerald-700'
    if (permission.includes('update')) return 'bg-blue-100 text-blue-700'
    if (permission.includes('delete')) return 'bg-rose-100 text-rose-700'
    return 'bg-slate-100 text-slate-700'
  }

  const tabs = [
    { id: 'overview', label: 'Overview & Monitoring', icon: 'dashboard' },
    { id: 'logs', label: 'System Logs', icon: 'list_alt' },
    { id: 'rbac', label: 'RBAC Policies', icon: 'security' },
  ]

  if (userLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading technician dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-xl">engineering</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Technician Dashboard</h1>
                <p className="text-xs text-slate-500">System Maintenance & Monitoring</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="size-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || 'T'}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-slate-900">{user?.name || 'Technician'}</p>
                  <p className="text-xs text-slate-500 uppercase">{user?.role || 'technician'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  "flex items-center gap-2 py-4 px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-colors",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                )}
              >
                <span className="material-symbols-outlined">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <MonitoringPanel />
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <SystemLogsViewer />
          </div>
        )}

        {activeTab === 'rbac' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-4">RBAC Policies</h3>
              {rbacPolicies.length === 0 ? (
                <div className="text-center py-12">
                  <div className="size-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl text-slate-400">security</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No RBAC policies found</h3>
                  <p className="text-sm text-slate-500">The backend API did not return any policies</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rbacPolicies.map((policy) => (
                    <div
                      key={policy.id}
                      className="p-4 border border-slate-200 rounded-xl hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedPolicy(policy)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "size-10 rounded-lg flex items-center justify-center",
                            policy.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                          )}>
                            <span className="material-symbols-outlined text-sm">
                              {policy.status === 'active' ? 'check_circle' : 'cancel'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{policy.name}</p>
                            <p className="text-xs text-slate-500">{policy.role} • {policy.userCount} users</p>
                          </div>
                        </div>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-semibold capitalize",
                          policy.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        )}>
                          {policy.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Policy Detail Modal */}
      {selectedPolicy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Policy Details</h3>
              <button
                onClick={() => setSelectedPolicy(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-4">
              <div>
                <p className="text-sm text-slate-500">Policy Name</p>
                <p className="text-lg font-semibold text-slate-900">{selectedPolicy.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Role</p>
                  <p className="font-medium text-slate-900 capitalize">{selectedPolicy.role}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Users</p>
                  <p className="font-medium text-slate-900">{selectedPolicy.userCount}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-2">Permissions</p>
                <div className="flex flex-wrap gap-2">
                  {selectedPolicy.permissions.map((perm, idx) => (
                    <span
                      key={idx}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-semibold",
                        getPermissionBadgeColor(perm)
                      )}
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500">Last Modified</p>
                <p className="font-medium text-slate-900">
                  {new Date(selectedPolicy.lastModified).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
