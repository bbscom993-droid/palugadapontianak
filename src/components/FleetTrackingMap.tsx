import React, { useState, useEffect } from 'react';
import { FleetTelemetry, MachineStatus } from '../types/equipment';
import { INITIAL_FLEET_TELEMETRY, MOCK_PROJECT_HOTSPOTS } from '../data/telemetryData';
import { 
  Navigation, 
  Activity, 
  Fuel, 
  Gauge, 
  MapPin, 
  Radio, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle, 
  Play, 
  Pause, 
  User, 
  Compass, 
  Clock, 
  Truck,
  Layers,
  Thermometer,
  Zap,
  PhoneCall
} from 'lucide-react';

export const FleetTrackingMap: React.FC = () => {
  const [fleetList, setFleetList] = useState<FleetTelemetry[]>(INITIAL_FLEET_TELEMETRY);
  const [selectedUnit, setSelectedUnit] = useState<FleetTelemetry>(INITIAL_FLEET_TELEMETRY[0]);
  const [statusFilter, setStatusFilter] = useState<'ALL' | MachineStatus>('ALL');
  const [isSimulatingRoute, setIsSimulatingRoute] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [lastRefreshedTime, setLastRefreshedTime] = useState(new Date().toLocaleTimeString('id-ID'));
  const [isPinging, setIsPinging] = useState(false);
  const [mapViewMode, setMapViewMode] = useState<'satellite' | 'topographic'>('satellite');

  // Simulated live telemetry fluctuation (RPM, fuel, HM) every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFleetList((prev) =>
        prev.map((unit) => {
          if (unit.status === 'WORKING') {
            const rpmJitter = Math.floor(Math.random() * 40) - 20;
            const newRpm = Math.max(1500, Math.min(2100, unit.engineRpm + rpmJitter));
            const newSpeed = +(Math.random() * 2.5 + 1.2).toFixed(1);
            return {
              ...unit,
              engineRpm: newRpm,
              currentSpeedKmh: newSpeed,
              hydraulicTempC: Math.min(85, unit.hydraulicTempC + (Math.random() > 0.6 ? 1 : 0)),
              lastPingTime: 'Baru saja',
            };
          }
          return unit;
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Route replay simulation loop
  useEffect(() => {
    let timer: any;
    if (isSimulatingRoute) {
      timer = setInterval(() => {
        setSimulationStep((prev) => {
          const next = prev + 1;
          // Offset coordinates slightly along a simulated work route
          const deltaLat = (Math.sin(next * 0.4) * 0.0015);
          const deltaLng = (Math.cos(next * 0.4) * 0.0015);

          setSelectedUnit((curr) => ({
            ...curr,
            coordinates: {
              lat: +(curr.coordinates.lat + deltaLat).toFixed(5),
              lng: +(curr.coordinates.lng + deltaLng).toFixed(5),
            },
            currentSpeedKmh: +(2.5 + Math.random() * 1.5).toFixed(1),
            engineRpm: Math.floor(1800 + Math.random() * 100),
            hourMeter: +(curr.hourMeter + 0.01).toFixed(2),
          }));
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSimulatingRoute]);

  const handleRefreshPing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setLastRefreshedTime(new Date().toLocaleTimeString('id-ID'));
      setIsPinging(false);
    }, 700);
  };

  const filteredFleet = fleetList.filter((item) => {
    if (statusFilter === 'ALL') return true;
    return item.status === statusFilter;
  });

  const getStatusColor = (status: MachineStatus) => {
    switch (status) {
      case 'WORKING':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'IDLE':
        return 'text-pink-400 bg-pink-500/10 border-pink-500/30';
      case 'TRANSIT':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'MAINTENANCE':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  const getStatusLabel = (status: MachineStatus) => {
    switch (status) {
      case 'WORKING':
        return 'Aktif Beroperasi';
      case 'IDLE':
        return 'Siaga (Mesin Hidup)';
      case 'TRANSIT':
        return 'Mobilisasi Lowbed';
      case 'MAINTENANCE':
        return 'Servis Berkala';
    }
  };

  // Convert coordinate to visual map offset percentage on Indonesia map
  // Indonesia approximate bounding box: Lat -11 to 6, Lng 95 to 141
  const mapCoordinatesToPixels = (lat: number, lng: number) => {
    const minLng = 94;
    const maxLng = 142;
    const minLat = -11;
    const maxLat = 7;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;

    return {
      left: `${Math.max(5, Math.min(95, x))}%`,
      top: `${Math.max(10, Math.min(90, y))}%`,
    };
  };

  return (
    <section id="tracking" className="py-12 bg-[#090d16] border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-pink-400 mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Palugada Telematics Global System</span>
              <span>·</span>
              <span>Pembaruan Real-Time</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Radar Pelacakan GPS Armada & Telemetri Real-Time
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Pantau lokasi satelit, jam kerja (HM), konsumsi solar, dan kondisi mesin armada di seluruh proyek konstruksi & pertambangan Indonesia.
            </p>
          </div>

          {/* Map Controls & Ping */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefreshPing}
              disabled={isPinging}
              className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded text-xs font-mono text-slate-300 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-pink-400 ${isPinging ? 'animate-spin' : ''}`} />
              <span>Ping Satelit: {lastRefreshedTime}</span>
            </button>

            <div className="flex items-center bg-slate-900 border border-slate-700 rounded p-0.5 text-xs">
              <button
                onClick={() => setMapViewMode('satellite')}
                className={`px-2.5 py-1.5 rounded text-[11px] font-medium transition-colors ${
                  mapViewMode === 'satellite' ? 'bg-pink-600 text-white font-bold' : 'text-slate-400'
                }`}
              >
                Satelit Telemetri
              </button>
              <button
                onClick={() => setMapViewMode('topographic')}
                className={`px-2.5 py-1.5 rounded text-[11px] font-medium transition-colors ${
                  mapViewMode === 'topographic' ? 'bg-pink-600 text-white font-bold' : 'text-slate-400'
                }`}
              >
                Grid Koordinat
              </button>
            </div>
          </div>
        </div>

        {/* Status Filter Bar (Zero-Pill: functional segmented control) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`p-2.5 rounded border text-left transition-colors ${
              statusFilter === 'ALL'
                ? 'bg-pink-500/10 border-pink-500/50 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-[10px] block font-mono uppercase">Semua Armada</span>
            <span className="text-base font-bold font-mono text-white tabular-nums">{fleetList.length} Unit</span>
          </button>

          <button
            onClick={() => setStatusFilter('WORKING')}
            className={`p-2.5 rounded border text-left transition-colors ${
              statusFilter === 'WORKING'
                ? 'bg-emerald-500/10 border-emerald-500/50 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-[10px] block font-mono uppercase text-emerald-400">Aktif Bekerja</span>
            <span className="text-base font-bold font-mono text-emerald-400 tabular-nums">
              {fleetList.filter((f) => f.status === 'WORKING').length} Unit
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('IDLE')}
            className={`p-2.5 rounded border text-left transition-colors ${
              statusFilter === 'IDLE'
                ? 'bg-pink-500/10 border-pink-500/50 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-[10px] block font-mono uppercase text-pink-400">Siaga (Idle)</span>
            <span className="text-base font-bold font-mono text-pink-400 tabular-nums">
              {fleetList.filter((f) => f.status === 'IDLE').length} Unit
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('TRANSIT')}
            className={`p-2.5 rounded border text-left transition-colors ${
              statusFilter === 'TRANSIT'
                ? 'bg-blue-500/10 border-blue-500/50 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-[10px] block font-mono uppercase text-blue-400">Dalam Mobilisasi</span>
            <span className="text-base font-bold font-mono text-blue-400 tabular-nums">
              {fleetList.filter((f) => f.status === 'TRANSIT').length} Unit
            </span>
          </button>

          <button
            onClick={() => setStatusFilter('MAINTENANCE')}
            className={`p-2.5 rounded border text-left transition-colors ${
              statusFilter === 'MAINTENANCE'
                ? 'bg-rose-500/10 border-rose-500/50 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="text-[10px] block font-mono uppercase text-rose-400">Servis Berkala</span>
            <span className="text-base font-bold font-mono text-rose-400 tabular-nums">
              {fleetList.filter((f) => f.status === 'MAINTENANCE').length} Unit
            </span>
          </button>
        </div>

        {/* Main Telemetry & Map Cockpit Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Fleet List (4 cols) */}
          <div className="lg:col-span-4 bg-[#111726] border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Daftar Unit Terhubung ({filteredFleet.length})
              </span>
              <span className="text-[10px] font-mono text-emerald-400">GPS ONLINE 4G/SAT</span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
              {filteredFleet.map((unit) => {
                const isSelected = selectedUnit.id === unit.id;
                return (
                  <button
                    key={unit.id}
                    onClick={() => {
                      setSelectedUnit(unit);
                      setIsSimulatingRoute(false);
                    }}
                    className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 ${
                      isSelected
                        ? 'bg-pink-500/10 border-l-4 border-pink-500'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="w-9 h-9 rounded bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Truck className={`w-4 h-4 ${isSelected ? 'text-pink-400' : 'text-slate-400'}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-mono text-xs font-bold text-white truncate">
                          {unit.unitCode} · {unit.model}
                        </span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${getStatusColor(unit.status)}`}>
                          {unit.status}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 truncate">{unit.currentProject}</p>
                      <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{unit.locationName}, {unit.province}</span>
                      </p>

                      <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-slate-400">
                        <span>HM: <strong className="text-white tabular-nums">{unit.hourMeter.toFixed(1)}</strong></span>
                        <span>Solar: <strong className="text-pink-400 tabular-nums">{unit.fuelPercentage}%</strong></span>
                        <span className="text-slate-500 ml-auto">{unit.lastPingTime}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Map Canvas + Telemetry Live HUD (8 cols) */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            {/* Interactive Vector Map Container */}
            <div className="relative h-[380px] bg-[#0c121e] border border-slate-800 rounded-xl overflow-hidden shadow-inner">
              {/* Grid Background Pattern */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle, #38bdf8 1px, transparent 1px)`,
                  backgroundSize: '24px 24px'
                }}
              />

              {/* Indonesia Geographic Silhouette Overlay (Custom SVG Stylized Island Representation) */}
              <svg
                viewBox="0 0 1000 450"
                className="absolute inset-0 w-full h-full opacity-40 pointer-events-none stroke-slate-700/80 fill-slate-800/50"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Sumatera */}
                <path d="M 60,70 L 120,40 L 160,80 L 220,160 L 270,230 L 230,260 L 180,210 L 120,130 Z" />
                {/* Jawa */}
                <path d="M 240,280 L 320,290 L 400,295 L 480,300 L 480,320 L 380,320 L 240,305 Z" />
                {/* Kalimantan */}
                <path d="M 360,90 L 440,70 L 490,110 L 510,180 L 450,220 L 380,210 L 350,150 Z" />
                {/* Sulawesi */}
                <path d="M 560,110 L 610,100 L 600,160 L 640,190 L 620,240 L 570,220 L 580,160 Z" />
                {/* Bali & Nusa Tenggara */}
                <path d="M 500,310 L 530,315 L 580,320 L 640,325 L 630,335 L 510,325 Z" />
                {/* Maluku */}
                <path d="M 690,140 L 730,130 L 720,180 L 680,220 Z" />
                {/* Papua */}
                <path d="M 770,120 L 880,120 L 940,190 L 920,280 L 840,260 L 790,210 L 760,150 Z" />
              </svg>

              {/* Major Project Hotspot Labels */}
              <div className="absolute top-3 left-4 text-xs font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800 flex items-center gap-2 pointer-events-none">
                <Compass className="w-3.5 h-3.5 text-pink-400" />
                <span>PETA RADAR WILAYAH INDONESIA (IKN / MOROWALI / JABODETABEK)</span>
              </div>

              {/* Hotspot Markers */}
              {MOCK_PROJECT_HOTSPOTS.map((hotspot) => {
                const pos = mapCoordinatesToPixels(hotspot.lat, hotspot.lng);
                return (
                  <div
                    key={hotspot.name}
                    style={{ left: pos.left, top: pos.top }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none hidden sm:block"
                  >
                    <div className="w-16 text-center">
                      <span className="text-[9px] font-mono font-semibold px-1 py-0.5 bg-black/70 rounded text-slate-300 border border-slate-700 whitespace-nowrap block truncate">
                        {hotspot.name}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Fleet Machine Markers */}
              {filteredFleet.map((unit) => {
                const pos = mapCoordinatesToPixels(unit.coordinates.lat, unit.coordinates.lng);
                const isSelected = selectedUnit.id === unit.id;

                return (
                  <button
                    key={unit.id}
                    onClick={() => {
                      setSelectedUnit(unit);
                      setIsSimulatingRoute(false);
                    }}
                    style={{ left: pos.left, top: pos.top }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group focus:outline-none transition-transform ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                    }`}
                  >
                    {/* Animated Ping Radar when Working */}
                    {unit.status === 'WORKING' && (
                      <span className="absolute -inset-2 rounded-full bg-emerald-500/30 animate-ping"></span>
                    )}

                    <div
                      className={`relative w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 transition-all ${
                        isSelected
                          ? 'bg-pink-600 border-white text-white shadow-pink-500/50'
                          : unit.status === 'WORKING'
                          ? 'bg-emerald-600 border-emerald-300 text-white'
                          : unit.status === 'TRANSIT'
                          ? 'bg-blue-600 border-blue-300 text-white'
                          : 'bg-slate-700 border-slate-500 text-white'
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                    </div>

                    {/* Popover Badge on Pin */}
                    <div
                      className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap shadow-md pointer-events-none transition-all ${
                        isSelected
                          ? 'bg-pink-600 text-white border border-white'
                          : 'bg-slate-900/90 text-white border border-slate-700 group-hover:block'
                      }`}
                    >
                      {unit.unitCode}
                    </div>
                  </button>
                );
              })}

              {/* Map Footer Bar */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-900/90 px-3 py-1.5 rounded border border-slate-800">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Aktif Kerja
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                    Siaga (Idle)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Mobilisasi
                  </span>
                </div>

                <div className="text-right font-mono text-slate-300">
                  Unit Fokus: <strong className="text-pink-400">{selectedUnit.unitCode}</strong> ({selectedUnit.coordinates.lat.toFixed(4)}, {selectedUnit.coordinates.lng.toFixed(4)})
                </div>
              </div>
            </div>

            {/* Selected Machine Real-Time Telemetry HUD */}
            <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                    <img src={selectedUnit.image} alt={selectedUnit.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-extrabold text-white font-mono">{selectedUnit.unitCode}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-sm font-semibold text-slate-200">{selectedUnit.name}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getStatusColor(selectedUnit.status)}`}>
                        {getStatusLabel(selectedUnit.status)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-pink-400" />
                      <span>{selectedUnit.currentProject} ({selectedUnit.locationName}, {selectedUnit.province})</span>
                    </p>
                  </div>
                </div>

                {/* Simulation & Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSimulatingRoute(!isSimulatingRoute)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      isSimulatingRoute
                        ? 'bg-rose-600 hover:bg-rose-500 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {isSimulatingRoute ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isSimulatingRoute ? 'Hentikan Replay' : 'Simulasi Pergerakan Site'}</span>
                  </button>
                </div>
              </div>

              {/* Telemetry Gauges Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                {/* Engine RPM */}
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="font-mono text-[11px]">Putaran Mesin (RPM)</span>
                    <Activity className="w-3.5 h-3.5 text-pink-400" />
                  </div>
                  <div className="text-lg font-mono font-bold text-white tabular-nums">
                    {selectedUnit.status === 'WORKING' ? selectedUnit.engineRpm : selectedUnit.status === 'IDLE' ? 750 : 0}
                    <span className="text-xs font-normal text-slate-400 ml-1">RPM</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-pink-500 h-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (selectedUnit.engineRpm / 2200) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Fuel Level */}
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="font-mono text-[11px]">Kapasitas Solar</span>
                    <Fuel className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-lg font-mono font-bold text-emerald-400 tabular-nums">
                    {selectedUnit.fuelPercentage}%
                    <span className="text-xs font-normal text-slate-400 ml-1">Tersisa</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${selectedUnit.fuelPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Hour Meter */}
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="font-mono text-[11px]">Hour Meter (HM)</span>
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="text-lg font-mono font-bold text-white tabular-nums">
                    {selectedUnit.hourMeter.toFixed(1)}
                    <span className="text-xs font-normal text-slate-400 ml-1">HM</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono block mt-1">Servis: +220 HM lagi</span>
                </div>

                {/* Hydraulic Temperature & Oil Pressure */}
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="font-mono text-[11px]">Suhu Hidrolik / Tekanan</span>
                    <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                  <div className="text-lg font-mono font-bold text-white tabular-nums">
                    {selectedUnit.hydraulicTempC}°C
                    <span className="text-xs font-normal text-slate-400 ml-1 font-mono">/ {selectedUnit.oilPressureBar} bar</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono block mt-1">✓ Tekanan Nominal</span>
                </div>
              </div>

              {/* Operator on Duty & Geofence Compliance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-900/50 rounded-lg border border-slate-800/80 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                    <User className="w-4 h-4 text-pink-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">Operator Bertugas:</span>
                    <span className="font-bold text-white">{selectedUnit.operatorName}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{selectedUnit.sioNumber}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono">Geofence Proyek:</span>
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 justify-end">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Dalam Batas Kerja Legal
                    </span>
                  </div>
                  <a
                    href={`https://wa.me/628119208800?text=Halo%2C%20saya%20ingin%20koordinasi%20dengan%20operator%20unit%20${selectedUnit.unitCode}%20di%20${selectedUnit.currentProject}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-pink-400 rounded transition-colors"
                    title="Panggil Radio / WA Dispatch"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
