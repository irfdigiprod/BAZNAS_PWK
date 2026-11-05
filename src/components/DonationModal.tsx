import React, { useState, useEffect } from 'react';
import { X, Check, CreditCard, QrCode, Building2, Heart, ArrowRight, ShieldCheck, Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MuzakkiUser, PaymentMethod, Transaction, ZisCategory } from '../types';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: MuzakkiUser | null;
  initialCategory?: ZisCategory;
  initialAmount?: number;
  initialProgramTitle?: string;
  onPaymentSuccess: (transaction: Transaction) => void;
  onOpenReceipt: (transaction: Transaction) => void;
  onOpenWhatsAppPreview: (transaction: Transaction) => void;
}

const CATEGORY_OPTIONS: { id: ZisCategory; label: string; group: 'zakat' | 'infak' }[] = [
  { id: 'zakat_penghasilan', label: 'Zakat Penghasilan / Profesi', group: 'zakat' },
  { id: 'zakat_maal', label: 'Zakat Maal (Harta / Tabungan)', group: 'zakat' },
  { id: 'zakat_pertanian', label: 'Zakat Pertanian (Panen)', group: 'zakat' },
  { id: 'zakat_peternakan', label: 'Zakat Peternakan', group: 'zakat' },
  { id: 'zakat_perdagangan', label: 'Zakat Perniagaan / Usaha', group: 'zakat' },
  { id: 'zakat_fitrah', label: 'Zakat Fitrah', group: 'zakat' },
  { id: 'infak_umum', label: 'Infak Umum BAZNAS Purwakarta', group: 'infak' },
  { id: 'sedekah_subuh', label: 'Sedekah Subuh Berkah', group: 'infak' },
  { id: 'program_bantuan', label: 'Program Purwakarta Cerdas & Peduli', group: 'infak' },
];

const PRESET_AMOUNTS = [50000, 100000, 250000, 500000, 1000000, 2500000];

export const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialCategory = 'zakat_penghasilan',
  initialAmount = 500000,
  initialProgramTitle = 'Zakat Penghasilan Rutin',
  onPaymentSuccess,
  onOpenReceipt,
  onOpenWhatsAppPreview,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Nominal & Category, 2: Muzakki & Payment, 3: Success
  const [category, setCategory] = useState<ZisCategory>(initialCategory);
  const [amount, setAmount] = useState<number>(initialAmount);
  const [customAmountStr, setCustomAmountStr] = useState<string>(initialAmount.toString());
  const [programTitle, setProgramTitle] = useState<string>(initialProgramTitle);

  // Form Muzakki
  const [name, setName] = useState<string>(currentUser?.name || 'H. Ahmad Supriatna');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '081298765432');
  const [email, setEmail] = useState<string>(currentUser?.email || 'ahmad.supriatna@gmail.com');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [doa, setDoa] = useState<string>('Semoga berkah dan mensucikan rezeki sekeluarga.');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);

  useEffect(() => {
    if (initialCategory) setCategory(initialCategory);
    if (initialAmount) {
      setAmount(initialAmount);
      setCustomAmountStr(initialAmount.toString());
    }
    if (initialProgramTitle) setProgramTitle(initialProgramTitle);
  }, [initialCategory, initialAmount, initialProgramTitle]);

  if (!isOpen) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleAmountPreset = (val: number) => {
    setAmount(val);
    setCustomAmountStr(val.toString());
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const num = Number(raw) || 0;
    setAmount(num);
    setCustomAmountStr(raw);
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
        now.getHours()
      )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const txId = `BZ-PWK-${now.getFullYear()}-${randomNum}`;
      const bszCode = `BSZ-PWK/${now.getFullYear()}/XI/${randomNum}`;

      const categoryObj = CATEGORY_OPTIONS.find((c) => c.id === category);
      const catLabel = categoryObj ? categoryObj.label : 'Zakat & Infak';

      const newTx: Transaction = {
        id: txId,
        category,
        categoryLabel: catLabel,
        programTitle: programTitle || catLabel,
        amount,
        muzakkiName: isAnonymous ? 'Hamba Allah' : name,
        muzakkiPhone: phone,
        muzakkiEmail: email,
        muzakkiNik: currentUser?.nik,
        isAnonymous,
        doa,
        paymentMethod,
        status: 'berhasil',
        createdAt: timeStr,
        paidAt: timeStr,
        bszNumber: bszCode,
        whatsappNotified: true,
        whatsappMessage: `Pembayaran ${catLabel} sebesar ${formatRupiah(
          amount
        )} telah BERHASIL diproses. BSZ Resmi: ${bszCode}.`,
      };

      setCompletedTx(newTx);
      setIsProcessing(false);
      setStep(3);
      onPaymentSuccess(newTx);

      // Trigger Celebration Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#047857', '#10B981', '#F59E0B', '#34D399'],
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-emerald-800 text-white p-5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Penyaluran Zakat, Infak & Sedekah</h2>
            <p className="text-xs text-emerald-200">
              BAZNAS Kabupaten Purwakarta — Aman Syar&apos;i, Aman Regulasi, Aman NKRI
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-700/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 py-2.5 text-xs font-semibold text-slate-500 justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step >= 1 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              1
            </span>
            <span className={step >= 1 ? 'text-emerald-900 font-bold' : ''}>Pilih ZIS & Nominal</span>
          </div>
          <div className="w-8 h-px bg-slate-300" />
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step >= 2 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              2
            </span>
            <span className={step >= 2 ? 'text-emerald-900 font-bold' : ''}>Data & Pembayaran</span>
          </div>
          <div className="w-8 h-px bg-slate-300" />
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 3 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}
            >
              3
            </span>
            <span className={step === 3 ? 'text-emerald-900 font-bold' : ''}>Selesai & BSZ</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* STEP 1: Select Type & Amount */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Pilih Kategori Penyaluran
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CATEGORY_OPTIONS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setCategory(c.id);
                        setProgramTitle(c.label);
                      }}
                      className={`p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        category === c.id
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{c.label}</span>
                        {category === c.id && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Pilih atau Masukkan Nominal (Rp)
                </label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {PRESET_AMOUNTS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleAmountPreset(p)}
                      className={`py-2 px-3 rounded-lg border text-xs font-semibold tabular-nums cursor-pointer transition-all ${
                        amount === p
                          ? 'border-emerald-600 bg-emerald-700 text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {formatRupiah(p)}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-400">Rp</span>
                  <input
                    type="text"
                    value={customAmountStr}
                    onChange={handleCustomAmountChange}
                    placeholder="Ketik nominal lain..."
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-base font-bold font-mono text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                  />
                </div>
              </div>

              {/* Fiqh / Niat Quote */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-xs">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Lafadz Niat Tunaikan Zakat:</span>
                </div>
                <div className="font-arabic text-sm text-emerald-950">
                  نَوَيْتُ أَنْ أُخْرِجَ زَكَاةَ مَالِي فَرْضًا لِلّٰهِ تَعَالَى
                </div>
                <div className="text-[11px] text-slate-600 italic">
                  &ldquo;Nawaitu an ukhrija zakaata maali fardhan lillaahi ta&apos;aala.&rdquo;
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={amount < 10000}
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-semibold text-xs rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Lanjutkan ke Pembayaran</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Muzakki Details & Payment Method */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Muzakki Form */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Data Muzakki / Donatur
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Hamba Allah (Anonim)</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      disabled={isAnonymous}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Nomor WhatsApp (Untuk Notifikasi Otomatis) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Contoh: 081298765432"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Email (Untuk Salinan PDF BSZ)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Doa / Harapan (Opsional)
                    </label>
                    <input
                      type="text"
                      value={doa}
                      onChange={(e) => setDoa(e.target.value)}
                      placeholder="Doa untuk keluarga/rezeki..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Metode Pembayaran Online
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'qris', label: 'QRIS Instan', icon: QrCode, badge: 'Semua E-Wallet/Bank' },
                    { id: 'va_bsi', label: 'BSI Virtual Account', icon: Building2, badge: 'Bank Syariah Indonesia' },
                    { id: 'va_bjb_syariah', label: 'bank bjb Syariah', icon: Building2, badge: 'Bank Daerah Jabar' },
                    { id: 'va_mandiri', label: 'Mandiri VA', icon: CreditCard, badge: 'Konfirmasi Instan' },
                    { id: 'va_bri', label: 'BRI Virtual Account', icon: CreditCard, badge: 'Konfirmasi Instan' },
                    { id: 'va_bca', label: 'BCA Virtual Account', icon: CreditCard, badge: 'Konfirmasi Instan' },
                  ].map((m) => {
                    const IconComp = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          paymentMethod === m.id
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <IconComp className="w-4 h-4 text-emerald-700" />
                          <span className="text-xs font-bold">{m.label}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block truncate">{m.badge}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive QRIS simulation preview if selected */}
              {paymentMethod === 'qris' && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-4">
                  <div className="bg-white p-2 rounded-lg border border-slate-300 shrink-0">
                    <svg className="w-20 h-20" viewBox="0 0 100 100">
                      <rect x="5" y="5" width="30" height="30" fill="#047857" />
                      <rect x="10" y="10" width="20" height="20" fill="white" />
                      <rect x="15" y="15" width="10" height="10" fill="#047857" />
                      <rect x="65" y="5" width="30" height="30" fill="#047857" />
                      <rect x="70" y="10" width="20" height="20" fill="white" />
                      <rect x="75" y="15" width="10" height="10" fill="#047857" />
                      <rect x="5" y="65" width="30" height="30" fill="#047857" />
                      <rect x="10" y="70" width="20" height="20" fill="white" />
                      <rect x="15" y="75" width="10" height="10" fill="#047857" />
                      <rect x="45" y="45" width="12" height="12" fill="#D97706" />
                      <rect x="42" y="12" width="12" height="15" fill="#047857" />
                      <rect x="65" y="55" width="25" height="10" fill="#047857" />
                    </svg>
                  </div>
                  <div className="text-xs space-y-1">
                    <div className="font-bold text-slate-800">QRIS BAZNAS Kabupaten Purwakarta (NMID: ID10202688921)</div>
                    <div className="text-slate-500">
                      Dapat dipindai menggunakan aplikasi BCA, Mandiri, BSI Mobile, GoPay, OVO, Dana, LinkAja, atau ShopeePay.
                    </div>
                    <div className="font-bold text-emerald-800 font-mono text-sm">{formatRupiah(amount)}</div>
                  </div>
                </div>
              )}

              {/* Total summary */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-600">Total Nominal Pembayaran:</div>
                  <div className="text-xl font-black text-emerald-900 font-mono">{formatRupiah(amount)}</div>
                </div>
                <div className="text-right text-[11px] text-emerald-800 font-medium">
                  <div>Bebas Biaya Admin</div>
                  <div className="text-slate-500">Notifikasi WA Otomatis Aktif</div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  disabled={isProcessing || !phone.trim()}
                  onClick={handleProcessPayment}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white font-semibold text-xs rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>{isProcessing ? 'Memproses Transaksi...' : 'Konfirmasi & Bayar Sekarang'}</span>
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Success & WhatsApp Trigger */}
          {step === 3 && completedTx && (
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Heart className="w-8 h-8 fill-emerald-600 text-emerald-600" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-emerald-950">Alhamdulillah, Pembayaran Berhasil!</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Jazakumullahu khairan katsiran atas kepercayaan Bpk/Ibu menyalurkan ZIS melalui BAZNAS Kabupaten Purwakarta. Dana Anda siap disalurkan kepada mustahik yang berhak.
                </p>
              </div>

              {/* Transaction Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor Transaksi:</span>
                  <span className="font-mono font-bold text-slate-800">{completedTx.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor BSZ Resmi:</span>
                  <span className="font-mono font-bold text-emerald-800">{completedTx.bszNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Program:</span>
                  <span className="font-semibold text-slate-800">{completedTx.categoryLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nominal:</span>
                  <span className="font-mono font-bold text-emerald-900 text-sm">{formatRupiah(completedTx.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">No. WhatsApp Muzakki:</span>
                  <span className="font-mono text-slate-800">{completedTx.muzakkiPhone}</span>
                </div>
              </div>

              {/* Automatic WhatsApp Notification Highlight */}
              <div className="p-3.5 bg-[#DCF8C6]/60 border border-[#25D366]/40 rounded-xl max-w-md mx-auto text-left text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Notifikasi WhatsApp Otomatis Terkirim!</div>
                    <div className="text-[11px] text-slate-600">
                      Rincian transaksi & link BSZ telah dikirimkan ke nomor {completedTx.muzakkiPhone}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onOpenWhatsAppPreview(completedTx)}
                  className="px-3 py-1.5 bg-[#075E54] hover:bg-[#128C7E] text-white text-[11px] font-bold rounded-md whitespace-nowrap cursor-pointer transition-colors"
                >
                  Lihat Pesan WA
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  onClick={() => {
                    onOpenReceipt(completedTx);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Lihat & Unduh Bukti Setor Zakat (BSZ)</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
