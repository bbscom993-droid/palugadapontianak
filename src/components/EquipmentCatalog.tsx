import React, { useState, useMemo } from 'react';
import { Equipment, EquipmentCategory } from '../types/equipment';
import { EQUIPMENT_LIST } from '../data/equipmentData';
import { formatIDR } from '../utils/formatters';
import { 
  Check, 
  Fuel, 
  Gauge, 
  SlidersHorizontal, 
  ArrowUpDown, 
  FileText, 
  Layers, 
  X, 
  CheckCircle, 
  Scale, 
  Calendar,
  AlertCircle,
  Zap,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';

interface EquipmentCatalogProps {
  onSelectEquipmentForBooking: (equipment: Equipment) => void;
  selectedCategoryFilter?: string;
}

export const EquipmentCatalog: React.FC<EquipmentCatalogProps> = ({
  onSelectEquipmentForBooking,
  selectedCategoryFilter = 'all',
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategoryFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDetailItem, setSelectedDetailItem] = useState<Equipment | null>(null);
  const [compareList, setCompareList] = useState<Equipment[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc'>('recommended');
  
  // Real-time Availability Status Checker states
  const [immediateDispatchOnly, setImmediateDispatchOnly] = useState<boolean>(false);
  const [checkerLocation, setCheckerLocation] = useState<string>('Pontianak Kota');
  const [showCheckerInfo, setShowCheckerInfo] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'Semua Kategori' },
    { id: 'excavator', label: 'Excavator' },
    { id: 'bulldozer', label: 'Bulldozer' },
    { id: 'crane', label: 'Mobile Crane' },
    { id: 'wheel-loader', label: 'Wheel Loader' },
    { id: 'compactor', label: 'Vibro Roller' },
    { id: 'dump-truck', label: 'Dump Truck' },
  ];

  const destinationOptions = [
    { name: 'Pontianak Kota (Siantan & Pontianak Barat)', eta: '1.5 - 2.5 Jam', pool: 'Pool Khatulistiwa KM 8', distance: '12 KM' },
    { name: 'Kubu Raya & Bandara Supadio', eta: '2 - 3 Jam', pool: 'Pool Arteri Supadio', distance: '18 KM' },
    { name: 'Mempawah & Terminal Pelabuhan Kijing', eta: '3 - 4 Jam', pool: 'Pool Khatulistiwa / Kijing Corridor', distance: '65 KM' },
    { name: 'Singkawang & Sambas (Perbatasan Aruk)', eta: '5 - 6 Jam', pool: 'Hub Pantura Kalbar', distance: '145 KM' },
    { name: 'Sanggau / Tayan (Smelter Bauksit)', eta: '4 - 5 Jam', pool: 'Trans-Kalimantan Hub', distance: '110 KM' },
    { name: 'Ketapang & Kendawangan (Bauksit Mine)', eta: '1 - 2 Hari (Via LCT Ponton)', pool: 'Pelabuhan Sungai Ketapang', distance: '210 KM' },
  ];

  const currentDestination = destinationOptions.find((d) => d.name.startsWith(checkerLocation)) || destinationOptions[0];

  const filteredEquipment = useMemo(() => {
    return EQUIPMENT_LIST.filter((item) => {
      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDispatch = !immediateDispatchOnly || item.isImmediateDispatchAvailable === true;
      return matchCategory && matchSearch && matchDispatch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.hourlyRate - b.hourlyRate;
      if (sortBy === 'price-desc') return b.hourlyRate - a.hourlyRate;
      return 0;
    });
  }, [activeCategory, searchQuery, sortBy, immediateDispatchOnly]);

  const toggleCompare = (item: Equipment) => {
    if (compareList.some((c) => c.id === item.id)) {
      setCompareList(compareList.filter((c) => c.id !== item.id));
    } else {
      if (compareList.length >= 3) {
        alert('Maksimal membandingkan 3 unit sekaligus.');
        return;
      }
      setCompareList([...compareList, item]);
    }
  };

  return (
    <section id="catalog" className="py-12 lg:py-16 bg-[#0b0f17] border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-pink-400 mb-1">
              <span>Palugada Heavy Fleet</span>
              <span>·</span>
              <span>Siap Operasi 100%</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Katalog Armada & Spesifikasi Alat Berat
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Unit terawat berkala dengan sertifikasi SIA Kemenaker, siap dikirim ke lokasi proyek menggunakan armada lowbed trailer kami.
            </p>
          </div>

          {/* Quick Search & Sort */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari tipe, merk CAT/Komatsu..."
                className="bg-[#121927] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-400 w-48 sm:w-60 focus:outline-none focus:border-pink-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 bg-[#121927] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-pink-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-white focus:outline-none text-xs"
              >
                <option value="recommended" className="bg-slate-900">Rekomendasi</option>
                <option value="price-asc" className="bg-slate-900">Tarif: Terendah</option>
                <option value="price-desc" className="bg-slate-900">Tarif: Tertinggi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs (Zero-Pill: functional segmented tabs) */}
        <div className="flex items-center gap-1.5 p-1 bg-[#121927] rounded-lg border border-slate-800 overflow-x-auto no-scrollbar mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-pink-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Equipment Cards Grid */}
        {filteredEquipment.length === 0 ? (
          <div className="p-12 text-center bg-[#111726] border border-slate-800 rounded-xl">
            <AlertCircle className="w-10 h-10 text-pink-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Unit Tidak Ditemukan</h3>
            <p className="text-xs text-slate-400 mb-4">
              Tidak ada alat berat yang sesuai dengan kata kunci pencarian Anda.
            </p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-slate-800 text-white rounded text-xs font-medium hover:bg-slate-700"
            >
              Reset Filter Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((item) => {
              const isComparing = compareList.some((c) => c.id === item.id);
              return (
                <div
                  key={item.id}
                  className="bg-[#111726] border border-slate-800 rounded-lg overflow-hidden flex flex-col hover:border-slate-700 transition-all group"
                >
                  {/* Card Image */}
                  <div className="relative h-52 bg-slate-900 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111726] via-transparent to-black/30" />

                    {/* Clean unboxed metadata on image overlay */}
                    <div className="absolute top-3 left-3 text-xs text-pink-300 font-mono font-semibold tracking-wider uppercase drop-shadow">
                      {item.brand} · {item.categoryLabel}
                    </div>

                    <div className="absolute bottom-3 right-3 text-right">
                      <span className="text-[11px] font-mono text-emerald-400 block font-semibold drop-shadow">
                        Ready {item.availableUnits} Unit
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-pink-400 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 mb-4 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Technical Specs 2x2 Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-slate-800 mb-4 bg-slate-900/40 rounded p-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-mono">Bobot Operasi</span>
                          <span className="font-semibold text-slate-200 tabular-nums">{item.specs.operatingWeight}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-mono">Daya Mesin</span>
                          <span className="font-semibold text-slate-200 tabular-nums">{item.specs.enginePower.split('@')[0]}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-mono">Kapasitas / Bak</span>
                          <span className="font-semibold text-slate-200">{item.specs.capacity}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-mono">Konsumsi BBM</span>
                          <span className="font-semibold text-slate-200">{item.specs.fuelConsumption.split('(')[0]}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & CTA Controls */}
                    <div>
                      <div className="flex items-baseline justify-between mb-4">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">Mulai Dari (Jam-jaman)</span>
                          <span className="text-lg font-extrabold text-pink-400 font-mono tabular-nums">
                            {formatIDR(item.hourlyRate)}
                          </span>
                          <span className="text-xs text-slate-400 font-normal"> / jam</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-mono block">Paket Bulanan (200 HM)</span>
                          <span className="text-xs font-semibold text-slate-300 font-mono tabular-nums">
                            {formatIDR(item.monthlyRate)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => setSelectedDetailItem(item)}
                          className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>Spesifikasi</span>
                        </button>

                        <button
                          onClick={() => onSelectEquipmentForBooking(item)}
                          className="py-2 px-3 bg-pink-600 hover:bg-pink-500 text-white font-extrabold rounded text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Sewa Unit</span>
                        </button>
                      </div>

                      {/* Compare toggle button */}
                      <button
                        onClick={() => toggleCompare(item)}
                        className={`w-full mt-2 py-1 text-[11px] font-mono rounded flex items-center justify-center gap-1 transition-colors ${
                          isComparing
                            ? 'text-pink-400 bg-pink-500/10 border border-pink-500/30'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Scale className="w-3 h-3" />
                        <span>{isComparing ? '✓ Terpilih di Komparasi' : '+ Bandingkan Spek'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Floating Compare Drawer Bar */}
        {compareList.length > 0 && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 bg-[#121927] border border-pink-500/50 rounded-lg p-3 shadow-2xl flex items-center gap-4 max-w-xl w-[92%] backdrop-blur-md">
            <div className="flex-1 flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-mono font-bold text-pink-400 whitespace-nowrap">
                Bandingkan ({compareList.length}/3):
              </span>
              {compareList.map((c) => (
                <span
                  key={c.id}
                  className="text-xs bg-slate-800 text-white px-2 py-1 rounded flex items-center gap-1 font-mono whitespace-nowrap"
                >
                  {c.name.split(' ')[0]} {c.model.split(' ')[0]}
                  <button onClick={() => toggleCompare(c)} className="text-slate-400 hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowCompareModal(true)}
                className="px-3 py-1.5 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded"
              >
                Lihat Komparasi
              </button>
              <button
                onClick={() => setCompareList([])}
                className="text-slate-400 hover:text-white text-xs"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Detail Specification Modal */}
        {selectedDetailItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-[#121927] border border-slate-700 rounded-xl max-w-3xl w-full shadow-2xl relative my-8 overflow-hidden">
              {/* Modal Header */}
              <div className="relative h-64 bg-slate-900">
                <img
                  src={selectedDetailItem.image}
                  alt={selectedDetailItem.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121927] via-transparent to-black/40" />
                <button
                  onClick={() => setSelectedDetailItem(null)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black p-2 rounded-full text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6 right-6">
                  <div className="text-xs font-mono text-pink-400 uppercase font-semibold">
                    {selectedDetailItem.brand} · Tahun {selectedDetailItem.year} · {selectedDetailItem.categoryLabel}
                  </div>
                  <h3 className="text-2xl font-extrabold text-white mt-0.5">
                    {selectedDetailItem.name}
                  </h3>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
                    Deskripsi & Karakteristik Alat
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {selectedDetailItem.description}
                  </p>
                </div>

                {/* Technical Specifications Table */}
                <div>
                  <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-3">
                    Lembar Data Teknis Pabrikan
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800">
                      <span className="text-slate-400 block font-mono">Operating Weight (Bobot Kerja)</span>
                      <span className="text-white font-semibold text-sm tabular-nums">{selectedDetailItem.specs.operatingWeight}</span>
                    </div>
                    <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800">
                      <span className="text-slate-400 block font-mono">Engine Output (Daya Mesin)</span>
                      <span className="text-white font-semibold text-sm">{selectedDetailItem.specs.enginePower}</span>
                    </div>
                    <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800">
                      <span className="text-slate-400 block font-mono">Kapasitas Kerja / Bucket / Boom</span>
                      <span className="text-white font-semibold text-sm">{selectedDetailItem.specs.capacity}</span>
                    </div>
                    <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800">
                      <span className="text-slate-400 block font-mono">Konsumsi Solar Rata-rata</span>
                      <span className="text-white font-semibold text-sm">{selectedDetailItem.specs.fuelConsumption}</span>
                    </div>
                    <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800">
                      <span className="text-slate-400 block font-mono">Jangkauan Kerja Maksimal</span>
                      <span className="text-white font-semibold text-sm">{selectedDetailItem.specs.maxReachOrDepth}</span>
                    </div>
                    <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800">
                      <span className="text-slate-400 block font-mono">Undercarriage & Ban</span>
                      <span className="text-white font-semibold text-sm">{selectedDetailItem.specs.undercarriage}</span>
                    </div>
                  </div>
                </div>

                {/* Features & Legalitas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
                      Fitur Standar & K3
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {selectedDetailItem.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-2">
                      Sertifikasi Legalitas Unit
                    </h4>
                    <div className="p-3 bg-slate-900/90 rounded border border-slate-800 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Surat Ijin Alat (SIA):</span>
                        <span className="text-emerald-400 font-semibold font-mono">Aktif Depnaker</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Masa Berlaku SIA:</span>
                        <span className="text-white font-mono">{selectedDetailItem.siaCertValidUntil}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Sertifikasi Operator:</span>
                        <span className="text-pink-400 font-mono">SIO Kelas 1 Kemenaker</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-400 block font-mono">Estimasi Tarif Sewa Pokok:</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-pink-400 font-mono tabular-nums">
                        {formatIDR(selectedDetailItem.hourlyRate)}
                      </span>
                      <span className="text-xs text-slate-400">/ jam (Min. {selectedDetailItem.minRentalHours} jam)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const itm = selectedDetailItem;
                        setSelectedDetailItem(null);
                        onSelectEquipmentForBooking(itm);
                      }}
                      className="px-6 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-sm uppercase rounded transition-colors"
                    >
                      Lanjut Reservasi Unit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Side-by-Side Comparison Modal */}
        {showCompareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <div className="bg-[#121927] border border-slate-700 rounded-xl max-w-4xl w-full p-6 shadow-2xl relative overflow-x-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Komparasi Spesifikasi Alat Berat</h3>
                  <p className="text-xs text-slate-400">Bandingkan daya, kapasitas, dan tarif sewa secara berdampingan</p>
                </div>
                <button onClick={() => setShowCompareModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4 text-xs min-w-[600px]">
                <div className="font-mono text-slate-400 space-y-4 pt-28">
                  <div>Operating Weight</div>
                  <div>Engine Power</div>
                  <div>Kapasitas Kerja</div>
                  <div>Konsumsi BBM</div>
                  <div>Tarif / Jam</div>
                  <div>Tarif Bulanan</div>
                  <div>Unit Tersedia</div>
                  <div>Action</div>
                </div>

                {compareList.map((item) => (
                  <div key={item.id} className="bg-slate-900/60 p-3 rounded border border-slate-800 space-y-4">
                    <div className="h-24">
                      <img src={item.image} alt={item.name} className="w-full h-16 object-cover rounded mb-1" />
                      <span className="font-bold text-white block truncate">{item.name}</span>
                    </div>
                    <div className="font-semibold text-slate-200">{item.specs.operatingWeight}</div>
                    <div className="font-semibold text-slate-200">{item.specs.enginePower}</div>
                    <div className="font-semibold text-slate-200">{item.specs.capacity}</div>
                    <div className="font-semibold text-slate-200">{item.specs.fuelConsumption}</div>
                    <div className="font-bold text-pink-400 font-mono tabular-nums">{formatIDR(item.hourlyRate)}</div>
                    <div className="font-semibold text-slate-300 font-mono tabular-nums">{formatIDR(item.monthlyRate)}</div>
                    <div className="text-emerald-400 font-mono">{item.availableUnits} Unit Ready</div>
                    <div>
                      <button
                        onClick={() => {
                          setShowCompareModal(false);
                          onSelectEquipmentForBooking(item);
                        }}
                        className="w-full py-1.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded text-xs"
                      >
                        Pilih Unit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
