# 🚀 Panduan Deployment ke Cloudflare Pages

## ✅ Checklist Persiapan Deployment

### 1. **Repository GitHub**
- [x] Repository sudah dibuat: `https://github.com/develzy/Aplikasi-kasir.git`
- [x] Semua file sudah di-push ke GitHub
- [x] `.gitignore` sudah dikonfigurasi dengan benar

### 2. **Konfigurasi Cloudinary**
- [x] Environment variables sudah dikonfigurasi di `wrangler.json`:
  - `CLOUDINARY_CLOUD_NAME`: dkwaosfda
  - `CLOUDINARY_API_KEY`: 125821454392665
  - `CLOUDINARY_API_SECRET`: MP8kWCxdzlXl3UyxzKQJLcXQRNc
- [x] API upload logo sudah menggunakan Cloudinary (Edge-compatible)

### 3. **Database D1 - PERLU SETUP MANUAL**
⚠️ **PENTING**: D1 Database belum dibuat di Cloudflare. Anda perlu melakukan langkah berikut:

#### Langkah Setup D1 Database:

1. **Login ke Cloudflare Dashboard**
   ```bash
   npx wrangler login
   ```

2. **Buat D1 Database**
   ```bash
   npx wrangler d1 create kaszy-db
   ```
   
   Output akan memberikan `database_id`, contoh:
   ```
   [[d1_databases]]
   binding = "DB"
   database_name = "kaszy-db"
   database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   ```

3. **Update `wrangler.json`**
   Ganti `REPLACE_WITH_YOUR_D1_DATABASE_ID` dengan `database_id` yang didapat dari langkah 2.

4. **Jalankan Migrasi Database**
   ```bash
   # Migration 1: Create tables
   npx wrangler d1 execute kaszy-db --remote --file=./drizzle/0000_clean_shiva.sql
   
   # Migration 2: Add settings table
   npx wrangler d1 execute kaszy-db --remote --file=./drizzle/0001_large_blink.sql
   
   # Migration 3: Add logo_url column
   npx wrangler d1 execute kaszy-db --remote --file=./drizzle/0002_add_logo_url.sql
   ```

5. **Verifikasi Database**
   ```bash
   npx wrangler d1 execute kaszy-db --remote --command="SELECT name FROM sqlite_master WHERE type='table';"
   ```

### 4. **Deployment ke Cloudflare Pages**

#### Opsi A: Deployment via GitHub (Recommended)

1. **Login ke Cloudflare Dashboard**
   - Buka: https://dash.cloudflare.com/
   - Pilih akun Anda

2. **Buat Pages Project**
   - Klik **Workers & Pages** di sidebar
   - Klik **Create Application** > **Pages** > **Connect to Git**
   - Pilih repository: `develzy/Aplikasi-kasir`
   - Klik **Begin setup**

3. **Konfigurasi Build Settings**
   - **Project name**: `kas-umkm` (atau nama lain)
   - **Production branch**: `master`
   - **Framework preset**: `Next.js`
   - **Build command**: `npx @cloudflare/next-on-pages@1`
   - **Build output directory**: `.vercel/output/static`

4. **Environment Variables**
   Tambahkan di **Environment variables** section:
   ```
   CLOUDINARY_CLOUD_NAME = dkwaosfda
   CLOUDINARY_API_KEY = 125821454392665
   CLOUDINARY_API_SECRET = MP8kWCxdzlXl3UyxzKQJLcXQRNc
   ```

5. **Binding D1 Database**
   - Setelah project dibuat, buka **Settings** > **Functions**
   - Di bagian **D1 database bindings**, klik **Add binding**
   - Variable name: `DB`
   - D1 database: Pilih `kaszy-db`
   - Klik **Save**

6. **Deploy**
   - Klik **Save and Deploy**
   - Tunggu proses build selesai (±3-5 menit)

#### Opsi B: Deployment via Wrangler CLI

```bash
# 1. Login
npx wrangler login

# 2. Deploy
npx wrangler pages deploy .vercel/output/static --project-name=kas-umkm

# 3. Set environment variables
npx wrangler pages secret put CLOUDINARY_CLOUD_NAME --project-name=kas-umkm
# (masukkan: dkwaosfda)

npx wrangler pages secret put CLOUDINARY_API_KEY --project-name=kas-umkm
# (masukkan: 125821454392665)

npx wrangler pages secret put CLOUDINARY_API_SECRET --project-name=kas-umkm
# (masukkan: MP8kWCxdzlXl3UyxzKQJLcXQRNc)
```

## 📋 Status Kesiapan

| Komponen | Status | Keterangan |
|----------|--------|------------|
| Source Code | ✅ Siap | Semua fitur sudah diimplementasi |
| GitHub Repo | ✅ Siap | Sudah di-push ke GitHub |
| Cloudinary Config | ✅ Siap | API keys sudah dikonfigurasi |
| D1 Database | ⚠️ **Perlu Setup** | Harus dibuat manual di Cloudflare |
| Environment Vars | ✅ Siap | Sudah ada di wrangler.json |
| Build Config | ✅ Siap | next.config.ts sudah dikonfigurasi |
| Migrations | ✅ Siap | SQL files sudah tersedia |

## ⚠️ Yang Harus Dilakukan Sebelum Deploy

1. **WAJIB**: Buat D1 Database di Cloudflare (lihat langkah di atas)
2. **WAJIB**: Update `database_id` di `wrangler.json`
3. **WAJIB**: Jalankan migrasi database (3 file SQL)
4. **OPSIONAL**: Test build lokal terlebih dahulu:
   ```bash
   npm run build
   ```

## 🔧 Troubleshooting

### Build Error: "Cannot find module '@cloudflare/next-on-pages'"
```bash
npm install
```

### Database Error: "D1_ERROR: no such table: products"
Jalankan migrasi database (lihat langkah 4 di Setup D1 Database)

### Upload Error: "Cloudinary config missing"
Pastikan environment variables sudah di-set di Cloudflare Pages dashboard

## 📞 Support

Jika ada masalah:
1. Cek build logs di Cloudflare Pages dashboard
2. Cek function logs di **Workers & Pages** > **Your Project** > **Logs**
3. Verifikasi D1 database sudah terbinding dengan benar

## 🎉 Setelah Deploy Berhasil

1. Buka URL yang diberikan Cloudflare (contoh: `kas-umkm.pages.dev`)
2. Akan redirect ke `/onboarding` (karena belum ada logo toko)
3. Upload logo toko Anda
4. Mulai gunakan aplikasi!

---

**Catatan Keamanan**: 
- Jangan commit `.env` atau file yang berisi secret keys
- Gunakan Cloudflare Pages environment variables untuk production
- Rotate API keys secara berkala
