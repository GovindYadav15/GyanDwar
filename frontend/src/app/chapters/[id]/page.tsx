import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpen,
  Download,
  Lock,
  Sparkles,
  FileText,
  Layers,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { PdfViewer, PdfDocumentItem } from '@/components/content/PdfViewer';

export default async function ChapterNotesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const activeTab = resolvedSearchParams?.tab || 'notes';

  const isFree = id === 'chap-1' || id === 'chap-ppa-1' || id === 'chap-dip-1';

  // Sample high-yield multi-PDF sub-chapters for this chapter
  const samplePdfDocuments: PdfDocumentItem[] = [
    {
      id: 'sub-pdf-1',
      title: 'Sub-Chapter 1.1: Clinker Calcination & Raw Material Formulations',
      fileUrl: '/samples/nepal-engineering-standard.pdf',
      fileSizeBytes: 2450000,
      isFreePreview: true,
      displayOrder: 1,
      content: `### Sub-Chapter 1.1 Overview: Raw Materials & Cement Clinker
- Calcareous materials ($CaO$, 60-67%): Limestone, chalk, marl
- Argillaceous materials ($SiO_2$, 17-25%; $Al_2O_3$, 3-8%): Clay, shale, blast furnace slag
- Burning Zone Temperature: 1400°C to 1500°C in rotary kiln
- Formation of nodules (clinker) 3mm to 20mm diameter.`,
    },
    {
      id: 'sub-pdf-2',
      title: 'Sub-Chapter 1.2: Bogue Compounds & Reaction Kinetics (Formula Handout)',
      fileUrl: '/samples/nepal-engineering-standard.pdf',
      fileSizeBytes: 1820000,
      isFreePreview: isFree,
      displayOrder: 2,
      content: `### Sub-Chapter 1.2 Overview: Bogue Compounds Calculation
1. C3S (Tricalcium Silicate) = 4.071(CaO) - 7.600(SiO2) - 6.718(Al2O3) - 1.430(Fe2O3)
2. C2S (Dicalcium Silicate) = 2.867(SiO2) - 0.7544(C3S)
3. C3A (Tricalcium Aluminate) = 2.650(Al2O3) - 1.692(Fe2O3)
4. C4AF (Tetracalcium Aluminoferrite) = 3.043(Fe2O3)`,
    },
    {
      id: 'sub-pdf-3',
      title: 'Sub-Chapter 1.3: Vicat & Le-Chatelier Laboratory Testing Procedures (NS 40)',
      fileUrl: '/samples/nepal-engineering-standard.pdf',
      fileSizeBytes: 3100000,
      isFreePreview: false,
      displayOrder: 3,
      content: `### Sub-Chapter 1.3 Laboratory Standards (IS 4031 / NS 40)
- Vicat Plunger: 10 mm diameter, 50 mm length
- Vicat Needle for Initial Setting: 1 mm square needle
- Annular Collar for Final Setting: 5 mm diameter with needle projecting 0.5 mm
- Soundness Test: Le-Chatelier split cylinder (30 mm diameter, indicator needles 165 mm long)`,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/categories/NEC"
          className="text-sm font-medium text-gray-500 hover:text-brand-indigo flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Subject Syllabus
        </Link>
        <span className="badge-purple">Concrete Technology • Unit 1</span>
      </div>

      {/* Main Chapter Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-purple">
                Chapter 1 Learning Resource
              </span>
              {isFree ? (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Free Preview
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Premium Resource
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-brand-navy">
              Cement Manufacture, Bogue Compounds & Testing Standards
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Includes comprehensive study notes and {samplePdfDocuments.length} downloadable PDF
              sub-chapters with high-yield examination notes.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/assessments/practice-test-1"
              className="btn-brand-primary text-xs py-2.5 px-4 flex items-center gap-1.5 shadow-sm"
            >
              <BookOpen className="w-4 h-4" />
              Practice Drills
            </Link>
          </div>
        </div>

        {/* Tab Switcher: Notes vs Sub-Chapters & PDFs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <Link
            href={`/chapters/${id}?tab=notes`}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'notes'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-brand-gold" />
            Chapter Study Notes
          </Link>
          <Link
            href={`/chapters/${id}?tab=pdfs`}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'pdfs'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-4 h-4 text-brand-gold" />
            Sub-Chapters & PDF Documents ({samplePdfDocuments.length})
          </Link>
        </div>

        {/* Tab 1: Comprehensive Notes */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <article className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6 text-sm sm:text-base">
              <div className="p-4 rounded-xl bg-brand-indigo/5 border border-brand-indigo/20 text-xs sm:text-sm text-brand-navy">
                <p className="font-semibold text-brand-indigo flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-gold" />
                  NEC & Lok Sewa Examination High-Yield Point
                </p>
                <p className="mt-1">
                  Nepal Engineering Council licensure examinations consistently test questions on
                  Bogue compounds composition, initial/final setting times (Vicat apparatus), and
                  the exact role of Gypsum.
                </p>
              </div>

              <h2 className="text-xl font-bold text-brand-navy mt-6">
                1. Raw Materials & Calcination
              </h2>
              <p>
                Ordinary Portland Cement (OPC) is produced by grinding calcined clinker composed of
                calcareous materials ($CaO$, 60–67%) and argillaceous materials ($SiO_2$, 17–25%;
                $Al_2O_3$, 3–8%; $Fe_2O_3$, 0.5–6%).
              </p>

              <h2 className="text-xl font-bold text-brand-navy mt-6">
                2. The Four Bogue Compounds
              </h2>
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
                    <strong>Role</strong>: Reacts instantaneously with water; causes{' '}
                    <em>flash set</em>; contributes highest heat of hydration; prone to sulfate
                    attack.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-brand-indigo">
                    4. Tetracalcium Aluminoferrite (C4AF)
                  </span>
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>Proportion</strong>: 6% to 10%
                    <br />
                    <strong>Role</strong>: Lowest cementing value, gives characteristic dark gray
                    color to Portland cement.
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-bold text-brand-navy mt-6">
                3. Standard Testing Procedures (NS 40 / IS 4031)
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Standard Normal Consistency (P)</strong>: Determined using Vicat apparatus
                  with a 10 mm diameter plunger. The water percentage which allows the plunger to
                  settle 5 to 7 mm from the bottom of the mold.
                </li>
                <li>
                  <strong>Initial Setting Time</strong>: Tested with 1 mm square needle. Must NOT be
                  less than <strong>30 minutes</strong> for OPC.
                </li>
                <li>
                  <strong>Final Setting Time</strong>: Tested with annular collar needle. Must NOT
                  be greater than <strong>600 minutes (10 hours)</strong> for OPC.
                </li>
                <li>
                  <strong>Soundness Test</strong>: Carried out using Le-Chatelier apparatus to
                  detect unburnt free lime ($CaO$). Expansion must not exceed 10 mm.
                </li>
              </ul>
            </article>

            {/* Sub-Chapter PDF Callout */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-brand-indigo/10 to-brand-purple/10 border border-brand-indigo/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-indigo flex items-center justify-center text-white shrink-0">
                  <Layers className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-navy">
                    Looking for Sub-Chapter Slide Decks & PDFs?
                  </h4>
                  <p className="text-xs text-slate-600">
                    Switch to the Sub-Chapters tab above to access the embedded PDF viewer.
                  </p>
                </div>
              </div>
              <Link
                href={`/chapters/${id}?tab=pdfs`}
                className="btn-brand-primary text-xs py-2 px-4 shrink-0"
              >
                Open PDF Viewer
              </Link>
            </div>
          </div>
        )}

        {/* Tab 2: Sub-Chapters & Embedded PDF Viewer */}
        {activeTab === 'pdfs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <h3 className="text-sm font-bold text-brand-navy flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-purple" />
                  Interactive Engineering PDF Viewer
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  View multi-part lecture notes, derivations, and official codes directly in your
                  browser.
                </p>
              </div>
              <div className="text-xs text-slate-500 font-mono">
                {samplePdfDocuments.length} Sub-Chapters Loaded
              </div>
            </div>

            {/* Embedded Student PDF Viewer */}
            <PdfViewer
              documents={samplePdfDocuments}
              chapterTitle="Cement Manufacture, Bogue Compounds & Testing Standards"
              isLocked={!isFree}
            />
          </div>
        )}

        {/* Action Drill Trigger */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-6 rounded-xl">
          <div>
            <h4 className="font-bold text-brand-navy text-sm">Ready to test what you learned?</h4>
            <p className="text-xs text-gray-600">
              Take the diagnostic practice drill for this chapter with instant scoring and
              explanations.
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
