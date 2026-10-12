import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Download, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

export default async function ChapterNotesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isFree = id === 'chap-1' || id === 'chap-ppa-1' || id === 'chap-dip-1';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/categories/NEC"
          className="text-sm font-medium text-gray-500 hover:text-brand-indigo flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Subject Syllabus
        </Link>
        <span className="badge-purple">Concrete Technology • Unit 1</span>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                Chapter 1 Study Material
              </span>
              {isFree ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Free Preview
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Premium Resource
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-brand-navy">
              Cement Manufacture, Bogue Compounds & Testing Standards
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/assessments/practice-test-1"
              className="btn-brand-primary text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Chapter Practice Drills
            </Link>
          </div>
        </div>

        {/* Content Viewer */}
        <article className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6 text-sm sm:text-base">
          <div className="p-4 rounded-xl bg-brand-indigo/5 border border-brand-indigo/20 text-xs sm:text-sm text-brand-navy">
            <p className="font-semibold text-brand-indigo flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-gold" />
              NEC & Lok Sewa Examination High-Yield Point
            </p>
            <p className="mt-1">
              Nepal Engineering Council licensure examinations consistently test questions on Bogue
              compounds composition, initial/final setting times (Vicat apparatus), and the exact
              role of Gypsum.
            </p>
          </div>

          <h2 className="text-xl font-bold text-brand-navy mt-6">1. Raw Materials & Calcination</h2>
          <p>
            Ordinary Portland Cement (OPC) is produced by grinding calcined clinker composed of
            calcareous materials ($CaO$, 60–67%) and argillaceous materials ($SiO_2$, 17–25%;
            $Al_2O_3$, 3–8%; $Fe_2O_3$, 0.5–6%).
          </p>

          <h2 className="text-xl font-bold text-brand-navy mt-6">2. The Four Bogue Compounds</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-brand-indigo">
                1. Tricalcium Silicate (C3S)
              </span>
              <p className="text-xs text-gray-600 mt-1">
                <strong>Proportion</strong>: 30% to 50%
                <br />
                <strong>Role</strong>: Hydrates rapidly, produces high heat of hydration, and is
                responsible for the early strength of concrete within the first 7 days.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-brand-indigo">
                2. Dicalcium Silicate (C2S)
              </span>
              <p className="text-xs text-gray-600 mt-1">
                <strong>Proportion</strong>: 20% to 45%
                <br />
                <strong>Role</strong>: Hydrates slowly, low heat of hydration, responsible for
                progressive long-term strength (after 28 days to 1 year).
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-brand-indigo">
                3. Tricalcium Aluminate (C3A)
              </span>
              <p className="text-xs text-gray-600 mt-1">
                <strong>Proportion</strong>: 8% to 12%
                <br />
                <strong>Role</strong>: Reacts instantaneously with water; causes <em>flash set</em>;
                contributes highest heat of hydration; prone to sulfate attack.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-brand-indigo">
                4. Tetracalcium Aluminoferrite (C4AF)
              </span>
              <p className="text-xs text-gray-600 mt-1">
                <strong>Proportion</strong>: 6% to 10%
                <br />
                <strong>Role</strong>: Lowest cementing value, gives characteristic dark gray color
                to Portland cement.
              </p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-brand-navy mt-6">
            3. Standard Testing Procedures (NS 40 / IS 4031)
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Standard Normal Consistency (P)</strong>: Determined using Vicat apparatus
              with a 10 mm diameter plunger. The water percentage which allows the plunger to settle
              5 to 7 mm from the bottom of the mold.
            </li>
            <li>
              <strong>Initial Setting Time</strong>: Tested with 1 mm square needle. Must NOT be
              less than <strong>30 minutes</strong> for OPC.
            </li>
            <li>
              <strong>Final Setting Time</strong>: Tested with annular collar needle. Must NOT be
              greater than <strong>600 minutes (10 hours)</strong> for OPC.
            </li>
            <li>
              <strong>Soundness Test</strong>: Carried out using Le-Chatelier apparatus to detect
              unburnt free lime ($CaO$). Expansion must not exceed 10 mm.
            </li>
          </ul>
        </article>

        {/* Action Drill Trigger */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-6 rounded-xl">
          <div>
            <h4 className="font-bold text-brand-navy text-sm">Ready to test what you learned?</h4>
            <p className="text-xs text-gray-600">
              Take the 5-question diagnostic drill on this unit with instant answers.
            </p>
          </div>
          <Link
            href="/assessments"
            className="btn-brand-gold text-xs py-2 px-5 font-bold flex items-center gap-2 shrink-0"
          >
            Start Chapter Drill
          </Link>
        </div>
      </div>
    </div>
  );
}
