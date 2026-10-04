import React, { useState } from 'react';
import { Truck, PhoneCall, CalendarCheck2, ShieldCheck, MapPin, Menu, X, Video, BookOpen } from 'lucide-react';

export type NavTab = 'home' | 'catalog' | 'tracking' | 'activities' | 'info' | 'calculator' | 'bookings';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenBooking: () => void;
  activeBookingsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenBooking,
  activeBookingsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHotlineModal, setShowHotlineModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0b0f17]/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Zone 1: Single text element wordmark */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
                className="group text-left flex items-center gap-2.5 focus-visible:outline-none"
              >
                <div className="w-10 h-10 rounded bg-pink-500 flex items-center justify-center text-white font-extrabold shadow-lg shadow-pink-500/25 group-hover:bg-pink-400 transition-colors">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xl sm:text-2xl font-extrabold tracking-wider text-white uppercase block leading-none">
                    PALUGADA<span className="text-pink-500">.</span>
                  </span>
                  <span className="text-[10px] tracking-widest text-slate-400 font-mono uppercase block mt-1">
                    ALAT BERAT PONTIANAK
                  </span>
                </div>
              </button>
            </div>

            {/* Zone 2: Clean navigation links */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs xl:text-sm font-semibold">
              <button
                onClick={() => setActiveTab('home')}
                className={`transition-colors py-1 ${
                  activeTab === 'home'
                    ? 'text-pink-400 border-b-2 border-pink-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Beranda
              </button>

              <button
                onClick={() => setActiveTab('catalog')}
                className={`transition-colors py-1 ${
                  activeTab === 'catalog'
                    ? 'text-pink-400 border-b-2 border-pink-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Katalog Alat
              </button>

              <button
                onClick={() => setActiveTab('tracking')}
                className={`transition-colors py-1 flex items-center gap-1.5 ${
                  activeTab === 'tracking'
                    ? 'text-pink-400 border-b-2 border-pink-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                GPS Live
              </button>

              <button
                onClick={() => setActiveTab('activities')}
                className={`transition-colors py-1 flex items-center gap-1.5 ${
                  activeTab === 'activities'
                    ? 'text-pink-400 border-b-2 border-pink-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Kegiatan & Video</span>
              </button>

              <button
                onClick={() => setActiveTab('info')}
                className={`transition-colors py-1 flex items-center gap-1.5 ${
                  activeTab === 'info'
                    ? 'text-pink-400 border-b-2 border-pink-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Pusat Informasi</span>
              </button>

              <button
                onClick={() => setActiveTab('calculator')}
                className={`transition-colors py-1 ${
                  activeTab === 'calculator'
                    ? 'text-pink-400 border-b-2 border-pink-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Kalkulator
              </button>

              <button
                onClick={() => setActiveTab('bookings')}
                className={`transition-colors py-1 relative ${
                  activeTab === 'bookings'
                    ? 'text-pink-400 border-b-2 border-pink-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Pesanan Saya
                {activeBookingsCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-mono font-bold bg-pink-500 text-white rounded">
                    {activeBookingsCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Zone 3: Primary Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowHotlineModal(true)}
                className="hidden xl:flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-pink-400 transition-colors px-3 py-2 rounded border border-slate-800 hover:border-slate-700 bg-slate-900/50"
              >
                <PhoneCall className="w-3.5 h-3.5 text-pink-400" />
                <span>Dispatch 24/7</span>
              </button>

              <button
                onClick={onOpenBooking}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-pink-600 hover:bg-pink-500 rounded transition-all shadow-md shadow-pink-500/25 active:scale-95 whitespace-nowrap"
              >
                <CalendarCheck2 className="w-4 h-4" />
                <span>Reservasi Unit</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0e1422] border-b border-slate-800 px-4 pt-2 pb-6 space-y-2 text-xs">
            <button
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className={`w-full text-left py-2 px-3 rounded font-medium ${
                activeTab === 'home' ? 'bg-pink-500/10 text-pink-400' : 'text-slate-300'
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => { setActiveTab('catalog'); setMobileMenuOpen(false); }}
              className={`w-full text-left py-2 px-3 rounded font-medium ${
                activeTab === 'catalog' ? 'bg-pink-500/10 text-pink-400' : 'text-slate-300'
              }`}
            >
              Katalog Alat Berat
            </button>
            <button
              onClick={() => { setActiveTab('tracking'); setMobileMenuOpen(false); }}
              className={`w-full text-left py-2 px-3 rounded font-medium flex items-center justify-between ${
                activeTab === 'tracking' ? 'bg-pink-500/10 text-pink-400' : 'text-slate-300'
              }`}
            >
              <span>GPS Live Fleet Tracking</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            </button>
            <button
              onClick={() => { setActiveTab('activities'); setMobileMenuOpen(false); }}
              className={`w-full text-left py-2 px-3 rounded font-medium flex items-center gap-2 ${
                activeTab === 'activities' ? 'bg-pink-500/10 text-pink-400' : 'text-slate-300'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Kegiatan & Video Lapangan</span>
            </button>
            <button
              onClick={() => { setActiveTab('info'); setMobileMenuOpen(false); }}
              className={`w-full text-left py-2 px-3 rounded font-medium flex items-center gap-2 ${
                activeTab === 'info' ? 'bg-pink-500/10 text-pink-400' : 'text-slate-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Pusat Informasi & Regulasi K3</span>
            </button>
            <button
              onClick={() => { setActiveTab('calculator'); setMobileMenuOpen(false); }}
              className={`w-full text-left py-2 px-3 rounded font-medium ${
                activeTab === 'calculator' ? 'bg-pink-500/10 text-pink-400' : 'text-slate-300'
              }`}
            >
              Kalkulator Sewa & Mob-Demob
            </button>
            <button
              onClick={() => { setActiveTab('bookings'); setMobileMenuOpen(false); }}
              className={`w-full text-left py-2 px-3 rounded font-medium flex items-center justify-between ${
                activeTab === 'bookings' ? 'bg-pink-500/10 text-pink-400' : 'text-slate-300'
              }`}
            >
              <span>Pesanan Saya & SPK</span>
              {activeBookingsCount > 0 && (
                <span className="px-2 py-0.5 text-xs bg-pink-500 text-white font-mono font-bold rounded">
                  {activeBookingsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => { setShowHotlineModal(true); setMobileMenuOpen(false); }}
              className="w-full text-left py-2 px-3 rounded text-slate-300 flex items-center gap-2 border border-slate-700"
            >
              <PhoneCall className="w-4 h-4 text-pink-400" />
              <span>Hubungi Hotline Dispatch 24/7</span>
            </button>
          </div>
        )}
      </header>

      {/* Hotline Modal */}
      {showHotlineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121927] border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setShowHotlineModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded bg-pink-500/20 text-pink-400 flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Pusat Bantuan & Dispatch 24 Jam</h3>
                <p className="text-xs text-slate-400">Palugada Alat Berat Pontianak</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              Tim mekanik tanggap darurat dan dispatch lowbed siaga 24 jam untuk melayani kebutuhan proyek di Pontianak, Kubu Raya, Mempawah, dan seluruh Kalimantan Barat.
            </p>
            <div className="space-y-3 font-mono text-sm">
              <div className="p-3 bg-slate-900 rounded border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-sans">Hotline Dispatch & Sewa Darurat</span>
                  <span className="text-pink-400 font-bold">+62 811-920-8800 (WhatsApp)</span>
                </div>
                <a
                  href="https://wa.me/628119208800?text=Halo%20Palugada%20Alat%20Berat%2C%20saya%20butuh%20sewa%20unit%20segera"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-sans font-semibold"
                >
                  Chat WA
                </a>
              </div>
              <div className="p-3 bg-slate-900 rounded border border-slate-800">
                <span className="text-xs text-slate-400 block font-sans">Pool Pusat Jakarta & Bodetabek</span>
                <span className="text-white">Jl. Raya Cakung Cilincing KM 3.5, Jakarta Utara</span>
              </div>
              <div className="p-3 bg-slate-900 rounded border border-slate-800">
                <span className="text-xs text-slate-400 block font-sans">Pool Hub IKN & Kalimantan</span>
                <span className="text-white">Kawasan Industri Kariangau KM 12, Balikpapan</span>
              </div>
            </div>
            <button
              onClick={() => setShowHotlineModal(false)}
              className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium text-sm transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
};
