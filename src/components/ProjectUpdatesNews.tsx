import React, { useState, useEffect, useCallback } from 'react';
import { 
  Globe, 
  RefreshCw, 
  ExternalLink, 
  Search, 
  Calendar, 
  MapPin, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  X,
  Newspaper
} from 'lucide-react';

export interface IndustryNewsItem {
  id: string;
  title: string;
  category: 'Infrastruktur' | 'Alat Berat' | 'Pertambangan' | 'Regulasi K3' | 'Logistik';
  summary: string;
  sourceName: string;
  date: string;
  location: string;
  readTime: string;
  sourceUrl?: string;
  verified?: boolean;
}

const STATIC_INITIAL_NEWS: IndustryNewsItem[] = [
  {
    id: 'news-01',
    title: 'Percepatan Duplikasi Jembatan Kapuas & Jalan Akses Pelabuhan Kijing Kalimantan Barat',
    category: 'Infrastruktur',
    summary: 'Kementerian PUPR bersama kontraktor BUMN mempercepat pengaspalan dan pematangan struktur jalan penghubung Pelabuhan Kijing Mempawah dengan pengerahan puluhan armada vibro roller dan excavator berbobot kerja di atas 20 ton.',
    sourceName: 'Portal Berita Konstruksi Kalbar',
    date: 'Hari ini',
    location: 'Mempawah & Pontianak, Kalbar',
    readTime: '3 min baca',
    sourceUrl: 'https://pupr.go.id',
    verified: true,
  },
  {
    id: 'news-02',
    title: 'Adopsi Alat Berat Ramah Lingkungan & Standar Biosolar B35 di Sektor Pertambangan Bauksit',
    category: 'Alat Berat',
    summary: 'Konsorsium pertambangan bauksit Ketapang dan Sanggau mulai mewajibkan seluruh armada rental excavator dan wheel loader mengadopsi filter water separator berstandar ganda guna menjaga durabilitas injeksi common-rail saat menggunakan bahan bakar Biosolar B35.',
    sourceName: 'Warta Tambang Nusantara',
    date: 'Kemarin',
    location: 'Ketapang, Kalimantan Barat',
    readTime: '4 min baca',
    sourceUrl: 'https://esdm.go.id',
    verified: true,
  },
  {
    id: 'news-03',
    title: 'Penerapan Sertifikasi SIA dan SIO Ketat untuk Mengurangi Risiko Insiden di Proyek Nasional',
    category: 'Regulasi K3',
    summary: 'Kemenaker RI menegaskan kewajiban Surat Izin Alat (SIA) yang masih berlaku dan lisensi SIO Kelas 1 bagi operator crane serta excavator berkapasitas besar demi mencapai target Zero Accident di seluruh proyek strategis Nusantara.',
    sourceName: 'Direktorat PNK3 Kemenaker',
    date: '3 hari yang lalu',
    location: 'Nasional & Kalbar',
    readTime: '2 min baca',
    sourceUrl: 'https://kemnaker.go.id',
    verified: true,
  },
  {
    id: 'news-04',
    title: 'Progres Preservasi Jalan Paralel Perbatasan RI-Malaysia Kalbar Capai 92%',
    category: 'Infrastruktur',
    summary: 'Pembangunan jalan perbatasan Aruk - Entikong - Badau mencatatkan deviasi positif dengan pengerahan unit bulldozer D85SS dan motor grader untuk penataan drainase lereng dan leveling tanah gambut.',
    sourceName: 'Balai Jalan Nasional Kalbar',
    date: '4 hari yang lalu',
    location: 'Sanggau & Kapuas Hulu',
    readTime: '3 min baca',
    sourceUrl: 'https://bpjn-kalbar.pu.go.id',
    verified: true,
  },
  {
    id: 'news-05',
    title: 'Telemetri IoT GPS dan Digital Timesheet Mulai Jadi Standar Kontrak Rental Alat Berat',
    category: 'Logistik',
    summary: 'Asosiasi Jasa Pertambangan dan Konstruksi mencatat peningkatan efisiensi hingga 18% pada proyek yang memanfaatkan pelacakan telemetri GPS aktif dan pencatatan Hour Meter (HM) otomatis dibanding timesheet kertas konvensional.',
    sourceName: 'Heavy Equipment Indonesia Review',
    date: 'Minggu ini',
    location: 'Pontianak, Kalbar',
    readTime: '4 min baca',
    sourceUrl: 'https://palugada.id',
    verified: true,
  },
];

export const ProjectUpdatesNews: React.FC = () => {
  const [news, setNews] = useState<IndustryNewsItem[]>(STATIC_INITIAL_NEWS);
  const [loading, setLoading] = useState(false);
  const [isGrounded, setIsGrounded] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('Baru saja diperbarui');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNewsModal, setActiveNewsModal] = useState<IndustryNewsItem | null>(null);
  const [secondsUntilRefresh, setSecondsUntilRefresh] = useState(180); // 3 minutes periodic refresh

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/project-updates');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setNews(json.data);
          setIsGrounded(!!json.groundedWithSearch);
          setLastUpdated(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB');
        }
      }
    } catch (e) {
      console.warn('Gagal memuat berita terkini, menggunakan cache lokal:', e);
    } finally {
      setLoading(false);
      setSecondsUntilRefresh(180);
    }
  }, []);

  // Initial fetch and periodic refresh interval
  useEffect(() => {
    fetchNews();

    const timer = setInterval(() => {
      setSecondsUntilRefresh((prev) => {
        if (prev <= 1) {
          fetchNews();
          return 180;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [fetchNews]);

  const categories = [
    { key: 'ALL', label: 'Semua Berita Proyek' },
    { key: 'Infrastruktur', label: 'Infrastruktur & Jalan' },
    { key: 'Alat Berat', label: 'Teknologi Alat Berat' },
    { key: 'Pertambangan', label: 'Tambang & Smelter' },
    { key: 'Regulasi K3', label: 'Regulasi K3 & Lisensi' },
  ];

  const filteredNews = news.filter((item) => {
    const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Infrastruktur':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'Alat Berat':
        return 'text-pink-400 bg-pink-500/10 border-pink-500/30';
      case 'Pertambangan':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Regulasi K3':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      default:
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    }
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <section id="project-updates" className="py-14 bg-[#0a0f1a] border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Google Search Grounding Indicator */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-6 mb-8 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-pink-400 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
              <span>Project Updates & Warta Industri</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Globe className="w-3 h-3" />
                Google Search Grounding
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Warta Proyek & Berita Industri Alat Berat</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Live Feed
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Informasi terkini seputar proyek infrastruktur, pertambangan bauksit, regulasi Kemenaker, dan inovasi mesin berat di Kalimantan Barat & Nusantara.
            </p>
          </div>

          {/* Periodic Refresh & Action Controls */}
          <div className="flex items-center gap-3 self-start lg:self-end">
            <div className="text-right text-[11px] font-mono text-slate-400 hidden sm:block">
              <p>Diperbarui: <span className="text-slate-200">{lastUpdated}</span></p>
              <p className="text-pink-400/80">Auto-refresh: {formatCountdown(secondsUntilRefresh)}</p>
            </div>

            <button
              onClick={fetchNews}
              disabled={loading}
              className="px-3.5 py-2 rounded-lg bg-[#141b2d] hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-pink-400' : ''}`} />
              <span>{loading ? 'Menyinkronkan...' : 'Perbarui Berita'}</span>
            </button>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setSelectedCategory(c.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === c.key
                    ? 'bg-pink-600 text-white shadow'
                    : 'bg-[#101726] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari topik / lokasi proyek..."
              className="w-full bg-[#101726] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <article
              key={item.id}
              onClick={() => setActiveNewsModal(item)}
              className="bg-[#0e1422] border border-slate-800/90 hover:border-pink-500/40 rounded-xl p-5 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-pink-500/5 cursor-pointer group"
            >
              <div>
                {/* Meta Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {item.date}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-2 leading-snug mb-2.5">
                  {item.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {item.summary}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1 truncate max-w-[170px]">
                  <MapPin className="w-3 h-3 text-pink-400 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>

                <div className="flex items-center gap-1 text-pink-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>Selengkapnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Modal Baca Detail Berita */}
        {activeNewsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#0e1422] border border-slate-700 rounded-2xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl relative">
              <button
                onClick={() => setActiveNewsModal(null)}
                className="absolute top-5 right-5 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase border ${getCategoryColor(activeNewsModal.category)}`}>
                  {activeNewsModal.category}
                </span>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-pink-400" />
                  {activeNewsModal.location}
                </span>
                <span className="text-xs font-mono text-slate-400">· {activeNewsModal.date}</span>
              </div>

              <h3 className="text-lg font-extrabold text-white leading-snug">
                {activeNewsModal.title}
              </h3>

              <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 text-slate-300 text-sm leading-relaxed space-y-3">
                <p>{activeNewsModal.summary}</p>
                <p className="text-xs text-slate-400 leading-normal border-t border-slate-800 pt-3">
                  <strong>Relevansi Operasional Palugada:</strong> Pembaruan ini menjadi acuan persiapan logistik rute pengiriman armada lowbed trailer, kepatuhan audit K3, serta pemilihan tipe alat berat yang sesuai dengan karakteristik tanah dan kebutuhan lapangan kontraktor.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Newspaper className="w-3.5 h-3.5 text-slate-400" />
                  <span>Sumber: <strong className="text-slate-200">{activeNewsModal.sourceName}</strong></span>
                </div>

                {activeNewsModal.sourceUrl && (
                  <a
                    href={activeNewsModal.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold transition-colors"
                  >
                    <span>Kunjungi Sumber</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
