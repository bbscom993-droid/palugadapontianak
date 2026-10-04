import React, { useState } from 'react';
import { BookingRecord, MediaUpload } from '../types/equipment';
import { formatIDR } from '../utils/formatters';
import { 
  FileText, 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Search, 
  Printer, 
  ClipboardCheck, 
  X,
  AlertCircle,
  Video,
  Play,
  Upload,
  Plus
} from 'lucide-react';

interface BookingManagementProps {
  bookings: BookingRecord[];
  onOpenNewBooking: () => void;
  onUpdateBookingVideos?: (bookingId: string, updatedVideos: MediaUpload[]) => void;
}

export const BookingManagement: React.FC<BookingManagementProps> = ({
  bookings: initialBookings,
  onOpenNewBooking,
  onUpdateBookingVideos,
}) => {
  const [bookingsList, setBookingsList] = useState<BookingRecord[]>(initialBookings);
  const [activeTabFilter, setActiveTabFilter] = useState<'ALL' | 'BEROPERASI' | 'MOBILISASI' | 'SPK_TERBIT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingForDoc, setSelectedBookingForDoc] = useState<BookingRecord | null>(null);
  const [inspectionModalBooking, setInspectionModalBooking] = useState<BookingRecord | null>(null);
  const [activeVideoPreview, setActiveVideoPreview] = useState<MediaUpload | null>(null);
  const [uploadVideoModalBooking, setUploadVideoModalBooking] = useState<BookingRecord | null>(null);

  // New video modal inputs
  const [videoTitle, setVideoTitle] = useState('');
  const [videoCategory, setVideoCategory] = useState<MediaUpload['category']>('kegiatan_harian');
  const [videoFileUrl, setVideoFileUrl] = useState('');
  const [videoNotes, setVideoNotes] = useState('');

  // Keep bookingsList in sync if parent bookings change
  React.useEffect(() => {
    setBookingsList(initialBookings);
  }, [initialBookings]);

  // Pre-operation checklist state
  const [checklist, setChecklist] = useState({
    oliMesin: true,
    hidrolik: true,
    undercarriage: true,
    lampuRotator: true,
    apar: true,
    seatBelt: true,
    klaksonMundur: true,
  });
  const [checklistSigned, setChecklistSigned] = useState(false);

  const bookings = bookingsList;

  const filteredBookings = bookings.filter((b) => {
    const matchStatus = activeTabFilter === 'ALL' || b.status === activeTabFilter;
    const matchSearch =
      b.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.equipmentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusBadge = (status: BookingRecord['status']) => {
    switch (status) {
      case 'BEROPERASI':
        return {
          label: 'Aktif Beroperasi di Site',
          className: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        };
      case 'MOBILISASI':
        return {
          label: 'Dalam Mobilisasi Lowbed',
          className: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        };
      case 'SPK_TERBIT':
        return {
          label: 'SPK Terbit - Siap Kirim',
          className: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
        };
      case 'PENDING_REVIEW':
        return {
          label: 'Verifikasi Dokumen',
          className: 'text-slate-400 bg-slate-800 border-slate-700',
        };
      case 'SELESAI':
        return {
          label: 'Kontrak Selesai',
          className: 'text-slate-400 bg-slate-800 border-slate-700',
        };
    }
  };

  return (
    <section id="bookings" className="py-12 bg-[#090d16] border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-pink-400 mb-1">
              <span>Portal Manajemen Penyewaan</span>
              <span>·</span>
              <span>Surat Perjanjian Kerja & Log HM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pesanan Saya & Manajemen Armada Sewa
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Pantau surat perjanjian sewa (SPK), status pengiriman lowbed trailer, timesheet HM operator, dan checklist inspeksi K3 harian.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenNewBooking}
              className="px-4 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs uppercase rounded transition-colors"
            >
              + Buat Reservasi Baru
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          {/* Status Tabs (Zero-Pill: functional segmented tabs) */}
          <div className="flex items-center gap-1 p-1 bg-[#121927] rounded-lg border border-slate-800 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTabFilter('ALL')}
              className={`px-3 py-1.5 font-medium rounded transition-colors whitespace-nowrap ${
                activeTabFilter === 'ALL' ? 'bg-pink-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTabFilter('BEROPERASI')}
              className={`px-3 py-1.5 font-medium rounded transition-colors whitespace-nowrap ${
                activeTabFilter === 'BEROPERASI' ? 'bg-pink-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Beroperasi ({bookings.filter((b) => b.status === 'BEROPERASI').length})
            </button>
            <button
              onClick={() => setActiveTabFilter('MOBILISASI')}
              className={`px-3 py-1.5 font-medium rounded transition-colors whitespace-nowrap ${
                activeTabFilter === 'MOBILISASI' ? 'bg-pink-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mobilisasi ({bookings.filter((b) => b.status === 'MOBILISASI').length})
            </button>
            <button
              onClick={() => setActiveTabFilter('SPK_TERBIT')}
              className={`px-3 py-1.5 font-medium rounded transition-colors whitespace-nowrap ${
                activeTabFilter === 'SPK_TERBIT' ? 'bg-pink-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              SPK Siap ({bookings.filter((b) => b.status === 'SPK_TERBIT').length})
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari No. SPK atau Nama Perusahaan..."
              className="bg-[#121927] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 w-full sm:w-64 focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        {/* Bookings Card List */}
        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center bg-[#111726] border border-slate-800 rounded-xl">
            <AlertCircle className="w-10 h-10 text-pink-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Belum Ada Pesanan yang Sesuai</h3>
            <p className="text-xs text-slate-400 mb-4">
              Silakan lakukan reservasi unit baru atau ubah kata kunci pencarian Anda.
            </p>
            <button
              onClick={onOpenNewBooking}
              className="px-5 py-2.5 bg-pink-600 text-white rounded text-xs font-bold uppercase hover:bg-pink-500"
            >
              Sewa Unit Sekarang
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const status = getStatusBadge(booking.status);
              return (
                <div
                  key={booking.id}
                  className="bg-[#111726] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all shadow-md"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-pink-400">
                          {booking.bookingRef}
                        </span>
                        <span className="text-xs text-slate-500">·</span>
                        <span className="text-xs text-slate-400 font-mono">Tgl SPK: {booking.createdAt}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${status.className}`}>
                          {status.label}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        {booking.equipmentName} ({booking.unitCodeAssigned})
                      </h3>
                      <p className="text-xs text-slate-300">
                        {booking.companyName} · PIC: {booking.picName} ({booking.picPhone})
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => {
                          setInspectionModalBooking(booking);
                          setChecklistSigned(false);
                        }}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <ClipboardCheck className="w-4 h-4 text-emerald-400" />
                        <span>Inspeksi K3 Harian</span>
                      </button>

                      <button
                        onClick={() => setSelectedBookingForDoc(booking)}
                        className="px-3.5 py-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/30 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Lihat Dokumen SPK</span>
                      </button>
                    </div>
                  </div>

                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono py-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Proyek & Lokasi:</span>
                      <strong className="text-slate-200 block truncate">{booking.projectName}</strong>
                      <span className="text-slate-400 text-[11px] truncate block">{booking.projectLocation}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Durasi & Shift:</span>
                      <strong className="text-slate-200 block">{booking.durationDays} Hari Kalender</strong>
                      <span className="text-slate-400 text-[11px]">Mulai: {booking.startDate} ({booking.workingShifts} Shift)</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Operator Lapangan:</span>
                      <strong className="text-slate-200 block">{booking.operatorName}</strong>
                      <span className="text-slate-400 text-[11px] block truncate">{booking.operatorSio}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Total Kontrak (Nett):</span>
                      <strong className="text-pink-400 block text-sm tabular-nums">
                        {formatIDR(booking.totalCost)}
                      </strong>
                      <span className="text-[11px] text-slate-500">Termasuk PPN 11% & Mob-Demob</span>
                    </div>
                  </div>

                  {/* Timesheet HM Counter Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 font-mono">HM Awal: <strong className="text-white tabular-nums">{booking.hmStart}</strong></span>
                      <span className="text-slate-600">→</span>
                      <span className="text-slate-400 font-mono">HM Berjalan: <strong className="text-emerald-400 tabular-nums">{booking.hmCurrent}</strong></span>
                      <span className="text-slate-500 font-mono">({(booking.hmCurrent - booking.hmStart).toFixed(1)} HM Terpakai)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Surat Ijin Alat (SIA) Valid
                      </span>
                    </div>
                  </div>

                  {/* Video Dokumentasi Proyek Section */}
                  <div className="mt-3 pt-3 border-t border-slate-800/60">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-pink-400" />
                        <span className="text-xs font-bold text-white font-mono">
                          Video Dokumentasi Lapangan ({booking.videoUploads?.length || 0} Berkas):
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setUploadVideoModalBooking(booking);
                          setVideoTitle(`Kegiatan Operasi ${booking.unitCodeAssigned} Site`);
                          setVideoFileUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
                        }}
                        className="text-[11px] font-mono font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1 self-start sm:self-auto"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Upload Video Kegiatan Proyek</span>
                      </button>
                    </div>

                    {booking.videoUploads && booking.videoUploads.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {booking.videoUploads.map((vid) => (
                          <div
                            key={vid.id}
                            className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800/80 flex items-center justify-between gap-2"
                          >
                            <div className="truncate">
                              <span className="font-bold text-slate-200 block truncate text-[11px]">{vid.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono block">
                                {vid.category} · {vid.uploadedAt} {vid.sizeMb ? `(${vid.sizeMb} MB)` : ''}
                              </span>
                            </div>
                            <button
                              onClick={() => setActiveVideoPreview(vid)}
                              className="px-2.5 py-1 bg-pink-600 hover:bg-pink-500 text-white rounded text-[11px] font-mono font-bold flex items-center gap-1 shrink-0"
                            >
                              <Play className="w-3 h-3 fill-white" />
                              <span>Tonton</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Belum ada video dokumentasi terlampir untuk unit ini.</span>
                        <button
                          onClick={() => {
                            setUploadVideoModalBooking(booking);
                            setVideoTitle(`Kegiatan Operasi ${booking.unitCodeAssigned}`);
                            setVideoFileUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
                          }}
                          className="text-pink-400 hover:underline font-mono font-bold"
                        >
                          Unggah Sekarang →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SPK View / Print Modal */}
        {selectedBookingForDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#121927] border border-slate-700 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative my-8 text-xs font-mono">
              <button
                onClick={() => setSelectedBookingForDoc(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b-2 border-slate-700 pb-4 mb-4">
                <span className="text-base font-extrabold text-white block">
                  SURAT PERJANJIAN SEWA ALAT BERAT (SPK DIGITAL)
                </span>
                <span className="text-pink-400 text-xs font-bold block">
                  NOMOR: {selectedBookingForDoc.bookingRef}
                </span>
                <span className="text-slate-400 text-[10px]">
                  PALUGADA ALAT BERAT PONTIANAK · Divisi Rental Alat Berat Kalimantan Barat
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div>
                  <span className="text-slate-500 block uppercase">Pihak Pertama (Penyedia):</span>
                  <span className="text-white font-bold">PALUGADA ALAT BERAT PONTIANAK</span>
                  <p className="text-slate-400 text-[11px]">Kawasan Industri Siantan & Sungai Raya Hub, Pontianak, Kalimantan Barat</p>
                </div>

                <div>
                  <span className="text-slate-500 block uppercase">Pihak Kedua (Penyewa):</span>
                  <span className="text-white font-bold">{selectedBookingForDoc.companyName}</span>
                  <p className="text-slate-400 text-[11px]">
                    PIC: {selectedBookingForDoc.picName} ({selectedBookingForDoc.picPhone})
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 block uppercase">Unit & Lokasi:</span>
                  <span className="text-white">{selectedBookingForDoc.equipmentName} ({selectedBookingForDoc.unitCodeAssigned})</span>
                  <p className="text-slate-400 text-[11px]">Lokasi: {selectedBookingForDoc.projectName} - {selectedBookingForDoc.projectLocation}</p>
                </div>

                <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sewa Unit Pokok ({selectedBookingForDoc.durationDays} Hari):</span>
                    <span className="text-white">{formatIDR(selectedBookingForDoc.rentalCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mobilisasi/Demobilisasi Lowbed PP:</span>
                    <span className="text-white">{formatIDR(selectedBookingForDoc.mobDemobCost)}</span>
                  </div>
                  {selectedBookingForDoc.operatorCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Operator SIO & Akomodasi:</span>
                      <span className="text-white">{formatIDR(selectedBookingForDoc.operatorCost)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">PPN 11%:</span>
                    <span className="text-white">{formatIDR(selectedBookingForDoc.taxPpn)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-pink-400 pt-1 border-t border-slate-800 text-sm">
                    <span>TOTAL NILAI SPK:</span>
                    <span>{formatIDR(selectedBookingForDoc.totalCost)}</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 leading-relaxed">
                  Pasal 1: Kerusakan mesin murni ditanggung oleh Pihak Pertama dengan garansi pergantian unit maksimal 1x24 jam.
                  <br />
                  Pasal 2: Kerusakan akibat kelalaian operasional atau kecelakaan site menjadi tanggung jawab bersama sesuai evaluasi investigasi teknis.
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold text-xs flex items-center gap-1.5 border border-slate-700"
                >
                  <Printer className="w-4 h-4 text-pink-400" />
                  <span>Cetak Salinan SPK</span>
                </button>
                <button
                  onClick={() => setSelectedBookingForDoc(null)}
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs uppercase rounded"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* K3 Pre-Operation Daily Checklist Modal */}
        {inspectionModalBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#121927] border border-slate-700 rounded-xl max-w-xl w-full p-6 shadow-2xl relative my-8">
              <button
                onClick={() => setInspectionModalBooking(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Lembar Checklist Inspeksi K3 Harian</h3>
                  <p className="text-xs text-slate-400">
                    Unit: {inspectionModalBooking.unitCodeAssigned} · Operator: {inspectionModalBooking.operatorName}
                  </p>
                </div>
              </div>

              {checklistSigned ? (
                <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="font-bold text-white text-base">Inspeksi Harian Berhasil Disahkan!</h4>
                  <p className="text-xs text-slate-300">
                    Unit dinyatakan laik operasi (fit-to-work) untuk shift kerja hari ini. Catatan telah disinkronkan ke sistem dispatch.
                  </p>
                  <button
                    onClick={() => setInspectionModalBooking(null)}
                    className="px-5 py-2 bg-pink-600 text-white font-bold text-xs uppercase rounded mt-2"
                  >
                    Selesai
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Sesuai standar keselamatan Kemenaker & SMK3, operator wajib memverifikasi kondisi mekanik dan alat pelindung diri sebelum menghidupkan mesin:
                  </p>

                  <div className="space-y-2 text-xs">
                    <label className="flex items-center justify-between p-2.5 bg-slate-900 rounded border border-slate-800 cursor-pointer">
                      <span>1. Level & Kondisi Oli Mesin (Dipstick)</span>
                      <input
                        type="checkbox"
                        checked={checklist.oliMesin}
                        onChange={(e) => setChecklist({ ...checklist, oliMesin: e.target.checked })}
                        className="accent-pink-500 w-4 h-4"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2.5 bg-slate-900 rounded border border-slate-800 cursor-pointer">
                      <span>2. Tekanan & Kebocoran Selang Hidrolik</span>
                      <input
                        type="checkbox"
                        checked={checklist.hidrolik}
                        onChange={(e) => setChecklist({ ...checklist, hidrolik: e.target.checked })}
                        className="accent-pink-500 w-4 h-4"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2.5 bg-slate-900 rounded border border-slate-800 cursor-pointer">
                      <span>3. Kekencangan Track Rantai / Kondisi Ban</span>
                      <input
                        type="checkbox"
                        checked={checklist.undercarriage}
                        onChange={(e) => setChecklist({ ...checklist, undercarriage: e.target.checked })}
                        className="accent-pink-500 w-4 h-4"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2.5 bg-slate-900 rounded border border-slate-800 cursor-pointer">
                      <span>4. Lampu Rotator Safety & Lampu Kerja Malam</span>
                      <input
                        type="checkbox"
                        checked={checklist.lampuRotator}
                        onChange={(e) => setChecklist({ ...checklist, lampuRotator: e.target.checked })}
                        className="accent-pink-500 w-4 h-4"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2.5 bg-slate-900 rounded border border-slate-800 cursor-pointer">
                      <span>5. Tabung Pemadam Api Ringan (APAR 3kg) Siaga</span>
                      <input
                        type="checkbox"
                        checked={checklist.apar}
                        onChange={(e) => setChecklist({ ...checklist, apar: e.target.checked })}
                        className="accent-pink-500 w-4 h-4"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2.5 bg-slate-900 rounded border border-slate-800 cursor-pointer">
                      <span>6. Sabuk Pengaman (Seat Belt) & Klakson Mundur</span>
                      <input
                        type="checkbox"
                        checked={checklist.seatBelt}
                        onChange={(e) => setChecklist({ ...checklist, seatBelt: e.target.checked })}
                        className="accent-pink-500 w-4 h-4"
                      />
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setChecklistSigned(true)}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Validasi & Tandatangani Checklist K3</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Player Pop-up for booking video */}
        {activeVideoPreview && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="bg-[#101624] border border-slate-700 rounded-2xl max-w-2xl w-full p-4 sm:p-5 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-pink-400" />
                  <span className="font-bold text-white text-xs truncate max-w-md">
                    {activeVideoPreview.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveVideoPreview(null)}
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
                  src={activeVideoPreview.url}
                >
                  Browser Anda tidak mendukung pemutar video HTML5.
                </video>
              </div>

              {activeVideoPreview.notes && (
                <p className="text-xs text-slate-300 mt-3 p-2.5 bg-slate-900 rounded font-sans">
                  <strong>Catatan Verifikasi:</strong> {activeVideoPreview.notes}
                </p>
              )}

              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setActiveVideoPreview(null)}
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded text-xs uppercase"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Upload Video Baru ke Kontrak Booking */}
        {uploadVideoModalBooking && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#101624] border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative my-8 text-xs font-sans">
              <button
                onClick={() => setUploadVideoModalBooking(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-mono uppercase text-pink-400 font-semibold mb-1">
                <Upload className="w-4 h-4" />
                <span>Upload Video Lapangan</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                Dokumentasi Kegiatan Proyek: {uploadVideoModalBooking.unitCodeAssigned}
              </h3>
              <p className="text-slate-400 text-xs mb-4">
                Proyek: {uploadVideoModalBooking.projectName} ({uploadVideoModalBooking.projectLocation})
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const newVid: MediaUpload = {
                    id: `vid-${Date.now()}`,
                    name: videoTitle || `Dokumentasi-${uploadVideoModalBooking.unitCodeAssigned}.mp4`,
                    type: 'video',
                    url: videoFileUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                    sizeMb: 16.5,
                    uploadedAt: 'Hari ini',
                    category: videoCategory,
                    notes: videoNotes || 'Dokumentasi kegiatan operasional di site proyek.',
                  };

                  const updated = bookingsList.map((b) => {
                    if (b.id === uploadVideoModalBooking.id) {
                      return {
                        ...b,
                        videoUploads: [newVid, ...(b.videoUploads || [])],
                      };
                    }
                    return b;
                  });

                  setBookingsList(updated);
                  if (onUpdateBookingVideos) {
                    onUpdateBookingVideos(
                      uploadVideoModalBooking.id,
                      [newVid, ...(uploadVideoModalBooking.videoUploads || [])]
                    );
                  }
                  setUploadVideoModalBooking(null);
                  setVideoTitle('');
                  setVideoNotes('');
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-slate-400 font-mono uppercase text-[11px] mb-1 font-semibold">
                    Judul Dokumentasi Video:
                  </label>
                  <input
                    type="text"
                    required
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Contoh: Video Land Clearing Sisi Timur Blok B"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono uppercase text-[11px] mb-1 font-semibold">
                    Kategori Dokumentasi:
                  </label>
                  <select
                    value={videoCategory}
                    onChange={(e) => setVideoCategory(e.target.value as MediaUpload['category'])}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="kegiatan_harian">Kegiatan Operasional Harian Lapangan</option>
                    <option value="survey_akses">Survey Akses Jalan & Jembatan Lowbed</option>
                    <option value="kondisi_medan">Kondisi Medan Kerja / Kemiringan Tanah</option>
                    <option value="unboxing_serah_terima">Berita Acara Unboxing / Serah Terima Unit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono uppercase text-[11px] mb-1 font-semibold">
                    Pilih File Video (.mp4 / .mov / .webm):
                  </label>
                  <div className="p-4 bg-slate-900/60 border-2 border-dashed border-slate-700 hover:border-pink-500 rounded-xl text-center cursor-pointer transition-colors relative">
                    <Video className="w-6 h-6 text-pink-400 mx-auto mb-1" />
                    <span className="font-bold text-white block">Klik untuk memilih file video dari HP / PC</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">atau gunakan video terpasang otomatis</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setVideoFileUrl(URL.createObjectURL(file));
                          if (!videoTitle) setVideoTitle(file.name);
                        }
                      }}
                      className="opacity-0 absolute inset-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono uppercase text-[11px] mb-1 font-semibold">
                    Catatan Verifikasi Tim Proyek:
                  </label>
                  <textarea
                    rows={2}
                    value={videoNotes}
                    onChange={(e) => setVideoNotes(e.target.value)}
                    placeholder="Contoh: Unit beroperasi dengan normal, tidak ada kebocoran oli, cuaca cerah."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setUploadVideoModalBooking(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-pink-600 hover:bg-pink-500 text-white font-extrabold uppercase rounded shadow-lg shadow-pink-600/30"
                  >
                    Simpan Video ke Kontrak
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
