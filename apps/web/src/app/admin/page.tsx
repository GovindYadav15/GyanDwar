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
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'orders'>('overview');

  const metrics = {
    totalUsers: 1482,
    totalQuestions: 2840,
    totalAssessments: 36,
    totalRevenueNpr: 'NPR 1,248,500',
    conversionRate: '28.4%',
  };

  const sampleQuestions = [
    {
      id: 'q1',
      subject: 'Concrete Technology',
      chapter: 'Cement & Pozzolanas',
      text: 'Which Bogue compound is primarily responsible for the early strength development of Portland cement within the first 7 days?',
      difficulty: 'EASY',
      marks: '1.0',
      negative: '0.2',
      status: 'PUBLISHED',
    },
    {
      id: 'q2',
      subject: 'Concrete Technology',
      chapter: 'Cement & Pozzolanas',
      text: 'What is the primary role of adding Gypsum (CaSO4 · 2H2O) to cement clinker during grinding?',
      difficulty: 'MEDIUM',
      marks: '1.0',
      negative: '0.2',
      status: 'PUBLISHED',
    },
    {
      id: 'q3',
      subject: 'Structural Analysis',
      chapter: 'Earthquake Engineering',
      text: 'What is the Importance Factor (I) recommended by NBC 105:2020 for hospital and critical disaster response structures?',
      difficulty: 'HARD',
      marks: '1.0',
      negative: '0.2',
      status: 'PUBLISHED',
    },
  ];

  const recentOrders = [
    {
      id: 'ORD_172881_991',
      user: 'Prakash Karki (prakash@gmail.com)',
      plan: '3 Month Complete Preparation Pass',
      amount: 'NPR 2,499',
      gateway: 'ESEWA',
      status: 'PAID',
      date: 'Today, 10:14 AM',
    },
    {
      id: 'ORD_172881_842',
      user: 'Sita Thapa (sita.thapa@gmail.com)',
      plan: '1 Month Sprint Pass',
      amount: 'NPR 999',
      gateway: 'KHALTI',
      status: 'PAID',
      date: 'Today, 09:45 AM',
    },
    {
      id: 'ORD_172881_712',
      user: 'Bikash Shrestha (bikash@gmail.com)',
      plan: '1 Year Career All-Access Pass',
      amount: 'NPR 5,999',
      gateway: 'ESEWA',
      status: 'PAID',
      date: 'Yesterday, 04:20 PM',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-purple">Administration & Content Studio</span>
            <span className="text-xs text-gray-500">Super Administrator Access</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-brand-navy">
            Platform Operations & Question Inventory
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'questions'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Question Bank
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-brand-navy text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Orders & Payments
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs">Registered Students</span>
            <Users className="w-4 h-4 text-brand-indigo" />
          </div>
          <p className="text-2xl font-extrabold text-brand-navy font-display">
            {metrics.totalUsers}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">+14 today</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs">Question Inventory</span>
            <HelpCircle className="w-4 h-4 text-brand-purple" />
          </div>
          <p className="text-2xl font-extrabold text-brand-navy font-display">
            {metrics.totalQuestions}
          </p>
          <span className="text-[11px] text-gray-500">Across 3 categories</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs">Paid Subscriptions</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-brand-navy font-display">
            {metrics.conversionRate}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">eSewa & Khalti</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs">Total Revenue (NPR)</span>
            <TrendingUp className="w-4 h-4 text-brand-gold" />
          </div>
          <p className="text-xl font-extrabold text-brand-indigo font-display">
            {metrics.totalRevenueNpr}
          </p>
          <span className="text-[11px] text-gray-500">Gross volume</span>
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Orders */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-brand-navy text-sm">Recent Verified Transactions</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-brand-indigo font-semibold"
              >
                View All →
              </button>
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {recentOrders.map((ord) => (
                <div key={ord.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">{ord.user}</p>
                    <p className="text-gray-500">
                      {ord.plan} • {ord.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600 block">{ord.amount}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      {ord.gateway}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Audit Feed */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-brand-navy text-sm">Security & Audit Event Stream</h3>
            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-brand-navy">
                    PAYMENT_VERIFIED_SUBSCRIPTION_ACTIVATED
                  </p>
                  <p className="text-gray-500 mt-0.5">
                    Order ORD_172881_991 verified via eSewa HMAC-SHA256 signature.
                  </p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-brand-indigo mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-brand-navy">QUESTION_POOL_PUBLISHED</p>
                  <p className="text-gray-500 mt-0.5">
                    Civil Engineering: 100-mark mock blueprint validated and deployed.
                  </p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                <Clock className="w-4 h-4 text-brand-purple mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-brand-navy">ASSESSMENT_ATTEMPT_SUBMITTED</p>
                  <p className="text-gray-500 mt-0.5">
                    Student #NP-77291 submitted attempt: 78.4/100 (Pass).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Question Bank */}
      {activeTab === 'questions' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search questions by text or chapter..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-indigo"
              />
            </div>
            <button className="btn-brand-primary text-xs py-2 px-4 flex items-center gap-1.5 font-bold self-end sm:self-auto">
              <Plus className="w-3.5 h-3.5" /> Author New Question
            </button>
          </div>

          <div className="divide-y divide-slate-100 pt-2">
            {sampleQuestions.map((q) => (
              <div key={q.id} className="py-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-brand-indigo">{q.subject}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{q.chapter}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {q.status}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-800 leading-snug">{q.text}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <span>
                    Difficulty: <strong>{q.difficulty}</strong>
                  </span>
                  <span>
                    Marks: <strong>{q.marks}</strong>
                  </span>
                  <span>
                    Negative: <strong>-{q.negative}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <h3 className="font-bold text-brand-navy text-base">Subscriber Transaction Ledger</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3">Order Number</th>
                  <th className="p-3">Student Candidate</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Gateway</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-brand-navy">{ord.id}</td>
                    <td className="p-3">{ord.user}</td>
                    <td className="p-3 font-medium">{ord.plan}</td>
                    <td className="p-3 font-bold text-emerald-600">{ord.amount}</td>
                    <td className="p-3 font-bold uppercase">{ord.gateway}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500">{ord.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
