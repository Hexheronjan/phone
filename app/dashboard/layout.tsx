"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import ConfirmDialog from "@/components/ConfirmDialog";
import { getCurrentUser, setCurrentUser, User } from "@/lib/db";
import { useToast } from "@/components/Toast";
import {
  Smartphone,
  Package,
  PlusCircle,
  Wrench,
  BarChart3,
  Users,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Shield,
  UserCheck,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  useEffect(() => {
    const active = getCurrentUser();
    if (active) {
      setUser(active);
    }
  }, [pathname]);

  const handleLogout = () => {
    setCurrentUser(null);
    showToast("Anda telah keluar dari sesi staf.", "info");
    router.replace("/login");
  };

  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") return true;
    if (path !== "/dashboard" && pathname.startsWith(path)) return true;
    return false;
  };

  const menuItems = [
    {
      title: "Daftar Produk",
      path: "/dashboard",
      icon: Package,
      adminOnly: false,
    },
    {
      title: "Tambah Produk",
      path: "/dashboard/produk/baru",
      icon: PlusCircle,
      adminOnly: false,
    },
    {
      title: "Servis Masuk",
      path: "/dashboard/servis",
      icon: Wrench,
      adminOnly: false,
    },
    {
      title: "Laporan Keuangan",
      path: "/dashboard/laporan",
      icon: BarChart3,
      adminOnly: true,
    },
    {
      title: "Kelola Operator",
      path: "/dashboard/operator",
      icon: Users,
      adminOnly: true,
    },
  ];

  const visibleMenuItems = menuItems.filter(
    (item) => !item.adminOnly || user?.role === "admin"
  );

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F5F5F4] flex">
        {/* ========================================================= */}
        {/* DESKTOP SIDEBAR (Fixed, #0A0A0A)                          */}
        {/* ========================================================= */}
        <aside className="hidden lg:flex flex-col w-64 bg-[#0A0A0A] text-stone-200 border-r border-stone-800 shrink-0 select-none">
          {/* Brand Header */}
          <div className="h-18 px-6 flex items-center gap-3 border-b border-stone-800/80">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-stone-950 font-bold shadow-md shadow-amber-500/20">
              <Smartphone className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">
                Ponorogo <span className="text-[#F59E0B]">Phone</span>
              </span>
              <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
                Dashboard Internal
              </span>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="p-4 mx-3 my-4 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-800 text-[#F59E0B] flex items-center justify-center font-bold text-sm shrink-0">
              {user?.role === "admin" ? (
                <Shield className="w-5 h-5 text-[#F59E0B]" />
              ) : (
                <UserCheck className="w-5 h-5 text-blue-400" />
              )}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-white truncate">
                {user?.nama || "Staf Toko"}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    user?.role === "admin"
                      ? "bg-amber-500/20 text-[#F59E0B]"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {user?.role}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
              Menu Navigasi
            </span>

            {visibleMenuItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    active
                      ? "bg-[#F59E0B]/15 text-[#F59E0B] shadow-xs"
                      : "text-stone-300 hover:text-white hover:bg-stone-900"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      active ? "text-[#F59E0B]" : "text-stone-400"
                    }`}
                  />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-3 border-t border-stone-800 space-y-1">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-300 hover:text-white hover:bg-stone-900 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-stone-400" />
              <span>Buka Toko Publik</span>
            </Link>

            <button
              onClick={() => setShowLogoutDialog(true)}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar (Logout)</span>
            </button>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* MOBILE DRAWER OVERLAY                                      */}
        {/* ========================================================= */}
        {mobileDrawerOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            />

            {/* Drawer Panel */}
            <div className="relative w-72 max-w-[80vw] bg-[#0A0A0A] text-white flex flex-col h-full z-10 shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="h-16 px-5 flex items-center justify-between border-b border-stone-800">
                <span className="font-extrabold text-base tracking-tight text-white">
                  Ponorogo <span className="text-[#F59E0B]">Phone</span>
                </span>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User badge */}
              <div className="p-4 border-b border-stone-800 bg-stone-900/50">
                <div className="font-bold text-sm">{user?.nama}</div>
                <div className="text-xs text-[#F59E0B] font-semibold uppercase">
                  {user?.role}
                </div>
              </div>

              {/* Drawer Links */}
              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {visibleMenuItems.map((item) => {
                  const active = isActive(item.path);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold ${
                        active
                          ? "bg-[#F59E0B]/15 text-[#F59E0B]"
                          : "text-stone-300 hover:bg-stone-900"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-stone-800 space-y-2">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-white"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Lihat Katalog Publik</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    setShowLogoutDialog(true);
                  }}
                  className="flex items-center gap-2 text-xs font-semibold text-rose-400 pt-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MAIN DASHBOARD CONTENT AREA                               */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Bar */}
          <header className="h-16 bg-white border-b border-stone-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100"
                aria-label="Buka menu navigasi staf"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 truncate">
                Dashboard Manajemen Toko
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                target="_blank"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Lihat Website</span>
              </Link>

              <div className="h-7 w-px bg-stone-200 hidden sm:block" />

              <div className="text-right">
                <div className="text-xs font-bold text-stone-900 leading-tight">
                  {user?.nama}
                </div>
                <div className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                  Role: {user?.role}
                </div>
              </div>
            </div>
          </header>

          {/* Page Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutDialog}
        title="Konfirmasi Keluar Sesi"
        message="Apakah Anda yakin ingin keluar dari dashboard staf Ponorogo Phone?"
        confirmLabel="Ya, Logout"
        cancelLabel="Batal"
        isDestructive={false}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </AuthGuard>
  );
}
