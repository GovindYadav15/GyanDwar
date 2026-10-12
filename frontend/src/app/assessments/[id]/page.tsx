'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  Timer,
  CheckCircle2,
  Flag,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Send,
} from 'lucide-react';

interface Question {
  id: string;
  text: string;
  marks: number;
  negativeMarks: number;
  options: { id: string; label: string; text: string }[];
}

export default function AssessmentExamPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  // Demonstration Question Pool
  const questions: Question[] = [
    {
      id: 'q1',
      text: 'Which Bogue compound is primarily responsible for the early strength development of Portland cement within the first 7 days?',
      marks: 1.0,
      negativeMarks: 0.2,
      options: [
        { id: 'optA', label: 'A', text: 'Dicalcium Silicate (C2S)' },
        { id: 'optB', label: 'B', text: 'Tricalcium Silicate (C3S)' },
        { id: 'optC', label: 'C', text: 'Tricalcium Aluminate (C3A)' },
        { id: 'optD', label: 'D', text: 'Tetracalcium Aluminoferrite (C4AF)' },
      ],
    },
    {
      id: 'q2',
      text: 'What is the primary role of adding Gypsum (CaSO4 · 2H2O) to cement clinker during grinding?',
      marks: 1.0,
      negativeMarks: 0.2,
      options: [
        { id: 'optA', label: 'A', text: 'To accelerate initial setting time' },
        { id: 'optB', label: 'B', text: 'To retard flash setting caused by C3A' },
        { id: 'optC', label: 'C', text: 'To enhance soundness against free magnesia' },
        { id: 'optD', label: 'D', text: 'To decrease heat of hydration in mass concrete' },
      ],
    },
    {
      id: 'q3',
      text: 'As per NS / IS 4031, what is the standard Vicat plunger penetration from the bottom of the mold for normal consistency (P)?',
      marks: 1.0,
      negativeMarks: 0.2,
      options: [
        { id: 'optA', label: 'A', text: '5 to 7 mm' },
        { id: 'optB', label: 'B', text: '10 to 12 mm' },
        { id: 'optC', label: 'C', text: '15 to 18 mm' },
        { id: 'optD', label: 'D', text: 'Exactly 20 mm' },
      ],
    },
    {
      id: 'q4',
      text: 'Under the Nepal Public Procurement Act (PPA 2063), which procurement method is required when competition is not available domestically within Nepal?',
      marks: 1.0,
      negativeMarks: 0.2,
      options: [
        { id: 'optA', label: 'A', text: 'National Competitive Bidding (NCB)' },
        { id: 'optB', label: 'B', text: 'International Competitive Bidding (ICB)' },
        { id: 'optC', label: 'C', text: 'Sealed Quotation method' },
        { id: 'optD', label: 'D', text: 'Direct Contracting with pre-approved vendors' },
      ],
    },
    {
      id: 'q5',
      text: 'For pumpable concrete placed in congested reinforcement sections, which slump range is standard?',
      marks: 1.0,
      negativeMarks: 0.2,
      options: [
        { id: 'optA', label: 'A', text: '10 to 25 mm' },
        { id: 'optB', label: 'B', text: '25 to 50 mm' },
        { id: 'optC', label: 'C', text: '75 to 100 mm' },
        { id: 'optD', label: 'D', text: '175 to 200 mm' },
      ],
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reviews, setReviews] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(7200); // 2 hours
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const reviewCount = Object.values(reviews).filter(Boolean).length;
  const unansweredCount = questions.length - answeredCount;

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId,
    }));
  };

  const handleClearAnswer = () => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  const handleToggleReview = () => {
    setReviews((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }));
  };

  const handleSubmit = () => {
    // Generate a mock attempt id for review results
    const attemptId = `att_${Date.now()}`;
    // Store answers in sessionStorage for the results view
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`attempt_${attemptId}`, JSON.stringify(answers));
    }
    router.push(`/assessments/results/${attemptId}`);
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* Examination Top Bar */}
      <div className="sticky top-20 z-40 bg-brand-navy text-white px-4 sm:px-8 py-3.5 shadow-md flex items-center justify-between border-b border-brand-indigo/30">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <h1 className="text-sm sm:text-base font-bold font-display line-clamp-1">
              NEC Civil Engineering Licensure (100-Mark Model Exam)
            </h1>
            <p className="text-[11px] text-brand-gold font-medium">
              Exam Attempt Active • Server Synchronized
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-brand-navy-dark px-3.5 py-1.5 rounded-lg border border-brand-indigo/40 text-brand-gold font-mono font-bold text-sm sm:text-base shadow-inner">
            <Timer className="w-4 h-4 text-brand-gold" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="btn-brand-gold text-xs py-1.5 px-4 font-bold flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Submit Test
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Question Interface */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              {/* Question Header & Meta */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-brand-indigo text-white">
                    Question {currentIndex + 1} of {questions.length}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    +{currentQ.marks} Mark • –{currentQ.negativeMarks} Negative
                  </span>
                </div>

                <button
                  onClick={handleToggleReview}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                    reviews[currentQ.id]
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  {reviews[currentQ.id] ? 'Marked for Review' : 'Mark for Review'}
                </button>
              </div>

              {/* Question Text */}
              <p className="text-base sm:text-lg font-semibold text-slate-800 leading-relaxed">
                {currentQ.text}
              </p>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`exam-option-card ${isSelected ? 'selected' : ''}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                          isSelected ? 'bg-brand-indigo text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {opt.label}
                      </div>
                      <span className="text-sm sm:text-base text-slate-700 font-medium flex-1">
                        {opt.text}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-brand-indigo shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={handleClearAnswer}
                  disabled={!answers[currentQ.id]}
                  className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Clear Answer
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentIndex === 0}
                    className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-xs font-semibold"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  <button
                    onClick={() =>
                      setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))
                    }
                    disabled={currentIndex === questions.length - 1}
                    className="p-2.5 rounded-lg bg-brand-indigo hover:bg-brand-indigo-light text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 text-xs font-semibold px-4"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Navigator Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wider">
                Question Palette
              </h3>

              {/* Status Counters */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                  <strong>{answeredCount}</strong> Answered
                </div>
                <div className="p-2 rounded-lg bg-slate-100 text-slate-700 font-medium">
                  <strong>{unansweredCount}</strong> Left
                </div>
                <div className="p-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-medium col-span-2">
                  <strong>{reviewCount}</strong> Marked for Review
                </div>
              </div>

              {/* Question Buttons Matrix */}
              <div className="grid grid-cols-5 gap-2 pt-2">
                {questions.map((q, idx) => {
                  const isAnswered = Boolean(answers[q.id]);
                  const isReviewed = Boolean(reviews[q.id]);
                  const isCurrent = currentIndex === idx;

                  let btnStyle = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
                  if (isAnswered) btnStyle = 'bg-emerald-600 text-white font-bold';
                  if (isReviewed) btnStyle = 'bg-amber-400 text-brand-navy font-bold';
                  if (isCurrent) btnStyle += ' ring-2 ring-brand-indigo ring-offset-2';

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 rounded-lg text-xs transition-all ${btnStyle}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="btn-brand-primary w-full text-xs py-2.5 font-bold"
                >
                  Finish & Submit Test
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-brand-navy">Submit Examination?</h3>
                <p className="text-xs text-gray-500">
                  Are you sure you want to finalize your answers?
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Questions:</span>
                <span className="font-bold text-brand-navy">{questions.length}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Questions Answered:</span>
                <span>{answeredCount}</span>
              </div>
              <div className="flex justify-between text-amber-600 font-semibold">
                <span>Marked for Review:</span>
                <span>{reviewCount}</span>
              </div>
              <div className="flex justify-between text-rose-600 font-semibold">
                <span>Unanswered:</span>
                <span>{unansweredCount}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Return to Exam
              </button>
              <button
                onClick={handleSubmit}
                className="btn-brand-primary text-xs py-2 px-5 font-bold"
              >
                Confirm & View Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
