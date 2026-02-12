# 🚀 Setup GitHub Actions untuk Auto-Deploy

Saya telah membuat GitHub Actions workflow yang akan **otomatis build dan deploy** aplikasi Anda ke Cloudflare Pages setiap kali Anda push ke GitHub!

## 📋 Yang Perlu Anda Lakukan

### 1. **Dapatkan Cloudflare API Token**

1. Buka: https://dash.cloudflare.com/profile/api-tokens
2. Klik **"Create Token"**
3. Pilih template **"Edit Cloudflare Workers"** atau buat custom dengan permissions:
   - Account > Cloudflare Pages > Edit
   - Account > D1 > Edit  
4. Klik **"Continue to summary"** > **"Create Token"**
5. **COPY TOKEN** (hanya ditampilkan sekali!)

### 2. **Dapatkan Cloudflare Account ID**

1. Buka: https://dash.cloudflare.com/
2. Pilih domain/account Anda
3. Scroll ke bawah di sidebar kanan
4. Copy **"Account ID"**

### 3. **Tambahkan Secrets di GitHub**

1. Buka repository: https://github.com/develzy/Aplikasi-kasir
2. Klik **Settings** (tab di atas)
3. Klik **Secrets and variables** > **Actions** (di sidebar kiri)
4. Klik **"New repository secret"**
5. Tambahkan 2 secrets:

   **Secret 1:**
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: (paste token dari langkah 1)
   - Klik **"Add secret"**

   **Secret 2:**
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: (paste account ID dari langkah 2)
   - Klik **"Add secret"**

### 4. **Push Workflow ke GitHub**

Saya akan push workflow file sekarang. Setelah itu, deployment akan otomatis berjalan!

## ✨ Cara Kerja

Setelah setup selesai:
- ✅ Setiap kali Anda `git push` ke branch `master`
- ✅ GitHub Actions akan otomatis:
  1. Install dependencies
  2. Build Next.js
  3. Convert ke Cloudflare Pages format
  4. Deploy ke `kas-umkm.pages.dev`
- ✅ Anda bisa lihat progress di tab **Actions** di GitHub

## 🎯 Keuntungan

- ✅ Tidak perlu install Git Bash atau WSL
- ✅ Build berjalan di Linux (tidak ada masalah Windows)
- ✅ Otomatis deploy setiap push
- ✅ Bisa lihat log build jika ada error
- ✅ Rollback mudah jika ada masalah

## 📝 Catatan Penting

Setelah deployment pertama berhasil via GitHub Actions, Anda masih perlu **menambahkan D1 Binding** di Cloudflare Dashboard:

1. Buka: https://dash.cloudflare.com/
2. Pilih **Workers & Pages** > **kas-umkm**
3. Klik **Settings** > **Functions**
4. Di bagian **D1 database bindings**, klik **Add binding**:
   - Variable name: `DB`
   - D1 database: `kaszy-db`
5. Klik **Save**

Environment variables (Cloudinary) sudah ada di `wrangler.json` jadi tidak perlu ditambahkan manual.

## 🚀 Siap Deploy!

Setelah Anda setup secrets di GitHub, saya akan push workflow file dan deployment akan otomatis dimulai!
