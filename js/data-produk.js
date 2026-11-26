/* =====================================================================
   DATA-PRODUK.JS  —  FILE UTAMA YANG PERLU ANDA EDIT
   ---------------------------------------------------------------------
   Cukup edit file ini untuk:
   - Menambah / menghapus / mengubah produk (nama, harga, deskripsi) (array PRODUK di bawah)
   - Mengganti nomor WhatsApp, rekening, e-wallet, link media sosial (KONFIG)
   Semua halaman akan otomatis ikut berubah.
   ===================================================================== */

/* ---------- PENGATURAN TOKO ---------- */
const KONFIG = {
  namaToko: "Kichau",
  kepanjangan: "Key Chain Kacau",
  tagline: "Pin unik dengan harga ramah, bikin gayamu makin beda.",

  // Nomor WhatsApp penjual: format internasional, tanpa "+" dan tanpa spasi
  noWA: "6287763966650",
  noWATampil: "087763966650",
  email: "mnaufaldzakiy@gmail.com",
  alamat: "SMK SMTI PADANG",
  jamLayanan: "Senin – Jumat, 09.00 – 17.00 WIB",

  // Link media sosial
  sosial: {
    instagram: "https://instagram.com/kichau.keychain",
    tiktok: "https://tiktok.com/@kichau.keychain",
    website: "https://kiyysigma.github.io/kichau.keychain/"
  },
  // Nama akun yang ditampilkan di halaman Tentang & Kontak
  akun: { instagram: "@kichau.keychain", tiktok: "@kichau.keychain", website: "kiyysigma.github.io/kichau.keychain" },

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
const KATEGORI = ["Pin"];

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
  /* NAMA & DESKRIPSI di bawah masih sementara: silakan ganti sendiri. */
  { id: 1, nama: "Pin Burung", harga: 5000, kategori: "Pin",
    bahan: "Pin button bulat, permukaan glossy",
    deskripsi: "Pin bulat dengan siluet dua burung terbang dalam nuansa lembut.",
    gambar: "assets/images/pin-burung.png", terlaris: true, bisaCustom: false, warna: [] },

  { id: 2, nama: "Pin Multiverses", harga: 6000, kategori: "Pin",
    bahan: "Pin button bulat, permukaan glossy",
    deskripsi: "Pin bulat dengan desain Multiverses berwarna merah menyala.",
    gambar: "assets/images/pin-multiverses.png", terlaris: true, bisaCustom: false, warna: [] },

  { id: 3, nama: "Pin Selubung", harga: 6000, kategori: "Pin",
    bahan: "Pin button bulat, permukaan glossy",
    deskripsi: "Pin bulat dengan desain sosok berselubung putih berlatar ungu muda.",
    gambar: "assets/images/pin-selubung.png", terlaris: true, bisaCustom: false, warna: [] },

  { id: 4, nama: "Pin Siluet Asap", harga: 7000, kategori: "Pin",
    bahan: "Pin button bulat, permukaan glossy",
    deskripsi: "Pin bulat bergaya sinematik dengan siluet berdiri di tengah asap.",
    gambar: "assets/images/pin-siluet.png", terlaris: true, bisaCustom: false, warna: [] },

  { id: 5, nama: "Pin The Beatles", harga: 7000, kategori: "Pin",
    bahan: "Pin button bulat, permukaan glossy",
    deskripsi: "Pin hitam dengan logo The Beatles bermotif bendera Inggris.",
    gambar: "assets/images/pin-beatles.png", terlaris: false, bisaCustom: false, warna: [] }
];
