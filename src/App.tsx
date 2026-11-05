import React, { useState, useEffect } from 'react';
import { INITIAL_USER, INITIAL_TRANSACTIONS } from './data/mockData';
import { MuzakkiUser, Transaction, ZisCategory } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProgramsSection } from './components/ProgramsSection';
import { TransparencySection } from './components/TransparencySection';
import { MuzakkiPortal } from './components/MuzakkiPortal';
import { ZakatCalculatorModal } from './components/ZakatCalculatorModal';
import { DonationModal } from './components/DonationModal';
import { KtpVerificationModal } from './components/KtpVerificationModal';
import { BszReceiptModal } from './components/BszReceiptModal';
import { WhatsAppNotificationModal } from './components/WhatsAppNotificationModal';
import { Footer } from './components/Footer';
import { Calculator, MessageCircle, HeartHandshake } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'home' | 'portal'>('home');

  // User state
  const [currentUser, setCurrentUser] = useState<MuzakkiUser | null>(() => {
    const saved = localStorage.getItem('baznas_pwk_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USER;
      }
    }
    return INITIAL_USER;
  });

  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('baznas_pwk_txs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_TRANSACTIONS;
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  // Modal visibility states
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isKtpVerifyOpen, setIsKtpVerifyOpen] = useState(false);
  const [receiptTx, setReceiptTx] = useState<Transaction | null>(null);
  const [waTx, setWaTx] = useState<Transaction | null>(null);

  // Donation form presets
  const [donationCategory, setDonationCategory] = useState<ZisCategory>('zakat_penghasilan');
  const [donationAmount, setDonationAmount] = useState<number>(500000);
  const [donationTitle, setDonationTitle] = useState<string>('Zakat Penghasilan Rutin');

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('baznas_pwk_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('baznas_pwk_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('baznas_pwk_txs', JSON.stringify(transactions));
  }, [transactions]);

  const handleOpenCalculator = () => {
    setIsCalculatorOpen(true);
  };

  const handleOpenDonation = (category?: ZisCategory, amount?: number, title?: string) => {
    if (category) setDonationCategory(category);
    if (amount) setDonationAmount(amount);
    if (title) setDonationTitle(title);
    setIsDonationOpen(true);
  };

  const handleSelectAmountFromCalculator = (category: ZisCategory, amount: number, label: string) => {
    setDonationCategory(category);
    setDonationAmount(amount);
    setDonationTitle(label);
    setIsDonationOpen(true);
  };

  const handlePaymentSuccess = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleUpdateUser = (updatedUser: MuzakkiUser) => {
    setCurrentUser(updatedUser);
  };

  const handleLogin = (user: MuzakkiUser) => {
    setCurrentUser(user);
    setActiveView('portal');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF9] text-slate-800 font-sans">
      {/* Navbar adhering to Top Bar Contract */}
      <Navbar
        onOpenCalculator={handleOpenCalculator}
        onOpenDonation={() => handleOpenDonation()}
        onOpenPortal={() => setActiveView('portal')}
        onOpenKtpVerify={() => setIsKtpVerifyOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        currentUser={currentUser}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'home' ? (
          <>
            <HeroSection
              onOpenDonation={() => handleOpenDonation()}
              onOpenCalculator={handleOpenCalculator}
              onOpenPortal={() => setActiveView('portal')}
            />

            <ProgramsSection
              onSelectProgram={(cat, amt, title) => handleOpenDonation(cat, amt, title)}
              onOpenCalculator={handleOpenCalculator}
            />

            <TransparencySection
              onDonateToProgram={(title) => handleOpenDonation('program_bantuan', 250000, title)}
            />
          </>
        ) : (
          <MuzakkiPortal
            currentUser={currentUser}
            transactions={transactions}
            onOpenKtpVerify={() => setIsKtpVerifyOpen(true)}
            onOpenDonation={() => handleOpenDonation()}
            onOpenReceipt={(tx) => setReceiptTx(tx)}
            onOpenWhatsAppPreview={(tx) => setWaTx(tx)}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onBackToHome={() => setActiveView('home')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenCalculator={handleOpenCalculator}
        onOpenDonation={() => handleOpenDonation()}
        onOpenPortal={() => setActiveView('portal')}
      />

      {/* Quick Action Floating Bar */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-2.5 items-end">
        <button
          onClick={handleOpenCalculator}
          className="px-4 py-2.5 bg-white hover:bg-slate-50 text-emerald-900 font-semibold text-xs rounded-full shadow-lg border border-emerald-200/80 flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
          title="Buka Kalkulator Zakat"
        >
          <Calculator className="w-4 h-4 text-emerald-700" />
          <span className="hidden sm:inline">Kalkulator Zakat</span>
        </button>

        <a
          href="https://api.whatsapp.com/send?phone=628112321444&text=Assalamu%27alaikum%20BAZNAS%20Purwakarta%2C%20saya%20ingin%20konsultasi%20mengenai%20penyaluran%20ZIS."
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full shadow-xl transition-transform hover:scale-110 flex items-center justify-center cursor-pointer"
          title="Hubungi WhatsApp Layanan BAZNAS Purwakarta (+62 811-2321-444)"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>

      {/* MODALS */}
      <ZakatCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onSelectAmountForDonation={handleSelectAmountFromCalculator}
      />

      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
        currentUser={currentUser}
        initialCategory={donationCategory}
        initialAmount={donationAmount}
        initialProgramTitle={donationTitle}
        onPaymentSuccess={handlePaymentSuccess}
        onOpenReceipt={(tx) => setReceiptTx(tx)}
        onOpenWhatsAppPreview={(tx) => setWaTx(tx)}
      />

      <KtpVerificationModal
        isOpen={isKtpVerifyOpen}
        onClose={() => setIsKtpVerifyOpen(false)}
        currentUser={currentUser}
        onUpdateUser={handleUpdateUser}
      />

      <BszReceiptModal
        isOpen={Boolean(receiptTx)}
        onClose={() => setReceiptTx(null)}
        transaction={receiptTx}
      />

      <WhatsAppNotificationModal
        isOpen={Boolean(waTx)}
        onClose={() => setWaTx(null)}
        transaction={waTx}
      />
    </div>
  );
}
