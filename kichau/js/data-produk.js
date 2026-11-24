/* =====================================================================
   DATA-PRODUK.JS  —  FILE UTAMA YANG PERLU ANDA EDIT
   ---------------------------------------------------------------------
   Cukup edit file ini untuk:
   - Menambah / menghapus / mengubah produk (array PRODUK di bawah)
   - Mengganti nomor WhatsApp, rekening, e-wallet, link media sosial (KONFIG)
   Semua halaman akan otomatis ikut berubah.
   ===================================================================== */

/* ---------- PENGATURAN TOKO ---------- */
const KONFIG = {
  namaToko: "Kichau",
  kepanjangan: "Key Chain Kacau",
  tagline: "Gantungan kunci kacau, tapi bikin hari kamu rapi.",

  // Nomor WhatsApp penjual: format internasional, tanpa "+" dan tanpa spasi
  noWA: "6287763966650",
  noWATampil: "0877-6396-6650",
  email: "mnaufaldzakiy@gmail.com",
  alamat: "SMK SMTI PADANG",
  jamLayanan: "Senin – Jumat, 09.00 – 17.00 WIB",

  // Link media sosial (ganti dengan akun asli)
  sosial: {
    instagram: "https://instagram.com/kichau.keychain",
    tiktok: "https://tiktok.com/@kichau.keychain",
    shopee: "https://shopee.co.id/kichau.keychain",
    tokopedia: "https://tokopedia.com/kichau.keychain"
  },

  // Pilihan pengiriman. cod:true berarti COD diperbolehkan untuk opsi ini
  pengiriman: [
    { id: "kampus", nama: "Antar di Kampus / Sekolah (area lokal)", ongkir: 0, cod: true },
    { id: "reguler", nama: "Kurir Reguler (JNE/J&T) 2–4 hari", ongkir: 12000, cod: false },
    { id: "ekspres", nama: "Kurir Ekspres 1–2 hari", ongkir: 22000, cod: false }
  ],

  // Nomor VA / rekening (DATA CONTOH untuk simulasi — ganti dengan milik Anda)
  bank: [
    { id: "BCA", nama: "BCA Virtual Account", nomor: "80777 0812 3456 7890", an: "Kichau Store" },
    { id: "Mandiri", nama: "Mandiri Virtual Account", nomor: "89508 0812 3456 7890", an: "Kichau Store" },
    { id: "BRI", nama: "BRI Virtual Account", nomor: "26215 0812 3456 7890", an: "Kichau Store" }
  ],

  // Nomor tujuan e-wallet (DATA CONTOH)
  ewallet: [
    { id: "GoPay", nomor: "0877-6396-6650", warna: "#00AA13" },
    { id: "OVO", nomor: "0877-6396-6650", warna: "#4C2A86" },
    { id: "DANA", nomor: "0877-6396-6650", warna: "#118EEA" },
    { id: "ShopeePay", nomor: "0877-6396-6650", warna: "#EE4D2D" }
  ],

  batasBayarMenit: 15 // batas waktu pembayaran QRIS (menit)
};

/* ---------- DAFTAR KATEGORI (untuk filter katalog) ---------- */
const KATEGORI = ["Acrylic", "Resin", "Metal", "Custom"];

/* ---------- DAFTAR PRODUK ----------
   Field:
   id          : angka unik
   nama        : nama produk
   harga       : angka (Rupiah), tanpa titik
   kategori    : salah satu dari KATEGORI
   bahan       : bahan produk
   deskripsi   : deskripsi singkat
   gambar      : path gambar (boleh diganti .jpg/.png milik Anda)
   warna       : pilihan variasi warna [{nama, hex}]
   terlaris    : true = tampil di "Best Sellers" beranda (pakai 4 produk)
   bisaCustom  : true = tampilkan simulasi pratinjau teks custom
   --------------------------------------------------------------- */
const PRODUK = [
  { id: 1, nama: "Kucing Kacau Acrylic", harga: 15000, kategori: "Acrylic",
    bahan: "Akrilik bening 3 mm, cetak UV tahan gores",
    deskripsi: "Kucing oranye dengan ekspresi paling kacau sedunia. Ringan, tahan air, dan cocok digantung di tas atau kunci motor.",
    gambar: "assets/images/kucing-kacau.svg", terlaris: true, bisaCustom: false,
    warna: [{ nama: "Oranye", hex: "#E8A45C" }, { nama: "Abu", hex: "#A9A9A9" }, { nama: "Hitam", hex: "#2B2B2B" }] },

  { id: 2, nama: "Bintang Pastel Acrylic", harga: 12000, kategori: "Acrylic",
    bahan: "Akrilik 3 mm warna pastel doff",
    deskripsi: "Bintang lucu dengan warna pastel lembut. Simpel, estetik, dan cocok untuk hadiah kecil.",
    gambar: "assets/images/bintang-pastel.svg", terlaris: false, bisaCustom: false,
    warna: [{ nama: "Pink", hex: "#F4B6C2" }, { nama: "Kuning", hex: "#F7E0A3" }, { nama: "Mint", hex: "#B8DFCF" }] },

  { id: 3, nama: "Boba Time Acrylic", harga: 15000, kategori: "Acrylic",
    bahan: "Akrilik bening 3 mm, cetak UV",
    deskripsi: "Gantungan boba dengan mutiara menggemaskan. Teman setia buat pecinta minuman manis.",
    gambar: "assets/images/boba-time.svg", terlaris: true, bisaCustom: false,
    warna: [{ nama: "Brown Sugar", hex: "#B78A67" }, { nama: "Taro", hex: "#B9A1D6" }, { nama: "Matcha", hex: "#A8C686" }] },

  { id: 4, nama: "Bunga Kering Resin", harga: 25000, kategori: "Resin",
    bahan: "Resin epoxy bening + bunga kering asli",
    deskripsi: "Bunga kering asli yang diawetkan dalam resin bening. Setiap pcs unik, tidak ada yang sama persis.",
    gambar: "assets/images/bunga-kering.svg", terlaris: true, bisaCustom: false,
    warna: [{ nama: "Bening", hex: "#E9DFC9" }, { nama: "Pink", hex: "#F3C9D0" }, { nama: "Lavender", hex: "#D5C8EA" }] },

  { id: 5, nama: "Bulan Glitter Resin", harga: 22000, kategori: "Resin",
    bahan: "Resin epoxy + glitter holografik",
    deskripsi: "Bulan sabit dengan glitter yang berkilau saat terkena cahaya. Cocok buat yang suka langit malam.",
    gambar: "assets/images/bulan-glitter.svg", terlaris: false, bisaCustom: false,
    warna: [{ nama: "Navy", hex: "#2F3E6B" }, { nama: "Ungu", hex: "#6B4C9A" }, { nama: "Hitam", hex: "#222222" }] },

  { id: 6, nama: "Ocean Wave Resin", harga: 28000, kategori: "Resin",
    bahan: "Resin epoxy, pigmen mika biru-putih",
    deskripsi: "Efek ombak laut dari pigmen mika. Tenang dipandang, bikin hati adem.",
    gambar: "assets/images/ocean-wave.svg", terlaris: false, bisaCustom: false,
    warna: [{ nama: "Biru Laut", hex: "#4F8FB8" }, { nama: "Tosca", hex: "#4FB5A8" }] },

  { id: 7, nama: "Hexagon Minimalis Metal", harga: 20000, kategori: "Metal",
    bahan: "Stainless steel anti karat, finishing doff",
    deskripsi: "Desain geometris minimalis. Kuat, awet, dan tampil elegan untuk gaya sehari-hari.",
    gambar: "assets/images/hexagon-metal.svg", terlaris: false, bisaCustom: false,
    warna: [{ nama: "Silver", hex: "#B9BDC2" }, { nama: "Gold", hex: "#D4B067" }, { nama: "Rose Gold", hex: "#D9A38F" }] },

  { id: 8, nama: "Inisial Huruf Metal", harga: 25000, kategori: "Metal",
    bahan: "Kuningan lapis emas, ukiran laser",
    deskripsi: "Huruf inisial pilihanmu diukir laser. Tulis inisial di kolom catatan saat memesan.",
    gambar: "assets/images/inisial-huruf.svg", terlaris: false, bisaCustom: true,
    warna: [{ nama: "Gold", hex: "#D4B067" }, { nama: "Silver", hex: "#B9BDC2" }] },

  { id: 9, nama: "Carabiner Klasik", harga: 18000, kategori: "Metal",
    bahan: "Aluminium alloy ringan",
    deskripsi: "Gantungan carabiner kuat dan praktis, mudah dipasang-lepas di tas, kunci, atau botol minum.",
    gambar: "assets/images/carabiner.svg", terlaris: false, bisaCustom: false,
    warna: [{ nama: "Hitam", hex: "#2B2B2B" }, { nama: "Silver", hex: "#B9BDC2" }, { nama: "Terracotta", hex: "#C4623F" }] },

  { id: 10, nama: "Custom Nama Acrylic", harga: 20000, kategori: "Custom",
    bahan: "Akrilik 3 mm, cetak UV teks custom",
    deskripsi: "Namamu (atau nama bestie) tercetak jelas di gantungan akrilik. Maksimal 12 karakter.",
    gambar: "assets/images/custom-nama.svg", terlaris: true, bisaCustom: true,
    warna: [{ nama: "Putih", hex: "#FFFFFF" }, { nama: "Pink", hex: "#F4B6C2" }, { nama: "Mint", hex: "#B8DFCF" }, { nama: "Kuning", hex: "#F7E0A3" }] },

  { id: 11, nama: "Custom Hati Resin", harga: 30000, kategori: "Custom",
    bahan: "Resin epoxy, teks cetak stiker vinyl",
    deskripsi: "Gantungan hati dari resin dengan teks pilihanmu. Cocok untuk hadiah ulang tahun atau anniversary.",
    gambar: "assets/images/custom-hati.svg", terlaris: false, bisaCustom: true,
    warna: [{ nama: "Merah Muda", hex: "#F0A5B5" }, { nama: "Lavender", hex: "#CDBDE6" }, { nama: "Bening", hex: "#E9E4D8" }] },

  { id: 12, nama: "Couple Set Custom (2 pcs)", harga: 45000, kategori: "Custom",
    bahan: "Akrilik 3 mm, 2 pcs nama berbeda",
    deskripsi: "Sepasang gantungan untuk kamu dan si dia (atau sahabat). Tulis dua nama di kolom catatan, pisahkan dengan tanda &.",
    gambar: "assets/images/couple-set.svg", terlaris: false, bisaCustom: true,
    warna: [{ nama: "Pink & Biru", hex: "#F4B6C2" }, { nama: "Hitam & Putih", hex: "#2B2B2B" }] }
];
