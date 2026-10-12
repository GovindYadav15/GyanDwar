'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Users,
  CreditCard,
  TrendingUp,
  Search,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  BookOpen,
  Layers,
  Upload,
  Download,
  AlertCircle,
  Trash2,
  Check,
  X,
  Sparkles,
  FileCode,
  GraduationCap,
  Copy,
  ExternalLink,
  Shield,
  Key,
  Mail,
  UserCheck,
  LogOut,
  Lock,
  FileText,
  ChevronRight,
  ChevronDown,
  Edit2,
  FileUp,
  File,
  FolderPlus,
  Loader2,
} from 'lucide-react';
import { api } from '@/lib/api-client';

type AdminTab =
  | 'overview'
  | 'courses'
  | 'students'
  | 'payments'
  | 'invitations'
  | 'content'
  | 'mcq-studio';

function parseClientPreview(text: string) {
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
      if (/^Question\s*\d*[:.-]?/i.test(line)) {
        qText = line.replace(/^Question\s*\d*[:.-]?\s*/i, '');
      } else if (/^[-*•]?\s*([A-D])[\).:-]\s*(.*)$/i.test(line)) {
        const match = line.match(/^[-*•]?\s*([A-D])[\).:-]\s*(.*)$/i);
        if (match) options.push({ label: match[1].toUpperCase(), text: match[2].trim() });
      } else if (/^Answer[:.-]?\s*([A-D])/i.test(line)) {
        const match = line.match(/^Answer[:.-]?\s*([A-D])/i);
        if (match) answer = match[1].toUpperCase();
      } else if (/^Explanation[:.-]?\s*(.*)$/i.test(line)) {
        const match = line.match(/^Explanation[:.-]?\s*(.*)$/i);
        if (match) explanation = match[1].trim();
      } else if (!qText && !line.startsWith('#')) {
        qText = line;
      }
    }
    const isValid = qText.length > 0 && options.length === 4 && Boolean(answer);
    return { id: idx + 1, qText, options, answer, explanation, difficulty, isValid };
  });
}

export default function AdminConsolePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = api.getToken();
      if (!token) {
        router.push('/login?redirect=/admin');
        return;
      }
      const user = api.getUser();
      if (user && (user.roles?.includes('ADMIN') || user.roles?.includes('SUPER_ADMIN'))) {
        setAdminUser(user);
        setIsAuthorized(true);
        setIsCheckingAuth(false);
        return;
      }
      try {
        const profile = await api.get<any>('/auth/me');
        if (profile && (profile.roles?.includes('ADMIN') || profile.roles?.includes('SUPER_ADMIN'))) {
          api.setUser(profile);
          setAdminUser(profile);
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch {
        setIsAuthorized(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    api.logout();
    router.push('/login');
  };

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
  // Dynamic Courses & Chapter Management State & Operations
  // -------------------------------------------------------------
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [courseFilter, setCourseFilter] = useState<string>('ALL');
  const [courseSearch, setCourseSearch] = useState<string>('');

  // Course Modal
  const [showCourseModal, setShowCourseModal] = useState<boolean>(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    priceNpr: 1999,
    originalPriceNpr: 2999,
    categoryCode: 'NEC',
    faculty: 'Civil Engineering',
    duration: '120+ Study Hours',
    badge: 'Popular Track',
    features: 'Full Syllabus Coverage\nChapter Formula PDFs\nMCQ Model Exams with Negative Marking\nInstant Score Analytics',
    isPublished: true,
  });

  // Chapter Modal
  const [showChapterModal, setShowChapterModal] = useState<boolean>(false);
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [chapterForm, setChapterForm] = useState({
    title: '',
    chapterNumber: 1,
    description: '',
    isFreePreview: false,
  });

  // Active Chapter for PDFs & MCQs
  const [activeChapterForEdit, setActiveChapterForEdit] = useState<any | null>(null);

  // PDF Form
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [pdfForm, setPdfForm] = useState({
    title: '',
    fileUrl: '',
    fileSizeBytes: '3.5 MB',
    isFreePreview: false,
  });

  // MCQ Studio for Chapter
  const [chapterMcqMarkdown, setChapterMcqMarkdown] = useState<string>('');
  const [isImportingMcqs, setIsImportingMcqs] = useState<boolean>(false);
  const [chapterSavedQuestions, setChapterSavedQuestions] = useState<any[]>([]);
  const [showSavedQuestions, setShowSavedQuestions] = useState<boolean>(false);

  const fetchCourses = async () => {
    try {
      setIsLoadingCourses(true);
      const data = await api.get<any[]>('/admin/courses');
      setCoursesList(data);
      if (selectedCourse) {
        const refreshed = data.find((c: any) => c.id === selectedCourse.id);
        if (refreshed) {
          const detail = await api.get<any>(`/admin/courses/${refreshed.id}`);
          setSelectedCourse(detail);
        }
      }
    } catch (err: any) {
      console.error('Failed to load courses', err);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenCreateCourse = () => {
    setEditingCourseId(null);
    setCourseForm({
      title: '',
      description: '',
      priceNpr: 1999,
      originalPriceNpr: 2999,
      categoryCode: 'NEC',
      faculty: 'Civil Engineering',
      duration: '120+ Study Hours',
      badge: 'High Demand',
      features: 'Full Syllabus Coverage\nChapter Formula PDFs & Notes\nObjective MCQ Model Exams\nPerformance Analytics',
      isPublished: true,
    });
    setShowCourseModal(true);
  };

  const handleOpenEditCourse = (course: any) => {
    setEditingCourseId(course.id);
    setCourseForm({
      title: course.title,
      description: course.description,
      priceNpr: course.priceNpr,
      originalPriceNpr: course.originalPriceNpr || course.priceNpr * 1.5,
      categoryCode: course.categoryCode || 'NEC',
      faculty: course.faculty || 'Civil Engineering',
      duration: course.duration || '100+ Study Hours',
      badge: course.badge || 'Popular',
      features: Array.isArray(course.features) ? course.features.join('\n') : '',
      isPublished: course.isPublished,
    });
    setShowCourseModal(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim()) {
      showNotification('Course title is required', 'error');
      return;
    }
    try {
      const payload = {
        title: courseForm.title,
        description: courseForm.description,
        priceNpr: Number(courseForm.priceNpr),
        originalPriceNpr: courseForm.originalPriceNpr ? Number(courseForm.originalPriceNpr) : undefined,
        categoryCode: courseForm.categoryCode,
        faculty: courseForm.faculty,
        duration: courseForm.duration,
        badge: courseForm.badge,
        features: courseForm.features.split('\n').map((s) => s.trim()).filter(Boolean),
        isPublished: courseForm.isPublished,
      };

      if (editingCourseId) {
        await api.patch(`/admin/courses/${editingCourseId}`, payload);
        showNotification('Course updated successfully!', 'success');
      } else {
        await api.post('/admin/courses', payload);
        showNotification('Course created successfully!', 'success');
      }
      setShowCourseModal(false);
      setEditingCourseId(null);
      await fetchCourses();
    } catch (err: any) {
      showNotification(err.message || 'Failed to save course', 'error');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course and all its curriculum chapters?')) return;
    try {
      await api.delete(`/admin/courses/${courseId}`);
      showNotification('Course deleted successfully', 'success');
      if (selectedCourse?.id === courseId) {
        setSelectedCourse(null);
      }
      await fetchCourses();
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete course', 'error');
    }
  };

  const handleSelectCourse = async (course: any) => {
    try {
      const detail = await api.get<any>(`/admin/courses/${course.id}`);
      setSelectedCourse(detail);
      setActiveChapterForEdit(null);
      setChapterSavedQuestions([]);
      setShowSavedQuestions(false);
    } catch {
      setSelectedCourse(course);
    }
  };

  const handleOpenCreateChapter = () => {
    if (!selectedCourse) return;
    const nextNum = (selectedCourse.chapters?.length || 0) + 1;
    setEditingChapterId(null);
    setChapterForm({
      title: '',
      chapterNumber: nextNum,
      description: '',
      isFreePreview: false,
    });
    setShowChapterModal(true);
  };

  const handleSaveChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !chapterForm.title.trim()) {
      showNotification('Chapter title is required', 'error');
      return;
    }
    try {
      const payload = {
        title: chapterForm.title,
        chapterNumber: Number(chapterForm.chapterNumber),
        description: chapterForm.description,
        isFreePreview: chapterForm.isFreePreview,
      };

      if (editingChapterId) {
        await api.patch(`/admin/chapters/${editingChapterId}`, payload);
        showNotification('Chapter updated successfully!', 'success');
      } else {
        await api.post(`/admin/courses/${selectedCourse.id}/chapters`, payload);
        showNotification('Chapter created successfully!', 'success');
      }
      setShowChapterModal(false);
      setEditingChapterId(null);
      const updatedCourse = await api.get<any>(`/admin/courses/${selectedCourse.id}`);
      setSelectedCourse(updatedCourse);
      await fetchCourses();
    } catch (err: any) {
      showNotification(err.message || 'Failed to save chapter', 'error');
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm('Are you sure you want to delete this chapter and all attached PDFs and MCQs?')) return;
    try {
      await api.delete(`/admin/chapters/${chapterId}`);
      showNotification('Chapter deleted successfully', 'success');
      if (activeChapterForEdit?.id === chapterId) {
        setActiveChapterForEdit(null);
      }
      const updatedCourse = await api.get<any>(`/admin/courses/${selectedCourse.id}`);
      setSelectedCourse(updatedCourse);
      await fetchCourses();
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete chapter', 'error');
    }
  };

  const handleOpenChapterMaterials = async (chap: any) => {
    setActiveChapterForEdit(chap);
    setChapterMcqMarkdown('');
    setShowSavedQuestions(false);
    try {
      const questions = await api.get<any[]>(`/admin/chapters/${chap.id}/questions`);
      setChapterSavedQuestions(questions);
    } catch {
      setChapterSavedQuestions([]);
    }
  };

  const handleAddPdfToChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChapterForEdit || !pdfForm.title.trim()) {
      showNotification('PDF title is required', 'error');
      return;
    }
    try {
      await api.post(`/admin/chapters/${activeChapterForEdit.id}/resources`, {
        chapterId: activeChapterForEdit.id,
        title: pdfForm.title,
        resourceType: 'PDF',
        fileUrl: pdfForm.fileUrl || `https://storage.examsathi.com/course-materials/${Date.now()}.pdf`,
        fileSizeBytes: 3100000,
        isFreePreview: pdfForm.isFreePreview,
      });
      showNotification('PDF attached to chapter successfully!', 'success');
      setShowPdfModal(false);
      setPdfForm({ title: '', fileUrl: '', fileSizeBytes: '3.5 MB', isFreePreview: false });
      const updatedCourse = await api.get<any>(`/admin/courses/${selectedCourse.id}`);
      setSelectedCourse(updatedCourse);
      const updatedChap = updatedCourse.chapters.find((c: any) => c.id === activeChapterForEdit.id);
      if (updatedChap) setActiveChapterForEdit(updatedChap);
      await fetchCourses();
    } catch (err: any) {
      showNotification(err.message || 'Failed to attach PDF', 'error');
    }
  };

  const handleDeletePdfFromChapter = async (resourceId: string) => {
    if (!confirm('Are you sure you want to delete this PDF resource?')) return;
    try {
      await api.delete(`/admin/resources/${resourceId}`);
      showNotification('PDF removed successfully', 'success');
      const updatedCourse = await api.get<any>(`/admin/courses/${selectedCourse.id}`);
      setSelectedCourse(updatedCourse);
      const updatedChap = updatedCourse.chapters.find((c: any) => c.id === activeChapterForEdit.id);
      if (updatedChap) setActiveChapterForEdit(updatedChap);
      await fetchCourses();
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete PDF', 'error');
    }
  };

  const handlePdfFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setPdfForm((prev) => ({
        ...prev,
        title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
        fileUrl: URL.createObjectURL(file),
        fileSizeBytes: `${sizeMb} MB`,
      }));
      showNotification(`Loaded PDF: ${file.name} (${sizeMb} MB)`);
    }
  };

  const handleMcqFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setChapterMcqMarkdown(text);
        showNotification(`Loaded ${file.name} successfully into MCQ Studio!`);
      };
      reader.readAsText(file);
    }
  };

  const handleImportMcqsToChapter = async () => {
    if (!activeChapterForEdit || !chapterMcqMarkdown.trim()) {
      showNotification('Please enter or upload markdown questions first', 'error');
      return;
    }
    setIsImportingMcqs(true);
    try {
      const res: any = await api.post(
        `/admin/chapters/${activeChapterForEdit.id}/mcqs/markdown`,
        { markdownContent: chapterMcqMarkdown },
      );
      showNotification(`Successfully ingested ${res.createdCount || 'all'} MCQs into this chapter!`, 'success');
      setChapterMcqMarkdown('');
      const questions = await api.get<any[]>(`/admin/chapters/${activeChapterForEdit.id}/questions`);
      setChapterSavedQuestions(questions);
      const updatedCourse = await api.get<any>(`/admin/courses/${selectedCourse.id}`);
      setSelectedCourse(updatedCourse);
      const updatedChap = updatedCourse.chapters.find((c: any) => c.id === activeChapterForEdit.id);
      if (updatedChap) setActiveChapterForEdit(updatedChap);
      await fetchCourses();
    } catch (err: any) {
      showNotification(err.message || 'Failed to import MCQs', 'error');
    } finally {
      setIsImportingMcqs(false);
    }
  };

  const handleDeleteQuestionFromChapter = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.delete(`/admin/questions/${questionId}`);
      showNotification('Question deleted successfully');
      const questions = await api.get<any[]>(`/admin/chapters/${activeChapterForEdit.id}/questions`);
      setChapterSavedQuestions(questions);
      const updatedCourse = await api.get<any>(`/admin/courses/${selectedCourse.id}`);
      setSelectedCourse(updatedCourse);
      const updatedChap = updatedCourse.chapters.find((c: any) => c.id === activeChapterForEdit.id);
      if (updatedChap) setActiveChapterForEdit(updatedChap);
      await fetchCourses();
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete question', 'error');
    }
  };

  const loadSampleChapterMcqs = () => {
    const sample = `### Question 1:
What is the minimum initial setting time for Ordinary Portland Cement (OPC) as per standard specifications?
- A) 15 minutes
- B) 30 minutes
- C) 45 minutes
- D) 60 minutes
Answer: B
Explanation: As per standard IS/NS codes, initial setting time for OPC must not be less than 30 minutes to allow adequate placement time.
Difficulty: EASY
Marks: 1.0
Negative: 0.2

### Question 2:
Which compound in cement is primarily responsible for the ultimate long-term compressive strength developed after 28 days?
- A) Tricalcium Silicate (C3S)
- B) Dicalcium Silicate (C2S)
- C) Tricalcium Aluminate (C3A)
- D) Tetracalcium Aluminoferrite (C4AF)
Answer: B
Explanation: Dicalcium Silicate hydrates slowly and contributes steadily to strength development after the first 28 days.
Difficulty: MEDIUM
Marks: 1.0
Negative: 0.2`;
    setChapterMcqMarkdown(sample);
    showNotification('Sample MCQ markdown loaded!');
  };

  const chapterParsedPreview = parseClientPreview(chapterMcqMarkdown);
  const chapterValidQuestionsCount = chapterParsedPreview.filter((q) => q.isValid).length;


  // -------------------------------------------------------------
  // 1. Overview Metrics
  // -------------------------------------------------------------
  const metrics = {
    totalStudents: 1420,
    totalStaff: 12,
    totalQuestions: 2840,
    totalChapters: 48,
    pendingVerifications: 3,
    totalRevenueNpr: 'NPR 1,248,500',
    conversionRate: '28.4%',
  };

  // -------------------------------------------------------------
  // 2. Content & Chapter Sub-Chapter State (Multi-PDF)
  // -------------------------------------------------------------
  const [selectedChapterId, setSelectedChapterId] = useState<string>('chap-1');
  const [chapters, setChapters] = useState([
    {
      id: 'chap-1',
      title: 'Cement Manufacture, Bogue Compounds & Testing Standards',
      chapterNumber: 1,
      subject: 'Building Materials & Construction (CIVIL-01)',
      category: 'NEC Licensure',
      notesContent: `### Cement Chemistry & Testing
- **Raw Materials**: Calcareous (Lime/CaO 60-67%), Argillaceous (Silica/SiO2 17-25%, Alumina/Al2O3 3-8%, Iron Oxide 0.5-6%).
- **Bogue Compounds**:
  1. *C3S (Tricalcium Silicate)*: 45-65% — Early strength (first 7 days), rapid hydration.
  2. *C2S (Dicalcium Silicate)*: 15-35% — Ultimate long-term strength (after 28 days).
  3. *C3A (Tricalcium Aluminate)*: 4-14% — Fastest hydration, flash set (retarded by Gypsum 2-3%).
  4. *C4AF (Tetracalcium Aluminoferrite)*: 10-18% — Poor cementing value, gray color.
- **Vicat Needle Test (IS 4031 / NS 40)**:
  - Consistency test: 10mm plunger sinks 5-7mm from bottom of mould.
  - Initial Setting Time: 1mm needle sinks 5mm from bottom (Minimum 30 mins).
  - Final Setting Time: 5mm annular attachment needle makes impression (Maximum 600 mins).`,
      subChapters: [
        {
          id: 'res-1',
          title: 'Sub-Chapter 1.1: Cement Hydration Stages & Bogue Heat Evolution [PDF]',
          fileUrl: 'https://example.com/slides/cement-hydration.pdf',
          fileSizeBytes: '2.4 MB',
          isFreePreview: true,
          displayOrder: 1,
        },
        {
          id: 'res-2',
          title: 'Sub-Chapter 1.2: Laboratory Vicat Apparatus & Le-Chatelier Soundness Tests [PDF]',
          fileUrl: 'https://example.com/slides/vicat-soundness-tests.pdf',
          fileSizeBytes: '4.8 MB',
          isFreePreview: false,
          displayOrder: 2,
        },
      ],
    },
    {
      id: 'chap-2',
      title: 'Concrete Aggregates, Gradation Curves & Bulking',
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
  ]);

  const [editingNotes, setEditingNotes] = useState<string>('');
  const [newSubChapterTitle, setNewSubChapterTitle] = useState<string>('');
  const [newSubChapterUrl, setNewSubChapterUrl] = useState<string>('');
  const [newSubChapterFree, setNewSubChapterFree] = useState<boolean>(false);
  const currentChapter = chapters.find((c) => c.id === selectedChapterId) || chapters[0];

  // -------------------------------------------------------------
  // 3. Bulk MCQ Markdown State
  // -------------------------------------------------------------
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
Negative: 0.2`;

  const [mcqMarkdown, setMcqMarkdown] = useState<string>(defaultSampleMd);
  const [mcqChapterId, setMcqChapterId] = useState<string>('chap-1');
  const [isImporting, setIsImporting] = useState<boolean>(false);

  const parsedPreview = parseClientPreview(mcqMarkdown);
  const validQuestionsCount = parsedPreview.filter((q) => q.isValid).length;

  // -------------------------------------------------------------
  // 4. Payment Verification & eSewa Transfer Receipts State
  // -------------------------------------------------------------
  const [orderFilter, setOrderFilter] = useState<'ALL' | 'PENDING' | 'PAID'>('PENDING');
  const [orders, setOrders] = useState([
    {
      id: 'ORD_ES_7721_991',
      studentName: 'Suman Nepal',
      studentEmail: 'suman.nepal@ioe.edu.np',
      phone: '9841234567',
      courses: [
        'Nepal Engineering Council (NEC) - Civil License Complete Track',
        'Lok Sewa Aayog: Civil Engineer (7th Level) Complete Preparation',
      ],
      amount: 'NPR 4,498',
      gateway: 'ESEWA (Direct Transfer)',
      targetEsewaId: '9824803556',
      txnId: 'TXN-ESEWA-881920',
      status: 'PENDING',
      date: 'Today, 11:20 AM',
      receiptImageUrl:
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      voucherNotes: 'Paid NPR 4498 via eSewa to 9824803556. Screenshot uploaded for 2 courses.',
    },
    {
      id: 'ORD_ES_7721_842',
      studentName: 'Aayush Adhikari',
      studentEmail: 'aayush.adhikari@gmail.com',
      phone: '9851098765',
      courses: ['Nepal Engineering Council (NEC) - Civil License Complete Track'],
      amount: 'NPR 1,999',
      gateway: 'ESEWA (Direct Transfer)',
      targetEsewaId: '9824803556',
      txnId: 'TXN-ESEWA-99120',
      status: 'PENDING',
      date: 'Today, 09:45 AM',
      receiptImageUrl:
        'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80',
      voucherNotes: 'eSewa mobile transfer. Remarks: NEC Civil Prep Aayush',
    },
    {
      id: 'ORD_ES_7721_510',
      studentName: 'Bikash Shrestha',
      studentEmail: 'bikash@gmail.com',
      phone: '9811223344',
      courses: ['Lok Sewa Aayog: Civil Engineer (7th Level) Complete Preparation'],
      amount: 'NPR 2,499',
      gateway: 'ESEWA (Direct Transfer)',
      targetEsewaId: '9824803556',
      txnId: 'TXN-ESEWA-774102',
      status: 'PAID',
      date: 'Yesterday, 04:20 PM',
      receiptImageUrl:
        'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      voucherNotes: 'Verified and active course access granted by admin.',
    },
  ]);

  // Modal for Viewing Screenshot Full-size
  const [activeScreenshotModal, setActiveScreenshotModal] = useState<{
    imageUrl: string;
    studentName: string;
    orderId: string;
    amount: string;
    txnId: string;
    courses: string[];
  } | null>(null);

  // -------------------------------------------------------------
  // 5. Students Roster & Multi-Course Access State
  // -------------------------------------------------------------
  const [studentSearch, setStudentSearch] = useState('');
  const [studentsList, setStudentsList] = useState([
    {
      id: 'stu-1',
      name: 'Suman Nepal',
      email: 'suman.nepal@ioe.edu.np',
      phone: '9841234567',
      enrolledCourses: [
        {
          title: 'Nepal Engineering Council (NEC) - Civil License Complete Track',
          status: 'PENDING_VERIFICATION',
        },
        {
          title: 'Lok Sewa Aayog: Civil Engineer (7th Level) Complete Preparation',
          status: 'PENDING_VERIFICATION',
        },
      ],
      isActive: true,
      hasPendingVerification: true,
      joinedDate: 'Oct 12, 2026',
    },
    {
      id: 'stu-2',
      name: 'Aayush Adhikari',
      email: 'aayush.adhikari@gmail.com',
      phone: '9851098765',
      enrolledCourses: [
        {
          title: 'Nepal Engineering Council (NEC) - Civil License Complete Track',
          status: 'PENDING_VERIFICATION',
        },
      ],
      isActive: true,
      hasPendingVerification: true,
      joinedDate: 'Oct 11, 2026',
    },
    {
      id: 'stu-3',
      name: 'Anjali Sharma',
      email: 'anjali.sharma@gmail.com',
      phone: '9841998877',
      enrolledCourses: [
        {
          title: 'Nepal Engineering Council (NEC) - Civil License Complete Track',
          status: 'ACTIVE',
        },
        {
          title: 'Diploma Engineering Licensing Examination (Civil)',
          status: 'ACTIVE',
        },
      ],
      isActive: true,
      hasPendingVerification: false,
      joinedDate: 'Oct 09, 2026',
    },
    {
      id: 'stu-4',
      name: 'Bikash Shrestha',
      email: 'bikash@gmail.com',
      phone: '9811223344',
      enrolledCourses: [
        {
          title: 'Lok Sewa Aayog: Civil Engineer (7th Level) Complete Preparation',
          status: 'ACTIVE',
        },
      ],
      isActive: true,
      hasPendingVerification: false,
      joinedDate: 'Oct 08, 2026',
    },
  ]);

  // -------------------------------------------------------------
  // 6. Administrator Invitations State
  // -------------------------------------------------------------
  const [inviteEmailInput, setInviteEmailInput] = useState('');
  const [generatedInviteLink, setGeneratedInviteLink] = useState<string | null>(null);
  const [invitationsList, setInvitationsList] = useState([
    {
      id: 'inv-1',
      email: 'sanjay.thapa@examsathi.com.np',
      status: 'PENDING',
      invitedBy: 'Prashant Adhikari',
      expiresAt: 'Oct 19, 2026',
      token: 'd8a9f0e1c2b3a4567890123456789abcdef0123456789abcdef0123456789abc',
    },
    {
      id: 'inv-2',
      email: 'kavita.sharma@examsathi.com.np',
      status: 'ACCEPTED',
      invitedBy: 'Initial Administrator',
      expiresAt: 'Oct 15, 2026',
      token: 'b3a4567890123456789abcdef0123456789abcdef0123456789abcd8a9f0e1c2',
    },
  ]);

  // -------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------

  // Verify order payment and unlock courses
  const handleVerifyOrderPayment = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'PAID' } : o)),
    );

    if (order) {
      setStudentsList((prev) =>
        prev.map((s) => {
          if (s.email === order.studentEmail) {
            return {
              ...s,
              hasPendingVerification: false,
              enrolledCourses: s.enrolledCourses.map((c) => ({
                ...c,
                status: 'ACTIVE',
              })),
            };
          }
          return s;
        }),
      );
    }

    if (activeScreenshotModal?.orderId === orderId) {
      setActiveScreenshotModal(null);
    }

    showNotification(
      `Order #${orderId} verified! Access to respective courses granted to ${order?.studentName}.`,
      'success',
    );
  };

  const handleRejectOrderPayment = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'FAILED' } : o)),
    );
    if (activeScreenshotModal?.orderId === orderId) {
      setActiveScreenshotModal(null);
    }
    showNotification(`Order #${orderId} rejected.`, 'info');
  };

  // Directly verify student courses
  const handleVerifyStudentDirect = (studentId: string) => {
    const student = studentsList.find((s) => s.id === studentId);
    setStudentsList((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              hasPendingVerification: false,
              enrolledCourses: s.enrolledCourses.map((c) => ({
                ...c,
                status: 'ACTIVE',
              })),
            }
          : s,
      ),
    );
    showNotification(
      `Student ${student?.name} verified! All pending courses unlocked.`,
      'success',
    );
  };

  // Create Admin Invitation
  const handleCreateInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmailInput || !inviteEmailInput.includes('@')) {
      alert('Please provide a valid email address');
      return;
    }

    const mockToken = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16),
    ).join('');
    const newInv = {
      id: `inv-${Date.now()}`,
      email: inviteEmailInput.toLowerCase().trim(),
      status: 'PENDING',
      invitedBy: 'Initial Administrator',
      expiresAt: '7 Days from now',
      token: mockToken,
    };

    setInvitationsList([newInv, ...invitationsList]);
    setGeneratedInviteLink(
      `http://localhost:3000/admin/invitations/accept?token=${mockToken}`,
    );
    setInviteEmailInput('');
    showNotification(`Administrator invitation generated for ${newInv.email}!`);
  };

  const handleRevokeInvitation = (invId: string) => {
    setInvitationsList((prev) =>
      prev.map((inv) => (inv.id === invId ? { ...inv, status: 'REVOKED' } : inv)),
    );
    showNotification('Invitation revoked.', 'info');
  };

  // Filtered Students & Orders
  const filteredStudents = studentsList.filter(
    (s) =>
      studentSearch === '' ||
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.phone.includes(studentSearch),
  );

  const filteredOrders = orders.filter((o) =>
    orderFilter === 'ALL' ? true : o.status === orderFilter,
  );

  if (isCheckingAuth) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-indigo border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Verifying administrator authorization...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-rose-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <Shield className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold font-display text-brand-navy">Administrator Access Required</h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              This administrative control panel is strictly restricted to verified system administrators. Your currently signed-in account does not possess administrator privileges.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/dashboard"
              className="w-full py-2.5 px-4 rounded-xl bg-brand-navy hover:bg-brand-navy-dark text-white text-xs font-bold transition-all shadow-md"
            >
              Return to Student Dashboard
            </Link>
            <Link
              href="/login"
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all"
            >
              Sign In with Admin Credentials
            </Link>
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <p className="text-xs sm:text-sm font-semibold">{notification.message}</p>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 text-sm p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-brand-navy rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="badge-purple bg-brand-indigo text-brand-gold border-brand-purple/40">
              ExamSathi Admin Studio
            </span>
            <span className="text-xs text-brand-purple-light font-mono">v2.0 Governance</span>
            <span className="text-xs text-emerald-400 font-mono bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
              Verified Administrator
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display">
            Central Administrative Control Panel
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Verify student eSewa payments (ID: 9824803556), manage multi-course access, invite
            co-administrators, and curate curriculum notes & MCQ question pools.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 shrink-0">
          <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-mono text-brand-gold">
            👤 {adminUser?.email || 'govind803556@gmail.com'}
          </div>
          <button
            onClick={handleLogout}
            className="btn-brand-outline border-rose-400/40 text-rose-300 hover:bg-rose-500/20 hover:text-white text-xs py-2 px-3 flex items-center gap-1.5 font-bold transition-all"
            title="Log out of administrator account"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
          <Link
            href="/courses/buy"
            className="btn-brand-outline border-white/20 text-white hover:bg-white/10 text-xs py-2 px-3 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
            View Course Purchase Page
          </Link>
          <Link
            href="/chapters/chap-1"
            className="btn-brand-gold text-xs py-2 px-3 flex items-center gap-1.5 font-bold"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview Student View
          </Link>
        </div>

        <div className="absolute right-0 bottom-0 w-96 h-96 bg-brand-indigo/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'overview', label: 'Operational Metrics', icon: TrendingUp },
          {
            id: 'courses',
            label: `Courses & Chapters Studio (${coursesList.length})`,
            icon: BookOpen,
            badge: coursesList.length,
          },
          {
            id: 'students',
            label: `Students & Courses (${studentsList.filter((s) => s.hasPendingVerification).length} pending)`,
            icon: Users,
            badge: studentsList.filter((s) => s.hasPendingVerification).length,
          },
          {
            id: 'payments',
            label: `Verify Payments (${orders.filter((o) => o.status === 'PENDING').length})`,
            icon: CreditCard,
            badge: orders.filter((o) => o.status === 'PENDING').length,
          },
          { id: 'invitations', label: 'Admin Invitations', icon: Key },
          { id: 'content', label: 'Notes & Multi-PDF Sub-Chapters', icon: Layers },
          { id: 'mcq-studio', label: 'MCQ Markdown Studio', icon: FileCode },
        ].map((tab) => {

          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
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
                  Registered Students
                </p>
                <h3 className="text-2xl font-extrabold text-brand-navy">
                  {metrics.totalStudents.toLocaleString()}
                </h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Pending Verifications
                </p>
                <h3 className="text-2xl font-extrabold text-amber-600">
                  {orders.filter((o) => o.status === 'PENDING').length}
                </h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Target eSewa ID
                </p>
                <h3 className="text-lg font-mono font-extrabold text-emerald-700">
                  9824803556
                </h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-brand-purple">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  System Roles
                </p>
                <h3 className="text-xl font-extrabold text-brand-navy">
                  STUDENT & ADMIN
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: DYNAMIC COURSES & CURRICULUM CHAPTERS STUDIO */}
      {/* ========================================================= */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          {/* View 1: Course List (when selectedCourse is null) */}
          {!selectedCourse ? (
            <div className="space-y-6">
              {/* Header Hero Banner */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-2 z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-indigo/10 text-brand-indigo text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                    Curriculum & Course Management
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display">
                    Preparation Courses Studio
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    Create exam preparation courses, set pricing, organize chapter curriculum, attach
                    PDF formula sheets, and ingest chapter-specific MCQ pools via Markdown (.md).
                  </p>
                </div>

                <div className="z-10 shrink-0 flex items-center gap-3">
                  <button
                    onClick={handleOpenCreateCourse}
                    className="btn-brand-primary py-3 px-5 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Create New Course
                  </button>
                </div>

                <div className="absolute right-0 bottom-0 w-80 h-80 bg-brand-indigo/5 rounded-full blur-3xl pointer-events-none" />
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
                  {['ALL', 'NEC', 'LOK_SEWA', 'DIPLOMA', 'GENERAL'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCourseFilter(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        courseFilter === cat
                          ? 'bg-brand-navy text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {cat === 'ALL' ? `All Tracks (${coursesList.length})` : cat}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    placeholder="Search courses..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-indigo/30"
                  />
                </div>
              </div>

              {/* Courses Grid / Loading / Empty State */}
              {isLoadingCourses ? (
                <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-indigo" />
                  <p className="text-xs font-semibold text-slate-600">Loading courses from database...</p>
                </div>
              ) : coursesList.filter((c) => {
                  const matchesCat = courseFilter === 'ALL' || c.categoryCode === courseFilter;
                  const matchesSearch =
                    !courseSearch ||
                    c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
                    (c.description && c.description.toLowerCase().includes(courseSearch.toLowerCase()));
                  return matchesCat && matchesSearch;
                }).length === 0 ? (
                <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 rounded-2xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center mx-auto">
                    <BookOpen className="w-8 h-8 text-brand-gold" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-brand-navy">No Courses Found</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      {coursesList.length === 0
                        ? 'You haven’t created any courses yet. Click the button below to add your first course with title, description, and pricing.'
                        : 'No courses match your selected category filter or search query.'}
                    </p>
                  </div>
                  {coursesList.length === 0 && (
                    <button
                      onClick={handleOpenCreateCourse}
                      className="btn-brand-primary text-xs py-2.5 px-5 font-bold inline-flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Create First Course
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coursesList
                    .filter((c) => {
                      const matchesCat = courseFilter === 'ALL' || c.categoryCode === courseFilter;
                      const matchesSearch =
                        !courseSearch ||
                        c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
                        (c.description && c.description.toLowerCase().includes(courseSearch.toLowerCase()));
                      return matchesCat && matchesSearch;
                    })
                    .map((course) => {
                      const totalPdfs = course.chapters?.reduce(
                        (sum: number, ch: any) => sum + (ch.pdfCount || 0),
                        0,
                      ) || 0;
                      const totalQuestions = course.chapters?.reduce(
                        (sum: number, ch: any) => sum + (ch.questionCount || 0),
                        0,
                      ) || 0;

                      return (
                        <div
                          key={course.id}
                          className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-brand-indigo/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                        >
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand-indigo/10 text-brand-indigo">
                                  {course.categoryCode || 'GENERAL'}
                                </span>
                                {course.faculty && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                    {course.faculty}
                                  </span>
                                )}
                                {course.badge && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                                    {course.badge}
                                  </span>
                                )}
                              </div>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  course.isPublished
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {course.isPublished ? 'Published' : 'Draft'}
                              </span>
                            </div>

                            <h3 className="text-base font-bold text-brand-navy leading-snug line-clamp-2">
                              {course.title}
                            </h3>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                              {course.description}
                            </p>

                            {/* Features preview */}
                            {course.features && course.features.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {course.features.slice(0, 3).map((feat: string, i: number) => (
                                  <span
                                    key={i}
                                    className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md"
                                  >
                                    ✓ {feat}
                                  </span>
                                ))}
                                {course.features.length > 3 && (
                                  <span className="text-[10px] text-slate-400 self-center">
                                    +{course.features.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Pricing bar */}
                            <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                              <span className="text-xs text-slate-500 font-medium">Enrollment Price:</span>
                              <div className="flex items-baseline gap-2">
                                {course.originalPriceNpr && course.originalPriceNpr > course.priceNpr && (
                                  <span className="text-xs text-slate-400 line-through">
                                    NPR {course.originalPriceNpr.toLocaleString()}
                                  </span>
                                )}
                                <span className="text-lg font-black text-brand-navy">
                                  NPR {course.priceNpr.toLocaleString()}
                                </span>
                              </div>
                            </div>

                            {/* Course Metrics */}
                            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center text-xs">
                              <div>
                                <span className="text-[10px] text-slate-400 block font-bold uppercase">Chapters</span>
                                <span className="font-extrabold text-brand-navy">{course.chapterCount || 0}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 block font-bold uppercase">PDF Notes</span>
                                <span className="font-extrabold text-brand-indigo">{totalPdfs}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 block font-bold uppercase">MCQs</span>
                                <span className="font-extrabold text-emerald-700">{totalQuestions}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                              onClick={() => handleSelectCourse(course)}
                              className="btn-brand-primary text-xs py-2 px-3 font-bold flex-1 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Layers className="w-3.5 h-3.5 text-brand-gold" />
                              Chapters & Materials ({course.chapterCount || 0})
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleOpenEditCourse(course)}
                              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                              title="Edit Course"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteCourse(course.id)}
                              className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors"
                              title="Delete Course"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          ) : (
            /* View 2: Course Chapters & Curriculum Materials Detail */
            <div className="space-y-6">
              {/* Back navigation & Course banner */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  ← Back to All Courses
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditCourse(selectedCourse)}
                    className="btn-brand-outline text-xs py-1.5 px-3 font-bold flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Course Info
                  </button>
                  <button
                    onClick={handleOpenCreateChapter}
                    className="btn-brand-primary text-xs py-1.5 px-3.5 font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add Chapter
                  </button>
                </div>
              </div>

              {/* Course Detail Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand-indigo/10 text-brand-indigo">
                        {selectedCourse.categoryCode || 'GENERAL'}
                      </span>
                      {selectedCourse.faculty && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {selectedCourse.faculty}
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-slate-400">
                        • {selectedCourse.duration || 'Flexible Hours'}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-brand-navy">
                      {selectedCourse.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {selectedCourse.description}
                    </p>
                  </div>

                  <div className="text-right sm:shrink-0 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Course Price</span>
                    <span className="text-2xl font-black text-brand-navy">
                      NPR {selectedCourse.priceNpr.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Chapters List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h3 className="text-lg font-bold text-brand-navy flex items-center gap-2">
                    <Layers className="w-5 h-5 text-brand-indigo" />
                    Curriculum Chapters ({selectedCourse.chapters?.length || 0})
                  </h3>
                  <button
                    onClick={handleOpenCreateChapter}
                    className="text-xs font-bold text-brand-indigo hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Chapter
                  </button>
                </div>

                {(!selectedCourse.chapters || selectedCourse.chapters.length === 0) ? (
                  <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-brand-navy">No Chapters Created Yet</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Add the first chapter to this course to begin uploading study PDFs and multiple-choice questions (.md).
                      </p>
                    </div>
                    <button
                      onClick={handleOpenCreateChapter}
                      className="btn-brand-primary text-xs py-2 px-4 font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add Chapter 1
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedCourse.chapters.map((chap: any) => {
                      const isExpanded = activeChapterForEdit?.id === chap.id;
                      const pdfs = chap.resources?.filter((r: any) => r.resourceType === 'PDF') || [];

                      return (
                        <div
                          key={chap.id}
                          className={`bg-white rounded-3xl border transition-all overflow-hidden ${
                            isExpanded ? 'border-brand-indigo shadow-md ring-1 ring-brand-indigo/30' : 'border-slate-200 shadow-sm'
                          }`}
                        >
                          {/* Chapter Card Header */}
                          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand-navy text-white">
                                  Chapter {chap.chapterNumber}
                                </span>
                                {chap.isFreePreview && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                    Free Preview Available
                                  </span>
                                )}
                                <span className="text-xs text-slate-500 font-medium">
                                  • {pdfs.length} PDF{pdfs.length !== 1 ? 's' : ''} • {chap.questionCount || 0} Questions
                                </span>
                              </div>
                              <h4 className="text-base font-bold text-brand-navy">{chap.title}</h4>
                              {chap.description && (
                                <p className="text-xs text-slate-500 leading-relaxed">{chap.description}</p>
                              )}
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                              <button
                                onClick={() => {
                                  if (isExpanded) {
                                    setActiveChapterForEdit(null);
                                  } else {
                                    handleOpenChapterMaterials(chap);
                                  }
                                }}
                                className={`text-xs py-2 px-3.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                  isExpanded
                                    ? 'bg-brand-navy text-white'
                                    : 'btn-brand-primary'
                                }`}
                              >
                                <FileText className="w-3.5 h-3.5" />
                                {isExpanded ? 'Hide Materials & MCQs' : 'Manage PDFs & MCQs'}
                                {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                              </button>

                              <button
                                onClick={() => handleDeleteChapter(chap.id)}
                                className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Delete Chapter"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Expanded Interactive Management Container */}
                          {isExpanded && (
                            <div className="p-6 border-t border-slate-200 space-y-8 bg-white">
                              {/* SUB-SECTION 1: PDF STUDY MATERIALS */}
                              <div className="space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                  <div>
                                    <h5 className="text-sm font-bold text-brand-navy flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-brand-indigo" />
                                      Chapter PDF Documents & Resources ({pdfs.length})
                                    </h5>
                                    <p className="text-[11px] text-slate-500">
                                      Attach downloadable lesson PDFs, formula cheatsheets, and lecture notes for this chapter.
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => setShowPdfModal(true)}
                                    className="btn-brand-gold text-xs py-1.5 px-3 font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    Attach PDF File
                                  </button>
                                </div>

                                {pdfs.length === 0 ? (
                                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                                    <p className="text-xs text-slate-500 font-medium">No PDF documents attached to this chapter yet.</p>
                                    <button
                                      onClick={() => setShowPdfModal(true)}
                                      className="text-xs font-bold text-brand-indigo hover:underline cursor-pointer"
                                    >
                                      + Attach a PDF document
                                    </button>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {pdfs.map((pdf: any) => (
                                      <div
                                        key={pdf.id}
                                        className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                                      >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                          <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                                            <FileText className="w-5 h-5" />
                                          </div>
                                          <div className="overflow-hidden">
                                            <h6 className="text-xs font-bold text-brand-navy truncate">{pdf.title}</h6>
                                            <span className="text-[10px] text-slate-400 font-mono">
                                              {pdf.fileSizeBytes ? `${(pdf.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB` : 'PDF'} •{' '}
                                              {pdf.isFreePreview ? 'Free Preview' : 'Enrolled Access'}
                                            </span>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 shrink-0">
                                          {pdf.fileUrl && (
                                            <a
                                              href={pdf.fileUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="p-1.5 text-brand-indigo hover:bg-brand-indigo/10 rounded-lg transition-colors"
                                              title="Open PDF"
                                            >
                                              <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                          )}
                                          <button
                                            onClick={() => handleDeletePdfFromChapter(pdf.id)}
                                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                            title="Delete PDF"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* SUB-SECTION 2: CHAPTER MCQ INGESTION STUDIO (.md) */}
                              <div className="space-y-4 pt-4 border-t border-slate-200">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h5 className="text-sm font-bold text-brand-navy flex items-center gap-2">
                                        <FileCode className="w-4 h-4 text-emerald-600" />
                                        Chapter MCQ Pool & Markdown (.md) Studio
                                      </h5>
                                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                        {chap.questionCount || 0} Saved MCQs
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500">
                                      Select a .md file or write questions with 4 options (- A, - B, - C, - D) and Answer keys.
                                    </p>
                                  </div>

                                  <div className="flex items-center gap-2 flex-wrap">
                                    {/* Upload .md File Button */}
                                    <label className="btn-brand-outline text-xs py-1.5 px-3 font-bold flex items-center gap-1.5 cursor-pointer">
                                      <FileUp className="w-3.5 h-3.5 text-brand-gold" />
                                      Upload .md File
                                      <input
                                        type="file"
                                        accept=".md,.txt,.markdown"
                                        onChange={handleMcqFileSelection}
                                        className="hidden"
                                      />
                                    </label>

                                    <button
                                      onClick={loadSampleChapterMcqs}
                                      className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-[11px] font-bold text-slate-600 transition-colors"
                                    >
                                      Load Sample Template
                                    </button>

                                    {chap.questionCount > 0 && (
                                      <button
                                        onClick={() => setShowSavedQuestions(!showSavedQuestions)}
                                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 transition-colors"
                                      >
                                        {showSavedQuestions ? 'Hide Saved Questions' : `View ${chap.questionCount} Questions`}
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Saved Questions Inspection Drawer */}
                                {showSavedQuestions && (
                                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 max-h-96 overflow-y-auto">
                                    <h6 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                                      Existing Saved Questions in Chapter ({chapterSavedQuestions.length})
                                    </h6>
                                    {chapterSavedQuestions.map((q: any, idx: number) => (
                                      <div
                                        key={q.id}
                                        className="p-3 bg-white rounded-xl border border-slate-200 text-xs space-y-2 relative"
                                      >
                                        <div className="flex items-start justify-between gap-2">
                                          <span className="font-bold text-brand-navy">
                                            Q{idx + 1}. {q.questionText}
                                          </span>
                                          <button
                                            onClick={() => handleDeleteQuestionFromChapter(q.id)}
                                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                                            title="Delete Question"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-1.5">
                                          {q.options?.map((opt: any) => (
                                            <div
                                              key={opt.id}
                                              className={`p-1.5 rounded text-[11px] ${
                                                opt.isCorrect
                                                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold'
                                                  : 'bg-slate-50 text-slate-600 border border-slate-200'
                                              }`}
                                            >
                                              {opt.optionLabel}) {opt.optionText}
                                            </div>
                                          ))}
                                        </div>
                                        {q.explanationText && (
                                          <p className="text-[10px] text-slate-500 italic">
                                            Rationale: {q.explanationText}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Two-Column Ingestion Editor & Real-time Parse Preview */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                  {/* Left: Markdown Text Area */}
                                  <div className="space-y-2">
                                    <label className="block text-xs font-bold text-slate-700">
                                      Markdown MCQ Content (.md)
                                    </label>
                                    <textarea
                                      rows={10}
                                      value={chapterMcqMarkdown}
                                      onChange={(e) => setChapterMcqMarkdown(e.target.value)}
                                      placeholder="Paste question pool or upload .md file above... Format:
### Question 1:
What is the unit of dynamic viscosity?
- A) Poise
- B) Stokes
- C) Pascal
- D) Newton
Answer: A
Explanation: Poise is the CGS unit of dynamic viscosity.
Difficulty: EASY"
                                      className="w-full text-xs font-mono p-3.5 rounded-2xl border border-slate-300 bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-indigo/30"
                                    />

                                    <button
                                      disabled={chapterValidQuestionsCount === 0 || isImportingMcqs}
                                      onClick={handleImportMcqsToChapter}
                                      className="btn-brand-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                                    >
                                      {isImportingMcqs ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Upload className="w-4 h-4" />
                                      )}
                                      Import {chapterValidQuestionsCount} Questions into Chapter
                                    </button>
                                  </div>

                                  {/* Right: Live Parsed Preview */}
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <label className="text-xs font-bold text-slate-700">
                                        Live Parse Validation Preview ({chapterParsedPreview.length} Detected)
                                      </label>
                                      <span className="text-xs font-extrabold text-emerald-600">
                                        {chapterValidQuestionsCount} Valid Questions
                                      </span>
                                    </div>

                                    <div className="h-[250px] overflow-y-auto p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                                      {chapterParsedPreview.length === 0 ? (
                                        <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
                                          Write questions or upload .md file to see live validation
                                        </div>
                                      ) : (
                                        chapterParsedPreview.map((q: any) => (
                                          <div
                                            key={q.id}
                                            className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                                              q.isValid
                                                ? 'bg-white border-slate-200'
                                                : 'bg-rose-50 border-rose-200'
                                            }`}
                                          >
                                            <div className="flex items-center justify-between font-bold">
                                              <span className="text-brand-navy">Question #{q.id}</span>
                                              <span
                                                className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                                  q.isValid
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : 'bg-rose-100 text-rose-800'
                                                }`}
                                              >
                                                {q.isValid ? '✓ Valid' : 'Incomplete (Needs 4 opts & Answer)'}
                                              </span>
                                            </div>
                                            <p className="font-semibold text-slate-800">{q.qText}</p>
                                            <div className="grid grid-cols-2 gap-1 pt-1">
                                              {q.options.map((opt: any) => (
                                                <div
                                                  key={opt.label}
                                                  className={`p-1 rounded text-[10px] ${
                                                    opt.label === q.answer
                                                      ? 'bg-emerald-100 font-bold text-emerald-900 border border-emerald-300'
                                                      : 'bg-white text-slate-600 border border-slate-200'
                                                  }`}
                                                >
                                                  {opt.label}) {opt.text}
                                                </div>
                                              ))}
                                            </div>
                                            {q.explanation && (
                                              <p className="text-[10px] text-slate-500 italic pt-0.5">
                                                Why: {q.explanation}
                                              </p>
                                            )}
                                          </div>
                                        ))
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: CREATE OR EDIT COURSE */}
      {/* ========================================================= */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-brand-navy/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="badge-purple text-[10px]">Curriculum Builder</span>
                <h3 className="text-xl font-extrabold text-brand-navy">
                  {editingCourseId ? 'Edit Course Details' : 'Create New Preparation Course'}
                </h3>
              </div>
              <button
                onClick={() => setShowCourseModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="e.g. Nepal Engineering Council (NEC) - Civil License Complete Track"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Exam Category *</label>
                  <select
                    value={courseForm.categoryCode}
                    onChange={(e) => setCourseForm({ ...courseForm, categoryCode: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 bg-white"
                  >
                    <option value="NEC">NEC (Nepal Engineering Council)</option>
                    <option value="LOK_SEWA">Lok Sewa Aayog (Technical)</option>
                    <option value="DIPLOMA">Diploma License (CTEVT)</option>
                    <option value="GENERAL">General Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Faculty / Branch</label>
                  <input
                    type="text"
                    value={courseForm.faculty}
                    onChange={(e) => setCourseForm({ ...courseForm, faculty: e.target.value })}
                    placeholder="e.g. Civil Engineering, Computer, Electrical"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Enrollment Price (NPR) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={courseForm.priceNpr}
                    onChange={(e) => setCourseForm({ ...courseForm, priceNpr: Number(e.target.value) })}
                    placeholder="1999"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Original Price (Strikethrough NPR)</label>
                  <input
                    type="number"
                    min={0}
                    value={courseForm.originalPriceNpr}
                    onChange={(e) => setCourseForm({ ...courseForm, originalPriceNpr: Number(e.target.value) })}
                    placeholder="2999"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration / Hours</label>
                  <input
                    type="text"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    placeholder="e.g. 120+ Study Hours"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo/30"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={courseForm.badge}
                    onChange={(e) => setCourseForm({ ...courseForm, badge: e.target.value })}
                    placeholder="e.g. High Demand, Best Seller, New Syllabus"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo/30"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Course Description *</label>
                <textarea
                  rows={3}
                  required
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Comprehensive coverage of complete licensing examination standards..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo/30"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Key Course Features (One per line)
                </label>
                <textarea
                  rows={3}
                  value={courseForm.features}
                  onChange={(e) => setCourseForm({ ...courseForm, features: e.target.value })}
                  placeholder="Full Syllabus Coverage&#10;Downloadable Chapter Formula PDFs&#10;Unlimited 100-Mark Model Mock Exams&#10;Instant Scoring Analysis"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo/30"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="coursePublished"
                  checked={courseForm.isPublished}
                  onChange={(e) => setCourseForm({ ...courseForm, isPublished: e.target.checked })}
                  className="rounded text-brand-indigo focus:ring-brand-indigo w-4 h-4 cursor-pointer"
                />
                <label htmlFor="coursePublished" className="font-bold text-slate-700 cursor-pointer">
                  Publish Course Immediately (Visible to candidates for purchase)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-brand-primary px-5 py-2.5 font-bold shadow-sm cursor-pointer"
                >
                  {editingCourseId ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: CREATE CHAPTER IN SPECIFIC COURSE */}
      {/* ========================================================= */}
      {showChapterModal && (
        <div className="fixed inset-0 z-50 bg-brand-navy/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="badge-purple text-[10px]">Curriculum Structure</span>
                <h3 className="text-lg font-extrabold text-brand-navy">
                  Add Chapter to {selectedCourse?.title}
                </h3>
              </div>
              <button
                onClick={() => setShowChapterModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveChapter} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Chapter Title *</label>
                <input
                  type="text"
                  required
                  value={chapterForm.title}
                  onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
                  placeholder="e.g. Fluid Mechanics & Hydrostatics"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo/30"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chapter Sequence Number *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={chapterForm.chapterNumber}
                  onChange={(e) => setChapterForm({ ...chapterForm, chapterNumber: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chapter Description / Syllabus Scope</label>
                <textarea
                  rows={3}
                  value={chapterForm.description}
                  onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })}
                  placeholder="Covers Pascal's law, manometer equations, hydrostatic thrust on submerged planes..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo/30"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chapterFreePreview"
                  checked={chapterForm.isFreePreview}
                  onChange={(e) => setChapterForm({ ...chapterForm, isFreePreview: e.target.checked })}
                  className="rounded text-brand-indigo focus:ring-brand-indigo w-4 h-4 cursor-pointer"
                />
                <label htmlFor="chapterFreePreview" className="font-bold text-slate-700 cursor-pointer">
                  Enable as Free Preview Chapter (Accessible without payment)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowChapterModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-brand-primary px-5 py-2.5 font-bold shadow-sm cursor-pointer"
                >
                  Create Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: ATTACH PDF DOCUMENT TO SPECIFIC CHAPTER */}
      {/* ========================================================= */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-brand-navy/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="badge-purple text-[10px]">Resource Attachment</span>
                <h3 className="text-lg font-extrabold text-brand-navy">
                  Attach PDF to {activeChapterForEdit?.title}
                </h3>
              </div>
              <button
                onClick={() => setShowPdfModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPdfToChapter} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select PDF File from Computer</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfFileSelection}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-brand-indigo/10 file:text-brand-indigo hover:file:bg-brand-indigo/20 cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Display Title *</label>
                <input
                  type="text"
                  required
                  value={pdfForm.title}
                  onChange={(e) => setPdfForm({ ...pdfForm, title: e.target.value })}
                  placeholder="e.g. Chapter 1 Formula Sheet & Derivations [PDF]"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo/30"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cloud / Storage URL (Optional if local file chosen)</label>
                <input
                  type="text"
                  value={pdfForm.fileUrl}
                  onChange={(e) => setPdfForm({ ...pdfForm, fileUrl: e.target.value })}
                  placeholder="https://storage.examsathi.com/materials/chap1.pdf"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo/30"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pdfFreePreview"
                  checked={pdfForm.isFreePreview}
                  onChange={(e) => setPdfForm({ ...pdfForm, isFreePreview: e.target.checked })}
                  className="rounded text-brand-indigo focus:ring-brand-indigo w-4 h-4 cursor-pointer"
                />
                <label htmlFor="pdfFreePreview" className="font-bold text-slate-700 cursor-pointer">
                  Allow Free Preview (Candidate can read before enrollment)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPdfModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-brand-primary px-5 py-2.5 font-bold shadow-sm cursor-pointer"
                >
                  Attach PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: STUDENTS ROSTER & COURSE ACCESS VERIFICATION */}
      {/* ========================================================= */}

      {activeTab === 'students' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="badge-purple mb-1">Roster & Access Governance</span>
              <h2 className="text-xl font-bold text-brand-navy">
                Student Candidates & Course Access
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                View all registered students. One student can possess access to multiple
                courses. Verify their pending enrollments below.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student name, email, phone..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 w-64"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3 px-3">Student Candidate</th>
                  <th className="py-3 px-3">Enrolled Courses</th>
                  <th className="py-3 px-3">Access Status</th>
                  <th className="py-3 px-3">Registered On</th>
                  <th className="py-3 px-3 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-3">
                      <div className="font-bold text-brand-navy text-sm">{student.name}</div>
                      <div className="text-slate-500 font-mono text-[11px]">{student.email}</div>
                      <div className="text-slate-400 font-mono text-[10px]">{student.phone}</div>
                    </td>

                    <td className="py-4 px-3 max-w-md">
                      <div className="flex flex-col gap-1.5">
                        {student.enrolledCourses.map((course, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-200/60"
                          >
                            <span className="font-medium text-slate-800 text-[11px] truncate">
                              {course.title}
                            </span>
                            {course.status === 'ACTIVE' ? (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 ml-auto shrink-0">
                                Active
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 ml-auto shrink-0">
                                Pending Verification
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-4 px-3">
                      {student.hasPendingVerification ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1 w-max">
                          <Clock className="w-3 h-3" /> Awaiting Verification
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3" /> Verified & Active
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-3 text-slate-500 font-medium">{student.joinedDate}</td>

                    <td className="py-4 px-3 text-right">
                      {student.hasPendingVerification ? (
                        <button
                          onClick={() => handleVerifyStudentDirect(student.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          Verify Student & Unlock
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
                          All Courses Active
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: PAYMENT VERIFICATION & SCREENSHOT INSPECTION */}
      {/* ========================================================= */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="badge-purple mb-1">Financial Receipt Audit</span>
                <h2 className="text-xl font-bold text-brand-navy">
                  eSewa Payment Screenshots & Course Orders
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Students pay to official eSewa ID: <strong className="font-mono">9824803556</strong> and
                  upload screenshots. Click any screenshot thumbnail to inspect and grant course access.
                </p>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                {(['PENDING', 'PAID', 'ALL'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setOrderFilter(filter)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
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
                    <th className="py-3 px-3">Courses Ordered</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Target eSewa ID</th>
                    <th className="py-3 px-3">Receipt Screenshot</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-3">
                        <div className="font-bold text-brand-navy text-sm">{order.studentName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{order.studentEmail}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{order.phone}</div>
                      </td>

                      <td className="py-4 px-3 max-w-xs">
                        <ul className="list-disc list-inside space-y-0.5 text-slate-800 text-[11px] font-medium">
                          {order.courses.map((c, i) => (
                            <li key={i} className="truncate" title={c}>
                              {c}
                            </li>
                          ))}
                        </ul>
                        <div className="text-[10px] text-slate-400 font-mono mt-1">{order.id}</div>
                      </td>

                      <td className="py-4 px-3 font-extrabold text-brand-navy text-sm">
                        {order.amount}
                      </td>

                      <td className="py-4 px-3">
                        <span className="font-mono font-bold text-emerald-800 text-xs px-2 py-0.5 bg-emerald-50 border border-emerald-200 rounded">
                          {order.targetEsewaId}
                        </span>
                        <div className="text-[10px] text-slate-500 font-mono mt-1">{order.txnId}</div>
                      </td>

                      <td className="py-4 px-3">
                        {order.receiptImageUrl ? (
                          <button
                            type="button"
                            onClick={() =>
                              setActiveScreenshotModal({
                                imageUrl: order.receiptImageUrl,
                                studentName: order.studentName,
                                orderId: order.id,
                                amount: order.amount,
                                txnId: order.txnId,
                                courses: order.courses,
                              })
                            }
                            className="group flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:border-brand-indigo bg-slate-50 hover:bg-white transition-all cursor-pointer"
                          >
                            <img
                              src={order.receiptImageUrl}
                              alt="eSewa Transfer Receipt"
                              className="w-12 h-12 object-cover rounded-lg border border-slate-200 shadow-xs group-hover:scale-105 transition-transform"
                            />
                            <div className="text-left">
                              <span className="text-[11px] font-bold text-brand-indigo group-hover:underline block">
                                Inspect Receipt
                              </span>
                              <span className="text-[10px] text-slate-400">Click to preview</span>
                            </div>
                          </button>
                        ) : (
                          <span className="text-slate-400 italic">No image</span>
                        )}
                      </td>

                      <td className="py-4 px-3">
                        {order.status === 'PENDING' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1 w-max">
                            <Clock className="w-3 h-3" /> Awaiting Verification
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-3 h-3" /> Verified & Active
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-3 text-right">
                        {order.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleVerifyOrderPayment(order.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Verify & Grant Access
                            </button>
                            <button
                              onClick={() => handleRejectOrderPayment(order.id)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
      {/* TAB 4: ADMINISTRATOR INVITATIONS & PROVISIONING */}
      {/* ========================================================= */}
      {activeTab === 'invitations' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="badge-purple mb-1">Administrative Access Provisioning</span>
              <h2 className="text-xl font-bold text-brand-navy">
                Invite New Administrator
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Generate single-use cryptographic invitation links to safely provision additional
                administrators. Public registration never grants admin privileges.
              </p>
            </div>

            {/* Invite Form */}
            <form onSubmit={handleCreateInvitation} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="email"
                  placeholder="Enter email address of new co-administrator..."
                  value={inviteEmailInput}
                  onChange={(e) => setInviteEmailInput(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo/30"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-brand-primary text-xs py-3 px-5 font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Generate Admin Invitation Link
              </button>
            </form>

            {/* Link Feedback Card */}
            {generatedInviteLink && (
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-2">
                <span className="text-[11px] font-bold text-brand-purple flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" />
                  Cryptographic Invitation Link Generated (Valid for 7 Days):
                </span>
                <div className="flex items-center gap-2 bg-white p-2.5 rounded-lg border border-purple-200">
                  <input
                    type="text"
                    readOnly
                    value={generatedInviteLink}
                    className="w-full text-xs font-mono text-slate-700 bg-transparent focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedInviteLink);
                      showNotification('Invitation link copied to clipboard!');
                    }}
                    className="px-3 py-1 bg-brand-indigo text-white rounded-md text-xs font-bold hover:bg-brand-indigo-light shrink-0"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            )}

            {/* Existing Invitations Table */}
            <div className="overflow-x-auto pt-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Sent Administrator Invitations
              </h3>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="py-2.5 px-3">Invitee Email</th>
                    <th className="py-2.5 px-3">Invited By</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Expires At</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invitationsList.map((inv) => (
                    <tr key={inv.id}>
                      <td className="py-3 px-3 font-bold text-brand-navy">{inv.email}</td>
                      <td className="py-3 px-3 text-slate-600">{inv.invitedBy}</td>
                      <td className="py-3 px-3">
                        {inv.status === 'PENDING' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                            Pending Accept
                          </span>
                        ) : inv.status === 'ACCEPTED' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Accepted & Active Admin
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                            Revoked
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-500">{inv.expiresAt}</td>
                      <td className="py-3 px-3 text-right">
                        {inv.status === 'PENDING' && (
                          <button
                            onClick={() => handleRevokeInvitation(inv.id)}
                            className="text-xs font-bold text-rose-600 hover:text-rose-800"
                          >
                            Revoke
                          </button>
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
      {/* TAB 5: CONTENT NOTES & MULTI-PDF SUB-CHAPTERS */}
      {/* ========================================================= */}
      {activeTab === 'content' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-brand-navy text-sm border-b border-slate-100 pb-2">
              Chapters Hierarchy
            </h3>
            <div className="space-y-2">
              {chapters.map((chap) => (
                <div
                  key={chap.id}
                  onClick={() => setSelectedChapterId(chap.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    chap.id === selectedChapterId
                      ? 'bg-brand-navy text-white border-brand-navy shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-bold opacity-75 block mb-0.5">
                    {chap.category} • {chap.subject}
                  </span>
                  <p className="font-bold line-clamp-1">{chap.title}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="badge-purple mb-1">Chapter Materials</span>
              <h3 className="text-lg font-bold text-brand-navy">{currentChapter.title}</h3>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-600 uppercase">
                Sub-Chapters & PDFs ({currentChapter.subChapters.length})
              </h4>
              <div className="space-y-2">
                {currentChapter.subChapters.map((sc) => (
                  <div
                    key={sc.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-brand-navy block">{sc.title}</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {sc.fileSizeBytes} • {sc.isFreePreview ? 'Free Preview' : 'Premium Locked'}
                      </span>
                    </div>
                    <a
                      href={sc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-indigo font-bold hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: BULK MCQ MARKDOWN INGESTION STUDIO */}
      {/* ========================================================= */}
      {activeTab === 'mcq-studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <span className="badge-purple mb-1">Markdown Question Bank Ingestion</span>
              <h3 className="text-lg font-bold text-brand-navy">Paste Markdown MCQ Pool</h3>
              <p className="text-xs text-slate-500">
                Format: 4 options (- A, - B, - C, - D), Answer: X, Explanation: ...
              </p>
            </div>

            <textarea
              value={mcqMarkdown}
              onChange={(e) => setMcqMarkdown(e.target.value)}
              rows={16}
              className="w-full text-xs font-mono p-4 rounded-xl border border-slate-200 bg-slate-900 text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-indigo/30"
            />

            <button
              disabled={validQuestionsCount === 0}
              onClick={() =>
                showNotification(`Successfully imported ${validQuestionsCount} MCQs into chapter!`)
              }
              className="btn-brand-primary text-xs py-3 w-full font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Import {validQuestionsCount} Valid Questions
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-brand-navy border-b border-slate-100 pb-2 flex items-center justify-between">
              <span>Live Question Preview ({parsedPreview.length} Parsed)</span>
              <span className="text-xs font-extrabold text-emerald-600">
                {validQuestionsCount} Valid
              </span>
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {parsedPreview.map((q) => (
                <div
                  key={q.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                    q.isValid ? 'bg-slate-50 border-slate-200' : 'bg-rose-50 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>Question #{q.id}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        q.isValid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {q.isValid ? 'Valid' : 'Incomplete'}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800">{q.qText}</p>
                  <div className="grid grid-cols-2 gap-1">
                    {q.options.map((opt) => (
                      <div
                        key={opt.label}
                        className={`p-1 rounded text-[11px] ${
                          opt.label === q.answer
                            ? 'bg-emerald-100 font-bold text-emerald-900 border border-emerald-300'
                            : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        {opt.label}) {opt.text}
                      </div>
                    ))}
                  </div>
                  {q.explanation && (
                    <p className="text-[10px] text-slate-500 italic">Why: {q.explanation}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SCREENSHOT INSPECTION MODAL */}
      {/* ========================================================= */}
      {activeScreenshotModal && (
        <div className="fixed inset-0 z-50 bg-brand-navy/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="badge-purple text-[10px]">Payment Proof Inspection</span>
                <h3 className="text-lg font-bold text-brand-navy">
                  eSewa Transfer Receipt for {activeScreenshotModal.studentName}
                </h3>
              </div>
              <button
                onClick={() => setActiveScreenshotModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Target Receiver
                </span>
                <span className="font-mono font-bold text-emerald-800">eSewa: 9824803556</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Amount Transferred
                </span>
                <span className="font-bold text-brand-navy text-sm">
                  {activeScreenshotModal.amount}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Transaction Code
                </span>
                <span className="font-mono text-slate-700">{activeScreenshotModal.txnId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Order ID
                </span>
                <span className="font-mono text-slate-700">{activeScreenshotModal.orderId}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-2 bg-slate-100 flex items-center justify-center max-h-80 overflow-hidden">
              <img
                src={activeScreenshotModal.imageUrl}
                alt="eSewa Payment Screenshot"
                className="max-h-72 w-auto object-contain rounded-xl shadow-md"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => handleRejectOrderPayment(activeScreenshotModal.orderId)}
                className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold"
              >
                Reject Order
              </button>
              <button
                onClick={() => handleVerifyOrderPayment(activeScreenshotModal.orderId)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" />
                Approve Payment & Grant Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
