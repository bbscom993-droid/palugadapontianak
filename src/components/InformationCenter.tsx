import React, { useState } from 'react';
import { InformationArticle } from '../types/equipment';
import { INITIAL_INFORMATION_ARTICLES } from '../data/activityAndInfoData';
import { 
  FileText, 
  BookOpen, 
  ShieldCheck, 
  Truck, 
  Wrench, 
  Search, 
  Download, 
  CheckCircle2, 
  ChevronRight, 
  HelpCircle, 
  PhoneCall, 
  X,
  ExternalLink,
  Award,
  AlertTriangle
} from 'lucide-react';

interface InformationCenterProps {
  onOpenBooking?: () => void;
}

export const InformationCenter: React.FC<InformationCenterProps> = ({ onOpenBooking }) => {
  const [articles] = useState<InformationArticle[]>(INITIAL_INFORMATION_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticleModal, setActiveArticleModal] = useState<InformationArticle | null>(null);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const categories = [
    { key: 'ALL', label: 'Semua Informasi' },
    { key: 'REGULASI_K3', label: 'Regulasi K3 & Lisensi' },
    { key: 'MOBILISASI_LOGISTIK', label: 'Logistik & Mob-Demob' },
    { key: 'PERAWATAN_MESIN', label: 'Perawatan & Biosolar' },
    { key: 'PANDUAN_SEWA', label: 'Panduan Sewa & Kontrak' },
  ];

  const faqs = [
    {
      q: 'Apa dokumen legalitas yang dibutuhkan perusahaan untuk menyewa alat berat?',
      a: 'Penyewa korporat (PT/CV/BUMN) cukup melampirkan NIB (Nomor Induk Berusaha), NPWP Perusahaan, KTP Penanggung Jawab (PIC), serta Surat Perintah Kerja (SPK) proyek. Sistem reservasi online Palugada menerbitkan draft SPK digital seketika.',
    },
    {
      q: 'Bagaimana penghitungan jam kerja jika terjadi hujan lebat di lokasi proyek (Rainy Days)?',
      a: 'Sesuai klausul standar kontrak sewa kami, hari hujan lebat yang mengakibatkan penghentian pekerjaan oleh Site Manager / HSE proyek tidak dikenakan biaya konsumsi bahan bakar. Untuk sewa bulanan dengan minimum cas 200 HM, jam yang hilang dapat dikompensasikan pada hari kerja berikutnya dalam periode sewa yang sama.',
    },
    {
      q: 'Apakah seluruh unit alat berat Palugada telah dilengkapi Surat Ijin Alat (SIA)?',
      a: 'Benar, 100% armada kami memiliki Surat Ijin Alat (SIA) yang masih aktif dan terdaftar di Kemenaker RI. Operator kami juga memegang Surat Izin Operator (SIO) Kelas 1 resmi sesuai klasifikasi tonase mesin.',
    },
    {
      q: 'Bagaimana prosedur penanganan jika unit mengalami kerusakan (breakdown) di lapangan?',
      a: 'Palugada memiliki tim Mobile Mechanic Service 24 jam dengan respon darurat maksimal 4 jam ke lokasi proyek di area Hub kami. Jika perbaikan membutuhkan waktu lebih dari 12 jam, kami memberlakukan Garansi Ganti Unit Pengganti 1x24 jam tanpa tambahan biaya mobilisasi.',
    },
    {
      q: 'Apakah penyewa boleh menyediakan bahan bakar solar sendiri?',
      a: 'Boleh. Anda dapat memilih paket "Lepas Kunci" atau "Unit + Operator". Namun bahan bakar yang digunakan wajib memenuhi spesifikasi Biosolar B35 / Dexlite murni tanpa campuran air atau pelarut yang berisiko merusak sistem injeksi common rail mesin.',
    },
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = selectedCategory === 'ALL' || art.category === selectedCategory;
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.keyPoints.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (docName: string) => {
    setDownloadToast(docName);
    setTimeout(() => setDownloadToast(null), 4000);
  };

  return (
    <section className="py-12 bg-[#090d16] text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Toast Notifikasi Unduh */}
        {downloadToast && (
          <div className="fixed top-24 right-6 z-50 p-4 bg-pink-600 text-white rounded-xl shadow-2xl flex items-center gap-3 border border-pink-400 font-sans animate-bounce">
            <Download className="w-5 h-5" />
            <div>
              <p className="font-bold text-sm">Dokumen Sedang Diunduh:</p>
              <p className="text-xs text-pink-100 font-mono">{downloadToast}</p>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-8 mb-8 border-b border-slate-800 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-pink-400 mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Pusat Regulasi & Wawasan Industri</span>
              <span>·</span>
              <span>Palugada Knowledge Base</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Pusat Informasi, SOP & Regulasi Alat Berat
            </h1>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Panduan resmi sertifikasi keselamatan Kemenaker, regulasi mobilisasi muatan tronton lowbed, panduan penggunaan biosolar B35, dan transparansi kontrak sewa.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onOpenBooking && (
              <button
                onClick={onOpenBooking}
                className="px-5 py-3 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-pink-600/30"
              >
                <span>Konsultasi & Reservasi Unit</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Topic Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1.5 p-1 bg-[#121927] rounded-lg border border-slate-800 overflow-x-auto text-xs">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-2 font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedCategory === cat.key
                    ? 'bg-pink-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari regulasi, SOP, atau topik..."
              className="w-full bg-[#121927] border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-[#101624] border border-slate-800 hover:border-pink-500/50 rounded-2xl p-6 transition-all shadow-lg flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                  <span className="px-2.5 py-1 bg-pink-500/10 border border-pink-500/30 text-pink-400 font-bold rounded">
                    {article.categoryLabel}
                  </span>
                  <span className="text-slate-400">{article.readTime}</span>
                </div>

                <h3 className="text-lg font-bold text-white hover:text-pink-400 transition-colors mt-2">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {article.summary}
                </p>

                {/* Key Points Preview */}
                <div className="mt-4 space-y-1.5 p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block mb-1">
                    Poin Penting Regulasi:
                  </span>
                  {article.keyPoints.slice(0, 2).map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">
                  Rilis: {article.publishedDate}
                </span>

                <div className="flex items-center gap-3">
                  {article.downloadableDoc && (
                    <button
                      onClick={() => handleDownload(article.downloadableDoc!)}
                      className="text-slate-300 hover:text-white flex items-center gap-1 font-mono text-[11px]"
                    >
                      <Download className="w-3.5 h-3.5 text-pink-400" />
                      <span>SOP (.PDF)</span>
                    </button>
                  )}
                  <button
                    onClick={() => setActiveArticleModal(article)}
                    className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded text-xs transition-colors flex items-center gap-1"
                  >
                    <span>Baca Lengkap</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Official Document Download Center Banner */}
        <div className="p-8 bg-[#111726] border border-slate-800 rounded-2xl mb-16 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Format Dokumen Legal Resmi Palugada</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                Download Berkas Standar Kontrak & Checklist K3
              </h3>
              <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                Unduh berkas template legalitas sewa alat berat untuk keperluan audit proyek, pengajuan anggaran ke divisi procurement, dan verifikasi tim safety HSE di lapangan.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => handleDownload('Template-SPK-Digital-Palugada-2026.docx')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-pink-400" />
                <span>Template SPK (.DOCX)</span>
              </button>

              <button
                onClick={() => handleDownload('Checklist-K3-Pre-Operation-Heavy-Equipment.pdf')}
                className="px-4 py-2.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-pink-600/30"
              >
                <Download className="w-4 h-4" />
                <span>Form Checklist K3 (.PDF)</span>
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-1.5 text-xs font-mono uppercase tracking-wider text-pink-400 mb-2">
              <HelpCircle className="w-4 h-4" />
              <span>Tanya Jawab Seputar Penyewaan Alat Berat</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <p className="text-xs text-slate-400 mt-2">
              Informasi praktis seputar mekanisme kontrak sewa, mobilisasi armada, dan garansi operasional.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-[#111726] border border-slate-800 rounded-xl overflow-hidden text-xs transition-colors open:border-pink-500/40"
              >
                <summary className="p-4 sm:p-5 font-bold text-white cursor-pointer list-none flex items-center justify-between gap-4 group-hover:text-pink-400 transition-colors">
                  <span className="text-sm">{faq.q}</span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform font-mono text-base">
                    ↓
                  </span>
                </summary>
                <div className="p-4 sm:p-5 pt-0 text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-900/30">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          {/* Hotline CTA */}
          <div className="mt-12 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl text-center space-y-3">
            <p className="text-xs text-slate-400">
              Butuh penjelasan spesifik mengenai spesifikasi teknis alat berat untuk proyek Anda?
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2 text-white">
                <PhoneCall className="w-4 h-4 text-pink-400" />
                <span>Hotline Teknis: +62 811-920-8800 (24 Jam)</span>
              </div>
              <span className="text-slate-600">·</span>
              <span className="text-pink-400 font-bold">Konsultasi Gratis Perencanaan Mob-Demob</span>
            </div>
          </div>
        </div>

        {/* Modal Baca Artikel Lengkap */}
        {activeArticleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#101624] border border-slate-700 rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8 text-xs font-sans">
              <button
                onClick={() => setActiveArticleModal(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-2 text-xs font-mono text-pink-400 font-bold mb-1">
                  <span>{activeArticleModal.categoryLabel}</span>
                  <span>·</span>
                  <span>{activeArticleModal.readTime}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {activeArticleModal.title}
                </h2>
                <div className="flex items-center gap-3 text-slate-400 text-[11px] font-mono mt-2">
                  <span>Penulis: {activeArticleModal.author}</span>
                  <span>·</span>
                  <span>Dipublikasikan: {activeArticleModal.publishedDate}</span>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="mb-6 p-4 bg-pink-500/10 border border-pink-500/30 rounded-xl space-y-2">
                <span className="text-xs font-mono uppercase font-bold text-pink-400 block">
                  Ringkasan Eksekutif & Poin Kunci:
                </span>
                {activeArticleModal.keyPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* Article Content Paragraphs */}
              <div className="space-y-4 text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                {activeArticleModal.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                {activeArticleModal.downloadableDoc ? (
                  <button
                    onClick={() => handleDownload(activeArticleModal.downloadableDoc!)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold text-xs flex items-center gap-2 border border-slate-700"
                  >
                    <Download className="w-4 h-4 text-pink-400" />
                    <span>Unduh Dokumen Panduan (.PDF)</span>
                  </button>
                ) : (
                  <div></div>
                )}

                <button
                  onClick={() => setActiveArticleModal(null)}
                  className="px-5 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded text-xs uppercase"
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
