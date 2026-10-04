/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { EquipmentCatalog } from './components/EquipmentCatalog';
import { FleetTrackingMap } from './components/FleetTrackingMap';
import { CostCalculator } from './components/CostCalculator';
import { BookingManagement } from './components/BookingManagement';
import { ReservationModal } from './components/ReservationModal';
import { ProjectActivities } from './components/ProjectActivities';
import { InformationCenter } from './components/InformationCenter';
import { Footer } from './components/Footer';

import { Equipment, BookingRecord, MediaUpload } from './types/equipment';
import { EQUIPMENT_LIST } from './data/equipmentData';
import { INITIAL_BOOKINGS } from './data/initialBookings';

import { 
  ShieldCheck, 
  Truck, 
  Radio, 
  Wrench, 
  Award, 
  Clock, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  HardHat,
  Flame,
  PhoneCall,
  Video,
  Play,
  BookOpen
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_BOOKINGS);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [selectedEquipmentForBooking, setSelectedEquipmentForBooking] = useState<Equipment | null>(null);
  const [catalogFilterCategory, setCatalogFilterCategory] = useState<string>('all');

  const handleOpenBooking = (equipment?: Equipment) => {
    setSelectedEquipmentForBooking(equipment || null);
    setIsReservationOpen(true);
  };

  const handleAddBooking = (newBooking: BookingRecord) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleUpdateBookingVideos = (bookingId: string, updatedVideos: MediaUpload[]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, videoUploads: updatedVideos } : b))
    );
  };

  const handleSearchFromHero = (category: string, region: string) => {
    setCatalogFilterCategory(category);
    setActiveTab('catalog');
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Strict Top Bar Contract Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenBooking={() => handleOpenBooking()}
        activeBookingsCount={bookings.filter((b) => b.status === 'BEROPERASI' || b.status === 'MOBILISASI' || b.status === 'SPK_TERBIT').length}
      />

      {/* Main Viewport Routing */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            {/* Hero Section */}
            <HeroSection
              onSearch={handleSearchFromHero}
              onOpenLiveTracking={() => setActiveTab('tracking')}
              onOpenReservation={() => handleOpenBooking()}
              onOpenActivities={() => setActiveTab('activities')}
              onOpenInfo={() => setActiveTab('info')}
            />

            {/* Why Palugada: 4 Pillars of Heavy Equipment Excellence */}
            <section className="py-14 bg-[#0d121f] border-b border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <div className="text-xs font-mono uppercase tracking-wider text-pink-400 mb-1">
                    Mengapa Memilih Palugada
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Standar Operasional Kelas Dunia untuk Proyek Skala Besar
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2">
                    Kami memahami bahwa downtime 1 jam di lokasi proyek berarti kerugian jutaan rupiah. Seluruh sistem kami dirancang untuk keandalan tanpa kompromi.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="p-6 bg-[#111726] border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
                    <div className="w-12 h-12 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center mb-4">
                      <Truck className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">Armada Lowbed Sendiri</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Memiliki armada truk trailer flatbed & lowbed mandiri untuk mobilisasi unit cepat tanpa ketergantungan pihak ketiga.
                    </p>
                  </div>

                  <div className="p-6 bg-[#111726] border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                      <HardHat className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">Operator Berlisensi SIO</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      100% operator kami memiliki Surat Izin Operator (SIO) Kelas 1 Kemenaker RI dengan pengalaman ribuan jam kerja di medan ekstrem.
                    </p>
                  </div>

                  <div className="p-6 bg-[#111726] border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                      <Radio className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">Telemetri GPS Real-Time</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Setiap unit dipasangi sensor telemetri satelit untuk memantau jam kerja (HM), debit bahan bakar, dan titik koordinat secara transparan.
                    </p>
                  </div>

                  <div className="p-6 bg-[#111726] border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
                    <div className="w-12 h-12 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
                      <Wrench className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">Garansi Ganti Unit 1x24 Jam</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Jika terjadi breakdown mesin yang tidak dapat diperbaiki di lapangan dalam 12 jam, kami kirim unit pengganti tanpa biaya tambahan.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Catalog Preview */}
            <EquipmentCatalog
              onSelectEquipmentForBooking={(eq) => handleOpenBooking(eq)}
              selectedCategoryFilter={catalogFilterCategory}
            />

            {/* GPS Live Tracking Teaser Banner */}
            <section className="py-14 bg-[#080c14] border-b border-slate-800 relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-[#111726] border border-pink-500/30 rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="space-y-4 max-w-xl">
                    <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <span>Sistem Radar Telemetri Satelit Aktif</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                      Pantau Produktivitas Alat Berat Anda Kapan Saja & Dimana Saja
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Fitur pelacakan armada real-time Palugada memberikan visibilitas penuh terhadap konsumsi bahan bakar solar, posisi koordinat GPS, status RPM mesin, dan timesheet hour meter harian.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => setActiveTab('tracking')}
                        className="px-6 py-3.5 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded transition-colors flex items-center gap-2 shadow-lg shadow-pink-600/30"
                      >
                        <span>Buka Radar GPS Armada Sekarang</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Visual Telemetry Mini Mockup */}
                  <div className="w-full lg:w-96 bg-[#0c121e] border border-slate-700 rounded-xl p-5 font-mono text-xs space-y-3 shadow-inner">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="text-pink-400 font-bold">PLG-EXC-08 (CAT 320D3)</span>
                      <span className="text-emerald-400 text-[10px]">● OPERATIONAL</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Lokasi:</span>
                      <span className="text-white">Tol IKN Segmen 3B</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Hour Meter:</span>
                      <span className="text-white font-bold">2,480.4 HM</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Sisa Solar:</span>
                      <span className="text-emerald-400 font-bold">74% (185 Liter)</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Putaran Mesin:</span>
                      <span className="text-pink-400">1,780 RPM (Normal)</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Kegiatan & Video Teaser Section */}
            <section className="py-14 bg-[#0a0e18] border-b border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-pink-400 mb-1">
                      <Video className="w-3.5 h-3.5" />
                      <span>Transparansi Operasional Lapangan</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      Kegiatan Proyek & Dokumentasi Video Operasional
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Pantau video langsung mobilisasi tronton lowbed, pengerukan cut & fill di IKN, serta pengangkatan girder crane di berbagai mega proyek.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => setActiveTab('activities')}
                      className="px-4 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs uppercase rounded transition-colors flex items-center gap-2 shadow-lg shadow-pink-600/25"
                    >
                      <span>Lihat Semua Video Kegiatan</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 space-y-3 hover:border-pink-500/40 transition-all">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="px-2 py-0.5 bg-pink-500/10 text-pink-400 rounded font-bold">PLG-EXC-08</span>
                      <span className="text-slate-400">Tol IKN Segmen 3B</span>
                    </div>
                    <h3 className="font-bold text-white text-sm">Galian Parit Cut & Fill Lereng Bukit IKN</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      Operasi excavator CAT 320D3 swing bucket lancar. Jam operasi bertambah +6.8 HM dengan konsumsi solar 98 liter.
                    </p>
                    <button
                      onClick={() => setActiveTab('activities')}
                      className="text-pink-400 hover:text-pink-300 text-xs font-bold font-mono flex items-center gap-1 pt-1"
                    >
                      <Play className="w-3.5 h-3.5 fill-pink-400" />
                      <span>Putar Video Lapangan</span>
                    </button>
                  </div>

                  <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 space-y-3 hover:border-pink-500/40 transition-all">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="px-2 py-0.5 bg-pink-500/10 text-pink-400 rounded font-bold">PLG-DOZ-03</span>
                      <span className="text-slate-400">Stockpile Smelter Morowali</span>
                    </div>
                    <h3 className="font-bold text-white text-sm">Unloading Bulldozer D85ESS via Lowbed 60T</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      Survei tanjakan kritis 14 derajat aman, ramp pelat baja terpasang sempurna tanpa hambatan kabel.
                    </p>
                    <button
                      onClick={() => setActiveTab('activities')}
                      className="text-pink-400 hover:text-pink-300 text-xs font-bold font-mono flex items-center gap-1 pt-1"
                    >
                      <Play className="w-3.5 h-3.5 fill-pink-400" />
                      <span>Putar Video Lapangan</span>
                    </button>
                  </div>

                  <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 space-y-3 hover:border-pink-500/40 transition-all">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="px-2 py-0.5 bg-pink-500/10 text-pink-400 rounded font-bold">PLG-CRN-02</span>
                      <span className="text-slate-400">Jembatan Sungai Barito</span>
                    </div>
                    <h3 className="font-bold text-white text-sm">Ereksi Girder Beton 40 Ton Malam Hari</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      Tandem mobile crane 50T mengangkat bentang 32 meter pada jendela waktu lalu lintas sepi. Rigging checklist 100% lulus.
                    </p>
                    <button
                      onClick={() => setActiveTab('activities')}
                      className="text-pink-400 hover:text-pink-300 text-xs font-bold font-mono flex items-center gap-1 pt-1"
                    >
                      <Play className="w-3.5 h-3.5 fill-pink-400" />
                      <span>Putar Video Lapangan</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Fast Cost Calculator Teaser */}
            <CostCalculator
              onProceedToBooking={(eq) => handleOpenBooking(eq)}
            />

            {/* Trusted Clients / Projects */}
            <section className="py-12 bg-[#0b0f17] border-b border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-xs font-mono uppercase tracking-widest text-slate-400 mb-8">
                  Dipercaya oleh BUMN & Kontraktor Swasta Terkemuka Indonesia
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-center text-center">
                  <div className="p-3 bg-slate-900/60 rounded border border-slate-800 text-xs font-mono font-bold text-slate-300">
                    PT Waskita Karya
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded border border-slate-800 text-xs font-mono font-bold text-slate-300">
                    Wijaya Karya (WIKA)
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded border border-slate-800 text-xs font-mono font-bold text-slate-300">
                    Adhi Karya Tbk
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded border border-slate-800 text-xs font-mono font-bold text-slate-300">
                    Hutama Karya
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded border border-slate-800 text-xs font-mono font-bold text-slate-300">
                    PT PP (Persero)
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded border border-slate-800 text-xs font-mono font-bold text-slate-300">
                    Brantas Abipraya
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'catalog' && (
          <EquipmentCatalog
            onSelectEquipmentForBooking={(eq) => handleOpenBooking(eq)}
            selectedCategoryFilter={catalogFilterCategory}
          />
        )}

        {activeTab === 'tracking' && (
          <FleetTrackingMap />
        )}

        {activeTab === 'activities' && (
          <ProjectActivities onOpenReservation={() => handleOpenBooking()} />
        )}

        {activeTab === 'info' && (
          <InformationCenter onOpenBooking={() => handleOpenBooking()} />
        )}

        {activeTab === 'calculator' && (
          <CostCalculator
            onProceedToBooking={(eq) => handleOpenBooking(eq)}
          />
        )}

        {activeTab === 'bookings' && (
          <BookingManagement
            bookings={bookings}
            onOpenNewBooking={() => handleOpenBooking()}
            onUpdateBookingVideos={handleUpdateBookingVideos}
          />
        )}
      </main>

      {/* Online Reservation Modal */}
      {isReservationOpen && (
        <ReservationModal
          initialEquipment={selectedEquipmentForBooking}
          onClose={() => setIsReservationOpen(false)}
          onSubmitBooking={(newRecord) => {
            handleAddBooking(newRecord);
          }}
        />
      )}

      {/* Corporate Industrial Footer */}
      <Footer />
    </div>
  );
}
