"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  getProducts,
  deleteProduct,
  markAsSold,
  getCurrentUser,
  Product,
  User,
} from "@/lib/db";
import { STORE_CONFIG } from "@/lib/config";
import { formatRupiah } from "@/lib/formatters";
import { useToast } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  Package,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  ShoppingBag,
  AlertTriangle,
  Smartphone,
  X,
  Layers,
  ArrowUpDown,
  Tag,
} from "lucide-react";

export default function DashboardProductsPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("Semua");

  // Dialog States
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productToSell, setProductToSell] = useState<Product | null>(null);
  const [sellPriceInput, setSellPriceInput] = useState<number>(0);

  const loadData = () => {
    const active = getCurrentUser();
    setUser(active);
    const data = getProducts(active?.role || "operator");
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered products
  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedBrand !== "Semua" && p.brand !== selectedBrand) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = `${p.brand} ${p.tipe} ${p.storage} ${p.kondisi}`
          .toLowerCase()
          .includes(q);
        if (!matchTitle) return false;
      }
      return true;
    });
  }, [products, selectedBrand, searchQuery]);

  // Handle Delete
  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    const ok = deleteProduct(productToDelete.id);
    if (ok) {
      showToast(`Produk "${productToDelete.tipe}" berhasil dihapus.`, "success");
      loadData();
    } else {
      showToast("Gagal menghapus produk.", "error");
    }
    setProductToDelete(null);
  };

  // Open Sell Dialog
  const handleOpenSellDialog = (product: Product) => {
    setProductToSell(product);
    setSellPriceInput(product.hargaJual);
  };

  // Handle Confirm Sell
  const handleConfirmSell = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productToSell) return;

    if (sellPriceInput <= 0) {
      showToast("Harga terjual harus lebih dari 0", "error");
      return;
    }

    const res = markAsSold(
      productToSell.id,
      sellPriceInput,
      user?.nama || "Staf Toko"
    );

    if (res.success) {
      showToast(
        `Sukses! 1 unit ${productToSell.tipe} telah ditandai terjual (${formatRupiah(
          sellPriceInput
        )}).`,
        "success"
      );
      loadData();
      setProductToSell(null);
    } else {
      showToast(res.error || "Gagal memproses penjualan", "error");
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            Daftar Inventaris Produk
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Kelola stok HP, pantau ketersediaan unit, dan tandai unit yang terjual.
          </p>
        </div>

        <Link
          href="/dashboard/produk/baru"
          className="h-11 px-5 rounded-xl bg-[#0A0A0A] hover:bg-[#F59E0B] hover:text-stone-950 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </Link>
      </div>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold">
            <Package className="w-4 h-4 text-[#F59E0B]" />
            <span>Total Tipe Produk</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-2">
            {products.length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Total Unit Stok</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-2">
            {products.reduce((acc, curr) => acc + curr.stok, 0)} unit
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Stok Menipis (≤2)</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-600 mt-2">
            {
              products.filter(
                (p) => p.stok > 0 && p.stok <= STORE_CONFIG.lowStockThreshold
              ).length
            }
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>Stok Habis (0)</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-rose-600 mt-2">
            {products.filter((p) => p.stok === 0).length}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari merk, tipe, kapasitas, kondisi..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-stone-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full h-11 px-3 rounded-xl border border-stone-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#F59E0B] bg-white text-stone-700"
          >
            <option value="Semua">Semua Merk</option>
            <option value="iPhone">iPhone</option>
            <option value="Samsung">Samsung</option>
            <option value="Xiaomi">Xiaomi</option>
            <option value="Oppo">Oppo</option>
          </select>
        </div>
      </div>

      {/* Product Table (Desktop) / Cards (Mobile) */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {/* DESKTOP TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-4">Produk</th>
                <th className="py-3.5 px-3">Kondisi & BH</th>
                <th className="py-3.5 px-3">Harga Pajang</th>
                <th className="py-3.5 px-3">Batas Nego (Net)</th>
                {isAdmin && <th className="py-3.5 px-3">Harga Beli</th>}
                {isAdmin && <th className="py-3.5 px-3">Margin (Pajang)</th>}
                <th className="py-3.5 px-3">Sisa Stok</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={isAdmin ? 8 : 6}
                    className="py-10 text-center text-stone-400"
                  >
                    Tidak ada produk yang sesuai dengan pencarian.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const margin =
                    isAdmin && p.hargaBeli !== undefined
                      ? p.hargaJual - p.hargaBeli
                      : 0;

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-stone-50/70 transition-colors"
                    >
                      {/* Product Thumbnail + Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl bg-stone-100 overflow-hidden border border-stone-200 shrink-0">
                            <Image
                              src={
                                p.foto && p.foto.length > 0
                                  ? p.foto[0]
                                  : STORE_CONFIG.fallbackImage
                              }
                              alt={p.tipe}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                              {p.brand}
                            </span>
                            <span className="font-bold text-stone-900 text-sm block">
                              {p.tipe} {p.storage}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Kondisi & Battery */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold w-max ${
                              p.kondisi === "Baru"
                                ? "bg-blue-50 text-blue-700"
                                : p.kondisi === "Bekas Mulus"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-orange-50 text-orange-700"
                            }`}
                          >
                            {p.kondisi}
                          </span>
                          {p.baterai !== null && p.baterai !== undefined && (
                            <span className="text-[11px] text-stone-500 font-mono">
                              BH: {p.baterai}%
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Harga Pajang */}
                      <td className="py-3.5 px-3 font-bold text-stone-900 text-sm">
                        {formatRupiah(p.hargaJual)}
                      </td>

                      {/* Batas Nego (Net) - Toko Only (Operator & Admin) */}
                      <td className="py-3.5 px-3">
                        {p.hargaMinNego ? (
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 border border-amber-200/80 font-mono text-xs font-semibold text-amber-800">
                            <Tag className="w-3 h-3 text-amber-600" />
                            <span>{formatRupiah(p.hargaMinNego)}</span>
                          </div>
                        ) : (
                          <span className="text-stone-400 font-mono text-xs">-</span>
                        )}
                      </td>

                      {/* Admin Only: Harga Beli */}
                      {isAdmin && (
                        <td className="py-3.5 px-3 text-stone-600 font-mono text-xs">
                          {p.hargaBeli !== undefined
                            ? formatRupiah(p.hargaBeli)
                            : "-"}
                        </td>
                      )}

                      {/* Admin Only: Margin */}
                      {isAdmin && (
                        <td className="py-3.5 px-3 font-bold text-emerald-600 font-mono text-xs">
                          {formatRupiah(margin)}
                        </td>
                      )}

                      {/* Stok */}
                      <td className="py-3.5 px-3">
                        {p.stok === 0 ? (
                          <span className="px-2 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold text-[11px]">
                            Habis
                          </span>
                        ) : p.stok <= STORE_CONFIG.lowStockThreshold ? (
                          <span className="px-2 py-1 rounded-lg bg-amber-50 text-amber-700 font-bold text-[11px]">
                            {p.stok} unit (Menipis)
                          </span>
                        ) : (
                          <span className="text-stone-800 font-semibold text-xs">
                            {p.stok} unit
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Tandai Terjual Button */}
                          <button
                            onClick={() => handleOpenSellDialog(p)}
                            disabled={p.stok <= 0}
                            title="Tandai 1 Unit Terjual"
                            className="p-2 rounded-xl text-emerald-700 hover:bg-emerald-50 disabled:opacity-30 disabled:pointer-events-none transition-colors border border-transparent hover:border-emerald-200"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>

                          {/* Edit Button */}
                          <Link
                            href={`/dashboard/produk/edit/${p.id}`}
                            title="Edit Produk"
                            className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors border border-transparent hover:border-stone-200"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          {/* Delete Button */}
                          <button
                            onClick={() => setProductToDelete(p)}
                            title="Hapus Produk"
                            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS LIST */}
        <div className="md:hidden divide-y divide-stone-100">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-400">
              Tidak ada produk yang sesuai.
            </div>
          ) : (
            filtered.map((p) => (
              <div key={p.id} className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="relative w-16 h-16 rounded-xl bg-stone-100 overflow-hidden border border-stone-200 shrink-0">
                    <Image
                      src={
                        p.foto && p.foto.length > 0
                          ? p.foto[0]
                          : STORE_CONFIG.fallbackImage
                      }
                      alt={p.tipe}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      {p.brand}
                    </span>
                    <h4 className="font-bold text-stone-900 text-sm">
                      {p.tipe} {p.storage}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-stone-950">
                        {formatRupiah(p.hargaJual)}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="text-xs text-stone-500">
                        Stok: <strong>{p.stok}</strong>
                      </span>
                    </div>
                    {p.hargaMinNego && (
                      <div className="mt-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200/80 font-mono text-[10px] font-semibold text-amber-800">
                          <Tag className="w-2.5 h-2.5 text-amber-600" />
                          <span>Net: {formatRupiah(p.hargaMinNego)}</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      p.kondisi === "Baru"
                        ? "bg-blue-50 text-blue-700"
                        : p.kondisi === "Bekas Mulus"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-orange-50 text-orange-700"
                    }`}
                  >
                    {p.kondisi}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenSellDialog(p)}
                      disabled={p.stok <= 0}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 disabled:opacity-30 text-xs font-semibold flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Terjual</span>
                    </button>
                    <Link
                      href={`/dashboard/produk/edit/${p.id}`}
                      className="p-1.5 rounded-lg text-stone-600 hover:bg-stone-100"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setProductToDelete(p)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dialog: Tandai Terjual */}
      {productToSell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden animate-in zoom-in-95">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-stone-900 text-base">
                  Tandai Unit Terjual
                </h3>
              </div>
              <button
                onClick={() => setProductToSell(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSell} className="p-6 space-y-4">
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                <div>
                  <div className="font-bold text-stone-900 text-sm">
                    {productToSell.brand} {productToSell.tipe} {productToSell.storage}
                  </div>
                  <div className="text-stone-500 text-[11px] mt-0.5">
                    Kondisi: {productToSell.kondisi} • Sisa Stok:{" "}
                    <strong>{productToSell.stok} unit</strong>
                  </div>
                </div>

                <div className="border-t border-stone-200 pt-2 grid grid-cols-2 gap-2">
                  <div className="bg-white p-2 rounded-lg border border-stone-200/70">
                    <span className="text-[10px] text-stone-400 font-medium block">
                      Harga Pajang Toko
                    </span>
                    <span className="font-bold text-stone-900 text-xs">
                      {formatRupiah(productToSell.hargaJual)}
                    </span>
                  </div>
                  <div className="bg-amber-50/70 p-2 rounded-lg border border-amber-200/60">
                    <span className="text-[10px] text-amber-700 font-medium block">
                      Batas Minimal Nego (Net)
                    </span>
                    <span className="font-bold text-amber-900 text-xs font-mono">
                      {productToSell.hargaMinNego
                        ? formatRupiah(productToSell.hargaMinNego)
                        : "Bebas"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Harga Kesepakatan Terjual (Rp)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={sellPriceInput}
                  onChange={(e) => setSellPriceInput(parseInt(e.target.value, 10) || 0)}
                  className="w-full h-11 px-3.5 rounded-xl border border-stone-300 text-base font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
                />
                <span className="text-xs text-emerald-600 font-semibold block mt-1">
                  Preview: {formatRupiah(sellPriceInput)}
                </span>

                {/* Warning Alert if entered price is below Batas Nego */}
                {productToSell.hargaMinNego &&
                  sellPriceInput > 0 &&
                  sellPriceInput < productToSell.hargaMinNego && (
                    <div className="mt-2.5 p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">
                          Peringatan: Di Bawah Batas Nego Toko!
                        </span>
                        <span>
                          Harga yang diinput ({formatRupiah(sellPriceInput)}) lebih rendah dari batas minimal yang diizinkan bos ({formatRupiah(productToSell.hargaMinNego)}).
                        </span>
                      </div>
                    </div>
                  )}

                <p className="text-[11px] text-stone-400 mt-2">
                  *Masukkan nominal akhir yang disepakati pembeli. Stok otomatis berkurang 1 unit dan keuntungan toko otomatis tercatat di Laporan Keuangan Admin.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setProductToSell(null)}
                  className="h-10 px-4 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
                >
                  Konfirmasi Terjual
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog: Delete */}
      <ConfirmDialog
        isOpen={!!productToDelete}
        title="Hapus Produk dari Database"
        message={`Apakah Anda yakin ingin menghapus "${productToDelete?.brand} ${productToDelete?.tipe} ${productToDelete?.storage}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus Produk"
        cancelLabel="Batal"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
}
