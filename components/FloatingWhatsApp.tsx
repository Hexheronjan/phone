"use client";

import React from "react";
import { STORE_CONFIG } from "@/lib/config";
import { getWhatsAppUrl } from "@/lib/formatters";
import { MessageCircle } from "lucide-react";

export default function FloatingWhatsApp() {
  const defaultText = `Halo Admin ${STORE_CONFIG.name}, saya ingin bertanya seputar stok HP atau servis handphone.`;
  const waUrl = getWhatsAppUrl(STORE_CONFIG.phoneRaw, defaultText);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip on desktop hover */}
      <span className="hidden md:inline-block mr-3 px-3 py-1.5 rounded-xl bg-stone-900/90 text-white text-xs font-medium shadow-md backdrop-blur border border-stone-800 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Tanya Stok via WhatsApp
      </span>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp Admin Toko"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
      >
        {/* Glow pulse animation */}
        <span className="absolute -inset-0.5 rounded-full bg-[#16A34A] opacity-40 animate-ping pointer-events-none" />
        <MessageCircle className="w-7 h-7 relative z-10 fill-current" />
      </a>
    </div>
  );
}
