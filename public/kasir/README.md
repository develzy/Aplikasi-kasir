# Folder Kasir - Logo Toko

Folder ini digunakan untuk menyimpan logo toko dari setiap user.

## Struktur Folder

```
kasir/
├── [username1]/
│   └── logo.png
├── [username2]/
│   └── logo.jpg
└── [username3]/
    └── logo.webp
```

## Cara Kerja

1. Setiap user akan memiliki folder sendiri berdasarkan nama toko mereka
2. Logo akan disimpan dengan nama `logo.[ext]` (png/jpg/webp)
3. Jika user mengupload logo baru, file lama akan tertimpa
4. Logo dapat diakses melalui URL: `/kasir/[username]/logo.[ext]`

## Catatan

- Folder ini tidak di-commit ke Git (lihat `.gitignore`)
- Ukuran maksimal file: 5MB
- Format yang didukung: PNG, JPG, JPEG, WebP
