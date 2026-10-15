import React from "react";
import Link from "next/link";
import { STORE_CONFIG } from "@/lib/config";
import {
  Smartphone,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-stone-300 border-t border-white/10 pt-14 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#F59E0B] flex items-center justify-center text-stone-950 font-bold">
                <Smartphone className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Ponorogo <span className="text-[#F59E0B]">Phone</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Pusat jual beli smartphone bekas berkualitas & baru bergaransi resmi di Ponorogo.
              Semua unit telah lolos 30+ titik inspeksi teknisi berpengalaman.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
              <span>Garansi Fisik & Mesin Terjamin</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#F59E0B] transition-colors flex items-center gap-1.5"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Katalog Produk Terbaru</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/cek-servis"
                  className="hover:text-[#F59E0B] transition-colors flex items-center gap-1.5"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Cek Progres Servis</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Store Location & Hours */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
              Lokasi & Jam Kerja
            </h4>
            <div className="space-y-3 text-sm text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                <span>{STORE_CONFIG.address}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                <span>{STORE_CONFIG.openingHours}</span>
              </div>
            </div>
          </div>

          {/* Contact & Services */}
          <div className="flex flex-col gap-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
              Layanan Toko
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Jual Beli HP Second & Baru</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Tukar Tambah (Trade-in)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Servis HP (LCD, Baterai, Mesin)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Bisa COD Area Ponorogo</span>
              </li>
            </ul>
            <div className="pt-2">
              <a
                href={`https://wa.me/${STORE_CONFIG.phoneRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp: {STORE_CONFIG.phoneDisplay}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {STORE_CONFIG.name}. Hak Cipta Dilindungi.</p>
          <p className="text-stone-400 font-mono">MVP Demo v1.0 • Ponorogo, Jawa Timur</p>
        </div>
      </div>
    </footer>
  );
}
