"use client";

import React, { useState } from "react";
import { Product } from "@/lib/db";
import { STORE_CONFIG } from "@/lib/config";
import { formatRupiah, getWhatsAppUrl } from "@/lib/formatters";
import { X, RefreshCw, Send, AlertCircle } from "lucide-react";

interface TradeInModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TradeInModal({
  product,
  isOpen,
  onClose,
}: TradeInModalProps) {
  const [oldPhoneModel, setOldPhoneModel] = useState("");
  const [oldPhoneCondition, setOldPhoneCondition] = useState("Bekas Mulus (No Minus)");
  const [oldPhoneCompleteness, setOldPhoneCompleteness] = useState("Fullset Box & Charger");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !product) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPhoneModel.trim()) {
      setError("Mohon isi merk & tipe HP lama Anda");
      return;
    }
    setError("");

    const message = [
      `Halo Admin ${STORE_CONFIG.name}, saya berminat konsultasi TUKAR TAMBAH (Trade-In):`,
      ``,
      `📱 HP INCORAN (Di Toko):`,
      `• Unit: ${product.brand} ${product.tipe} ${product.storage}`,
      `• Kondisi: ${product.kondisi}`,
      `• Harga: ${formatRupiah(product.hargaJual)}`,
      ``,
      `🔄 HP LAMA SAYA:`,
      `• Merk & Tipe: ${oldPhoneModel.trim()}`,
      `• Kondisi: ${oldPhoneCondition}`,
      `• Kelengkapan: ${oldPhoneCompleteness}`,
      notes.trim() ? `• Catatan Tambahan: ${notes.trim()}` : null,
      ``,
      `Kira-kira estimasi nambah berapa ya min? Terima kasih!`,
    ]
      .filter(Boolean)
      .join("\n");

    const waUrl = getWhatsAppUrl(STORE_CONFIG.phoneRaw, message);
    window.open(waUrl, "_blank");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-[#0A0A0A] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#F59E0B] text-stone-950">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Form Tukar Tambah</h3>
              <p className="text-xs text-stone-400">
                Hitung estimasi tukar HP lama Anda ke unit idaman
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Tutup form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Target Phone Summary Box */}
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-stone-500 block">
                HP Incaran Anda:
              </span>
              <span className="text-sm font-bold text-stone-900">
                {product.brand} {product.tipe} {product.storage}
              </span>
              <span className="text-xs text-stone-500 block">
                Kondisi: {product.kondisi}
              </span>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-[#F59E0B]">
                {formatRupiah(product.hargaJual)}
              </span>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Merk & Tipe HP Lama Anda <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={oldPhoneModel}
              onChange={(e) => setOldPhoneModel(e.target.value)}
              placeholder="Contoh: iPhone 11 64GB / Samsung A52"
              className="w-full h-11 px-3.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Kondisi HP Lama
              </label>
              <select
                value={oldPhoneCondition}
                onChange={(e) => setOldPhoneCondition(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B] bg-white transition-all"
              >
                <option value="Bekas Mulus (No Minus)">Bekas Mulus (No Minus)</option>
                <option value="Bekas Normal (Lecet Halus)">Bekas Normal (Lecet Halus)</option>
                <option value="Bekas Minus (Layar/Baterai)">Bekas Minus (Layar/Baterai)</option>
                <option value="Rusak / Mati Total">Rusak / Mati Total</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Kelengkapan Unit
              </label>
              <select
                value={oldPhoneCompleteness}
                onChange={(e) => setOldPhoneCompleteness(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B] bg-white transition-all"
              >
                <option value="Fullset Box & Charger Ori">Fullset Lengkap Ori</option>
                <option value="Unit HP + Charger Saja">Unit HP + Charger</option>
                <option value="Batangan (Hanya Unit HP)">Batangan (Hanya Unit)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Catatan / Baterai Health / Riwayat Servis (Opsional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: BH 84%, belum pernah bongkar, layar aman no shadow..."
              className="w-full p-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B] transition-all resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-4 rounded-xl border border-stone-300 text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="h-11 px-5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Kirim via WhatsApp</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
