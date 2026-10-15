"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { saveProduct, Brand, ProductCondition } from "@/lib/db";
import { compressImageFile } from "@/lib/imageCompressor";
import { useToast } from "@/components/Toast";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Check,
  Smartphone,
  Save,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";

const BRAND_LIST: Brand[] = ["iPhone", "Samsung", "Xiaomi", "Oppo"];
const CONDITION_LIST: ProductCondition[] = ["Baru", "Bekas Mulus", "Bekas Minus"];
const ACCESSORY_OPTIONS = ["Dus", "Charger", "Kabel", "Earphone", "Casing"];

export default function AddProductPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [brand, setBrand] = useState<Brand>("iPhone");
  const [tipe, setTipe] = useState("");
  const [storage, setStorage] = useState("128GB");
  const [kondisi, setKondisi] = useState<ProductCondition>("Bekas Mulus");
  const [baterai, setBaterai] = useState<string>("88");
  const [kelengkapan, setKelengkapan] = useState<string[]>([
    "Dus",
    "Charger",
    "Kabel",
  ]);
  const [garansi, setGaransi] = useState("Garansi toko 1 bulan");
  const [hargaBeli, setHargaBeli] = useState<string>("");
  const [hargaJual, setHargaJual] = useState<string>("");
  const [hargaMinNego, setHargaMinNego] = useState<string>("");
  const [stok, setStok] = useState<string>("1");
  const [deskripsi, setDeskripsi] = useState("");

  const [photos, setPhotos] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Handle Checkbox for Kelengkapan
  const toggleAccessory = (acc: string) => {
    setKelengkapan((prev) =>
      prev.includes(acc) ? prev.filter((item) => item !== acc) : [...prev, acc]
    );
  };

  // Handle Photo Upload with HTML Canvas Compression
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 5) {
      showToast("Maksimal 5 foto per produk.", "error");
      return;
    }

    setIsCompressing(true);
    setFormError("");

    try {
      const newBase64Photos: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64 = await compressImageFile(file);
        newBase64Photos.push(base64);
      }

      setPhotos((prev) => [...prev, ...newBase64Photos]);
      showToast(`${files.length} foto berhasil dikompres & diunggah`, "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memproses foto";
      showToast(msg, "error");
    } finally {
      setIsCompressing(false);
      // Reset input value
      e.target.value = "";
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  // Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!tipe.trim()) {
      setFormError("Nama model / tipe HP wajib diisi");
      return;
    }

    if (photos.length === 0) {
      setFormError("Wajib mengunggah minimal 1 foto produk");
      return;
    }

    const parsedHargaJual = parseInt(hargaJual, 10);
    if (isNaN(parsedHargaJual) || parsedHargaJual <= 0) {
      setFormError("Harga jual harus lebih dari 0");
      return;
    }

    const parsedStok = parseInt(stok, 10);
    if (isNaN(parsedStok) || parsedStok < 0) {
      setFormError("Stok harus 0 atau lebih");
      return;
    }

    const parsedHargaBeli = hargaBeli ? parseInt(hargaBeli, 10) : 0;
    const parsedHargaMinNego = hargaMinNego ? parseInt(hargaMinNego, 10) : undefined;
    const parsedBaterai =
      kondisi === "Baru" || !baterai.trim() ? null : parseInt(baterai, 10);

    setIsSaving(true);

    try {
      saveProduct({
        brand,
        tipe: tipe.trim(),
        storage: storage.trim(),
        kondisi,
        baterai: parsedBaterai,
        kelengkapan,
        garansi: garansi.trim(),
        hargaBeli: parsedHargaBeli,
        hargaJual: parsedHargaJual,
        hargaMinNego: parsedHargaMinNego,
        stok: parsedStok,
        deskripsi: deskripsi.trim() || `Unit ${brand} ${tipe} kondisi ${kondisi} siap pakai.`,
        foto: photos,
      });

      showToast("Produk berhasil ditambahkan ke katalog!", "success");
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as Error;
      if (
        error.name === "QuotaExceededError" ||
        error.message?.includes("quota")
      ) {
        showToast(
          "Penyimpanan browser (localStorage) penuh! Silakan kurangi foto atau bersihkan data lama.",
          "error"
        );
      } else {
        showToast(error.message || "Gagal menyimpan produk", "error");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Produk</span>
        </Link>
        <span className="text-xs font-semibold text-stone-400">
          Formulir Inventaris Baru
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
        <div className="pb-5 border-b border-stone-100">
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Tambah Smartphone Baru
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Isi data unit handphone bekas atau baru secara lengkap untuk katalog toko.
          </p>
        </div>

        {formError && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* 1. FOTO PRODUK (Max 5, Canvas Compressed) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Foto Produk (Maks 5 foto) <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-stone-400">
                {photos.length}/5 foto terunggah • Foto ke-1 jadi Foto Utama
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {photos.map((src, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl bg-stone-100 overflow-hidden border-2 border-stone-200 group"
                >
                  <Image
                    src={src}
                    alt={`Preview ${idx + 1}`}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                  {idx === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#0A0A0A]/90 text-white text-[10px] font-bold">
                      Utama
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-rose-600 text-white shadow-xs hover:bg-rose-700 transition-colors"
                    title="Hapus foto ini"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {photos.length < 5 && (
                <label className="relative aspect-square rounded-xl border-2 border-dashed border-stone-300 hover:border-[#F59E0B] bg-stone-50 hover:bg-amber-50/20 flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-colors">
                  <Upload className="w-6 h-6 text-stone-400 group-hover:text-[#F59E0B] mb-1" />
                  <span className="text-[11px] font-bold text-stone-700 block">
                    Upload Foto
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    Kompres Otomatis
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={isCompressing}
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            {isCompressing && (
              <p className="text-xs text-[#D97706] mt-2 animate-pulse">
                Sedang mengompres gambar...
              </p>
            )}
          </div>

          {/* 2. SPESIFIKASI UTAMA */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Merk Handphone
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value as Brand)}
                className="w-full h-11 px-3.5 rounded-xl border border-stone-300 text-sm font-semibold focus:ring-2 focus:ring-[#F59E0B] bg-white"
              >
                {BRAND_LIST.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Model / Tipe HP <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={tipe}
                onChange={(e) => setTipe(e.target.value)}
                placeholder="Contoh: iPhone 13 / Galaxy S22"
                className="w-full h-11 px-3.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#F59E0B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Kapasitas Memori (Storage)
              </label>
              <input
                type="text"
                required
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                placeholder="Contoh: 128GB / 256GB"
                className="w-full h-11 px-3.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#F59E0B]"
              />
            </div>
          </div>

          {/* 3. KONDISI & BATERAI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Kondisi Unit
              </label>
              <select
                value={kondisi}
                onChange={(e) => {
                  const val = e.target.value as ProductCondition;
                  setKondisi(val);
                  if (val === "Baru") {
                    setGaransi("Garansi Resmi 1 tahun");
                  } else {
                    setGaransi("Garansi toko 1 bulan");
                  }
                }}
                className="w-full h-11 px-3.5 rounded-xl border border-stone-300 text-sm font-semibold focus:ring-2 focus:ring-[#F59E0B] bg-white"
              >
                {CONDITION_LIST.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Kesehatan Baterai (BH %) - Khusus Bekas
              </label>
              <input
                type="number"
                min={0}
                max={100}
                disabled={kondisi === "Baru"}
                value={kondisi === "Baru" ? "" : baterai}
                onChange={(e) => setBaterai(e.target.value)}
                placeholder={kondisi === "Baru" ? "Otomatis Null (Baru)" : "Contoh: 89"}
                className="w-full h-11 px-3.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#F59E0B] disabled:bg-stone-100 disabled:text-stone-400"
              />
            </div>
          </div>

          {/* 4. KELENGKAPAN & GARANSI */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Kelengkapan Yang Disertakan
            </label>
            <div className="flex flex-wrap gap-2">
              {ACCESSORY_OPTIONS.map((acc) => {
                const checked = kelengkapan.includes(acc);
                return (
                  <button
                    key={acc}
                    type="button"
                    onClick={() => toggleAccessory(acc)}
                    className={`h-9 px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                      checked
                        ? "bg-[#0A0A0A] text-white border-stone-900"
                        : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                        checked ? "bg-[#F59E0B] text-stone-950 font-bold" : "border border-stone-300"
                      }`}
                    >
                      {checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                    <span>{acc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Keterangan Garansi
            </label>
            <input
              type="text"
              value={garansi}
              onChange={(e) => setGaransi(e.target.value)}
              placeholder="Contoh: Garansi toko 1 bulan / Garansi Resmi 1 tahun"
              className="w-full h-11 px-3.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#F59E0B]"
            />
          </div>

          {/* 5. HARGA & STOK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Harga Modal (Beli Rp)
              </label>
              <input
                type="number"
                min={0}
                value={hargaBeli}
                onChange={(e) => setHargaBeli(e.target.value)}
                placeholder="Contoh: 7500000"
                className="w-full h-11 px-3.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#F59E0B]"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                *Hanya admin yang dapat melihat modal ini.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Harga Pajang / Jual (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={1}
                value={hargaJual}
                onChange={(e) => setHargaJual(e.target.value)}
                placeholder="Contoh: 8900000"
                className="w-full h-11 px-3.5 rounded-xl border border-stone-300 text-sm font-bold text-stone-950 focus:ring-2 focus:ring-[#F59E0B]"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                *Harga resmi yang tampil di web katalog.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-800 uppercase tracking-wider mb-1.5">
                Batas Minimal Nego (Net Rp)
              </label>
              <input
                type="number"
                min={0}
                value={hargaMinNego}
                onChange={(e) => setHargaMinNego(e.target.value)}
                placeholder="Contoh: 8600000"
                className="w-full h-11 px-3.5 rounded-xl border border-amber-300 bg-amber-50/30 text-sm font-bold text-stone-950 focus:ring-2 focus:ring-[#F59E0B]"
              />
              <span className="text-[10px] text-amber-700 font-medium mt-1 block">
                *Batas tawar terendah untuk panduan kasir/operator.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Jumlah Stok Unit <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                value={stok}
                onChange={(e) => setStok(e.target.value)}
                placeholder="Contoh: 2"
                className="w-full h-11 px-3.5 rounded-xl border border-stone-300 text-sm font-bold focus:ring-2 focus:ring-[#F59E0B]"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                *Stok berkurang otomatis saat terjual.
              </span>
            </div>
          </div>

          {/* 6. DESKRIPSI */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Deskripsi Detail Unit
            </label>
            <textarea
              rows={3}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Tuliskan catatan fisik, kelengkapan, fungsi, minus lecet jika ada..."
              className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#F59E0B] resize-none"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <Link
              href="/dashboard"
              className="h-11 px-5 rounded-xl border border-stone-300 text-stone-700 text-xs sm:text-sm font-semibold hover:bg-stone-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isSaving || isCompressing}
              className="h-11 px-6 rounded-xl bg-[#0A0A0A] hover:bg-[#F59E0B] hover:text-stone-950 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Menyimpan Data..." : "Simpan Produk"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
