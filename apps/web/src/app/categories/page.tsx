import React from 'react';
import Link from 'next/link';
import { GraduationCap, Building2, FileCheck2, ArrowRight, BookOpen, Layers } from 'lucide-react';

export default function CategoriesPage() {
  const categories = [
    {
      code: 'NEC',
      title: 'Nepal Engineering Council (NEC) Licensure Examination',
      nepali: 'नेपाल इन्जिनियरिङ काउन्सिल लाइसेन्स परीक्षा',
      description:
        'Standardized examination required by law to obtain engineering practice licenses in Nepal. Conforms to the revised NEC syllabus.',
      faculties: [
        { name: 'Civil Engineering', count: '10 Subjects • 60 Chapters' },
        { name: 'Electrical Engineering', count: '9 Subjects • 54 Chapters' },
        { name: 'Computer Engineering', count: '8 Subjects • 48 Chapters' },
        { name: 'Mechanical Engineering', count: '9 Subjects • 52 Chapters' },
      ],
      icon: GraduationCap,
      href: '/categories/NEC',
      accent: 'border-l-4 border-l-brand-indigo',
    },
    {
      code: 'LOK_SEWA',
      title: 'Lok Sewa Aayog (Public Service Commission) Technical',
      nepali: 'लोक सेवा आयोग इन्जिनियरिङ सेवा परीक्षा',
      description:
        'Competitive government officer & overseer recruitment examinations under Nepal Engineering Service (Ministry of Physical Infrastructure, Irrigation, Urban Dev).',
      faculties: [
        {
          name: 'Gazetted 7th Level (Officer / Assistant Engineer)',
          count: 'General GK + Engineering Subjects',
        },
        {
          name: 'Non-Gazetted 5th Level (Sub-Engineer / Overseer)',
          count: 'Technical Fundamentals + Field Practices',
        },
      ],
      icon: Building2,
      href: '/categories/LOK_SEWA',
      accent: 'border-l-4 border-l-brand-purple',
    },
    {
      code: 'DIPLOMA',
      title: 'Diploma Engineering Licensure Examination',
      nepali: 'डिप्लोमा लाइसेन्स तथा प्राविधिक योग्यता परीक्षा',
      description:
        'Technical certification and qualification exams for 3-year diploma in engineering graduates from CTEVT and affiliated institutions.',
      faculties: [
        { name: 'Diploma in Civil Engineering', count: 'Surveying, Construction, Estimating' },
        {
          name: 'Diploma in Electrical Engineering',
          count: 'Wiring, Motors, Substation Maintenance',
        },
      ],
      icon: FileCheck2,
      href: '/categories/DIPLOMA',
      accent: 'border-l-4 border-l-brand-gold',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-indigo bg-brand-purple/10 px-3 py-1 rounded-full border border-brand-purple/20">
          Curriculum Index
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-brand-navy">
          Explore Examination Syllabi & Subjects
        </h1>
        <p className="text-gray-600 max-w-2xl text-sm sm:text-base">
          Browse comprehensive syllabus structures, chapter notes, and practice tests grouped by
          discipline.
        </p>
      </div>

      <div className="space-y-8">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.code}
              className={`bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-card-elevated transition-all ${cat.accent}`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-indigo/10 text-brand-indigo flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold font-display text-brand-navy">
                        {cat.title}
                      </h2>
                      <p className="text-xs text-brand-purple font-medium">{cat.nepali}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
                    {cat.description}
                  </p>

                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                    {cat.faculties.map((f, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs"
                      >
                        <p className="font-semibold text-brand-navy">{f.name}</p>
                        <p className="text-gray-500 mt-0.5">{f.count}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                  <Link
                    href={cat.href}
                    className="btn-brand-primary text-sm py-2.5 px-5 flex items-center justify-center gap-2"
                  >
                    View Curriculum
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/assessments?category=${cat.code}`}
                    className="btn-brand-outline text-sm py-2.5 px-5 flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Practice Drills
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
