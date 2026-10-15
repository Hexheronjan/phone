"use client";

import React, { useState, useEffect } from "react";
import AuthGuard from "@/components/AuthGuard";
import ConfirmDialog from "@/components/ConfirmDialog";
import { getUsers, saveUser, deleteUser, User } from "@/lib/db";
import { useToast } from "@/components/Toast";
import {
  Users,
  UserPlus,
  Trash2,
  Shield,
  UserCheck,
  Mail,
  Lock,
  User as UserIcon,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export default function ManageOperatorsPage() {
  const { showToast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Dialog State
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const loadUsers = () => {
    const list = getUsers();
    setUsers(list);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddOperator = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!nama.trim() || !email.trim() || !password.trim()) {
      setFormError("Semua field wajib diisi");
      return;
    }

    setIsSubmitting(true);

    try {
      saveUser({
        nama: nama.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
        role: "operator",
      });

      showToast(`Akun operator "${nama}" berhasil dibuat!`, "success");
      setNama("");
      setEmail("");
      setPassword("");
      loadUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menambahkan operator";
      setFormError(msg);
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;

    const res = deleteUser(userToDelete.id);
    if (res.success) {
      showToast(`Akun ${userToDelete.nama} berhasil dihapus.`, "success");
      loadUsers();
    } else {
      showToast(res.error || "Gagal menghapus user", "error");
    }
    setUserToDelete(null);
  };

  return (
    <AuthGuard requiredRole="admin">
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-2 border border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Khusus Hak Akses Administrator</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            Kelola Akun Staf & Operator
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Tambah operator toko baru atau hapus akses kasir yang sudah tidak aktif.
          </p>
        </div>

        {/* 1. FORM TAMBAH OPERATOR */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-stone-100">
            <div className="p-2 rounded-xl bg-amber-50 text-[#F59E0B]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">
                Tambah Akun Operator Baru
              </h2>
              <p className="text-xs text-stone-400">
                Operator dapat mengelola stok produk dan tiket servis, namun tidak dapat melihat harga modal atau laporan keuangan.
              </p>
            </div>
          </div>

          {formError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleAddOperator} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Nama Lengkap Operator <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Rina Operator"
                    className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#F59E0B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Email Login (Harus Unik) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rina@toko.com"
                    className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#F59E0B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Kata Sandi Login <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Kata sandi..."
                    className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-stone-300 text-sm font-mono focus:ring-2 focus:ring-[#F59E0B]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-11 px-6 rounded-xl bg-[#0A0A0A] hover:bg-[#F59E0B] hover:text-stone-950 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isSubmitting ? "Mendaftarkan..." : "Daftarkan Operator"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* 2. TABEL DAFTAR PENGGUNA */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-stone-600" />
              <h3 className="font-bold text-stone-900 text-base">
                Daftar Akun Pengguna Terdaftar
              </h3>
            </div>
            <span className="text-xs text-stone-400">
              Total {users.length} akun
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-4">Nama Pengguna</th>
                  <th className="py-3.5 px-3">Email Login</th>
                  <th className="py-3.5 px-3">Password</th>
                  <th className="py-3.5 px-3">Hak Akses (Role)</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.map((u) => {
                  const isAdmin = u.role === "admin";
                  return (
                    <tr key={u.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                              isAdmin
                                ? "bg-amber-100 text-[#D97706]"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {isAdmin ? (
                              <Shield className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </div>
                          <span className="font-bold text-stone-900">{u.nama}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-mono text-stone-600">
                        {u.email}
                      </td>

                      <td className="py-3.5 px-3 font-mono text-stone-500">
                        {u.password}
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isAdmin
                              ? "bg-amber-100 text-amber-900"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isAdmin ? (
                          <span className="text-[11px] text-stone-400 italic">
                            Akun Utama (Permanen)
                          </span>
                        ) : (
                          <button
                            onClick={() => setUserToDelete(u)}
                            className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-200"
                            title="Hapus akun operator ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog: Delete Operator */}
      <ConfirmDialog
        isOpen={!!userToDelete}
        title="Hapus Akun Operator"
        message={`Apakah Anda yakin ingin menghapus akun operator "${userToDelete?.nama}" (${userToDelete?.email})? Staf ini tidak akan bisa login lagi.`}
        confirmLabel="Ya, Hapus Akun"
        cancelLabel="Batal"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setUserToDelete(null)}
      />
    </AuthGuard>
  );
}
