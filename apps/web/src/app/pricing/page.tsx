'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Sparkles,
  ArrowRight,
  Lock,
  Loader2,
} from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string>('plan-quarterly');
  const [selectedGateway, setSelectedGateway] = useState<'ESEWA' | 'KHALTI'>('ESEWA');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'plan-monthly',
      name: '1 Month Sprint Pass',
      price: 999,
      duration: '30 Days Access',
      badge: 'Revision',
      desc: 'Ideal for final month intensive exam practice.',
      features: [
        'Full NEC & Lok Sewa Question Bank',
        'Unlimited Chapter-wise Practice Drills',
        '10 Full-Length 100-Mark Mock Exams',
        'Instant Solution Reviews',
      ],
    },
    {
      id: 'plan-quarterly',
      name: '3 Month Complete Preparation Pass',
      price: 2499,
      duration: '90 Days Access',
      badge: 'Most Popular',
      popular: true,
      desc: 'Most comprehensive plan for complete syllabus mastery.',
      features: [
        'Unlimited 100-Mark Model Simulations',
        'Full Chapter Notes & High-Yield Summaries',
        'Detailed Weak-Topic Performance Analytics',
        'eSewa & Khalti Instant Activation',
        'All Engineering Faculties Included',
      ],
    },
    {
      id: 'plan-annual',
      name: '1 Year Career All-Access Pass',
      price: 5999,
      duration: '365 Days Access',
      badge: 'Best Value',
      desc: 'Both NEC License and Lok Sewa Preparation combined.',
      features: [
        'All Current & Upcoming Exam Tracks',
        'Free Syllabus Revision Updates',
        'Unlimited Mock Attempts with Rank Leaderboards',
        'Priority Technical Support in Nepal',
      ],
    },
  ];

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate payment gateway initiation / redirection
    setTimeout(() => {
      setIsProcessing(false);
      if (selectedGateway === 'ESEWA') {
        router.push(
          `/payments/verify/esewa?data=${encodeURIComponent(
            btoa(
              JSON.stringify({
                transaction_code: `ESW_${Date.now()}`,
                status: 'COMPLETE',
                total_amount:
                  selectedPlan === 'plan-monthly'
                    ? '999'
                    : selectedPlan === 'plan-quarterly'
                      ? '2499'
                      : '5999',
                transaction_uuid: `TXN_ORD_${Date.now()}`,
                product_code: 'EPAYTEST',
                signature: 'mock_valid_signature_for_sandbox',
              }),
            ),
          )}`,
        );
      } else {
        router.push(
          `/payments/verify/khalti?pidx=mock_pidx_${Date.now()}&orderId=ORD_${Date.now()}`,
        );
      }
    }, 1200);
  };

  const activePlanObj = plans.find((p) => p.id === selectedPlan) || plans[1];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="badge-purple">Transparent Pricing</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-brand-navy">
          Select Your Exam Preparation Pass
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Pay easily via Nepal’s secure digital payment gateways: eSewa and Khalti. Instant
          subscription activation.
        </p>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`bg-white rounded-2xl p-8 border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'border-brand-indigo shadow-card-elevated ring-2 ring-brand-indigo/20'
                  : 'border-slate-200 hover:border-brand-purple/40 shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-brand-gold text-brand-navy font-bold text-xs uppercase tracking-wide border border-brand-gold-dark shadow-sm">
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">
                    {plan.duration}
                  </span>
                  <input
                    type="radio"
                    name="planRadio"
                    checked={isSelected}
                    onChange={() => setSelectedPlan(plan.id)}
                    className="w-4 h-4 text-brand-indigo accent-brand-indigo cursor-pointer"
                  />
                </div>

                <h3 className="text-xl font-bold text-brand-navy font-display">{plan.name}</h3>
                <p className="text-xs text-gray-500 mt-1 mb-6">{plan.desc}</p>

                <div className="mb-6 pb-6 border-b border-slate-100">
                  <div className="text-4xl font-extrabold text-brand-navy font-display">
                    NPR {plan.price.toLocaleString()}
                  </div>
                  <span className="text-xs text-gray-400">One-time payment • No auto-renewal</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-700 mb-8">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all ${
                  isSelected
                    ? 'btn-brand-primary'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isSelected ? 'Plan Selected' : 'Choose Plan'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Gateway Selection & Checkout Drawer */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-brand-indigo/40 shadow-xl max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h3 className="text-xl font-bold font-display text-white">Payment Gateway Selection</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Order: <strong>{activePlanObj.name}</strong> • Amount:{' '}
              <span className="text-brand-gold font-bold">
                NPR {activePlanObj.price.toLocaleString()}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-brand-gold">
            <ShieldCheck className="w-4 h-4" />
            <span>256-bit Encrypted Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* eSewa Option */}
          <div
            onClick={() => setSelectedGateway('ESEWA')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
              selectedGateway === 'ESEWA'
                ? 'border-emerald-500 bg-emerald-950/40 shadow-glow-indigo'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 font-bold text-white flex items-center justify-center text-sm shadow">
                eSewa
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">eSewa Mobile Wallet</h4>
                <p className="text-xs text-gray-400">Official EPAY v2 Integration</p>
              </div>
            </div>
            <input
              type="radio"
              checked={selectedGateway === 'ESEWA'}
              onChange={() => setSelectedGateway('ESEWA')}
              className="accent-emerald-500 w-4 h-4 cursor-pointer"
            />
          </div>

          {/* Khalti Option */}
          <div
            onClick={() => setSelectedGateway('KHALTI')}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
              selectedGateway === 'KHALTI'
                ? 'border-brand-purple bg-brand-purple/20 shadow-glow-indigo'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#5d2e8e] font-bold text-white flex items-center justify-center text-sm shadow">
                Khalti
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Khalti ePayment</h4>
                <p className="text-xs text-gray-400">ePayment v2 Lookup API</p>
              </div>
            </div>
            <input
              type="radio"
              checked={selectedGateway === 'KHALTI'}
              onChange={() => setSelectedGateway('KHALTI')}
              className="accent-brand-purple w-4 h-4 cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 text-center sm:text-left">
            By completing this payment, you receive instant access to premium exams and notes.
          </p>

          <button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="btn-brand-gold w-full sm:w-auto px-8 py-3 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting to Gateway...
              </>
            ) : (
              <>
                Pay NPR {activePlanObj.price.toLocaleString()} with {selectedGateway}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
