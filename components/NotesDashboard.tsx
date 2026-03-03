"use client";

import { useState } from "react";
import {
  BookOpen,
  Code,
  FlaskConical,
  Calculator,
  Languages,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

interface Note {
  id: string;
  subject: string;
  subjectIcon: "code" | "science" | "functions" | "language";
  week: string;
  title: string;
  description: string;
  term: string;
  date: string;
  iconColor: string;
}

const SUBJECT_ICONS = {
  code: Code,
  science: FlaskConical,
  functions: Calculator,
  language: Languages,
};

const ICON_COLORS = {
  code: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500",
  science: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500",
  functions: "bg-purple-50 dark:bg-purple-900/30 text-purple-500",
  language: "bg-amber-50 dark:bg-amber-900/30 text-amber-500",
};

const SAMPLE_NOTES: Note[] = [
  {
    id: "1",
    subject: "Computer Studies",
    subjectIcon: "code",
    week: "01",
    title: "Revision / Basic Programming",
    description: "Introduction to Python and Logic",
    term: "SECOND",
    date: "18 Jan '26",
    iconColor: "indigo",
  },
  {
    id: "2",
    subject: "Biology",
    subjectIcon: "science",
    week: "02",
    title: "Cell Biology and Genetics",
    description: "Understanding DNA structure and replication",
    term: "SECOND",
    date: "20 Jan '26",
    iconColor: "emerald",
  },
  {
    id: "3",
    subject: "Mathematics",
    subjectIcon: "functions",
    week: "02",
    title: "Calculus: Differentiation",
    description: "First principles and power rule",
    term: "SECOND",
    date: "21 Jan '26",
    iconColor: "purple",
  },
  {
    id: "4",
    subject: "English Language",
    subjectIcon: "language",
    week: "03",
    title: "Essay Writing: Expository",
    description: "Structuring arguments and evidence",
    term: "SECOND",
    date: "22 Jan '26",
    iconColor: "amber",
  },
];

interface NotesDashboardProps {
  notes?: Note[];
  onNoteDownload?: (noteId: string) => void;
  onSearch?: (query: string) => void;
  onTermChange?: (term: string) => void;
  onViewOtherSubjects?: () => void;
}

export function NotesDashboard({
  notes = SAMPLE_NOTES,
  onNoteDownload = () => {},
  onSearch = () => {},
  onTermChange = () => {},
  onViewOtherSubjects = () => {},
}: NotesDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("Second Term");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const term = e.target.value;
    setSelectedTerm(term);
    onTermChange(term);
  };

  const totalPages = 3;
  const totalResults = 12;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-rose-500 rounded-[2.5rem] p-8 md:p-12 mb-10 shadow-xl shadow-rose-200/50 dark:shadow-none relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-9 h-9 text-white" />
                <h1 className="font-display text-3xl md:text-4xl text-white font-bold">
                  My Class Notes
                </h1>
              </div>
              <p className="text-rose-50 text-lg opacity-90 leading-relaxed">
                Access your study materials anytime. Click on a note to view
                details or download the PDF for offline study. Only subjects
                with available notes for the current session are displayed
                below.
              </p>
            </div>
            <button
              onClick={onViewOtherSubjects}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 self-start md:self-center"
            >
              View Other Subjects
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Table Section */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-[1.5rem] shadow-sm border border-rose-100 dark:border-slate-800 overflow-hidden">
          {/* Table Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                Available Subjects
              </h2>
              <span className="bg-rose-50 dark:bg-rose-900/30 text-primary text-[10px] font-bold px-2 py-0.5 rounded tracking-wide">
                2025/2026 SESSION
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Term Selector */}
              <div className="relative min-w-[160px]">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <select
                  value={selectedTerm}
                  onChange={handleTermChange}
                  className="pl-10 pr-4 py-2 w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                >
                  <option>Second Term</option>
                  <option>First Term</option>
                  <option>Third Term</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* Search Input */}
              <div className="relative flex-grow md:flex-grow-0 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search notes..."
                  className="pl-10 pr-4 py-2 w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      Subject
                      <ChevronDown className="w-[10px] h-[10px]" />
                    </div>
                  </th>
                  <th className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      Week
                      <ChevronDown className="w-[10px] h-[10px]" />
                    </div>
                  </th>
                  <th className="px-6 py-4">Classnote Title</th>
                  <th className="px-6 py-4">Term</th>
                  <th className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      Date
                      <ChevronDown className="w-[10px] h-[10px]" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {notes.map((note) => {
                  const IconComponent =
                    SUBJECT_ICONS[note.subjectIcon] || BookOpen;
                  const colorClass =
                    ICON_COLORS[note.subjectIcon] ||
                    "bg-slate-50 dark:bg-slate-800 text-slate-500";

                  return (
                    <tr
                      key={note.id}
                      className="hover:bg-rose-50/30 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <span className="font-semibold text-sm">
                            {note.subject}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center md:text-left">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-500">
                          {note.week}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <p className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase">
                          {note.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {note.description}
                        </p>
                      </td>
                      <td className="px-6 py-6">
                        <span className="bg-rose-100 dark:bg-rose-900/40 text-primary text-[10px] font-bold px-2 py-1 rounded-full">
                          {note.term}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-sm text-slate-500">
                        {note.date}
                      </td>
                      <td className="px-6 py-6 text-center">
                        <button
                          onClick={() => onNoteDownload(note.id)}
                          className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors"
                          aria-label={`Download ${note.title}`}
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-bold text-slate-700 dark:text-slate-300">
                1 to 5
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {totalResults}
              </span>{" "}
              results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                    currentPage === page
                      ? "bg-primary text-white shadow-md shadow-primary/30"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages)
                )}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-[11px] text-slate-400 uppercase tracking-widest font-medium">
            © 2026 EduPortal System. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default NotesDashboard;
