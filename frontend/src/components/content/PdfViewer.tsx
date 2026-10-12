'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ExternalLink,
  Lock,
  Layers,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

export interface PdfDocumentItem {
  id: string;
  title: string;
  fileUrl?: string | null;
  fileSizeBytes?: number | null;
  isFreePreview?: boolean;
  content?: string | null;
  displayOrder?: number;
}

interface PdfViewerProps {
  documents: PdfDocumentItem[];
  chapterTitle: string;
  isLocked?: boolean;
}

export function PdfViewer({ documents, chapterTitle, isLocked = false }: PdfViewerProps) {
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const activeDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 175));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 60));
  const handleResetZoom = () => setZoomLevel(100);

  if (!activeDoc) {
    return (
      <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-500">
        <FileText className="w-10 h-10 mx-auto mb-2 text-slate-400" />
        <p className="font-medium">No PDF documents or sub-chapters uploaded yet.</p>
      </div>
    );
  }

  // If chapter is locked and current document is not a free preview
  const isDocumentLocked = isLocked && !activeDoc.isFreePreview;

  const pdfUrl = activeDoc.fileUrl || '/samples/nepal-engineering-standard.pdf';

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none h-screen w-screen bg-slate-900 border-none'
          : 'h-[750px] w-full'
      }`}
    >
      {/* PDF Viewer Header Toolbar */}
      <div className="bg-brand-navy text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-brand-indigo flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold truncate text-white">{activeDoc.title}</h3>
            <p className="text-[11px] text-brand-purple-light truncate">
              {chapterTitle} •{' '}
              {documents.length > 1
                ? `${documents.length} Sub-Chapters / PDFs Available`
                : '1 Document'}
            </p>
          </div>
        </div>

        {/* Sub-chapter Quick Switcher (when multiple PDFs exist) */}
        {documents.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
            <span className="text-xs text-slate-300 font-medium hidden sm:inline flex items-center gap-1">
              <Layers className="w-3 h-3 text-brand-gold" /> Sub-Chapters:
            </span>
            {documents.map((doc, idx) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDocId(doc.id)}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors shrink-0 flex items-center gap-1 ${
                  doc.id === activeDoc.id
                    ? 'bg-brand-gold text-brand-navy font-bold shadow-sm'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <span>Part {idx + 1}</span>
                {doc.isFreePreview && (
                  <span className="text-[9px] px-1 bg-emerald-500/80 text-white rounded">Free</span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Viewer Controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-300 min-w-10 text-center">
            {zoomLevel}%
          </span>
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            title="Reset Zoom"
            className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-white/20 mx-1" />

          {activeDoc.fileUrl && !isDocumentLocked && (
            <a
              href={activeDoc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              title="Open / Download PDF"
              className="p-1.5 rounded text-slate-300 hover:text-brand-gold hover:bg-white/10 transition-colors"
            >
              <Download className="w-4 h-4" />
            </a>
          )}

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Viewer'}
            className="p-1.5 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Viewer Body */}
      <div className="flex-1 bg-slate-100 relative overflow-auto flex items-center justify-center">
        {isDocumentLocked ? (
          /* Locked State Overaly */
          <div className="text-center p-8 max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-brand-navy">Premium PDF Sub-Chapter</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                This study PDF is reserved for subscribed students. If you recently completed
                payment, your subscription will be activated upon admin verification.
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="/pricing" className="btn-brand-primary text-xs py-2 px-4 w-full sm:w-auto">
                Explore Preparation Passes
              </a>
              <a href="/dashboard" className="btn-brand-outline text-xs py-2 px-4 w-full sm:w-auto">
                View My Status
              </a>
            </div>
          </div>
        ) : (
          /* PDF Container */
          <div
            className="w-full h-full flex flex-col items-center justify-start transition-transform duration-150 origin-top"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            {activeDoc.fileUrl ? (
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=1`}
                className="w-full h-full border-none shadow-md bg-white"
                title={activeDoc.title}
              />
            ) : (
              /* High-Yield Interactive Document Preview when using internal Markdown/text */
              <div className="w-full max-w-4xl bg-white min-h-full p-8 md:p-12 shadow-lg my-4 rounded-xl border border-slate-200">
                <div className="border-b border-slate-200 pb-4 mb-6 flex items-center justify-between">
                  <div>
                    <span className="badge-purple mb-1">Sub-Chapter Document</span>
                    <h2 className="text-xl font-bold text-brand-navy">{activeDoc.title}</h2>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">ExamSathi Verified PDF</span>
                </div>

                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm">
                  {activeDoc.content ? (
                    <div className="whitespace-pre-wrap">{activeDoc.content}</div>
                  ) : (
                    <div className="space-y-4">
                      <p>
                        This sub-chapter contains comprehensive lecture slides, derivations,
                        standard IS/NS code formulas, and examination-ready diagrams.
                      </p>
                      <div className="p-4 rounded-xl bg-brand-indigo/5 border border-brand-indigo/20 text-brand-navy">
                        <h4 className="font-semibold text-xs text-brand-indigo mb-1 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" /> High-Yield Engineering Reference
                        </h4>
                        <p className="text-xs text-slate-600">
                          Includes solved past question references from Nepal Engineering Council
                          (NEC) licensure and Lok Sewa Aayog technical examinations.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sub-chapter navigation footer if multiple documents */}
      {documents.length > 1 && (
        <div className="bg-white border-t border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>
            Viewing: <strong className="text-brand-navy">{activeDoc.title}</strong>
          </span>
          <div className="flex items-center gap-2">
            {documents.map((d, index) => (
              <button
                key={d.id}
                onClick={() => setSelectedDocId(d.id)}
                className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[11px] transition-colors ${
                  d.id === activeDoc.id
                    ? 'bg-brand-indigo text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
