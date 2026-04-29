# 📋 PRD.md — Product Requirements Document

**Produk:** Vibe Product ID  
**Domain:** vibeproduct.biz.id  
**Versi:** 1.0.0  
**Tanggal:** 2025  
**Owner:** Solo Founder  

---

## 1. Ringkasan Eksekutif

Vibe Product ID adalah platform bisnis digital multi-layanan yang ditargetkan untuk pasar Indonesia. Platform ini memungkinkan owner untuk mengelola beberapa lini bisnis digital dalam satu dashboard terpusat, dengan model bisnis yang mencakup reseller SMM, jasa undangan digital, affiliate marketing, dan monetisasi konten.

---

## 2. Tujuan Produk

| Tujuan | Metrik Sukses |
|--------|---------------|
| Menjual layanan SMM sebagai reseller | Minimal 10 order/bulan dalam 3 bulan pertama |
| Menjual jasa wedding invitation | Minimal 3 klien/bulan |
| Monetisasi blog via Adsense & affiliate | Pendapatan pasif > Rp 500.000/bulan |
| Mengurangi waktu manajemen manual | Semua order terdokumentasi di sistem |

---

## 3. Target Pengguna

### Pengunjung Publik
- Calon pembeli layanan SMM (usia 17–35, pengguna aktif media sosial)
- Calon klien undangan pernikahan (pasangan yang akan menikah)
- Pembaca blog & konten Ideathon

### Admin (Owner)
- Solo founder yang mengelola semua layanan
- Membutuhkan dashboard yang cepat dan efisien
- Tidak memiliki tim teknis

---

## 4. Spesifikasi Modul

---

### 4.1 Modul SMM Panel

**Deskripsi:** Halaman penjualan layanan sosial media marketing. Owner menjual paket sebagai reseller dari provider pihak ketiga.

**User Stories:**
- Sebagai pengunjung, saya ingin melihat daftar paket berdasarkan platform (Instagram, TikTok, YouTube, dll.)
- Sebagai pengunjung, saya ingin melakukan order dan membayar secara online
- Sebagai admin, saya ingin menambah/edit/hapus paket layanan
- Sebagai admin, saya ingin melihat semua order yang masuk beserta status pembayarannya
- Sebagai admin, saya ingin mengupdate status order secara manual

**Acceptance Criteria:**
- [ ] Halaman publik menampilkan paket yang aktif, difilter per platform
- [ ] Form order meminta: username/URL target, jumlah, catatan
- [ ] Integrasi Midtrans Snap untuk pembayaran
- [ ] Status order: Pending → Paid → Processing → Completed/Failed
- [ ] Admin dapat export data order ke CSV
- [ ] Notifikasi email ke admin saat order baru masuk

**Data Model:**
```
smm_categories: id, name, platform, icon, sort_order
smm_packages: id, category_id, name, description, price, min_qty, max_qty, is_active
smm_orders: id, package_id, target_url, quantity, total_price, status, payment_id, buyer_name, buyer_email, buyer_phone, notes, created_at
```

---

### 4.2 Modul Wedding Invitation

**Deskripsi:** Showcase tema undangan pernikahan digital dengan sistem demo embed.

**User Stories:**
- Sebagai pengunjung, saya ingin melihat galeri tema undangan
- Sebagai pengunjung, saya ingin melihat demo langsung (preview fullscreen) dari setiap tema
- Sebagai pengunjung, saya ingin memesan via tombol WhatsApp
- Sebagai admin, saya ingin mengelola daftar tema (tambah/edit/nonaktifkan)

**Acceptance Criteria:**
- [ ] Grid tampilan tema dengan thumbnail, nama, kategori, dan harga
- [ ] Filter berdasarkan kategori: Minimalis, Modern, Islami, Rustic, Royal
- [ ] Modal/halaman preview dengan iframe embed dari demo URL
- [ ] Tombol "Pesan via WhatsApp" dengan pesan otomatis
- [ ] Admin dapat mengatur urutan tampilan tema

**Data Model:**
```
wedding_themes: id, name, category, price, demo_url, thumbnail_url, description, whatsapp_msg, sort_order, is_active, created_at
```

---

### 4.3 Modul Affiliate Management

**Deskripsi:** Sistem manajemen link produk affiliate dari marketplace Indonesia, yang dapat dipanggil di modul Blog, Ideathon, dan Dokumentasi.

**User Stories:**
- Sebagai admin, saya ingin menambah link affiliate dengan detail produk
- Sebagai admin, saya ingin mengelompokkan link per platform dan per tag
- Sebagai admin, saya ingin menyisipkan produk affiliate ke dalam postingan blog/ideathon

**Acceptance Criteria:**
- [ ] CRUD link affiliate dengan field: judul, platform, URL, thumbnail, tag, status
- [ ] Komponen `<AffiliateCard />` dan `<AffiliateGrid />` yang reusable
- [ ] Di editor Blog/Ideathon, tersedia tombol "Insert Affiliate" yang membuka modal pilihan produk
- [ ] Filter berdasarkan platform: Shopee, Tokopedia, TikTok Shop

**Data Model:**
```
affiliate_links: id, title, platform, url, thumbnail_url, description, tags (array), is_active, click_count, created_at
```

---

### 4.4 Modul Blog

**Deskripsi:** Platform blog dengan editor rich text, fitur AI auto-generate konten, dan monetisasi Google Adsense.

**User Stories:**
- Sebagai admin, saya ingin menulis artikel dengan editor yang kaya fitur
- Sebagai admin, saya ingin generate draft artikel menggunakan AI (pilih provider sendiri)
- Sebagai admin, saya ingin mengatur penempatan iklan Adsense di artikel
- Sebagai pembaca, saya ingin membaca artikel yang SEO-friendly

**Acceptance Criteria:**
- [ ] Editor Tiptap dengan fitur: heading, bold, italic, list, image, link, code block
- [ ] Tombol "AI Generate" dengan modal pilihan: topik, panjang artikel, nada tulisan, bahasa
- [ ] Pengaturan AI provider di Settings: pilih OpenAI/Anthropic/OpenRouter + masukkan API key
- [ ] Slot Adsense yang dapat dikonfigurasi: posisi header, di dalam konten, footer
- [ ] SEO fields: meta title, meta description, OG image
- [ ] Status: Draft, Published, Scheduled
- [ ] Kategori dan tag

**Data Model:**
```
blog_categories: id, name, slug
blog_posts: id, title, slug, content, excerpt, thumbnail, category_id, tags, status, meta_title, meta_desc, og_image, adsense_enabled, published_at, created_at
ai_settings: id, provider, api_key, model, is_active
```

---

### 4.5 Modul Documentation

**Deskripsi:** Halaman dokumentasi cara penggunaan platform Vibe Product ID, dapat disisipkan affiliate link dan Adsense.

**User Stories:**
- Sebagai admin, saya ingin membuat halaman dokumentasi dengan struktur hierarki
- Sebagai admin, saya ingin menyisipkan affiliate produk dan iklan di dalam dokumentasi
- Sebagai pengguna, saya ingin menavigasi dokumentasi dengan mudah

**Acceptance Criteria:**
- [ ] Sidebar navigasi dengan struktur Kategori → Halaman
- [ ] Editor rich text (Tiptap) untuk konten setiap halaman
- [ ] Komponen insert affiliate link
- [ ] Slot Adsense opsional
- [ ] Search docs

**Data Model:**
```
docs_categories: id, name, slug, sort_order
docs_pages: id, category_id, title, slug, content, adsense_enabled, sort_order, created_at
```

---

### 4.6 Modul Ideathon

**Deskripsi:** Kurasi ide bisnis dalam bentuk artikel dan embed video dari berbagai platform.

**User Stories:**
- Sebagai admin, saya ingin memposting ide bisnis dengan teks dan/atau embed video
- Sebagai admin, saya ingin menyisipkan produk affiliate terkait ke dalam ide
- Sebagai pembaca, saya ingin menjelajahi ide berdasarkan kategori

**Acceptance Criteria:**
- [ ] Support embed video: YouTube, TikTok, Facebook, Instagram Reels
- [ ] Editor konten dengan insert affiliate dan Adsense
- [ ] Kategori dan tag ide
- [ ] Tampilan publik seperti feed/grid yang menarik
- [ ] SEO-friendly

**Data Model:**
```
ideathon_categories: id, name, slug
ideathon_posts: id, title, slug, content, embed_url, embed_type, thumbnail, category_id, tags, adsense_enabled, published_at, created_at
```

---

## 5. Kebutuhan Non-Fungsional

| Kategori | Kebutuhan |
|----------|-----------|
| Performa | Halaman publik LCP < 2.5 detik |
| Keamanan | Semua route dashboard diproteksi auth |
| SEO | Semua halaman publik memiliki meta tag lengkap |
| Responsif | Tampil optimal di mobile (375px) hingga desktop (1440px) |
| Aksesibilitas | Minimal WCAG AA untuk elemen interaktif |
| Uptime | Target 99.5% (deploy di Vercel) |

---

## 6. Out of Scope (Versi 1.0)

- ❌ Multi-user / multi-admin
- ❌ API publik untuk third party
- ❌ Aplikasi mobile native
- ❌ Sistem chat/live support terintegrasi
- ❌ Otomasi order ke SMM panel pihak ketiga (masih manual)
