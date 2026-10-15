"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUsers, getCurrentUser, setCurrentUser } from "@/lib/db";
import { useToast } from "@/components/Toast";
import { Smartphone, LogIn, Lock, Mail, ArrowLeft, ShieldCheck, UserCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If already logged in, redirect directly to dashboard
    const user = getCurrentUser();
    if (user) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    const users = getUsers();
    const foundUser = users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password
    );

    if (!foundUser) {
      setErrorMsg("Email atau kata sandi tidak valid. Silakan coba lagi.");
      setIsSubmitting(false);
      return;
    }

    setCurrentUser(foundUser);
    showToast(`Selamat datang kembali, ${foundUser.nama}!`, "success");
    router.replace("/dashboard");
  };

  const handleFillDemo = (role: "admin" | "operator") => {
    if (role === "admin") {
      setEmail("admin@toko.com");
      setPassword("123");
    } else {
      setEmail("operator@toko.com");
      setPassword("123");
    }
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#141414] to-[#1C1917] flex flex-col justify-center items-center p-4 sm:p-6 text-stone-100 relative">
      {/* Back to public link */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Toko</span>
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white text-stone-900 rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Card Header with Logo */}
        <div className="p-8 pb-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#0A0A0A] text-[#F59E0B] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-black/10">
            <Smartphone className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-stone-950">
            Ponorogo <span className="text-[#F59E0B]">Phone</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1 font-medium">
            Portal Masuk Staf & Manajemen Toko
          </p>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="px-8 pb-2">
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-2 text-center">
              Akses Cepat Akun Demo:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo("admin")}
                className="h-9 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Demo Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo("operator")}
                className="h-9 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Demo Operator</span>
              </button>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Email Staf
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@toko.com"
                className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-3.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium animate-in fade-in">
              {errorMsg}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-xl bg-[#0A0A0A] hover:bg-[#F59E0B] hover:text-stone-950 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-95 disabled:opacity-50 mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? "Memverifikasi..." : "Masuk ke Dashboard"}</span>
          </button>
        </form>

        <div className="p-4 bg-stone-50 border-t border-stone-100 text-center text-xs text-stone-500">
          Akun Demo: <span className="font-mono text-stone-700">admin@toko.com</span> /{" "}
          <span className="font-mono text-stone-700">123</span>
        </div>
      </div>
    </div>
  );
}
