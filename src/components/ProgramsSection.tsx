import React from 'react';
import { ZisCategory } from '../types';
import { Heart, Briefcase, Coins, Sprout, ShieldCheck, ArrowRight } from 'lucide-react';

interface ProgramsSectionProps {
  onSelectProgram: (category: ZisCategory, amount: number, title: string) => void;
  onOpenCalculator: () => void;
}

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({
  onSelectProgram,
  onOpenCalculator,
}) => {
  const programs = [
    {
      id: 'zakat_penghasilan' as ZisCategory,
      title: 'Zakat Penghasilan / Profesi',
      category: 'Kewajiban Bulanan',
      desc: 'Dikeluarkan dari gaji bulanan bagi karyawan, ASN Pemkab Purwakarta, profesional, dokter, dan pengusaha.',
      defaultAmount: 500000,
      icon: Briefcase,
      badge: '2.5% Penghasilan',
      actionLabel: 'Tunaikan Zakat Profesi',
    },
    {
      id: 'zakat_maal' as ZisCategory,
      title: 'Zakat Maal (Emas & Tabungan)',
      category: 'Kewajiban Tahunan',
      desc: 'Penyucian harta simpanan emas, saldo giro, deposito perbankan, dan investasi yang telah mencapai haul 1 tahun.',
      defaultAmount: 2500000,
      icon: Coins,
      badge: 'Nishab 85g Emas',
      actionLabel: 'Tunaikan Zakat Maal',
    },
    {
      id: 'zakat_pertanian' as ZisCategory,
      title: 'Zakat Pertanian (Hasil Panen)',
      category: 'Setiap Musim Panen',
      desc: 'Kewajiban zakat tanaman padi sawah dan palawija petani di sentra pertanian Purwakarta saat panen raya tiba.',
      defaultAmount: 750000,
      icon: Sprout,
      badge: 'Nishab 653 Kg Gabah',
      actionLabel: 'Tunaikan Zakat Panen',
    },
    {
      id: 'program_bantuan' as ZisCategory,
      title: 'Beasiswa Santri Purwakarta Cerdas',
      category: 'Program Prioritas',
      desc: 'Bantuan biaya pendidikan, kitab, dan asrama untuk anak yatim dan santri dhuafa penghafal Al-Qur&apos;an di Purwakarta.',
      defaultAmount: 250000,
      icon: Heart,
      badge: 'Sedekah Terikat',
      actionLabel: 'Salurkan Beasiswa',
    },
    {
      id: 'infak_umum' as ZisCategory,
      title: 'Bantuan Modal Usaha Mustahik',
      category: 'Pemberdayaan Ekonomi',
      desc: 'Program pinjaman qardhul hasan dan pendampingan usaha mikro Z-Mart untuk mengangkat mustahik menjadi muzakki.',
      defaultAmount: 300000,
      icon: ShieldCheck,
      badge: 'Z-Mart Purwakarta',
      actionLabel: 'Dukung UMKM Mustahik',
    },
    {
      id: 'sedekah_subuh' as ZisCategory,
      title: 'Sedekah Subuh Berkah Purwakarta',
      category: 'Sedekah Harian',
      desc: 'Amalan sedekah di waktu subuh yang didoakan oleh para malaikat, dialokasikan untuk santunan lansia dhuafa.',
      defaultAmount: 50000,
      icon: Heart,
      badge: 'Mulai Rp 50.000',
      actionLabel: 'Sedekah Subuh Sekarang',
    },
  ];

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <section id="program" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Pilihan Program Penyaluran
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Tunaikan ZIS Sesuai Niat & Kewajiban Anda
            </h2>
            <p className="text-sm text-slate-600 max-w-xl">
              Pilih pos zakat atau program bantuan sosial yang ingin Anda salurkan secara langsung melalui sistem daring BAZNAS Kabupaten Purwakarta.
            </p>
          </div>

          <button
            onClick={onOpenCalculator}
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <span>Ragu dengan hitungan? Gunakan Kalkulator Zakat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((prog) => {
            const IconComp = prog.icon;
            return (
              <div
                key={prog.title}
                className="p-6 rounded-2xl border border-slate-200 hover:border-emerald-600/60 bg-white shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-full border border-emerald-200">
                      {prog.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-400 block">{prog.category}</span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors mt-0.5">
                      {prog.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {prog.desc}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Mulai dari</span>
                    <span className="text-sm font-bold text-emerald-900 font-mono">
                      {formatRupiah(prog.defaultAmount)}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectProgram(prog.id, prog.defaultAmount, prog.title)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{prog.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
