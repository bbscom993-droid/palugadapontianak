import React, { useState } from 'react';
import { ProjectActivity } from '../types/equipment';
import { INITIAL_PROJECT_ACTIVITIES } from '../data/activityAndInfoData';
import { 
  Play, 
  Pause, 
  Video, 
  Upload, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Fuel, 
  Activity, 
  Gauge, 
  Search, 
  CheckCircle2, 
  X, 
  Filter, 
  Sparkles,
  ExternalLink,
  Plus
} from 'lucide-react';

interface ProjectActivitiesProps {
  onOpenReservation?: () => void;
}

export const ProjectActivities: React.FC<ProjectActivitiesProps> = ({ onOpenReservation }) => {
  const [activities, setActivities] = useState<ProjectActivity[]>(INITIAL_PROJECT_ACTIVITIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideoModal, setActiveVideoModal] = useState<ProjectActivity | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // New activity form states
  const [newTitle, setNewTitle] = useState('');
  const [newUnitCode, setNewUnitCode] = useState('PLG-EXC-08');
  const [newEquipmentName, setNewEquipmentName] = useState('CAT 320D3 Hydraulic Excavator');
  const [newProjectName, setNewProjectName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newOperatorName, setNewOperatorName] = useState('');
  const [newCategory, setNewCategory] = useState<ProjectActivity['category']>('CUT_AND_FILL');
  const [newDescription, setNewDescription] = useState('');
  const [newHmAdded, setNewHmAdded] = useState(4.5);
  const [newFuelConsumed, setNewFuelConsumed] = useState(70);
  const [newWeather, setNewWeather] = useState('Cerah Siang Hari (32°C)');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [uploadSuccessToast, setUploadSuccessToast] = useState(false);

  const categories = [
    { key: 'ALL', label: 'Semua Kegiatan' },
    { key: 'CUT_AND_FILL', label: 'Cut & Fill' },
    { key: 'MOBILISASI', label: 'Mobilisasi Lowbed' },
    { key: 'HEAVY_LIFTING', label: 'Heavy Lifting (Crane)' },
    { key: 'LAND_CLEARING', label: 'Land Clearing' },
    { key: 'MAINTENANCE', label: 'Maintenance & Service' },
  ];

  const filteredActivities = activities.filter((act) => {
    const matchesCategory = selectedCategory === 'ALL' || act.category === selectedCategory;
    const matchesSearch = 
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.unitCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.operatorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newProjectName) return;

    const newActivity: ProjectActivity = {
      id: `act-${Date.now()}`,
      title: newTitle,
      unitCode: newUnitCode,
      equipmentName: newEquipmentName,
      projectName: newProjectName,
      location: newLocation || 'Kalimantan Timur / IKN Site',
      date: new Date().toISOString().split('T')[0],
      time: 'Baru saja',
      operatorName: newOperatorName || 'Operator Bersertifikat SIO',
      category: newCategory,
      description: newDescription || 'Dokumentasi lapangan kegiatan operasional alat berat di lokasi proyek.',
      videoUrl: newVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      videoThumbnail: activities[0].videoThumbnail,
      videoDuration: '02:00',
      metrics: {
        hmAdded: Number(newHmAdded) || 4.0,
        fuelConsumedLiters: Number(newFuelConsumed) || 60,
        weatherCondition: newWeather,
      },
      tags: ['Operasi Baru', 'Verifikasi Lapangan', 'Palugada'],
    };

    setActivities([newActivity, ...activities]);
    setIsUploadModalOpen(false);
    setUploadSuccessToast(true);
    setTimeout(() => setUploadSuccessToast(false), 4000);

    // Reset fields
    setNewTitle('');
    setNewProjectName('');
    setNewLocation('');
    setNewDescription('');
  };

  const handleUseSampleVideo = (type: 'excavator' | 'crane' | 'dozer') => {
    if (type === 'excavator') {
      setNewTitle('Inspeksi Operasi Excavator CAT 320D3 di Galian Saluran');
      setNewUnitCode('PLG-EXC-08');
      setNewEquipmentName('CAT 320D3 Hydraulic Excavator');
      setNewProjectName('Pembangunan Saluran Drainase Induk IKN');
      setNewLocation('KIPP IKN Nusantara, Kalimantan Timur');
      setNewOperatorName('Ahmad Fauzi (SIO-EXC-4122)');
      setNewCategory('CUT_AND_FILL');
      setNewDescription('Pembuatan parit drainase penahan erosi lereng galian. Video memperlihatkan sudut jangkauan boom aman dari tiang pancang.');
      setNewVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    } else if (type === 'crane') {
      setNewTitle('Pengangkatan Silo Tangki Semen 35T ke Fondasi');
      setNewUnitCode('PLG-CRN-02');
      setNewEquipmentName('Sany STC500E 50T Mobile Crane');
      setNewProjectName('Batching Plant Beton Precast');
      setNewLocation('Cilegon, Banten');
      setNewOperatorName('Budi Handoko (SIO-CRN-8819)');
      setNewCategory('HEAVY_LIFTING');
      setNewDescription('Ereksi silo tangki semen kapasitas 200 ton. Pengujian outrigger pada landasan pelat baja 25mm lolos verifikasi safety officer.');
      setNewVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4');
    } else {
      setNewTitle('Perataan Tanah Lempung Merah Landasan Jalan Hauling');
      setNewUnitCode('PLG-DOZ-03');
      setNewEquipmentName('Komatsu D85ESS-2 Crawler Bulldozer');
      setNewProjectName('Jalan Angkut Batubara KM 24');
      setNewLocation('Kutai Barat, Kalimantan Timur');
      setNewOperatorName('Sugiono (SIO-DOZ-6610)');
      setNewCategory('LAND_CLEARING');
      setNewDescription('Dozer blade semi-U bekerja mendorong lapisan tanah urugan overburden. Video monitoring getaran track shoe pada medan berbatu.');
      setNewVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    }
  };

  return (
    <section className="py-12 bg-[#090d16] text-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Toast Notifikasi Sukses */}
        {uploadSuccessToast && (
          <div className="fixed top-24 right-6 z-50 p-4 bg-pink-600 text-white rounded-xl shadow-2xl flex items-center gap-3 border border-pink-400 font-sans animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <div>
              <p className="font-bold text-sm">Video Kegiatan Berhasil Dipublikasikan!</p>
              <p className="text-xs text-pink-100">Log aktivitas lapangan telah tercatat ke radar dispatch armada.</p>
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between pb-8 mb-8 border-b border-slate-800 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-pink-400 mb-2">
              <Video className="w-4 h-4" />
              <span>Dokumentasi Visual & Kegiatan Lapangan</span>
              <span>·</span>
              <span>Palugada Field Logs</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Kegiatan Proyek & Rekaman Video Operasional
            </h1>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Transparansi penuh pekerjaan unit alat berat di lapangan: mobilisasi lowbed, pengerukan cut & fill, pengangkatan girder crane, dan pemeliharaan mesin berkala.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-5 py-3 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-pink-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Video Kegiatan Baru</span>
            </button>
            {onOpenReservation && (
              <button
                onClick={onOpenReservation}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
              >
                Sewa Alat Serupa
              </button>
            )}
          </div>
        </div>

        {/* Stat Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-[#111726] border border-slate-800 rounded-xl">
            <span className="text-[11px] text-slate-400 font-mono block">Unit Aktif Terdokumentasi:</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">48 Unit Mesin</span>
            <span className="text-[10px] text-pink-400 font-mono">100% Dilengkapi Telemetri</span>
          </div>

          <div className="p-4 bg-[#111726] border border-slate-800 rounded-xl">
            <span className="text-[11px] text-slate-400 font-mono block">Rata-rata Hour Meter / Hari:</span>
            <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">7.4 Jam (HM)</span>
            <span className="text-[10px] text-slate-400 font-mono">Efisiensi Siklus Tinggi</span>
          </div>

          <div className="p-4 bg-[#111726] border border-slate-800 rounded-xl">
            <span className="text-[11px] text-slate-400 font-mono block">Catatan Keselamatan Kerja:</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">Zero Accident</span>
            <span className="text-[10px] text-emerald-400 font-mono">Standar K3 Kemenaker Valid</span>
          </div>

          <div className="p-4 bg-[#111726] border border-slate-800 rounded-xl">
            <span className="text-[11px] text-slate-400 font-mono block">Sebaran Lokasi Proyek:</span>
            <span className="text-2xl font-extrabold text-pink-400 mt-1 block">14 Provinsi</span>
            <span className="text-[10px] text-slate-400 font-mono">Sumatera s/d Papua</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Functional Category Tabs */}
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

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari proyek, alat, atau operator..."
              className="w-full bg-[#121927] border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        {/* Video & Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="bg-[#101624] border border-slate-800 hover:border-pink-500/50 rounded-2xl overflow-hidden shadow-lg transition-all group flex flex-col"
            >
              {/* Video Thumbnail with Play Button */}
              <div 
                className="relative aspect-video bg-black cursor-pointer overflow-hidden"
                onClick={() => setActiveVideoModal(act)}
              >
                {act.videoThumbnail ? (
                  <img
                    src={act.videoThumbnail}
                    alt={act.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900">
                    <Video className="w-12 h-12 text-slate-700" />
                  </div>
                )}
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center transition-colors">
                  <div className="w-12 h-12 rounded-full bg-pink-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-1 fill-white" />
                  </div>
                </div>

                {/* Duration Badge */}
                {act.videoDuration && (
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-1 bg-black/75 backdrop-blur-sm rounded text-[10px] font-mono text-white">
                    {act.videoDuration}
                  </div>
                )}

                {/* Unit Tag */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-pink-600 text-white text-[11px] font-mono font-bold rounded">
                  {act.unitCode}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {act.date}
                    </span>
                    <span className="text-pink-400">{act.time}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-pink-400 transition-colors line-clamp-2">
                    {act.title}
                  </h3>

                  <div className="flex items-center gap-1 text-xs text-slate-300 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                    <span className="truncate">{act.projectName}</span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {act.description}
                  </p>
                </div>

                {/* Telemetry Metrics on Site */}
                <div className="pt-3 border-t border-slate-800/80 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Jam Operasi (HM):</span>
                      <strong className="text-emerald-400">+{act.metrics.hmAdded} Jam</strong>
                    </div>
                    <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Konsumsi Solar:</span>
                      <strong className="text-slate-200">{act.metrics.fuelConsumedLiters} Liter</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
                    <span className="flex items-center gap-1.5 truncate">
                      <User className="w-3.5 h-3.5 text-pink-400" />
                      {act.operatorName}
                    </span>
                    <button
                      onClick={() => setActiveVideoModal(act)}
                      className="text-pink-400 hover:text-pink-300 font-bold flex items-center gap-1 text-[11px] shrink-0"
                    >
                      <span>Tonton Video</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="p-12 text-center bg-[#111726] rounded-2xl border border-slate-800 my-8">
            <Video className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">Tidak ada kegiatan yang cocok</h4>
            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau pilih filter kategori lainnya.</p>
          </div>
        )}

        {/* Modal Video Player */}
        {activeVideoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
            <div className="bg-[#101624] border border-slate-700 rounded-2xl max-w-3xl w-full shadow-2xl relative overflow-hidden my-8">
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-pink-400 block font-bold">
                    Pemutar Video Dokumentasi Lapangan · {activeVideoModal.unitCode}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {activeVideoModal.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveVideoModal(null)}
                  className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player */}
              <div className="aspect-video bg-black relative">
                {activeVideoModal.videoUrl ? (
                  <video
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                    src={activeVideoModal.videoUrl}
                  >
                    Browser Anda tidak mendukung tag video HTML5.
                  </video>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs p-6 text-center">
                    <Video className="w-12 h-12 mb-2 text-pink-400" />
                    <span>Rekaman video sedang diproses oleh tim dispatch drone & lapangan.</span>
                  </div>
                )}
              </div>

              {/* Video Information & Metrics */}
              <div className="p-5 space-y-4 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 text-slate-300 font-mono text-[11px] pb-3 border-b border-slate-800">
                  <span>Proyek: <strong className="text-white">{activeVideoModal.projectName}</strong></span>
                  <span>Lokasi: <strong className="text-white">{activeVideoModal.location}</strong></span>
                  <span>Operator: <strong className="text-pink-400">{activeVideoModal.operatorName}</strong></span>
                </div>

                <p className="text-slate-300 leading-relaxed">
                  {activeVideoModal.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Jam Operasi (HM):</span>
                    <strong className="text-white text-sm">+{activeVideoModal.metrics.hmAdded} HM</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Konsumsi BBM:</span>
                    <strong className="text-white text-sm">{activeVideoModal.metrics.fuelConsumedLiters} L</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Kondisi Cuaca:</span>
                    <strong className="text-white text-xs">{activeVideoModal.metrics.weatherCondition}</strong>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Status K3:</span>
                    <strong className="text-emerald-400 text-xs">SOP Terpenuhi</strong>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setActiveVideoModal(null)}
                    className="px-5 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded text-xs uppercase"
                  >
                    Tutup Pemutar Video
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Upload Video Kegiatan Baru */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#101624] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative my-8">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-mono uppercase text-pink-400 font-semibold mb-1">
                <Upload className="w-4 h-4" />
                <span>Publikasi Video Kegiatan Lapangan</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Unggah Rekaman Aktivitas Unit Alat Berat
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Bagikan perkembangan operasional harian di lokasi proyek, verifikasi jam kerja (HM), dan keselamatan lapangan.
              </p>

              {/* One-Click Sample Presets */}
              <div className="mb-6 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 block mb-2 font-semibold">
                  Isi Cepat dengan Contoh Skenario Proyek:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleUseSampleVideo('excavator')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-pink-600 hover:text-white text-slate-200 text-xs rounded transition-colors"
                  >
                    Galian Parit Excavator IKN
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUseSampleVideo('crane')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-pink-600 hover:text-white text-slate-200 text-xs rounded transition-colors"
                  >
                    Ereksi Silo Crane 35T
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUseSampleVideo('dozer')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-pink-600 hover:text-white text-slate-200 text-xs rounded transition-colors"
                  >
                    Landasan Jalan Dozer Tambang
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateActivity} className="space-y-4 text-xs font-sans">
                <div>
                  <label className="block text-slate-400 font-mono uppercase text-[11px] mb-1 font-semibold">
                    Judul Aktivitas Lapangan:
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Contoh: Pemadatan Lapis Pondasi Bawah Jalan Tol STA 14+200"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-mono uppercase text-[11px] mb-1 font-semibold">
                      Kode Unit & Tipe Mesin:
                    </label>
                    <select
                      value={newUnitCode}
                      onChange={(e) => {
                        setNewUnitCode(e.target.value);
                        if (e.target.value === 'PLG-EXC-08') setNewEquipmentName('CAT 320D3 Hydraulic Excavator');
                        if (e.target.value === 'PLG-DOZ-03') setNewEquipmentName('Komatsu D85ESS-2 Crawler Bulldozer');
                        if (e.target.value === 'PLG-CRN-02') setNewEquipmentName('Sany STC500E 50T Mobile Crane');
                        if (e.target.value === 'PLG-LDR-05') setNewEquipmentName('Caterpillar 950GC Wheel Loader');
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500"
                    >
                      <option value="PLG-EXC-08">PLG-EXC-08 · CAT 320D3</option>
                      <option value="PLG-DOZ-03">PLG-DOZ-03 · Komatsu D85ESS</option>
                      <option value="PLG-CRN-02">PLG-CRN-02 · Sany STC500E Crane</option>
                      <option value="PLG-LDR-05">PLG-LDR-05 · CAT 950GC Wheel Loader</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono uppercase text-[11px] mb-1 font-semibold">
                      Kategori Operasi:
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as ProjectActivity['category'])}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500"
                    >
                      <option value="CUT_AND_FILL">Galian & Timbunan (Cut & Fill)</option>
                      <option value="MOBILISASI">Mobilisasi / Unloading Lowbed</option>
                      <option value="HEAVY_LIFTING">Pengangkatan Beban (Heavy Lifting)</option>
                      <option value="LAND_CLEARING">Pembersihan Lahan (Land Clearing)</option>
                      <option value="MAINTENANCE">Perawatan Rutin & Servis Site</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 font-mono uppercase text-[11px] mb-1 font-semibold">
                      Nama Proyek:
                    </label>
                    <input
                      type="text"
                      required
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Contoh: Paket Pembangunan Jembatan Sei Mangkei"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono uppercase text-[11px] mb-1 font-semibold">
                      Kota & Provinsi:
                    </label>
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="Contoh: Simalungun, Sumatera Utara"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] mb-1 font-semibold">
                      HM Tambahan:
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newHmAdded}
                      onChange={(e) => setNewHmAdded(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] mb-1 font-semibold">
                      Solar Terpakai (L):
                    </label>
                    <input
                      type="number"
                      value={newFuelConsumed}
                      onChange={(e) => setNewFuelConsumed(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 uppercase text-[10px] mb-1 font-semibold">
                      Operator SIO:
                    </label>
                    <input
                      type="text"
                      value={newOperatorName}
                      onChange={(e) => setNewOperatorName(e.target.value)}
                      placeholder="Nama Operator"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white font-sans"
                    />
                  </div>
                </div>

                {/* Upload File / Video URL input */}
                <div>
                  <label className="block text-slate-400 font-mono uppercase text-[11px] mb-1 font-semibold">
                    File Rekaman Video Lapangan (.MP4 / .MOV / .WEBM):
                  </label>
                  <div className="p-4 bg-slate-900/60 border-2 border-dashed border-slate-700 hover:border-pink-500 rounded-xl text-center cursor-pointer transition-colors">
                    <Video className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                    <span className="font-bold text-white block">Tarik & Lepas File Video di Sini</span>
                    <span className="text-[11px] text-slate-400 block mt-1">atau klik untuk memilih dari perangkat / rekaman drone kamera site</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setNewVideoUrl(URL.createObjectURL(file));
                          if (!newTitle) setNewTitle(`Dokumentasi ${file.name.replace(/\.[^/.]+$/, '')}`);
                        }
                      }}
                      className="opacity-0 absolute inset-0 cursor-pointer"
                    />
                  </div>
                  {newVideoUrl && (
                    <div className="mt-2 text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Video siap diputar: Sumber media terpasang</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 font-mono uppercase text-[11px] mb-1 font-semibold">
                    Catatan Deskripsi Pekerjaan & Kondisi Site:
                  </label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Sebutkan kendala cuaca, kondisi tanah, atau kepatuhan K3 harian"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-extrabold uppercase rounded shadow-lg shadow-pink-600/25"
                  >
                    Publikasikan Kegiatan
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
