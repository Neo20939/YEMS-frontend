import TeacherSidebar from "@/components/teachers/TeacherSidebar"
import TeacherHeader from "@/components/teachers/TeacherHeader"

export default function AssessmentExamsSetupPage() {
  return (
    <div className="min-h-screen bg-background-light">
      <TeacherSidebar />
      <div className="ml-20 transition-all duration-300">
        <TeacherHeader />
        
        <div className="bg-primary pt-12 pb-24 px-8">
          <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              Academic Session 2024/2025
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Assessment &amp; Examination</h1>
            <p className="text-white/80 text-lg max-w-2xl">Schedule and manage mid-term tests and final examinations for your classes.</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto -mt-16 px-8 pb-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Schedule New Assessment</h2>
                    <p className="text-sm text-gray-500 mt-1">Configure details for your upcoming test or exam</p>
                  </div>
                  <button className="text-gray-400 hover:text-primary transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Assessment Type</label>
                      <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-gray-900">
                        <option>Mid-term Test</option>
                        <option>Final Examination</option>
                        <option>Quiz</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Subject</label>
                      <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-gray-900">
                        <option>Mathematics - Grade 10</option>
                        <option>Physics - Grade 11</option>
                        <option>Chemistry - Grade 12</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Date</label>
                      <input className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-gray-900" type="date"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Start Time</label>
                        <input className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-gray-900" type="time"/>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Duration (mins)</label>
                        <input className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-gray-900" placeholder="60" type="number"/>
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="text-sm font-semibold mb-4 text-gray-700">Content Source</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none border-primary ring-1 ring-primary">
                        <input defaultChecked className="sr-only" name="content_source" type="radio" value="bank"/>
                        <span className="flex flex-1">
                          <span className="flex flex-col">
                            <span className="block text-sm font-medium text-gray-900 flex items-center gap-2">
                              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                              Question Bank
                            </span>
                            <span className="mt-1 flex items-center text-sm text-gray-500">Select questions from the repository</span>
                          </span>
                        </span>
                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </label>
                      <label className="relative flex cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm focus:outline-none hover:border-primary/50 transition-colors">
                        <input className="sr-only" name="content_source" type="radio" value="upload"/>
                        <span className="flex flex-1">
                          <span className="flex flex-col">
                            <span className="block text-sm font-medium text-gray-900 flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Upload Paper
                            </span>
                            <span className="mt-1 flex items-center text-sm text-gray-500">Upload PDF or Document format</span>
                          </span>
                        </span>
                        <svg className="w-5 h-5 text-transparent" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </label>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-gray-700">Question Selection</h4>
                      <button className="text-xs font-semibold text-primary" type="button">Auto-generate</button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-white p-3 rounded-md border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Multiple Choice</div>
                        <input className="w-16 text-center bg-transparent border-b border-gray-300 focus:border-primary outline-none font-semibold text-gray-900" type="number" value="20"/>
                      </div>
                      <div className="bg-white p-3 rounded-md border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Short Answer</div>
                        <input className="w-16 text-center bg-transparent border-b border-gray-300 focus:border-primary outline-none font-semibold text-gray-900" type="number" value="5"/>
                      </div>
                      <div className="bg-white p-3 rounded-md border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Essay</div>
                        <input className="w-16 text-center bg-transparent border-b border-gray-300 focus:border-primary outline-none font-semibold text-gray-900" type="number" value="1"/>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center text-sm">
                      <span className="text-gray-500">Total Marks:</span>
                      <span className="font-bold text-lg text-gray-900">50</span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 pt-4">
                    <button className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors" type="button">Cancel</button>
                    <button className="px-6 py-3 rounded-lg font-semibold text-white bg-primary hover:bg-primary/90 transition-colors shadow-md shadow-primary/20" type="submit">Schedule Assessment</button>
                  </div>
                </form>
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-primary rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-white/80">March 2026</span>
                </div>
                <div className="text-center relative z-10 py-2">
                  <div className="text-lg font-medium text-white/90 mb-1">Friday, March 6, 2026</div>
                  <div className="text-4xl font-bold tracking-tight">09:19 AM</div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-gray-900">Upcoming Tests</h3>
                  <a className="text-sm text-primary font-medium hover:underline" href="#">View All</a>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-primary/30 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-blue-700">MAR</span>
                      <span className="text-lg font-bold text-blue-800 leading-none">12</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">Math Mid-term</h4>
                      <p className="text-xs text-gray-500 mt-1">Grade 10 • 09:00 AM</p>
                    </div>
                    <div className="shrink-0 flex items-center">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-md">Ready</span>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-primary/30 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-purple-700">MAR</span>
                      <span className="text-lg font-bold text-purple-800 leading-none">15</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">Physics Quiz 2</h4>
                      <p className="text-xs text-gray-500 mt-1">Grade 11 • 11:30 AM</p>
                    </div>
                    <div className="shrink-0 flex items-center">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase rounded-md">Draft</span>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-primary/30 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-lg bg-orange-100 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-orange-700">MAR</span>
                      <span className="text-lg font-bold text-orange-800 leading-none">20</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate">Chemistry Final</h4>
                      <p className="text-xs text-gray-500 mt-1">Grade 12 • 08:00 AM</p>
                    </div>
                    <div className="shrink-0 flex items-center">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase rounded-md">Draft</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
