import React, { useState } from 'react';
import { ShieldCheck, Clock, MapPin, Search, ChevronRight, Navigation, Wrench, FileCheck, CheckCircle2, Video, BookOpen } from 'lucide-react';
import heroExcavatorImg from '../assets/images/hero_excavator_mining_1791044668712.jpg';
import { INDONESIAN_REGIONS } from '../data/equipmentData';

interface HeroSectionProps {
  onSearch: (category: string, region: string) => void;
  onOpenLiveTracking: () => void;
  onOpenReservation: () => void;
  onOpenActivities?: () => void;
  onOpenInfo?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onOpenLiveTracking,
  onOpenReservation,
  onOpenActivities,
  onOpenInfo,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>(INDONESIAN_REGIONS[0].city);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(selectedCategory, selectedRegion);
  };

  return (
    <section className="relative overflow-hidden bg-[#0a0e17] border-b border-slate-800">
      {/* Background Image with High-Contrast Dark Gradient Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroExcavatorImg}
          alt="Heavy machinery construction site at sunset"
          className="w-full h-full object-cover object-center opacity-35 filter brightness-90 contrast-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-[#0a0e17]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e17] via-[#0a0e17]/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-mono font-semibold uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-pink-400 animate-pulse"></span>
              Sistem Sewa Alat Berat & Telemetri GPS Terintegrasi
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] text-balance">
              Solusi Terlengkap Alat Berat Proyek <span className="text-pink-500">& Tambang</span> Pontianak
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              <strong className="text-white font-semibold">PALUGADA ALAT BERAT PONTIANAK — Apa Lu Butuh Gua Ada.</strong> Pusat rental excavator, bulldozer, mobile crane, vibro roller, dan dump truck di Pontianak & seluruh Kalimantan Barat dengan operator berlisensi SIO Kemenaker, surat ijin alat (SIA) sah, serta pelacakan telemetri GPS aktif 24/7.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenReservation}
                className="px-6 py-3.5 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-sm uppercase tracking-wider rounded transition-all shadow-lg shadow-pink-500/25 active:scale-95 flex items-center gap-2"
              >
                <span>Reservasi Unit Sekarang</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenLiveTracking}
                className="px-5 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-sm rounded border border-slate-700 transition-all flex items-center gap-2.5 backdrop-blur-sm"
              >
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>Pantau Radar GPS Armada</span>
              </button>

              {onOpenActivities && (
                <button
                  onClick={onOpenActivities}
                  className="px-4 py-3.5 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold text-xs sm:text-sm rounded border border-slate-800 hover:border-pink-500/50 transition-all flex items-center gap-2 backdrop-blur-sm"
                >
                  <Video className="w-4 h-4 text-pink-400" />
                  <span>Video Kegiatan Proyek</span>
                </button>
              )}

              {onOpenInfo && (
                <button
                  onClick={onOpenInfo}
                  className="px-4 py-3.5 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold text-xs sm:text-sm rounded border border-slate-800 hover:border-pink-500/50 transition-all flex items-center gap-2 backdrop-blur-sm"
                >
                  <BookOpen className="w-4 h-4 text-pink-400" />
                  <span>Pusat Regulasi K3</span>
                </button>
              )}
            </div>

            {/* Trust Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80 text-xs">
              <div className="space-y-1">
                <span className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">180+</span>
                <p className="text-slate-400">Unit Siap Mobilisasi</p>
              </div>
              <div className="space-y-1">
                <span className="text-xl sm:text-2xl font-bold font-mono text-pink-400 tabular-nums">100%</span>
                <p className="text-slate-400">Sertifikat SIA & SIO Sah</p>
              </div>
              <div className="space-y-1">
                <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums">&lt; 24 Jam</span>
                <p className="text-slate-400">Garansi Unit Pengganti</p>
              </div>
              <div className="space-y-1">
                <span className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">24 / 7</span>
                <p className="text-slate-400">Live GPS & Mekanik Site</p>
              </div>
            </div>
          </div>

          {/* Quick Search & Instant Booking Calculator Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#111726]/90 border border-slate-700/80 rounded-xl p-6 shadow-2xl backdrop-blur-md relative">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white">Cari Unit & Cek Ketersediaan</h3>
                  <p className="text-xs text-slate-400">Pilih alat berat dan lokasi proyek Anda</p>
                </div>
                <div className="w-9 h-9 rounded bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center">
                  <Search className="w-4 h-4" />
                </div>
              </div>

              <form onSubmit={handleQuickSearch} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Kategori Alat Berat
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-[#0a0e17] border border-slate-700 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="all">Semua Kategori (Excavator, Dozer, Crane, dll)</option>
                    <option value="excavator">Excavator Kelas 20T / Breaker</option>
                    <option value="bulldozer">Bulldozer D8R / D6R Ripper</option>
                    <option value="crane">Mobile Crane 25T - 55T Rough Terrain</option>
                    <option value="wheel-loader">Wheel Loader 3.0 m³ High Lift</option>
                    <option value="compactor">Vibro Roller Compactor 12T</option>
                    <option value="dump-truck">Dump Truck Tronton 24 m³</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Wilayah / Kota Proyek</span>
                    <span className="text-[11px] text-pink-400 font-mono">Mob-Demob Otomatis</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full bg-[#0a0e17] border border-slate-700 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500"
                    >
                      {INDONESIAN_REGIONS.map((reg) => (
                        <option key={reg.city} value={reg.city}>
                          {reg.city} ({reg.province})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Estimasi Durasi
                    </label>
                    <select className="w-full bg-[#0a0e17] border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500">
                      <option value="monthly">Bulanan (200 Jam/Shift)</option>
                      <option value="weekly">Mingguan (7 Hari)</option>
                      <option value="daily">Harian (Min. 50 Jam)</option>
                      <option value="longterm">Kontrak Tahunan (Mining)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Paket Sewa
                    </label>
                    <select className="w-full bg-[#0a0e17] border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-pink-500">
                      <option value="all-in">All-In + Operator SIO + Solar</option>
                      <option value="with-operator">Unit + Operator SIO</option>
                      <option value="bare">Lepas Kunci (Unit Saja)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-sm uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-md shadow-pink-500/25"
                  >
                    <Search className="w-4 h-4" />
                    <span>Cari Unit Tersedia & Hitung Tarif</span>
                  </button>
                </div>
              </form>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Kondisi Unit Prima (HM Terkalibrasi)
                </span>
                <span className="font-mono text-slate-500">PO-REF: INSTANT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
