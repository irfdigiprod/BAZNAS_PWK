import React from 'react';
import { X, Printer, ShieldCheck, Download, CheckCircle2 } from 'lucide-react';
import { Transaction } from '../types';
import { BaznasLogo } from './BaznasLogo';

interface BszReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export const BszReceiptModal: React.FC<BszReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  if (!isOpen || !transaction) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
        {/* Top Control Bar */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold tracking-wide">
              Bukti Setor Zakat (BSZ) Resmi — BAZNAS Kab. Purwakarta
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Unduh PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Sheet */}
        <div id="printable-receipt" className="p-8 overflow-y-auto bg-white font-sans text-slate-900 space-y-6">
          {/* Certificate Header */}
          <div className="border-b-2 border-emerald-900 pb-5">
            <div className="flex items-center justify-between">
              <BaznasLogo size="lg" />
              <div className="text-right text-[11px] text-slate-500">
                <div className="font-bold text-slate-800 text-xs">BADAN AMIL ZAKAT NASIONAL</div>
                <div>KABUPATEN PURWAKARTA</div>
                <div>Jl. Veteran No. 1, Nagri Kaler, Kec. Purwakarta</div>
                <div>Jawa Barat 41115 · Telp. (0264) 8221444</div>
              </div>
            </div>

            <div className="text-center mt-4">
              <h1 className="text-lg font-extrabold tracking-wide text-emerald-950 uppercase">
                BUKTI SETOR ZAKAT (BSZ)
              </h1>
              <div className="text-xs font-mono font-bold text-emerald-800 mt-0.5">
                Nomor: {transaction.bszNumber}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Sah sebagai Pengurang Penghasilan Kena Pajak (PKP) berdasarkan UU No. 23 Tahun 2011 & PP No. 60 Tahun 2010
              </div>
            </div>
          </div>

          {/* Muzakki & Payment Info Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-800 border-b border-slate-200 pb-1 uppercase tracking-wider text-[11px]">
                Data Muzakki / Penyetor
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nama:</span>
                <span className="font-semibold text-slate-900">{transaction.muzakkiName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">NIK:</span>
                <span className="font-mono text-slate-800">{transaction.muzakkiNik || '3214011508820003'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">No. Kontak:</span>
                <span className="font-mono text-slate-800">{transaction.muzakkiPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status Verifikasi:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Terverifikasi KTP
                </span>
              </div>
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-800 border-b border-slate-200 pb-1 uppercase tracking-wider text-[11px]">
                Data Transaksi Setoran
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">No. Transaksi:</span>
                <span className="font-mono font-bold text-slate-900">{transaction.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Jenis Dana:</span>
                <span className="font-medium text-slate-800">{transaction.categoryLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Metode Bayar:</span>
                <span className="font-mono uppercase text-slate-800">{transaction.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Waktu Bayar:</span>
                <span className="font-mono text-slate-800">{transaction.paidAt || transaction.createdAt}</span>
              </div>
            </div>
          </div>

          {/* Amount Box */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-xl text-center space-y-1">
            <div className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">
              Jumlah Dana yang Disetorkan
            </div>
            <div className="text-3xl font-extrabold text-emerald-950 font-mono">
              {formatRupiah(transaction.amount)}
            </div>
            <div className="text-xs text-slate-600 italic">
              Status: <span className="text-emerald-700 font-bold uppercase">Lunas & Telah Masuk Kas BAZNAS Purwakarta</span>
            </div>
          </div>

          {/* Doa Amil Zakat */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 text-center space-y-1.5">
            <div className="font-arabic text-lg text-emerald-950">
              آجَرَكَ اللهُ فِيْمَا أَعْطَيْتَ، وَبَارَكَ فِيْمَا أَبْقَيْتَ، وَجَعَلَهُ لَكَ طَهُوْرًا
            </div>
            <p className="text-[11px] text-slate-600 italic max-w-lg mx-auto">
              &ldquo;Semoga Allah memberikan pahala atas apa yang telah engkau berikan, memberkahi apa yang tersisa, dan menjadikannya pembersih bagimu.&rdquo;
            </p>
          </div>

          {/* Signature & Digital Stamp */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {/* QR Code Validation */}
            <div className="flex items-center gap-3">
              <svg className="w-20 h-20 bg-slate-100 p-1 rounded border border-slate-300" viewBox="0 0 100 100">
                <rect x="10" y="10" width="30" height="30" fill="#047857" />
                <rect x="15" y="15" width="20" height="20" fill="white" />
                <rect x="20" y="20" width="10" height="10" fill="#047857" />
                <rect x="60" y="10" width="30" height="30" fill="#047857" />
                <rect x="65" y="15" width="20" height="20" fill="white" />
                <rect x="70" y="20" width="10" height="10" fill="#047857" />
                <rect x="10" y="60" width="30" height="30" fill="#047857" />
                <rect x="15" y="65" width="20" height="20" fill="white" />
                <rect x="20" y="70" width="10" height="10" fill="#047857" />
                <rect x="45" y="45" width="12" height="12" fill="#D97706" />
                <rect x="45" y="20" width="10" height="15" fill="#047857" />
                <rect x="65" y="55" width="25" height="10" fill="#047857" />
                <rect x="55" y="75" width="30" height="15" fill="#047857" />
              </svg>
              <div className="text-[10px] text-slate-500">
                <div className="font-bold text-slate-700">QR Validasi Dokumen</div>
                <div>Pindai untuk memverifikasi</div>
                <div>keabsahan BSZ di database</div>
                <div className="text-emerald-700 font-mono">baznas.purwakartakab.go.id</div>
              </div>
            </div>

            {/* Official Digital Stamp & Signature */}
            <div className="text-center relative">
              <div className="text-xs text-slate-600 mb-1">
                Purwakarta, {transaction.paidAt?.split(' ')[0] || '01 November 2026'}
              </div>
              <div className="text-xs font-bold text-slate-800">
                BAZNAS KABUPATEN PURWAKARTA
              </div>
              <div className="h-14 flex items-center justify-center relative">
                {/* Simulated Digital Stamp */}
                <div className="w-20 h-20 rounded-full border-2 border-emerald-700/60 rotate-[-12deg] flex items-center justify-center text-[8px] font-bold text-emerald-800/80 uppercase tracking-tighter text-center p-1 absolute">
                  BAZNAS KABUPATEN PURWAKARTA ★ RESMI LUNAS ★
                </div>
                <div className="font-serif italic font-bold text-slate-700 text-sm z-10">
                  H. Sanusi
                </div>
              </div>
              <div className="text-xs font-bold text-slate-800 underline">
                Drs. H. Sanusi, M.Ag.
              </div>
              <div className="text-[10px] text-slate-500">
                Ketua BAZNAS Kabupaten Purwakarta
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
