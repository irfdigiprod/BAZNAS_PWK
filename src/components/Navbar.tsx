import React from 'react';
import { BaznasLogo } from './BaznasLogo';
import { MuzakkiUser } from '../types';
import { ShieldCheck, UserCheck, HeartHandshake } from 'lucide-react';

interface NavbarProps {
  onOpenCalculator: () => void;
  onOpenDonation: () => void;
  onOpenPortal: () => void;
  onOpenKtpVerify: () => void;
  activeView: 'home' | 'portal';
  setActiveView: (view: 'home' | 'portal') => void;
  currentUser: MuzakkiUser | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCalculator,
  onOpenDonation,
  onOpenPortal,
  onOpenKtpVerify,
  activeView,
  setActiveView,
  currentUser,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-950/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single Brand element */}
        <button
          onClick={() => setActiveView('home')}
          className="text-left cursor-pointer hover:opacity-95 transition-opacity whitespace-nowrap shrink-0"
        >
          <BaznasLogo size="md" />
        </button>

        {/* Zone 2: 4–5 concise single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
          <button
            onClick={() => {
              if (activeView !== 'home') setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`cursor-pointer whitespace-nowrap shrink-0 hover:text-emerald-700 transition-colors ${
              activeView === 'home' ? 'text-emerald-800 font-semibold' : ''
            }`}
          >
            Beranda
          </button>
          <button
            onClick={onOpenCalculator}
            className="cursor-pointer whitespace-nowrap shrink-0 hover:text-emerald-700 transition-colors flex items-center gap-1.5"
          >
            <span>Kalkulator Zakat</span>
          </button>
          <a
            href="#program"
            onClick={(e) => {
              if (activeView !== 'home') {
                e.preventDefault();
                setActiveView('home');
                setTimeout(() => {
                  document.getElementById('program')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="cursor-pointer whitespace-nowrap shrink-0 hover:text-emerald-700 transition-colors"
          >
            Program Penyaluran
          </a>
          <a
            href="#transparansi"
            onClick={(e) => {
              if (activeView !== 'home') {
                e.preventDefault();
                setActiveView('home');
                setTimeout(() => {
                  document.getElementById('transparansi')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="cursor-pointer whitespace-nowrap shrink-0 hover:text-emerald-700 transition-colors"
          >
            Laporan Transparansi
          </a>
          <button
            onClick={() => setActiveView('portal')}
            className={`cursor-pointer whitespace-nowrap shrink-0 hover:text-emerald-700 transition-colors flex items-center gap-1.5 ${
              activeView === 'portal' ? 'text-emerald-800 font-semibold' : ''
            }`}
          >
            <span>Portal Muzakki</span>
            {currentUser?.ktpVerified && (
              <span className="inline-flex items-center gap-0.5 text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>KTP OK</span>
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <button
              onClick={() => setActiveView(activeView === 'portal' ? 'home' : 'portal')}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              title="Profil Muzakki"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span className="truncate max-w-[120px]">{currentUser.name.split(' ')[0]}</span>
            </button>
          ) : null}

          <button
            onClick={onOpenDonation}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <HeartHandshake className="w-4 h-4 text-emerald-200" />
            <span>Tunaikan ZIS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
