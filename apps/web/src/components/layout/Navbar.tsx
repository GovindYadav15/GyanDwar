'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  CreditCard,
  User,
  Menu,
  X,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    setIsLoggedIn(Boolean(localStorage.getItem('examsathi_token')));
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Exam Categories', href: '/categories', icon: GraduationCap },
    { label: 'Practice Drills', href: '/assessments', icon: BookOpen },
    { label: 'Mock Exams (100 Mark)', href: '/assessments?type=FULL_MOCK', icon: CheckCircle2 },
    { label: 'Pricing Plans', href: '/pricing', icon: CreditCard },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-brand-navy-dark/95 backdrop-blur-md shadow-lg border-b border-white/10'
          : 'bg-brand-navy border-b border-brand-indigo/30'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-indigo to-brand-purple flex items-center justify-center shadow-glow-indigo text-white font-bold group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-brand-gold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-display">
                  ExamSathi <span className="text-brand-gold">Nepal</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-brand-gold/20 text-brand-gold border border-brand-gold/30">
                  ज्ञानद्वार
                </span>
              </div>
              <p className="text-xs text-brand-purple-light font-medium">
                NEC • Lok Sewa • Diploma Licensure
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white bg-brand-indigo/60 shadow-sm border border-brand-purple/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 text-brand-gold" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Auth / Action CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-indigo hover:bg-brand-indigo-light text-white text-sm font-semibold transition-all shadow-md"
              >
                <User className="w-4 h-4 text-brand-gold" />
                Student Portal
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-200 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="btn-brand-gold text-sm py-2 px-4 font-bold flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  Free Trial
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-navy-dark border-b border-brand-indigo/40 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-base font-medium text-gray-200 hover:bg-white/10"
              >
                <Icon className="w-5 h-5 text-brand-gold" />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2.5 rounded-lg border border-white/20 text-white font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="text-center py-2.5 rounded-lg bg-brand-gold text-brand-navy font-bold"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
