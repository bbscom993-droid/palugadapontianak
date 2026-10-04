import React, { useState } from 'react';
import { 
  Star, 
  Quote, 
  ShieldCheck, 
  Building2, 
  MapPin, 
  Clock, 
  Truck, 
  CheckCircle2, 
  Award,
  ChevronRight,
  X,
  FileCheck
} from 'lucide-react';

export interface ProjectManagerTestimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  projectName: string;
  projectLocation: string;
  sector: 'Infrastruktur' | 'Jembatan & Pelabuhan' | 'Pertambangan' | 'Perkebunan Sawit';
  rating: number;
  rentedUnits: string[];
  quote: string;
  fullReview: string;
  spkRef: string;
  durationMonths: number;
  highlightMetric: string;
  avatarColor: string;
}

const TESTIMONIALS: ProjectManagerTestimonial[] = [
  {
    id: 'test-01',
    name: 'Ir. Hendra Gunawan, IPM',
    role: 'Project Manager (PM) Divisi Infrastruktur 1',
    company: 'PT Wijaya Karya (Persero) Tbk',
    projectName: 'Proyek Duplikasi Jembatan Kapuas & Akses Poros Khatulistiwa',
    projectLocation: 'Pontianak, Kalimantan Barat',
    sector: 'Jembatan & Pelabuhan',
    rating: 5,
    rentedUnits: ['4x Excavator Komatsu PC200-8M0', '2x Vibro Roller Sakai SV520DH (12 Ton)'],
    quote: 'Pengiriman lowbed tepat waktu 100%, ketersediaan mekanik stanby 24 jam membuat deviasi timeline pekerjaan kami tetap surplus.',
    fullReview: 'Menjalankan proyek strategis di jalur padat Pontianak membutuhkan alat berat dengan availability tinggi. Palugada Alat Berat Pontianak membuktikan komitmen SLA penggantian unit 1x24 jam. Ketika satu unit excavator butuh penggantian seal hidrolik di minggu ke-3, tim mekanik tiba dalam 2 jam dan unit pengganti tiba esok paginya. Sangat profesional dan direkomendasikan untuk kontraktor BUMN.',
    spkRef: 'SPK-WIKA/KALBAR-KPS/2025/11-098',
    durationMonths: 6,
    highlightMetric: '99.8% Unit Availability',
    avatarColor: 'from-blue-600 to-indigo-700',
  },
  {
    id: 'test-02',
    name: 'Bagus Tri Handoko, S.T., PMP',
    role: 'Head of Site Operations & HSE Lead',
    company: 'PT Adhi Karya (Persero) Tbk',
    projectName: 'Pembangunan Kawasan Logistik & Dry Bulk Terminal Pelabuhan Kijing',
    projectLocation: 'Mempawah, Kalimantan Barat',
    sector: 'Infrastruktur',
    rating: 5,
    rentedUnits: ['1x Mobile Crane Kato 50 Ton (Rough Terrain)', '2x Bulldozer Cat D85SS-2'],
    quote: 'Sertifikasi SIA Kemenaker dan SIO operator Kelas 1 lengkap tanpa kendala sedikit pun saat audit ketat HSE.',
    fullReview: 'K3 di area Kijing sangat ketat. Seluruh dokumen SIA (Surat Ijin Alat) Palugada aktif dan operator mengantongi SIO Kemenaker RI kelas 1 resmi. Pengoperasian Mobile Crane 50 ton untuk erection struktur baja berjalan presisi dengan Zero Lost Time Injury (LTI). Sistem pelaporan timesheet digital juga mempermudah approval opname bulanan.',
    spkRef: 'SPK-ADHI/KIJING-TERMINAL/2026/01-042',
    durationMonths: 4,
    highlightMetric: 'Zero Accident & Full SIA K3',
    avatarColor: 'from-pink-600 to-rose-700',
  },
  {
    id: 'test-03',
    name: 'Ricky Darmawan, S.T.',
    role: 'Operational & Heavy Fleet Superintendent',
    company: 'PT Sinarmas Mining & Agro Perdana',
    projectName: 'Pembukaan Jalur Hauling & Pematangan Lahan Kebun Ketapang',
    projectLocation: 'Kendawangan - Ketapang, Kalimantan Barat',
    sector: 'Perkebunan Sawit',
    rating: 5,
    rentedUnits: ['3x Excavator Hitachi Long Arm 18M', '6x Dump Truck Hino 500 Tipper (30T)'],
    quote: 'Akurasi data hour-meter (HM) telemetri GPS sangat transparan, tidak ada perdebatan jam kerja saat rekonsiliasi invoice.',
    fullReview: 'Sebelum menggunakan Palugada, kami kerap berselisih soal penghitungan HM manual di lapangan. Dengan dashboard telemetri GPS Palugada, jam operasional mesin terdata otomatis per detik beserta konsumsi solar. Pengiriman unit ke pedalaman Ketapang lewat ponton sungai juga dikoordinasikan sangat rapi oleh tim logistik mereka.',
    spkRef: 'SPK-SMA/KTP-HAULING/2025/08-112',
    durationMonths: 8,
    highlightMetric: '100% Akurasi Telemetri HM',
    avatarColor: 'from-amber-600 to-orange-700',
  },
  {
    id: 'test-04',
    name: 'Ir. Sri Mulyani Astuti',
    role: 'Site Project Director',
    company: 'PT Hutama Karya Infrastruktur',
    projectName: 'Preservasi Jalan Nasional Trans-Kalimantan Seksi Tayan - Sandai',
    projectLocation: 'Sanggau - Ketapang, Kalbar',
    sector: 'Infrastruktur',
    rating: 5,
    rentedUnits: ['2x Motor Grader Cat 140K', '2x Wheel Loader Komatsu WA380-6'],
    quote: 'Unit dalam kondisi prima dan bersih, tanggap menghadapi medan perbukitan dan tanah merah tanpa kendala overheat.',
    fullReview: 'Jalur Trans-Kalimantan menuntut performa mesin yang tangguh di tanjakan curam. Unit Cat Grader 140K dari Palugada memiliki blade control yang sangat presisi, didukung operator yang ramah dan disiplin. Pihak manajemen Palugada juga sangat fleksibel dalam perpanjangan kontrak saat cuaca ekstrem memperpanjang durasi pekerjaan.',
    spkRef: 'SPK-HKI/TRANS-KALBAR/2025/12-077',
    durationMonths: 5,
    highlightMetric: 'Optimal di Medan Ekstrem',
    avatarColor: 'from-emerald-600 to-teal-700',
  },
  {
    id: 'test-05',
    name: 'Dedi Kurniawan, S.T.',
    role: 'Direktur Operasional',
    company: 'PT Borneo Mandiri Konstruksi',
    projectName: 'Pematangan Lahan & Cut-and-Fill Smelter Bauksit Sanggau',
    projectLocation: 'Tayan Hilir, Sanggau, Kalbar',
    sector: 'Pertambangan',
    rating: 5,
    rentedUnits: ['4x Excavator Sany SY215C', '3x Bulldozer Komatsu D65P-12'],
    quote: 'Fitur upload video survei jalan akses sebelum booking mempermudah koordinasi drop unit tanpa risiko trailer amblas.',
    fullReview: 'Jalan akses menuju site kami berlumpur dan memiliki jembatan kayu terbatas tonase. Lewat fitur upload video survei medan di reservasi online Palugada, tim rekayasa mereka memilihkan lowbed ramp yang tepat. Unit tiba tepat waktu dan langsung action di hari pertama kedatangan.',
    spkRef: 'SPK-BMK/BAUKSIT-TYN/2026/02-019',
    durationMonths: 3,
    highlightMetric: 'Drop Unit Bebas Risiko',
    avatarColor: 'from-purple-600 to-violet-700',
  },
];

interface TestimonialsSectionProps {
  onOpenBooking?: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ onOpenBooking }) => {
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [activeModalTestimonial, setActiveModalTestimonial] = useState<ProjectManagerTestimonial | null>(null);

  const sectors = [
    { key: 'ALL', label: 'Semua Proyek' },
    { key: 'Infrastruktur', label: 'Infrastruktur BUMN' },
    { key: 'Jembatan & Pelabuhan', label: 'Jembatan & Pelabuhan' },
    { key: 'Pertambangan', label: 'Tambang Bauksit' },
    { key: 'Perkebunan Sawit', label: 'Perkebunan Sawit' },
  ];

  const filteredTestimonials = TESTIMONIALS.filter((t) => {
    return selectedSector === 'ALL' || t.sector === selectedSector;
  });

  return (
    <section id="testimonials" className="py-16 bg-[#080c14] border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 border-b border-slate-800 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-pink-400 mb-2">
              <Award className="w-4 h-4" />
              <span>Kepercayaan Kontraktor Terkemuka</span>
              <span>·</span>
              <span>Ulasan Terverifikasi SPK</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Testimonial Manajer Proyek & Site Lead
            </h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Bukti nyata dedikasi layanan rental alat berat Palugada dari para profesional pengelola proyek strategis nasional, BUMN karya, pertambangan, dan perkebunan di Kalimantan Barat.
            </p>
          </div>

          {/* Trust Badges Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-[#101726] border border-slate-800 rounded-lg p-3 text-center">
              <span className="text-lg font-extrabold text-pink-400 font-mono block">100%</span>
              <span className="text-[11px] text-slate-400 font-medium">SIA & SIO Kemenaker</span>
            </div>
            <div className="bg-[#101726] border border-slate-800 rounded-lg p-3 text-center">
              <span className="text-lg font-extrabold text-emerald-400 font-mono block">1x24 Jam</span>
              <span className="text-[11px] text-slate-400 font-medium">Garansi Ganti Unit</span>
            </div>
            <div className="bg-[#101726] border border-slate-800 rounded-lg p-3 text-center col-span-2 sm:col-span-1">
              <span className="text-lg font-extrabold text-white font-mono block">99.4%</span>
              <span className="text-[11px] text-slate-400 font-medium">On-Time Dispatch</span>
            </div>
          </div>
        </div>

        {/* Sector Tabs Filter */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {sectors.map((sec) => (
            <button
              key={sec.key}
              onClick={() => setSelectedSector(sec.key)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                selectedSector === sec.key
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
                  : 'bg-[#101726] text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#0e1422] border border-slate-800/80 hover:border-pink-500/40 rounded-xl p-6 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-pink-500/5 group relative"
            >
              {/* Highlight Metric Chip */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[11px] font-mono font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {t.highlightMetric}
                </span>
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {t.durationMonths} Bulan Kontrak
                </span>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-bold text-slate-300 ml-1.5">5.0 / 5.0</span>
              </div>

              {/* Quote Headline */}
              <div className="mb-4">
                <Quote className="w-6 h-6 text-pink-500/30 mb-1" />
                <p className="text-sm font-semibold text-white leading-relaxed line-clamp-3 group-hover:text-pink-100 transition-colors">
                  "{t.quote}"
                </p>
              </div>

              {/* Rented Units Tags */}
              <div className="space-y-1.5 mb-5 p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <p className="text-[10px] font-mono uppercase text-slate-400 font-semibold flex items-center gap-1">
                  <Truck className="w-3 h-3 text-pink-400" />
                  Armada Yang Disewa:
                </p>
                <div className="space-y-1">
                  {t.rentedUnits.map((unit, idx) => (
                    <p key={idx} className="text-xs text-slate-200 font-medium truncate">
                      • {unit}
                    </p>
                  ))}
                </div>
              </div>

              {/* Project & Client Bio Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${t.avatarColor} flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-md`}>
                    {t.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{t.name}</p>
                    <p className="text-[11px] text-pink-400 font-medium truncate">{t.role}</p>
                    <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 shrink-0 text-slate-400" />
                      {t.company}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModalTestimonial(t)}
                  title="Baca ulasan lengkap & SPK"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-pink-600 text-slate-300 hover:text-white transition-colors shrink-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Bar */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-pink-950/40 via-[#101726] to-[#0c121d] border border-pink-500/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Siap Bermitra dengan Standar K3 & Kesiapan Mesin BUMN?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Dapatkan konsultasi gratis kecocokan spesifikasi alat berat, perhitungan biaya mob-demob lowbed, dan penerbitan draft SPK digital instan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenBooking}
              className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-pink-600/30 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              Mulai Reservasi Proyek
            </button>
            <a
              href="https://wa.me/628119208800?text=Halo%20Palugada%20Alat%20Berat%20Pontianak,%20saya%20ingin%20konsultasi%20kebutuhan%20sewa%20alat%20berat%20proyek"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs rounded-lg transition-colors border border-slate-700"
            >
              Konsultasi WhatsApp
            </a>
          </div>
        </div>

        {/* Modal Detail Testimonial & Verifikasi SPK */}
        {activeModalTestimonial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#0e1422] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
              <button
                onClick={() => setActiveModalTestimonial(null)}
                className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${activeModalTestimonial.avatarColor} flex items-center justify-center text-white font-extrabold text-lg shadow-md`}>
                  {activeModalTestimonial.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-white">{activeModalTestimonial.name}</h4>
                  <p className="text-xs text-pink-400 font-semibold">{activeModalTestimonial.role} — {activeModalTestimonial.company}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {activeModalTestimonial.projectLocation}
                  </p>
                </div>
              </div>

              {/* Project Card Info */}
              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Nama Proyek:</span>
                  <span className="font-semibold text-white text-right">{activeModalTestimonial.projectName}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">No. Referensi SPK:</span>
                  <span className="font-mono text-pink-400 font-semibold">{activeModalTestimonial.spkRef}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Durasi Operasi:</span>
                  <span className="text-emerald-400 font-medium">{activeModalTestimonial.durationMonths} Bulan Kerja Berjalan</span>
                </div>
              </div>

              {/* Full Review Text */}
              <div className="space-y-2">
                <h5 className="text-xs font-mono uppercase text-slate-400 tracking-wider font-semibold">
                  Ulasan Lengkap Manajer Proyek:
                </h5>
                <p className="text-sm text-slate-200 leading-relaxed bg-[#121929] p-4 rounded-xl border border-slate-800">
                  "{activeModalTestimonial.fullReview}"
                </p>
              </div>

              {/* Units Rented */}
              <div>
                <p className="text-xs font-mono uppercase text-slate-400 tracking-wider font-semibold mb-2">
                  Daftar Alat Berat Dalam Kontrak:
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeModalTestimonial.rentedUnits.map((u, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-800 text-slate-200 text-xs rounded border border-slate-700 font-medium">
                      {u}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Terverifikasi SPK Aktif & Sertifikasi K3</span>
                </div>
                <button
                  onClick={() => setActiveModalTestimonial(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
