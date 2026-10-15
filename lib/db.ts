export type UserRole = "admin" | "operator";

export interface User {
  id: string;
  nama: string;
  email: string;
  password: string;
  role: UserRole;
}

export type Brand = "iPhone" | "Samsung" | "Xiaomi" | "Oppo";
export type ProductCondition = "Baru" | "Bekas Mulus" | "Bekas Minus";

export interface Product {
  id: string;
  brand: Brand;
  tipe: string;
  storage: string;
  kondisi: ProductCondition;
  baterai: number | null; // persen 0-100, null untuk Baru
  kelengkapan: string[];
  garansi: string;
  hargaBeli?: number; // Ditiadakan jika role bukan admin
  hargaJual: number; // Harga pajang publik
  hargaMinNego?: number; // Batas minimal nego yang diizinkan admin (khusus operator & admin)
  deskripsi: string;
  stok: number;
  foto: string[];
  createdAt: string;
}

export interface Sale {
  id: string;
  productId: string;
  namaProduk: string;
  hargaBeli: number;
  hargaTerjual: number;
  soldAt: string;
  soldBy: string;
}

export type ServiceStatus = "Antri" | "Dikerjakan" | "Sudah Jadi";

export interface ServiceTicket {
  id: string;
  nota: string;
  namaPelanggan: string;
  noWa: string;
  tipeHp: string;
  kerusakan: string;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEYS = {
  PRODUCTS: "ponorogo_phone_products",
  SALES: "ponorogo_phone_sales",
  SERVICES: "ponorogo_phone_services",
  USERS: "ponorogo_phone_users",
  SESSION: "ponorogo_phone_session",
  SERVICE_COUNTER: "ponorogo_phone_service_counter",
};

// ==========================================
// SEED DATA
// ==========================================

const SEED_USERS: User[] = [
  {
    id: "usr-admin-1",
    nama: "Bambang Admin",
    email: "admin@toko.com",
    password: "123",
    role: "admin",
  },
  {
    id: "usr-op-1",
    nama: "Siti Operator",
    email: "operator@toko.com",
    password: "123",
    role: "operator",
  },
];

const SEED_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    brand: "iPhone",
    tipe: "iPhone 13",
    storage: "128GB",
    kondisi: "Bekas Mulus",
    baterai: 89,
    kelengkapan: ["Dus Box Ori", "Kabel Lightning", "Casing Magsafe"],
    garansi: "Garansi toko 1 bulan",
    hargaBeli: 7800000,
    hargaJual: 8900000,
    hargaMinNego: 8600000,
    deskripsi: "Unit mulus 98%, no dent, face ID & true tone aktif normal, kamera jernih, all provider sinyal aman.",
    stok: 2,
    foto: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80",
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: "prod-2",
    brand: "iPhone",
    tipe: "iPhone 11",
    storage: "64GB",
    kondisi: "Bekas Minus",
    baterai: 81,
    kelengkapan: ["Unit HP", "Kabel Charger"],
    garansi: "Garansi toko 7 hari",
    hargaBeli: 3900000,
    hargaJual: 4700000,
    hargaMinNego: 4400000,
    deskripsi: "Fisik 90%, ada lecet halus di bezel sudut bawah, face ID aman, kamera normal siap pakai.",
    stok: 1,
    foto: [
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80",
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
  },
  {
    id: "prod-3",
    brand: "iPhone",
    tipe: "iPhone 15",
    storage: "128GB",
    kondisi: "Baru",
    baterai: null,
    kelengkapan: ["Dus Box Segel", "Kabel Type-C", "Buku Panduan", "SIM Ejector"],
    garansi: "Garansi Resmi iBox 1 tahun",
    hargaBeli: 12500000,
    hargaJual: 13999000,
    hargaMinNego: 13600000,
    deskripsi: "Barang baru 100% Brand New In Box (BNIB), garansi resmi Indonesia, Dynamic Island canggih.",
    stok: 3,
    foto: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&auto=format&fit=crop&q=80",
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
  {
    id: "prod-4",
    brand: "Samsung",
    tipe: "Galaxy A54 5G",
    storage: "128GB",
    kondisi: "Baru",
    baterai: null,
    kelengkapan: ["Dus Box Segel", "Kabel Type-C to C", "SIM Ejector", "Kartu Garansi"],
    garansi: "Garansi Resmi SEIN 1 tahun",
    hargaBeli: 4800000,
    hargaJual: 5499000,
    hargaMinNego: 5250000,
    deskripsi: "Brand new garansi SEIN resmi. Layar Super AMOLED 120Hz, kamera dengan OIS jernih, tahan air IP67.",
    stok: 4,
    foto: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: "prod-5",
    brand: "Samsung",
    tipe: "Galaxy S22",
    storage: "128GB",
    kondisi: "Bekas Mulus",
    baterai: 87,
    kelengkapan: ["Dus Box", "Kabel Type-C", "Bonus Case"],
    garansi: "Garansi toko 1 bulan",
    hargaBeli: 5500000,
    hargaJual: 6500000,
    hargaMinNego: 6200000,
    deskripsi: "Flagship ringkas powerful. Layar Dynamic AMOLED 2X, kamera malam sangat tajam, fisik 97% sangat terawat.",
    stok: 1,
    foto: [
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=800&auto=format&fit=crop&q=80",
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
  {
    id: "prod-6",
    brand: "Samsung",
    tipe: "Galaxy A12",
    storage: "64GB",
    kondisi: "Bekas Minus",
    baterai: 78,
    kelengkapan: ["Unit HP", "Charger Adapter", "Kabel"],
    garansi: "Garansi toko 7 hari",
    hargaBeli: 1000000,
    hargaJual: 1400000,
    hargaMinNego: 1250000,
    deskripsi: "Fisik 85% pemakaian wajar harian, baterai awet cocok untuk ojek online atau HP kedua, semua fitur normal.",
    stok: 2,
    foto: [
      "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80",
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "prod-7",
    brand: "Xiaomi",
    tipe: "Redmi Note 12",
    storage: "128GB",
    kondisi: "Baru",
    baterai: null,
    kelengkapan: ["Dus Box Segel", "Charger 33W Original", "Kabel Type-C", "Softcase"],
    garansi: "Garansi Resmi Xiaomi Indonesia 15 bulan",
    hargaBeli: 2300000,
    hargaJual: 2699000,
    hargaMinNego: 2550000,
    deskripsi: "Baru segel garansi resmi. Layar AMOLED 120Hz super halus, prosesor Snapdragon kencang dan hemat daya.",
    stok: 5,
    foto: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: "prod-8",
    brand: "Xiaomi",
    tipe: "Poco X5 Pro 5G",
    storage: "256GB",
    kondisi: "Bekas Mulus",
    baterai: 92,
    kelengkapan: ["Dus Box Lengkap", "Fast Charger 67W", "Kabel Type-C", "Casing"],
    garansi: "Garansi toko 1 bulan",
    hargaBeli: 2600000,
    hargaJual: 3100000,
    hargaMinNego: 2950000,
    deskripsi: "HP gaming serba bisa. Snapdragon 778G ngebut, layar Flow AMOLED, kamera 108MP, fisik 96% mulus.",
    stok: 2,
    foto: [
      "https://images.unsplash.com/photo-1570891836654-d4961a7b6929?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80",
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "prod-9",
    brand: "Oppo",
    tipe: "Reno 8 5G",
    storage: "256GB",
    kondisi: "Bekas Mulus",
    baterai: 90,
    kelengkapan: ["Dus Box", "Charger SuperVOOC 80W", "Kabel Data", "Casing"],
    garansi: "Garansi toko 1 bulan",
    hargaBeli: 3200000,
    hargaJual: 3800000,
    hargaMinNego: 3550000,
    deskripsi: "Kamera portrait flagship Sony IMX766, charging 80W super kilat 30 menit penuh, bodi ramping estetik.",
    stok: 1,
    foto: [
      "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1533228876829-65c94e7b5025?w=800&auto=format&fit=crop&q=80",
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "prod-10",
    brand: "Oppo",
    tipe: "Oppo A58",
    storage: "128GB",
    kondisi: "Baru",
    baterai: null,
    kelengkapan: ["Dus Box Segel", "Flash Charger 33W", "Kabel Type-C", "Softcase"],
    garansi: "Garansi Resmi Oppo Indonesia 1 tahun",
    hargaBeli: 2000000,
    hargaJual: 2399000,
    hargaMinNego: 2250000,
    deskripsi: "Unit baru segel. Desain Glowing Silk mewah, speaker stereo ganda 300% volume, baterai 5000mAh tahan lama.",
    stok: 3,
    foto: [
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
];

// Helper to generate seed sales over the last 7 days
function generateSeedSales(): Sale[] {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  return [
    // Hari ini (2-3 transaksi)
    {
      id: "sale-1",
      productId: "prod-1",
      namaProduk: "iPhone 13 128GB Bekas Mulus",
      hargaBeli: 7800000,
      hargaTerjual: 8850000,
      soldAt: new Date(now - 1000 * 60 * 90).toISOString(),
      soldBy: "Bambang Admin",
    },
    {
      id: "sale-2",
      productId: "prod-7",
      namaProduk: "Xiaomi Redmi Note 12 128GB Baru",
      hargaBeli: 2300000,
      hargaTerjual: 2650000,
      soldAt: new Date(now - 1000 * 60 * 240).toISOString(),
      soldBy: "Siti Operator",
    },
    {
      id: "sale-3",
      productId: "prod-4",
      namaProduk: "Samsung Galaxy A54 5G 128GB Baru",
      hargaBeli: 4800000,
      hargaTerjual: 5450000,
      soldAt: new Date(now - 1000 * 60 * 360).toISOString(),
      soldBy: "Siti Operator",
    },
    // H-1
    {
      id: "sale-4",
      productId: "prod-3",
      namaProduk: "iPhone 15 128GB Baru",
      hargaBeli: 12500000,
      hargaTerjual: 13900000,
      soldAt: new Date(now - 1 * dayMs - 1000 * 60 * 120).toISOString(),
      soldBy: "Bambang Admin",
    },
    {
      id: "sale-5",
      productId: "prod-8",
      namaProduk: "Xiaomi Poco X5 Pro 5G 256GB Bekas Mulus",
      hargaBeli: 2600000,
      hargaTerjual: 3050000,
      soldAt: new Date(now - 1 * dayMs - 1000 * 60 * 300).toISOString(),
      soldBy: "Siti Operator",
    },
    // H-2
    {
      id: "sale-6",
      productId: "prod-5",
      namaProduk: "Samsung Galaxy S22 128GB Bekas Mulus",
      hargaBeli: 5500000,
      hargaTerjual: 6400000,
      soldAt: new Date(now - 2 * dayMs - 1000 * 60 * 150).toISOString(),
      soldBy: "Bambang Admin",
    },
    {
      id: "sale-7",
      productId: "prod-10",
      namaProduk: "Oppo A58 128GB Baru",
      hargaBeli: 2000000,
      hargaTerjual: 2350000,
      soldAt: new Date(now - 2 * dayMs - 1000 * 60 * 420).toISOString(),
      soldBy: "Siti Operator",
    },
    // H-3
    {
      id: "sale-8",
      productId: "prod-2",
      namaProduk: "iPhone 11 64GB Bekas Minus",
      hargaBeli: 3900000,
      hargaTerjual: 4600000,
      soldAt: new Date(now - 3 * dayMs - 1000 * 60 * 180).toISOString(),
      soldBy: "Siti Operator",
    },
    {
      id: "sale-9",
      productId: "prod-7",
      namaProduk: "Xiaomi Redmi Note 12 128GB Baru",
      hargaBeli: 2300000,
      hargaTerjual: 2699000,
      soldAt: new Date(now - 3 * dayMs - 1000 * 60 * 500).toISOString(),
      soldBy: "Bambang Admin",
    },
    // H-4
    {
      id: "sale-10",
      productId: "prod-9",
      namaProduk: "Oppo Reno 8 5G 256GB Bekas Mulus",
      hargaBeli: 3200000,
      hargaTerjual: 3750000,
      soldAt: new Date(now - 4 * dayMs - 1000 * 60 * 200).toISOString(),
      soldBy: "Siti Operator",
    },
    {
      id: "sale-11",
      productId: "prod-4",
      namaProduk: "Samsung Galaxy A54 5G 128GB Baru",
      hargaBeli: 4800000,
      hargaTerjual: 5490000,
      soldAt: new Date(now - 4 * dayMs - 1000 * 60 * 380).toISOString(),
      soldBy: "Bambang Admin",
    },
    // H-5
    {
      id: "sale-12",
      productId: "prod-6",
      namaProduk: "Samsung Galaxy A12 64GB Bekas Minus",
      hargaBeli: 1000000,
      hargaTerjual: 1350000,
      soldAt: new Date(now - 5 * dayMs - 1000 * 60 * 160).toISOString(),
      soldBy: "Siti Operator",
    },
    {
      id: "sale-13",
      productId: "prod-1",
      namaProduk: "iPhone 13 128GB Bekas Mulus",
      hargaBeli: 7800000,
      hargaTerjual: 8800000,
      soldAt: new Date(now - 5 * dayMs - 1000 * 60 * 440).toISOString(),
      soldBy: "Bambang Admin",
    },
    // H-6
    {
      id: "sale-14",
      productId: "prod-10",
      namaProduk: "Oppo A58 128GB Baru",
      hargaBeli: 2000000,
      hargaTerjual: 2380000,
      soldAt: new Date(now - 6 * dayMs - 1000 * 60 * 210).toISOString(),
      soldBy: "Siti Operator",
    },
    {
      id: "sale-15",
      productId: "prod-8",
      namaProduk: "Xiaomi Poco X5 Pro 5G 256GB Bekas Mulus",
      hargaBeli: 2600000,
      hargaTerjual: 3080000,
      soldAt: new Date(now - 6 * dayMs - 1000 * 60 * 480).toISOString(),
      soldBy: "Bambang Admin",
    },
  ];
}

const SEED_SERVICES: ServiceTicket[] = [
  {
    id: "srv-1",
    nota: "SRV-0001",
    namaPelanggan: "Budi Santoso",
    noWa: "081234567891",
    tipeHp: "iPhone 12 Pro",
    kerusakan: "Ganti Baterai & Pembersihan Speaker Atas",
    status: "Sudah Jadi",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: "srv-2",
    nota: "SRV-0002",
    namaPelanggan: "Agus Prasetyo",
    noWa: "085712345678",
    tipeHp: "Samsung Galaxy A52",
    kerusakan: "Layar blank hitam setelah jatuh, butuh ganti LCD OLED",
    status: "Dikerjakan",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "srv-3",
    nota: "SRV-0003",
    namaPelanggan: "Dewi Lestari",
    noWa: "087890123456",
    tipeHp: "Xiaomi Redmi Note 10",
    kerusakan: "Port charger longgar tidak bisa mengisi daya",
    status: "Antri",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "srv-4",
    nota: "SRV-0004",
    namaPelanggan: "Rudi Hermawan",
    noWa: "081398765432",
    tipeHp: "Oppo Reno 6",
    kerusakan: "Kamera belakang tidak fokus bergetar terus",
    status: "Dikerjakan",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "srv-5",
    nota: "SRV-0005",
    namaPelanggan: "Anisa Rahma",
    noWa: "082156789012",
    tipeHp: "iPhone XR",
    kerusakan: "Backdoor pecah dan ganti housing",
    status: "Sudah Jadi",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
];

// ==========================================
// CORE DB FUNCTIONS
// ==========================================

export function checkAndSeedData(): void {
  if (typeof window === "undefined") return;

  const SEED_VERSION = "v4_nego_min_feature";
  const currentVersion = localStorage.getItem("ponorogo_phone_seed_version");
  const existingProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);

  if (!existingProducts || currentVersion !== SEED_VERSION) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
    if (!localStorage.getItem(STORAGE_KEYS.SALES)) {
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(generateSeedSales()));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(SEED_SERVICES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SERVICE_COUNTER)) {
      localStorage.setItem(STORAGE_KEYS.SERVICE_COUNTER, "5");
    }
    localStorage.setItem("ponorogo_phone_seed_version", SEED_VERSION);
  }
}

export function resetDemoData(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(generateSeedSales()));
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(SEED_SERVICES));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
  localStorage.setItem(STORAGE_KEYS.SERVICE_COUNTER, "5");
  localStorage.setItem("ponorogo_phone_seed_version", "v4_nego_min_feature");
}

/**
 * Filter product data based on role:
 * IF role is NOT 'admin', strip 'hargaBeli' completely from returned objects.
 * IF role is 'public', strip 'hargaMinNego' completely so buyers can't see the bottom price!
 */
function sanitizeProductForRole(product: Product, role?: string): Product {
  const clone = { ...product };
  if (role !== "admin") {
    delete clone.hargaBeli;
  }
  if (role === "public" || !role) {
    delete clone.hargaMinNego;
  }
  return clone;
}

export function getProducts(role?: "admin" | "operator" | "public"): Product[] {
  if (typeof window === "undefined") return [];
  checkAndSeedData();

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) return [];
    const products: Product[] = JSON.parse(raw);
    return products.map((p) => sanitizeProductForRole(p, role));
  } catch {
    return [];
  }
}

export function getProductById(id: string, role?: "admin" | "operator" | "public"): Product | null {
  if (typeof window === "undefined") return null;
  checkAndSeedData();

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) return null;
    const products: Product[] = JSON.parse(raw);
    const found = products.find((p) => p.id === id);
    if (!found) return null;
    return sanitizeProductForRole(found, role);
  } catch {
    return null;
  }
}

export function saveProduct(
  productData: Omit<Product, "id" | "createdAt"> & { id?: string }
): Product {
  if (typeof window === "undefined") throw new Error("Window is undefined");
  checkAndSeedData();

  const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  const products: Product[] = raw ? JSON.parse(raw) : [];

  if (productData.id) {
    // Update
    const index = products.findIndex((p) => p.id === productData.id);
    if (index === -1) throw new Error("Produk tidak ditemukan");

    // Retain original hargaBeli if incoming hargaBeli is undefined (e.g. edited by operator)
    const existing = products[index];
    const finalHargaBeli =
      productData.hargaBeli !== undefined && productData.hargaBeli > 0
        ? productData.hargaBeli
        : existing.hargaBeli ?? 0;

    const updated: Product = {
      ...existing,
      ...productData,
      id: existing.id,
      hargaBeli: finalHargaBeli,
      createdAt: existing.createdAt,
    };
    products[index] = updated;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return updated;
  } else {
    // Insert new
    const newProduct: Product = {
      ...productData,
      id: "prod-" + Date.now(),
      hargaBeli: productData.hargaBeli ?? 0,
      createdAt: new Date().toISOString(),
    };
    products.unshift(newProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return newProduct;
  }
}

export function deleteProduct(id: string): boolean {
  if (typeof window === "undefined") return false;
  checkAndSeedData();

  const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!raw) return false;
  let products: Product[] = JSON.parse(raw);
  const beforeLen = products.length;
  products = products.filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  return products.length < beforeLen;
}

export function markAsSold(
  productId: string,
  hargaTerjual: number,
  soldBy: string
): { success: boolean; sale?: Sale; error?: string } {
  if (typeof window === "undefined") return { success: false, error: "Window undefined" };
  checkAndSeedData();

  const rawProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  if (!rawProducts) return { success: false, error: "Data produk tidak ditemukan" };
  const products: Product[] = JSON.parse(rawProducts);

  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex === -1) return { success: false, error: "Produk tidak ditemukan" };

  const targetProduct = products[productIndex];
  if (targetProduct.stok <= 0) {
    return { success: false, error: "Stok produk sudah habis" };
  }

  // Reduce stock by 1
  targetProduct.stok -= 1;
  products[productIndex] = targetProduct;
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

  // Record Sale snapshot
  const rawSales = localStorage.getItem(STORAGE_KEYS.SALES);
  const sales: Sale[] = rawSales ? JSON.parse(rawSales) : [];

  const newSale: Sale = {
    id: "sale-" + Date.now(),
    productId: targetProduct.id,
    namaProduk: `${targetProduct.brand} ${targetProduct.tipe} ${targetProduct.storage} ${targetProduct.kondisi}`,
    hargaBeli: targetProduct.hargaBeli ?? 0,
    hargaTerjual: hargaTerjual,
    soldAt: new Date().toISOString(),
    soldBy: soldBy,
  };

  sales.unshift(newSale);
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));

  return { success: true, sale: newSale };
}

export function getSales(): Sale[] {
  if (typeof window === "undefined") return [];
  checkAndSeedData();

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SALES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ==========================================
// SERVICE TICKETS
// ==========================================

export function getServiceTickets(): ServiceTicket[] {
  if (typeof window === "undefined") return [];
  checkAndSeedData();

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SERVICES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function findServiceTickets(query: string): ServiceTicket[] {
  if (typeof window === "undefined") return [];
  checkAndSeedData();

  const cleanedQuery = query.trim().toUpperCase();
  if (!cleanedQuery) return [];

  const tickets = getServiceTickets();

  // Normalize potential phone query
  const queryDigits = query.replace(/[^0-9]/g, "");
  let normalizedQueryPhone = "";
  if (queryDigits.startsWith("0")) {
    normalizedQueryPhone = "62" + queryDigits.slice(1);
  } else if (queryDigits.startsWith("62")) {
    normalizedQueryPhone = queryDigits;
  } else if (queryDigits.length > 0) {
    normalizedQueryPhone = "62" + queryDigits;
  }

  return tickets.filter((ticket) => {
    // Match by Nota (case-insensitive substring)
    if (ticket.nota.toUpperCase().includes(cleanedQuery)) return true;

    // Match by normalized phone number
    if (normalizedQueryPhone.length >= 4) {
      const ticketDigits = ticket.noWa.replace(/[^0-9]/g, "");
      let normalizedTicketPhone = "";
      if (ticketDigits.startsWith("0")) {
        normalizedTicketPhone = "62" + ticketDigits.slice(1);
      } else if (ticketDigits.startsWith("62")) {
        normalizedTicketPhone = ticketDigits;
      }
      if (normalizedTicketPhone && normalizedTicketPhone.includes(normalizedQueryPhone)) {
        return true;
      }
    }

    return false;
  });
}

export function createServiceTicket(
  ticketData: Omit<ServiceTicket, "id" | "nota" | "createdAt" | "updatedAt">
): ServiceTicket {
  if (typeof window === "undefined") throw new Error("Window undefined");
  checkAndSeedData();

  const rawCounter = localStorage.getItem(STORAGE_KEYS.SERVICE_COUNTER) || "5";
  const currentCounter = parseInt(rawCounter, 10) + 1;
  localStorage.setItem(STORAGE_KEYS.SERVICE_COUNTER, currentCounter.toString());

  const formattedNota = `SRV-${currentCounter.toString().padStart(4, "0")}`;
  const now = new Date().toISOString();

  const newTicket: ServiceTicket = {
    ...ticketData,
    id: "srv-" + Date.now(),
    nota: formattedNota,
    createdAt: now,
    updatedAt: now,
  };

  const tickets = getServiceTickets();
  tickets.unshift(newTicket);
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(tickets));

  return newTicket;
}

export function updateServiceTicketStatus(
  id: string,
  status: ServiceStatus
): ServiceTicket | null {
  if (typeof window === "undefined") return null;
  checkAndSeedData();

  const tickets = getServiceTickets();
  const index = tickets.findIndex((t) => t.id === id);
  if (index === -1) return null;

  tickets[index].status = status;
  tickets[index].updatedAt = new Date().toISOString();

  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(tickets));
  return tickets[index];
}

// ==========================================
// USERS & AUTH
// ==========================================

export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  checkAndSeedData();

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUser(userData: Omit<User, "id"> & { id?: string }): User {
  if (typeof window === "undefined") throw new Error("Window undefined");
  checkAndSeedData();

  const users = getUsers();

  // Check unique email
  const existingWithEmail = users.find(
    (u) => u.email.toLowerCase() === userData.email.toLowerCase() && u.id !== userData.id
  );
  if (existingWithEmail) {
    throw new Error("Email sudah digunakan oleh akun lain");
  }

  if (userData.id) {
    const index = users.findIndex((u) => u.id === userData.id);
    if (index === -1) throw new Error("User tidak ditemukan");
    const updated = { ...users[index], ...userData };
    users[index] = updated;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return updated;
  } else {
    const newUser: User = {
      ...userData,
      id: "usr-" + Date.now(),
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return newUser;
  }
}

export function deleteUser(id: string): { success: boolean; error?: string } {
  if (typeof window === "undefined") return { success: false, error: "Window undefined" };
  checkAndSeedData();

  const users = getUsers();
  const target = users.find((u) => u.id === id);
  if (!target) return { success: false, error: "User tidak ditemukan" };

  if (target.role === "admin") {
    return { success: false, error: "Akun admin tidak dapat dihapus" };
  }

  const filtered = users.filter((u) => u.id !== id);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(filtered));
  return { success: true };
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  } else {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
  }
}
