"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  getServiceTickets,
  createServiceTicket,
  updateServiceTicketStatus,
  ServiceTicket,
  ServiceStatus,
} from "@/lib/db";
import { formatDate, getWhatsAppUrl } from "@/lib/formatters";
import { STORE_CONFIG } from "@/lib/config";
import { useToast } from "@/components/Toast";
import {
  Wrench,
  PlusCircle,
  Search,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar,
  User,
  Phone,
  Smartphone,
  MessageCircle,
  RotateCw,
} from "lucide-react";

export default function DashboardServicesPage() {
  const { showToast } = useToast();

  const [tickets, setTickets] = useState<ServiceTicket[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [noWa, setNoWa] = useState("");
  const [tipeHp, setTipeHp] = useState("");
  const [kerusakan, setKerusakan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter States
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | "Semua">("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const loadTickets = () => {
    const data = getServiceTickets();
    setTickets(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  // Handle Form Submit
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();

    if (!namaPelanggan.trim() || !noWa.trim() || !tipeHp.trim() || !kerusakan.trim()) {
      showToast("Semua data servis wajib diisi", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const newTicket = createServiceTicket({
        namaPelanggan: namaPelanggan.trim(),
        noWa: noWa.trim(),
        tipeHp: tipeHp.trim(),
        kerusakan: kerusakan.trim(),
        status: "Antri",
      });

      showToast(`Tiket servis baru (${newTicket.nota}) berhasil dibuat!`, "success");

      // Reset form
      setNamaPelanggan("");
      setNoWa("");
      setTipeHp("");
      setKerusakan("");
      loadTickets();
    } catch {
      showToast("Gagal membuat tiket servis", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Next status cycle: Antri -> Dikerjakan -> Sudah Jadi
  const handleAdvanceStatus = (ticket: ServiceTicket) => {
    let nextStatus: ServiceStatus = "Dikerjakan";
    if (ticket.status === "Antri") {
      nextStatus = "Dikerjakan";
    } else if (ticket.status === "Dikerjakan") {
      nextStatus = "Sudah Jadi";
    } else {
      showToast("Tiket ini sudah dalam status 'Sudah Jadi'.", "info");
      return;
    }

    const updated = updateServiceTicketStatus(ticket.id, nextStatus);
    if (updated) {
      showToast(`Status ${ticket.nota} diubah menjadi "${nextStatus}"`, "success");
      loadTickets();
    } else {
      showToast("Gagal memperbarui status servis", "error");
    }
  };

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      if (statusFilter !== "Semua" && t.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          t.nota.toLowerCase().includes(q) ||
          t.namaPelanggan.toLowerCase().includes(q) ||
          t.noWa.includes(q) ||
          t.tipeHp.toLowerCase().includes(q) ||
          t.kerusakan.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [tickets, statusFilter, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
          Penerimaan & Manajemen Servis HP
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Catat unit servis masuk, nomor nota dibuat otomatis, dan perbarui progres perbaikan.
        </p>
      </div>

      {/* 1. FORM INPUT SERVIS MASUK */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-stone-100">
          <div className="p-2 rounded-xl bg-amber-50 text-[#F59E0B]">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              Formulir Pendaftaran Servis Baru
            </h2>
            <span className="text-xs text-stone-400">
              Nota increment otomatis (contoh: SRV-0006)
            </span>
          </div>
        </div>

        <form onSubmit={handleCreateTicket} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Nama Pelanggan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={namaPelanggan}
                onChange={(e) => setNamaPelanggan(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="w-full h-11 px-3.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#F59E0B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                No. WhatsApp Pelanggan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={noWa}
                onChange={(e) => setNoWa(e.target.value)}
                placeholder="081234567890"
                className="w-full h-11 px-3.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#F59E0B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Merk & Tipe HP <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={tipeHp}
                onChange={(e) => setTipeHp(e.target.value)}
                placeholder="Contoh: iPhone 11 / Galaxy A52"
                className="w-full h-11 px-3.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#F59E0B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Deskripsi Kerusakan / Keluhan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={kerusakan}
              onChange={(e) => setKerusakan(e.target.value)}
              placeholder="Contoh: Ganti LCD pecah, baterai kembung drop cepat, tidak bisa ngecas..."
              className="w-full h-11 px-3.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#F59E0B]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-6 rounded-xl bg-[#0A0A0A] hover:bg-[#F59E0B] hover:text-stone-950 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isSubmitting ? "Menyimpan..." : "Buat Tiket Servis"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. TABEL DAFTAR TIKET SERVIS */}
      <div className="space-y-4">
        {/* Filter bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nota, nama, nomor WA, tipe HP..."
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#F59E0B]"
            />
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {(["Semua", "Antri", "Dikerjakan", "Sudah Jadi"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? "bg-[#0A0A0A] text-white shadow-xs"
                    : "bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Tabel Desktop */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-4">Nota & Tanggal</th>
                  <th className="py-3.5 px-3">Pelanggan</th>
                  <th className="py-3.5 px-3">Tipe HP & Kerusakan</th>
                  <th className="py-3.5 px-3">Status Saat Ini</th>
                  <th className="py-3.5 px-4 text-right">Update Status / Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-stone-400">
                      Tidak ada tiket servis yang sesuai.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((t) => {
                    const waNotifyUrl = getWhatsAppUrl(
                      t.noWa,
                      `Halo Kak ${t.namaPelanggan}, kami dari ${STORE_CONFIG.name}. Menginfokan status perbaikan HP ${t.tipeHp} (Nota: ${t.nota}) saat ini: "${t.status}".`
                    );

                    return (
                      <tr key={t.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md block w-max">
                            {t.nota}
                          </span>
                          <span className="text-[11px] text-stone-400 block mt-1">
                            {formatDate(t.createdAt)}
                          </span>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-bold text-stone-900 block">
                            {t.namaPelanggan}
                          </span>
                          <a
                            href={`https://wa.me/${t.noWa}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-emerald-600 hover:underline inline-flex items-center gap-1 mt-0.5"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{t.noWa}</span>
                          </a>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-bold text-stone-800 block">
                            {t.tipeHp}
                          </span>
                          <span className="text-stone-500 text-[11px] line-clamp-2 mt-0.5">
                            {t.kerusakan}
                          </span>
                        </td>

                        <td className="py-3.5 px-3">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              t.status === "Sudah Jadi"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : t.status === "Dikerjakan"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-stone-100 text-stone-600 border border-stone-200"
                            }`}
                          >
                            {t.status}
                          </span>
                          <span className="text-[10px] text-stone-400 block mt-1">
                            Update: {formatDate(t.updatedAt)}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {t.status !== "Sudah Jadi" ? (
                              <button
                                onClick={() => handleAdvanceStatus(t)}
                                className="h-8 px-3 rounded-lg bg-[#0A0A0A] hover:bg-[#F59E0B] hover:text-stone-950 text-white font-semibold text-[11px] flex items-center gap-1.5 transition-colors shadow-2xs"
                              >
                                <RotateCw className="w-3.5 h-3.5" />
                                <span>
                                  {t.status === "Antri"
                                    ? "Kerjakan"
                                    : "Selesaikan (Jadi)"}
                                </span>
                              </button>
                            ) : (
                              <span className="text-emerald-600 font-semibold text-xs flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Selesai</span>
                              </span>
                            )}

                            <a
                              href={waNotifyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Kabari Pelanggan via WhatsApp"
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 border border-emerald-200"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Cards List Mobile */}
          <div className="md:hidden divide-y divide-stone-100">
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-400">
                Tidak ada tiket servis.
              </div>
            ) : (
              filteredTickets.map((t) => (
                <div key={t.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2.5 py-0.5 rounded-md text-xs">
                      {t.nota}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        t.status === "Sudah Jadi"
                          ? "bg-emerald-50 text-emerald-700"
                          : t.status === "Dikerjakan"
                          ? "bg-amber-50 text-amber-700"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{t.tipeHp}</h4>
                    <p className="text-xs text-stone-500 mt-0.5">{t.kerusakan}</p>
                  </div>

                  <div className="text-xs text-stone-600 flex items-center justify-between pt-1">
                    <span>
                      Pelanggan: <strong>{t.namaPelanggan}</strong> ({t.noWa})
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <span className="text-[10px] text-stone-400">
                      Update: {formatDate(t.updatedAt)}
                    </span>

                    <div className="flex items-center gap-2">
                      {t.status !== "Sudah Jadi" && (
                        <button
                          onClick={() => handleAdvanceStatus(t)}
                          className="h-8 px-3 rounded-lg bg-[#0A0A0A] text-white text-xs font-semibold flex items-center gap-1.5"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>
                            {t.status === "Antri" ? "Kerjakan" : "Selesaikan"}
                          </span>
                        </button>
                      )}
                      <a
                        href={getWhatsAppUrl(
                          t.noWa,
                          `Halo Kak ${t.namaPelanggan}, status servis HP ${t.tipeHp} (Nota: ${t.nota}) di Ponorogo Phone saat ini: ${t.status}.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-emerald-600 bg-emerald-50"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
