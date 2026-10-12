'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  HelpCircle,
  FileText,
  CreditCard,
  ShieldCheck,
  TrendingUp,
  Search,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  BookOpen,
  Layers,
  Upload,
  Download,
  AlertCircle,
  Trash2,
  Lock,
  Unlock,
  Check,
  X,
  Sparkles,
  FileCode,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';

type AdminTab = 'overview' | 'content' | 'mcq-studio' | 'payments' | 'users';

export default function AdminConsolePage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // --- Notification Banner State ---
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // -------------------------------------------------------------
  // Mock Data & States for Scalable Admin Capabilities
  // -------------------------------------------------------------

  // 1. Overview Metrics
  const metrics = {
    totalStudents: 1420,
    totalStaff: 12,
    totalQuestions: 2840,
    totalChapters: 48,
    pendingVerifications: 3,
    totalRevenueNpr: 'NPR 1,248,500',
    conversionRate: '28.4%',
  };

  // 2. Content & Chapter Sub-Chapter State
  const [selectedChapterId, setSelectedChapterId] = useState<string>('chap-1');
  const [chapters, setChapters] = useState([
    {
      id: 'chap-1',
      title: 'Cement Manufacture, Bogue Compounds & Testing Standards',
      chapterNumber: 1,
      subject: 'Concrete Technology (CIVIL-01)',
      category: 'NEC Licensure',
      notesContent: `### Ordinary Portland Cement (OPC) Overview
- Raw materials: Calcareous (CaO: 60-67%) & Argillaceous (SiO2: 17-25%, Al2O3: 3-8%).
- Four Bogue Compounds: C3S (early strength), C2S (progressive strength), C3A (flash set, highest heat), C4AF (dark gray color).
- Tests: Vicat apparatus for standard consistency (5-7mm depth) and setting time (initial >= 30 mins, final <= 600 mins).`,
      subChapters: [
        {
          id: 'res-1',
          title: 'Sub-Chapter 1.1: Clinker Calcination & Raw Material Formulations [PDF]',
          fileUrl: 'https://example.com/slides/clinker-calcination.pdf',
          fileSizeBytes: '2.4 MB',
          isFreePreview: true,
          displayOrder: 1,
        },
        {
          id: 'res-2',
          title: 'Sub-Chapter 1.2: Bogue Compounds & Reaction Kinetics (Formula Handout) [PDF]',
          fileUrl: 'https://example.com/handouts/bogue-compounds.pdf',
          fileSizeBytes: '1.8 MB',
          isFreePreview: false,
          displayOrder: 2,
        },
      ],
    },
    {
      id: 'chap-2',
      title: 'Aggregates: Classification, Specific Gravity & Sieve Analysis',
      chapterNumber: 2,
      subject: 'Concrete Technology (CIVIL-01)',
      category: 'NEC Licensure',
      notesContent: `### Fine & Coarse Aggregates
- Bulking of sand: Maximum at 4-6% moisture content (up to 25-30% volume increase).
- Fineness Modulus: Sand (2.2 - 3.2), Coarse aggregate (6.0 - 8.5).`,
      subChapters: [
        {
          id: 'res-3',
          title: 'Sub-Chapter 2.1: Sieve Analysis Grading Curves & Fineness Modulus [PDF]',
          fileUrl: 'https://example.com/slides/sieve-analysis.pdf',
          fileSizeBytes: '3.1 MB',
          isFreePreview: false,
          displayOrder: 1,
        },
      ],
    },
    {
      id: 'chap-3',
      title: 'Public Procurement Act 2063 & PPR 2064 Clauses',
      chapterNumber: 1,
      subject: 'Engineering Professional Practice & Procurement',
      category: 'Lok Sewa Aayog',
      notesContent: `### PPA 2063 Key Thresholds
- Direct Purchase: Works up to NPR 5 Lakhs, Goods/Consultancy up to NPR 5 Lakhs.
- Sealed Quotation: Works & Goods from NPR 5 Lakhs to NPR 20 Lakhs.
- National Competitive Bidding (NCB): Compulsory above NPR 20 Lakhs.`,
      subChapters: [
        {
          id: 'res-4',
          title: 'Sub-Chapter 1.1: Procurement Methods & Bid Evaluation Flowchart [PDF]',
          fileUrl: 'https://example.com/ppa/evaluation-flowchart.pdf',
          fileSizeBytes: '1.5 MB',
          isFreePreview: true,
          displayOrder: 1,
        },
      ],
    },
  ]);

  // Content form inputs
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [newSubChapterTitle, setNewSubChapterTitle] = useState<string>('');
  const [newSubChapterUrl, setNewSubChapterUrl] = useState<string>('');
  const [newSubChapterFree, setNewSubChapterFree] = useState<boolean>(false);

  const currentChapter = chapters.find((c) => c.id === selectedChapterId) || chapters[0];

  // 3. Bulk MCQ Markdown State
  const defaultSampleMd = `# ExamSathi Nepal — Standard MCQ Format

### Question 1: What is the primary role of adding Gypsum to cement clinker during grinding?
- A) To accelerate early strength development
- B) To retard initial setting time and prevent flash set
- C) To enhance resistance to sulfate attack
- D) To reduce the total heat of hydration
Answer: B
Explanation: Gypsum is added (2% to 3%) during clinker grinding to retard rapid C3A hydration, preventing flash setting.
Difficulty: MEDIUM
Marks: 1.0
Negative: 0.2

---

### Question 2: Which Bogue compound produces the greatest early strength within the first 7 days?
- A) Dicalcium Silicate (C2S)
- B) Tricalcium Silicate (C3S)
- C) Tricalcium Aluminate (C3A)
- D) Tetracalcium Aluminoferrite (C4AF)
Answer: B
Explanation: Tricalcium Silicate (C3S) hydrates rapidly and contributes early compressive strength.
Difficulty: EASY
Marks: 1.0
Negative: 0.2

---

### Question 3: Under Nepal Standard NS 40, what is the minimum initial setting time for OPC?
- A) 15 minutes
- B) 30 minutes
- C) 45 minutes
- D) 60 minutes
Answer: B
Explanation: As per NS 40, the initial setting time for Ordinary Portland Cement must not be less than 30 minutes.
Difficulty: EASY
Marks: 1.0
Negative: 0.2`;

  const [mcqMarkdown, setMcqMarkdown] = useState<string>(defaultSampleMd);
  const [mcqChapterId, setMcqChapterId] = useState<string>('chap-1');
  const [isImporting, setIsImporting] = useState<boolean>(false);

  // Client-side parser for live validation
  const parseClientPreview = (text: string) => {
    const blocks = text
      .split(/(?:\r?\n)(?:###|##|---|___|\*\*\*)\s*/g)
      .filter((b) => b.trim().length > 0);
    return blocks.map((block, idx) => {
      const lines = block
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
      let qText = '';
      const options: { label: string; text: string }[] = [];
      let answer = '';
      let explanation = '';
      let difficulty = 'MEDIUM';

      for (const line of lines) {
        const optMatch = line.match(/^[-*]?\s*(?:\(?([A-Da-d])\)|\b([A-Da-d])[\.)])\s+(.+)$/);
        const ansMatch = line.match(
          /^\*{0,2}(?:Answer|Correct|Ans)\*{0,2}\s*:\s*\*{0,2}\(?([A-Da-d])\)?/i,
        );
        const expMatch = line.match(/^\*{0,2}(?:Explanation|Rationale)\*{0,2}\s*:\s*(.+)$/i);
        const diffMatch = line.match(/^\*{0,2}(?:Difficulty)\*{0,2}\s*:\s*(EASY|MEDIUM|HARD)/i);

        if (ansMatch) answer = ansMatch[1]?.toUpperCase() || '';
        else if (expMatch) explanation = expMatch[1] || '';
        else if (diffMatch) difficulty = diffMatch[1]?.toUpperCase() || 'MEDIUM';
        else if (optMatch) {
          options.push({
            label: (optMatch[1] || optMatch[2] || '').toUpperCase(),
            text: optMatch[3] || '',
          });
        } else if (options.length === 0) {
          qText +=
            (qText ? ' ' : '') + line.replace(/^(?:Question\s*\d+|Q\d+|\d+)\s*[:.-]\s*/i, '');
        }
      }

      const isValid = qText.length > 0 && options.length === 4 && Boolean(answer);
      return { id: idx + 1, qText, options, answer, explanation, difficulty, isValid };
    });
  };

  const parsedPreview = parseClientPreview(mcqMarkdown);
  const validQuestionsCount = parsedPreview.filter((q) => q.isValid).length;

  // 4. Payment & Course Verification State
  const [orderFilter, setOrderFilter] = useState<'ALL' | 'PENDING' | 'PAID'>('PENDING');
  const [orders, setOrders] = useState([
    {
      id: 'ORD_172881_991',
      studentName: 'Suman Nepal',
      studentEmail: 'suman.nepal@ioe.edu.np',
      phone: '9841234567',
      planName: '3 Month Complete Preparation Pass',
      amount: 'NPR 2,499',
      gateway: 'ESEWA',
      txnId: 'ESEWA_TXN_881920',
      status: 'PENDING',
      date: 'Today, 11:20 AM',
      voucherNotes: 'eSewa Mobile Wallet transfer. Ref: 881920',
    },
    {
      id: 'ORD_172881_842',
      studentName: 'Aayush Adhikari',
      studentEmail: 'aayush.adhikari@gmail.com',
      phone: '9851098765',
      planName: '1 Month Sprint Pass',
      amount: 'NPR 999',
      gateway: 'KHALTI',
      txnId: 'KHALTI_KP_99120',
      status: 'PENDING',
      date: 'Today, 09:45 AM',
      voucherNotes: 'Khalti EPAY transaction verified by gateway webhook.',
    },
    {
      id: 'ORD_172881_633',
      studentName: 'Pooja Bhattarai',
      studentEmail: 'pooja.bhattarai@pulchowk.edu.np',
      phone: '9861122334',
      planName: '1 Year Career All-Access Pass',
      amount: 'NPR 5,999',
      gateway: 'BANK_TRANSFER',
      txnId: 'NABIL_VOUCHER_5441',
      status: 'PENDING',
      date: 'Today, 08:30 AM',
      voucherNotes: 'Nabil Bank counter slip deposit: Voucher #5441 uploaded.',
    },
    {
      id: 'ORD_172881_510',
      studentName: 'Bikash Shrestha',
      studentEmail: 'bikash@gmail.com',
      phone: '9811223344',
      planName: '3 Month Complete Preparation Pass',
      amount: 'NPR 2,499',
      gateway: 'ESEWA',
      txnId: 'ESEWA_TXN_774102',
      status: 'PAID',
      date: 'Yesterday, 04:20 PM',
      voucherNotes: 'Verified and active access granted.',
    },
  ]);

  // 5. User Directory State (Student Users vs Admin/Staff Users)
  const [userCategory, setUserCategory] = useState<'ALL' | 'STUDENT' | 'STAFF'>('STUDENT');
  const [userSearch, setUserSearch] = useState<string>('');
  const [usersList, setUsersList] = useState([
    {
      id: 'usr-1',
      name: 'Prashant Adhikari',
      email: 'admin@examsathi.com.np',
      phone: '9851000001',
      role: 'ADMIN',
      category: 'STAFF',
      isActive: true,
      subscription: 'SuperAdmin Master Access',
      joinedDate: 'Oct 01, 2026',
    },
    {
      id: 'usr-2',
      name: 'Er. Rajesh K. Thapa',
      email: 'rajesh.thapa@examsathi.com.np',
      phone: '9851000002',
      role: 'INSTRUCTOR',
      category: 'STAFF',
      isActive: true,
      subscription: 'Instructor Reviewer Access',
      joinedDate: 'Oct 03, 2026',
    },
    {
      id: 'usr-3',
      name: 'Suman Nepal',
      email: 'suman.nepal@ioe.edu.np',
      phone: '9841234567',
      role: 'STUDENT',
      category: 'STUDENT',
      isActive: true,
      subscription: '3 Month Pass (Pending Verification)',
      joinedDate: 'Today',
    },
    {
      id: 'usr-4',
      name: 'Anjali Sharma',
      email: 'anjali.sharma@gmail.com',
      phone: '9841998877',
      role: 'STUDENT',
      category: 'STUDENT',
      isActive: true,
      subscription: 'NEC Licensure Active Pass',
      joinedDate: 'Oct 10, 2026',
    },
    {
      id: 'usr-5',
      name: 'Kiran Gurung',
      email: 'kiran.gurung@gmail.com',
      phone: '9801122334',
      role: 'STUDENT',
      category: 'STUDENT',
      isActive: false,
      subscription: 'None (Expired)',
      joinedDate: 'Sep 24, 2026',
    },
  ]);

  // --- Handlers ---

  // Handle saving notes
  const handleSaveNotes = () => {
    setChapters((prev) =>
      prev.map((c) =>
        c.id === selectedChapterId ? { ...c, notesContent: editingNotes || c.notesContent } : c,
      ),
    );
    showNotification('Chapter study notes updated successfully.');
  };

  // Handle adding sub-chapter PDF
  const handleAddSubChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubChapterTitle.trim()) {
      showNotification('Sub-chapter title is required', 'error');
      return;
    }

    const newRes = {
      id: `res-${Date.now()}`,
      title: newSubChapterTitle.trim(),
      fileUrl: newSubChapterUrl.trim() || 'https://example.com/handouts/sample.pdf',
      fileSizeBytes: '2.5 MB',
      isFreePreview: newSubChapterFree,
      displayOrder: (currentChapter?.subChapters.length || 0) + 1,
    };

    setChapters((prev) =>
      prev.map((c) =>
        c.id === selectedChapterId ? { ...c, subChapters: [...c.subChapters, newRes] } : c,
      ),
    );

    setNewSubChapterTitle('');
    setNewSubChapterUrl('');
    setNewSubChapterFree(false);
    showNotification(`Sub-Chapter "${newRes.title}" created successfully!`);
  };

  // Handle deleting sub-chapter PDF
  const handleDeleteSubChapter = (resId: string) => {
    setChapters((prev) =>
      prev.map((c) =>
        c.id === selectedChapterId
          ? { ...c, subChapters: c.subChapters.filter((r) => r.id !== resId) }
          : c,
      ),
    );
    showNotification('Sub-chapter PDF removed.', 'info');
  };

  // Handle MCQ Markdown ingestion
  const handleImportMcqMarkdown = () => {
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
      showNotification(
        `Successfully imported ${validQuestionsCount} questions into ${currentChapter?.title}!`,
        'success',
      );
    }, 800);
  };

  // Handle verifying student payment
  const handleVerifyPayment = (orderId: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'PAID' } : o)));
    // Also update student user subscription in user list
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setUsersList((prev) =>
        prev.map((u) =>
          u.email === order.studentEmail
            ? { ...u, subscription: `${order.planName} (Verified & Active)` }
            : u,
        ),
      );
    }
    showNotification(
      `Order #${orderId} verified! Active course access granted to student immediately.`,
      'success',
    );
  };

  // Handle rejecting payment
  const handleRejectPayment = (orderId: string) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: 'FAILED' } : o)));
    showNotification(`Order #${orderId} has been rejected.`, 'info');
  };

  // Handle user active toggle
  const handleToggleUserStatus = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u)),
    );
    showNotification('User status updated.');
  };

  // Filtered orders & users
  const filteredOrders = orders.filter((o) =>
    orderFilter === 'ALL' ? true : o.status === orderFilter,
  );

  const filteredUsers = usersList.filter((u) => {
    const matchesCategory = userCategory === 'ALL' ? true : u.category === userCategory;
    const matchesSearch =
      userSearch.trim() === ''
        ? true
        : u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
          u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
          u.phone.includes(userSearch);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between shadow-lg transition-all animate-in fade-in slide-in-from-top-2 ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : notification.type === 'error'
                ? 'bg-rose-50 text-rose-900 border-rose-200'
                : 'bg-blue-50 text-blue-900 border-blue-200'
          }`}
        >
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : notification.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            ) : (
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
            )}
            <p className="text-sm font-semibold">{notification.message}</p>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-brand-navy rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="badge-purple bg-brand-indigo text-brand-gold border-brand-purple/40">
              ExamSathi Admin Studio
            </span>
            <span className="text-xs text-brand-purple-light font-mono">v1.2 Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
            Central Administrative Control Panel
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Manage multi-tier curriculum notes, create multi-PDF sub-chapters with student PDF
            viewer, ingest bulk MCQs from markdown, verify student course payments, and govern
            users.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 shrink-0">
          <a
            href="/sample-mcqs.md"
            download="sample-mcqs.md"
            className="btn-brand-outline border-white/20 text-white hover:bg-white/10 text-xs py-2 px-3 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-brand-gold" />
            Sample MCQ .md Template
          </a>
          <Link
            href="/chapters/chap-1"
            className="btn-brand-gold text-xs py-2 px-3 flex items-center gap-1.5 font-bold"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview Student View
          </Link>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-brand-indigo/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'overview', label: 'Operational Metrics', icon: TrendingUp },
          { id: 'content', label: 'Chapter Notes & Sub-Chapters (PDFs)', icon: Layers },
          { id: 'mcq-studio', label: 'Bulk MCQ Markdown Studio', icon: FileCode },
          {
            id: 'payments',
            label: `Verify Payments (${orders.filter((o) => o.status === 'PENDING').length})`,
            icon: CreditCard,
            badge: orders.filter((o) => o.status === 'PENDING').length,
          },
          { id: 'users', label: 'Student vs Admin Users', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all ${
                isActive
                  ? 'bg-brand-navy text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-brand-gold' : 'text-slate-400'}`} />
              {tab.label}
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-amber-400 text-brand-navy' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OVERVIEW & PLATFORM METRICS */}
      {/* ========================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-indigo/10 flex items-center justify-center text-brand-indigo">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Student Candidates
                </p>
                <h3 className="text-2xl font-extrabold text-brand-navy">
                  {metrics.totalStudents.toLocaleString()}
                </h3>
                <span className="text-[11px] text-emerald-600 font-medium">+12 enrolled today</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Pending Course Approvals
                </p>
                <h3 className="text-2xl font-extrabold text-amber-600">
                  {orders.filter((o) => o.status === 'PENDING').length}
                </h3>
                <button
                  onClick={() => setActiveTab('payments')}
                  className="text-[11px] text-brand-indigo font-bold hover:underline"
                >
                  Verify Access →
                </button>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total Question Bank
                </p>
                <h3 className="text-2xl font-extrabold text-brand-navy">
                  {metrics.totalQuestions.toLocaleString()}
                </h3>
                <span className="text-[11px] text-slate-500">Across 48 Chapters</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total Subscriptions
                </p>
                <h3 className="text-2xl font-extrabold text-brand-navy">
                  {metrics.totalRevenueNpr}
                </h3>
                <span className="text-[11px] text-emerald-600 font-semibold">
                  {metrics.conversionRate} Conversion Rate
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 flex items-center justify-center text-brand-indigo">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-brand-navy">
                Chapter Notes & Multi-PDF Sub-Chapters
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add rich study notes to any chapter or attach multiple PDF documents (lecture
                slides, formula sheets, solved problems).
              </p>
              <button
                onClick={() => setActiveTab('content')}
                className="btn-brand-primary text-xs py-2 px-4 w-full"
              >
                Manage Content & PDFs
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                <FileCode className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-brand-navy">Bulk MCQ Markdown Studio</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Paste or import markdown files containing 4-option MCQs and correct answers with
                real-time parser validation.
              </p>
              <button
                onClick={() => setActiveTab('mcq-studio')}
                className="btn-brand-gold text-xs py-2 px-4 w-full font-bold"
              >
                Open MCQ Studio
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-brand-navy">Payment Verification & Access</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review student payment receipts and grant course access with one click to activate
                subscriptions.
              </p>
              <button
                onClick={() => setActiveTab('payments')}
                className="btn-brand-outline text-xs py-2 px-4 w-full"
              >
                Verify {orders.filter((o) => o.status === 'PENDING').length} Pending Orders
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: CHAPTER NOTES & MULTI-PDF SUB-CHAPTERS */}
      {/* ========================================================= */}
      {activeTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chapter Selector Sidebar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 lg:col-span-1">
            <h3 className="font-bold text-brand-navy text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-indigo" />
              Select Chapter
            </h3>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {chapters.map((chap) => (
                <button
                  key={chap.id}
                  onClick={() => {
                    setSelectedChapterId(chap.id);
                    setEditingNotes(chap.notesContent);
                  }}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                    chap.id === selectedChapterId
                      ? 'bg-brand-indigo/10 border-brand-indigo text-brand-navy font-bold shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-brand-purple font-semibold mb-1">
                    <span>{chap.category}</span>
                    <span>{chap.subChapters.length} PDFs</span>
                  </div>
                  <p className="line-clamp-2 leading-relaxed">{chap.title}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Chapter Content & Sub-Chapter Management */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 lg:col-span-2">
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="badge-purple mb-1">{currentChapter?.category}</span>
                <h2 className="text-lg font-bold text-brand-navy">{currentChapter?.title}</h2>
                <p className="text-xs text-slate-500">{currentChapter?.subject}</p>
              </div>
              <Link
                href={`/chapters/${currentChapter?.id}`}
                target="_blank"
                className="btn-brand-outline text-xs py-1.5 px-3 flex items-center gap-1.5 shrink-0"
              >
                <Eye className="w-3.5 h-3.5" />
                View as Student
              </Link>
            </div>

            {/* Sub-Chapters (Multi-PDF) Section */}
            <div className="space-y-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-brand-navy flex items-center gap-2">
                    <Layers className="w-4 h-4 text-brand-purple" />
                    Sub-Chapters & PDF Documents ({currentChapter?.subChapters.length})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Students will see an embedded PDF viewer and tab switcher for these documents.
                  </p>
                </div>
              </div>

              {/* Existing Sub-Chapters List */}
              <div className="space-y-2">
                {currentChapter?.subChapters.map((res, index) => (
                  <div
                    key={res.id}
                    className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded bg-brand-navy text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-brand-navy truncate">{res.title}</p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {res.fileSizeBytes} • {res.fileUrl}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {res.isFreePreview ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Free Preview
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          Premium
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteSubChapter(res.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete Sub-Chapter"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Sub-Chapter Form */}
              <form
                onSubmit={handleAddSubChapter}
                className="space-y-3 pt-3 border-t border-slate-200"
              >
                <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                  + Add New Sub-Chapter / PDF Document
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Sub-Chapter Title (e.g., Part 3: Vicat Lab Procedure)"
                    value={newSubChapterTitle}
                    onChange={(e) => setNewSubChapterTitle(e.target.value)}
                    className="p-2.5 rounded-lg border border-slate-200 text-xs w-full focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                  />
                  <input
                    type="text"
                    placeholder="PDF Document URL (e.g. /samples/spec.pdf or S3 URL)"
                    value={newSubChapterUrl}
                    onChange={(e) => setNewSubChapterUrl(e.target.value)}
                    className="p-2.5 rounded-lg border border-slate-200 text-xs w-full focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newSubChapterFree}
                      onChange={(e) => setNewSubChapterFree(e.target.checked)}
                      className="rounded border-slate-300 text-brand-indigo"
                    />
                    Mark as Free Preview (Available to unsubscribed candidates)
                  </label>
                  <button
                    type="submit"
                    className="btn-brand-primary text-xs py-2 px-4 flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Sub-Chapter
                  </button>
                </div>
              </form>
            </div>

            {/* Chapter Study Notes Editor */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-brand-navy flex items-center gap-2">
                    <FileText className="w-4 h-4 text-brand-indigo" />
                    Chapter Study Notes (Markdown)
                  </h3>
                  <p className="text-xs text-slate-500">
                    High-yield theory, formulas, and concepts displayed in the reading view.
                  </p>
                </div>
                <button
                  onClick={handleSaveNotes}
                  className="btn-brand-gold text-xs py-2 px-4 font-bold flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Notes
                </button>
              </div>

              <textarea
                rows={8}
                value={editingNotes || currentChapter?.notesContent}
                onChange={(e) => setEditingNotes(e.target.value)}
                className="w-full p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-indigo"
                placeholder="Write rich markdown notes here..."
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: BULK MCQ MARKDOWN STUDIO */}
      {/* ========================================================= */}
      {activeTab === 'mcq-studio' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="badge-purple mb-1">Question Bank Authoring</span>
                <h2 className="text-xl font-bold text-brand-navy">
                  Bulk MCQ Markdown Ingestion Studio
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Upload multiple-choice questions in standard markdown format. Each question must
                  have 4 options and a correct answer.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setMcqMarkdown(defaultSampleMd)}
                  className="btn-brand-outline text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <FileCode className="w-3.5 h-3.5 text-brand-indigo" />
                  Load Sample Template
                </button>
                <a
                  href="/sample-mcqs.md"
                  download="sample-mcqs.md"
                  className="btn-brand-primary text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-brand-gold" />
                  Download .md File
                </a>
              </div>
            </div>

            {/* Target Chapter Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <label className="text-xs font-bold text-brand-navy whitespace-nowrap">
                Target Chapter for Questions:
              </label>
              <select
                value={mcqChapterId}
                onChange={(e) => setMcqChapterId(e.target.value)}
                className="p-2 rounded-lg border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-indigo flex-1"
              >
                {chapters.map((chap) => (
                  <option key={chap.id} value={chap.id}>
                    {chap.category} • {chap.subject} — {chap.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Editor & Live Preview Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Markdown Editor */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-brand-indigo" />
                    Markdown Source
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {mcqMarkdown.length} characters
                  </span>
                </div>
                <textarea
                  rows={18}
                  value={mcqMarkdown}
                  onChange={(e) => setMcqMarkdown(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-indigo bg-slate-900 text-slate-100"
                  placeholder="Paste your questions in markdown format..."
                />
              </div>

              {/* Right: Live Parser Validation & Preview */}
              <div className="space-y-3 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-brand-purple" />
                    Live Parser Validation
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      validQuestionsCount > 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {validQuestionsCount} Questions Detected
                  </span>
                </div>

                <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 p-4 overflow-y-auto max-h-[480px] space-y-3">
                  {parsedPreview.map((q) => (
                    <div
                      key={q.id}
                      className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                        q.isValid
                          ? 'bg-white border-slate-200 shadow-xs'
                          : 'bg-rose-50/50 border-rose-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-brand-navy">Question #{q.id}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded">
                            {q.difficulty}
                          </span>
                          {q.isValid ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded flex items-center gap-1">
                              <Check className="w-3 h-3" /> Valid
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Incomplete
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="font-medium text-slate-800">{q.qText}</p>

                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        {q.options.map((opt) => (
                          <div
                            key={opt.label}
                            className={`p-1.5 rounded text-[11px] border ${
                              opt.label === q.answer
                                ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900'
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <span className="font-bold mr-1">{opt.label})</span>
                            {opt.text}
                          </div>
                        ))}
                      </div>

                      {q.explanation && (
                        <p className="text-[11px] text-slate-500 italic pt-1">
                          Rationale: {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Import Submission Bar */}
                <div className="pt-3 flex items-center justify-between border-t border-slate-200">
                  <span className="text-xs text-slate-500">
                    Will be added to:{' '}
                    <strong>
                      {chapters.find((c) => c.id === mcqChapterId)?.title.slice(0, 30)}...
                    </strong>
                  </span>
                  <button
                    onClick={handleImportMcqMarkdown}
                    disabled={validQuestionsCount === 0 || isImporting}
                    className="btn-brand-primary text-xs py-2.5 px-6 font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    {isImporting
                      ? 'Ingesting Questions...'
                      : `Import ${validQuestionsCount} Questions`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: PAYMENT VERIFICATION & COURSE ACCESS APPROVAL */}
      {/* ========================================================= */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="badge-purple mb-1">Financial & Access Governance</span>
                <h2 className="text-xl font-bold text-brand-navy">
                  Student Payment Verification & Course Access
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Candidates who initiate payments or submit transfer receipts require
                  administrative approval to unlock full mock exams and premium notes.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                {(['PENDING', 'PAID', 'ALL'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setOrderFilter(filter)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                      orderFilter === filter
                        ? 'bg-white text-brand-navy shadow-xs'
                        : 'text-slate-600 hover:text-brand-navy'
                    }`}
                  >
                    {filter === 'PENDING'
                      ? `Pending Approval (${orders.filter((o) => o.status === 'PENDING').length})`
                      : filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-3 px-3">Student Candidate</th>
                    <th className="py-3 px-3">Preparation Pass</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Gateway / Txn ID</th>
                    <th className="py-3 px-3">Verification Details</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Administrative Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-3">
                        <div className="font-bold text-brand-navy">{order.studentName}</div>
                        <div className="text-[11px] text-slate-500">{order.studentEmail}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{order.phone}</div>
                      </td>

                      <td className="py-4 px-3">
                        <span className="font-medium text-slate-800">{order.planName}</span>
                        <div className="text-[10px] text-slate-400">{order.id}</div>
                      </td>

                      <td className="py-4 px-3 font-bold text-brand-navy">{order.amount}</td>

                      <td className="py-4 px-3">
                        <span className="badge-purple font-mono text-[10px] mb-1 inline-block">
                          {order.gateway}
                        </span>
                        <div className="text-[11px] font-mono text-slate-500">{order.txnId}</div>
                      </td>

                      <td className="py-4 px-3 max-w-xs text-slate-600 text-[11px]">
                        <p>{order.voucherNotes}</p>
                        <span className="text-[10px] text-slate-400">{order.date}</span>
                      </td>

                      <td className="py-4 px-3">
                        {order.status === 'PENDING' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1 w-max">
                            <Clock className="w-3 h-3" /> Awaiting Verification
                          </span>
                        ) : order.status === 'PAID' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-3 h-3" /> Verified & Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 w-max">
                            Declined
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-3 text-right">
                        {order.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleVerifyPayment(order.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Verify & Grant Access
                            </button>
                            <button
                              onClick={() => handleRejectPayment(order.id)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Reject Order"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">
                            Access Granted
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: STUDENT USERS VS ADMIN USERS */}
      {/* ========================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="badge-purple mb-1">Access Control & Role Directory</span>
                <h2 className="text-xl font-bold text-brand-navy">
                  User Management: Students vs Administration
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Manage student test-takers and platform staff (administrators, instructors,
                  content authors).
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                {(['STUDENT', 'STAFF', 'ALL'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setUserCategory(cat)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                      userCategory === cat
                        ? 'bg-white text-brand-navy shadow-xs'
                        : 'text-slate-600 hover:text-brand-navy'
                    }`}
                  >
                    {cat === 'STUDENT'
                      ? 'Student Users'
                      : cat === 'STAFF'
                        ? 'Admin & Staff'
                        : 'All Users'}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search candidates or staff by full name, email, or mobile..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="bg-transparent text-xs w-full text-slate-800 focus:outline-none"
              />
              {userSearch && (
                <button
                  onClick={() => setUserSearch('')}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Users Directory Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-3 px-3">User Profile</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Active Subscription / Course</th>
                    <th className="py-3 px-3">Account Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-3">
                        <div className="font-bold text-brand-navy">{user.name}</div>
                        <div className="text-[11px] text-slate-500">{user.email}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{user.phone}</div>
                      </td>

                      <td className="py-4 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-900 border border-purple-200'
                              : user.role === 'INSTRUCTOR'
                                ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                : 'bg-slate-100 text-slate-800 border border-slate-200'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="py-4 px-3 font-medium text-slate-600">
                        {user.category === 'STAFF' ? 'Administrative Staff' : 'Student Candidate'}
                      </td>

                      <td className="py-4 px-3">
                        <span className="font-medium text-brand-navy text-[11px]">
                          {user.subscription}
                        </span>
                        <div className="text-[10px] text-slate-400">Joined: {user.joinedDate}</div>
                      </td>

                      <td className="py-4 px-3">
                        {user.isActive ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                            Suspended
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-3 text-right">
                        <button
                          onClick={() => handleToggleUserStatus(user.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            user.isActive
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                        >
                          {user.isActive ? 'Suspend' : 'Reactivate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
