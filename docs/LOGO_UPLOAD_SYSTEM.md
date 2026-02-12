# Sistem Upload Logo Toko

## 📋 Deskripsi

Sistem ini memungkinkan setiap user untuk mengupload logo toko mereka sendiri. Logo akan disimpan secara lokal di server dalam struktur folder yang terorganisir berdasarkan nama user/toko.

## 🗂️ Struktur Folder

```
public/
└── kasir/
    ├── .gitignore          # Mencegah logo masuk ke Git
    ├── README.md           # Dokumentasi folder
    ├── [username1]/        # Folder untuk user pertama
    │   └── logo.png        # Logo user pertama
    ├── [username2]/        # Folder untuk user kedua
    │   └── logo.jpg        # Logo user kedua
    └── [username3]/        # Folder untuk user ketiga
        └── logo.webp       # Logo user ketiga
```

## 🔧 Cara Kerja

### 1. Upload Logo
- User mengupload logo melalui halaman Settings
- File dikirim ke API endpoint `/api/upload-logo`
- API membuat folder dengan nama user (jika belum ada)
- Logo disimpan dengan nama `logo.[ext]`

### 2. Validasi File
- **Ukuran maksimal**: 5MB
- **Format yang didukung**: PNG, JPG, JPEG, WebP
- Validasi dilakukan di frontend dan backend

### 3. Penyimpanan
- Path: `public/kasir/[username]/logo.[ext]`
- URL akses: `/kasir/[username]/logo.[ext]`
- File lama akan tertimpa jika user upload logo baru

## 📁 File yang Terlibat

### Backend
- **`src/app/api/upload-logo/route.ts`**
  - Handler untuk upload file
  - Membuat folder user jika belum ada
  - Menyimpan file ke filesystem
  - Return URL logo

### Frontend
- **`src/app/settings/page.tsx`**
  - Form upload logo
  - Validasi file di client-side
  - Mengirim file ke API
  - Update state dengan URL logo baru

### Storage
- **`public/kasir/`**
  - Root folder untuk semua logo
  - Berisi subfolder per user
  - Tidak di-commit ke Git

## 🚀 Cara Menggunakan

### Untuk User
1. Buka halaman **Settings**
2. Klik tab **Profile Toko**
3. Klik tombol **Upload Logo**
4. Pilih file gambar (PNG/JPG/WebP, max 5MB)
5. Logo akan otomatis tersimpan dan ditampilkan

### Untuk Developer
```typescript
// Contoh mengakses logo di komponen
<img src={settings.logoUrl} alt="Logo Toko" />

// URL format: /kasir/[username]/logo.png
```

## ⚙️ Konfigurasi

### Mengubah Ukuran Maksimal
Edit di `src/app/settings/page.tsx`:
```typescript
if (file.size > 5 * 1024 * 1024) { // 5MB
    // Ubah angka 5 sesuai kebutuhan
}
```

### Menambah Format File
Edit di `src/app/settings/page.tsx`:
```typescript
const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
// Tambahkan format lain jika diperlukan
```

## 🔒 Keamanan

1. **Validasi di Frontend**: Cek ukuran dan tipe file sebelum upload
2. **Validasi di Backend**: Double-check di server
3. **Folder Terpisah**: Setiap user punya folder sendiri
4. **Tidak di Git**: Logo tidak masuk version control

## 📝 Catatan Penting

- Logo disimpan secara lokal, bukan di cloud (tidak perlu Cloudinary)
- Setiap user hanya bisa akses folder mereka sendiri
- File lama akan tertimpa saat upload logo baru
- Pastikan folder `public/kasir` memiliki permission write

## 🐛 Troubleshooting

### Logo tidak muncul
- Cek apakah folder `public/kasir/[username]` ada
- Cek permission folder (harus writable)
- Cek console browser untuk error

### Upload gagal
- Cek ukuran file (max 5MB)
- Cek format file (harus PNG/JPG/WebP)
- Cek koneksi internet
- Cek console server untuk error

### Folder tidak terbuat
- Cek permission folder `public/kasir`
- Cek apakah `fs` module berfungsi
- Cek log server untuk error detail

## 📞 Support

Jika ada masalah, cek:
1. Console browser (F12)
2. Server logs
3. File permissions
4. Disk space
