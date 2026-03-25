"use client"

import { useState } from "react"
import { Building, Bell, CreditCard, Shield, Users, Database, Key, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'school' | 'fees' | 'payments' | 'notifications' | 'users' | 'security' | 'backup'>('school')

  const tabs = [
    { id: 'school', label: 'School Info', icon: Building },
    { id: 'fees', label: 'Fee Structure', icon: CreditCard },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'users', label: 'User Roles', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'backup', label: 'Backup', icon: Database },
  ]

  return (
    <div className="pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between h-20">
            <div>
              <h1 className="text-2xl font-bold text-primary">Settings</h1>
              <p className="text-sm text-gray-500 mt-1">Configure your accountant portal</p>
            </div>
            <Button variant="default" size="default">
              Save Changes
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'school' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-soft p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">School Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
                    <input
                      type="text"
                      defaultValue="Yeshua High School"
                      className="w-full h-10 px-4 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">School Address</label>
                    <textarea
                      defaultValue="123 Education Street, Lagos, Nigeria"
                      rows={3}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        defaultValue="+234 800 123 4567"
                        className="w-full h-10 px-4 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="info@yeshuahighschool.edu.ng"
                        className="w-full h-10 px-4 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                    <select
                      defaultValue="2023-2024"
                      className="w-full h-10 px-4 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="2024-2025">2024-2025</option>
                      <option value="2023-2024">2023-2024</option>
                      <option value="2022-2023">2022-2023</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Term</label>
                    <select
                      defaultValue="second"
                      className="w-full h-10 px-4 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="first">First Term</option>
                      <option value="second">Second Term</option>
                      <option value="third">Third Term</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'fees' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-soft p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Fee Structure</h2>
                  <Button variant="default" size="sm">Add Fee Type</Button>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Tuition Fee', JSS1: '₦120,000', JSS2: '₦125,000', JSS3: '₦130,000', SS1: '₦140,000', SS2: '₦145,000', SS3: '₦150,000' },
                    { name: 'Accommodation Fee', JSS1: '₦50,000', JSS2: '₦50,000', JSS3: '₦50,000', SS1: '₦60,000', SS2: '₦60,000', SS3: '₦60,000' },
                    { name: 'Transport Fee', JSS1: '₦30,000', JSS2: '₦30,000', JSS3: '₦30,000', SS1: '₦35,000', SS2: '₦35,000', SS3: '₦35,000' },
                    { name: 'Lab Fee', JSS1: '₦10,000', JSS2: '₦10,000', JSS3: '₦15,000', SS1: '₦20,000', SS2: '₦20,000', SS3: '₦25,000' },
                  ].map((fee, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{fee.name}</h3>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">Delete</Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-6 gap-2 text-sm">
                        <div className="text-gray-500">JSS1: <span className="text-gray-900 font-medium">{fee.JSS1}</span></div>
                        <div className="text-gray-500">JSS2: <span className="text-gray-900 font-medium">{fee.JSS2}</span></div>
                        <div className="text-gray-500">JSS3: <span className="text-gray-900 font-medium">{fee.JSS3}</span></div>
                        <div className="text-gray-500">SS1: <span className="text-gray-900 font-medium">{fee.SS1}</span></div>
                        <div className="text-gray-500">SS2: <span className="text-gray-900 font-medium">{fee.SS2}</span></div>
                        <div className="text-gray-500">SS3: <span className="text-gray-900 font-medium">{fee.SS3}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-soft p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Payment Methods</h2>
                <div className="space-y-4">
                  {[
                    { name: 'Bank Transfer', enabled: true, details: 'Account: 1234567890, Bank: First Bank' },
                    { name: 'Card Payment', enabled: true, details: 'Paystack Integration Active' },
                    { name: 'Mobile Money', enabled: true, details: 'Flutterwave Integration Active' },
                    { name: 'Cash', enabled: true, details: 'Manual receipt required' },
                    { name: 'Cheque', enabled: false, details: 'Requires clearance period' },
                  ].map((method, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${method.enabled ? 'bg-emerald-50' : 'bg-gray-100'}`}>
                          <CreditCard className={`w-5 h-5 ${method.enabled ? 'text-emerald-600' : 'text-gray-400'}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{method.name}</h3>
                          <p className="text-sm text-gray-500">{method.details}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={method.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-soft p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Notification Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Notifications
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Payment received', description: 'Send email when payment is recorded', enabled: true },
                        { label: 'Overdue reminders', description: 'Send automated reminders to parents', enabled: true },
                        { label: 'Reconciliation alerts', description: 'Notify when bank deposits need matching', enabled: true },
                        { label: 'Report generation', description: 'Email when reports are ready', enabled: false },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.label}</p>
                            <p className="text-xs text-gray-500">{item.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                            <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      SMS Notifications
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Payment confirmation', description: 'Send SMS for payment receipts', enabled: true },
                        { label: 'Due date reminders', description: 'Remind parents before due date', enabled: true },
                        { label: 'Overdue alerts', description: 'Alert for overdue payments', enabled: true },
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.label}</p>
                            <p className="text-xs text-gray-500">{item.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                            <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-soft p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">User Roles & Permissions</h2>
                  <Button variant="default" size="sm">Add User</Button>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Admin User', email: 'admin@school.edu.ng', role: 'Accountant', permissions: 'Full Access', lastLogin: 'Today, 10:30 AM' },
                    { name: 'Finance Officer', email: 'finance@school.edu.ng', role: 'Finance Officer', permissions: 'View, Record Payments', lastLogin: 'Yesterday, 3:45 PM' },
                    { name: 'Principal', email: 'principal@school.edu.ng', role: 'Principal', permissions: 'Read-Only Reports', lastLogin: 'Mar 20, 2024' },
                    { name: 'Registrar', email: 'registrar@school.edu.ng', role: 'Registrar', permissions: 'View Overdue Students', lastLogin: 'Mar 19, 2024' },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{user.role}</p>
                        <p className="text-xs text-gray-500">{user.permissions}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">{user.lastLogin}</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-soft p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <Key className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-gray-900">Password Policy</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" />
                        <span className="text-sm text-gray-700">Minimum 12 characters</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" />
                        <span className="text-sm text-gray-700">Require uppercase letter</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" />
                        <span className="text-sm text-gray-700">Require number</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary" />
                        <span className="text-sm text-gray-700">Require special character</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Add an extra layer of security to your account</p>
                    <Button variant="outline" size="sm">Enable 2FA</Button>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <Database className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-gray-900">Login History</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>Today, 10:30 AM - Chrome on Windows</span>
                        <span className="text-emerald-600">Active</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>Yesterday, 3:45 PM - Chrome on Windows</span>
                        <span className="text-gray-400">Logged out</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'backup' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-soft p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Backup & Data</h2>
                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">Automatic Backups</h3>
                        <p className="text-sm text-gray-500">Daily backups at 2:00 AM WAT</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">Last backup: Today, 2:00 AM (125 MB)</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-2">Manual Backup</h3>
                      <p className="text-sm text-gray-500 mb-4">Create a backup now</p>
                      <Button variant="outline" size="sm" className="w-full">Backup Now</Button>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-2">Restore</h3>
                      <p className="text-sm text-gray-500 mb-4">Restore from previous backup</p>
                      <Button variant="outline" size="sm" className="w-full">Restore</Button>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-2">Export Data</h3>
                    <p className="text-sm text-gray-500 mb-4">Download all your financial data</p>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm">Export as CSV</Button>
                      <Button variant="outline" size="sm">Export as PDF</Button>
                      <Button variant="outline" size="sm">Export as Excel</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
