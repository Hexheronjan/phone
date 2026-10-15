/**
 * Format number to Indonesian Rupiah currency format, e.g. "Rp 8.900.000"
 */
export function formatRupiah(amount: number): string {
  if (typeof amount !== "number" || isNaN(amount)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(/\s+/g, " ");
}

/**
 * Format ISO date string into Indonesian locale with Asia/Jakarta timezone
 */
export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d) + " WIB";
  } catch {
    return dateStr;
  }
}

/**
 * Format short date (e.g. for charts: "14 Okt")
 */
export function formatDateShort(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      day: "numeric",
      month: "short",
    }).format(d);
  } catch {
    return dateStr;
  }
}

/**
 * Normalize phone number into standard 628xxx format:
 * converts 08xxx or +62xxx or 62xxx into 628xxx
 */
export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.startsWith("0")) {
    return "62" + cleaned.slice(1);
  }
  if (cleaned.startsWith("62")) {
    return cleaned;
  }
  return cleaned;
}

/**
 * Mask customer name for privacy, e.g. "Budi Santoso" -> "Budi S***"
 */
export function maskName(name: string): string {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    const first = parts[0];
    if (first.length <= 2) return first + "***";
    return first.slice(0, 3) + "***";
  }
  const firstName = parts[0];
  const secondInitial = parts[1].charAt(0).toUpperCase();
  return `${firstName} ${secondInitial}***`;
}

/**
 * Mask phone number for privacy, e.g. "081234567890" -> "0812****7890"
 */
export function maskPhone(phone: string): string {
  const cleaned = phone.trim();
  if (cleaned.length < 8) return cleaned;
  const start = cleaned.slice(0, 4);
  const end = cleaned.slice(-3);
  return `${start}****${end}`;
}

/**
 * Generate WhatsApp direct chat link with pre-filled message
 */
export function getWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}
