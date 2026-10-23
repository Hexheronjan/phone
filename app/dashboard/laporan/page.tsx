"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  getSales,
  getProducts,
  resetDemoData,
  Sale,
  Product,
} from "@/lib/db";
import { STORE_CONFIG } from "@/lib/config";
import { formatRupiah, formatDate, formatDateShort } from "@/lib/formatters";
import { useToast } from "@/components/Toast";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  ShoppingBag,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Filter,
} from "lucide-react";

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
    color: string;
  }[];
  label?: string;
}

function ChartCustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-stone-900 text-white p-3 rounded-xl shadow-xl border border-stone-700 text-xs space-y-1.5">
        <p className="font-bold text-stone-200 border-b border-stone-700 pb-1">
          Periode: {label}
        </p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-stone-300">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}:
            </span>
            <span className="font-mono font-bold text-white">
              {formatRupiah(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

type PeriodType = "7hari" | "bulan" | "tahun" | "semua";

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export default function FinancialReportPage() {
  const { showToast } = useToast();

  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Period Filters
  const [periodType, setPeriodType] = useState<PeriodType>("7hari");
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth()); // 0-11
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const loadData = () => {
    const productData = getProducts("admin");
    const salesData = getSales();
    setProducts(productData);
    setSales(salesData);
  };

  useEffect(() => {
    loadData();
    setIsMounted(true);
  }, []);

  const handleResetData = () => {
    resetDemoData();
    showToast("Data demo toko berhasil direset ke kondisi awal!", "success");
    loadData();
    setShowResetDialog(false);
  };

  // Filter sales based on active period
  const filteredSales = useMemo(() => {
    const now = new Date();
    const dayMs = 24 * 60 * 60 * 1000;

    return sales.filter((s) => {
      const saleDate = new Date(s.soldAt);

      if (periodType === "7hari") {
        const diffTime = now.getTime() - saleDate.getTime();
        return diffTime <= 7 * dayMs && diffTime >= 0;
      }

      if (periodType === "bulan") {
        return (
          saleDate.getMonth() === selectedMonth &&
          saleDate.getFullYear() === selectedYear
        );
      }

      if (periodType === "tahun") {
        return saleDate.getFullYear() === selectedYear;
      }

      return true; // "semua"
    });
  }, [sales, periodType, selectedMonth, selectedYear]);

  // Summary Metrics for the Selected Period
  const periodStats = useMemo(() => {
    let omzet = 0;
    let untung = 0;
    let unit = filteredSales.length;

    filteredSales.forEach((s) => {
      omzet += s.hargaTerjual;
      untung += s.hargaTerjual - s.hargaBeli;
    });

    return { omzet, untung, unit };
  }, [filteredSales]);

  // Reference today & this month stats
  const todayAndMonthStats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const thisMonthStr = now.toISOString().slice(0, 7);

    let omzetHariIni = 0;
    let untungHariIni = 0;
    let unitHariIni = 0;

    sales.forEach((s) => {
      if (s.soldAt.slice(0, 10) === todayStr) {
        omzetHariIni += s.hargaTerjual;
        untungHariIni += s.hargaTerjual - s.hargaBeli;
        unitHariIni += 1;
      }
    });

    return { omzetHariIni, untungHariIni, unitHariIni };
  }, [sales]);

  // Dynamic Chart Data based on selected period
  const chartData = useMemo(() => {
    if (periodType === "7hari") {
      const data = [];
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateKey = d.toISOString().slice(0, 10);
        const label = formatDateShort(d.toISOString());

        let omzet = 0;
        let untung = 0;

        sales.forEach((s) => {
          if (s.soldAt.slice(0, 10) === dateKey) {
            omzet += s.hargaTerjual;
            untung += s.hargaTerjual - s.hargaBeli;
          }
        });

        data.push({ date: label, omzet, untung });
      }
      return data;
    }

    if (periodType === "bulan") {
      // Group by days in that selected month
      const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      const data = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const dayStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        let omzet = 0;
        let untung = 0;

        sales.forEach((s) => {
          if (s.soldAt.slice(0, 10) === dayStr) {
            omzet += s.hargaTerjual;
            untung += s.hargaTerjual - s.hargaBeli;
          }
        });

        data.push({
          date: `Tgl ${day}`,
          omzet,
          untung,
        });
      }
      return data;
    }

    if (periodType === "tahun") {
      // Group by 12 months in the selected year
      const data = [];
      for (let m = 0; m < 12; m++) {
        const monthKey = `${selectedYear}-${String(m + 1).padStart(2, "0")}`;
        let omzet = 0;
        let untung = 0;

        sales.forEach((s) => {
          if (s.soldAt.slice(0, 7) === monthKey) {
            omzet += s.hargaTerjual;
            untung += s.hargaTerjual - s.hargaBeli;
          }
        });

        data.push({
          date: MONTH_NAMES[m].slice(0, 3),
          omzet,
          untung,
        });
      }
      return data;
    }

    // "semua"
    const data = [];
    const nowYear = new Date().getFullYear();
    for (let m = 0; m < 12; m++) {
      const monthKey = `${nowYear}-${String(m + 1).padStart(2, "0")}`;
      let omzet = 0;
      let untung = 0;

      sales.forEach((s) => {
        if (s.soldAt.slice(0, 7) === monthKey) {
          omzet += s.hargaTerjual;
          untung += s.hargaTerjual - s.hargaBeli;
        }
      });

      data.push({
        date: MONTH_NAMES[m].slice(0, 3),
        omzet,
        untung,
      });
    }
    return data;
  }, [sales, periodType, selectedMonth, selectedYear]);

  // Low stock products (stok <= 2)
  const lowStockProducts = useMemo(() => {
    return products.filter((p) => p.stok <= STORE_CONFIG.lowStockThreshold);
  }, [products]);

  // Sorted recent sales for table
  const displaySales = useMemo(() => {
    return [...filteredSales].sort(
      (a, b) => new Date(b.soldAt).getTime() - new Date(a.soldAt).getTime()
    );
  }, [filteredSales]);

  const periodLabelText = useMemo(() => {
    if (periodType === "7hari") return "7 Hari Terakhir";
    if (periodType === "bulan") return `Bulan ${MONTH_NAMES[selectedMonth]} ${selectedYear}`;
    if (periodType === "tahun") return `Tahun ${selectedYear}`;
    return "Seluruh Waktu";
  }, [periodType, selectedMonth, selectedYear]);

  return (
    <AuthGuard requiredRole="admin">
      <div className="space-y-8">
        {/* Top Header & Reset Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-2 border border-amber-200">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Khusus Hak Akses Administrator</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Laporan Keuangan & Penjualan
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Filter periode harian, bulanan, atau tahunan untuk memantau omzet, laba bersih, dan arus kas toko.
            </p>
          </div>

          <button
            onClick={() => setShowResetDialog(true)}
            className="h-11 px-4 rounded-xl border border-stone-300 hover:border-rose-400 bg-white hover:bg-rose-50 text-stone-700 hover:text-rose-700 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-2xs transition-all active:scale-95 shrink-0"
          >
            <RotateCcw className="w-4 h-4 text-rose-500" />
            <span>Reset Data Demo</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* BAR KONTROL FILTER PERIODE (7 Hari / Per Bulan / Per Tahun) */}
        {/* ========================================================= */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-stone-400 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-stone-700 whitespace-nowrap">
              Pilih Periode:
            </span>

            {/* Quick Period Tabs */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto scrollbar-none">
              <button
                onClick={() => setPeriodType("7hari")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  periodType === "7hari"
                    ? "bg-[#0A0A0A] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-950"
                }`}
              >
                7 Hari Terakhir
              </button>

              <button
                onClick={() => setPeriodType("bulan")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  periodType === "bulan"
                    ? "bg-[#0A0A0A] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-950"
                }`}
              >
                Per Bulan
              </button>

              <button
                onClick={() => setPeriodType("tahun")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  periodType === "tahun"
                    ? "bg-[#0A0A0A] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-950"
                }`}
              >
                Per Tahun
              </button>

              <button
                onClick={() => setPeriodType("semua")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  periodType === "semua"
                    ? "bg-[#0A0A0A] text-white shadow-xs"
                    : "text-stone-600 hover:text-stone-950"
                }`}
              >
                Semua
              </button>
            </div>
          </div>

          {/* Conditional Dropdowns for Month / Year */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            {periodType === "bulan" && (
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                className="h-9 px-3 rounded-xl border border-stone-300 text-xs font-semibold bg-white text-stone-800 focus:ring-2 focus:ring-[#F59E0B]"
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={idx} value={idx}>
                    {name}
                  </option>
                ))}
              </select>
            )}

            {(periodType === "bulan" || periodType === "tahun") && (
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                className="h-9 px-3 rounded-xl border border-stone-300 text-xs font-semibold bg-white text-stone-800 focus:ring-2 focus:ring-[#F59E0B]"
              >
                {[2024, 2025, 2026, 2027].map((yr) => (
                  <option key={yr} value={yr}>
                    Tahun {yr}
                  </option>
                ))}
              </select>
            )}

            <span className="text-xs text-stone-500 font-medium">
              Menampilkan data: <strong className="text-stone-900">{periodLabelText}</strong>
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* KARTU RINGKASAN SESUAI PERIODE TERPILIH                    */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Omzet */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-semibold text-stone-500 block">
                Total Omzet ({periodLabelText})
              </span>
              <div className="text-2xl font-extrabold text-stone-950 mt-1">
                {formatRupiah(periodStats.omzet)}
              </div>
              <span className="text-[11px] text-stone-400 mt-1 block">
                Hari ini: {formatRupiah(todayAndMonthStats.omzetHariIni)}
              </span>
            </div>
          </div>

          {/* Untung Bersih */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-semibold text-stone-500 block">
                Untung Bersih ({periodLabelText})
              </span>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                {formatRupiah(periodStats.untung)}
              </div>
              <span className="text-[11px] text-emerald-700/80 font-medium mt-1 block">
                Hari ini: {formatRupiah(todayAndMonthStats.untungHariIni)}
              </span>
            </div>
          </div>

          {/* Unit Terjual */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-semibold text-stone-500 block">
                Unit Terjual ({periodLabelText})
              </span>
              <div className="text-2xl font-extrabold text-stone-950 mt-1">
                {periodStats.unit} unit
              </div>
              <span className="text-[11px] text-stone-400 mt-1 block">
                Hari ini: {todayAndMonthStats.unitHariIni} unit
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* GRAFIK DINAMIS (RECHARTS)                                 */}
        {/* ========================================================= */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                Grafik Tren Omzet & Laba Bersih ({periodLabelText})
              </h3>
              <p className="text-xs text-stone-400">
                Bar Amber mewakili Omzet Penjualan Kotor, Garis Hijau mewakili Laba Bersih
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-stone-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#F59E0B]" />
                Omzet
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-1 rounded-sm bg-[#16A34A]" />
                Laba Bersih
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            {isMounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#78716C" }}
                    axisLine={{ stroke: "#E7E5E4" }}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#78716C" }}
                    axisLine={{ stroke: "#E7E5E4" }}
                    tickFormatter={(val) =>
                      val >= 1000000
                        ? `${(val / 1000000).toFixed(1)}Jt`
                        : `${val / 1000}rb`
                    }
                  />
                  <Tooltip content={<ChartCustomTooltip />} />
                  <Bar
                    dataKey="omzet"
                    name="Omzet Penjualan"
                    fill="#F59E0B"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                  />
                  <Line
                    type="monotone"
                    dataKey="untung"
                    name="Untung Bersih"
                    stroke="#16A34A"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#16A34A" }}
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full bg-stone-100 rounded-xl animate-pulse" />
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* TABEL STOK MENIPIS (STOK <= 2)                            */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">
                Peringatan Stok Menipis (≤ {STORE_CONFIG.lowStockThreshold} unit)
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
              {lowStockProducts.length} produk butuh restock
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Produk</th>
                  <th className="py-3 px-3">Kondisi</th>
                  <th className="py-3 px-3">Harga Jual</th>
                  <th className="py-3 px-3">Sisa Stok</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {lowStockProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-stone-400">
                      Semua stok produk berada di batas aman.
                    </td>
                  </tr>
                ) : (
                  lowStockProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/70">
                      <td className="py-3 px-4 font-bold text-stone-900">
                        {p.brand} {p.tipe} {p.storage}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-stone-600 font-medium">
                          {p.kondisi}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-stone-900">
                        {formatRupiah(p.hargaJual)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                            p.stok === 0
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {p.stok === 0 ? "Stok Habis" : `Sisa ${p.stok} unit`}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/dashboard/produk/edit/${p.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#D97706] hover:underline"
                        >
                          <span>Tambah Stok</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TABEL TRANSAKSI PERIODE TERPILIH                          */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                Daftar Transaksi ({periodLabelText})
              </h3>
              <p className="text-xs text-stone-400 mt-0.5">
                Daftar penjualan unit pada rentang periode yang Anda pilih
              </p>
            </div>
            <span className="text-xs text-stone-600 font-semibold bg-stone-100 px-3 py-1 rounded-full">
              {displaySales.length} transaksi
            </span>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Waktu Transaksi</th>
                  <th className="py-3 px-3">Produk Terjual</th>
                  <th className="py-3 px-3">Harga Modal (Beli)</th>
                  <th className="py-3 px-3">Harga Terjual</th>
                  <th className="py-3 px-3">Untung Bersih</th>
                  <th className="py-3 px-4 text-right">Kasir / Staf</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {displaySales.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-stone-400">
                      Tidak ada transaksi penjualan pada periode ini.
                    </td>
                  </tr>
                ) : (
                  displaySales.map((s) => {
                    const profit = s.hargaTerjual - s.hargaBeli;
                    return (
                      <tr key={s.id} className="hover:bg-stone-50/70">
                        <td className="py-3 px-4 text-stone-500 font-mono text-[11px] whitespace-nowrap">
                          {formatDate(s.soldAt)}
                        </td>
                        <td className="py-3 px-3 font-bold text-stone-900">
                          {s.namaProduk}
                        </td>
                        <td className="py-3 px-3 text-stone-500 font-mono whitespace-nowrap">
                          {formatRupiah(s.hargaBeli)}
                        </td>
                        <td className="py-3 px-3 font-bold text-stone-900 whitespace-nowrap">
                          {formatRupiah(s.hargaTerjual)}
                        </td>
                        <td className="py-3 px-3 font-bold text-emerald-600 font-mono whitespace-nowrap">
                          +{formatRupiah(profit)}
                        </td>
                        <td className="py-3 px-4 text-right text-stone-600 font-medium whitespace-nowrap">
                          {s.soldBy}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-stone-100">
            {displaySales.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-400">
                Tidak ada transaksi pada periode ini.
              </div>
            ) : (
              displaySales.map((s) => {
                const profit = s.hargaTerjual - s.hargaBeli;
                return (
                  <div key={s.id} className="p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-stone-400 text-[10px]">
                      <span>{formatDate(s.soldAt)}</span>
                      <span>Kasir: {s.soldBy}</span>
                    </div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      {s.namaProduk}
                    </h4>
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div>
                        <span className="text-stone-400 text-[10px] block">
                          Modal:
                        </span>
                        <span className="font-mono text-stone-600">
                          {formatRupiah(s.hargaBeli)}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block">
                          Terjual:
                        </span>
                        <span className="font-bold text-stone-900">
                          {formatRupiah(s.hargaTerjual)}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block">
                          Untung:
                        </span>
                        <span className="font-bold text-emerald-600 font-mono">
                          +{formatRupiah(profit)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog: Reset Demo Data */}
      <ConfirmDialog
        isOpen={showResetDialog}
        title="Reset Data Toko ke Demo Awal"
        message="Tindakan ini akan mengembalikan inventaris 10 smartphone, data histori 15 transaksi penjualan, dan 5 tiket servis dummy ke kondisi awal. Lanjutkan?"
        confirmLabel="Ya, Reset Data Sekarang"
        cancelLabel="Batal"
        isDestructive={true}
        onConfirm={handleResetData}
        onCancel={() => setShowResetDialog(false)}
      />
    </AuthGuard>
  );
}
