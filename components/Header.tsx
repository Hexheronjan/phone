"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Smartphone, Menu, X, Search, Wrench } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group transition-transform active:scale-95"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Smartphone className="w-5 h-5 text-stone-950 stroke-[2.5]" />
          </div>
          <span className="font-bold text-lg sm:text-xl tracking-tight text-white">
            Ponorogo <span className="text-[#F59E0B]">Phone</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="/"
            className={`relative py-1 transition-colors hover:text-[#F59E0B] flex items-center gap-1.5 ${
              isActive("/") ? "text-[#F59E0B] font-semibold" : "text-stone-300"
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Katalog</span>
            {isActive("/") && (
              <span className="absolute bottom-[-18px] left-0 right-0 h-[2.5px] bg-[#F59E0B] rounded-full" />
            )}
          </Link>

          <Link
            href="/cek-servis"
            className={`relative py-1 transition-colors hover:text-[#F59E0B] flex items-center gap-1.5 ${
              isActive("/cek-servis")
                ? "text-[#F59E0B] font-semibold"
                : "text-stone-300"
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Cek Status Servis</span>
            {isActive("/cek-servis") && (
              <span className="absolute bottom-[-18px] left-0 right-0 h-[2.5px] bg-[#F59E0B] rounded-full" />
            )}
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
          aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu navigasi"}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0A0A0A] px-4 pt-3 pb-6 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${
              isActive("/")
                ? "bg-[#F59E0B]/15 text-[#F59E0B] font-semibold"
                : "text-stone-200 hover:bg-stone-900"
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Katalog HP</span>
          </Link>

          <Link
            href="/cek-servis"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${
              isActive("/cek-servis")
                ? "bg-[#F59E0B]/15 text-[#F59E0B] font-semibold"
                : "text-stone-200 hover:bg-stone-900"
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Cek Status Servis</span>
          </Link>
        </div>
      )}
    </header>
  );
}
