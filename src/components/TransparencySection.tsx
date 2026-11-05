import React, { useState } from 'react';
import { DISTRIBUTION_DATA, PURWAKARTA_DISTRICTS, STATS_SUMMARY } from '../data/mockData';
import { DistributionItem, PillarProgram } from '../types';
import { ShieldCheck, TrendingUp, Users, Award, MapPin, Calendar, FileText, Download, CheckCircle2 } from 'lucide-react';

interface TransparencySectionProps {
  onDonateToProgram?: (title: string) => void;
}

export const TransparencySection: React.FC<TransparencySectionProps> = ({ onDonateToProgram }) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedPillar, setSelectedPillar] = useState<string>('all');

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const filteredDistributions = DISTRIBUTION_DATA.filter((item) => {
    const matchDistrict = selectedDistrict === 'all' || item.district === selectedDistrict;
    const matchPillar = selectedPillar === 'all' || item.pillar === selectedPillar;
    return matchDistrict && matchPillar;
  });

  return (
    <section id="transparansi" className="py-20 bg-stone-50 border-t border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100/70 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Akuntabilitas Publik & Transparansi Syariah</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Laporan Penyaluran Dana ZIS BAZNAS Kabupaten Purwakarta
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Setiap rupiah amanah zakat, infak, dan sedekah yang dititipkan oleh para muzakki disalurkan secara terukur, tepat sasaran ke 8 asnaf di seluruh 17 kecamatan se-Kabupaten Purwakarta.
          </p>
        </div>

        {/* 4-KPI Strip of Audited Transparency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Dana Terhimpun</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              {formatRupiah(STATS_SUMMARY.totalCollection)}
            </div>
            <div className="text-xs text-emerald-700 font-medium">12.840 Muzakki Berkontribusi</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Dana Disalurkan</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-800 font-mono">
              {formatRupiah(STATS_SUMMARY.totalDistribution)}
            </div>
            <div className="text-xs text-slate-600 font-medium">Rasio Penyaluran: {STATS_SUMMARY.distributionRate}% (Sangat Efektif)</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Penerima Manfaat</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">
              34.520 <span className="text-sm font-normal text-slate-500">Jiwa</span>
            </div>
            <div className="text-xs text-emerald-700 font-medium">17 Kecamatan & 192 Desa</div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>Opini Audit Keuangan</span>
              <Award className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-sm font-extrabold text-slate-900 leading-snug">
              Wajar Tanpa Pengecualian (WTP)
            </div>
            <div className="text-[11px] text-slate-500">KAP AR Utomo & Rekan (6 Th Berturut-turut)</div>
          </div>
        </div>

        {/* 5 BAZNAS Purwakarta Core Pillars Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">5 Pilar Program Penyaluran Dana ZIS</h3>
            <span className="text-xs text-slate-500">Distribusi Terencana Sesuai Asnaf</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { id: 'purwakarta_cerdas', name: 'Purwakarta Cerdas', desc: 'Beasiswa Santri & Siswa Dhuafa', color: 'border-blue-200 bg-blue-50/50' },
              { id: 'purwakarta_sehat', name: 'Purwakarta Sehat', desc: 'Layanan Medis & Ambulans Gratis', color: 'border-red-200 bg-red-50/50' },
              { id: 'purwakarta_peduli', name: 'Purwakarta Peduli', desc: 'Bedah Rutilahu & Sembako Lansia', color: 'border-emerald-200 bg-emerald-50/50' },
              { id: 'purwakarta_makmur', name: 'Purwakarta Makmur', desc: 'Modal Usaha UMKM & Z-Mart', color: 'border-amber-200 bg-amber-50/50' },
              { id: 'purwakarta_taqwa', name: 'Purwakarta Taqwa', desc: 'Insentif Guru Ngaji & Musholla', color: 'border-purple-200 bg-purple-50/50' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPillar(selectedPillar === p.id ? 'all' : p.id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedPillar === p.id
                    ? 'ring-2 ring-emerald-600 bg-white shadow-md'
                    : 'bg-white hover:bg-stone-100/60 border-stone-200'
                }`}
              >
                <div className="text-xs font-bold text-slate-900">{p.name}</div>
                <div className="text-[11px] text-slate-500 mt-1 leading-snug">{p.desc}</div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-2">
                  {selectedPillar === p.id ? '✓ Aktif memfilter' : 'Klik untuk filter'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Controls: District & Pillar */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Filter Wilayah:
            </span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">Semua Kecamatan di Purwakarta</option>
              {PURWAKARTA_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  Kecamatan {d}
                </option>
              ))}
            </select>

            <select
              value={selectedPillar}
              onChange={(e) => setSelectedPillar(e.target.value)}
              className="px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">Semua Pilar Program</option>
              <option value="purwakarta_cerdas">Purwakarta Cerdas</option>
              <option value="purwakarta_sehat">Purwakarta Sehat</option>
              <option value="purwakarta_peduli">Purwakarta Peduli</option>
              <option value="purwakarta_makmur">Purwakarta Makmur</option>
              <option value="purwakarta_taqwa">Purwakarta Taqwa</option>
            </select>
          </div>

          <div className="text-xs text-slate-500">
            Menampilkan <span className="font-bold text-slate-900">{filteredDistributions.length}</span> catatan penyaluran terverifikasi
          </div>
        </div>

        {/* Real Distribution Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDistributions.map((dist) => (
            <div
              key={dist.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Photo Documentation */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={dist.imageUrl}
                    alt={dist.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-900/90 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded backdrop-blur-xs">
                    {dist.pillarLabel}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{dist.date}</span>
                    <span aria-hidden="true">·</span>
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Kec. {dist.district}</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 leading-snug">
                    {dist.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {dist.description}
                  </p>

                  <div className="pt-3 border-t border-stone-100 text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Penerima Manfaat:</span>
                      <span className="font-bold text-slate-800">
                        {dist.recipientCount} {dist.recipientUnit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Alokasi Dana:</span>
                      <span className="font-mono font-bold text-emerald-800 text-sm">
                        {formatRupiah(dist.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Audit Tag */}
              <div className="p-4 bg-stone-50 border-t border-stone-200 text-[10px] text-slate-500 flex items-center justify-between">
                <span className="font-mono text-slate-600">{dist.auditRef}</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Tervalidasi
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Annual Report Download Banner */}
        <div className="bg-emerald-900 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl font-bold tracking-tight">Unduh Laporan Keuangan Tahunan BAZNAS Purwakarta</h3>
            <p className="text-xs text-emerald-200 leading-relaxed">
              Dapatkan dokumen PDF Laporan Keuangan teraudit lengkap dengan rincian penerimaan muzakki, catatan atas laporan keuangan (CALK), dan opini Wajar Tanpa Pengecualian (WTP).
            </p>
          </div>
          <button
            onClick={() => {
              alert('Mengunduh Laporan_Tahunan_BAZNAS_Purwakarta_2025_Audited_WTP.pdf');
            }}
            className="px-6 py-3 bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Unduh Laporan Lengkap (PDF 4.2 MB)</span>
          </button>
        </div>
      </div>
    </section>
  );
};
