import TeacherSidebar from "@/components/teachers/TeacherSidebar"
import TeacherHeader from "@/components/teachers/TeacherHeader"

export default function AssignmentsManagementPage() {
  return (
    <div className="min-h-screen bg-background-light">
      <TeacherSidebar />
      <div className="ml-20 transition-all duration-300">
        <TeacherHeader />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="bg-primary rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10">
                <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm mb-6 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  Academic Session 2024/2025
                </div>
                <h1 className="text-4xl font-bold mb-3">Assignments Management</h1>
                <p className="text-white/80 text-lg">Create, distribute, and grade assignments for your students.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full">
                  <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Create Assignment
                  </h2>
                  <form className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Title</label>
                      <input className="w-full rounded-xl border-gray-300 bg-transparent text-gray-900 focus:border-primary focus:ring-primary" placeholder="e.g. Chapter 4 Exercises" type="text"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target Class</label>
                      <select className="w-full rounded-xl border-gray-300 bg-transparent text-gray-900 focus:border-primary focus:ring-primary">
                        <option>Grade 10 - Mathematics</option>
                        <option>Grade 11 - Physics</option>
                        <option>Grade 12 - Chemistry</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deadline Date</label>
                        <input className="w-full rounded-xl border-gray-300 bg-transparent text-gray-900 focus:border-primary focus:ring-primary" type="date"/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input className="w-full rounded-xl border-gray-300 bg-transparent text-gray-900 focus:border-primary focus:ring-primary" type="time"/>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Points / Weight</label>
                      <input className="w-full rounded-xl border-gray-300 bg-transparent text-gray-900 focus:border-primary focus:ring-primary" placeholder="100" type="number"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                      <textarea className="w-full rounded-xl border-gray-300 bg-transparent text-gray-900 focus:border-primary focus:ring-primary" placeholder="Provide detailed instructions..." rows={4}></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-primary transition-colors cursor-pointer">
                        <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-gray-500">Click to upload files</p>
                      </div>
                    </div>
                    <button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-xl transition-colors mt-4" type="button">
                      Publish Assignment
                    </button>
                  </form>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Active Assignments</h2>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                      </button>
                      <div className="relative">
                        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input className="pl-9 py-2 rounded-lg border-gray-200 bg-gray-50 text-sm focus:border-primary focus:ring-primary dark:text-gray-900 w-48" placeholder="Search..." type="text"/>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                    <div className="p-4 rounded-2xl border border-gray-100 hover:border-primary/30 transition-colors bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            In Progress
                          </div>
                          <h3 className="font-bold text-lg text-gray-900">Algebraic Expressions Worksheet</h3>
                          <p className="text-sm text-gray-500">Grade 10 - Mathematics</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">Due: Tomorrow</div>
                          <div className="text-xs text-gray-500">11:59 PM</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">24/30 Submitted</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">50 Points</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-1.5 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 text-gray-700 transition-colors">Edit</button>
                          <button className="px-4 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">Grade Submissions</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-2xl border border-gray-100 hover:border-primary/30 transition-colors bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-semibold mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Needs Grading
                          </div>
                          <h3 className="font-bold text-lg text-gray-900">Physics Lab Report</h3>
                          <p className="text-sm text-gray-500">Grade 11 - Physics</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-red-600">Past Due</div>
                          <div className="text-xs text-gray-500">Oct 15, 2024</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">28/28 Submitted</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">100 Points</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">Grade Submissions (28)</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-2xl border border-gray-100 hover:border-primary/30 transition-colors bg-white opacity-70">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-semibold mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                            Graded
                          </div>
                          <h3 className="font-bold text-lg text-gray-900">Chemical Bonding Quiz</h3>
                          <p className="text-sm text-gray-500">Grade 12 - Chemistry</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-500">Closed</div>
                          <div className="text-xs text-gray-400">Oct 10, 2024</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-700">Avg Score: 85%</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-1.5 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 text-gray-700 transition-colors">View Results</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
