"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { findServiceTickets, ServiceTicket } from "@/lib/db";
import { STORE_CONFIG } from "@/lib/config";
import { formatDate, maskName, maskPhone, getWhatsAppUrl } from "@/lib/formatters";
import {
  Wrench,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Calendar,
  MessageCircle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

export default function CheckServicePage() {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [tickets, setTickets] = useState<ServiceTicket[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    // Slight simulated feel for polished UX
    setTimeout(() => {
      const results = findServiceTickets(query);
      setTickets(results);
      setHasSearched(true);
      setIsSearching(false);
    }, 200);
  };

  const getStepIndex = (status: ServiceTicket["status"]) => {
    switch (status) {
      case "Antri":
        return 0;
      case "Dikerjakan":
        return 1;
      case "Sudah Jadi":
        return 2;
      default:
        return 0;
    }
  };

  const STEPS: { title: string; subtitle: string }[] = [
    { title: "Antri", subtitle: "Menunggu giliran teknisi" },
    { title: "Dikerjakan", subtitle: "Dalam tahap perbaikan" },
    { title: "Sudah Jadi", subtitle: "Selesai & siap diambil" },
  ];

  const waAskUrl = getWhatsAppUrl(
    STORE_CONFIG.phoneRaw,
    `Halo Admin ${STORE_CONFIG.name}, saya ingin menanyakan progres tiket servis saya yang belum ketemu di sistem.`
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F4]">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Header / Intro Card */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#0A0A0A] text-[#F59E0B] flex items-center justify-center mx-auto mb-4 shadow-md">
            <Wrench className="w-8 h-8 stroke-[2]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Cek Status Servis HP
          </h1>
          <p className="text-sm text-stone-500 mt-2">
            Pantau progres pengerjaan handphone Anda secara real-time. Masukkan nomor
            nota servis atau nomor WhatsApp Anda.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                Nomor Nota ATAU Nomor WhatsApp
              </label>
              <div className="relative">
                <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Contoh: SRV-0001 atau 081234567891"
                  className="w-full h-13 pl-12 pr-4 rounded-xl border-2 border-stone-200 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
                />
              </div>
              <p className="text-[11px] text-stone-400 mt-1.5 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>
                  Format nomor WA otomatis disesuaikan (08xx, +62xx, atau 62xx).
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={!query.trim() || isSearching}
                className="h-12 w-full rounded-xl bg-[#0A0A0A] hover:bg-stone-800 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
              >
                <Search className="w-4 h-4 text-[#F59E0B]" />
                <span>{isSearching ? "Mencari data..." : "Periksa Status Sekarang"}</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Hint */}
          <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs text-stone-500 gap-2">
            <span>Coba data demo nota:</span>
            <div className="flex gap-2">
              {["SRV-0001", "SRV-0002", "SRV-0003"].map((demoNota) => (
                <button
                  key={demoNota}
                  onClick={() => {
                    setQuery(demoNota);
                    const results = findServiceTickets(demoNota);
                    setTickets(results);
                    setHasSearched(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 hover:text-amber-900 font-mono text-[11px] transition-colors"
                >
                  {demoNota}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                Hasil Pencarian ({tickets.length} tiket ditemukan)
              </h2>
            </div>

            {tickets.length === 0 ? (
              /* State Kosong */
              <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-10 text-center shadow-xs">
                <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-lg text-stone-900">
                  Tiket Servis Tidak Ditemukan
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 mt-1 mb-6 max-w-md mx-auto leading-relaxed">
                  Tidak ada data pengerjaan servis dengan nota atau nomor telepon tersebut.
                  Mohon periksa kembali nomor nota pada tanda terima Anda.
                </p>
                <a
                  href={waAskUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Tanya Langsung ke Teknisi (WhatsApp)</span>
                </a>
              </div>
            ) : (
              /* List Tiket */
              tickets.map((ticket) => {
                const currentStep = getStepIndex(ticket.status);

                return (
                  <div
                    key={ticket.id}
                    className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6"
                  >
                    {/* Ticket Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-stone-100">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="px-3 py-1 rounded-lg bg-stone-900 text-amber-400 font-mono font-bold text-sm">
                            {ticket.nota}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              ticket.status === "Sudah Jadi"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : ticket.status === "Dikerjakan"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-stone-100 text-stone-600 border border-stone-200"
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-stone-900 mt-2 flex items-center gap-2">
                          <Smartphone className="w-5 h-5 text-stone-400" />
                          <span>{ticket.tipeHp}</span>
                        </h3>
                      </div>

                      <div className="text-left sm:text-right text-xs text-stone-500 space-y-1">
                        <div>
                          Pelanggan:{" "}
                          <strong className="text-stone-800">
                            {maskName(ticket.namaPelanggan)}
                          </strong>{" "}
                          ({maskPhone(ticket.noWa)})
                        </div>
                        <div className="flex items-center sm:justify-end gap-1 text-stone-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Masuk: {formatDate(ticket.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Problem Description */}
                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm">
                      <span className="font-semibold text-stone-700 block mb-1">
                        Keluhan & Kerusakan:
                      </span>
                      <p className="text-stone-600 leading-relaxed">
                        {ticket.kerusakan}
                      </p>
                    </div>

                    {/* 3-Step Horizontal Stepper */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4">
                        Status Pengerjaan
                      </h4>

                      <div className="relative grid grid-cols-3 gap-2">
                        {STEPS.map((step, idx) => {
                          const isFinished = currentStep > idx;
                          const isCurrent = currentStep === idx;
                          const isUpcoming = currentStep < idx;

                          let circleStyle = "bg-stone-200 text-stone-500";
                          let textStyle = "text-stone-400";

                          if (isFinished) {
                            circleStyle = "bg-[#16A34A] text-white";
                            textStyle = "text-stone-800 font-semibold";
                          } else if (isCurrent) {
                            circleStyle =
                              step.title === "Sudah Jadi"
                                ? "bg-[#16A34A] text-white ring-4 ring-emerald-100 animate-pulse"
                                : "bg-[#F59E0B] text-stone-950 ring-4 ring-amber-100 animate-pulse";
                            textStyle = "text-stone-900 font-bold";
                          }

                          return (
                            <div
                              key={step.title}
                              className="flex flex-col items-center text-center relative z-10"
                            >
                              {/* Circle with step number or check */}
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${circleStyle}`}
                              >
                                {isFinished ? (
                                  <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                  idx + 1
                                )}
                              </div>

                              <span className={`mt-2.5 text-xs sm:text-sm ${textStyle}`}>
                                {step.title}
                              </span>
                              <span className="hidden sm:block text-[11px] text-stone-400 mt-0.5">
                                {step.subtitle}
                              </span>
                            </div>
                          );
                        })}

                        {/* Connecting Line behind steps */}
                        <div className="absolute top-5 left-1/6 right-1/6 h-[3px] bg-stone-200 -z-0">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-500"
                            style={{
                              width:
                                currentStep === 0
                                  ? "0%"
                                  : currentStep === 1
                                  ? "50%"
                                  : "100%",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer Info of ticket */}
                    <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-stone-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-stone-400" />
                        <span>Update Terakhir: {formatDate(ticket.updatedAt)}</span>
                      </div>

                      {ticket.status === "Sudah Jadi" ? (
                        <div className="p-2 px-3 rounded-lg bg-emerald-50 text-emerald-800 font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Unit sudah siap diambil di toko!</span>
                        </div>
                      ) : (
                        <a
                          href={getWhatsAppUrl(
                            STORE_CONFIG.phoneRaw,
                            `Halo Admin, mau konfirmasi tiket servis nota ${ticket.nota} atas nama ${ticket.namaPelanggan}.`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#D97706] hover:underline font-semibold flex items-center gap-1"
                        >
                          <span>Hubungi teknisi tentang nota ini</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>

      <FloatingWhatsApp />
      <Footer />
    </div>
  );
}
