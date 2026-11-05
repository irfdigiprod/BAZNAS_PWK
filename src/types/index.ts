export type ZisCategory =
  | 'zakat_penghasilan'
  | 'zakat_maal'
  | 'zakat_fitrah'
  | 'zakat_pertanian'
  | 'zakat_peternakan'
  | 'zakat_perdagangan'
  | 'infak_umum'
  | 'sedekah_subuh'
  | 'program_bantuan';

export type PaymentMethod =
  | 'qris'
  | 'va_bsi'
  | 'va_bjb_syariah'
  | 'va_mandiri'
  | 'va_bri'
  | 'va_bca'
  | 'transfer_manual';

export type TransactionStatus =
  | 'menunggu_pembayaran'
  | 'diverifikasi'
  | 'berhasil'
  | 'gagal';

export interface MuzakkiUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  nik?: string;
  ktpVerified: boolean;
  ktpVerificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  ktpPhotoUrl?: string;
  address?: string;
  district?: string;
  npwp?: string;
  joinedAt: string;
}

export interface Transaction {
  id: string; // e.g. BZ-PWK-2026-8921
  category: ZisCategory;
  categoryLabel: string;
  programTitle: string;
  amount: number;
  muzakkiName: string;
  muzakkiPhone: string;
  muzakkiEmail: string;
  muzakkiNik?: string;
  isAnonymous: boolean;
  doa?: string;
  paymentMethod: PaymentMethod;
  paymentProofUrl?: string;
  status: TransactionStatus;
  createdAt: string;
  paidAt?: string;
  bszNumber: string; // Bukti Setor Zakat Official Code
  whatsappNotified: boolean;
  whatsappMessage?: string;
}

export type PillarProgram =
  | 'purwakarta_cerdas'
  | 'purwakarta_sehat'
  | 'purwakarta_peduli'
  | 'purwakarta_makmur'
  | 'purwakarta_taqwa';

export interface DistributionItem {
  id: string;
  pillar: PillarProgram;
  pillarLabel: string;
  title: string;
  description: string;
  amount: number;
  recipientCount: number;
  recipientUnit: string;
  district: string;
  village: string;
  date: string;
  imageUrl: string;
  auditRef: string;
}

export interface ZakatRates {
  goldPricePerGram: number; // in IDR
  silverPricePerGram: number; // in IDR
  ricePricePerKg: number; // in IDR
  grainPricePerKg: number; // in IDR
  nisabGoldGrams: number; // 85 grams
  nisabGrainKg: number; // 653 kg
}
