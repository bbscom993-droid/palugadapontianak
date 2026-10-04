import React, { useState } from 'react';
import { Equipment, BookingFormState, BookingRecord, MediaUpload } from '../types/equipment';
import { EQUIPMENT_LIST, INDONESIAN_REGIONS } from '../data/equipmentData';
import { formatIDR } from '../utils/formatters';
import { 
  X, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Truck, 
  UserCheck, 
  FileText, 
  Fuel, 
  Clock, 
  Building2, 
  ChevronRight, 
  ChevronLeft,
  QrCode,
  Printer,
  Download,
  Video,
  Play,
  Upload,
  Trash2,
  Eye,
  Plus
} from 'lucide-react';

interface ReservationModalProps {
  initialEquipment?: Equipment | null;
  onClose: () => void;
  onSubmitBooking: (booking: BookingRecord) => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  initialEquipment,
  onClose,
  onSubmitBooking,
}) => {
  const defaultEquip = initialEquipment || EQUIPMENT_LIST[0];
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedEquip, setSelectedEquip] = useState<Equipment>(defaultEquip);

  // Form State
  const [rentalPackage, setRentalPackage] = useState<'lepas-kunci' | 'operator-sio' | 'all-in-solar'>('operator-sio');
  const [durationDays, setDurationDays] = useState<number>(14);
  const [workingShifts, setWorkingShifts] = useState<1 | 2>(1);
  const [startDate, setStartDate] = useState<string>('2026-04-10');
  const [selectedRegionIndex, setSelectedRegionIndex] = useState<number>(0);
  const [projectAddress, setProjectAddress] = useState<string>('Jalan Raya Akses Proyek KM 12');
  const [projectName, setProjectName] = useState<string>('Proyek Pembangunan Infrastruktur Kawasan');
  const [companyName, setCompanyName] = useState<string>('PT Nusantara Graha Konstruksi');
  const [picName, setPicName] = useState<string>('Budi Santoso, S.T.');
  const [picPhone, setPicPhone] = useState<string>('0812-3456-7890');
  const [picEmail, setPicEmail] = useState<string>('procurement@nusantaragraha.co.id');
  const [notes, setNotes] = useState<string>('Lahan tanah kering berbatu, akses jalan lebar dapat dilalui truk lowbed tronton.');

  // Video Upload & Site Survey State
  const [uploadedVideos, setUploadedVideos] = useState<MediaUpload[]>([
    {
      id: 'vid-init-01',
      name: 'Survey-Akses-Jalan-Gerbang-Proyek.mp4',
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      sizeMb: 14.8,
      uploadedAt: 'Hari ini',
      category: 'survey_akses',
      notes: 'Jalan aspal hotmix lebar 6 meter, bebas hambatan portal dan kabel listrik rendah.',
    }
  ]);
  const [activeVideoModal, setActiveVideoModal] = useState<MediaUpload | null>(null);
  const [roadWidthMeters, setRoadWidthMeters] = useState<string>('6.5');
  const [bridgeCapacityTon, setBridgeCapacityTon] = useState<string>('40');

  // Submitted success state
  const [completedBooking, setCompletedBooking] = useState<BookingRecord | null>(null);

  const currentRegion = INDONESIAN_REGIONS[selectedRegionIndex];

  // Price Calculation Breakdown
  const calculateCosts = () => {
    // Rental cost base: dailyRate * durationDays * (shifts === 2 ? 1.85 : 1)
    const baseRental = selectedEquip.dailyRate * durationDays * (workingShifts === 2 ? 1.85 : 1);
    
    // Operator cost:
    let operatorCost = 0;
    if (rentalPackage === 'operator-sio') {
      operatorCost = 350000 * durationDays * workingShifts;
    } else if (rentalPackage === 'all-in-solar') {
      // Operator + fuel
      operatorCost = 750000 * durationDays * workingShifts;
    }

    // Mob-Demob cost (Round trip trailer flatbed/lowbed)
    const mobDemobCost = currentRegion.defaultRateMob;

    const subtotal = baseRental + operatorCost + mobDemobCost;
    const taxPpn = Math.round(subtotal * 0.11);
    const total = subtotal + taxPpn;

    return {
      baseRental,
      operatorCost,
      mobDemobCost,
      subtotal,
      taxPpn,
      total,
    };
  };

  const costs = calculateCosts();

  const handleConfirmReservation = () => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `SPK/PLG/2026/04-${randomCode}`;
    const newRecord: BookingRecord = {
      id: `bkg-${Date.now()}`,
      bookingRef,
      createdAt: new Date().toISOString().split('T')[0],
      equipmentName: selectedEquip.name,
      equipmentModel: selectedEquip.model,
      equipmentCategory: selectedEquip.category,
      unitCodeAssigned: `PLG-${selectedEquip.category.substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 89)}`,
      companyName,
      picName,
      picPhone,
      projectName,
      projectLocation: `${currentRegion.city}, ${currentRegion.province}`,
      startDate,
      durationDays,
      workingShifts,
      rentalPackage,
      status: 'SPK_TERBIT',
      rentalCost: costs.baseRental,
      mobDemobCost: costs.mobDemobCost,
      operatorCost: costs.operatorCost,
      taxPpn: costs.taxPpn,
      totalCost: costs.total,
      hmStart: Math.floor(1200 + Math.random() * 800),
      hmCurrent: Math.floor(1200 + Math.random() * 800),
      operatorName: rentalPackage === 'lepas-kunci' ? 'Mandiri Kontraktor' : 'Rian Hermawan (SIO Kelas 1)',
      operatorSio: rentalPackage === 'lepas-kunci' ? 'Mandiri Internal' : `SIO-KEMNAKER/${Math.floor(1000 + Math.random() * 9000)}/2024`,
      inspectionPassed: true,
      videoUploads: uploadedVideos,
    };

    onSubmitBooking(newRecord);
    setCompletedBooking(newRecord);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#101624] border border-slate-700 rounded-xl max-w-4xl w-full shadow-2xl relative my-6 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-[#0c121e] flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-pink-400 font-semibold mb-1">
              <span>Sistem Reservasi & Kontrak Digital</span>
              <span>·</span>
              <span>Palugada Alat Berat Pontianak</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Formulir Reservasi Sewa Alat Berat
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar (Zero-Pill: clean unboxed numbering) */}
        {!completedBooking && (
          <div className="bg-slate-900/60 border-b border-slate-800 px-4 py-3 shrink-0">
            <div className="flex items-center justify-between max-w-2xl mx-auto text-xs font-mono">
              <span className={currentStep === 1 ? 'text-pink-400 font-bold' : 'text-slate-400'}>
                01. Pilih Unit
              </span>
              <span className="text-slate-600">/</span>
              <span className={currentStep === 2 ? 'text-pink-400 font-bold' : 'text-slate-400'}>
                02. Lokasi Mob-Demob
              </span>
              <span className="text-slate-600">/</span>
              <span className={currentStep === 3 ? 'text-pink-400 font-bold' : 'text-slate-400'}>
                03. Durasi & Shift
              </span>
              <span className="text-slate-600">/</span>
              <span className={currentStep === 4 ? 'text-pink-400 font-bold' : 'text-slate-400'}>
                04. Data Perusahaan
              </span>
              <span className="text-slate-600">/</span>
              <span className={currentStep === 5 ? 'text-pink-400 font-bold' : 'text-slate-400'}>
                05. Konfirmasi SPK
              </span>
            </div>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm">
          {completedBooking ? (
            /* Success & Digital SPK Confirmation Screen */
            <div className="space-y-6">
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                <h4 className="text-xl font-bold text-white mb-1">
                  Reservasi Berhasil Dikonfirmasi!
                </h4>
                <p className="text-xs text-slate-300 max-w-lg mx-auto">
                  Surat Perjanjian Sewa (SPK Online) telah terbit dengan nomor referensi di bawah ini. Unit telah dialokasikan dan siap dijadwalkan untuk mobilisasi armada.
                </p>
                <div className="mt-4 inline-block px-4 py-2 bg-slate-900 border border-slate-700 rounded font-mono text-base font-bold text-pink-400">
                  REF NO: {completedBooking.bookingRef}
                </div>
              </div>

              {/* Digital Invoice / SPK Sheet Preview */}
              <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 space-y-4 font-mono text-xs">
                <div className="flex justify-between items-start pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-base font-bold text-white block">PALUGADA ALAT BERAT PONTIANAK</span>
                    <span className="text-slate-400 text-[11px]">DIVISI SEWA ALAT BERAT & LOGISTIK KALBAR</span>
                  </div>
                  <div className="text-right">
                    <span className="text-pink-400 font-bold block">{completedBooking.bookingRef}</span>
                    <span className="text-slate-400 text-[11px]">Tgl: {completedBooking.createdAt}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-2 border-b border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-500 block uppercase">Pihak Kedua (Penyewa):</span>
                    <strong className="text-white block">{completedBooking.companyName}</strong>
                    <span className="text-slate-400">PIC: {completedBooking.picName} ({completedBooking.picPhone})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block uppercase">Lokasi Proyek Kerja:</span>
                    <strong className="text-white block">{completedBooking.projectName}</strong>
                    <span className="text-slate-400">{completedBooking.projectLocation}</span>
                  </div>
                </div>

                <div className="py-2 border-b border-slate-800 space-y-2">
                  <span className="text-slate-500 block uppercase">Rincian Unit & Paket:</span>
                  <div className="flex justify-between text-white font-sans text-xs">
                    <span>{completedBooking.equipmentName} ({completedBooking.unitCodeAssigned})</span>
                    <span className="font-mono">{formatIDR(completedBooking.rentalCost)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Mobilisasi & Demobilisasi PP (Truk Trailer Lowbed)</span>
                    <span className="font-mono">{formatIDR(completedBooking.mobDemobCost)}</span>
                  </div>
                  {completedBooking.operatorCost > 0 && (
                    <div className="flex justify-between text-slate-400">
                      <span>Operator Bersertifikat SIO & Tunjangan Kerja ({completedBooking.durationDays} Hari)</span>
                      <span className="font-mono">{formatIDR(completedBooking.operatorCost)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>PPN 11%</span>
                    <span className="font-mono">{formatIDR(completedBooking.taxPpn)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-base font-bold pt-2 text-white">
                  <span>TOTAL ESTIMASI KONTRAK:</span>
                  <span className="text-pink-400 font-mono">{formatIDR(completedBooking.totalCost)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold text-xs uppercase flex items-center justify-center gap-2 border border-slate-700"
                >
                  <Printer className="w-4 h-4 text-pink-400" />
                  <span>Cetak Dokumen SPK</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs uppercase rounded"
                >
                  Selesai & Lihat di Pesanan Saya
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: Pilih Unit & Paket */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-2 font-semibold">
                      Alat Berat Yang Dipilih:
                    </label>
                    <select
                      value={selectedEquip.id}
                      onChange={(e) => {
                        const found = EQUIPMENT_LIST.find((eq) => eq.id === e.target.value);
                        if (found) setSelectedEquip(found);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500 font-medium"
                    >
                      {EQUIPMENT_LIST.map((eq) => (
                        <option key={eq.id} value={eq.id}>
                          {eq.name} — {formatIDR(eq.hourlyRate)} / jam ({eq.availableUnits} Ready)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Selected Equipment Card Preview */}
                  <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center gap-4">
                    <img
                      src={selectedEquip.image}
                      alt={selectedEquip.name}
                      className="w-20 h-20 object-cover rounded-lg shrink-0 border border-slate-700"
                    />
                    <div className="flex-1">
                      <div className="text-xs font-mono text-pink-400">{selectedEquip.brand} · {selectedEquip.model}</div>
                      <h4 className="text-base font-bold text-white">{selectedEquip.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{selectedEquip.specs.capacity} · {selectedEquip.specs.operatingWeight}</p>
                    </div>
                  </div>

                  {/* Paket Sewa Radio Options */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-2 font-semibold">
                      Pilihan Paket Layanan Sewa:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setRentalPackage('operator-sio')}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          rentalPackage === 'operator-sio'
                            ? 'bg-pink-500/10 border-pink-500 text-white'
                            : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <UserCheck className="w-5 h-5 text-pink-400 mb-2" />
                        <span className="font-bold block text-sm">Unit + Operator SIO</span>
                        <span className="text-xs text-slate-400 mt-1 block">
                          Termasuk operator bersertifikat Kemenaker. BBM solar disediakan penyewa di lokasi.
                        </span>
                        <span className="text-[11px] text-pink-400 font-mono block mt-2 font-semibold">Paling Diminati</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRentalPackage('all-in-solar')}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          rentalPackage === 'all-in-solar'
                            ? 'bg-pink-500/10 border-pink-500 text-white'
                            : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <Fuel className="w-5 h-5 text-emerald-400 mb-2" />
                        <span className="font-bold block text-sm">All-In + Solar B35</span>
                        <span className="text-xs text-slate-400 mt-1 block">
                          Unit + Operator SIO + Suplai Solar Industri Resmi. Bebas pusing logistik.
                        </span>
                        <span className="text-[11px] text-emerald-400 font-mono block mt-2 font-semibold">Terima Beres</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRentalPackage('lepas-kunci')}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          rentalPackage === 'lepas-kunci'
                            ? 'bg-pink-500/10 border-pink-500 text-white'
                            : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <Truck className="w-5 h-5 text-slate-400 mb-2" />
                        <span className="font-bold block text-sm">Lepas Kunci (Bare Rental)</span>
                        <span className="text-xs text-slate-400 mt-1 block">
                          Hanya unit alat berat. Operator & solar disediakan sepenuhnya oleh kontraktor.
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono block mt-2">Wajib Surat SIO</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Lokasi Proyek & Mob-Demob */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-semibold">
                      Wilayah / Kota Hub Pengiriman Lowbed:
                    </label>
                    <select
                      value={selectedRegionIndex}
                      onChange={(e) => setSelectedRegionIndex(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500"
                    >
                      {INDONESIAN_REGIONS.map((reg, idx) => (
                        <option key={reg.city} value={idx}>
                          {reg.city} ({reg.province}) — Est. Jarak {reg.distanceKm} KM
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-semibold">
                      Nama Proyek / Landmark Site:
                    </label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Contoh: Proyek Tol IKN Segmen 3B / Smelter Pomalaa"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-semibold">
                      Alamat Titik Bongkar / Drop Unit:
                    </label>
                    <textarea
                      rows={2}
                      value={projectAddress}
                      onChange={(e) => setProjectAddress(e.target.value)}
                      placeholder="Sebutkan detail akses jalan, patokan gerbang proyek, atau koordinat GPS jika ada"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  {/* Upload Video & Foto Kondisi Akses Lokasi Proyek */}
                  <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-pink-400" />
                        <span className="font-bold text-white text-xs uppercase font-mono">
                          Upload Video Kondisi Akses & Lahan Proyek (Wajib Survei Lowbed)
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-pink-500/10 text-pink-400 border border-pink-500/30 rounded">
                        Verifikasi Jalur Tronton
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      Unggah video rekaman jalur masuk, kondisi jembatan, kabel listrik rendah, atau permukaan tanah untuk memastikan trailer lowbed pengangkut dapat menurunkan alat berat secara aman.
                    </p>

                    {/* Quick sample video loader */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-[11px] text-slate-400 font-mono">Contoh Video Siap Uji:</span>
                      <button
                        type="button"
                        onClick={() => {
                          const sampleVid: MediaUpload = {
                            id: `vid-${Date.now()}`,
                            name: 'Survey-Jalur-Tol-IKN-Segmen3B.mp4',
                            type: 'video',
                            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                            sizeMb: 18.2,
                            uploadedAt: 'Baru saja',
                            category: 'survey_akses',
                            notes: 'Trase jalan kerja bebas hambatan tiang listrik, lebar 7m.',
                          };
                          setUploadedVideos((prev) => [sampleVid, ...prev]);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-pink-600 hover:text-white text-slate-300 rounded text-[11px] font-mono transition-colors"
                      >
                        + Video Akses Tol IKN (.mp4)
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const sampleVid2: MediaUpload = {
                            id: `vid-${Date.now()}`,
                            name: 'Dokumentasi-Medan-Kawasan-Smelter.mp4',
                            type: 'video',
                            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                            sizeMb: 24.5,
                            uploadedAt: 'Baru saja',
                            category: 'kondisi_medan',
                            notes: 'Kondisi tanah padat sirtu, siap manuver lowbed 60 Ton.',
                          };
                          setUploadedVideos((prev) => [sampleVid2, ...prev]);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-pink-600 hover:text-white text-slate-300 rounded text-[11px] font-mono transition-colors"
                      >
                        + Video Lahan Smelter (.mp4)
                      </button>
                    </div>

                    {/* Upload Dropzone File Picker */}
                    <label className="block p-4 border-2 border-dashed border-slate-700 hover:border-pink-500 rounded-xl text-center cursor-pointer transition-colors bg-black/30">
                      <Upload className="w-6 h-6 text-pink-400 mx-auto mb-1.5" />
                      <span className="font-bold text-white text-xs block">
                        Pilih File Video / Rekam Langsung dari Smartphone Site
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Mendukung format MP4, MOV, WEBM (Maks. 200 MB per file)
                      </span>
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const newMedia: MediaUpload = {
                              id: `vid-${Date.now()}`,
                              name: file.name,
                              type: 'video',
                              url: URL.createObjectURL(file),
                              sizeMb: Number((file.size / (1024 * 1024)).toFixed(1)),
                              uploadedAt: 'Baru saja',
                              category: 'survey_akses',
                              notes: 'Video survey lokasi yang diunggah oleh pemesan.',
                            };
                            setUploadedVideos((prev) => [newMedia, ...prev]);
                          }
                        }}
                      />
                    </label>

                    {/* Uploaded Videos List */}
                    {uploadedVideos.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <span className="text-[11px] font-mono text-slate-400 block font-semibold">
                          Video & Media Terlampir ({uploadedVideos.length} Berkas):
                        </span>
                        {uploadedVideos.map((vid) => (
                          <div
                            key={vid.id}
                            className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <div className="w-8 h-8 rounded bg-pink-600/20 text-pink-400 flex items-center justify-center shrink-0">
                                <Video className="w-4 h-4" />
                              </div>
                              <div className="truncate">
                                <span className="font-bold text-white truncate block">{vid.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono block">
                                  {vid.sizeMb ? `${vid.sizeMb} MB · ` : ''}{vid.uploadedAt} · {vid.category}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => setActiveVideoModal(vid)}
                                className="px-2.5 py-1 bg-pink-600 hover:bg-pink-500 text-white rounded font-mono text-[11px] flex items-center gap-1"
                              >
                                <Play className="w-3 h-3 fill-white" />
                                <span>Putar</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setUploadedVideos(uploadedVideos.filter((v) => v.id !== vid.id))}
                                className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Road parameters input */}
                    <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
                      <div>
                        <label className="text-[10px] text-slate-400 block font-sans mb-1">
                          Lebar Akses Jalan Masuk (Meter):
                        </label>
                        <input
                          type="text"
                          value={roadWidthMeters}
                          onChange={(e) => setRoadWidthMeters(e.target.value)}
                          placeholder="6.5 Meter"
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block font-sans mb-1">
                          Kapasitas Beban Jembatan Rute (Ton):
                        </label>
                        <input
                          type="text"
                          value={bridgeCapacityTon}
                          onChange={(e) => setBridgeCapacityTon(e.target.value)}
                          placeholder="40 Ton"
                          className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mob-Demob Rate Calculation Box */}
                  <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block font-mono">Biaya Truk Trailer Lowbed (PP Mob-Demob):</span>
                      <span className="text-lg font-bold text-pink-400 font-mono">
                        {formatIDR(currentRegion.defaultRateMob)}
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">Termasuk pengawalan (escort) dan asuransi kargo jalan raya</p>
                    </div>
                    <div className="text-right font-mono text-xs text-emerald-400">
                      Truk Tronton 6x4 Siap
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Durasi & Shift Kerja */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-semibold">
                        Tanggal Mulai Kerja di Site:
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-semibold">
                        Lama Waktu Sewa (Hari):
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min={7}
                          max={365}
                          value={durationDays}
                          onChange={(e) => setDurationDays(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500 font-mono font-bold"
                        />
                        <span className="text-slate-400 font-mono whitespace-nowrap">Hari Kalender</span>
                      </div>
                    </div>
                  </div>

                  {/* Preset quick buttons */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono">Pilihan Cepat:</span>
                    {[7, 14, 30, 60, 90].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDurationDays(d)}
                        className={`px-3 py-1 rounded text-xs font-mono border ${
                          durationDays === d
                            ? 'bg-pink-600 text-white border-pink-600 font-bold'
                            : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        {d} Hari
                      </button>
                    ))}
                  </div>

                  {/* Shift Options */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-semibold">
                      Pola Shift Kerja Harian:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setWorkingShifts(1)}
                        className={`p-4 rounded-xl border text-left transition-colors ${
                          workingShifts === 1
                            ? 'bg-pink-500/10 border-pink-500 text-white'
                            : 'bg-slate-900/40 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="font-bold block text-sm">1 Shift Kerja (8 Jam / Hari)</span>
                        <span className="text-xs text-slate-400 mt-1 block">
                          Pekerjaan sipil umum jam normal 08.00 - 17.00 WIB.
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setWorkingShifts(2)}
                        className={`p-4 rounded-xl border text-left transition-colors ${
                          workingShifts === 2
                            ? 'bg-pink-500/10 border-pink-500 text-white'
                            : 'bg-slate-900/40 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="font-bold block text-sm">2 Shift Kerja Lembur (16 Jam / Hari)</span>
                        <span className="text-xs text-slate-400 mt-1 block">
                          Operasional ganda siang-malam untuk mengejar target tenggat proyek.
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Data PIC & Kontraktor */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-semibold">
                      Nama Perusahaan / Kontraktor (PT / CV / BUMN):
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Contoh: PT Hutama Karya Infrastruktur"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-semibold">
                        Nama Lengkap PIC Lapangan:
                      </label>
                      <input
                        type="text"
                        value={picName}
                        onChange={(e) => setPicName(e.target.value)}
                        placeholder="Contoh: Ir. Dwi Santoso"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-semibold">
                        Nomor Handphone / WhatsApp PIC:
                      </label>
                      <input
                        type="tel"
                        value={picPhone}
                        onChange={(e) => setPicPhone(e.target.value)}
                        placeholder="Contoh: 0812-9876-5432"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-semibold">
                      Alamat Email Korespondensi:
                    </label>
                    <input
                      type="email"
                      value={picEmail}
                      onChange={(e) => setPicEmail(e.target.value)}
                      placeholder="procurement@perusahaan.co.id"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5 font-semibold">
                      Catatan Akses Jalan / Kondisi Lapangan:
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Jembatan pembatas beban, elevasi tanjakan, atau syarat APD K3 khusus"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: Rekapitulasi Biaya & SPK Preview */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <h4 className="font-bold text-white text-sm mb-3">Ringkasan Pemesanan Kontrak</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Unit Terpilih:</span>
                        <span className="font-bold text-white">{selectedEquip.name}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Lokasi Drop Proyek:</span>
                        <span className="text-white">{currentRegion.city} ({currentRegion.province})</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Durasi Sewa:</span>
                        <span className="text-white font-mono">{durationDays} Hari ({workingShifts} Shift/Hari)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Paket Layanan:</span>
                        <span className="text-pink-400 uppercase font-mono font-semibold">{rentalPackage}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Kontraktor:</span>
                        <span className="text-white">{companyName} (PIC: {picName})</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2.5 font-mono text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Biaya Sewa Pokok ({durationDays} Hari):</span>
                      <span className="text-white">{formatIDR(costs.baseRental)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>PP Mob-Demob Lowbed ({currentRegion.distanceKm} KM):</span>
                      <span className="text-white">{formatIDR(costs.mobDemobCost)}</span>
                    </div>
                    {costs.operatorCost > 0 && (
                      <div className="flex justify-between text-slate-300">
                        <span>Biaya Operator SIO & Akomodasi:</span>
                        <span className="text-white">{formatIDR(costs.operatorCost)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                      <span>Subtotal Kontrak:</span>
                      <span>{formatIDR(costs.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>PPN 11%:</span>
                      <span>{formatIDR(costs.taxPpn)}</span>
                    </div>
                    <div className="flex justify-between text-base font-extrabold text-pink-400 pt-2 border-t border-slate-800">
                      <span>TOTAL BIAYA:</span>
                      <span className="tabular-nums">{formatIDR(costs.total)}</span>
                    </div>
                  </div>

                  {/* Attached Videos in Step 5 */}
                  {uploadedVideos.length > 0 && (
                    <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-pink-400" />
                          <span className="font-bold text-white text-xs">
                            Lampiran Video Akses Lokasi ({uploadedVideos.length} Berkas):
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          Siap Verifikasi Dispatch
                        </span>
                      </div>
                      <div className="space-y-1.5 pt-1">
                        {uploadedVideos.map((v) => (
                          <div
                            key={v.id}
                            className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-lg flex items-center justify-between gap-3 text-xs"
                          >
                            <span className="truncate text-slate-300 font-mono text-[11px]">{v.name}</span>
                            <button
                              type="button"
                              onClick={() => setActiveVideoModal(v)}
                              className="px-2.5 py-1 bg-pink-600/20 hover:bg-pink-600 text-pink-400 hover:text-white rounded font-mono text-[11px] flex items-center gap-1 transition-colors shrink-0"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Pratinjau Video</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    *Dengan menekan tombol Konfirmasi, Anda menyetujui syarat sewa Palugada Alat Berat Pontianak, termasuk jaminan unit pengganti 1x24 jam bila terjadi kerusakan mekanik non-human error.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Player Pop-up for uploaded video */}
        {activeVideoModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="bg-[#101624] border border-slate-700 rounded-2xl max-w-2xl w-full p-4 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-pink-400" />
                  <span className="font-bold text-white text-xs truncate max-w-md">
                    {activeVideoModal.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveVideoModal(null)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                <video
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                  src={activeVideoModal.url}
                >
                  Browser Anda tidak mendukung pemutar video HTML5.
                </video>
              </div>

              {activeVideoModal.notes && (
                <p className="text-xs text-slate-300 mt-3 p-2.5 bg-slate-900 rounded font-sans">
                  <strong>Catatan Lapangan:</strong> {activeVideoModal.notes}
                </p>
              )}

              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setActiveVideoModal(null)}
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded text-xs"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer Controls */}
        {!completedBooking && (
          <div className="p-4 sm:p-6 border-t border-slate-800 bg-[#0c121e] flex items-center justify-between shrink-0">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded text-xs flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev + 1) as any)}
                className="px-6 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-extrabold rounded text-xs uppercase flex items-center gap-1.5 transition-colors"
              >
                <span>Lanjut Langkah Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmReservation}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded text-xs uppercase flex items-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Terbitkan SPK & Konfirmasi Reservasi</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
