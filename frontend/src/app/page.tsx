import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Award,
  CheckCircle,
  Timer,
  BookOpen,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  Building2,
  FileCheck2,
} from 'lucide-react';

export default function HomePage() {
  const categories = [
    {
      code: 'NEC',
      title: 'NEC Engineering License',
      nepaliTitle: 'नेपाल इन्जिनियरिङ काउन्सिल',
      desc: 'Mandatory license exam preparation for Civil, Electrical, Mechanical, and Computer graduates.',
      features: [
        'Official 100-mark mock format',
        '0.2 negative marking simulation',
        'Bogue compounds & IS/NS codes',
      ],
      badge: 'High Demand',
      icon: GraduationCap,
      href: '/categories/NEC',
    },
    {
      code: 'LOK_SEWA',
      title: 'Lok Sewa Aayog Technical',
      nepaliTitle: 'लोक सेवा आयोग प्राविधिक',
      desc: 'Competitive exams for Nepal Engineering Service (Gazetted 7th Officer & Non-Gazetted 5th Assistant).',
      features: [
        'Public Procurement Act 2063',
        'Constitution of Nepal GK',
        'Past question trends & drills',
      ],
      badge: 'Public Service',
      icon: Building2,
      href: '/categories/LOK_SEWA',
    },
    {
      code: 'DIPLOMA',
      title: 'Diploma Licensure & CTEVT',
      nepaliTitle: 'डिप्लोमा इन्जिनियरिङ',
      desc: 'Licensure qualifying assessments and overseer recruitment examinations across Nepal.',
      features: [
        'Core technical theory',
        'Chapter-wise MCQ drills',
        'Diagram-based problem solving',
      ],
      badge: 'Vocational',
      icon: FileCheck2,
      href: '/categories/DIPLOMA',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient text-white pt-24 pb-32">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e3d095_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Glow orbs */}
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-brand-indigo/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-brand-gold/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-brand-gold/30 text-brand-gold text-xs font-semibold tracking-wide uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Nepal’s Dedicated Exam Preparation Ecosystem</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-display leading-tight">
              Pass Your License & <br />
              <span className="text-transparent bg-clip-text bg-gold-sheen">
                Competitive Exam
              </span>{' '}
              on the First Attempt
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 font-normal leading-relaxed">
              Targeted syllabus notes, chapter-wise practice drills, and full-length 100-mark mock
              examinations modeled accurately on official NEC and Lok Sewa patterns.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/assessments?type=FULL_MOCK"
                className="btn-brand-gold w-full sm:w-auto px-8 py-3.5 text-base flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5 text-brand-navy" />
                Take Free 100-Mark Mock Test
              </Link>
              <Link
                href="/categories"
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg border border-white/20 hover:bg-white/10 text-white font-semibold text-base transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5 text-brand-gold" />
                Browse Syllabi & Notes
              </Link>
            </div>

            {/* Quick Stats Banner */}
            <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-t border-white/10">
              <div>
                <p className="text-3xl font-extrabold text-brand-gold font-display">100%</p>
                <p className="text-xs text-gray-400 mt-1">Official Format Alignments</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-brand-gold font-display">10,000+</p>
                <p className="text-xs text-gray-400 mt-1">Detailed Engineering MCQs</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-brand-gold font-display">0.2</p>
                <p className="text-xs text-gray-400 mt-1">Negative Marking Simulation</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-brand-gold font-display">94.8%</p>
                <p className="text-xs text-gray-400 mt-1">Student Pass Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Examination Tracks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-indigo bg-brand-purple/10 px-3 py-1 rounded-full border border-brand-purple/20">
            Structured Curricula
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-brand-navy">
            Choose Your Examination Track
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Select an exam track to access syllabus breakdowns, chapter notes, and timed simulation
            sets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.code}
                className="group relative bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-card-elevated hover:border-brand-purple/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center group-hover:bg-brand-indigo group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-gold/25 text-brand-navy border border-brand-gold/50">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-brand-navy group-hover:text-brand-indigo transition-colors font-display">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-brand-purple font-medium mb-3">{cat.nepaliTitle}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">{cat.desc}</p>

                  <ul className="space-y-2.5 mb-8 text-xs text-gray-700">
                    {cat.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={cat.href}
                  className="w-full py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-brand-indigo hover:text-white text-brand-navy font-semibold text-sm transition-all flex items-center justify-center gap-2 group-hover:bg-brand-indigo group-hover:text-white"
                >
                  Explore Track
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Assessment Integrity & Exam Room Highlights */}
      <section className="bg-brand-navy py-20 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-gold bg-brand-gold/15 px-3 py-1 rounded-full border border-brand-gold/30">
                Exam-Grade Engine
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display leading-tight">
                Simulate True Exam Hall Pressure with 100-Mark Model Exams
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Exam day is not the time to learn time management. Our assessment engine operates
                server-authoritative timers, strict negative mark penalties, and randomized question
                distributions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <Timer className="w-6 h-6 text-brand-gold mb-2" />
                  <h4 className="font-semibold text-sm text-white">Server-Timed 120 Mins</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Accurate countdown without client clock vulnerabilities.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <TrendingUp className="w-6 h-6 text-brand-gold mb-2" />
                  <h4 className="font-semibold text-sm text-white">Instant Diagnostics</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Detailed breakdown by subject, chapter accuracy, and penalties.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/assessments?type=FULL_MOCK"
                  className="btn-brand-gold px-6 py-3 font-bold inline-flex items-center gap-2"
                >
                  Try Chapter 1 Free Practice
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Interactive Preview Card Mockup */}
            <div className="card-glass p-6 text-brand-navy rounded-2xl shadow-2xl border border-white/20">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                    Active Exam Attempt
                  </span>
                </div>
                <div className="px-3 py-1 rounded-md bg-brand-navy text-brand-gold text-xs font-mono font-bold">
                  ⏱ 01:48:22 Left
                </div>
              </div>

              <div className="py-6 space-y-4">
                <span className="text-xs font-bold text-brand-purple">
                  Question 14 of 100 • 1.0 Mark (–0.2 Penalty)
                </span>
                <p className="text-base font-semibold text-slate-800 leading-snug">
                  Which Bogue compound is primarily responsible for early strength development of
                  Portland cement within the first 7 days?
                </p>

                <div className="space-y-2 pt-2">
                  <div className="p-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 bg-white">
                    A) Dicalcium Silicate (C2S)
                  </div>
                  <div className="p-3 rounded-lg border-2 border-brand-indigo bg-brand-indigo/10 text-sm font-bold text-brand-indigo flex items-center justify-between">
                    <span>B) Tricalcium Silicate (C3S)</span>
                    <CheckCircle className="w-4 h-4 text-brand-indigo" />
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 bg-white">
                    C) Tricalcium Aluminate (C3A)
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 bg-white">
                    D) Tetracalcium Aluminoferrite (C4AF)
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>92 Answered • 8 Marked for Review</span>
                <span className="font-semibold text-emerald-600">Auto-saved to server</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-indigo bg-brand-purple/10 px-3 py-1 rounded-full border border-brand-purple/20">
            Affordable Licensing Passes
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-brand-navy">
            Invest in Your Engineering Career
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Transparent pricing in Nepalese Rupees (NPR). Instant access with eSewa and Khalti
            digital wallets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Monthly */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-brand-navy">1 Month Sprint Pass</h3>
              <p className="text-xs text-gray-500 mt-1">Final month intensive test revision</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-extrabold text-brand-navy">NPR 999</span>
                <span className="text-xs text-gray-500 ml-1">/ 30 days</span>
              </div>
              <ul className="space-y-2.5 text-xs text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> All Subject MCQ Question
                  Banks
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Unlimited Chapter Practice
                  Drills
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> 10 Full 100-Mark Mock Exams
                </li>
              </ul>
            </div>
            <Link href="/pricing" className="btn-brand-outline w-full text-center text-sm">
              Get 1 Month Pass
            </Link>
          </div>

          {/* Quarterly - Popular */}
          <div className="bg-white rounded-2xl p-8 border-2 border-brand-indigo shadow-card-elevated relative flex flex-col justify-between">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-gold text-brand-navy font-bold text-xs uppercase tracking-wide border border-brand-gold-dark shadow-sm">
              Most Popular
            </div>
            <div>
              <h3 className="text-lg font-bold text-brand-indigo">3 Month Preparation Pass</h3>
              <p className="text-xs text-gray-500 mt-1">Complete syllabus coverage & mocks</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-extrabold text-brand-navy">NPR 2,499</span>
                <span className="text-xs text-gray-500 ml-1">/ 90 days</span>
              </div>
              <ul className="space-y-2.5 text-xs text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Unlimited 100-Mark Model
                  Simulations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Comprehensive Chapter Notes &
                  Formulas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Detailed Performance &
                  Weak-Topic Analytics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> eSewa & Khalti Instant
                  Activation
                </li>
              </ul>
            </div>
            <Link href="/pricing" className="btn-brand-primary w-full text-center text-sm">
              Unlock Complete Prep
            </Link>
          </div>

          {/* Annual */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-brand-navy">1 Year Career Pass</h3>
              <p className="text-xs text-gray-500 mt-1">NEC License + Lok Sewa combined</p>
              <div className="mt-4 mb-6">
                <span className="text-3xl font-extrabold text-brand-navy">NPR 5,999</span>
                <span className="text-xs text-gray-500 ml-1">/ 365 days</span>
              </div>
              <ul className="space-y-2.5 text-xs text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Both NEC License & Lok Sewa
                  Access
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Free Upgrades for New
                  Syllabus Updates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" /> Dedicated Mentor Doubt
                  Resolution
                </li>
              </ul>
            </div>
            <Link href="/pricing" className="btn-brand-outline w-full text-center text-sm">
              Get 1 Year Pass
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
