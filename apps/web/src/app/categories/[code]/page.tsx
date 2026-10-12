import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, CheckCircle, Sparkles, FileText, ChevronRight } from 'lucide-react';

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  // Realistic mock structure aligned with seed data
  const categoryData: Record<string, any> = {
    NEC: {
      title: 'Nepal Engineering Council (NEC) Licensure Examination',
      subtitle: 'Official 100-Mark Licensure Syllabus and Question Banks',
      faculties: [
        {
          name: 'Civil Engineering (CE)',
          subjects: [
            {
              id: 'sub-concrete',
              name: 'Concrete Technology & Construction Materials',
              weight: '10 Marks (10 MCQs)',
              chapters: [
                {
                  id: 'chap-1',
                  number: 1,
                  title: 'Cement & Pozzolanic Materials',
                  isFreePreview: true,
                  questionCount: 35,
                  desc: 'Bogue compounds, hydration kinetics, Vicat consistency tests, fineness, and sound testing.',
                },
                {
                  id: 'chap-2',
                  number: 2,
                  title: 'Aggregates & Fresh Concrete Properties',
                  isFreePreview: false,
                  questionCount: 42,
                  desc: 'Grading curves, fineness modulus, slump test, segregation, and compaction factor.',
                },
                {
                  id: 'chap-3',
                  number: 3,
                  title: 'Mix Design & Non-Destructive Testing (NDT)',
                  isFreePreview: false,
                  questionCount: 30,
                  desc: 'Rebound hammer, ultrasonic pulse velocity, core tests, and characteristic strength.',
                },
              ],
            },
            {
              id: 'sub-struct',
              name: 'Structural Analysis & Design (IS 456 / NBC 105:2020)',
              weight: '15 Marks (15 MCQs)',
              chapters: [
                {
                  id: 'chap-4',
                  number: 1,
                  title: 'Determinate & Indeterminate Trusses and Beams',
                  isFreePreview: false,
                  questionCount: 50,
                  desc: 'Moment distribution, slope deflection, and virtual work principles.',
                },
                {
                  id: 'chap-5',
                  number: 2,
                  title: 'Earthquake Resistant Building Design (NBC 105)',
                  isFreePreview: false,
                  questionCount: 45,
                  desc: 'Response spectrum method, ductility detailing, and base shear calculations.',
                },
              ],
            },
          ],
        },
      ],
    },
    LOK_SEWA: {
      title: 'Lok Sewa Aayog (Technical Engineering Service)',
      subtitle: 'Public Service Commission 7th Level & 5th Level Cadre',
      faculties: [
        {
          name: 'Engineering Service - Civil Group',
          subjects: [
            {
              id: 'sub-ppa',
              name: 'Public Procurement Act 2063 & Project Management',
              weight: '20 Marks',
              chapters: [
                {
                  id: 'chap-ppa-1',
                  number: 1,
                  title: 'PPA 2063: Bidding Documents & Procurement Methods',
                  isFreePreview: true,
                  questionCount: 40,
                  desc: 'ICB, NCB, sealed quotations, user committee works, bid evaluation rules.',
                },
              ],
            },
          ],
        },
      ],
    },
    DIPLOMA: {
      title: 'Diploma Engineering Licensure Examination',
      subtitle: 'Vocational & Overseer Licensing Syllabus',
      faculties: [
        {
          name: 'Diploma in Civil Engineering',
          subjects: [
            {
              id: 'sub-dip-survey',
              name: 'Surveying & Levelling Fundamentals',
              weight: '15 Marks',
              chapters: [
                {
                  id: 'chap-dip-1',
                  number: 1,
                  title: 'Chain, Compass & Theodolite Surveying',
                  isFreePreview: true,
                  questionCount: 35,
                  desc: 'Traverse calculations, magnetic declination, closing errors, and field book booking.',
                },
              ],
            },
          ],
        },
      ],
    },
  };

  const category = categoryData[code.toUpperCase()] || categoryData.NEC;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link
          href="/categories"
          className="hover:text-brand-indigo flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> All Categories
        </Link>
        <span>/</span>
        <span className="text-brand-navy font-semibold">{code.toUpperCase()}</span>
      </div>

      <div className="space-y-3 bg-gradient-to-r from-brand-navy to-brand-navy-light text-white p-8 rounded-2xl shadow-md border border-brand-indigo/30">
        <span className="badge-gold">Demonstration Syllabus</span>
        <h1 className="text-2xl sm:text-4xl font-bold font-display">{category.title}</h1>
        <p className="text-brand-gold text-sm sm:text-base font-medium">{category.subtitle}</p>
      </div>

      {category.faculties.map((faculty: any, fIdx: number) => (
        <div key={fIdx} className="space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-brand-navy font-display">{faculty.name}</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-purple/15 text-brand-purple-dark">
              Active Curriculum
            </span>
          </div>

          <div className="space-y-6">
            {faculty.subjects.map((sub: any) => (
              <div
                key={sub.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-lg font-bold text-brand-navy">{sub.name}</h3>
                  <span className="text-xs font-semibold text-brand-indigo bg-brand-indigo/10 px-3 py-1 rounded-full w-fit">
                    Weight: {sub.weight}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {sub.chapters.map((chap: any) => (
                    <div
                      key={chap.id}
                      className="p-4 rounded-xl border border-slate-200/80 hover:border-brand-purple/50 bg-slate-50/50 hover:bg-white transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-brand-purple">
                            Chapter {chap.number}
                          </span>
                          {chap.isFreePreview ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-600" /> Free Trial
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                              🔒 Premium Pass
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-slate-800 mb-1">{chap.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{chap.desc}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                        <span className="text-gray-500">{chap.questionCount} Questions</span>
                        <Link
                          href={`/chapters/${chap.id}`}
                          className="font-semibold text-brand-indigo hover:text-brand-purple flex items-center gap-0.5"
                        >
                          Read Notes
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
