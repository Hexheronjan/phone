"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/db";
import { STORE_CONFIG } from "@/lib/config";
import { formatRupiah, getWhatsAppUrl } from "@/lib/formatters";
import {
  MessageCircle,
  RefreshCw,
  BatteryMedium,
  Shield,
  Sparkles,
  Flame,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

interface ProductCardProps {
  product: Product;
  onOpenTradeIn?: (product: Product) => void;
}

export default function ProductCard({ product, onOpenTradeIn }: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(
    product.foto && product.foto.length > 0 ? product.foto[0] : STORE_CONFIG.fallbackImage
  );

  const isLowStock = product.stok <= STORE_CONFIG.lowStockThreshold;

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const productUrl = `${origin}/produk/${product.id}`;
    const text = [
      `Halo Admin ${STORE_CONFIG.name}, saya berminat dengan unit ini:`,
      `• Unit: ${product.brand} ${product.tipe} ${product.storage}`,
      `• Kondisi: ${product.kondisi}`,
      `• Harga: ${formatRupiah(product.hargaJual)}`,
      product.baterai ? `• Battery Health: ${product.baterai}%` : null,
      `• Link Produk: ${productUrl}`,
      ``,
      `Apakah barangnya masih ready di toko? Apakah bisa COD area Ponorogo?`,
    ]
      .filter(Boolean)
      .join("\n");

    const url = getWhatsAppUrl(STORE_CONFIG.phoneRaw, text);
    window.open(url, "_blank");
  };

  const handleTradeInClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onOpenTradeIn) {
      onOpenTradeIn(product);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl border border-stone-200/90 hover:border-amber-400 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Clickable Area for Detail Page */}
      <Link href={`/produk/${product.id}`} className="flex-1 flex flex-col">
        {/* Photo with Studio Neutral Background & 4:3 Ratio */}
        <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-stone-50 to-stone-100 overflow-hidden">
          <Image
            src={imgSrc}
            alt={`${product.brand} ${product.tipe}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
            onError={() => setImgSrc(STORE_CONFIG.fallbackImage)}
            className="object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {/* Condition Badge */}
            {product.kondisi === "Baru" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-blue-600 text-white shadow-md shadow-blue-500/20 backdrop-blur-md">
                <Sparkles className="w-3 h-3" />
                <span>Baru Segel</span>
              </span>
            )}
            {product.kondisi === "Bekas Mulus" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-md shadow-emerald-600/20 backdrop-blur-md">
                <ShieldCheck className="w-3 h-3" />
                <span>Bekas Mulus</span>
              </span>
            )}
            {product.kondisi === "Bekas Minus" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-600 text-white shadow-md shadow-amber-600/20 backdrop-blur-md">
                <span>Bekas Minus</span>
              </span>
            )}

            {/* Low Stock Badge */}
            {isLowStock && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-md shadow-rose-600/20 animate-pulse">
                <Flame className="w-3 h-3 fill-current" />
                <span>Sisa {product.stok}</span>
              </span>
            )}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-3">
          <div>
            {/* Brand Pill + Storage Tag */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-stone-100 text-stone-700">
                {product.brand}
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                {product.storage}
              </span>
            </div>

            {/* Title: Model Name */}
            <h3 className="font-extrabold text-stone-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-[#D97706] transition-colors">
              {product.tipe}
            </h3>

            {/* Price Box */}
            <div className="mt-2 flex items-baseline gap-2">
              <div className="text-lg sm:text-2xl font-black text-stone-950 tracking-tight">
                {formatRupiah(product.hargaJual)}
              </div>
            </div>

            {/* Feature Pills */}
            <div className="mt-2.5 pt-2.5 border-t border-stone-100 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
              {product.baterai !== null && product.baterai !== undefined ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold text-[10px] sm:text-[11px]">
                  <BatteryMedium className="w-3.5 h-3.5" />
                  <span>BH {product.baterai}%</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold text-[10px] sm:text-[11px]">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Garansi Resmi</span>
                </span>
              )}

              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] text-stone-500 font-medium truncate">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="truncate">{product.garansi}</span>
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="px-3 pb-3.5 sm:px-5 sm:pb-5 pt-0 grid grid-cols-2 gap-1.5 sm:gap-2">
        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsAppClick}
          aria-label={`Beli via WhatsApp ${product.brand} ${product.tipe}`}
          className="h-10 sm:h-11 px-2 sm:px-3 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 shadow-sm shadow-emerald-600/20 transition-all active:scale-95"
        >
          <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current shrink-0" />
          <span className="truncate">Chat WA</span>
        </button>

        {/* Tukar Tambah Button */}
        <button
          onClick={handleTradeInClick}
          aria-label={`Tukar Tambah ${product.brand} ${product.tipe}`}
          className="h-10 sm:h-11 px-2 sm:px-3 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 shadow-xs transition-all active:scale-95"
        >
          <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-amber-400" />
          <span className="truncate">Tukar HP</span>
        </button>
      </div>
    </div>
  );
}
