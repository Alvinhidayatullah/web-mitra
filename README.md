# 🗺️ Web Mitra - Dashboard Peta Yayasan & SPPG

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-DB-4169E1?style=for-the-badge&logo=postgresql)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Leaflet](https://img.shields.io/badge/Leaflet-Map-199900?style=for-the-badge&logo=leaflet)

Sebuah sistem manajemen informasi pemetaan (GIS sederhana) interaktif yang memungkinkan admin untuk mengelola, menampilkan, dan mendistribusikan titik koordinat serta detail data **Yayasan** dan **Calon SPPG (Satuan Pendidikan Penyelenggara Gizi)**.

## ✨ Fitur Utama

- **🌍 Peta Interaktif (Leaflet)**: Visualisasi titik koordinat Yayasan/SPPG di peta interaktif lengkap dengan penanda (marker) yang bisa disesuaikan.
- **🛡️ Sistem Multi-Konfigurasi (Anti-IDOR)**: Mendukung pembuatan banyak halaman terpisah dengan ID tautan unik (UUID) agar data tidak mudah ditebak oleh pihak eksternal.
- **📱 Desain Responsif Premium**: UI/UX dirancang dengan _glassmorphism_ dan modern *styling* menggunakan TailwindCSS yang terlihat rapi di layar _smartphone_ maupun _desktop_.
- **🖨️ Generator QR Code Otomatis**: Sekali simpan, sistem langsung membuatkan _Barcode / QR Code_ yang bisa di-*download* (PNG) untuk mempermudah akses ke halaman publik.
- **🗄️ Database PostgreSQL**: Penyimpanan data yang persisten dan tangguh didukung oleh Prisma ORM.

---

## 🚀 Panduan Instalasi & Menjalankan

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi ini secara lokal di perangkat Anda.

### 1. Kloning Repository
```bash
git clone https://github.com/Alvinhidayatullah/web-mitra.git
cd web-mitra
```

### 2. Instalasi Dependensi
Aplikasi ini menggunakan `npm` sebagai *package manager*.
```bash
npm install
```

### 3. Konfigurasi Database (Environment Variables)
Buat file `.env` di root direktori proyek Anda dan masukkan URL koneksi PostgreSQL Anda:
```env
DATABASE_URL="postgresql://username:password@host:port/database_name?sslmode=require"
```

### 4. Migrasi Database (Prisma)
Sinkronkan skema _database_ agar struktur tabel `DashboardConfig` terbentuk:
```bash
npx prisma db push
```

### 5. Jalankan Development Server
```bash
npm run dev
```
Akses website melalui browser di `http://localhost:3000`.

---

## 🧭 Navigasi & Penggunaan

### 🔐 Halaman Admin
- **URL**: `http://localhost:3000/secure-mbg`
- **Login**: Masukkan kredensial admin Anda (Default: `admin` / `mbg`)
- **Kegunaan**: Menambah data Yayasan baru, menentukan titik koordinat pada peta secara otomatis dengan mengeklik area peta, mengatur UUID halaman, dan mengunduh _QR Code_.

### 🌐 Halaman Publik (Portal)
- **URL**: `http://localhost:3000/`
- **Kegunaan**: Halaman pencarian bagi _user_ publik untuk memasukkan kode UUID yang valid. Jika UUID valid, _user_ akan diarahkan ke halaman detail (misal: `/[uuid]`) untuk melihat peta dan informasi SPPG secara _read-only_.

---

## 🛠️ Teknologi yang Digunakan

* **Frontend**: Next.js 14 (App Router), React 18
* **Styling**: Tailwind CSS
* **Map Engine**: React-Leaflet
* **Backend & API**: Next.js API Routes (Serverless)
* **Database & ORM**: PostgreSQL & Prisma ORM
* **Utilities**: Lucide-React (Icons), QRCode.react

---
*Dibuat untuk mempermudah pemetaan dan manajemen Mitra & SPPG secara elegan dan terpusat.*
