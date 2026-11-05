import React, { useState, useMemo } from 'react';
import { X, Calculator, HelpCircle, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { CURRENT_ZAKAT_RATES } from '../data/mockData';
import { ZisCategory } from '../types';

interface ZakatCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAmountForDonation: (category: ZisCategory, amount: number, label: string) => void;
}

type TabType = 'profesi' | 'maal' | 'pertanian' | 'peternakan' | 'perniagaan';

export const ZakatCalculatorModal: React.FC<ZakatCalculatorModalProps> = ({
  isOpen,
  onClose,
  onSelectAmountForDonation,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('profesi');

  // 1. Zakat Profesi / Penghasilan
  const [profesiGaji, setProfesiGaji] = useState<number>(12000000);
  const [profesiLain, setProfesiLain] = useState<number>(2000000);
  const [profesiHutang, setProfesiHutang] = useState<number>(2500000);

  // 2. Zakat Maal & Emas
  const [maalEmasGram, setMaalEmasGram] = useState<number>(30);
  const [maalTabungan, setMaalTabungan] = useState<number>(150000000);
  const [maalInvestasi, setMaalInvestasi] = useState<number>(25000000);
  const [maalHutang, setMaalHutang] = useState<number>(10000000);

  // 3. Zakat Pertanian
  const [taniMetode, setTaniMetode] = useState<'irigasi' | 'tadah_hujan' | 'campuran'>('irigasi');
  const [taniHasilKg, setTaniHasilKg] = useState<number>(3500); // 3.5 ton gabah
  const [taniHargaPerKg, setTaniHargaPerKg] = useState<number>(CURRENT_ZAKAT_RATES.grainPricePerKg);
  const [taniBiayaOperasional, setTaniBiayaOperasional] = useState<number>(4000000);

  // 4. Zakat Peternakan
  const [ternakJenis, setTernakJenis] = useState<'kambing' | 'sapi'>('kambing');
  const [ternakJumlah, setTernakJumlah] = useState<number>(55);
  const [ternakHargaKambing, setTernakHargaKambing] = useState<number>(2500000);
  const [ternakHargaSapi, setTernakHargaSapi] = useState<number>(14000000);

  // 5. Zakat Perniagaan
  const [niagaStok, setNiagaStok] = useState<number>(90000000);
  const [niagaKasPiutang, setNiagaKasPiutang] = useState<number>(60000000);
  const [niagaHutang, setNiagaHutang] = useState<number>(15000000);

  // --- Calculations ---

  // 1. Profesi
  const monthlyNisabProfesi = useMemo(() => {
    return Math.round((CURRENT_ZAKAT_RATES.goldPricePerGram * CURRENT_ZAKAT_RATES.nisabGoldGrams) / 12);
  }, []);

  const netProfesiIncome = Math.max(0, (profesiGaji + profesiLain) - profesiHutang);
  const isProfesiWajib = netProfesiIncome >= monthlyNisabProfesi;
  const zakatProfesiMonthly = isProfesiWajib ? Math.round(netProfesiIncome * 0.025) : 0;
  const zakatProfesiYearly = zakatProfesiMonthly * 12;

  // 2. Maal
  const annualNisabMaal = CURRENT_ZAKAT_RATES.goldPricePerGram * CURRENT_ZAKAT_RATES.nisabGoldGrams;
  const totalEmasValue = maalEmasGram * CURRENT_ZAKAT_RATES.goldPricePerGram;
  const totalMaalAsset = totalEmasValue + maalTabungan + maalInvestasi - maalHutang;
  const isMaalWajib = totalMaalAsset >= annualNisabMaal;
  const zakatMaalYearly = isMaalWajib ? Math.round(totalMaalAsset * 0.025) : 0;

  // 3. Pertanian
  const taniNisabKg = CURRENT_ZAKAT_RATES.nisabGrainKg; // 653 kg gabah
  const isTaniWajib = taniHasilKg >= taniNisabKg;
  const taniGrossValue = taniHasilKg * taniHargaPerKg;
  const taniNetValue = Math.max(0, taniGrossValue - taniBiayaOperasional);
  const taniRate = taniMetode === 'tadah_hujan' ? 0.10 : taniMetode === 'irigasi' ? 0.05 : 0.075;
  const zakatTaniAmount = isTaniWajib ? Math.round(taniNetValue * taniRate) : 0;
  const zakatTaniKg = isTaniWajib ? Math.round((taniHasilKg - (taniBiayaOperasional / (taniHargaPerKg || 1))) * taniRate) : 0;

  // 4. Peternakan
  const ternakCalculation = useMemo(() => {
    if (ternakJenis === 'kambing') {
      const count = ternakJumlah;
      if (count < 40) {
        return { wajib: false, obligation: 'Belum mencapai nishab (minimal 40 ekor)', amount: 0 };
      } else if (count <= 120) {
        return { wajib: true, obligation: '1 ekor kambing / domba umur 1-2 tahun', amount: 1 * ternakHargaKambing };
      } else if (count <= 200) {
        return { wajib: true, obligation: '2 ekor kambing / domba', amount: 2 * ternakHargaKambing };
      } else if (count <= 300) {
        return { wajib: true, obligation: '3 ekor kambing / domba', amount: 3 * ternakHargaKambing };
      } else {
        const extraKambing = 3 + Math.floor((count - 300) / 100);
        return { wajib: true, obligation: `${extraKambing} ekor kambing / domba`, amount: extraKambing * ternakHargaKambing };
      }
    } else {
      // Sapi / Kerbau
      const count = ternakJumlah;
      if (count < 30) {
        return { wajib: false, obligation: 'Belum mencapai nishab (minimal 30 ekor)', amount: 0 };
      } else if (count <= 39) {
        return { wajib: true, obligation: "1 ekor Tabi' (sapi umur 1 tahun)", amount: 1 * ternakHargaSapi * 0.85 };
      } else if (count <= 59) {
        return { wajib: true, obligation: '1 ekor Musinnah (sapi betina umur 2 tahun)', amount: 1 * ternakHargaSapi };
      } else if (count <= 69) {
        return { wajib: true, obligation: "2 ekor Tabi' (sapi umur 1 tahun)", amount: 2 * (ternakHargaSapi * 0.85) };
      } else {
        return { wajib: true, obligation: "1 ekor Musinnah & 1 ekor Tabi'", amount: (ternakHargaSapi * 1.85) };
      }
    }
  }, [ternakJenis, ternakJumlah, ternakHargaKambing, ternakHargaSapi]);

  // 5. Perniagaan
  const niagaNetAsset = (niagaStok + niagaKasPiutang) - niagaHutang;
  const isNiagaWajib = niagaNetAsset >= annualNisabMaal;
  const zakatNiagaYearly = isNiagaWajib ? Math.round(niagaNetAsset * 0.025) : 0;
  const zakatNiagaMonthly = Math.round(zakatNiagaYearly / 12);

  if (!isOpen) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="bg-emerald-800 text-white p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-emerald-200">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Kalkulator Wajib Zakat BAZNAS</h2>
              <p className="text-xs text-emerald-200">
                Berdasarkan Standar Fiqh BAZNAS RI & Standar Emas 85g (Rp {formatRupiah(CURRENT_ZAKAT_RATES.goldPricePerGram)}/g)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-700/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (Segmented interactive control) */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 overflow-x-auto gap-2 shrink-0">
          {[
            { id: 'profesi', label: 'Zakat Penghasilan' },
            { id: 'maal', label: 'Zakat Maal & Emas' },
            { id: 'pertanian', label: 'Zakat Pertanian' },
            { id: 'peternakan', label: 'Zakat Peternakan' },
            { id: 'perniagaan', label: 'Zakat Perniagaan' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-emerald-800 border-t-2 border-emerald-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* TAB 1: PROFESI */}
          {activeTab === 'profesi' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-4">
                <div className="text-xs text-slate-500 mb-2">
                  Dihitung setiap bulan atau saat menerima honorarium/gaji. Nishab bulanan setara harga emas 85g dibagi 12 ({formatRupiah(monthlyNisabProfesi)}/bulan).
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gaji / Pendapatan Pokok Bulanan (Rp)
                  </label>
                  <input
                    type="number"
                    value={profesiGaji}
                    onChange={(e) => setProfesiGaji(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tunjangan, Bonus, & Pendapatan Sampingan (Rp)
                  </label>
                  <input
                    type="number"
                    value={profesiLain}
                    onChange={(e) => setProfesiLain(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hutang Jatuh Tempo / Kebutuhan Pokok Darurat (Rp)
                  </label>
                  <input
                    type="number"
                    value={profesiHutang}
                    onChange={(e) => setProfesiHutang(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Hanya cicilan kebutuhan primer yang wajib dilunasi pada bulan berjalan.
                  </p>
                </div>
              </div>

              {/* Result Column */}
              <div className="lg:col-span-5 bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-1">
                    Hasil Perhitungan
                  </span>
                  <div className="space-y-2 text-xs text-slate-600 mb-4 pb-4 border-b border-emerald-200/60">
                    <div className="flex justify-between">
                      <span>Pendapatan Bersih:</span>
                      <span className="font-semibold text-slate-800">{formatRupiah(netProfesiIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nishab Bulanan (85g Emas / 12):</span>
                      <span className="font-medium text-slate-700">{formatRupiah(monthlyNisabProfesi)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span>Status Kewajiban:</span>
                      {isProfesiWajib ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Wajib Zakat (2.5%)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                          <AlertCircle className="w-3.5 h-3.5" /> Belum Wajib (Infak Saja)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-emerald-200 shadow-2xs mb-4">
                    <div className="text-xs text-slate-500">Nominal Zakat Bulanan</div>
                    <div className="text-2xl font-extrabold text-emerald-800 tabular-nums">
                      {formatRupiah(zakatProfesiMonthly)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Setara {formatRupiah(zakatProfesiYearly)} / tahun
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const amountToPay = isProfesiWajib ? zakatProfesiMonthly : 100000;
                    onSelectAmountForDonation(
                      isProfesiWajib ? 'zakat_penghasilan' : 'infak_umum',
                      amountToPay,
                      isProfesiWajib ? 'Zakat Penghasilan Bulanan' : 'Infak Sukarela Purwakarta'
                    );
                    onClose();
                  }}
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>{isProfesiWajib ? 'Salurkan Zakat Ini' : 'Salurkan Sebagai Infak'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: MAAL & EMAS */}
          {activeTab === 'maal' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-4">
                <div className="text-xs text-slate-500 mb-2">
                  Zakat atas harta yang tersimpan selama 1 tahun hijriyah (Haul) dan mencapai nishab 85 gram emas ({formatRupiah(annualNisabMaal)}).
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kepemilikan Emas Simpanan / Batangan (Gram)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      value={maalEmasGram}
                      onChange={(e) => setMaalEmasGram(Number(e.target.value) || 0)}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                    />
                    <div className="flex items-center text-xs text-slate-500 bg-slate-100 px-3 rounded-lg">
                      ≈ {formatRupiah(totalEmasValue)}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Saldo Tabungan, Giro, & Deposito Bank (Rp)
                  </label>
                  <input
                    type="number"
                    value={maalTabungan}
                    onChange={(e) => setMaalTabungan(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Surat Berharga, Saham, & Reksadana Likuid (Rp)
                  </label>
                  <input
                    type="number"
                    value={maalInvestasi}
                    onChange={(e) => setMaalInvestasi(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hutang Pribadi yang Jatuh Tempo Tahun Ini (Rp)
                  </label>
                  <input
                    type="number"
                    value={maalHutang}
                    onChange={(e) => setMaalHutang(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                  />
                </div>
              </div>

              {/* Result Column */}
              <div className="lg:col-span-5 bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-1">
                    Hasil Perhitungan Maal
                  </span>
                  <div className="space-y-2 text-xs text-slate-600 mb-4 pb-4 border-b border-emerald-200/60">
                    <div className="flex justify-between">
                      <span>Total Harta Bersih:</span>
                      <span className="font-semibold text-slate-800">{formatRupiah(totalMaalAsset)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nishab 85g Emas:</span>
                      <span className="font-medium text-slate-700">{formatRupiah(annualNisabMaal)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span>Status:</span>
                      {isMaalWajib ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Wajib Zakat Maal (2.5%)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                          <AlertCircle className="w-3.5 h-3.5" /> Belum Capai Nishab
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-emerald-200 shadow-2xs mb-4">
                    <div className="text-xs text-slate-500">Nominal Zakat Maal (1 Tahun)</div>
                    <div className="text-2xl font-extrabold text-emerald-800 tabular-nums">
                      {formatRupiah(zakatMaalYearly)}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const amountToPay = isMaalWajib ? zakatMaalYearly : 250000;
                    onSelectAmountForDonation('zakat_maal', amountToPay, 'Zakat Maal (Harta & Tabungan)');
                    onClose();
                  }}
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>Salurkan Zakat Maal Ini</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: PERTANIAN */}
          {activeTab === 'pertanian' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-4">
                <div className="text-xs text-slate-500 mb-2">
                  Dikeluarkan setiap kali panen padi/palawija. Nishab pertanian adalah 5 wasaq = 653 kg gabah kering panen (GKP) atau setara 520 kg beras.
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Sistem Pengairan Sawah
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'irigasi', label: 'Irigasi Berbayar (5%)', desc: 'Pompa/Diesel/BBM' },
                      { id: 'tadah_hujan', label: 'Tadah Hujan (10%)', desc: 'Alami / Sungai' },
                      { id: 'campuran', label: 'Campuran (7.5%)', desc: 'Sebagian Pompa' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setTaniMetode(opt.id as any)}
                        className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                          taniMetode === opt.id
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xs">{opt.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Total Hasil Panen (Kg Gabah)
                    </label>
                    <input
                      type="number"
                      value={taniHasilKg}
                      onChange={(e) => setTaniHasilKg(Number(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Harga Gabah per Kg (Rp)
                    </label>
                    <input
                      type="number"
                      value={taniHargaPerKg}
                      onChange={(e) => setTaniHargaPerKg(Number(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Biaya Pupuk, Benih, & Buruh Panen (Rp)
                  </label>
                  <input
                    type="number"
                    value={taniBiayaOperasional}
                    onChange={(e) => setTaniBiayaOperasional(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Berdasarkan ijtihad kontemporer para ulama, biaya modal panen boleh dikurangkan sebelum zakat.
                  </p>
                </div>
              </div>

              {/* Result Column */}
              <div className="lg:col-span-5 bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-1">
                    Kalkulasi Zakat Panen
                  </span>
                  <div className="space-y-2 text-xs text-slate-600 mb-4 pb-4 border-b border-emerald-200/60">
                    <div className="flex justify-between">
                      <span>Total Hasil Panen:</span>
                      <span className="font-semibold text-slate-800">{taniHasilKg.toLocaleString('id-ID')} Kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nishab Minimal (5 Wasaq):</span>
                      <span className="font-medium text-slate-700">{taniNisabKg} Kg Gabah</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tarif Pengairan:</span>
                      <span className="font-medium text-slate-700">{taniRate * 100}%</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span>Status:</span>
                      {isTaniWajib ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Wajib Zakat Panen
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                          <AlertCircle className="w-3.5 h-3.5" /> Belum Capai Nishab (653 Kg)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-emerald-200 shadow-2xs mb-4">
                    <div className="text-xs text-slate-500">Nilai Zakat dalam Rupiah</div>
                    <div className="text-2xl font-extrabold text-emerald-800 tabular-nums">
                      {formatRupiah(zakatTaniAmount)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Atau senilai {zakatTaniKg} Kg Gabah Kering Panen
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const amountToPay = isTaniWajib ? zakatTaniAmount : 200000;
                    onSelectAmountForDonation('zakat_pertanian', amountToPay, 'Zakat Pertanian & Hasil Panen');
                    onClose();
                  }}
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>Salurkan Zakat Pertanian</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: PETERNAKAN */}
          {activeTab === 'peternakan' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-4">
                <div className="text-xs text-slate-500 mb-2">
                  Zakat hewan ternak berlaku untuk ternak yang digembalakan di padang rumput bebas (bukan pekerja sawah) dan telah dimiliki selama 1 tahun haul.
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Jenis Hewan Ternak
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setTernakJenis('kambing');
                        setTernakJumlah(50);
                      }}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                        ternakJenis === 'kambing'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-sm font-bold">Kambing / Domba</div>
                      <div className="text-xs text-slate-500">Nishab: Mulai 40 ekor</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTernakJenis('sapi');
                        setTernakJumlah(35);
                      }}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                        ternakJenis === 'sapi'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-sm font-bold">Sapi / Kerbau</div>
                      <div className="text-xs text-slate-500">Nishab: Mulai 30 ekor</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jumlah Populasi Ternak Dimiliki (Ekor)
                  </label>
                  <input
                    type="number"
                    value={ternakJumlah}
                    onChange={(e) => setTernakJumlah(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimasi Nilai Pasar per Ekor di Purwakarta (Rp)
                  </label>
                  <input
                    type="number"
                    value={ternakJenis === 'kambing' ? ternakHargaKambing : ternakHargaSapi}
                    onChange={(e) => {
                      const val = Number(e.target.value) || 0;
                      if (ternakJenis === 'kambing') setTernakHargaKambing(val);
                      else setTernakHargaSapi(val);
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Digunakan untuk opsi penyaluran zakat dalam bentuk konversi uang tunai via BAZNAS.
                  </p>
                </div>
              </div>

              {/* Result Column */}
              <div className="lg:col-span-5 bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-1">
                    Kewajiban Hewan Ternak
                  </span>
                  <div className="space-y-2 text-xs text-slate-600 mb-4 pb-4 border-b border-emerald-200/60">
                    <div className="flex justify-between">
                      <span>Total Populasi:</span>
                      <span className="font-semibold text-slate-800">{ternakJumlah} Ekor</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Batas Nishab:</span>
                      <span className="font-medium text-slate-700">
                        {ternakJenis === 'kambing' ? '40 Ekor' : '30 Ekor'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span>Status:</span>
                      {ternakCalculation.wajib ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Wajib Zakat Ternak
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                          <AlertCircle className="w-3.5 h-3.5" /> Belum Capai Nishab
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-emerald-200 shadow-2xs mb-4">
                    <div className="text-xs text-slate-500">Kewajiban Syariah</div>
                    <div className="text-sm font-bold text-emerald-950 mt-1">
                      {ternakCalculation.obligation}
                    </div>
                    {ternakCalculation.wajib && (
                      <div className="text-xl font-extrabold text-emerald-800 tabular-nums mt-2">
                        ≈ {formatRupiah(ternakCalculation.amount)}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const amountToPay = ternakCalculation.wajib ? ternakCalculation.amount : 500000;
                    onSelectAmountForDonation('zakat_peternakan', amountToPay, `Zakat Peternakan (${ternakJenis === 'kambing' ? 'Kambing' : 'Sapi'})`);
                    onClose();
                  }}
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>Salurkan Zakat Ternak</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: PERNIAGAAN */}
          {activeTab === 'perniagaan' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-4">
                <div className="text-xs text-slate-500 mb-2">
                  Zakat atas perputaran usaha dagang/komersial setelah genap haul 1 tahun dan mencapai nishab 85g emas ({formatRupiah(annualNisabMaal)}).
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nilai Persediaan Barang / Stok Dagang (Rp)
                  </label>
                  <input
                    type="number"
                    value={niagaStok}
                    onChange={(e) => setNiagaStok(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Uang Kas Usaha & Piutang Dagang Lancar (Rp)
                  </label>
                  <input
                    type="number"
                    value={niagaKasPiutang}
                    onChange={(e) => setNiagaKasPiutang(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hutang Dagang yang Jatuh Tempo Tahun Ini (Rp)
                  </label>
                  <input
                    type="number"
                    value={niagaHutang}
                    onChange={(e) => setNiagaHutang(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                  />
                </div>
              </div>

              {/* Result Column */}
              <div className="lg:col-span-5 bg-emerald-50/70 border border-emerald-200 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-1">
                    Hasil Zakat Perniagaan
                  </span>
                  <div className="space-y-2 text-xs text-slate-600 mb-4 pb-4 border-b border-emerald-200/60">
                    <div className="flex justify-between">
                      <span>Aset Bersih Usaha:</span>
                      <span className="font-semibold text-slate-800">{formatRupiah(niagaNetAsset)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nishab 85g Emas:</span>
                      <span className="font-medium text-slate-700">{formatRupiah(annualNisabMaal)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span>Status:</span>
                      {isNiagaWajib ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Wajib Zakat Dagang (2.5%)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                          <AlertCircle className="w-3.5 h-3.5" /> Belum Capai Nishab
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-emerald-200 shadow-2xs mb-4">
                    <div className="text-xs text-slate-500">Nominal Zakat Usaha (Tahunan)</div>
                    <div className="text-2xl font-extrabold text-emerald-800 tabular-nums">
                      {formatRupiah(zakatNiagaYearly)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Bisa dicicil {formatRupiah(zakatNiagaMonthly)} / bulan
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const amountToPay = isNiagaWajib ? zakatNiagaYearly : 300000;
                    onSelectAmountForDonation('zakat_perdagangan', amountToPay, 'Zakat Perniagaan / Usaha');
                    onClose();
                  }}
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>Salurkan Zakat Perniagaan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Notes */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>Kalkulasi zakat diawasi oleh Dewan Pengawas Syariah (DPS) BAZNAS Kabupaten Purwakarta</span>
          </div>
          <span className="font-medium text-slate-600">UU No. 23 Tahun 2011</span>
        </div>
      </div>
    </div>
  );
};
