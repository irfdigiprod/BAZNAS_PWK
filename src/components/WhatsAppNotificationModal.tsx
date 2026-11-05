import React, { useState } from 'react';
import { X, Send, CheckCheck, ExternalLink, Copy, Check, MessageSquare, Phone } from 'lucide-react';
import { Transaction } from '../types';

interface WhatsAppNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export const WhatsAppNotificationModal: React.FC<WhatsAppNotificationModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !transaction) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const cleanPhone = (phone: string) => {
    let p = phone.replace(/\D/g, '');
    if (p.startsWith('0')) {
      p = '62' + p.substring(1);
    }
    return p;
  };

  const recipientPhone = cleanPhone(transaction.muzakkiPhone || '081298765432');

  const waMessage = `*KONFIRMASI PEMBAYARAN ZIS - BAZNAS KABUPATEN PURWAKARTA*

Assalamu'alaikum Wr. Wb.
Yth. Bpk/Ibu *${transaction.isAnonymous ? 'Hamba Allah' : transaction.muzakkiName}*,

Alhamdulillah, pembayaran ZIS Anda telah *BERHASIL* diverifikasi oleh sistem BAZNAS Kabupaten Purwakarta:

━━━━━━━━━━━━━━━━━━━━
📄 *No. Transaksi:* ${transaction.id}
📜 *No. BSZ Resmi:* ${transaction.bszNumber}
🏷 *Program:* ${transaction.categoryLabel}
💰 *Nominal:* ${formatRupiah(transaction.amount)}
💳 *Metode:* ${transaction.paymentMethod.toUpperCase()}
⏰ *Waktu:* ${transaction.paidAt || transaction.createdAt}
━━━━━━━━━━━━━━━━━━━━

🤲 *Doa Amil BAZNAS Purwakarta:*
_"Ajarakallahu fiima a'thaita, wa baaraka fiima abqaita, wa ja'alahu laka thahuura."_
(Semoga Allah memberikan pahala atas apa yang telah engkau berikan, memberkahi apa yang tersisa, dan menjadikannya pembersih bagimu).

Unduh Bukti Setor Zakat (BSZ) resmi yang sah sebagai pengurang pajak (UU No. 23/2011) di:
https://baznas-purwakarta.go.id/bsz/${transaction.id}

Layanan Muzakki BAZNAS Purwakarta:
Telp/WA: +62 811-2321-444
Kantor: Jl. Veteran No. 1, Kab. Purwakarta, Jawa Barat
Wassalamu'alaikum Wr. Wb.`;

  const waSendUrl = `https://api.whatsapp.com/send?phone=${recipientPhone}&text=${encodeURIComponent(
    waMessage
  )}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(waMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-[#EFEAE2] w-full max-w-lg rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[92vh]">
        {/* WhatsApp Mobile Top Bar */}
        <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full bg-emerald-800 border border-white/20 flex items-center justify-center font-bold text-sm text-white">
              BP
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm leading-tight">BAZNAS Kab. Purwakarta</span>
                <span className="bg-[#128C7E] text-[10px] px-1 rounded text-white font-medium">Official</span>
              </div>
              <p className="text-[11px] text-emerald-200">Notifikasi Otomatis (+62 811-2321-444)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 text-emerald-100 hover:text-white hover:bg-emerald-800/60 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* WhatsApp Chat Body */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-[#EFEAE2] min-h-[350px]">
          <div className="text-center my-2">
            <span className="bg-[#E1D7C6] text-slate-700 text-[11px] font-medium px-3 py-1 rounded-md shadow-2xs">
              HARI INI
            </span>
          </div>

          {/* Incoming Message Bubble */}
          <div className="flex justify-start">
            <div className="bg-white rounded-lg rounded-tl-none p-3.5 max-w-[92%] shadow-sm border border-black/5 text-slate-800 text-xs leading-relaxed space-y-2">
              <div className="font-bold text-[#075E54] border-b pb-1 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>NOTIFIKASI RESMI TRANSAKSI ZIS</span>
              </div>

              <p>
                Assalamu&apos;alaikum Wr. Wb.<br />
                Yth. Bpk/Ibu <span className="font-semibold">{transaction.isAnonymous ? 'Hamba Allah' : transaction.muzakkiName}</span>,
              </p>

              <div className="bg-emerald-50/80 p-2.5 rounded border border-emerald-200/80 space-y-1 font-mono text-[11px]">
                <div className="text-emerald-900 font-bold flex justify-between font-sans text-xs">
                  <span>PEMBAYARAN BERHASIL</span>
                  <span>{transaction.paidAt?.split(' ')[1] || '09:33'}</span>
                </div>
                <div className="text-slate-600">ID: {transaction.id}</div>
                <div className="text-slate-600">BSZ: {transaction.bszNumber}</div>
                <div className="text-slate-800 font-bold font-sans">
                  {transaction.categoryLabel}
                </div>
                <div className="text-emerald-800 font-extrabold text-sm font-sans">
                  {formatRupiah(transaction.amount)}
                </div>
              </div>

              <div className="text-[11px] italic text-slate-600 border-l-2 border-emerald-600 pl-2">
                &ldquo;Ajarakallahu fiima a&apos;thaita, wa baaraka fiima abqaita, wa ja&apos;alahu laka thahuura.&rdquo;
              </div>

              <p className="text-[11px] text-slate-600">
                Bukti Setor Zakat (BSZ) resmi diterbitkan sebagai pengurang Penghasilan Kena Pajak (PKP) sesuai UU No. 23 Tahun 2011.
              </p>

              <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400 pt-1">
                <span>{transaction.paidAt?.split(' ')[1] || '09:33'}</span>
                <CheckCheck className="w-3.5 h-3.5 text-[#34B7F1]" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="bg-white p-4 border-t border-slate-200 space-y-2 shrink-0">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>Terkirim ke WhatsApp Muzakki:</span>
            </span>
            <span className="font-mono font-bold text-slate-800">{transaction.muzakkiPhone}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleCopy}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin!' : 'Salin Pesan'}</span>
            </button>

            <a
              href={waSendUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Buka di WhatsApp</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
