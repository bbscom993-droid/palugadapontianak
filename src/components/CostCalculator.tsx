import React, { useState } from 'react';
import { EQUIPMENT_LIST, INDONESIAN_REGIONS } from '../data/equipmentData';
import { formatIDR } from '../utils/formatters';
import { 
  Calculator, 
  Truck, 
  Fuel, 
  UserCheck, 
  ShieldCheck, 
  ArrowRight, 
  Copy, 
  Check, 
  Scale, 
  Plus, 
  X, 
  CheckCircle2, 
  Layers,
  Sparkles
} from 'lucide-react';
import { Equipment } from '../types/equipment';

interface CostCalculatorProps {
  onProceedToBooking: (equipment: Equipment) => void;
}

export const CostCalculator: React.FC<CostCalculatorProps> = ({ onProceedToBooking }) => {
  const [calcMode, setCalcMode] = useState<'single' | 'compare'>('single');
  
  // Single calculator state
  const [selectedEquipId, setSelectedEquipId] = useState(EQUIPMENT_LIST[0].id);
  const [durationMode, setDurationMode] = useState<'hours' | 'days' | 'monthly'>('days');
  const [hoursCount, setHoursCount] = useState<number>(100);
  const [daysCount, setDaysCount] = useState<number>(14);
  const [includeOperator, setIncludeOperator] = useState<boolean>(true);
  const [includeFuel, setIncludeFuel] = useState<boolean>(false);
  const [selectedRegionIndex, setSelectedRegionIndex] = useState<number>(0);
  const [copiedQuote, setCopiedQuote] = useState(false);

  // Side-by-side comparison state (multi equipment)
  const [compareEquipIds, setCompareEquipIds] = useState<string[]>([
    EQUIPMENT_LIST[0].id, // Komatsu PC200
    EQUIPMENT_LIST[1].id, // Cat 320 GC
    EQUIPMENT_LIST[2].id, // Cat D85SS Bulldozer
  ]);
  const [compareIncludeOperator, setCompareIncludeOperator] = useState<boolean>(true);
  const [compareIncludeFuel, setCompareIncludeFuel] = useState<boolean>(true);
  const [compareDaysCount, setCompareDaysCount] = useState<number>(7);

  const selectedEquip = EQUIPMENT_LIST.find((e) => e.id === selectedEquipId) || EQUIPMENT_LIST[0];
  const selectedRegion = INDONESIAN_REGIONS[selectedRegionIndex];

  // Calculation for Single Mode
  let baseUnitCost = 0;
  let totalHoursEstimated = 0;

  if (durationMode === 'hours') {
    totalHoursEstimated = hoursCount;
    baseUnitCost = selectedEquip.hourlyRate * hoursCount;
  } else if (durationMode === 'days') {
    totalHoursEstimated = daysCount * 8;
    baseUnitCost = selectedEquip.dailyRate * daysCount;
  } else {
    // monthly (200 hours)
    totalHoursEstimated = 200;
    baseUnitCost = selectedEquip.monthlyRate;
  }

  const mobDemobCost = selectedRegion.defaultRateMob;
  const operatorCost = includeOperator ? 350000 * Math.ceil(totalHoursEstimated / 8) : 0;
  // Estimated fuel: average 16 liters per hour @ Rp 14.500 / liter
  const fuelCost = includeFuel ? totalHoursEstimated * 16 * 14500 : 0;

  const subtotal = baseUnitCost + mobDemobCost + operatorCost + fuelCost;
  const taxPpn = Math.round(subtotal * 0.11);
  const grandTotal = subtotal + taxPpn;

  const handleCopyQuote = () => {
    const text = `ESTIMASI PENAWARAN SEWA ALAT BERAT - PALUGADA ALAT BERAT PONTIANAK\nUnit: ${selectedEquip.name}\nLokasi: ${selectedRegion.city} (${selectedRegion.province})\nEstimasi Jam: ${totalHoursEstimated} HM\nSewa Pokok: ${formatIDR(baseUnitCost)}\nMob-Demob Lowbed: ${formatIDR(mobDemobCost)}\nOperator SIO: ${formatIDR(operatorCost)}\nBBM Solar: ${formatIDR(fuelCost)}\nPPN 11%: ${formatIDR(taxPpn)}\nTOTAL KONTRAK: ${formatIDR(grandTotal)}\nHubungi Hotline WhatsApp: +62 811-920-8800`;
    navigator.clipboard.writeText(text);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2500);
  };

  // Toggle equipment in comparison list (between 2 and 4 items)
  const toggleCompareEquip = (id: string) => {
    if (compareEquipIds.includes(id)) {
      if (compareEquipIds.length <= 2) {
        return; // maintain at least 2 for comparison
      }
      setCompareEquipIds(compareEquipIds.filter((item) => item !== id));
    } else {
      if (compareEquipIds.length >= 4) {
        setCompareEquipIds([...compareEquipIds.slice(1), id]);
      } else {
        setCompareEquipIds([...compareEquipIds, id]);
      }
    }
  };

  // Helper for fuel estimation from string like "14 - 18 Liter / Jam"
  const parseFuelLiters = (fuelStr: string): number => {
    const match = fuelStr.match(/(\d+)/g);
    if (match && match.length >= 2) {
      return (Number(match[0]) + Number(match[1])) / 2;
    } else if (match && match.length === 1) {
      return Number(match[0]);
    }
    return 16;
  };

  const comparedEquipments = compareEquipIds
    .map((id) => EQUIPMENT_LIST.find((e) => e.id === id))
    .filter(Boolean) as Equipment[];

  return (
    <section id="calculator" className="py-12 lg:py-16 bg-[#0a0e17] border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & Mode Toggle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pb-6 border-b border-slate-800">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-pink-400 mb-1">
              <Calculator className="w-3.5 h-3.5" />
              <span>Kalkulator Transparan & Komparasi Biaya</span>
              <span>·</span>
              <span>Tanpa Biaya Tersembunyi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Kalkulator Estimasi Sewa & Komparasi Biaya Harian
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Hitung perkiraan anggaran proyek secara akurat atau bandingkan biaya sewa harian berbagai tipe alat berat secara berdampingan.
            </p>
          </div>

          {/* Mode Switcher Segmented Control */}
          <div className="flex items-center p-1 bg-[#121927] border border-slate-800 rounded-xl self-start md:self-end">
            <button
              onClick={() => setCalcMode('single')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                calcMode === 'single'
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Kalkulator Tunggal</span>
            </button>
            <button
              onClick={() => setCalcMode('compare')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${
                calcMode === 'compare'
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Komparasi Berdampingan ({compareEquipIds.length} Unit)</span>
            </button>
          </div>
        </div>

        {/* -------------------- MODE 1: SINGLE CALCULATOR -------------------- */}
        {calcMode === 'single' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Controls Form (7 Cols) */}
            <div className="lg:col-span-7 bg-[#111726] border border-slate-800 rounded-xl p-6 space-y-6">
              {/* Equipment Selection */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 font-semibold mb-2">
                  1. Pilih Tipe Alat Berat:
                </label>
                <select
                  value={selectedEquipId}
                  onChange={(e) => setSelectedEquipId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-pink-500 font-medium"
                >
                  {EQUIPMENT_LIST.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.name} — {formatIDR(eq.hourlyRate)}/jam (Min. {eq.minRentalHours} Jam)
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration Mode Segmented Buttons */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 font-semibold mb-2">
                  2. Metode & Durasi Pemakaian:
                </label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900 rounded-lg border border-slate-800 mb-3">
                  <button
                    type="button"
                    onClick={() => setDurationMode('days')}
                    className={`py-2 text-xs font-semibold rounded transition-colors ${
                      durationMode === 'days' ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Harian (8 Jam/Shift)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDurationMode('hours')}
                    className={`py-2 text-xs font-semibold rounded transition-colors ${
                      durationMode === 'hours' ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Jam-jaman (HM)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDurationMode('monthly')}
                    className={`py-2 text-xs font-semibold rounded transition-colors ${
                      durationMode === 'monthly' ? 'bg-pink-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Bulanan (200 HM)
                  </button>
                </div>

                {durationMode === 'days' && (
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
                      <span>Lama Sewa:</span>
                      <strong className="text-white">{daysCount} Hari ({daysCount * 8} Jam Kerja)</strong>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={60}
                      value={daysCount}
                      onChange={(e) => setDaysCount(Number(e.target.value))}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                  </div>
                )}

                {durationMode === 'hours' && (
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1 font-mono">
                      <span>Target Jam (HM):</span>
                      <strong className="text-white">{hoursCount} Jam Operasional</strong>
                    </div>
                    <input
                      type="range"
                      min={selectedEquip.minRentalHours}
                      max={500}
                      step={10}
                      value={hoursCount}
                      onChange={(e) => setHoursCount(Number(e.target.value))}
                      className="w-full accent-pink-500 cursor-pointer"
                    />
                  </div>
                )}

                {durationMode === 'monthly' && (
                  <div className="p-3 bg-slate-900 rounded border border-slate-800 text-xs text-slate-400">
                    Paket bulanan mencakup kuota dasar <strong>200 Jam Mesin (HM)</strong>. Jam lembur di atas 200 HM dihitung dengan tarif per-jam prorata.
                  </div>
                )}
              </div>

              {/* Region / Mob-Demob */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 font-semibold mb-2">
                  3. Lokasi Proyek (Mobilisasi Lowbed PP):
                </label>
                <select
                  value={selectedRegionIndex}
                  onChange={(e) => setSelectedRegionIndex(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-pink-500"
                >
                  {INDONESIAN_REGIONS.map((reg, idx) => (
                    <option key={idx} value={idx}>
                      {reg.city}, {reg.province} — Mob-Demob Lowbed: {formatIDR(reg.defaultRateMob)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Additional Options (Operator & Fuel) */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <label className="block text-xs font-mono uppercase text-slate-300 font-semibold">
                  4. Paket & Layanan Pendukung:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={includeOperator}
                      onChange={(e) => setIncludeOperator(e.target.checked)}
                      className="w-4 h-4 text-pink-600 rounded bg-slate-800 border-slate-700 focus:ring-pink-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Operator SIO Kemenaker</span>
                      <span className="text-[11px] text-slate-400">+Rp 350.000 / Hari kerja</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer hover:border-slate-700">
                    <input
                      type="checkbox"
                      checked={includeFuel}
                      onChange={(e) => setIncludeFuel(e.target.checked)}
                      className="w-4 h-4 text-pink-600 rounded bg-slate-800 border-slate-700 focus:ring-pink-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Include BBM Biosolar B35</span>
                      <span className="text-[11px] text-slate-400">Estimasi konsumsi 16L/jam</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Price Output Breakdown Card (5 Cols) */}
            <div className="lg:col-span-5 bg-[#121927] border border-pink-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

              <h3 className="text-base font-extrabold text-white pb-3 border-b border-slate-800">
                Ringkasan Rincian Estimasi Biaya
              </h3>

              <div className="mt-4 space-y-3 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Unit Alat Berat:</span>
                  <span className="text-white font-semibold text-right">{selectedEquip.name}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Lokasi Kirim Lowbed:</span>
                  <span className="text-white font-semibold text-right">{selectedRegion.city}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Total Jam Kerja Est.:</span>
                  <span className="text-white font-mono font-semibold">{totalHoursEstimated} HM</span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between text-slate-300">
                  <span>Sewa Pokok Unit:</span>
                  <span className="text-white font-bold tabular-nums">{formatIDR(baseUnitCost)}</span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Mob-Demob Truk Lowbed:</span>
                  <span className="text-white font-bold tabular-nums">{formatIDR(mobDemobCost)}</span>
                </div>

                {includeOperator && (
                  <div className="flex justify-between text-slate-300">
                    <span>Operator SIO & Akomodasi:</span>
                    <span className="text-white font-bold tabular-nums">{formatIDR(operatorCost)}</span>
                  </div>
                )}

                {includeFuel && (
                  <div className="flex justify-between text-slate-300">
                    <span>BBM Solar Industri B35:</span>
                    <span className="text-white font-bold tabular-nums">{formatIDR(fuelCost)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-800 flex justify-between text-slate-400">
                  <span>Subtotal DPP:</span>
                  <span className="tabular-nums">{formatIDR(subtotal)}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>PPN 11%:</span>
                  <span className="tabular-nums">{formatIDR(taxPpn)}</span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline text-white">
                  <span className="text-sm font-sans font-extrabold">ESTIMASI TOTAL:</span>
                  <span className="text-xl font-extrabold text-pink-400 font-mono tabular-nums">
                    {formatIDR(grandTotal)}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                <button
                  onClick={() => onProceedToBooking(selectedEquip)}
                  className="w-full py-3.5 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25"
                >
                  <span>Lanjut Reservasi Unit Ini</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleCopyQuote}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  {copiedQuote ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  <span>{copiedQuote ? 'Tersalin ke Clipboard!' : 'Salin Format Penawaran Teks'}</span>
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-1">
                <p>• Estimasi di atas mengikat setelah verifikasi survei akses jalan.</p>
                <p>• Termasuk jaminan mekanik standby 24 jam & unit pengganti.</p>
              </div>
            </div>
          </div>
        ) : (
          /* -------------------- MODE 2: SIDE-BY-SIDE COMPARISON -------------------- */
          <div className="space-y-6">
            {/* Equipment Selector Chips Bar */}
            <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-mono uppercase text-pink-400 font-bold tracking-wider">
                    Pilih 2 hingga 4 Tipe Alat Berat untuk Dikomparasikan:
                  </h4>
                  <p className="text-xs text-slate-400">
                    Klik nama unit untuk menambah atau menghapus dari kolom komparasi biaya harian.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={compareIncludeOperator}
                      onChange={(e) => setCompareIncludeOperator(e.target.checked)}
                      className="w-4 h-4 text-pink-600 rounded bg-slate-900 border-slate-700"
                    />
                    <span>+ Operator SIO (Rp 350.000/hari)</span>
                  </label>

                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={compareIncludeFuel}
                      onChange={(e) => setCompareIncludeFuel(e.target.checked)}
                      className="w-4 h-4 text-pink-600 rounded bg-slate-900 border-slate-700"
                    />
                    <span>+ Estimasi Solar B35 (8 Jam/hari)</span>
                  </label>
                </div>
              </div>

              {/* Equipment Multi-select Pills */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                {EQUIPMENT_LIST.map((eq) => {
                  const isSelected = compareEquipIds.includes(eq.id);
                  return (
                    <button
                      key={eq.id}
                      onClick={() => toggleCompareEquip(eq.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-pink-600 text-white font-bold shadow-md shadow-pink-600/30'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-slate-500" />}
                      <span>{eq.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Side-by-Side Comparison Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-${Math.min(comparedEquipments.length, 4)} gap-4 items-stretch`}>
              {comparedEquipments.map((eq) => {
                const fuelLitersPerDay = parseFuelLiters(eq.specs.fuelConsumption) * 8;
                const fuelCostDay = compareIncludeFuel ? fuelLitersPerDay * 14500 : 0;
                const operatorCostDay = compareIncludeOperator ? 350000 : 0;
                const totalDailyCost = eq.dailyRate + fuelCostDay + operatorCostDay;
                const isBestValue = eq.dailyRate <= 2500000;

                return (
                  <div
                    key={eq.id}
                    className="bg-[#111726] border border-slate-800 hover:border-pink-500/40 rounded-xl p-5 flex flex-col justify-between transition-all hover:shadow-xl relative group"
                  >
                    {isBestValue && (
                      <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-md">
                        Best Value
                      </div>
                    )}

                    <div>
                      {/* Equipment Image & Category */}
                      <div className="relative h-36 rounded-lg overflow-hidden mb-3 bg-slate-900">
                        <img
                          src={eq.image}
                          alt={eq.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono uppercase text-pink-400 font-semibold">
                          {eq.categoryLabel}
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="text-base font-bold text-white leading-snug mb-1">
                        {eq.name}
                      </h4>
                      <p className="text-xs text-slate-400 mb-4">
                        {eq.brand} · Tahun {eq.year}
                      </p>

                      {/* Daily Cost Hero Card */}
                      <div className="p-3.5 bg-slate-900/90 rounded-lg border border-pink-500/20 mb-4">
                        <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                          Estimasi Biaya Harian (8 Jam):
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-xl font-extrabold text-pink-400 font-mono tabular-nums">
                            {formatIDR(totalDailyCost)}
                          </span>
                          <span className="text-[11px] text-slate-400">/ hari</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-1">
                          (Unit {formatIDR(eq.dailyRate)} {compareIncludeOperator ? '+ Ops' : ''} {compareIncludeFuel ? '+ BBM' : ''})
                        </span>
                      </div>

                      {/* Detailed Cost Matrix Rows */}
                      <div className="space-y-2 text-xs border-t border-slate-800 pt-3 mb-4">
                        <div className="flex justify-between text-slate-300">
                          <span className="text-slate-400">Tarif Pokok Harian:</span>
                          <span className="font-bold text-white font-mono">{formatIDR(eq.dailyRate)}</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span className="text-slate-400">Tarif per Jam (HM):</span>
                          <span className="font-medium text-slate-200 font-mono">{formatIDR(eq.hourlyRate)}</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span className="text-slate-400">Tarif Bulanan (200 HM):</span>
                          <span className="font-medium text-slate-200 font-mono">{formatIDR(eq.monthlyRate)}</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span className="text-slate-400">Min. Durasi Sewa:</span>
                          <span className="text-slate-200">{eq.minRentalHours} Jam Mesin</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span className="text-slate-400">Est. BBM Solar / Hari:</span>
                          <span className="text-amber-400 font-mono">~{fuelLitersPerDay} Liter</span>
                        </div>
                      </div>

                      {/* Technical Specs Comparison */}
                      <div className="space-y-1.5 text-[11px] bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 mb-5">
                        <div className="flex justify-between text-slate-400">
                          <span>Bobot Operasi:</span>
                          <span className="font-semibold text-slate-200">{eq.specs.operatingWeight}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Daya Mesin:</span>
                          <span className="font-semibold text-slate-200">{eq.specs.enginePower}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Kapasitas:</span>
                          <span className="font-semibold text-slate-200">{eq.specs.capacity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Booking CTA Button */}
                    <button
                      onClick={() => onProceedToBooking(eq)}
                      className="w-full py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md shadow-pink-600/20 flex items-center justify-center gap-1.5 group-hover:scale-105 active:scale-95"
                    >
                      <span>Reservasi Unit Ini</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
