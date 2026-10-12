'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  ChevronDown,
} from 'lucide-react';

export default function AssessmentResultsPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const resolvedParams = use(params);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(`attempt_${resolvedParams.attemptId}`);
      if (saved) {
        setUserAnswers(JSON.parse(saved));
      }
    }
  }, [resolvedParams.attemptId]);

  // Questions with solutions
  const reviewQuestions = [
    {
      id: 'q1',
      text: 'Which Bogue compound is primarily responsible for the early strength development of Portland cement within the first 7 days?',
      marks: 1.0,
      negativeMarks: 0.2,
      correctOptionId: 'optB',
      explanation:
        'Tricalcium Silicate (C3S) hydrates rapidly and provides the majority of early strength in concrete up to 7–14 days. Dicalcium Silicate (C2S) contributes to long-term strength gain beyond 28 days.',
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
      correctOptionId: 'optB',
      explanation:
        'Tricalcium Aluminate (C3A) reacts instantaneously with water, leading to flash setting. Gypsum acts as a setting retarder by reacting with C3A to form an insoluble calcium sulfoaluminate film.',
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
      correctOptionId: 'optA',
      explanation:
        'Standard consistency (P) is the percentage of water required to produce a paste that permits the standard Vicat plunger (10 mm diameter) to penetrate to 5–7 mm from the bottom of the mold.',
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
      correctOptionId: 'optB',
      explanation:
        'According to PPA 2063, International Competitive Bidding (ICB) is invoked when qualified competition is not available domestically within Nepal or when international donor credit agreements mandate ICB.',
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
      correctOptionId: 'optC',
      explanation:
        'Pumpable concrete placed in congested reinforcement sections requires high workability, typically with a slump of 75 to 100 mm to flow smoothly without honeycombing or segregation.',
      options: [
        { id: 'optA', label: 'A', text: '10 to 25 mm' },
        { id: 'optB', label: 'B', text: '25 to 50 mm' },
        { id: 'optC', label: 'C', text: '75 to 100 mm' },
        { id: 'optD', label: 'D', text: '175 to 200 mm' },
      ],
    },
  ];

  // Calculate actual score from answers
  let correct = 0;
  let incorrect = 0;
  let unanswered = 0;
  let rawScore = 0;
  let penalties = 0;

  reviewQuestions.forEach((q) => {
    const selected = userAnswers[q.id];
    if (!selected) {
      unanswered++;
    } else if (selected === q.correctOptionId) {
      correct++;
      rawScore += q.marks;
    } else {
      incorrect++;
      penalties += q.negativeMarks;
      rawScore -= q.negativeMarks;
    }
  });

  const finalScore = Math.max(0, Number(rawScore.toFixed(2)));
  const passMarks = 2.5; // for 5 question demo
  const isPassed = finalScore >= passMarks;
  const accuracy =
    correct + incorrect > 0 ? Math.round((correct / (correct + incorrect)) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Scorecard Hero Banner */}
      <div className="bg-gradient-to-br from-brand-navy via-brand-navy-dark to-brand-indigo text-white p-8 sm:p-10 rounded-3xl shadow-xl border border-brand-indigo/30 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-3">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isPassed
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              <Award className="w-4 h-4" />
              {isPassed ? 'Passed License Standard' : 'Needs Practice (Did Not Meet Cutoff)'}
            </span>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-display">
              Examination Performance Scorecard
            </h1>
            <p className="text-sm text-gray-300 max-w-xl">
              NEC Civil Engineering Licensure Simulation • Attempt ID: #
              {resolvedParams.attemptId.slice(0, 8)}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center shrink-0 min-w-[200px]">
            <span className="text-xs text-brand-gold uppercase tracking-wider font-semibold">
              Total Score
            </span>
            <div className="text-4xl sm:text-5xl font-extrabold text-white font-display my-1">
              {finalScore} <span className="text-lg text-gray-300 font-normal">/ 5.0</span>
            </div>
            <p className="text-xs text-gray-300">Passing Cutoff: {passMarks} Marks</p>
          </div>
        </div>

        {/* Detailed Metrics Row */}
        <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <span className="text-xs text-gray-400">Accuracy Rate</span>
            <p className="text-xl font-bold text-brand-gold mt-0.5">{accuracy}%</p>
          </div>
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <span className="text-xs text-gray-400">Correct Answers</span>
            <p className="text-xl font-bold text-emerald-400 mt-0.5">{correct} MCQs</p>
          </div>
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <span className="text-xs text-gray-400">Negative Penalty</span>
            <p className="text-xl font-bold text-rose-400 mt-0.5">-{penalties.toFixed(2)}</p>
          </div>
          <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
            <span className="text-xs text-gray-400">Unanswered</span>
            <p className="text-xl font-bold text-gray-300 mt-0.5">{unanswered}</p>
          </div>
        </div>
      </div>

      {/* Navigation action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-brand-navy font-display">
          Detailed Question Solutions & Explanations
        </h2>
        <div className="flex items-center gap-3">
          <Link
            href="/assessments"
            className="btn-brand-outline text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retake Test
          </Link>
          <Link
            href="/dashboard"
            className="btn-brand-primary text-xs py-2 px-4 flex items-center gap-1.5"
          >
            Student Dashboard <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Question Breakdown List */}
      <div className="space-y-6">
        {reviewQuestions.map((q, idx) => {
          const selected = userAnswers[q.id];
          const isCorrect = selected === q.correctOptionId;
          const isUnanswered = !selected;

          let badgeText = 'Correct (+1.0)';
          let badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
          if (isUnanswered) {
            badgeText = 'Unanswered (0.0)';
            badgeClass = 'bg-slate-100 text-slate-700 border-slate-300';
          } else if (!isCorrect) {
            badgeText = 'Incorrect (–0.2 Penalty)';
            badgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
          }

          return (
            <div
              key={q.id}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Question {idx + 1} of {reviewQuestions.length}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${badgeClass}`}
                >
                  {badgeText}
                </span>
              </div>

              <p className="text-base font-semibold text-slate-800 leading-snug">{q.text}</p>

              {/* Options Breakdown */}
              <div className="space-y-2 pt-1">
                {q.options.map((opt) => {
                  const isUserSelection = selected === opt.id;
                  const isThisCorrect = opt.id === q.correctOptionId;

                  let cardStyle = 'border-slate-200 bg-white text-slate-700';
                  if (isThisCorrect) {
                    cardStyle =
                      'border-2 border-emerald-500 bg-emerald-50/70 text-emerald-900 font-semibold';
                  } else if (isUserSelection && !isThisCorrect) {
                    cardStyle = 'border-2 border-rose-500 bg-rose-50 text-rose-900 font-semibold';
                  }

                  return (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs sm:text-sm ${cardStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {opt.label}
                        </span>
                        <span>{opt.text}</span>
                      </div>

                      {isThisCorrect && (
                        <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Correct Key
                        </span>
                      )}
                      {isUserSelection && !isThisCorrect && (
                        <span className="text-xs text-rose-700 font-bold flex items-center gap-1 shrink-0">
                          <XCircle className="w-4 h-4 text-rose-600" /> Your Choice
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Engineering Solution Box */}
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm leading-relaxed text-slate-700">
                <span className="font-bold text-brand-indigo block mb-1">
                  💡 Authoritative Solution & Syllabus Reference:
                </span>
                <p>{q.explanation}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
