"use client"

import { Button } from "@/components/ui/button"
import {
  Calculator,
  Dna,
  Globe,
  FlaskConical,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Lesson {
  id: string
  subject: string
  topic: string
  time: string
  color: string
  icon: React.ReactNode
}

interface LiveLessonsProps {
  lessons?: Lesson[]
}

const defaultLessons: Lesson[] = [
  {
    id: "1",
    subject: "Mathematics",
    topic: "Advanced Calculus & Integration Methods",
    time: "10:00 AM - 11:30 AM",
    color: "bg-blue-100 text-blue-600",
    icon: <Calculator className="w-6 h-6" />,
  },
  {
    id: "2",
    subject: "Biology",
    topic: "Molecular Genetics and DNA structure",
    time: "12:00 PM - 01:00 PM",
    color: "bg-emerald-100 text-emerald-600",
    icon: <Dna className="w-6 h-6" />,
  },
  {
    id: "3",
    subject: "History",
    topic: "The Industrial Revolution's Global Impact",
    time: "02:30 PM - 03:45 PM",
    color: "bg-purple-100 text-purple-600",
    icon: <Globe className="w-6 h-6" />,
  },
  {
    id: "4",
    subject: "Chemistry",
    topic: "Organic Compounds & Atomic Bonding",
    time: "04:15 PM - 05:30 PM",
    color: "bg-orange-100 text-orange-600",
    icon: <FlaskConical className="w-6 h-6" />,
  },
]

export default function LiveLessons({ lessons = defaultLessons }: LiveLessonsProps) {
  return (
    <div className="max-w-6xl mx-auto px-6 md:px-8 py-8">
      {/* Header Section */}
      <div className="bg-primary rounded-3xl py-14 px-8 md:px-12 mb-8 text-center relative overflow-hidden shadow-xl shadow-primary/20">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -left-10 top-0 w-64 h-64 rounded-full border-[40px] border-white"></div>
          <div className="absolute -right-10 bottom-0 w-64 h-64 rounded-full border-[40px] border-white"></div>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter uppercase relative z-10 mb-3">
          Live Lessons
        </h1>
        <p className="text-rose-50 text-lg md:text-xl font-medium relative z-10 max-w-2xl mx-auto">
          Interactive sessions hosted by expert instructors. Join the conversation and learn in real-time.
        </p>
      </div>

      {/* Lessons Table */}
      <div className="bg-white rounded-3xl shadow-soft overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="pl-8 md:pl-12 pr-4 md:pr-6 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Subject
                </th>
                <th className="px-4 md:px-6 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Topic
                </th>
                <th className="px-4 md:px-6 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Time
                </th>
                <th className="pl-4 md:pl-6 pr-8 md:pr-12 py-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lessons.map((lesson) => (
                <tr
                  key={lesson.id}
                  className="group hover:bg-gray-50/50 transition-colors duration-200"
                >
                  <td className="pl-8 md:pl-12 pr-4 md:pr-6 py-6">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0",
                          lesson.color
                        )}
                      >
                        {lesson.icon}
                      </div>
                      <span className="font-bold text-gray-700 text-sm md:text-base">
                        {lesson.subject}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-6">
                    <span className="text-gray-600 font-medium block max-w-xs truncate lg:max-w-md text-sm md:text-base">
                      {lesson.topic}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-6">
                    <div className="flex items-center gap-2 text-gray-500 font-medium whitespace-nowrap">
                      <Clock className="w-5 h-5" />
                      <span className="text-sm md:text-base">{lesson.time}</span>
                    </div>
                  </td>
                  <td className="pl-4 md:pl-6 pr-8 md:pr-12 py-6 text-right">
                    <Button
                      variant="default"
                      size="sm"
                      className="px-6 md:px-7"
                    >
                      Enter Class
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-8 md:px-12 py-6 md:py-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-100 bg-gray-50/30">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <span className="text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest">
              {lessons.length} Lessons Live Today
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-white hover:text-gray-600 hover:border-gray-300 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-white hover:text-gray-600 hover:border-gray-300 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
