import React, { useState } from 'react';
import { MuzakkiUser, Transaction, ZisCategory } from '../types';
import { ShieldCheck, ShieldAlert, ArrowLeft, Download, Eye, Plus, Search, Filter, Phone, Mail, MapPin, CheckCircle2, MessageSquare, LogIn, LogOut, FileCheck } from 'lucide-react';

interface MuzakkiPortalProps {
  currentUser: MuzakkiUser | null;
  transactions: Transaction[];
  onOpenKtpVerify: () => void;
  onOpenDonation: () => void;
  onOpenReceipt: (tx: Transaction) => void;
  onOpenWhatsAppPreview: (tx: Transaction) => void;
  onLogin: (user: MuzakkiUser) => void;
  onLogout: () => void;
  onBackToHome: () => void;
}

export const MuzakkiPortal: React.FC<MuzakkiPortalProps> = ({
  currentUser,
  transactions,
  onOpenKtpVerify,
  onOpenDonation,
  onOpenReceipt,
  onOpenWhatsAppPreview,
  onLogin,
  onLogout,
  onBackToHome,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Login form state if currentUser is null
  const [loginEmail, setLoginEmail] = useState<string>('ahmad.supriatna@gmail.com');
  const [loginPhone, setLoginPhone] = useState<string>('081298765432');
  const [loginName, setLoginName] = useState<string>('H. Ahmad Supriatna');

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSimulatedLogin = () => {
    const user: MuzakkiUser = {
      id: 'usr_pwk_' + Math.floor(100 + Math.random() * 900),
      name: loginName,
      email: loginEmail,
      phone: loginPhone,
      nik: '3214011508820003',
      ktpVerified: true,
      ktpVerificationStatus: 'verified',
      address: 'Jl. Veteran No. 42, Kel. Nagri Kaler',
      district: 'Purwakarta',
      npwp: '09.234.567.8-409.000',
      joinedAt: '2025-01-10',
    };
    onLogin(user);
  };

  // If not logged in, render the login view
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-800 font-semibold mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center mx-auto">
              <LogIn className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Portal Muzakki BAZNAS</h2>
            <p className="text-xs text-slate-500">
              Masuk untuk memantau riwayat transaksi zakat, unduh Bukti Setor Zakat (BSZ), dan verifikasi KTP.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Muzakki</label>
              <input
                type="text"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Terdaftar</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp Aktif</label>
              <input
                type="tel"
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            <button
              onClick={handleSimulatedLogin}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-sm transition-all cursor-pointer text-sm"
            >
              Masuk ke Portal Muzakki
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter transactions
  const userTransactions = transactions.filter((t) => {
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory;
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bszNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalSpent = transactions.reduce((sum, t) => (t.status === 'berhasil' ? sum + t.amount : sum), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-800 font-semibold mb-1 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda Utama</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Portal Layanan Muzakki</h1>
          <p className="text-xs text-slate-500">
            Dasbor resmi pemantauan setoran ZIS dan arsip Bukti Setor Zakat (BSZ) Kabupaten Purwakarta
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDonation}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tunaikan ZIS Baru</span>
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Muzakki Profile Card & Summary KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Digital Muzakki Identity Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">
                  KARTU DIGITAL MUZAKKI
                </span>
                <div className="text-lg font-extrabold tracking-tight mt-0.5">{currentUser.name}</div>
                <div className="text-xs text-emerald-200 font-mono mt-0.5">
                  ID: {currentUser.id.toUpperCase()}
                </div>
              </div>

              {currentUser.ktpVerified ? (
                <div className="flex items-center gap-1 bg-emerald-700/80 border border-emerald-400 text-emerald-100 px-2.5 py-1 rounded-full text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>KTP Terverifikasi</span>
                </div>
              ) : (
                <button
                  onClick={onOpenKtpVerify}
                  className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer shadow-sm"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Verifikasi KTP</span>
                </button>
              )}
            </div>

            <div className="space-y-1.5 text-xs text-emerald-100 pt-2 border-t border-emerald-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span className="truncate">{currentUser.address}, Kec. {currentUser.district}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span className="font-mono">{currentUser.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span className="truncate">{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span className="font-mono">NIK: {currentUser.nik || 'Belum diisi'}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-emerald-800/80 flex items-center justify-between text-[11px] text-emerald-300">
            <span>BAZNAS KABUPATEN PURWAKARTA</span>
            <span>UU No. 23 / 2011</span>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <span className="text-xs font-medium text-slate-500">Total ZIS Tertunaikan</span>
            <div className="text-2xl font-extrabold text-emerald-900 font-mono mt-2">
              {formatRupiah(totalSpent)}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium mt-1">Tercatat di BAZNAS Purwakarta</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <span className="text-xs font-medium text-slate-500">Jumlah Transaksi Resmi</span>
            <div className="text-2xl font-extrabold text-slate-800 font-mono mt-2">
              {transactions.length} <span className="text-sm font-normal text-slate-500">Transaksi</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1">Semua berstatus Lunas</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <span className="text-xs font-medium text-slate-500">Legalitas Pengurang Pajak</span>
            <div className="text-sm font-bold text-emerald-800 mt-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Memenuhi Syarat PKP</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1">Sesuai PP No. 60/2010</span>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Filter & Search Controls */}
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Riwayat Transaksi & Bukti Setor Zakat (BSZ)
            </h3>
            <span className="text-xs text-slate-500">({userTransactions.length})</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari No. BSZ / Program..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Filter Category Dropdown */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">Semua Kategori</option>
              <option value="zakat_penghasilan">Zakat Penghasilan</option>
              <option value="zakat_maal">Zakat Maal</option>
              <option value="zakat_pertanian">Zakat Pertanian</option>
              <option value="infak_umum">Infak & Sedekah</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                <th className="py-3 px-4">No. Transaksi / BSZ</th>
                <th className="py-3 px-4">Program & Jenis Dana</th>
                <th className="py-3 px-4 text-right">Nominal</th>
                <th className="py-3 px-4">Waktu Setor</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Aksi Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {userTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                    Belum ada riwayat transaksi yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                userTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-slate-800">{tx.id}</div>
                      <div className="text-[11px] text-emerald-800 font-semibold">{tx.bszNumber}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{tx.categoryLabel}</div>
                      <div className="text-[11px] text-slate-500">{tx.programTitle}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-900 text-sm">
                      {formatRupiah(tx.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                      {tx.paidAt || tx.createdAt}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Berhasil
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onOpenReceipt(tx)}
                          className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] rounded-md border border-emerald-200 flex items-center gap-1 transition-colors cursor-pointer"
                          title="Lihat & Cetak BSZ Resmi"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Bukti BSZ</span>
                        </button>
                        <button
                          onClick={() => onOpenWhatsAppPreview(tx)}
                          className="px-2.5 py-1.5 bg-[#DCF8C6] hover:bg-[#c9efad] text-[#075E54] font-semibold text-[11px] rounded-md border border-[#25D366]/40 flex items-center gap-1 transition-colors cursor-pointer"
                          title="Lihat Notifikasi WhatsApp"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WA Alert</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Setiap lembar Bukti Setor Zakat (BSZ) di atas sah dilampirkan dalam Formulir SPT 1770 / 1770S Wajib Pajak Orang Pribadi.</span>
          <span className="font-semibold text-emerald-800">BAZNAS Purwakarta Official</span>
        </div>
      </div>
    </div>
  );
};
