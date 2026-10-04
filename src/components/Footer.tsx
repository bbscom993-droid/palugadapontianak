import React from 'react';
import { Truck, PhoneCall, Mail, MapPin, ShieldCheck, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#070b12] border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand & Mission (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded bg-pink-600 flex items-center justify-center text-white font-extrabold shadow-md">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-wider text-white uppercase block leading-none">
                  PALUGADA<span className="text-pink-500">.</span>
                </span>
                <span className="text-[10px] tracking-widest text-slate-400 font-mono uppercase block mt-1">
                  ALAT BERAT PONTIANAK
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              <strong className="text-white">Palugada Alat Berat Pontianak</strong> adalah penyedia solusi komprehensif rental alat berat konstruksi sipil, infrastruktur jalan perbatasan, pelabuhan kijing, perkebunan kelapa sawit, dan pertambangan bauksit di Kota Pontianak dan seluruh wilayah Kalimantan Barat. Apa lu butuh, gua ada.
            </p>
            <div className="space-y-1.5 text-[11px] font-mono text-slate-300">
              <p>NIB / OSS-RBA: 0220108920192</p>
              <p>SK Kemenkumham: AHU-0019281.AH.01.02.TAHUN 2021</p>
              <p>Sertifikasi K3 & Alat: Depnaker RI No. 882/PJ/K3/2022</p>
            </div>
          </div>

          {/* Logistics Hubs & Pools */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase font-bold text-white tracking-wider">
              Pool & Workshop Utama Kalbar
            </h4>
            <div className="space-y-2.5 text-xs">
              <div>
                <strong className="text-slate-200 block">Hub Pusat Pontianak:</strong>
                <span className="text-slate-400">Jl. Khatulistiwa KM 8, Siantan Hilir, Pontianak Utara</span>
              </div>
              <div>
                <strong className="text-slate-200 block">Hub Kubu Raya & Bandara:</strong>
                <span className="text-slate-400">Jl. Arteri Supadio KM 12, Sungai Raya, Kubu Raya</span>
              </div>
              <div>
                <strong className="text-slate-200 block">Hub Ketapang & Kendawangan:</strong>
                <span className="text-slate-400">Jl. Pelang KM 18, Area Pertambangan Bauksit Ketapang</span>
              </div>
            </div>
          </div>

          {/* Quick Equipment Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase font-bold text-white tracking-wider">
              Kategori Alat Berat
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-pink-400 transition-colors">Excavator Standard & Breaker 20T</span></li>
              <li><span className="hover:text-pink-400 transition-colors">Bulldozer Crawler D8R / D6R</span></li>
              <li><span className="hover:text-pink-400 transition-colors">Mobile Crane 25T - 55T All-Terrain</span></li>
              <li><span className="hover:text-pink-400 transition-colors">Vibratory Compactor 12 Ton</span></li>
              <li><span className="hover:text-pink-400 transition-colors">Wheel Loader Bucket 3.3 m³</span></li>
              <li><span className="hover:text-pink-400 transition-colors">Dump Truck Tronton 24 m³</span></li>
            </ul>
          </div>

          {/* Direct Dispatch & Hotline */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase font-bold text-white tracking-wider">
              Layanan Tanggap 24 Jam
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <PhoneCall className="w-4 h-4 text-pink-400 shrink-0" />
                <span className="font-mono font-semibold">+62 811-920-8800</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-pink-400 shrink-0" />
                <span className="font-mono">dispatch@palugada-alatberat.id</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-2">
                Tim teknisi mekanik mobile siaga 24 jam untuk perbaikan darurat di lokasi proyek.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Palugada Alat Berat Pontianak. Seluruh Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-4">
            <span>Standar Keselamatan K3 Kemenaker</span>
            <span>·</span>
            <span>Sertifikat SIA & SIO Valid</span>
            <span>·</span>
            <span>Garansi Uptime 99.2%</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
