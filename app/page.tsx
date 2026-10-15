"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ProductCard from "@/components/ProductCard";
import TradeInModal from "@/components/TradeInModal";
import { ProductCardSkeleton } from "@/components/Skeleton";
import { getProducts, Product, Brand, ProductCondition } from "@/lib/db";
import { formatRupiah, getWhatsAppUrl } from "@/lib/formatters";
import { STORE_CONFIG } from "@/lib/config";
import {
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Truck,
  Search,
  SlidersHorizontal,
  X,
  ArrowDownUp,
  Sparkles,
  Wrench,
  ChevronRight,
  Filter,
  Star,
  Flame,
  ArrowRight,
  Smartphone,
  Tag,
  Check,
} from "lucide-react";

const BRAND_OPTIONS: { name: Brand | "Semua"; label: string }[] = [
  { name: "Semua", label: "Semua Merk" },
  { name: "iPhone", label: "Apple iPhone" },
  { name: "Samsung", label: "Samsung Galaxy" },
  { name: "Xiaomi", label: "Xiaomi / Poco" },
  { name: "Oppo", label: "Oppo Mobile" },
];

const CONDITION_OPTIONS: (ProductCondition | "Semua")[] = [
  "Semua",
  "Baru",
  "Bekas Mulus",
  "Bekas Minus",
];

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedBrand, setSelectedBrand] = useState<Brand | "Semua">("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<
    ProductCondition | "Semua"
  >("Semua");
  const [sortOption, setSortOption] = useState<"terbaru" | "termurah" | "termahal">(
    "terbaru"
  );

  // Mobile Bottom Sheet Filter State
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Trade In Modal State
  const [tradeInProduct, setTradeInProduct] = useState<Product | null>(null);

  useEffect(() => {
    const data = getProducts("public");
    setProducts(data);
    setLoading(false);
  }, []);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (p.stok <= 0) return false;

        if (selectedBrand !== "Semua" && p.brand !== selectedBrand) {
          return false;
        }

        if (selectedCondition !== "Semua" && p.kondisi !== selectedCondition) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = `${p.brand} ${p.tipe} ${p.storage}`.toLowerCase().includes(q);
          const matchDesc = p.deskripsi?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc) return false;
        }

        const min = minPrice ? parseInt(minPrice, 10) : 0;
        const max = maxPrice ? parseInt(maxPrice, 10) : Infinity;
        if (p.hargaJual < min || p.hargaJual > max) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === "termurah") {
          return a.hargaJual - b.hargaJual;
        }
        if (sortOption === "termahal") {
          return b.hargaJual - a.hargaJual;
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [
    products,
    selectedBrand,
    selectedCondition,
    searchQuery,
    minPrice,
    maxPrice,
    sortOption,
  ]);

  const resetFilters = () => {
    setSelectedBrand("Semua");
    setSearchQuery("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedCondition("Semua");
    setSortOption("terbaru");
    setIsFilterSheetOpen(false);
  };

  const hasActiveFilters =
    selectedBrand !== "Semua" ||
    searchQuery.trim() !== "" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    selectedCondition !== "Semua";

  // Featured unit for Hero showcase (e.g. first iPhone or highest stock)
  const featuredProduct = products.find((p) => p.brand === "iPhone" && p.stok > 0) || products[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F4]">
      <Header />

      <main className="flex-1 pb-16">
        {/* ========================================================= */}
        {/* 1. HERO SECTION MEWAH & MODERN (2-COLUMN SHOWCASE)        */}
        {/* ========================================================= */}
        <section className="relative bg-gradient-to-b from-[#0A0A0A] via-[#121212] to-[#1C1917] text-white pt-12 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
          {/* Decorative glowing gradient orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content (Text & Call to Action) */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-5">
              {/* Trust Rating Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-stone-200 text-xs font-semibold backdrop-blur-md border border-white/10 shadow-inner">
                <div className="flex text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                </div>
                <span>4.9/5 dari 1.200+ Pelanggan Ponorogo</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
                Pusat HP Bekas & Baru{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                  Terpercaya
                </span>{" "}
                di Ponorogo
              </h1>

              {/* Subtitle */}
              <p className="text-stone-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Temukan iPhone, Samsung, Xiaomi & Oppo berkualitas. Semua unit second telah melalui{" "}
                <strong className="text-white">30+ titik inspeksi teknisi</strong> dengan garansi toko terjamin, bisa tukar tambah dan COD.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 w-full sm:w-auto">
                <a
                  href="#katalog"
                  className="h-12 px-7 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all duration-200 active:scale-95"
                >
                  <span>Lihat Semua HP</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  href="/cek-servis"
                  className="h-12 px-6 rounded-xl border border-stone-700 hover:border-amber-400 text-stone-200 hover:text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all bg-stone-900/60 backdrop-blur active:scale-95"
                >
                  <Wrench className="w-4 h-4 text-[#F59E0B]" />
                  <span>Cek Status Servis</span>
                </Link>
              </div>

              {/* Quick Trust Checklist */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Garansi Resmi & Toko</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Bisa COD Ponorogo</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Terima Tukar Tambah</span>
                </div>
              </div>
            </div>

            {/* Right Showcase Card (Featured Phone Highlight) */}
            {featuredProduct && (
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-stone-900/90 to-stone-950/90 p-5 border border-stone-700/80 shadow-2xl backdrop-blur-xl group hover:border-amber-500/50 transition-all duration-300">
                  {/* Floating Flame Tag */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                      <Flame className="w-3.5 h-3.5 fill-current text-amber-400 animate-pulse" />
                      <span>Unit Pilihan Terlaris</span>
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                      Stok Tersedia
                    </span>
                  </div>

                  {/* Photo Container */}
                  <Link href={`/produk/${featuredProduct.id}`} className="block">
                    <div className="relative w-full aspect-[4/3] rounded-2xl bg-stone-900 overflow-hidden border border-stone-800 group-hover:scale-102 transition-transform duration-300">
                      <Image
                        src={featuredProduct.foto[0] || STORE_CONFIG.fallbackImage}
                        alt={featuredProduct.tipe}
                        fill
                        sizes="(max-width: 640px) 100vw, 400px"
                        className="object-cover"
                      />
                      <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-xs text-[11px] font-bold text-white">
                        {featuredProduct.kondisi}
                        {featuredProduct.baterai && ` • BH ${featuredProduct.baterai}%`}
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className="text-xs uppercase font-bold text-stone-400">
                        {featuredProduct.brand}
                      </span>
                      <h3 className="text-lg font-extrabold text-white group-hover:text-amber-400 transition-colors">
                        {featuredProduct.tipe} {featuredProduct.storage}
                      </h3>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-xl font-black text-amber-400">
                          {formatRupiah(featuredProduct.hargaJual)}
                        </span>
                        <span className="text-xs text-stone-500 line-through">
                          {formatRupiah(featuredProduct.hargaJual + 750000)}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Bottom Action inside card */}
                  <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setTradeInProduct(featuredProduct)}
                      className="flex-1 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-stone-700 text-stone-200 text-xs font-bold transition-colors"
                    >
                      Tukar Tambah
                    </button>
                    <Link
                      href={`/produk/${featuredProduct.id}`}
                      className="flex-1 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                    >
                      <span>Lihat Detail</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================= */}
        {/* 2. STRIP KEPERCAYAAN 4 ITEM MODERN GLASS                   */}
        {/* ========================================================= */}
        <section className="relative -mt-6 z-20 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 p-4 sm:p-6 shadow-xl shadow-stone-900/5 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-stone-50 transition-colors">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-[#F59E0B] flex items-center justify-center shrink-0 border border-amber-100">
                <ShieldCheck className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 leading-tight">
                  Garansi Toko
                </h4>
                <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
                  Jaminan tukar unit aman
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-stone-50 transition-colors">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <CheckCircle2 className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 leading-tight">
                  Dicek Teknisi
                </h4>
                <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
                  Lolos 30+ titik QC ketat
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-stone-50 transition-colors">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <RefreshCw className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 leading-tight">
                  Tukar Tambah
                </h4>
                <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
                  Taksiran HP lama tertinggi
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-stone-50 transition-colors">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                <Truck className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 leading-tight">
                  Bisa COD Ponorogo
                </h4>
                <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
                  Cek barang sebelum bayar
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 3. KATALOG PRODUK & FILTER SECTION                        */}
        {/* ========================================================= */}
        <div id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 scroll-mt-20">
          {/* Header Title Catalog */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
                Koleksi Smartphone
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-950 tracking-tight">
                Pilih Handphone Impian Anda
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm">
              Semua produk siap dikirim atau diambil di toko kami Jl. Urip Sumoharjo No. 45 Ponorogo.
            </p>
          </div>

          {/* Quick Filter: Brand Chips (Enhanced with Labels) */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-3 scrollbar-none no-scrollbar">
            {BRAND_OPTIONS.map((item) => {
              const active = selectedBrand === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setSelectedBrand(item.name)}
                  className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 active:scale-95 flex items-center gap-2 ${
                    active
                      ? "bg-[#0A0A0A] text-white shadow-md ring-2 ring-stone-900"
                      : "bg-white text-stone-700 border border-stone-300 hover:border-stone-400 hover:bg-stone-50"
                  }`}
                >
                  <Smartphone className={`w-3.5 h-3.5 ${active ? "text-amber-400" : "text-stone-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Filter Bar */}
          <div className="mt-4 bg-white p-3.5 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
            {/* Desktop Filters (Single Row) */}
            <div className="hidden lg:grid grid-cols-12 gap-3 items-center">
              {/* Search */}
              <div className="col-span-4 relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari tipe, kapasitas, atau kata kunci..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Price Min-Max */}
              <div className="col-span-3 flex items-center gap-2">
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Harga Min (Rp)"
                  className="w-full h-11 px-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                />
                <span className="text-stone-300">-</span>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Harga Max (Rp)"
                  className="w-full h-11 px-3 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                />
              </div>

              {/* Condition */}
              <div className="col-span-2">
                <select
                  value={selectedCondition}
                  onChange={(e) =>
                    setSelectedCondition(e.target.value as ProductCondition | "Semua")
                  }
                  className="w-full h-11 px-3 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F59E0B] bg-white text-stone-700"
                >
                  <option value="Semua">Semua Kondisi</option>
                  <option value="Baru">Baru Segel</option>
                  <option value="Bekas Mulus">Bekas Mulus</option>
                  <option value="Bekas Minus">Bekas Minus</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="col-span-3 flex items-center gap-2">
                <ArrowDownUp className="w-4 h-4 text-stone-400 shrink-0" />
                <select
                  value={sortOption}
                  onChange={(e) =>
                    setSortOption(
                      e.target.value as "terbaru" | "termurah" | "termahal"
                    )
                  }
                  className="w-full h-11 px-3 rounded-xl border border-stone-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#F59E0B] bg-white text-stone-700"
                >
                  <option value="terbaru">Urutkan: Terbaru Diunggah</option>
                  <option value="termurah">Urutkan: Harga Termurah</option>
                  <option value="termahal">Urutkan: Harga Termahal</option>
                </select>
              </div>
            </div>

            {/* Mobile Filter Bar (Search + Filter Button) */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari merk atau tipe HP..."
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                />
              </div>

              <button
                onClick={() => setIsFilterSheetOpen(true)}
                className={`h-11 px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  hasActiveFilters
                    ? "bg-[#0A0A0A] text-white border-stone-900"
                    : "bg-white text-stone-800 border-stone-300 hover:bg-stone-50"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filter</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                )}
              </button>
            </div>

            {/* Active Filter Chips & Result Count */}
            <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-stone-500 font-medium mr-1">
                  Menampilkan {filteredProducts.length} produk pilihan
                </span>

                {selectedBrand !== "Semua" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 font-medium">
                    Merk: {selectedBrand}
                    <button
                      onClick={() => setSelectedBrand("Semua")}
                      className="hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedCondition !== "Semua" && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 font-medium">
                    Kondisi: {selectedCondition}
                    <button
                      onClick={() => setSelectedCondition("Semua")}
                      className="hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {minPrice && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 font-medium">
                    Min: {formatRupiah(parseInt(minPrice, 10))}
                    <button
                      onClick={() => setMinPrice("")}
                      className="hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {maxPrice && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 font-medium">
                    Max: {formatRupiah(parseInt(maxPrice, 10))}
                    <button
                      onClick={() => setMaxPrice("")}
                      className="hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-[#D97706] hover:underline font-semibold ml-1"
                  >
                    Reset Semua
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="mt-8">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              /* State Kosong */
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto my-8 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-stone-900">
                  Produk tidak ditemukan
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-1 mb-5 leading-relaxed">
                  Tidak ada smartphone yang cocok dengan filter atau kata kunci Anda saat ini.
                </p>
                <button
                  onClick={resetFilters}
                  className="h-11 px-5 rounded-xl bg-[#0A0A0A] hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold transition-all active:scale-95"
                >
                  Reset Semua Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenTradeIn={(p) => setTradeInProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* BANNER AJAKAN TUKAR TAMBAH / SERVIS DI BAWAH KATALOG      */}
          {/* ========================================================= */}
          <div className="mt-16 rounded-3xl bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950 p-6 sm:p-10 text-white border border-stone-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Program Tukar Tambah Ponorogo Phone</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                Punya HP Lama? Tukar ke Unit Baru Sekarang!
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 max-w-xl">
                Bawa HP lama Anda (bahkan kondisi batangan atau lecet wajar). Kami hargai dengan taksiran tertinggi, langsung kurangi harga unit idaman Anda!
              </p>
            </div>

            <button
              onClick={() => {
                if (products.length > 0) {
                  setTradeInProduct(products[0]);
                }
              }}
              className="h-12 px-6 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-stone-950 font-extrabold text-xs sm:text-sm whitespace-nowrap shadow-md transition-all active:scale-95 flex items-center gap-2 shrink-0"
            >
              <span>Konsultasi Tukar Tambah</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Filter Bottom Sheet */}
      {isFilterSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in slide-in-from-bottom duration-200 max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-stone-900 text-base">Filter Produk</h3>
              <button
                onClick={() => setIsFilterSheetOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Kondisi HP
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CONDITION_OPTIONS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCondition(c)}
                      className={`h-10 rounded-xl text-xs font-semibold border ${
                        selectedCondition === c
                          ? "bg-[#0A0A0A] text-white border-stone-900"
                          : "bg-white text-stone-700 border-stone-300"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Rentang Harga (Rp)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Harga Minimum"
                    className="h-11 px-3 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#F59E0B]"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Harga Maksimum"
                    className="h-11 px-3 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-[#F59E0B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Urutkan Berdasarkan
                </label>
                <select
                  value={sortOption}
                  onChange={(e) =>
                    setSortOption(
                      e.target.value as "terbaru" | "termurah" | "termahal"
                    )
                  }
                  className="w-full h-11 px-3 rounded-xl border border-stone-300 text-sm bg-white"
                >
                  <option value="terbaru">Terbaru Diunggah</option>
                  <option value="termurah">Harga Termurah</option>
                  <option value="termahal">Harga Termahal</option>
                </select>
              </div>
            </div>

            <div className="p-4 border-t border-stone-200 bg-stone-50 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 h-11 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold"
              >
                Reset
              </button>
              <button
                onClick={() => setIsFilterSheetOpen(false)}
                className="flex-1 h-11 rounded-xl bg-[#0A0A0A] text-white text-xs font-semibold"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trade-in Modal */}
      <TradeInModal
        product={tradeInProduct}
        isOpen={!!tradeInProduct}
        onClose={() => setTradeInProduct(null)}
      />

      <FloatingWhatsApp />
      <Footer />
    </div>
  );
}
