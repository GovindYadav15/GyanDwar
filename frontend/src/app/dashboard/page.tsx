'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Clock,
  Layers,
  Lock,
  Unlock,
  LogOut,
  User,
} from 'lucide-react';
import { api } from '@/lib/api-client';

export default function StudentDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const token = api.getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    const stored = api.getUser();
    if (stored) {
      setCurrentUser(stored);
    } else {
      api.get<any>('/auth/me')
        .then((profile) => {
          if (profile) {
            setCurrentUser(profile);
            api.setUser(profile);
          }
        })
        .catch(() => {
          api.logout();
          router.push('/login');
        });
    }
  }, [router]);

  const handleLogout = () => {
    api.logout();
    router.push('/login');
  };
  const [enrolledCourses, setEnrolledCourses] = useState([
    {
      id: 'enr-1',
      title: 'Nepal Engineering Council (NEC) - Civil License Complete Track',
      category: 'NEC',
      status: 'ACTIVE',
      enrolledDate: 'Today',
      totalMocks: 15,
      completedMocks: 2,
    },
    {
      id: 'enr-2',
      title: 'Lok Sewa Aayog: Civil Engineer (7th Level) Complete Preparation',
      category: 'LOK_SEWA',
      status: 'PENDING_VERIFICATION',
      enrolledDate: 'Today',
      totalMocks: 25,
      completedMocks: 0,
      note: 'eSewa payment screenshot submitted to 9824803556. Admin verification in progress.',
    },
  ]);

  const stats = {
    totalAttempts: 12,
    passRate: '83.3%',
    averageAccuracy: '76.4%',
    studyHours: 24,
    activeCourses: enrolledCourses.filter((c) => c.status === 'ACTIVE').length,
  };

  const activeSubscription = {
    planName: 'Preparation Pass (Verified)',
    expiryDate: 'Oct 12, 2027',
    daysRemaining: 365,
    status: 'ACTIVE',
  };

  const recentAttempts = [
    {
      id: 'att-101',
      title: 'NEC Civil Engineering License (Full 100-Mark Mock 2026)',
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
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="badge-purple">Candidate Portal</span>
            <span className="text-xs text-gray-500 font-medium">
              {currentUser?.email || 'Student Account'}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-red-200 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors ml-2 shadow-xs"
              title="Sign out of student account"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-brand-navy">
            Namaste, {currentUser?.fullName || 'Candidate'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Target: Nepal Engineering Council (NEC) License Examination • Civil Engineering
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
              Valid until {activeSubscription.expiryDate} ({activeSubscription.daysRemaining} days left)
            </p>
          </div>
          <Link href="/courses/buy" className="btn-brand-gold text-xs py-2 px-3.5 font-bold shrink-0">
            Buy Courses
          </Link>
        </div>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-gray-500 block">Enrolled Courses</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display mt-1">
            {enrolledCourses.length}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-2">
            <CheckCircle2 className="w-3.5 h-3.5" /> {stats.activeCourses} Unlocked & Active
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

      {/* ========================================================= */}
      {/* SECTION: MY ENROLLED COURSES (MULTI-COURSE ACCESS) */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-brand-navy font-display flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-indigo" />
              My Enrolled Preparation Courses
            </h2>
            <p className="text-xs text-slate-500">
              Students can hold active access to multiple independent examination courses.
            </p>
          </div>
          <Link
            href="/courses/buy"
            className="btn-brand-primary text-xs py-2 px-3.5 font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            Enroll in More Courses
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrolledCourses.map((course) => {
            const isActive = course.status === 'ACTIVE';
            return (
              <div
                key={course.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                    : 'bg-amber-50/40 border-amber-200 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-brand-navy/5 text-brand-navy">
                        {course.category}
                      </span>
                      {isActive ? (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Active & Unlocked
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Awaiting Verification
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-brand-navy leading-snug">
                      {course.title}
                    </h3>
                  </div>

                  <div className="shrink-0">
                    {isActive ? (
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Unlock className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>

                {course.note && (
                  <p className="mt-3 text-[11px] text-amber-800 bg-amber-100/60 p-2.5 rounded-xl border border-amber-200/60">
                    {course.note}
                  </p>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Mock Progress: {course.completedMocks} / {course.totalMocks} Completed
                  </span>

                  {isActive ? (
                    <Link
                      href="/assessments"
                      className="btn-brand-primary text-xs py-1.5 px-3 font-bold flex items-center gap-1"
                    >
                      <span>Study & Practice</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  ) : (
                    <span className="text-xs text-amber-800 font-semibold italic">
                      Verifying receipt...
                    </span>
                  )}
                </div>
              </div>
            );
          })}
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
                className="btn-brand-outline w-full text-center text-xs py-2 font-bold block"
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
