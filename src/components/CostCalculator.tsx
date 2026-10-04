import React, { useState } from 'react';
import { EQUIPMENT_LIST, INDONESIAN_REGIONS } from '../data/equipmentData';
import { formatIDR } from '../utils/formatters';
import { Calculator, Truck, Fuel, UserCheck, ShieldCheck, ArrowRight, Copy, Check } from 'lucide-react';
import { Equipment } from '../types/equipment';

interface CostCalculatorProps {
  onProceedToBooking: (equipment: Equipment) => void;
}

export const CostCalculator: React.FC<CostCalculatorProps> = ({ onProceedToBooking }) => {
  const [selectedEquipId, setSelectedEquipId] = useState(EQUIPMENT_LIST[0].id);
  const [durationMode, setDurationMode] = useState<'hours' | 'days' | 'monthly'>('days');
  const [hoursCount, setHoursCount] = useState<number>(100);
  const [daysCount, setDaysCount] = useState<number>(14);
  const [includeOperator, setIncludeOperator] = useState<boolean>(true);
  const [includeFuel, setIncludeFuel] = useState<boolean>(false);
  const [selectedRegionIndex, setSelectedRegionIndex] = useState<number>(0);
  const [copiedQuote, setCopiedQuote] = useState(false);

  const selectedEquip = EQUIPMENT_LIST.find((e) => e.id === selectedEquipId) || EQUIPMENT_LIST[0];
  const selectedRegion = INDONESIAN_REGIONS[selectedRegionIndex];

  // Calculation
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
    const text = `ESTIMASI PENAWARAN SEWA ALAT BERAT - PALUGADA\nUnit: ${selectedEquip.name}\nLokasi: ${selectedRegion.city} (${selectedRegion.province})\nEstimasi Jam: ${totalHoursEstimated} HM\nSewa Pokok: ${formatIDR(baseUnitCost)}\nMob-Demob Lowbed: ${formatIDR(mobDemobCost)}\nOperator SIO: ${formatIDR(operatorCost)}\nBBM Solar: ${formatIDR(fuelCost)}\nPPN 11%: ${formatIDR(taxPpn)}\nTOTAL KONTRAK: ${formatIDR(grandTotal)}\nHubungi WhatsApp: +62 811-920-8800`;
    navigator.clipboard.writeText(text);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2500);
  };

  return (
    <section id="calculator" className="py-12 lg:py-16 bg-[#0a0e17] border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-pink-400 mb-1">
            <Calculator className="w-3.5 h-3.5" />
            <span>Kalkulator Transparan</span>
            <span>·</span>
            <span>Tanpa Biaya Tersembunyi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Kalkulator Estimasi Sewa & Mobilisasi (Mob-Demob)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Hitung perkiraan anggaran sewa alat berat secara akurat berdasarkan durasi proyek, kebutuhan operator bersertifikat SIO, dan jarak kirim trailer lowbed.
          </p>
        </div>

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
                  <option key={reg.city} value={idx}>
                    {reg.city} ({reg.province}) — {formatIDR(reg.defaultRateMob)} (Trailer Tronton)
                  </option>
                ))}
              </select>
            </div>

            {/* Checkbox addons */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-mono uppercase text-slate-300 font-semibold">
                4. Opsi Fasilitas Tambahan:
              </label>
              
              <label className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={includeOperator}
                  onChange={(e) => setIncludeOperator(e.target.checked)}
                  className="w-4 h-4 accent-pink-500 rounded"
                />
                <div className="text-xs">
                  <span className="font-bold text-white block">Sertakan Operator Berlisensi SIO Kemenaker</span>
                  <span className="text-slate-400">Termasuk gaji dasar & uang makan operasional harian.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={includeFuel}
                  onChange={(e) => setIncludeFuel(e.target.checked)}
                  className="w-4 h-4 accent-pink-500 rounded"
                />
                <div className="text-xs">
                  <span className="font-bold text-white block">Sertakan Solar Industri Resmi B35 (All-In)</span>
                  <span className="text-slate-400">Suplai fuel truck berkala sesuai HM berjalan tanpa repot.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Quotation Preview Summary (5 Cols) */}
          <div className="lg:col-span-5 bg-[#111726] border border-slate-800 rounded-xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <span className="text-xs font-mono uppercase text-pink-400 font-semibold block">Kalkulasi Instan</span>
                <h3 className="text-lg font-bold text-white">Ringkasan Estimasi Biaya</h3>
              </div>
              <span className="text-xs font-mono text-slate-500">IDR NETT</span>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Sewa Unit Pokok ({totalHoursEstimated} HM):</span>
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
      </div>
    </section>
  );
};
