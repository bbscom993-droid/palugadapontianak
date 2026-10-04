export type EquipmentCategory = 
  | 'excavator' 
  | 'bulldozer' 
  | 'crane' 
  | 'wheel-loader' 
  | 'compactor' 
  | 'motor-grader' 
  | 'dump-truck';

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  categoryLabel: string;
  brand: string;
  model: string;
  year: number;
  image: string;
  description: string;
  hourlyRate: number; // in IDR
  dailyRate: number;  // in IDR (8 hours)
  monthlyRate: number; // in IDR (200 hours)
  minRentalHours: number;
  availableUnits: number;
  specs: {
    operatingWeight: string; // e.g. "20.5 Ton"
    enginePower: string;     // e.g. "158 HP (118 kW)"
    capacity: string;        // e.g. "Bucket 1.0 m³" or "50 Ton"
    fuelConsumption: string; // e.g. "14 - 18 Liter / Jam"
    maxReachOrDepth: string; // e.g. "Galian Maks. 6.7 Meter"
    undercarriage: string;   // e.g. "Steel Track 600mm" or "Tire 23.5-25"
  };
  features: string[];
  recommendedUses: string[];
  siaCertValidUntil: string;
  isImmediateDispatchAvailable?: boolean;
  readyStockCount?: number;
  dispatchPoolLocation?: string;
  dispatchEtaHours?: number;
  dispatchStatus?: 'READY_IMMEDIATE' | 'DEPLOYED_RETURNING_SOON' | 'SCHEDULED_MAINTENANCE';
  nextAvailableDate?: string;
}

export type MachineStatus = 'WORKING' | 'IDLE' | 'MAINTENANCE' | 'TRANSIT';

export interface FleetTelemetry {
  id: string;
  equipmentId: string;
  unitCode: string;
  name: string;
  model: string;
  category: EquipmentCategory;
  status: MachineStatus;
  operatorName: string;
  sioNumber: string;
  currentProject: string;
  locationName: string;
  province: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  hourMeter: number; // HM
  fuelPercentage: number;
  engineRpm: number;
  batteryVoltage: number;
  oilPressureBar: number;
  hydraulicTempC: number;
  currentSpeedKmh: number;
  lastPingTime: string;
  geofenceStatus: 'INSIDE_SAFE_ZONE' | 'WARNING_PERIMETER';
  image: string;
}

export interface MediaUpload {
  id: string;
  name: string;
  type: 'video' | 'image';
  url: string; // Blob or mock URL or data URL
  sizeMb?: number;
  durationSec?: number;
  uploadedAt: string;
  category: 'survey_akses' | 'kondisi_medan' | 'unboxing_serah_terima' | 'kegiatan_harian';
  notes?: string;
}

export interface ProjectActivity {
  id: string;
  title: string;
  unitCode: string;
  equipmentName: string;
  projectName: string;
  location: string;
  date: string;
  time: string;
  operatorName: string;
  category: 'MOBILISASI' | 'LAND_CLEARING' | 'CUT_AND_FILL' | 'HEAVY_LIFTING' | 'MAINTENANCE' | 'INSPEKSI';
  description: string;
  videoUrl?: string;
  videoDuration?: string;
  videoThumbnail?: string;
  metrics: {
    hmAdded: number;
    fuelConsumedLiters: number;
    volumeM3?: string;
    weatherCondition: string;
  };
  tags: string[];
}

export interface InformationArticle {
  id: string;
  title: string;
  category: 'REGULASI_K3' | 'MOBILISASI_LOGISTIK' | 'PERAWATAN_MESIN' | 'PANDUAN_SEWA';
  categoryLabel: string;
  readTime: string;
  publishedDate: string;
  author: string;
  summary: string;
  content: string[];
  keyPoints: string[];
  downloadableDoc?: string;
}

export interface BookingFormState {
  equipmentId: string;
  rentalPackage: 'lepas-kunci' | 'operator-sio' | 'all-in-solar';
  durationDays: number;
  workingShifts: 1 | 2; // 1 shift (8 jam), 2 shift (16 jam lembur)
  startDate: string;
  projectName: string;
  projectCity: string;
  projectProvince: string;
  projectAddress: string;
  mobilizationDistanceKm: number;
  companyName: string;
  picName: string;
  picPhone: string;
  picEmail: string;
  needTrailerLowbed: boolean;
  notes: string;
  videoUploads?: MediaUpload[];
  siteVideoNotes?: string;
}

export interface BookingRecord {
  id: string;
  bookingRef: string;
  createdAt: string;
  equipmentName: string;
  equipmentModel: string;
  equipmentCategory: EquipmentCategory;
  unitCodeAssigned: string;
  companyName: string;
  picName: string;
  picPhone: string;
  projectName: string;
  projectLocation: string;
  startDate: string;
  durationDays: number;
  workingShifts: number;
  rentalPackage: 'lepas-kunci' | 'operator-sio' | 'all-in-solar';
  status: 'PENDING_REVIEW' | 'SPK_TERBIT' | 'MOBILISASI' | 'BEROPERASI' | 'SELESAI';
  totalCost: number;
  mobDemobCost: number;
  rentalCost: number;
  operatorCost: number;
  taxPpn: number;
  hmStart: number;
  hmCurrent: number;
  operatorName: string;
  operatorSio: string;
  inspectionPassed: boolean;
  videoUploads?: MediaUpload[];
}
