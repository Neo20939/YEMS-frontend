"use client"

import * as React from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { cn } from "@/lib/utils"

type TabType = 'general' | 'email' | 'security' | 'appearance' | 'notifications' | 'backup'

interface SystemSettings {
  // General
  siteName: string
  siteDescription: string
  timezone: string
  language: string
  dateFormat: string
  academicYear: string
  
  // Email
  smtpHost: string
  smtpPort: string
  smtpUser: string
  smtpFromEmail: string
  smtpFromName: string
  enableEmailNotifications: boolean
  
  // Security
  sessionTimeout: number
  maxLoginAttempts: number
  passwordMinLength: number
  requireTwoFactor: boolean
  allowRememberMe: boolean
  
  // Appearance
  theme: 'light' | 'dark' | 'auto'
  primaryColor: string
  logoUrl: string
  faviconUrl: string
  
  // Notifications
  enableEmailAlerts: boolean
  enableSmsAlerts: boolean
  enablePushNotifications: boolean
  alertOnUserRegistration: boolean
  alertOnExamCreation: boolean
  alertOnFailedLogins: boolean
  
  // Backup
  autoBackupEnabled: boolean
  backupFrequency: 'daily' | 'weekly' | 'monthly'
  backupRetention: number
  lastBackupDate?: string
}

const defaultSettings: SystemSettings = {
  // General
  siteName: 'Yeshua High School',
  siteDescription: 'Excellence in Education',
  timezone: 'Africa/Lagos',
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  academicYear: '2025/2026',
  
  // Email
  smtpHost: 'smtp.gmail.com',
  smtpPort: '587',
  smtpUser: 'noreply@yems.local',
  smtpFromEmail: 'noreply@yems.local',
  smtpFromName: 'YEMS System',
  enableEmailNotifications: true,
  
  // Security
  sessionTimeout: 60,
  maxLoginAttempts: 5,
  passwordMinLength: 8,
  requireTwoFactor: false,
  allowRememberMe: true,
  
  // Appearance
  theme: 'light',
  primaryColor: '#4F46E5',
  logoUrl: '/yhs.png',
  faviconUrl: '/favicon.ico',
  
  // Notifications
  enableEmailAlerts: true,
  enableSmsAlerts: false,
  enablePushNotifications: true,
  alertOnUserRegistration: true,
  alertOnExamCreation: true,
  alertOnFailedLogins: true,
  
  // Backup
  autoBackupEnabled: true,
  backupFrequency: 'daily',
  backupRetention: 30,
  lastBackupDate: new Date().toISOString(),
}

const timezones = [
  { value: 'Africa/Lagos', label: 'West Africa Standard Time (WAST)' },
  { value: 'Africa/Nairobi', label: 'East Africa Time (EAT)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST)' },
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' },
]

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'sw', label: 'Swahili' },
]

const dateFormats = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
]

export default function SystemSettingsPage() {
  const [settings, setSettings] = React.useState<SystemSettings>(defaultSettings)
  const [activeTab, setActiveTab] = React.useState<TabType>('general')
  const [isSaving, setIsSaving] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [hasChanges, setHasChanges] = React.useState(false)
  
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'general', label: 'General', icon: 'settings' },
    { id: 'email', label: 'Email', icon: 'email' },
    { id: 'security', label: 'Security', icon: 'security' },
    { id: 'appearance', label: 'Appearance', icon: 'palette' },
    { id: 'notifications', label: 'Notifications', icon: 'notifications' },
    { id: 'backup', label: 'Backup & Restore', icon: 'backup' },
  ]
  
  const handleSettingChange = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
    setSuccess(false)
  }
  
  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSaving(false)
    setSuccess(true)
    setHasChanges(false)
    
    // Store in localStorage for persistence
    localStorage.setItem('system_settings', JSON.stringify(settings))
  }
  
  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      setSettings(defaultSettings)
      setHasChanges(true)
    }
  }
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">General Settings</h3>
              <p className="text-sm text-slate-500 mb-6">Configure basic system information and preferences</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Site Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
                />
              </div>
              
              {/* Site Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Site Description
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                  rows={2}
                  className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100 resize-none"
                />
              </div>
              
              {/* Timezone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
                >
                  {timezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Language */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Date Format */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Date Format
                </label>
                <select
                  value={settings.dateFormat}
                  onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                  className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
                >
                  {dateFormats.map((fmt) => (
                    <option key={fmt.value} value={fmt.value}>{fmt.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Academic Year */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={settings.academicYear}
                  onChange={(e) => handleSettingChange('academicYear', e.target.value)}
                  placeholder="e.g., 2025/2026"
                  className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        )
        
      case 'email':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Email Configuration</h3>
              <p className="text-sm text-slate-500 mb-6">Set up SMTP server for system emails</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SMTP Host */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  SMTP Host
                </label>
                <input
                  type="text"
                  value={settings.smtpHost}
                  onChange={(e) => handleSettingChange('smtpHost', e.target.value)}
                  placeholder="smtp.gmail.com"
                  className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
                />
              </div>
              
              {/* SMTP Port */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  SMTP Port
                </label>
                <input
                  type="text"
                  value={settings.smtpPort}
                  onChange={(e) => handleSettingChange('smtpPort', e.target.value)}
                  placeholder="587"
                  className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
                />
              </div>
              
              {/* SMTP User */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  SMTP Username
                </label>
                <input
                  type="text"
                  value={settings.smtpUser}
                  onChange={(e) => handleSettingChange('smtpUser', e.target.value)}
                  className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
                />
              </div>
              
              {/* From Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  From Email
                </label>
                <input
                  type="email"
                  value={settings.smtpFromEmail}
                  onChange={(e) => handleSettingChange('smtpFromEmail', e.target.value)}
                  className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
                />
              </div>
              
              {/* From Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  From Name
                </label>
                <input
                  type="text"
                  value={settings.smtpFromName}
                  onChange={(e) => handleSettingChange('smtpFromName', e.target.value)}
                  className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
                />
              </div>
              
              {/* Enable Email Notifications */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableEmailNotifications}
                    onChange={(e) => handleSettingChange('enableEmailNotifications', e.target.checked)}
                    className="size-5 rounded border-stone-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Enable Email Notifications
                  </span>
                </label>
                <p className="text-xs text-slate-500 mt-1 ml-8">
                  Send system notifications via email
                </p>
              </div>
            </div>
            
            {/* Test Email */}
            <div className="border-t border-stone-200 dark:border-stone-800 pt-6">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm">
                <span className="material-symbols-outlined text-lg">send</span>
                Send Test Email
              </button>
            </div>
          </div>
        )
        
      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Security Settings</h3>
              <p className="text-sm text-slate-500 mb-6">Configure authentication and security policies</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Session Timeout */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
                />
              </div>
              
              {/* Max Login Attempts */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                  className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
                />
              </div>
              
              {/* Password Min Length */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Minimum Password Length
                </label>
                <input
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
                  min={6}
                  max={20}
                  className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
                />
              </div>
              
              {/* Require Two Factor */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.requireTwoFactor}
                    onChange={(e) => handleSettingChange('requireTwoFactor', e.target.checked)}
                    className="size-5 rounded border-stone-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Require Two-Factor Authentication
                  </span>
                </label>
              </div>
              
              {/* Allow Remember Me */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowRememberMe}
                    onChange={(e) => handleSettingChange('allowRememberMe', e.target.checked)}
                    className="size-5 rounded border-stone-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Allow "Remember Me" Option
                  </span>
                </label>
                <p className="text-xs text-slate-500 mt-1 ml-8">
                  Let users stay logged in across browser sessions
                </p>
              </div>
            </div>
          </div>
        )
        
      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Appearance Settings</h3>
              <p className="text-sm text-slate-500 mb-6">Customize the look and feel of your system</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Theme */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['light', 'dark', 'auto'] as const).map((theme) => (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => handleSettingChange('theme', theme)}
                      className={cn(
                        "py-3 rounded-xl border-2 font-semibold transition-all capitalize",
                        settings.theme === theme
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-stone-200 dark:border-stone-700 hover:border-stone-300"
                      )}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Primary Color */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Primary Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                    className="size-12 rounded-xl border-2 border-stone-200 dark:border-stone-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                    className="flex-1 bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>
              
              {/* Logo URL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Logo URL
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={settings.logoUrl}
                    onChange={(e) => handleSettingChange('logoUrl', e.target.value)}
                    className="flex-1 bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
                  />
                  {settings.logoUrl && (
                    <img src={settings.logoUrl} alt="Logo preview" className="size-12 rounded-lg object-contain bg-white border border-stone-200" />
                  )}
                </div>
              </div>
            </div>
          </div>
        )
        
      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Notification Settings</h3>
              <p className="text-sm text-slate-500 mb-6">Configure how and when users receive notifications</p>
            </div>
            
            <div className="space-y-4">
              {/* Enable Email Alerts */}
              <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Email Alerts</p>
                  <p className="text-xs text-slate-500">Send notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableEmailAlerts}
                    onChange={(e) => handleSettingChange('enableEmailAlerts', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              {/* Enable SMS Alerts */}
              <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">SMS Alerts</p>
                  <p className="text-xs text-slate-500">Send notifications via SMS</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableSmsAlerts}
                    onChange={(e) => handleSettingChange('enableSmsAlerts', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              
              {/* Enable Push Notifications */}
              <div className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Push Notifications</p>
                  <p className="text-xs text-slate-500">Browser push notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enablePushNotifications}
                    onChange={(e) => handleSettingChange('enablePushNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
            
            {/* Alert Triggers */}
            <div className="border-t border-stone-200 dark:border-stone-800 pt-6">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Alert Triggers</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.alertOnUserRegistration}
                    onChange={(e) => handleSettingChange('alertOnUserRegistration', e.target.checked)}
                    className="size-5 rounded border-stone-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Alert on new user registration
                  </span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.alertOnExamCreation}
                    onChange={(e) => handleSettingChange('alertOnExamCreation', e.target.checked)}
                    className="size-5 rounded border-stone-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Alert on exam creation
                  </span>
                </label>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.alertOnFailedLogins}
                    onChange={(e) => handleSettingChange('alertOnFailedLogins', e.target.checked)}
                    className="size-5 rounded border-stone-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    Alert on failed login attempts
                  </span>
                </label>
              </div>
            </div>
          </div>
        )
        
      case 'backup':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Backup & Restore</h3>
              <p className="text-sm text-slate-500 mb-6">Manage system backups and data recovery</p>
            </div>
            
            {/* Backup Status */}
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                <div>
                  <p className="text-sm font-bold text-emerald-800 dark:text-emerald-400">Last Backup Successful</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-500">
                    {settings.lastBackupDate ? new Date(settings.lastBackupDate).toLocaleString() : 'No backup yet'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Auto Backup */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoBackupEnabled}
                    onChange={(e) => handleSettingChange('autoBackupEnabled', e.target.checked)}
                    className="size-5 rounded border-stone-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Enable Automatic Backups
                  </span>
                </label>
              </div>
              
              {/* Backup Frequency */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Backup Frequency
                </label>
                <select
                  value={settings.backupFrequency}
                  onChange={(e) => handleSettingChange('backupFrequency', e.target.value as 'daily' | 'weekly' | 'monthly')}
                  className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              {/* Backup Retention */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Retention Period (days)
                </label>
                <input
                  type="number"
                  value={settings.backupRetention}
                  onChange={(e) => handleSettingChange('backupRetention', parseInt(e.target.value))}
                  className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
            
            {/* Backup Actions */}
            <div className="border-t border-stone-200 dark:border-stone-800 pt-6">
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors text-sm">
                  <span className="material-symbols-outlined text-lg">backup</span>
                  Create Backup Now
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm">
                  <span className="material-symbols-outlined text-lg">restore</span>
                  Restore from Backup
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm">
                  <span className="material-symbols-outlined text-lg">download</span>
                  Download Backup
                </button>
              </div>
            </div>
          </div>
        )
        
      default:
        return null
    }
  }
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              System Settings
            </h2>
            <p className="text-slate-500 mt-1">
              Configure and customize your system preferences
            </p>
          </div>
        </div>
        
        {/* Success Message */}
        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-700">
              <span className="material-symbols-outlined">check_circle</span>
              <p className="font-semibold">Settings saved successfully!</p>
            </div>
          </div>
        )}
        
        {/* Tabs */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex overflow-x-auto border-b border-stone-200 dark:border-stone-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors border-b-2",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                <span className="material-symbols-outlined">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleReset}
            className="px-6 py-3 border border-rose-200 text-rose-600 font-semibold rounded-xl hover:bg-rose-50 transition-colors"
          >
            Reset to Defaults
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setSettings(defaultSettings)
                setHasChanges(false)
              }}
              className="px-6 py-3 border border-stone-200 dark:border-stone-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                  Saving...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">save</span>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
