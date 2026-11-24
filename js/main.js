/* =====================================================================
   MAIN.JS — Logika seluruh website Kichau (Vanilla JavaScript)
   Daftar isi:
   1. Utilitas        2. Keranjang (localStorage)   3. Layout (navbar/footer)
   4. Efek (toast, ripple, reveal)   5. Halaman: Beranda, Katalog, Detail,
   Keranjang/Checkout, Kontak
   Data produk & pengaturan toko ada di js/data-produk.js
   ===================================================================== */

/* ---------- 1. UTILITAS ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const rupiah = n => "Rp" + Number(n).toLocaleString("id-ID");
const cariProduk = id => PRODUK.find(p => p.id === Number(id));
const esc = t => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- 2. KERANJANG (disimpan di localStorage) ---------- */
const KUNCI_CART = "kichau_keranjang";
const Cart = {
  ambil() {
    try { return JSON.parse(localStorage.getItem(KUNCI_CART)) || []; } catch (e) { return []; }
  },
  simpan(data) {
    try { localStorage.setItem(KUNCI_CART, JSON.stringify(data)); } catch (e) { /* storage diblokir */ }
    updateBadge();
  },
  // Tambah barang. Barang dengan id+warna+catatan yang sama digabung (qty bertambah)
  tambah(id, warna, catatan, qty = 1) {
    const data = this.ambil();
    const ada = data.find(i => i.id === id && i.warna === warna && i.catatan === catatan);
    if (ada) ada.qty += qty; else data.push({ id, warna, catatan, qty });
    this.simpan(data);
  },
  ubahQty(index, delta) {
    const data = this.ambil();
    if (!data[index]) return;
    data[index].qty = Math.max(1, data[index].qty + delta);
    this.simpan(data);
  },
  hapus(index) { const d = this.ambil(); d.splice(index, 1); this.simpan(d); },
  kosongkan() { this.simpan([]); },
  jumlah() { return this.ambil().reduce((a, i) => a + i.qty, 0); },
  subtotal() { return this.ambil().reduce((a, i) => a + (cariProduk(i.id)?.harga || 0) * i.qty, 0); }
};

/* ---------- 3. LAYOUT: NAVBAR, DRAWER, FOOTER (disisipkan otomatis) ---------- */
const MENU = [
  { href: "index.html", teks: "Beranda", page: "beranda" },
  { href: "katalog.html", teks: "Katalog", page: "katalog" },
  { href: "tentang-kontak.html", teks: "Tentang & Kontak", page: "kontak" }
];
const IKON_CART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l-1 12H7L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>';

function renderLayout() {
  const halaman = document.body.dataset.page;
  const link = (m, kelas = "") => `<a href="${m.href}" class="${m.page === halaman ? "aktif" : ""} ${kelas}">${m.teks}</a>`;
  const header = $("#site-header");
  if (header) header.innerHTML = `
    <!-- Navbar sticky -->
    <nav class="navbar"><div class="container">
      <a href="index.html" class="logo"><img src="assets/images/logo.svg" alt="Logo Kichau">${KONFIG.namaToko}</a>
      <ul class="nav-menu">${MENU.map(m => `<li>${link(m)}</li>`).join("")}</ul>
      <div class="nav-aksi">
        <a href="keranjang.html" class="ikon-btn" aria-label="Keranjang">${IKON_CART}<span class="badge-keranjang hidden" id="badge-cart">0</span></a>
        <button class="ikon-btn hamburger" id="btn-hamburger" aria-label="Buka menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
      </div>
    </div></nav>
    <!-- Drawer menu untuk mobile -->
    <div class="drawer-overlay" id="drawer-overlay"></div>
    <aside class="drawer" aria-label="Menu">
      <button class="ikon-btn drawer-tutup" id="btn-tutup" aria-label="Tutup menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      ${MENU.map(m => link(m)).join("")}
      <a href="keranjang.html" class="${halaman === "keranjang" ? "aktif" : ""}">Keranjang</a>
    </aside>
    <div class="toast-wrap" id="toast-wrap"></div>`;

  const footer = $("#site-footer");
  if (footer) footer.innerHTML = `
    <footer class="footer"><div class="container">
      <div class="footer-grid">
        <div><div class="logo"><img src="assets/images/logo.svg" alt="">${KONFIG.namaToko}</div><p>${KONFIG.tagline}</p></div>
        <div><h4>Navigasi</h4><ul>${MENU.map(m => `<li><a href="${m.href}">${m.teks}</a></li>`).join("")}<li><a href="keranjang.html">Keranjang</a></li></ul></div>
        <div><h4>Hubungi Kami</h4><ul>
          <li><a href="https://wa.me/${KONFIG.noWA}" target="_blank" rel="noopener">WhatsApp ${KONFIG.noWATampil}</a></li>
          <li><a href="mailto:${KONFIG.email}">${KONFIG.email}</a></li>
          <li><a href="${KONFIG.sosial.instagram}" target="_blank" rel="noopener">Instagram</a></li></ul></div>
      </div>
      <div class="footer-bawah">© ${new Date().getFullYear()} ${KONFIG.namaToko} (${KONFIG.kepanjangan}) — Proyek Kewirausahaan.</div>
    </div></footer>`;

  // buka/tutup drawer
  const toggle = buka => document.body.classList.toggle("drawer-buka", buka);
  $("#btn-hamburger")?.addEventListener("click", () => toggle(true));
  $("#btn-tutup")?.addEventListener("click", () => toggle(false));
  $("#drawer-overlay")?.addEventListener("click", () => toggle(false));
  updateBadge();
}

function updateBadge(animasi = false) {
  const b = $("#badge-cart"); if (!b) return;
  const n = Cart.jumlah();
  b.textContent = n; b.classList.toggle("hidden", n === 0);
  if (animasi) { b.classList.remove("bounce"); void b.offsetWidth; b.classList.add("bounce"); } // memantul
}

/* ---------- 4. EFEK: TOAST, RIPPLE, SCROLL REVEAL ---------- */
function toast(pesan, ikon = "✓") {
  const wrap = $("#toast-wrap"); if (!wrap) return;
  const t = document.createElement("div");
  t.className = "toast"; t.innerHTML = `<span>${ikon}</span><span>${esc(pesan)}</span>`;
  wrap.appendChild(t);
  setTimeout(() => { t.classList.add("keluar"); setTimeout(() => t.remove(), 350); }, 2600);
}

// Ripple: berlaku untuk semua elemen .btn
document.addEventListener("click", e => {
  const btn = e.target.closest(".btn"); if (!btn) return;
  const r = btn.getBoundingClientRect(), d = Math.max(r.width, r.height);
  const s = document.createElement("span");
  s.className = "ripple";
  s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
  btn.appendChild(s); setTimeout(() => s.remove(), 600);
});

// Scroll reveal dengan Intersection Observer
let observer;
function initReveal() {
  const els = $$(".reveal:not(.tampil)");
  if (!("IntersectionObserver" in window)) { els.forEach(el => el.classList.add("tampil")); return; }
  observer = observer || new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("tampil"); observer.unobserve(en.target); } });
  }, { threshold: .12 });
  els.forEach((el, i) => { el.style.transitionDelay = (i % 4) * 80 + "ms"; observer.observe(el); });
}

// Membuat HTML kartu produk (dipakai beranda, katalog, produk terkait)
function kartuProduk(p) {
  return `<article class="kartu-produk reveal">
    <a href="detail-produk.html?id=${p.id}" class="kartu-gambar"><img src="${p.gambar}" alt="${esc(p.nama)}" loading="lazy"><span class="tag-kategori">${p.kategori}</span></a>
    <div class="kartu-isi">
      <a href="detail-produk.html?id=${p.id}"><h3>${esc(p.nama)}</h3></a>
      <span class="harga">${rupiah(p.harga)}</span>
      <button class="btn btn-garis btn-kecil js-cepat" data-id="${p.id}">+ Keranjang</button>
    </div></article>`;
}
// Tombol "+ Keranjang" cepat pada kartu (memakai warna pertama)
document.addEventListener("click", e => {
  const b = e.target.closest(".js-cepat"); if (!b) return;
  const p = cariProduk(b.dataset.id);
  Cart.tambah(p.id, p.warna[0].nama, "", 1);
  updateBadge(true); toast(`${p.nama} ditambahkan ke keranjang`);
});

/* ---------- 5A. HALAMAN BERANDA ---------- */
function initBeranda() {
  const best = PRODUK.filter(p => p.terlaris).slice(0, 4);
  $("#best-sellers").innerHTML = best.map(kartuProduk).join("");
}

/* ---------- 5B. HALAMAN KATALOG (filter kategori + pencarian) ---------- */
function initKatalog() {
  const params = new URLSearchParams(location.search);
  let kategori = KATEGORI.includes(params.get("kategori")) ? params.get("kategori") : "Semua";
  const chipWrap = $("#chips"), grid = $("#grid-katalog"), cari = $("#cari"), urut = $("#urut");

  chipWrap.innerHTML = ["Semua", ...KATEGORI].map(k => `<button class="chip" data-k="${k}">${k}</button>`).join("");

  function tampil() {
    const q = cari.value.trim().toLowerCase();
    let hasil = PRODUK.filter(p => (kategori === "Semua" || p.kategori === kategori) &&
      (p.nama + " " + p.kategori + " " + p.bahan).toLowerCase().includes(q));
    if (urut.value === "murah") hasil.sort((a, b) => a.harga - b.harga);
    if (urut.value === "mahal") hasil.sort((a, b) => b.harga - a.harga);
    $$(".chip", chipWrap).forEach(c => c.classList.toggle("aktif", c.dataset.k === kategori));
    grid.innerHTML = hasil.length ? hasil.map(kartuProduk).join("") : `<div class="kosong"><div style="font-size:2.5rem">🔍</div><p>Produk tidak ditemukan. Coba kata kunci lain.</p></div>`;
    $("#jumlah-hasil").textContent = hasil.length + " produk";
    initReveal();
  }
  chipWrap.addEventListener("click", e => { const c = e.target.closest(".chip"); if (c) { kategori = c.dataset.k; tampil(); } });
  cari.addEventListener("input", tampil); urut.addEventListener("change", tampil);
  tampil();
}

/* ---------- 5C. HALAMAN DETAIL PRODUK ---------- */
// Membuat SVG pratinjau keychain custom dari teks & warna
function buatPreview(p, teks, hex) {
  const gelap = (() => { const n = parseInt(hex.slice(1), 16); return ((n >> 16) * .299 + ((n >> 8) & 255) * .587 + (n & 255) * .114) < 140; })();
  const warnaTeks = gelap ? "#fff" : "#1A1A1A";
  const ring = `<circle cx="150" cy="22" r="14" fill="none" stroke="#8A8F98" stroke-width="5"/><rect x="146" y="36" width="8" height="22" rx="4" fill="none" stroke="#8A8F98" stroke-width="4"/>`;
  const t = esc(teks || (p.id === 12 ? "Nama & Nama" : p.id === 8 ? "K" : "NAMAMU"));
  if (p.id === 12) { // couple: dua papan
    const [a, b] = (teks || "Rina & Dimas").split("&").map(s => esc(s.trim()));
    return `<svg viewBox="0 0 300 220">${ring}<g transform="rotate(-6 90 130)"><rect x="20" y="62" width="120" height="110" rx="24" fill="${hex}" stroke="#fff" stroke-width="4"/><text x="80" y="125" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="${a.length > 7 ? 18 : 24}" fill="${warnaTeks}">${a || "..."}</text></g><g transform="rotate(6 220 130)"><rect x="160" y="62" width="120" height="110" rx="24" fill="#B9D0F0" stroke="#fff" stroke-width="4"/><text x="220" y="125" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="${(b || "").length > 7 ? 18 : 24}" fill="#1A1A1A">${b || "..."}</text></g></svg>`;
  }
  if (p.id === 11) { // hati
    return `<svg viewBox="0 0 300 240">${ring}<path d="M150 225 C45 150 60 80 112 80 C135 80 150 96 150 112 C150 96 165 80 188 80 C240 80 255 150 150 225z" fill="${hex}" stroke="#fff" stroke-width="5"/><text x="150" y="150" text-anchor="middle" font-family="Georgia,serif" font-style="italic" font-weight="700" font-size="${t.length > 8 ? 22 : 30}" fill="${warnaTeks}">${t}</text></svg>`;
  }
  const ukuran = p.id === 8 ? 90 : Math.max(18, 40 - t.length * 2);
  const lebar = p.id === 8 ? 140 : 250, x = 150 - lebar / 2;
  return `<svg viewBox="0 0 300 220">${ring}<rect x="${x}" y="64" width="${lebar}" height="${p.id === 8 ? 140 : 100}" rx="30" fill="${hex}" stroke="${p.id === 8 ? "#B48E3C" : "#fff"}" stroke-width="4"/><text x="150" y="${p.id === 8 ? 168 : 126}" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="${ukuran}" fill="${warnaTeks}">${t}</text></svg>`;
}

function initDetail() {
  const id = new URLSearchParams(location.search).get("id");
  const p = cariProduk(id) || PRODUK[0];
  let warna = p.warna[0], qty = 1;
  document.title = `${p.nama} — Kichau`;
  $("#bc-nama").textContent = p.nama;
  $("#d-gambar").src = p.gambar; $("#d-gambar").alt = p.nama;
  $("#d-kategori").textContent = p.kategori; $("#d-nama").textContent = p.nama;
  $("#d-harga").textContent = rupiah(p.harga); $("#d-desc").textContent = p.deskripsi;
  $("#d-bahan").innerHTML = `<b>Bahan:</b> ${esc(p.bahan)}`;

  const sw = $("#d-warna");
  sw.innerHTML = p.warna.map((w, i) => `<button class="swatch ${i === 0 ? "aktif" : ""}" data-i="${i}"><i style="background:${w.hex}"></i>${w.nama}</button>`).join("");
  $("#d-warna-nama").textContent = warna.nama;

  const catatan = $("#catatan"), prevBox = $("#preview-box");
  const maxLen = p.id === 12 ? 24 : 12;
  catatan.maxLength = maxLen;
  $("#label-catatan").textContent = p.bisaCustom ? "Teks / nama custom" : "Catatan untuk penjual (opsional)";
  catatan.placeholder = p.id === 12 ? "Contoh: Rina & Dimas" : p.bisaCustom ? "Contoh: Rina" : "Contoh: tolong dibungkus kado";
  function gambarPreview() {
    if (!p.bisaCustom) return;
    prevBox.innerHTML = buatPreview(p, catatan.value.trim(), warna.hex);
  }
  if (p.bisaCustom) { $("#preview-wrap").hidden = false; gambarPreview(); }
  catatan.addEventListener("input", gambarPreview);

  sw.addEventListener("click", e => {
    const b = e.target.closest(".swatch"); if (!b) return;
    warna = p.warna[b.dataset.i];
    $$(".swatch", sw).forEach(s => s.classList.toggle("aktif", s === b));
    $("#d-warna-nama").textContent = warna.nama; gambarPreview();
  });

  // kontrol jumlah
  const tampilQty = () => { $("#d-qty").textContent = qty; $("#bar-total").textContent = rupiah(p.harga * qty); };
  $("#qty-min").addEventListener("click", () => { qty = Math.max(1, qty - 1); tampilQty(); });
  $("#qty-plus").addEventListener("click", () => { qty = Math.min(99, qty + 1); tampilQty(); });
  tampilQty();

  // tombol tambah ke keranjang (ada di panel info & bar bawah mobile)
  $$(".js-tambah").forEach(b => b.addEventListener("click", () => {
    Cart.tambah(p.id, warna.nama, catatan.value.trim(), qty);
    updateBadge(true); toast(`${qty}× ${p.nama} masuk keranjang`);
  }));
  $$(".js-beli").forEach(b => b.addEventListener("click", () => {
    Cart.tambah(p.id, warna.nama, catatan.value.trim(), qty); location.href = "keranjang.html";
  }));

  // produk terkait
  const terkait = PRODUK.filter(x => x.kategori === p.kategori && x.id !== p.id);
  const lain = PRODUK.filter(x => x.kategori !== p.kategori && x.id !== p.id);
  $("#terkait").innerHTML = [...terkait, ...lain].slice(0, 4).map(kartuProduk).join("");
}

/* ---------- 5D. HALAMAN KERANJANG & CHECKOUT ---------- */
const Checkout = { pengirimanId: KONFIG.pengiriman[0].id, metode: null, detail: null, timer: null };

function ongkir() { return KONFIG.pengiriman.find(x => x.id === Checkout.pengirimanId).ongkir; }
function totalAkhir() { return Cart.subtotal() + (Cart.jumlah() ? ongkir() : 0); }

function initKeranjang() {
  renderCart(); renderPengiriman(); renderMetode();
  $("#form-checkout").addEventListener("submit", e => { e.preventDefault(); konfirmasiWA(); });
  $$(".js-konfirmasi").forEach(b => b.addEventListener("click", () => $("#form-checkout").requestSubmit()));
  $("#modal-qris").addEventListener("click", e => { if (e.target.id === "modal-qris" || e.target.closest(".js-tutup-qris")) tutupQRIS(); });
}

// Menampilkan daftar barang + total
function renderCart() {
  const data = Cart.ambil(), list = $("#cart-list");
  $("#cart-ada").hidden = data.length === 0; $("#cart-kosong").hidden = data.length > 0;
  document.body.classList.toggle("ada-aksi-bawah", data.length > 0);
  list.innerHTML = data.map((it, i) => {
    const p = cariProduk(it.id); if (!p) return "";
    return `<div class="item-cart">
      <img src="${p.gambar}" alt="${esc(p.nama)}">
      <div><h3>${esc(p.nama)}</h3><div class="item-meta">Warna: ${esc(it.warna)}${it.catatan ? `<br>Catatan: “${esc(it.catatan)}”` : ""}</div><div class="harga">${rupiah(p.harga)}</div></div>
      <div class="item-kanan">
        <div class="qty"><button data-aksi="min" data-i="${i}" aria-label="Kurangi">−</button><span>${it.qty}</span><button data-aksi="plus" data-i="${i}" aria-label="Tambah">+</button></div>
        <b>${rupiah(p.harga * it.qty)}</b><button class="hapus" data-aksi="hapus" data-i="${i}">Hapus</button>
      </div></div>`;
  }).join("");
  hitungTotal();
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-aksi]"); if (!b || !$("#cart-list")) return;
  const i = Number(b.dataset.i);
  if (b.dataset.aksi === "plus") Cart.ubahQty(i, 1);
  if (b.dataset.aksi === "min") Cart.ubahQty(i, -1);
  if (b.dataset.aksi === "hapus") { Cart.hapus(i); toast("Barang dihapus dari keranjang", "🗑"); }
  renderCart(); renderMetode();
});

function hitungTotal() {
  $("#t-sub").textContent = rupiah(Cart.subtotal());
  $("#t-ongkir").textContent = ongkir() === 0 ? "Gratis" : rupiah(ongkir());
  $("#t-total").textContent = rupiah(totalAkhir());
  $("#bar-total").textContent = rupiah(totalAkhir());
}

function renderPengiriman() {
  const sel = $("#pengiriman");
  sel.innerHTML = KONFIG.pengiriman.map(x => `<option value="${x.id}">${x.nama} — ${x.ongkir ? rupiah(x.ongkir) : "Gratis"}</option>`).join("");
  sel.addEventListener("change", () => {
    Checkout.pengirimanId = sel.value;
    // COD hanya untuk area lokal; jika sebelumnya COD dipilih, reset
    const cod = KONFIG.pengiriman.find(x => x.id === sel.value).cod;
    if (!cod && Checkout.metode === "cod") { Checkout.metode = null; Checkout.detail = null; }
    hitungTotal(); renderMetode();
  });
}

// Daftar metode pembayaran + sub-pilihan
function renderMetode() {
  const box = $("#metode"); if (!box) return;
  const codBoleh = KONFIG.pengiriman.find(x => x.id === Checkout.pengirimanId).cod;
  const m = Checkout.metode;
  const kartu = (id, judul, ket, ekstra = "", nonaktif = false) => `
    <label class="bayar-kartu ${m === id ? "aktif" : ""} ${nonaktif ? "nonaktif" : ""}">
      <input type="radio" name="metode" value="${id}" ${m === id ? "checked" : ""} ${nonaktif ? "disabled" : ""}>
      <span><b>${judul}</b><small>${ket}</small></span></label>${m === id ? ekstra : ""}`;

  const subQRIS = `<div class="sub-bayar"><button type="button" class="btn btn-aksen btn-kecil" id="btn-qris">Tampilkan Kode QRIS</button></div>`;
  const subVA = `<div class="sub-bayar">${KONFIG.bank.map(b => `
      <div class="va-baris" data-bank="${b.id}" style="${Checkout.detail === b.id ? "border-color:var(--warna-aksen)" : ""}">
        <div><b>${b.nama}</b><small>a.n. ${b.an}</small><code>${b.nomor}</code></div>
        <div style="display:flex;gap:6px"><button type="button" class="btn btn-garis btn-kecil js-pilih-bank" data-id="${b.id}">${Checkout.detail === b.id ? "✓ Dipilih" : "Pilih"}</button>
        <button type="button" class="btn btn-primer btn-kecil js-salin" data-nomor="${b.nomor}">Salin Nomor</button></div></div>`).join("")}</div>`;
  const subEW = `<div class="sub-bayar"><div class="ewallet-grid">${KONFIG.ewallet.map(w => `
      <button type="button" class="ew-pilih js-pilih-ew ${Checkout.detail === w.id ? "aktif" : ""}" data-id="${w.id}"><i style="background:${w.warna}"></i>${w.id}</button>`).join("")}</div>
      ${Checkout.detail && KONFIG.ewallet.find(w => w.id === Checkout.detail) ? `<div class="va-baris"><div><small>Kirim ke ${Checkout.detail}</small><code>${KONFIG.ewallet.find(w => w.id === Checkout.detail).nomor}</code></div><button type="button" class="btn btn-primer btn-kecil js-salin" data-nomor="${KONFIG.ewallet.find(w => w.id === Checkout.detail).nomor}">Salin Nomor</button></div>` : ""}</div>`;

  box.innerHTML =
    kartu("qris", "QRIS", "Scan dengan semua aplikasi e-wallet / m-banking", subQRIS) +
    kartu("va", "Transfer Bank (Virtual Account)", "BCA, Mandiri, BRI", subVA) +
    kartu("ewallet", "E-Wallet", "GoPay, OVO, DANA, ShopeePay", subEW) +
    kartu("cod", "COD (Bayar di Tempat)", codBoleh ? "Khusus area lokal / kampus / sekolah" : "Hanya tersedia untuk pengiriman Antar di Kampus / Sekolah", "", !codBoleh);

  $$('input[name="metode"]', box).forEach(r => r.addEventListener("change", () => {
    Checkout.metode = r.value; Checkout.detail = null; renderMetode();
    if (r.value === "qris") bukaQRIS();
  }));
  $("#btn-qris")?.addEventListener("click", bukaQRIS);
  $$(".js-pilih-bank", box).forEach(b => b.addEventListener("click", () => { Checkout.detail = b.dataset.id; renderMetode(); }));
  $$(".js-pilih-ew", box).forEach(b => b.addEventListener("click", () => { Checkout.detail = b.dataset.id; renderMetode(); }));
  $$(".js-salin", box).forEach(b => b.addEventListener("click", () => salin(b.dataset.nomor)));
}

// Salin nomor ke clipboard
function salin(nomor) {
  const bersih = nomor.replace(/[\s-]/g, "");
  const ok = () => toast(`Nomor ${nomor} berhasil disalin`, "📋");
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(bersih).then(ok, fallback); else fallback();
  function fallback() { const t = document.createElement("textarea"); t.value = bersih; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); } catch (e) {} t.remove(); ok(); }
}

// QR simulasi (bukan QR asli) — pola acak berdasarkan total belanja
function buatQR(seed) {
  const n = 25, sel = 8; let s = seed || 1;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const finder = (x, y) => (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  const isiFinder = (x, y) => { const lx = x % (n - 7 + (x >= n - 7 ? 0 : 0)); const ax = x < 7 ? x : x - (n - 7), ay = y < 7 ? y : y - (n - 7); return ax === 0 || ax === 6 || ay === 0 || ay === 6 || (ax >= 2 && ax <= 4 && ay >= 2 && ay <= 4); };
  let r = "";
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const hitam = finder(x, y) ? isiFinder(x, y) : rnd() > .52;
    if (hitam) r += `<rect x="${x * sel}" y="${y * sel}" width="${sel}" height="${sel}"/>`;
  }
  return `<svg viewBox="0 0 ${n * sel} ${n * sel}" fill="#1A1A1A" shape-rendering="crispEdges">${r}</svg>`;
}

function bukaQRIS() {
  if (!Cart.jumlah()) return toast("Keranjang masih kosong", "⚠");
  $("#qr-box").innerHTML = buatQR(totalAkhir());
  $("#qris-total").textContent = rupiah(totalAkhir());
  let sisa = KONFIG.batasBayarMenit * 60;
  const tampil = () => { $("#qris-timer").textContent = String(Math.floor(sisa / 60)).padStart(2, "0") + ":" + String(sisa % 60).padStart(2, "0"); };
  clearInterval(Checkout.timer); tampil();
  Checkout.timer = setInterval(() => {
    sisa--; tampil();
    if (sisa <= 0) { clearInterval(Checkout.timer); tutupQRIS(); toast("Waktu pembayaran QRIS habis", "⏰"); }
  }, 1000);
  $("#modal-qris").classList.add("buka");
}
function tutupQRIS() { clearInterval(Checkout.timer); $("#modal-qris").classList.remove("buka"); }

// Validasi form lalu susun pesan WhatsApp
function konfirmasiWA() {
  if (!Cart.jumlah()) return toast("Keranjang masih kosong", "⚠");
  const f = $("#form-checkout"); let valid = true;
  ["nama", "hp", "alamat"].forEach(n => {
    const field = f.elements[n].closest(".field"), kosong = !f.elements[n].value.trim();
    field.classList.toggle("invalid", kosong); if (kosong) valid = false;
  });
  const hp = f.elements.hp.value.replace(/\D/g, "");
  if (hp && hp.length < 9) { f.elements.hp.closest(".field").classList.add("invalid"); valid = false; }
  if (!valid) { toast("Lengkapi data pengiriman dulu ya", "⚠"); f.elements.nama.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
  if (!Checkout.metode) return toast("Pilih metode pembayaran dulu", "⚠");
  if (Checkout.metode === "va" && !Checkout.detail) return toast("Pilih bank (BCA/Mandiri/BRI) dulu", "⚠");
  if (Checkout.metode === "ewallet" && !Checkout.detail) return toast("Pilih e-wallet dulu", "⚠");

  const kirim = KONFIG.pengiriman.find(x => x.id === Checkout.pengirimanId);
  const namaMetode = { qris: "QRIS", va: `Transfer Bank VA ${Checkout.detail}`, ewallet: `E-Wallet ${Checkout.detail}`, cod: "COD (Bayar di Tempat)" }[Checkout.metode];
  const baris = Cart.ambil().map((it, i) => {
    const p = cariProduk(it.id);
    return `${i + 1}. ${p.nama}\n   Warna: ${it.warna}${it.catatan ? `\n   Custom/Catatan: ${it.catatan}` : ""}\n   ${it.qty} x ${rupiah(p.harga)} = ${rupiah(p.harga * it.qty)}`;
  }).join("\n");
  const pesan = `Halo ${KONFIG.namaToko}! Saya mau pesan:\n\n*PESANAN*\n${baris}\n\nSubtotal: ${rupiah(Cart.subtotal())}\nOngkir: ${kirim.ongkir ? rupiah(kirim.ongkir) : "Gratis"} (${kirim.nama})\n*TOTAL: ${rupiah(totalAkhir())}*\n\n*DATA PENERIMA*\nNama: ${f.elements.nama.value.trim()}\nNo. HP: ${f.elements.hp.value.trim()}\nAlamat: ${f.elements.alamat.value.trim()}${f.elements.catatan.value.trim() ? `\nCatatan: ${f.elements.catatan.value.trim()}` : ""}\n\n*PEMBAYARAN*\n${namaMetode}\n\nTerima kasih!`;

  window.open(`https://wa.me/${KONFIG.noWA}?text=${encodeURIComponent(pesan)}`, "_blank");
  $("#modal-sukses").classList.add("buka");
  Cart.kosongkan();
}

/* ---------- 5E. HALAMAN TENTANG & KONTAK ---------- */
function initKontak() {
  const s = KONFIG.sosial;
  $("#sosial").innerHTML = [
    ["📸", "Instagram", "@kichau.id", s.instagram], ["🎵", "TikTok", "@kichau.id", s.tiktok],
    ["🛍", "Shopee", "Kichau Official", s.shopee], ["🛒", "Tokopedia", "Kichau Store", s.tokopedia]
  ].map(([i, n, h, u]) => `<a class="kartu-sosial reveal" href="${u}" target="_blank" rel="noopener"><span class="ikon">${i}</span><b>${n}</b><small>${h}</small></a>`).join("");
  $("#k-wa").href = `https://wa.me/${KONFIG.noWA}`; $("#k-wa-teks").textContent = KONFIG.noWATampil;
  $("#k-email").href = `mailto:${KONFIG.email}`; $("#k-email-teks").textContent = KONFIG.email;
  $("#k-alamat").textContent = KONFIG.alamat; $("#k-jam").textContent = KONFIG.jamLayanan;

  // Formulir pesan -> dikirim lewat WhatsApp
  $("#form-pesan").addEventListener("submit", e => {
    e.preventDefault(); const f = e.target;
    const teks = `Halo ${KONFIG.namaToko}!\nNama: ${f.nama.value}\nEmail: ${f.email.value}\n\n${f.pesan.value}`;
    window.open(`https://wa.me/${KONFIG.noWA}?text=${encodeURIComponent(teks)}`, "_blank");
    toast("Pesan disiapkan di WhatsApp", "💬"); f.reset();
  });
}

/* ---------- INISIALISASI: jalankan fungsi sesuai halaman ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderLayout();
  const inisial = { beranda: initBeranda, katalog: initKatalog, detail: initDetail, keranjang: initKeranjang, kontak: initKontak };
  inisial[document.body.dataset.page]?.();
  initReveal();
});
