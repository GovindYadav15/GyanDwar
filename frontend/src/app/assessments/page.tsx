import React from 'react';
import Link from 'next/link';
import { Timer, CheckCircle2, BookOpen, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';

export default function AssessmentsPage() {
  const tests = [
    {
      id: 'mock-100-civil',
      title: 'NEC Civil Engineering Licensure 100-Mark Model Exam (2026 Simulation)',
      category: 'NEC License • Civil',
      type: 'FULL_MOCK',
      questions: 100,
      marks: 100,
      duration: '120 Minutes',
      negativeMarking: '0.2 Marks (20%)',
      isFree: true,
      description:
        'Official simulation conforming to Nepal Engineering Council format: 100 questions, 1 mark each, 0.2 negative marking penalty per incorrect answer, strict 2-hour duration.',
      badge: 'Official Simulation',
    },
    {
      id: 'practice-chap-1',
      title: 'Chapter 1: Cement, Pozzolanas & Vicat Tests Practice Drill',
      category: 'Concrete Technology',
      type: 'CHAPTER_PRACTICE',
      questions: 10,
      marks: 10,
      duration: '15 Minutes',
      negativeMarking: 'None (Learning Mode)',
      isFree: true,
      description:
        'Quick revision drill for Bogue compounds, fineness testing, setting times, and sound tests with instant solution explanations.',
      badge: 'Free Diagnostic',
    },
    {
      id: 'mock-loksewa-ppa',
      title: 'Lok Sewa Technical: Public Procurement Act & Engineering Economics',
      category: 'Lok Sewa Aayog • 7th Level',
      type: 'SUBJECT_MOCK',
      questions: 50,
      marks: 50,
      duration: '60 Minutes',
      negativeMarking: '0.2 Marks (20%)',
      isFree: false,
      description:
        'Targeted drill on PPA 2063, PPR 2064, contract variations, arbitration, and Nepali constitution governance clauses.',
      badge: 'Premium Pass',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-indigo bg-brand-purple/10 px-3 py-1 rounded-full border border-brand-purple/20">
          Assessment Center
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-brand-navy">
          Practice Drills & 100-Mark Mock Exams
        </h1>
        <p className="text-gray-600 max-w-2xl text-sm sm:text-base">
          Experience realistic timed simulations with server-authoritative clocks, negative marking
          deductions, and detailed performance diagnostic cards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => (
          <div
            key={test.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-card-elevated hover:border-brand-purple/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
                  {test.category}
                </span>
                {test.isFree ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> Free Trial
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    🔒 Premium
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-brand-navy leading-snug font-display">
                {test.title}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                {test.description}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-gray-500 block">Questions</span>
                  <span className="font-bold text-brand-navy">
                    {test.questions} MCQs ({test.marks} Marks)
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <span className="text-gray-500 block">Duration</span>
                  <span className="font-bold text-brand-navy">{test.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium bg-rose-50 p-2 rounded-lg border border-rose-100">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Negative Marking: {test.negativeMarking}</span>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href={`/assessments/${test.id}`}
                className="btn-brand-primary w-full text-center text-sm font-semibold py-2.5 flex items-center justify-center gap-2"
              >
                Start Examination
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
