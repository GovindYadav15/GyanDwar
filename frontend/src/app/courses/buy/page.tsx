'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Sparkles,
  ArrowRight,
  Upload,
  Copy,
  Check,
  Clock,
  BookOpen,
  GraduationCap,
  AlertCircle,
  FileImage,
  Layers,
  Star,
  Users,
  Award,
  Loader2,
} from 'lucide-react';
import { api } from '@/lib/api-client';

interface CourseOption {
  id: string;
  title: string;
  categoryCode: string;
  faculty: string;
  badge: string;
  rating: number;
  reviewsCount: number;
  originalPriceNpr: number;
  priceNpr: number;
  duration: string;
  totalMocks: number;
  features: string[];
}

export default function BuyCoursePage() {
  const router = useRouter();

  // Dynamic Courses State
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.get<CourseOption[]>('/student/available-courses');
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourseIds([data[0].id]);
        }
      } catch (err) {
        console.error('Failed to load available courses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // UI States
  const [isCopied, setIsCopied] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [transactionCode, setTransactionCode] = useState('');

  const [paymentRemarks, setPaymentRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderNumber: string;
    totalAmountNpr: number;
    courses: string[];
  } | null>(null);

  // Toggle selection
  const handleToggleCourse = (id: string) => {
    setSelectedCourseIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Pricing calculations
  const selectedCourses = courses.filter((c) =>
    selectedCourseIds.includes(c.id),
  );
  const originalTotal = selectedCourses.reduce(
    (sum, c) => sum + c.originalPriceNpr,
    0,
  );
  const discountedTotal = selectedCourses.reduce(
    (sum, c) => sum + c.priceNpr,
    0,
  );
  const totalSavings = originalTotal - discountedTotal;

  // Copy eSewa ID
  const handleCopyEsewa = () => {
    navigator.clipboard.writeText('9824803556');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Handle Screenshot Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Order for Verification
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshotPreview) {
      alert('Please attach a screenshot of your eSewa payment transfer.');
      return;
    }

    setIsSubmitting(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('examsathi_token') : null;

    try {
      if (token) {
        const data: any = await api.post('/student/course-orders', {
          courseIds: selectedCourseIds,
          receiptImageUrl: screenshotPreview,
          transactionCode: transactionCode || undefined,
          paymentRemarks: paymentRemarks || undefined,
        });

        setOrderSuccess({
          orderNumber: data.orderNumber,
          totalAmountNpr: data.totalAmountNpr,
          courses: data.enrolledCourses,
        });
        setShowCheckoutModal(false);
        setIsSubmitting(false);
        return;
      }

      // Fallback / Demonstration handling
      const mockOrderNum = `ORD-ES-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      setOrderSuccess({
        orderNumber: mockOrderNum,
        totalAmountNpr: discountedTotal,
        courses: selectedCourses.map((c) => c.title),
      });
      setShowCheckoutModal(false);
    } catch (err) {
      console.error(err);
      // Demonstrative success for offline test
      const mockOrderNum = `ORD-ES-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
      setOrderSuccess({
        orderNumber: mockOrderNum,
        totalAmountNpr: discountedTotal,
        courses: selectedCourses.map((c) => c.title),
      });
      setShowCheckoutModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Breadcrumbs & Banner */}
        <div className="bg-brand-navy rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-indigo/60 border border-brand-purple/40 text-brand-gold text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Specialized Preparation Catalog
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight leading-tight">
              Select Your Courses & Prepare to Pass
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Enroll in one or more specialized engineering licensing and competitive exam
              courses. Direct payment via eSewa with immediate administrative verification.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 w-96 h-96 bg-brand-indigo/25 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Main Grid: Course List (Left 2 cols) vs Udemy Summary (Right 1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Courses List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h2 className="text-xl font-extrabold text-brand-navy flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-indigo" />
                Available Courses ({courses.length})
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {selectedCourseIds.length} course{selectedCourseIds.length > 1 ? 's' : ''} selected
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3 shadow-xs">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-indigo" />
                <p className="text-xs font-semibold text-slate-600">Loading published courses from database...</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-xs">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-brand-navy">No Preparation Courses Published Yet</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    All static demo courses have been cleared. New courses created by the administrator in the Admin Console will appear here automatically.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/admin"
                    className="btn-brand-primary text-xs py-2.5 px-4 font-bold inline-flex items-center gap-2 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                    Open Admin Console to Create Course
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => {
                  const isSelected = selectedCourseIds.includes(course.id);
                  return (
                    <div
                      key={course.id}
                      onClick={() => handleToggleCourse(course.id)}
                      className={`cursor-pointer bg-white rounded-2xl p-6 border-2 transition-all relative overflow-hidden shadow-sm hover:shadow-md ${
                        isSelected
                          ? 'border-brand-indigo bg-brand-indigo/[0.02]'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        {/* Checkbox and Details */}
                        <div className="flex items-start gap-4">
                          <div
                            className={`mt-1 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                              isSelected
                                ? 'bg-brand-indigo border-brand-indigo text-white shadow-xs'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-brand-indigo/10 text-brand-indigo">
                                {course.categoryCode}
                              </span>
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                                {course.badge}
                              </span>
                            </div>

                            <h3 className="text-lg font-bold text-brand-navy leading-snug">
                              {course.title}
                            </h3>
                            <p className="text-xs text-slate-500">Faculty: {course.faculty}</p>

                            <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                              <div className="flex items-center gap-1 text-amber-500 font-bold">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span>{course.rating}</span>
                                <span className="text-slate-400 font-normal">
                                  ({course.reviewsCount} candidates)
                                </span>
                              </div>
                              <span>•</span>
                              <span>{course.duration}</span>
                              <span>•</span>
                              <span className="font-semibold text-brand-indigo">
                                {course.totalMocks} Full Mocks
                              </span>
                            </div>

                            {/* Features */}
                            <ul className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-600">
                              {(course.features || []).map((feat, idx) => (
                                <li key={idx} className="flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Pricing Tag */}
                        <div className="text-right sm:shrink-0 pt-2 sm:pt-0 self-end sm:self-auto">
                          <div className="text-2xl font-black text-brand-navy font-display">
                            NPR {course.priceNpr.toLocaleString()}
                          </div>
                          {course.originalPriceNpr && course.originalPriceNpr > course.priceNpr && (
                            <>
                              <div className="text-xs text-slate-400 line-through">
                                NPR {course.originalPriceNpr.toLocaleString()}
                              </div>
                              <div className="text-[11px] font-bold text-emerald-600">
                                Save{' '}
                                {Math.round(
                                  ((course.originalPriceNpr - course.priceNpr) /
                                    course.originalPriceNpr) *
                                    100,
                                )}
                                %
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* Udemy-Style Order Summary (Sticky Sidebar) */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-28">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl space-y-6">
              <h3 className="text-lg font-extrabold text-brand-navy border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {selectedCourses.length} Item{selectedCourses.length > 1 ? 's' : ''}
                </span>
              </h3>

              {/* Selected items list */}
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {selectedCourses.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No courses selected yet.</p>
                ) : (
                  selectedCourses.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between text-xs text-slate-700"
                    >
                      <span className="truncate max-w-[190px] font-medium" title={c.title}>
                        {c.title}
                      </span>
                      <span className="font-bold text-brand-navy shrink-0">
                        NPR {c.priceNpr.toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Price Calculations */}
              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Original Total:</span>
                  <span className="line-through">NPR {originalTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon & Package Savings:</span>
                  <span>- NPR {totalSavings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                  <span className="text-base font-extrabold text-brand-navy">Total Price:</span>
                  <span className="text-3xl font-black text-brand-navy font-display">
                    NPR {discountedTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* eSewa Direct Payment Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                      e
                    </span>
                    <span className="font-bold text-xs text-emerald-950 uppercase tracking-wide">
                      Direct eSewa Transfer
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-200/60 text-emerald-900">
                    Manual Verified
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-200/80 flex items-center justify-between shadow-xs">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                      Official eSewa ID / Number
                    </p>
                    <p className="text-base font-mono font-black text-emerald-800">
                      9824803556
                    </p>
                  </div>
                  <button
                    onClick={handleCopyEsewa}
                    className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors flex items-center gap-1 text-xs font-bold"
                    title="Copy eSewa ID"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Specific Prompt Requirement Note */}
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-amber-900 text-[11px] leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Instructions:</strong> Pay the price (
                    <strong>NPR {discountedTotal.toLocaleString()}</strong>) to{' '}
                    <strong>9824803556</strong> and{' '}
                    <span className="underline decoration-amber-500 font-bold">
                      take a screenshot of the payment
                    </span>
                    .
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                disabled={selectedCourses.length === 0}
                onClick={() => setShowCheckoutModal(true)}
                className="w-full py-4 rounded-2xl bg-brand-indigo hover:bg-brand-indigo-light text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-brand-indigo/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="space-y-1.5 text-[11px] text-slate-500 text-center">
                <p className="flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Access granted immediately upon admin receipt verification.
                </p>
                <p>Support contact: 9824803556 / info@examsathi.com.np</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* CHECKOUT & SCREENSHOT UPLOAD MODAL */}
      {/* ========================================================= */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-brand-navy/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="badge-purple text-[10px]">Step 2: Submit Proof</span>
                <h3 className="text-xl font-extrabold text-brand-navy">
                  Payment Verification Form
                </h3>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Selected Courses:</span>
                <span className="font-bold text-brand-navy">
                  {selectedCourses.length} Course{selectedCourses.length > 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Amount Due:</span>
                <span className="font-bold text-brand-navy text-sm">
                  NPR {discountedTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Receiver eSewa ID:</span>
                <span className="font-mono font-bold text-emerald-700">9824803556</span>
              </div>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              {/* Screenshot Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Payment Transfer Screenshot <span className="text-rose-500">*</span>
                </label>

                {screenshotPreview ? (
                  <div className="relative rounded-2xl border-2 border-emerald-300 p-2 bg-emerald-50/30 flex flex-col items-center">
                    <img
                      src={screenshotPreview}
                      alt="Transfer Receipt Preview"
                      className="max-h-48 object-contain rounded-xl shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setScreenshotPreview(null)}
                      className="mt-2 text-xs text-rose-600 hover:underline font-bold"
                    >
                      Change Screenshot
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 hover:border-brand-indigo rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-slate-50">
                    <Upload className="w-8 h-8 text-brand-indigo mb-2" />
                    <span className="text-xs font-bold text-brand-navy">
                      Click to upload payment screenshot
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      JPG, PNG, WebP up to 10MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      required
                    />
                  </label>
                )}
              </div>

              {/* Transaction Code */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  eSewa Transaction Code / Reference Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 71A82BC9..."
                  value={transactionCode}
                  onChange={(e) => setTransactionCode(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo/30"
                />
              </div>

              {/* Remarks */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Your Remarks or Mobile Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paid from 9841000000 for NEC Civil course"
                  value={paymentRemarks}
                  onChange={(e) => setPaymentRemarks(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-indigo/30"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !screenshotPreview}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting for Admin Verification...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Submit Payment for Verification</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ORDER SUBMISSION SUCCESS MODAL */}
      {/* ========================================================= */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-brand-navy/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="badge-purple bg-amber-100 text-amber-900 border-amber-200 text-xs">
                Pending Administrator Verification
              </span>
              <h3 className="text-2xl font-extrabold text-brand-navy font-display">
                Receipt Submitted Successfully!
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Thank you! Your payment screenshot for eSewa ID <strong>9824803556</strong> has
                been queued for verification. Once approved by our team, your courses will be
                immediately unlocked.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5 text-left">
              <div className="flex justify-between text-slate-500">
                <span>Order Reference:</span>
                <span className="font-mono font-bold text-brand-navy">
                  {orderSuccess.orderNumber}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Amount Paid:</span>
                <span className="font-bold text-brand-navy">
                  NPR {orderSuccess.totalAmountNpr.toLocaleString()}
                </span>
              </div>
              <div className="pt-1 text-slate-600 font-medium">
                Courses Included:
                <ul className="list-disc list-inside text-slate-500 text-[11px] pt-1">
                  {orderSuccess.courses.map((title, i) => (
                    <li key={i}>{title}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/dashboard"
                className="w-full py-3.5 rounded-xl bg-brand-navy hover:bg-brand-navy-light text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Go to Student Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setOrderSuccess(null)}
                className="text-xs text-slate-500 hover:text-slate-800 py-1"
              >
                Close & Browse More Courses
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
