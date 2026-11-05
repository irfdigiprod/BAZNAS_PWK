import React, { useState } from 'react';
import { X, ShieldCheck, Upload, CheckCircle2, AlertCircle, Scan, FileText, Check } from 'lucide-react';
import { PURWAKARTA_DISTRICTS } from '../data/mockData';
import { MuzakkiUser } from '../types';

interface KtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: MuzakkiUser | null;
  onUpdateUser: (updated: MuzakkiUser) => void;
}

export const KtpVerificationModal: React.FC<KtpVerificationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
}) => {
  const [nik, setNik] = useState<string>(currentUser?.nik || '3214011508820003');
  const [fullName, setFullName] = useState<string>(currentUser?.name || '');
  const [district, setDistrict] = useState<string>(currentUser?.district || 'Purwakarta');
  const [address, setAddress] = useState<string>(currentUser?.address || 'Jl. Veteran No. 42, Kel. Nagri Kaler');
  const [ktpImage, setKtpImage] = useState<string>(
    currentUser?.ktpPhotoUrl || ''
  );
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  // Validate NIK
  const validateNikFormat = (val: string) => {
    const clean = val.replace(/\D/g, '');
    if (clean.length !== 16) {
      return 'NIK harus terdiri dari 16 digit angka.';
    }
    return null;
  };

  const handleSimulateKtpUpload = () => {
    // Generate a clean stylized electronic KTP preview data URL
    const svgKtp = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250">
      <rect width="400" height="250" rx="12" fill="%2367E8F9" stroke="%230284C7" stroke-width="3"/>
      <rect x="15" y="15" width="370" height="30" fill="%230284C7" rx="4"/>
      <text x="200" y="35" font-family="sans-serif" font-size="12" font-weight="bold" fill="white" text-anchor="middle">PROVINSI JAWA BARAT - KABUPATEN PURWAKARTA</text>
      <text x="30" y="75" font-family="monospace" font-size="14" font-weight="bold" fill="%230F172A">NIK : ${nik || '3214011508820003'}</text>
      <text x="30" y="105" font-family="sans-serif" font-size="11" fill="%231E293B">Nama : ${(fullName || 'MUZAKKI BAZNAS PURWAKARTA').toUpperCase()}</text>
      <text x="30" y="125" font-family="sans-serif" font-size="11" fill="%231E293B">Tempat/Tgl Lahir : PURWAKARTA, 15-08-1982</text>
      <text x="30" y="145" font-family="sans-serif" font-size="11" fill="%231E293B">Alamat : ${address || 'JL. VETERAN NO. 42'}</text>
      <text x="30" y="165" font-family="sans-serif" font-size="11" fill="%231E293B">Kecamatan : ${district.toUpperCase()}</text>
      <text x="30" y="185" font-family="sans-serif" font-size="11" fill="%231E293B">Agama : ISLAM</text>
      <rect x="290" y="70" width="85" height="110" rx="4" fill="%2394A3B8" stroke="%23475569" stroke-width="1.5"/>
      <circle cx="332" cy="110" r="22" fill="%23CBD5E1"/>
      <rect x="312" y="135" width="40" height="35" rx="6" fill="%23CBD5E1"/>
      <rect x="290" y="190" width="85" height="25" fill="%23E2E8F0" rx="2"/>
      <text x="332" y="206" font-family="sans-serif" font-size="9" fill="%230369A1" text-anchor="middle">TERVERIFIKASI</text>
    </svg>`;
    setKtpImage(svgKtp);
    setErrorMsg('');
  };

  const handleStartVerification = () => {
    const error = validateNikFormat(nik);
    if (error) {
      setErrorMsg(error);
      return;
    }
    if (!fullName.trim()) {
      setErrorMsg('Nama lengkap sesuai KTP wajib diisi.');
      return;
    }

    setErrorMsg('');
    setIsScanning(true);
    setScanStep('Melakukan ekstraksi OCR data e-KTP...');

    setTimeout(() => {
      setScanStep('Menghubungkan ke Verifikasi Kependudukan Kemendagri / Dukcapil...');
    }, 900);

    setTimeout(() => {
      setScanStep('Mencocokkan NIK Wilayah Kabupaten Purwakarta (Kode 3214)...');
    }, 1800);

    setTimeout(() => {
      setIsScanning(false);
      setSuccessMsg('Verifikasi KTP Berhasil! Data kependudukan tervalidasi 100%.');

      if (currentUser) {
        onUpdateUser({
          ...currentUser,
          name: fullName,
          nik: nik.replace(/\D/g, ''),
          district: district,
          address: address,
          ktpVerified: true,
          ktpVerificationStatus: 'verified',
          ktpPhotoUrl: ktpImage || 'verified_mock',
        });
      }
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-emerald-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Verifikasi Identitas KTP Muzakki</h2>
              <p className="text-xs text-emerald-200">
                Keabsahan data kependudukan resmi untuk penerbitan Bukti Setor Zakat (BSZ) & Pengurang Pajak
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {successMsg ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-emerald-900">Muzakki Terverifikasi Resmi</h3>
                <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  Selamat, data e-KTP Anda telah berhasil divalidasi oleh sistem BAZNAS Kabupaten Purwakarta. Setiap pembayaran zakat Anda kini otomatis diterbitkan Bukti Setor Zakat (BSZ) berkekuatan hukum.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Terdaftar:</span>
                  <span className="font-bold text-slate-800">{fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor Induk Kependudukan:</span>
                  <span className="font-mono font-bold text-slate-800">{nik}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Wilayah / Kecamatan:</span>
                  <span className="font-medium text-slate-800">Kec. {district}, Kab. Purwakarta</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Legalitas Pengurang Pajak (PKP):</span>
                  <span className="text-emerald-700 font-bold">Memenuhi Syarat UU No. 23/2011</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-sm transition-colors cursor-pointer"
              >
                Kembali ke Portal
              </button>
            </div>
          ) : (
            <>
              {/* Info banner */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex gap-3 items-start">
                <FileText className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold">Manfaat Verifikasi KTP:</span> Bukti Setor Zakat (BSZ) resmi BAZNAS Kabupaten Purwakarta dapat digunakan secara sah sebagai bukti pengurang Penghasilan Kena Pajak (PKP) pada pelaporan SPT Tahunan di Kantor Pajak (KPP Pratama Purwakarta).
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Induk Kependudukan (NIK 16 Digit) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={nik}
                    onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
                    placeholder="Contoh: 321401..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono tracking-wider focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">Kode wilayah 3214 = Kab. Purwakarta, Jawa Barat</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Sesuai KTP <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nama lengkap tanpa singkatan"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kecamatan Domisili di Purwakarta <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none cursor-pointer"
                  >
                    {PURWAKARTA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        Kecamatan {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Lengkap Sesuai KTP
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Jl. / RT / RW / Kelurahan"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
                  />
                </div>
              </div>

              {/* Upload or Mock KTP Section */}
              <div className="border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Scan className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Foto / Scan e-KTP Asli</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleSimulateKtpUpload}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold underline cursor-pointer"
                  >
                    Gunakan Contoh e-KTP Purwakarta
                  </button>
                </div>

                {ktpImage ? (
                  <div className="relative rounded-lg overflow-hidden border border-slate-300 bg-white p-2">
                    <img
                      src={ktpImage}
                      alt="Pratinjau KTP"
                      className="w-full max-h-48 object-contain rounded"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded shadow">
                        <Check className="w-3 h-3" /> Siap Diverifikasi
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={handleSimulateKtpUpload}
                    className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-lg p-6 text-center cursor-pointer transition-colors bg-white"
                  >
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-600 font-medium">
                      Klik untuk mengunggah foto e-KTP atau klik <span className="text-emerald-700 font-bold">Gunakan Contoh</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">Format JPG, PNG, atau PDF (Maks. 5 MB)</p>
                  </div>
                )}
              </div>

              {/* Scanning status indicator */}
              {isScanning && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-emerald-900 font-semibold">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                      <span>{scanStep}</span>
                    </span>
                    <span>Memproses...</span>
                  </div>
                  <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full w-2/3 animate-pulse rounded-full" />
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isScanning}
                  onClick={handleStartVerification}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white font-semibold text-xs rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isScanning ? 'Memverifikasi...' : 'Verifikasi Data KTP Sekarang'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
