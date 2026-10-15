"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, User } from "@/lib/db";
import { useToast } from "@/components/Toast";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "admin";
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const activeUser = getCurrentUser();

    if (!activeUser) {
      router.replace("/login");
      return;
    }

    if (requiredRole === "admin" && activeUser.role !== "admin") {
      showToast("Akses ditolak. Halaman ini hanya untuk Administrator.", "error");
      router.replace("/dashboard");
      return;
    }

    setUser(activeUser);
    setChecking(false);
  }, [router, requiredRole, showToast]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#F5F5F4] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#F59E0B] animate-spin" />
        <span className="text-xs font-semibold text-stone-500 tracking-wider uppercase">
          Memeriksa autentikasi staf...
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
