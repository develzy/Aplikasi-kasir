# 📤 Panduan Upload Manual ke Cloudflare Pages

## 🎯 Langkah-langkah Upload Manual

### 1. **Buka Cloudflare Pages Dashboard**

1. Buka: https://dash.cloudflare.com/
2. Klik **Workers & Pages** di sidebar
3. Klik project **kas-umkm**
4. Klik **Create deployment** atau **Upload assets**

### 2. **Siapkan Folder untuk Upload**

Anda akan upload folder `.next` yang sudah di-build. Tapi untuk Cloudflare Pages, kita perlu struktur khusus.

**PENTING**: Karena `@cloudflare/next-on-pages` tidak bisa berjalan di Windows, kita akan upload build Next.js standar dan konfigurasi manual.

### 3. **Cara Upload**

Di halaman Cloudflare Pages:

1. **Pilih "Direct Upload"** atau **"Upload assets"**
2. **Drag & drop** folder `.next/standalone` atau pilih folder
3. Atau **zip folder** `.next` dan upload file zip

### 4. **Konfigurasi Setelah Upload**

Setelah upload, Anda perlu:

#### A. **Tambahkan D1 Binding**
1. Buka **Settings** > **Functions**
2. Di **D1 database bindings**, klik **Add binding**:
   - Variable name: `DB`
   - D1 database: `kaszy-db`
3. Klik **Save**

#### B. **Verifikasi Environment Variables**
Environment variables sudah ada di `wrangler.json`:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Tapi untuk manual upload, Anda mungkin perlu tambahkan manual di:
**Settings** > **Environment variables** > **Add variable**

## ⚠️ **Catatan Penting**

**Masalah dengan Upload Manual:**
- Next.js App Router dengan Edge Runtime membutuhkan build khusus untuk Cloudflare
- Upload folder `.next` langsung **TIDAK AKAN BEKERJA** karena Next.js perlu adapter khusus
- Cloudflare Pages butuh static output atau Workers format

## 🔧 **Solusi Alternatif: GitHub Integration**

Karena build tool tidak bisa jalan di Windows, **cara TERBAIK** adalah:

### **Opsi A: GitHub Integration (RECOMMENDED)**

Dari screenshot yang Anda kirim, saya lihat ada form **"Set up builds and deployments"**.

Isi form tersebut dengan:

1. **Project name**: `kas-umkm` (atau sesuai keinginan)
2. **Production branch**: `master`
3. **Framework preset**: `None` (pilih manual)
4. **Build command**: 
   ```
   npx @cloudflare/next-on-pages@1
   ```
5. **Build output directory**: 
   ```
   .vercel/output/static
   ```
6. **Root directory**: (kosongkan atau `/`)

7. **Environment variables** (klik "Add variable"):
   - Name: `CLOUDINARY_CLOUD_NAME`, Value: `dkwaosfda`
   - Name: `CLOUDINARY_API_KEY`, Value: `125821454392665`
   - Name: `CLOUDINARY_API_SECRET`, Value: `MP8kWCxdzlXl3UyxzKQJLcXQRNc`

8. Klik **"Save and Deploy"**

**Keuntungan:**
- ✅ Build berjalan di server Linux Cloudflare (tidak ada masalah Windows)
- ✅ Otomatis deploy setiap push ke GitHub
- ✅ Tidak perlu upload manual lagi
- ✅ Bisa rollback jika ada masalah

### **Opsi B: Wrangler CLI (Jika GitHub tidak tersedia)**

Jika benar-benar tidak bisa pakai GitHub, gunakan Wrangler CLI:

```bash
# Di Git Bash
cd /d/KasZy

# Deploy langsung (tanpa build @cloudflare/next-on-pages)
npx wrangler pages deploy .next --project-name=kas-umkm
```

**Tapi ini mungkin tidak akan bekerja** karena Next.js App Router + Edge Runtime butuh adapter khusus.

## 🎯 **Rekomendasi Final**

Berdasarkan screenshot Anda, sepertinya Anda sedang di halaman **"Set up builds and deployments"** untuk GitHub integration.

**Saya SANGAT REKOMENDASIKAN** Anda isi form tersebut dengan konfigurasi yang saya berikan di atas (Opsi A).

Ini adalah cara **TERMUDAH** dan **PALING RELIABLE** karena:
1. Build berjalan di server Cloudflare (Linux)
2. Tidak ada masalah Windows
3. Otomatis setiap push
4. Sudah saya push semua code ke GitHub

Apakah Anda ingin saya buatkan file konfigurasi lengkap untuk form tersebut?
