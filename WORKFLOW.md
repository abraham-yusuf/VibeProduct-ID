# 🔄 WORKFLOW.md — Development & Business Workflow

**Proyek:** Vibe Product ID  
**Terakhir diperbarui:** 2025

---

## 1. Development Workflow

### 1.1 Git Branch Strategy

```
main                    # Production branch (auto-deploy ke Vercel)
├── develop             # Integration branch
│   ├── feat/smm-panel
│   ├── feat/wedding
│   ├── feat/affiliate
│   ├── feat/blog
│   ├── feat/ideathon
│   └── fix/[nama-bug]
```

### 1.2 Naming Convention Branch

```
feat/[nama-fitur]       # Fitur baru
fix/[nama-bug]          # Bug fix
chore/[nama-task]       # Task non-fitur (update deps, config)
refactor/[nama]         # Refactor kode
```

### 1.3 Commit Message Convention

Ikuti format **Conventional Commits**:

```
feat(smm): tambah halaman order paket
fix(auth): perbaiki redirect setelah login
chore(deps): update drizzle-orm ke v0.32
refactor(blog): pisahkan komponen editor
docs(readme): update instruksi instalasi
```

### 1.4 Alur Development Fitur Baru

```
1. Buat branch dari develop
   git checkout -b feat/nama-fitur

2. Definisikan schema DB terlebih dahulu
   → lib/db/schema/[modul].ts

3. Push schema ke database
   pnpm db:push

4. Buat API route / Server Action

5. Buat komponen UI

6. Test manual di localhost

7. Commit & push

8. Merge ke develop

9. Deploy ke production via merge develop → main
```

---

## 2. Folder & File Creation Workflow

### Saat Membuat Modul Baru, Urutan Pembuatan File:

```
1. lib/db/schema/[modul].ts          ← Schema Drizzle
2. lib/db/index.ts                   ← Export schema baru
3. lib/validations/[modul].ts        ← Zod schemas
4. lib/actions/[modul].ts            ← Server Actions
5. app/api/[modul]/route.ts          ← API Routes (jika perlu)
6. components/[modul]/               ← Komponen UI modul
7. app/(public)/[modul]/page.tsx     ← Halaman publik
8. app/dashboard/[modul]/page.tsx    ← Halaman dashboard
```

---

## 3. Business Workflow

### 3.1 Alur Order SMM Panel

```
Pengunjung
    │
    ▼
Lihat katalog paket (filter platform)
    │
    ▼
Pilih paket → Isi form order
(nama, email, no HP, username/URL target, catatan)
    │
    ▼
Konfirmasi order → Klik "Bayar Sekarang"
    │
    ▼
Midtrans Snap popup → User bayar
    │
    ├─ Berhasil ──▶ Status: PAID
    │                    │
    │                    ▼
    │              Notifikasi email ke Admin
    │                    │
    │                    ▼
    │              Admin terima notifikasi
    │                    │
    │                    ▼
    │              Admin order manual di SMM panel pihak ketiga
    │                    │
    │                    ▼
    │              Admin update status → PROCESSING
    │                    │
    │                    ▼
    │              Layanan selesai → Admin update → COMPLETED
    │
    └─ Gagal/Cancel ──▶ Status: FAILED / CANCELLED
```

### 3.2 Alur Order Wedding Invitation

```
Pengunjung
    │
    ▼
Lihat galeri tema → Filter kategori
    │
    ▼
Klik tema → Lihat preview demo (iframe fullscreen)
    │
    ▼
Klik "Pesan via WhatsApp"
    │
    ▼
WhatsApp terbuka dengan pesan otomatis:
"Halo, saya tertarik dengan tema [Nama Tema] seharga [Harga].
Boleh info lebih lanjut?"
    │
    ▼
Admin negosiasi & closing via WhatsApp (manual)
    │
    ▼
Admin buat undangan di platform pihak ketiga
    │
    ▼
Kirim link undangan ke klien
```

### 3.3 Alur Penerbitan Blog Post

```
Admin masuk dashboard
    │
    ▼
Blog → New Post
    │
    ├─ Tulis manual dengan Tiptap editor
    │
    └─ AI Generate:
        │
        ▼
        Isi: topik, panjang, nada, bahasa
        Pilih: provider AI (OpenAI/Anthropic/OpenRouter)
        Klik "Generate"
        │
        ▼
        AI menghasilkan draft artikel
        │
        ▼
        Admin review & edit
    │
    ▼
Sisipkan: affiliate link, slot Adsense (opsional)
    │
    ▼
Isi SEO fields (meta title, description, OG image)
    │
    ▼
Set status: Draft / Published / Scheduled
    │
    ▼
Publish → Artikel tampil di /blog
```

### 3.4 Alur Manajemen Affiliate Link

```
Admin masuk dashboard → Affiliate
    │
    ▼
Tambah link affiliate:
- Judul produk
- Platform (Shopee/Tokopedia/TikTok Shop)
- URL affiliate
- Thumbnail produk
- Tag (untuk filtering)
    │
    ▼
Affiliate tersimpan di database
    │
    ▼
Dipanggil di modul lain:
├── Blog Editor → tombol "Insert Affiliate" → pilih produk → tampil sebagai card
├── Ideathon Editor → sama seperti Blog
└── Docs Editor → sama seperti Blog
```

---

## 4. Deployment Workflow

### 4.1 Development ke Production

```
Local Development (localhost:3000)
    │
    ▼ git push origin feat/xxx
GitHub Repository
    │
    ▼ Pull Request → merge ke develop
Vercel Preview Deployment (auto)
    │
    ▼ Test di preview URL
    │
    ▼ merge develop → main
Vercel Production Deployment (auto)
    │
    ▼
vibeproduct.biz.id (Live)
```

### 4.2 Database Migration Workflow

```
1. Edit schema di lib/db/schema/[modul].ts
2. Jalankan: pnpm db:push (development)
   atau: pnpm db:generate + pnpm db:migrate (production)
3. Verifikasi di Drizzle Studio: pnpm db:studio
```

---

## 5. Monitoring & Maintenance

| Task | Frekuensi | Tools |
|------|-----------|-------|
| Cek order masuk | Harian | Dashboard + Email notifikasi |
| Update status order | Harian | Dashboard SMM |
| Backup database | Mingguan | Neon auto-backup |
| Update dependencies | Bulanan | `pnpm update` |
| Review Adsense performa | Bulanan | Google Adsense dashboard |
| Review affiliate performa | Bulanan | Masing-masing platform |
| Posting blog baru | 2–3x/minggu | Dashboard Blog |
