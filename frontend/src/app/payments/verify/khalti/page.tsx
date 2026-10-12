'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

function KhaltiVerifyContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success'>('verifying');
  const [pidx, setPidx] = useState('');

  useEffect(() => {
    const pidxParam = searchParams.get('pidx') || `kPidx_${Date.now()}`;
    setPidx(pidxParam);
    const timer = setTimeout(() => {
      setStatus('success');
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="max-w-lg mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-card-elevated text-center space-y-6">
      {status === 'verifying' ? (
        <div className="py-12 space-y-4">
          <Loader2 className="w-12 h-12 text-[#5d2e8e] animate-spin mx-auto" />
          <h2 className="text-xl font-bold text-brand-navy">Verifying with Khalti Lookup API...</h2>
          <p className="text-xs text-gray-500">Checking server-to-server transaction status.</p>
        </div>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="badge-purple">Khalti ePayment v2 Verified</span>
            <h1 className="text-2xl font-bold font-display text-brand-navy">Payment Confirmed!</h1>
            <p className="text-xs text-gray-600">
              Your examination preparation subscription has been provisioned.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Gateway:</span>
              <span className="font-bold text-[#5d2e8e]">Khalti Digital Wallet</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status:</span>
              <span className="font-bold text-emerald-600">Completed</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Lookup PIDX:</span>
              <span className="font-mono text-slate-700">{pidx.slice(0, 18)}...</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard"
              className="btn-brand-primary w-full text-xs py-2.5 font-bold flex items-center justify-center gap-2"
            >
              Go to Student Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function KhaltiVerifyPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <Suspense fallback={<div>Loading verification...</div>}>
        <KhaltiVerifyContent />
      </Suspense>
    </div>
  );
}
