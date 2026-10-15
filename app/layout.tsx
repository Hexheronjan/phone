import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ponorogo Phone - Toko HP Bekas & Baru Terpercaya di Ponorogo",
  description:
    "Jual beli HP bekas berkualitas & baru bergaransi resmi di Ponorogo. Terima tukar tambah, servis handphone, dan bisa COD area Ponorogo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className="bg-[#F5F5F4] text-[#1C1917] antialiased selection:bg-amber-500 selection:text-white">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
