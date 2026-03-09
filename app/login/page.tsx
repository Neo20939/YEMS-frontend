"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Lock, Eye, EyeOff, ArrowLeft, BookOpen, FlaskConical, Trophy, Palette } from "lucide-react"
import { login, getRedirectPathByRole } from "@/lib/api/auth-client"
import type { ApiError } from "@/lib/api/auth-config"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      })

      console.log("=== LOGIN SUCCESS ===")
      console.log("Full response:", JSON.stringify(response, null, 2))
      console.log("User object:", response.user)
      
      // Handle different possible role field names
      const userRole = (response.user as any).role || 
                       (response.user as any).userType || 
                       (response.user as any).role_name || 
                       (response.user as any).user_role ||
                       'student'
      
      console.log("Detected user role:", userRole)

      // Redirect based on user role
      const redirectPath = getRedirectPathByRole(userRole)
      console.log("Calculated redirect path:", redirectPath)
      console.log("Navigating to:", redirectPath)
      
      // Force a hard navigation to ensure redirect works
      window.location.href = redirectPath
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || "Login failed. Please check your credentials.")
      console.error("Login error:", err)
      console.error("Full error:", JSON.stringify(err, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  return (
    <div className="min-h-screen flex font-sans antialiased">
      {/* Left Side - Branding Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-primary/80 dark:bg-primary/90 z-10 mix-blend-multiply"></div>
        <img
          alt="Beautiful university campus building"
          className="absolute inset-0 w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBizVqjWr2wJvrbjeK2GDkl8g3jcjW1mIJxPr7oYR1VdPoi8WPcB-rLXaKBph71zEuGXE9r6-KDiBpoSGlLe72S7qvkSROrjXmMvRK_A2GxJvgBFHWm2HoirfvOsdK4PtAxPI0tSyfejiCaLfwEwE-9q02reKiYtBO7_3ANWp3a4JNFlgnHmu4ZTAqqBh5bGN8y9vk4xhd9_rO-Xq7swH2DPCO0JTMgeuHKqoHyo4LMomC0gCdTaMtOFXzDlTEmR37kXUYXClW53qE"
        />
        <div className="relative z-20 flex flex-col justify-center items-center w-full p-12 text-center text-white">
          <h1 className="font-display text-5xl font-bold mb-4 tracking-tight">Yeshua High School</h1>
          <p className="text-xl mb-8 font-display italic text-accent">Christ-Centered Education Since 2005</p>
          <p className="text-2xl font-display mb-12 max-w-lg leading-relaxed">
            Jesus Our <span className="text-accent font-bold">Perfect</span> Example<br />
            We are one of the leading Christian co-educational secondary schools in Nigeria, focused on making education fun and practical for our students.
          </p>
          <div className="w-32 h-40 border-2 border-accent/50 rounded-b-full flex flex-col items-center justify-center p-4 relative bg-primary/40 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-2 w-full h-full pb-6">
              <div className="flex items-center justify-center">
                <BookOpen className="text-accent w-8 h-8" />
              </div>
              <div className="flex items-center justify-center border-l border-b border-accent/30">
                <FlaskConical className="text-white w-8 h-8" />
              </div>
              <div className="flex items-center justify-center border-r border-accent/30">
                <Trophy className="text-white w-8 h-8" />
              </div>
              <div className="flex items-center justify-center border-t border-accent/30">
                <Palette className="text-accent w-8 h-8" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-background-light dark:bg-background-dark">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold text-primary dark:text-white mb-2 font-display">
              School Portal Login
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Please sign in to access your account.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-sm">error</span>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="sr-only" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-gray-400 w-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none rounded relative block w-full px-3 py-4 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-gray-400 w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none rounded relative block w-full px-3 py-4 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 w-5 h-5" />
                  ) : (
                    <Eye className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 w-5 h-5" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-primary hover:text-primary/80 dark:text-blue-400 dark:hover:text-blue-300">
                  Forgot Password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          </form>

          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                Help Center
              </a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                Terms of Use
              </a>
            </div>
            <div className="mt-6 flex justify-center">
              <a href="/" className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
