# Katalog Imah Keramik Bogor

Sumber: brosur resmi (foto katalog). Semua harga dan deskripsi di bawah ini disalin persis dari brosur. Field `badge`, `tags`, dan pengelompokan tampilan adalah keputusan desain UX (bukan teks brosur) — ditandai jelas di tiap bagian.

## Info bisnis

- **Nama:** Imah Keramik Bogor
- **Tagline:** Wisata Edukasi Keramik. Mempelajari Proses Produksi & Membuat Keramik. Terbuka untuk umum, dengan reservasi.
- **Telp/WA:** +62 812-8145-417
- **Email:** imahkeramikbogor@gmail.com
- **Alamat:** Jl. Pembangunan No. 22 & 23a, RT 3/RW 5, Kedung Halang Talang, Bogor Utara 16158, Jawa Barat, Indonesia
- **Instagram:** @imahkeramikbogor

## Struktur kategori (untuk tampilan web)

- **Info Umum** — HTM, Workshop, Paket Usaha, Sewa Aula. Selalu tampil, tidak masuk tab. Sesuai brosur asli, kelompok ini tidak berada di bawah header "KERAMIK".
- **Keramik** — tab pertama (default aktif): Fun Clay, Ceramic Art Class, Glaze Coloring, Bundling 1.
- **Membatik Kayu** — tab kedua: Paket 1–4 (dikonsolidasi jadi satu tiket), Bundling 2.

---

## 1. Info Umum

### HTM (Tiket Masuk)
- **Harga:** Rp 15.000 / orang
- **Unit:** `per_orang`
- **Badge:** — (tidak ada)
- **Deskripsi (dari brosur):** Melihat proses pengolahan bahan baku, proses putar, proses mug tuang, proses dekor kerok, proses mewarna glazur celup, tungku bakar/kiln.
- **Gambar:** tidak wajib (Info Umum tidak pakai foto)

### Workshop
- **Harga:** Sesuai kelas dipilih (tidak fix)
- **Unit:** `kustom`
- **Badge (UX):** Kustom
- **Deskripsi (dari brosur):** Transportasi & akomodasi di luar harga kelas.

### Paket Usaha
- **Harga:** Rp 200.000 / orang / paket
- **Unit:** `per_paket`
- **Badge (UX):** Expert
- **Termasuk (dari brosur):** Bahan baku, 6 warna glazur, dan 2x pembakaran.
- **Catatan (dari brosur):** *Untuk expert.

### Sewa Aula
- **Harga dasar:** Rp 300.000 / 2 jam (maks. 30 orang)
- **Unit:** `per_2jam` — satuan berbeda dari tiket lain, bukan per orang
- **Badge:** — (tidak ada)
- **Biaya tambahan (dari brosur):**
  - +Rp 150.000 / jam tambahan
  - +Rp 10.000 / orang tambahan

---

## 2. Keramik

### Fun Clay
- **Harga:** Rp 75.000 / orang / sesi
- **Unit:** `per_orang`
- **Badge:** — (tidak ada)
- **Termasuk (dari brosur):** Factory visit, kelas tutorial membentuk tanah liat, alat dan bahan.
- **Gambar:** wajib

### Ceramic Art Class (CAC)
- **Harga:** Rp 200.000 / orang / sesi
- **Unit:** `per_orang`
- **Badge (UX):** Favorit — tampil sebagai hero card (ukuran lebih besar)
- **Termasuk (dari brosur):** Factory visit, kelas tutorial pembuatan keramik, alat dan bahan, 2x pembakaran, pemberian glazur 1 warna.
- **Tags (UX, ditampilkan di kartu):** Factory visit · 2x pembakaran · Glazur 1 warna
- **Gambar:** wajib

### Glaze Coloring
- **Harga:** Rp 200.000 / orang / sesi
- **Unit:** `per_orang`
- **Badge:** — (tidak ada)
- **Termasuk (dari brosur):** 1 body bisque, tutorial mewarnai glazur, beragam pilihan warna, 1x pembakaran glazur.
- **Gambar:** wajib

### Bundling 1
- **Harga:** Rp 100.000 / orang / sesi
- **Unit:** `per_orang`
- **Badge (UX):** Hemat
- **Isi (dari brosur):** Fun Clay + Membatik Paket 1
- **Gambar:** wajib
- **Catatan tampilan:** kartu full-width, style aksen beda dari tiket biasa (menandakan gabungan lintas kategori)

---

## 3. Membatik Kayu

### Paket Membatik Kayu (konsolidasi Paket 1–4)
- **Harga ditampilkan:** Rp 50.000 – Rp 150.000 / orang / sesi (range)
- **Badge (UX):** 4 pilihan
- **Termasuk semua tier (dari brosur):** Tutorial, alat dan bahan.
- **Gambar:** wajib
- **Catatan tampilan:** satu tiket, klik untuk buka modal berisi 4 tier di bawah ini.

| Tier | Harga | Produk (dari brosur) |
|---|---|---|
| Paket 1 | Rp 50.000 /orang/sesi | 1 centong, 1 warna |
| Paket 2 | Rp 75.000 /orang/sesi | 2 centong, 1 warna |
| Paket 3 | Rp 100.000 /orang/sesi | 1 pigura, 1 centong, 1 warna |
| Paket 4 | Rp 150.000 /orang/sesi | 1 talenan, 2 warna |

### Bundling 2
- **Harga:** Rp 225.000 / orang / sesi
- **Unit:** `per_orang`
- **Badge (UX):** Hemat
- **Isi (dari brosur):** CAC/GC (Ceramic Art Class atau Glaze Coloring) + Membatik Paket 1
- **Gambar:** wajib
- **Catatan tampilan:** kartu full-width, style aksen sama seperti Bundling 1

---

## 4. Data terstruktur (opsional, siap pakai untuk kode)

Sesuai tipe `Ticket` yang dipakai di spek layout — bisa langsung dijadikan seed data / JSON di project.

```json
[
  {
    "id": "htm",
    "title": "HTM (Tiket Masuk)",
    "price": "Rp 15.000",
    "unit": "per_orang",
    "badge": null,
    "image": null,
    "tags": [],
    "description": "Melihat proses pengolahan bahan baku, proses putar, proses mug tuang, proses dekor kerok, proses mewarna glazur celup, tungku bakar/kiln.",
    "tiers": null,
    "category": "info_umum",
    "featured": false
  },
  {
    "id": "workshop",
    "title": "Workshop",
    "price": "Sesuai kelas dipilih",
    "unit": "kustom",
    "badge": "kustom",
    "image": null,
    "tags": [],
    "description": "Transportasi dan akomodasi di luar harga kelas.",
    "tiers": null,
    "category": "info_umum",
    "featured": false
  },
  {
    "id": "usaha",
    "title": "Paket Usaha",
    "price": "Rp 200.000",
    "unit": "per_paket",
    "badge": "expert",
    "image": null,
    "tags": [],
    "description": "Termasuk bahan baku, 6 warna glazur, dan 2x pembakaran. Untuk peserta level expert.",
    "tiers": null,
    "category": "info_umum",
    "featured": false
  },
  {
    "id": "aula",
    "title": "Sewa Aula",
    "price": "Rp 300.000",
    "unit": "per_2jam",
    "badge": null,
    "image": null,
    "tags": ["+Rp150rb /jam", "+Rp10rb /orang"],
    "description": "Harga dasar berlaku untuk 2 jam dan maksimal 30 orang. Penambahan jam Rp150.000/jam, penambahan orang Rp10.000/orang.",
    "tiers": [
      { "name": "Tambahan jam", "price": "Rp 150.000", "detail": "per jam" },
      { "name": "Tambahan orang", "price": "Rp 10.000", "detail": "per orang" }
    ],
    "category": "info_umum",
    "featured": false
  },
  {
    "id": "funclay",
    "title": "Fun Clay",
    "price": "Rp 75.000",
    "unit": "per_orang",
    "badge": null,
    "image": "funclay.jpg",
    "tags": [],
    "description": "Termasuk: factory visit, kelas tutorial membentuk tanah liat, alat dan bahan.",
    "tiers": null,
    "category": "keramik",
    "featured": false
  },
  {
    "id": "cac",
    "title": "Ceramic Art Class",
    "price": "Rp 200.000",
    "unit": "per_orang",
    "badge": "favorit",
    "image": "cac.jpg",
    "tags": ["Factory visit", "2x pembakaran", "Glazur 1 warna"],
    "description": "Termasuk: factory visit, kelas tutorial pembuatan keramik, alat dan bahan, 2x pembakaran, pemberian glazur 1 warna.",
    "tiers": null,
    "category": "keramik",
    "featured": true,
    "gridSpan": { "cols": 2, "rows": 2 }
  },
  {
    "id": "glaze",
    "title": "Glaze Coloring",
    "price": "Rp 200.000",
    "unit": "per_orang",
    "badge": null,
    "image": "glaze.jpg",
    "tags": [],
    "description": "Termasuk: 1 body bisque, tutorial mewarnai glazur, beragam pilihan warna, 1x pembakaran glazur.",
    "tiers": null,
    "category": "keramik",
    "featured": false
  },
  {
    "id": "bundling1",
    "title": "Bundling 1",
    "price": "Rp 100.000",
    "unit": "per_orang",
    "badge": "hemat",
    "image": "bundling1.jpg",
    "tags": [],
    "description": "Gabungan Fun Clay + Membatik Paket 1 dalam satu sesi.",
    "tiers": null,
    "category": "keramik",
    "featured": false,
    "gridSpan": { "cols": 3, "rows": 1 }
  },
  {
    "id": "membatik",
    "title": "Paket Membatik Kayu",
    "price": "Rp 50.000 – Rp 150.000",
    "unit": "per_orang",
    "badge": "4_pilihan",
    "image": "membatik.jpg",
    "tags": ["Paket 1: Rp50rb", "Paket 2: Rp75rb", "Paket 3: Rp100rb", "Paket 4: Rp150rb"],
    "description": "Semua paket termasuk tutorial, alat dan bahan. Pilih tier saat reservasi.",
    "tiers": [
      { "name": "Paket 1", "price": "Rp 50.000", "detail": "1 centong, 1 warna" },
      { "name": "Paket 2", "price": "Rp 75.000", "detail": "2 centong, 1 warna" },
      { "name": "Paket 3", "price": "Rp 100.000", "detail": "1 pigura, 1 centong, 1 warna" },
      { "name": "Paket 4", "price": "Rp 150.000", "detail": "1 talenan, 2 warna" }
    ],
    "category": "membatik",
    "featured": false,
    "gridSpan": { "cols": 2, "rows": 1 }
  },
  {
    "id": "bundling2",
    "title": "Bundling 2",
    "price": "Rp 225.000",
    "unit": "per_orang",
    "badge": "hemat",
    "image": "bundling2.jpg",
    "tags": [],
    "description": "Gabungan CAC/Glaze Coloring + Membatik Paket 1 dalam satu sesi.",
    "tiers": null,
    "category": "membatik",
    "featured": false,
    "gridSpan": { "cols": 2, "rows": 1 }
  }
]
```

---

## Catatan akurasi

- Semua harga, satuan, dan isi paket di atas disalin persis dari brosur asli.
- Yang **bukan** dari brosur (murni keputusan UX untuk kebutuhan tampilan web): badge (`favorit`, `hemat`, `kustom`, `expert`, `4_pilihan`), tags/chip di tiap kartu, penggabungan Paket 1–4 jadi satu tiket, dan `gridSpan` untuk ukuran kartu di bento grid.
- Pengelompokan "Info Umum" (HTM, Workshop, Paket Usaha, Sewa Aula) mengikuti struktur brosur asli — bukan bagian dari kategori "Keramik".