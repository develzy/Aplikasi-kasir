# Panduan Deploy Manual ke Cloudflare Pages

## ⚠️ Masalah yang Dihadapi

Tool `@cloudflare/next-on-pages` membutuhkan **bash** yang tidak tersedia di Windows native. Ada beberapa solusi:

## 🔧 Solusi 1: Install Git Bash (RECOMMENDED)

1. **Download Git for Windows**: https://git-scm.com/download/win
2. **Install dengan opsi "Git Bash"**
3. **Buka Git Bash** (bukan PowerShell/CMD)
4. **Jalankan command**:
   ```bash
   cd /d/KasZy
   npx @cloudflare/next-on-pages@1
   npx wrangler pages deploy .vercel/output/static --project-name=kas-umkm
   ```

## 🔧 Solusi 2: Deploy via Cloudflare Dashboard dengan Direct Upload

Karena tidak ada opsi GitHub di dashboard Anda, gunakan **Direct Upload**:

### Langkah-langkah:

1. **Build aplikasi terlebih dahulu** (sudah dilakukan ✅)

2. **Install Git Bash** atau **WSL** untuk menjalankan build tool

3. **Atau, gunakan Cloudflare Dashboard untuk Direct Upload**:
   - Buka: https://dash.cloudflare.com/
   - Pilih **Workers & Pages**
   - Klik project **kas-umkm**
   - Klik **Create deployment** atau **Upload assets**
   - Upload folder `.vercel/output/static` (setelah build berhasil)

## 🔧 Solusi 3: Setup GitHub Integration Manual

Jika opsi GitHub tidak muncul, coba:

1. **Buka Cloudflare Dashboard**: https://dash.cloudflare.com/
2. **Pilih Workers & Pages**
3. **Klik "Create Application"** (bukan yang sudah ada)
4. **Pilih "Pages"**
5. **Pilih "Connect to Git"**
6. **Authorize Cloudflare** untuk akses GitHub
7. **Pilih repository**: `develzy/Aplikasi-kasir`
8. **Konfigurasi build**:
   ```
   Build command: npx @cloudflare/next-on-pages@1
   Build output directory: .vercel/output/static
   Root directory: (kosongkan)
   ```

9. **Tambahkan Environment Variables**:
   ```
   CLOUDINARY_CLOUD_NAME = dkwaosfda
   CLOUDINARY_API_KEY = 125821454392665
   CLOUDINARY_API_SECRET = MP8kWCxdzlXl3UyxzKQJLcXQRNc
   ```

10. **Tambahkan D1 Binding**:
    - Buka **Settings** > **Functions**
    - Klik **Add binding** di **D1 database bindings**
    - Variable name: `DB`
    - D1 database: `kaszy-db`

11. **Deploy!**

## 🔧 Solusi 4: Menggunakan WSL (Windows Subsystem for Linux)

Jika Anda punya WSL:

```bash
# Di WSL terminal
cd /mnt/d/KasZy
npm run build
npx @cloudflare/next-on-pages@1
npx wrangler pages deploy .vercel/output/static --project-name=kas-umkm
```

## 📋 Status Saat Ini

✅ D1 Database sudah dibuat dan migrasi selesai
✅ Cloudflare Pages project `kas-umkm` sudah dibuat  
✅ Code sudah di-push ke GitHub
✅ Next.js build sudah selesai
⚠️ Perlu tool bash untuk convert build ke Cloudflare format

## 🎯 Rekomendasi

**Cara termudah**: Install **Git Bash** (5 menit), lalu jalankan:

```bash
cd /d/KasZy
npx @cloudflare/next-on-pages@1
npx wrangler pages deploy .vercel/output/static --project-name=kas-umkm
```

Atau gunakan **GitHub Integration** di Cloudflare Dashboard (otomatis build setiap push).

## 📞 Bantuan Lebih Lanjut

Jika masih ada masalah, beri tahu saya:
1. Apakah Anda punya Git Bash atau WSL?
2. Apakah Anda bisa lihat opsi "Connect to Git" di Cloudflare Dashboard?
3. Atau Anda prefer saya buatkan GitHub Actions workflow untuk auto-deploy?
