"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import TradeInModal from "@/components/TradeInModal";
import { ProductDetailSkeleton } from "@/components/Skeleton";
import { getProductById, Product } from "@/lib/db";
import { STORE_CONFIG } from "@/lib/config";
import { formatRupiah, getWhatsAppUrl } from "@/lib/formatters";
import {
  MessageCircle,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  PackageCheck,
  BatteryMedium,
  Sparkles,
  Info,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isTradeInOpen, setIsTradeInOpen] = useState(false);

  useEffect(() => {
    if (!productId) return;
    const data = getProductById(productId, "public");
    setProduct(data);
    setLoading(false);
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F5F4]">
        <Header />
        <main className="flex-1 py-8">
          <ProductDetailSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F5F4]">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl border border-stone-200 p-8 text-center shadow-xs">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Info className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">
              Produk Tidak Tersedia
            </h2>
            <p className="text-sm text-stone-500 mt-2 mb-6">
              Smartphone yang Anda cari mungkin sudah laku terjual atau tautan salah.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A0A0A] hover:bg-stone-800 text-white text-sm font-semibold transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Katalog</span>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const photos =
    product.foto && product.foto.length > 0
      ? product.foto
      : [STORE_CONFIG.fallbackImage];

  const activePhoto = photos[selectedPhotoIndex] || photos[0];

  const handleWhatsAppChat = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const productUrl = `${origin}/produk/${product.id}`;

    const text = [
      `Halo Admin ${STORE_CONFIG.name}, saya berminat membeli unit ini:`,
      `• Merk & Tipe: ${product.brand} ${product.tipe}`,
      `• Kapasitas: ${product.storage}`,
      `• Kondisi: ${product.kondisi}`,
      `• Harga: ${formatRupiah(product.hargaJual)}`,
      product.baterai ? `• Kesehatan Baterai: ${product.baterai}%` : null,
      `• Tautan Produk: ${productUrl}`,
      ``,
      `Apakah masih ready di toko? Apakah bisa langsung dicek atau COD?`,
    ]
      .filter(Boolean)
      .join("\n");

    const url = getWhatsAppUrl(STORE_CONFIG.phoneRaw, text);
    window.open(url, "_blank");
  };

  const getConditionBadgeStyle = (kondisi: Product["kondisi"]) => {
    switch (kondisi) {
      case "Baru":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Bekas Mulus":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Bekas Minus":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-stone-100 text-stone-700 border-stone-200";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F4]">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-24 sm:py-8 w-full">
        {/* Breadcrumb / Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog</span>
          </Link>
          <div className="text-xs text-stone-400">
            <span>Katalog</span> / <span className="text-stone-700">{product.brand}</span>
          </div>
        </div>

        {/* 2-Column Layout (Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Photo Gallery */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Main Big Photo */}
            <div className="relative w-full aspect-[4/3] rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-sm">
              <Image
                src={activePhoto}
                alt={`${product.brand} ${product.tipe}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-all duration-300"
              />

              {/* Badges on main photo */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-xs shadow-xs ${getConditionBadgeStyle(
                    product.kondisi
                  )}`}
                >
                  {product.kondisi}
                </span>

                {product.stok <= STORE_CONFIG.lowStockThreshold && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
                    Sisa {product.stok} unit
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail selector */}
            {photos.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {photos.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white border-2 transition-all shrink-0 ${
                      selectedPhotoIndex === idx
                        ? "border-[#F59E0B] ring-2 ring-amber-400/30 scale-102"
                        : "border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`Foto ${idx + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Store Inspection Guarantee Banner */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-50 text-[#F59E0B] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  Lolos Quality Control 100% Normal
                </h4>
                <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                  Unit ini telah dites fungsionalitasnya: Sinyal, LCD Touchscreen, Kamera,
                  Speaker, Mikrofon, Wi-Fi, dan Sensor. Garansi toko berlaku sejak tanggal pembelian.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Details (Sticky on desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-5 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
              {/* Brand & Title */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  {product.brand}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 mt-1 leading-snug">
                  {product.tipe} {product.storage}
                </h1>
              </div>

              {/* Price */}
              <div className="mt-4 pb-5 border-b border-stone-100">
                <span className="text-xs text-stone-400 block mb-1">Harga Toko:</span>
                <div className="text-3xl sm:text-4xl font-extrabold text-stone-950">
                  {formatRupiah(product.hargaJual)}
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-emerald-700 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>Stok Ready: {product.stok} unit</span>
                </div>
              </div>

              {/* Specifications Table */}
              <div className="mt-5 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Spesifikasi Singkat
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                    <span className="text-stone-400 block mb-0.5">Merk</span>
                    <span className="font-semibold text-stone-800">{product.brand}</span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                    <span className="text-stone-400 block mb-0.5">Model / Tipe</span>
                    <span className="font-semibold text-stone-800">{product.tipe}</span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                    <span className="text-stone-400 block mb-0.5">Penyimpanan</span>
                    <span className="font-semibold text-stone-800">{product.storage}</span>
                  </div>
                  <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                    <span className="text-stone-400 block mb-0.5">Kondisi Fisik</span>
                    <span className="font-semibold text-stone-800">{product.kondisi}</span>
                  </div>
                  {product.baterai !== null && product.baterai !== undefined && (
                    <div className="col-span-2 p-2.5 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between">
                      <span className="text-stone-500">Kesehatan Baterai (BH)</span>
                      <span className="font-bold text-emerald-600 inline-flex items-center gap-1">
                        <BatteryMedium className="w-4 h-4" />
                        {product.baterai}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Box "Yang Anda Dapat" */}
              <div className="mt-5 p-4 rounded-xl bg-amber-50/60 border border-amber-200/80">
                <div className="flex items-center gap-2 mb-2 text-stone-900 font-bold text-sm">
                  <PackageCheck className="w-4 h-4 text-[#D97706]" />
                  <span>Yang Anda Dapatkan:</span>
                </div>
                <ul className="space-y-1.5 text-xs text-stone-700">
                  {product.kelengkapan.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                  <li className="flex items-center gap-2 pt-1 border-t border-amber-200/60 font-semibold text-stone-900">
                    <Sparkles className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                    <span>Garansi: {product.garansi}</span>
                  </li>
                </ul>
              </div>

              {/* Description */}
              <div className="mt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Deskripsi Penjual
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                  {product.deskripsi}
                </p>
              </div>

              {/* Desktop Action Buttons */}
              <div className="mt-6 hidden sm:grid grid-cols-2 gap-3">
                <button
                  onClick={handleWhatsAppChat}
                  className="h-12 px-4 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Chat WhatsApp</span>
                </button>

                <button
                  onClick={() => setIsTradeInOpen(true)}
                  className="h-12 px-4 rounded-xl border-2 border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white text-stone-950 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Tukar Tambah</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Bar on Mobile (<sm) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-stone-200 px-4 py-3 flex items-center justify-between gap-3 shadow-lg">
        <div>
          <span className="text-[10px] text-stone-400 block">Harga Pas:</span>
          <span className="text-base font-extrabold text-stone-900">
            {formatRupiah(product.hargaJual)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTradeInOpen(true)}
            className="h-11 px-3 rounded-xl border border-stone-800 text-stone-900 font-semibold text-xs flex items-center gap-1 active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tukar</span>
          </button>
          <button
            onClick={handleWhatsAppChat}
            className="h-11 px-4 rounded-xl bg-[#16A34A] text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>

      <TradeInModal
        product={product}
        isOpen={isTradeInOpen}
        onClose={() => setIsTradeInOpen(false)}
      />

      <div className="hidden sm:block">
        <FloatingWhatsApp />
      </div>
      <Footer />
    </div>
  );
}
