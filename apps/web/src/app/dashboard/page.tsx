import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Award,
  BookOpen,
  Timer,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Sparkles,
  CreditCard,
} from 'lucide-react';

export default function StudentDashboardPage() {
  const stats = {
    totalAttempts: 12,
    passRate: '83.3%',
    averageAccuracy: '76.4%',
    studyHours: 24,
  };

  const activeSubscription = {
    planName: '3 Month Complete Preparation Pass',
    expiryDate: 'Jan 15, 2027',
    daysRemaining: 74,
    status: 'ACTIVE',
  };

  const recentAttempts = [
    {
      id: 'att-101',
      title: 'NEC Civil Engineering Licensure (Full 100-Mark Mock 2026)',
      date: 'Today, 09:30 AM',
      score: '78.4 / 100',
      accuracy: '84.0%',
      isPassed: true,
    },
    {
      id: 'att-102',
      title: 'Chapter 1: Cement, Pozzolanas & Vicat Tests Practice Drill',
      date: 'Yesterday',
      score: '4.0 / 5.0',
      accuracy: '80.0%',
      isPassed: true,
    },
    {
      id: 'att-103',
      title: 'Structural Analysis & Design (IS 456 / NBC 105:2020)',
      date: '3 days ago',
      score: '8.8 / 15.0',
      accuracy: '62.5%',
      isPassed: true,
    },
  ];

  const weakAreas = [
    {
      subject: 'Earthquake Engineering (NBC 105:2020)',
      accuracy: '54%',
      recommendation: 'Review Response Reduction Factors and Ductility detailing in Chapter 2.',
    },
    {
      subject: 'Public Procurement Act 2063',
      accuracy: '60%',
      recommendation: 'Practice Sealed Quotation vs NCB threshold limits in Lok Sewa drill.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header & Active Subscription */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-purple">Candidate Portal</span>
            <span className="text-xs text-gray-500">Student ID: #NP-77291</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-brand-navy">
            Namaste, Aayush Sharma
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Target: Nepal Engineering Council (NEC) Licensure Examination • Civil Engineering
          </p>
        </div>

        {/* Subscription Status Card */}
        <div className="bg-gradient-to-r from-brand-navy to-brand-indigo text-white p-4 sm:p-5 rounded-2xl shadow-md border border-brand-indigo/30 flex items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-gold" />
              <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">
                Active Pass
              </span>
            </div>
            <p className="text-sm font-bold">{activeSubscription.planName}</p>
            <p className="text-xs text-gray-300">
              Valid until {activeSubscription.expiryDate} ({activeSubscription.daysRemaining} days
              left)
            </p>
          </div>
          <Link href="/pricing" className="btn-brand-gold text-xs py-2 px-3.5 font-bold shrink-0">
            Extend
          </Link>
        </div>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-gray-500 block">Total Tests Attempted</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display mt-1">
            {stats.totalAttempts}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-2">
            <TrendingUp className="w-3.5 h-3.5" /> +3 this week
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-gray-500 block">Overall Pass Rate</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-indigo font-display mt-1">
            {stats.passRate}
          </p>
          <span className="text-[11px] text-gray-500 mt-2 block">Above NEC benchmark (50%)</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-gray-500 block">Average Accuracy</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-display mt-1">
            {stats.averageAccuracy}
          </p>
          <span className="text-[11px] text-gray-500 mt-2 block">Net of negative marking</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-gray-500 block">Study Hours Clocked</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-purple font-display mt-1">
            {stats.studyHours} hrs
          </p>
          <span className="text-[11px] text-gray-500 mt-2 block">Practice & simulation</span>
        </div>
      </div>

      {/* Main Dashboard Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Attempts (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-brand-navy font-display">
              Recent Examination Attempts
            </h2>
            <Link
              href="/assessments"
              className="text-xs font-semibold text-brand-indigo hover:text-brand-purple"
            >
              Take New Test →
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {recentAttempts.map((attempt) => (
              <div
                key={attempt.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{attempt.date}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      PASSED
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{attempt.title}</h3>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">Score</span>
                    <span className="font-bold text-sm text-brand-navy">{attempt.score}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block">Accuracy</span>
                    <span className="font-bold text-sm text-emerald-600">{attempt.accuracy}</span>
                  </div>
                  <Link
                    href={`/assessments/results/${attempt.id}`}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Areas & Focus Recommendations (1 column) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-brand-navy font-display">
            Target Improvement Areas
          </h2>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <p className="text-xs text-gray-500">
              Calculated from your incorrect answers and negative marking deductions:
            </p>

            <div className="space-y-4">
              {weakAreas.map((area, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-navy">{area.subject}</span>
                    <span className="text-xs font-bold text-rose-600">{area.accuracy} Acc</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{area.recommendation}</p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/categories/NEC"
                className="btn-brand-outline w-full text-center text-xs py-2 font-bold"
              >
                Review Curriculum Notes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
