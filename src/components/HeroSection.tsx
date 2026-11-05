import React from 'react';
import { Calculator, HeartHandshake, ShieldCheck, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onOpenDonation: () => void;
  onOpenCalculator: () => void;
  onOpenPortal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenDonation,
  onOpenCalculator,
  onOpenPortal,
}) => {
  return (
    <div className="relative bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white overflow-hidden">
      {/* Subtle Islamic Geometric Background Accent */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
          <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <circle cx="50" cy="50" r="25" fill="none" stroke="#FFFFFF" strokeWidth="1" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-200 bg-emerald-800/80 border border-emerald-700/60 px-3.5 py-1.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Badan Amil Zakat Nasional Kabupaten Purwakarta</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
              Mudahkan Zakat, Infak & Sedekah untuk Keberkahan Purwakarta
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-xl">
              Salurkan kewajiban zakat maal, penghasilan, pertanian, dan peternakan Anda secara aman, transparan, dan terpercaya. Dilengkapi kalkulator fiqh akurat, verifikasi KTP untuk pengurang pajak, serta notifikasi resmi via WhatsApp.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenDonation}
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 cursor-pointer"
              >
                <HeartHandshake className="w-5 h-5" />
                <span>Tunaikan ZIS Sekarang</span>
              </button>

              <button
                onClick={onOpenCalculator}
                className="px-6 py-3.5 bg-emerald-800/80 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl border border-emerald-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-emerald-300" />
                <span>Hitung di Kalkulator Zakat</span>
              </button>
            </div>

            {/* Trust Bullet Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-emerald-800/80 text-xs text-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Audit WTP Terakreditasi</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Notifikasi WA Otomatis</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Sah Pengurang Pajak (BSZ)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-emerald-700/50 bg-emerald-900 group">
              <img
                src="/src/assets/images/hero_baznas_purwakarta_1793847186089.jpg"
                alt="Masjid Agung dan Lanskap BAZNAS Purwakarta"
                referrerPolicy="no-referrer"
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/30 to-transparent" />
              
              <div className="absolute bottom-0 inset-x-0 p-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-emerald-300">
                  <span className="font-semibold">Purwakarta Istimewa</span>
                  <span className="font-mono">17 Kecamatan</span>
                </div>
                <div className="text-sm font-bold text-white">
                  Menyalurkan Kebaikan ke Seluruh Penjuru Kabupaten Purwakarta
                </div>
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <button
                    onClick={onOpenPortal}
                    className="text-emerald-300 hover:text-white font-semibold underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Buka Portal Muzakki</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
