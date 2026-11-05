import React from 'react';
import { BaznasLogo } from './BaznasLogo';
import { MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenCalculator: () => void;
  onOpenDonation: () => void;
  onOpenPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCalculator,
  onOpenDonation,
  onOpenPortal,
}) => {
  return (
    <footer className="bg-emerald-950 text-white border-t border-emerald-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Col 1: Identity & Legal */}
          <div className="lg:col-span-5 space-y-4">
            <BaznasLogo size="md" variant="light" />
            <p className="text-xs text-emerald-200/90 leading-relaxed max-w-sm">
              Badan Amil Zakat Nasional (BAZNAS) Kabupaten Purwakarta adalah lembaga pemerintah non-struktural resmi yang bertugas menghimpun dan menyalurkan Zakat, Infak, dan Sedekah (ZIS) berdasarkan UU No. 23 Tahun 2011.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Opini WTP 6 Tahun Berturut-turut</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Layanan Utama
            </h4>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              <li>
                <button
                  onClick={onOpenDonation}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Tunaikan Zakat & Infak Daring
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCalculator}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Kalkulator Zakat Penghasilan & Maal
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCalculator}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Kalkulator Zakat Pertanian & Peternakan
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPortal}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Portal Muzakki & Riwayat Setoran
                </button>
              </li>
              <li>
                <a href="#transparansi" className="hover:text-white transition-colors">
                  Laporan Akuntabilitas & Transparansi
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Office */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Kantor Layanan BAZNAS
            </h4>
            <div className="space-y-2 text-xs text-emerald-100/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Jl. Veteran No. 1, Kel. Nagri Kaler, Kec. Purwakarta, Kab. Purwakarta, Jawa Barat 41115</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp Layanan: +62 811-2321-444</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>layanan.muzakki@baznaspurwakarta.or.id</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Senin – Jumat: 08.00 – 16.00 WIB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-emerald-300">
          <div>
            &copy; {new Date().getFullYear()} BAZNAS Kabupaten Purwakarta. Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-4 text-emerald-400">
            <span>Aman Syar&apos;i</span>
            <span aria-hidden="true">·</span>
            <span>Aman Regulasi</span>
            <span aria-hidden="true">·</span>
            <span>Aman NKRI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
