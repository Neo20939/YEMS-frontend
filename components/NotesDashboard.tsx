"use client";

import { useState, useMemo, Fragment } from "react";
import {
  BookOpen,
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
  week: string;
  title: string;
  description: string;
  term: string;
  date: string;
}

const SAMPLE_NOTES: Note[] = [
  // Chemistry - 5 weeks
  {
    id: "chem-1",
    subject: "Chemistry",
    week: "01",
    title: "Introduction to Organic Chemistry",
    description: "Basic concepts and nomenclature",
    term: "SECOND",
    date: "15 Jan '26",
  },
  {
    id: "chem-2",
    subject: "Chemistry",
    week: "02",
    title: "Alkanes and Alkenes",
    description: "Properties and reactions",
    term: "SECOND",
    date: "22 Jan '26",
  },
  {
    id: "chem-3",
    subject: "Chemistry",
    week: "03",
    title: "Alcohols and Carboxylic Acids",
    description: "Structure and functional groups",
    term: "SECOND",
    date: "29 Jan '26",
  },
  {
    id: "chem-4",
    subject: "Chemistry",
    week: "04",
    title: "Polymers and Macromolecules",
    description: "Synthesis and applications",
    term: "SECOND",
    date: "05 Feb '26",
  },
  {
    id: "chem-5",
    subject: "Chemistry",
    week: "05",
    title: "Chemical Industries",
    description: "Industrial processes and applications",
    term: "SECOND",
    date: "12 Feb '26",
  },
  // Computer Studies - 5 weeks
  {
    id: "comp-1",
    subject: "Computer Studies",
    week: "01",
    title: "Introduction to Python Programming",
    description: "Basic syntax and data types",
    term: "SECOND",
    date: "16 Jan '26",
  },
  {
    id: "comp-2",
    subject: "Computer Studies",
    week: "02",
    title: "Control Structures",
    description: "Loops and conditional statements",
    term: "SECOND",
    date: "23 Jan '26",
  },
  {
    id: "comp-3",
    subject: "Computer Studies",
    week: "03",
    title: "Functions and Modules",
    description: "Code reusability and organization",
    term: "SECOND",
    date: "30 Jan '26",
  },
  {
    id: "comp-4",
    subject: "Computer Studies",
    week: "04",
    title: "Data Structures",
    description: "Lists, tuples, and dictionaries",
    term: "SECOND",
    date: "06 Feb '26",
  },
  {
    id: "comp-5",
    subject: "Computer Studies",
    week: "05",
    title: "File Handling",
    description: "Reading and writing files",
    term: "SECOND",
    date: "13 Feb '26",
  },
  // English - 5 weeks
  {
    id: "eng-1",
    subject: "English",
    week: "01",
    title: "Comprehension Skills",
    description: "Reading and understanding passages",
    term: "SECOND",
    date: "14 Jan '26",
  },
  {
    id: "eng-2",
    subject: "English",
    week: "02",
    title: "Essay Writing: Narrative",
    description: "Storytelling techniques",
    term: "SECOND",
    date: "21 Jan '26",
  },
  {
    id: "eng-3",
    subject: "English",
    week: "03",
    title: "Essay Writing: Expository",
    description: "Structuring arguments and evidence",
    term: "SECOND",
    date: "28 Jan '26",
  },
  {
    id: "eng-4",
    subject: "English",
    week: "04",
    title: "Letter Writing",
    description: "Formal and informal letters",
    term: "SECOND",
    date: "04 Feb '26",
  },
  {
    id: "eng-5",
    subject: "English",
    week: "05",
    title: "Speech and Debate",
    description: "Public speaking skills",
    term: "SECOND",
    date: "11 Feb '26",
  },
  // Mathematics - 5 weeks
  {
    id: "math-1",
    subject: "Mathematics",
    week: "01",
    title: "Revision: Algebra Basics",
    description: "Review of fundamental concepts",
    term: "SECOND",
    date: "13 Jan '26",
  },
  {
    id: "math-2",
    subject: "Mathematics",
    week: "02",
    title: "Calculus: Differentiation",
    description: "First principles and power rule",
    term: "SECOND",
    date: "20 Jan '26",
  },
  {
    id: "math-3",
    subject: "Mathematics",
    week: "03",
    title: "Calculus: Integration",
    description: "Definite and indefinite integrals",
    term: "SECOND",
    date: "27 Jan '26",
  },
  {
    id: "math-4",
    subject: "Mathematics",
    week: "04",
    title: "Statistics and Probability",
    description: "Mean, median, mode and probability theory",
    term: "SECOND",
    date: "03 Feb '26",
  },
  {
    id: "math-5",
    subject: "Mathematics",
    week: "05",
    title: "Trigonometry",
    description: "Sine, cosine and tangent rules",
    term: "SECOND",
    date: "10 Feb '26",
  },
  // CRS - 5 weeks
  {
    id: "crs-1",
    subject: "CRS",
    week: "01",
    title: "The Creation Story",
    description: "Genesis account of creation",
    term: "SECOND",
    date: "17 Jan '26",
  },
  {
    id: "crs-2",
    subject: "CRS",
    week: "02",
    title: "The Fall of Man",
    description: "Adam and Eve in the garden",
    term: "SECOND",
    date: "24 Jan '26",
  },
  {
    id: "crs-3",
    subject: "CRS",
    week: "03",
    title: "The Life of Abraham",
    description: "Faith and covenant",
    term: "SECOND",
    date: "31 Jan '26",
  },
  {
    id: "crs-4",
    subject: "CRS",
    week: "04",
    title: "The Exodus",
    description: "Moses and the deliverance",
    term: "SECOND",
    date: "07 Feb '26",
  },
  {
    id: "crs-5",
    subject: "CRS",
    week: "05",
    title: "The Ten Commandments",
    description: "God's law given to Moses",
    term: "SECOND",
    date: "14 Feb '26",
  },
];

interface NotesDashboardProps {
  notes?: Note[];
  onNoteDownload?: (noteId: string) => void;
  onSearch?: (query: string) => void;
  onTermChange?: (term: string) => void;
  onViewOtherSubjects?: () => void;
  isLoading?: boolean;
}

export function NotesDashboard({
  notes,
  onNoteDownload = () => {},
  onSearch = () => {},
  onTermChange = () => {},
  onViewOtherSubjects = () => {},
  isLoading = false,
}: NotesDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("Second Term");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Use mock data if notes is undefined or empty array (for development/testing)
  const displayNotes = (!notes || notes.length === 0) && !isLoading ? SAMPLE_NOTES : (notes || []);

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

  // Group notes by subject (alphabetically), then by week (numerically)
  const groupedNotes = useMemo(() => {
    const groups: Record<string, Record<string, Note[]>> = {};

    displayNotes.forEach((note) => {
      if (!groups[note.subject]) {
        groups[note.subject] = {};
      }
      if (!groups[note.subject][note.week]) {
        groups[note.subject][note.week] = [];
      }
      groups[note.subject][note.week].push(note);
    });

    // Sort subjects alphabetically
    const sortedSubjects = Object.keys(groups).sort();

    // Sort weeks numerically within each subject
    const result: Array<{ subject: string; weeks: Array<{ week: string; notes: Note[] }> }> = [];

    sortedSubjects.forEach((subject) => {
      const sortedWeeks = Object.keys(groups[subject]).sort((a, b) => parseInt(a) - parseInt(b));
      result.push({
        subject,
        weeks: sortedWeeks.map((week) => ({
          week,
          notes: groups[subject][week],
        })),
      });
    });

    return result;
  }, [displayNotes]);

  // Flatten grouped notes for pagination
  const flatNotesList = useMemo(() => {
    const flat: Array<{ subject: string; week: string; note: Note }> = [];
    groupedNotes.forEach(({ subject, weeks }) => {
      weeks.forEach(({ week, notes: weekNotes }) => {
        weekNotes.forEach((note) => {
          flat.push({ subject, week, note });
        });
      });
    });
    return flat;
  }, [groupedNotes]);

  // Calculate pagination
  const totalResults = flatNotesList.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  // Get current page notes
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotes = flatNotesList.slice(startIndex, endIndex);

  // Regroup current page notes for display
  const paginatedGroupedNotes = useMemo(() => {
    const groups: Record<string, Record<string, Note[]>> = {};

    currentNotes.forEach(({ subject, week, note }) => {
      if (!groups[subject]) {
        groups[subject] = {};
      }
      if (!groups[subject][week]) {
        groups[subject][week] = [];
      }
      groups[subject][week].push(note);
    });

    const sortedSubjects = Object.keys(groups).sort();
    const result: Array<{ subject: string; weeks: Array<{ week: string; notes: Note[] }> }> = [];

    sortedSubjects.forEach((subject) => {
      const sortedWeeks = Object.keys(groups[subject]).sort((a, b) => parseInt(a) - parseInt(b));
      result.push({
        subject,
        weeks: sortedWeeks.map((week) => ({
          week,
          notes: groups[subject][week],
        })),
      });
    });

    return result;
  }, [currentNotes]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="bg-primary rounded-[2.5rem] p-8 md:p-12 mb-10 shadow-xl shadow-rose-200/50 dark:shadow-none relative overflow-hidden">
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
                {isLoading ? (
                  // Loading Skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700" />
                          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center md:text-left">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto" />
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-2">
                          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
                          <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="w-16 h-5 rounded-full bg-slate-200 dark:bg-slate-700" />
                      </td>
                      <td className="px-6 py-6">
                        <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 mx-auto" />
                      </td>
                    </tr>
                  ))
                ) : displayNotes.length === 0 ? (
                  // Empty State
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 font-medium">No notes available</p>
                      <p className="text-sm text-slate-400 mt-1">
                        Check back later for new study materials
                      </p>
                    </td>
                  </tr>
                ) : (
                  // Grouped notes by subject and week
                  paginatedGroupedNotes.map(({ subject, weeks }) => (
                    <Fragment key={subject}>
                      {weeks.map(({ week, notes: weekNotes }) =>
                        weekNotes.map((note, idx) => {
                          return (
                            <tr
                              key={note.id}
                              className="hover:bg-rose-50/30 dark:hover:bg-slate-800/50 transition-colors"
                            >
                              <td className="px-6 py-6">
                                <span className="font-semibold text-sm">
                                  {subject}
                                </span>
                              </td>
                              <td className="px-6 py-6 text-center md:text-left">
                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-500">
                                  {week}
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
                        })
                      )}
                    </Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {totalResults > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, totalResults)}
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
