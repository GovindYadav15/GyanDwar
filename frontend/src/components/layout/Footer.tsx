import React from 'react';
import Link from 'next/link';
import { GraduationCap, ShieldCheck, Mail, MapPin, Phone, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-brand-navy-dark text-gray-300 border-t border-brand-indigo/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-purple flex items-center justify-center text-white">
                <GraduationCap className="w-6 h-6 text-brand-gold" />
              </div>
              <span className="text-xl font-bold text-white font-display">
                ExamSathi <span className="text-brand-gold">Nepal</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Nepal’s leading professional examination platform. Engineered specifically for NEC
              Engineering Licensure, Lok Sewa Aayog Technical Cadres, and Diploma Licensure
              aspirants.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-brand-purple-light">
              <ShieldCheck className="w-4 h-4 text-brand-gold" />
              <span>Official-aligned syllabus • Secure eSewa & Khalti checkout</span>
            </div>
          </div>

          {/* Exam Tracks */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Exam Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/categories/NEC" className="hover:text-brand-gold transition-colors">
                  NEC License (Civil)
                </Link>
              </li>
              <li>
                <Link href="/categories/NEC" className="hover:text-brand-gold transition-colors">
                  NEC License (Electrical)
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/LOK_SEWA"
                  className="hover:text-brand-gold transition-colors"
                >
                  Lok Sewa Engineering (7th/5th)
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/DIPLOMA"
                  className="hover:text-brand-gold transition-colors"
                >
                  Diploma Licensure
                </Link>
              </li>
            </ul>
          </div>

          {/* Learning & Tools */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Assessment Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/assessments" className="hover:text-brand-gold transition-colors">
                  Chapter Practice Drills
                </Link>
              </li>
              <li>
                <Link
                  href="/assessments?type=FULL_MOCK"
                  className="hover:text-brand-gold transition-colors"
                >
                  100-Mark Full Model Tests
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-brand-gold transition-colors">
                  Preparation Passes
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-brand-gold transition-colors">
                  Admin & Author Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact in Nepal */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact & Support
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <span>New Baneshwor, Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <span>support@examsathi.com.np</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <span>+977 01-4490000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} ExamSathi Nepal (ज्ञानद्वार). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-gray-300">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-gray-300">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-gray-300">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
