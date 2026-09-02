# Product Requirements Document (PRD)
## Sistem Dashboard Peta Mitra & Admin CMS Terproteksi (`/secure-mbg`)

---

## 1. Ringkasan Eksekutif & Tech Stack

Dokumen ini dirancang untuk alur kerja **Vibe Coding** menggunakan AI coding assistant (Cursor, Windsurf, GitHub Copilot). Dokumen mendefinisikan sistem dashboard publik dan panel admin berbasis peta nyata interaktif lengkap dengan sistem autentikasi sederhana.

* **Framework:** Next.js (App Router, TypeScript)
* **Styling:** Tailwind CSS, Lucide React (ikon)
* **Peta:** Leaflet & React-Leaflet (`ssr: false`) + OpenStreetMap Tiles
* **Autentikasi Sederhana:**
  * **Username:** `admin`
  * **Password:** `mbg`
  * Metode: Cookie-based session / Middleware Next.js atau state auth gate
* **Routing:**
  * Halaman Publik: `/`
  * Halaman Admin (Protected): `/secure-mbg`

---

## 2. Struktur Data & Model (`types/dashboard.ts`)

```typescript
export interface GeoCoordinate {
  latitude: number;   // Contoh: -6.2088
  longitude: number;  // Contoh: 106.8456
  zoomLevel: number;  // Default: 13
  label: string;      // Default: "Titik Pengajuan Mitra"
}

export interface YayasanConfig {
  namaYayasan: string; // Contoh: "YAYASAN PPSS"
  isVerified: boolean;
  idMitra: string;     // Contoh: "GHSYS7"
  npwp: string;        // Contoh: "833"
  nomorPonsel: string; // Contoh: "085262"
  email: string;       // Contoh: "adjd@gmail.com"
}

export interface SPPGConfig {
  namaSPPG: string;       // Contoh: "SPPG YTTA"
  isVerified: boolean;
  idSPPG: string;         // Contoh: "MS63"
  yayasanTerkait: string; // Contoh: "Yayasan PPSS"
  statusBadge: string;    // Contoh: "Terdaftar"
  location: GeoCoordinate;
}

export interface DashboardState {
  yayasan: YayasanConfig;
  sppg: SPPGConfig;
}
```

---

## 3. Spesifikasi Rute & Fungsionalitas

### A. Halaman Publik (`/app/page.tsx`)

1. **Map Container (Bingkai Peta):**
   * Bingkai luar hitam tebal dengan sudut membulat (`rounded-3xl border-8 border-black overflow-hidden relative aspect-video w-full shadow-2xl`).
   * Render Leaflet Map di dalam wadah ini secara dinamis (`ssr: false`).
   * Peta otomatis terpusat ke `location.latitude` dan `location.longitude`.
   * **Pin Marker & Badge:**
     * Custom Marker di titik koordinat.
     * Floating badge putih di atas marker bertuliskan `location.label` ("Titik Pengajuan Mitra") (`rounded-full px-4 py-1.5 font-bold shadow-md text-black bg-white`).

2. **Overlay Bar SPPG (Bagian Bawah Frame):**
   * Bilah hitam pekat di bagian bawah wadah peta (`absolute bottom-0 left-0 right-0 z-[1000] bg-black text-white p-4 flex justify-between items-center`).
   * Sisi Kiri:
     * Baris 1: Nama SPPG (`namaSPPG`) + badge centang verifikasi biru.
     * Baris 2: `ID SPPG : {idSPPG}` | `Yayasan Terkait : {yayasanTerkait}`.
   * Sisi Kanan:
     * Badge status pill putih dengan teks hitam (`bg-white text-black px-4 py-1 rounded-lg font-bold text-sm`).

3. **Blok Informasi Yayasan (Footer):**
   * Tepat di bawah frame peta dengan latar transparan/bersih.
   * Judul besar nama yayasan (`text-3xl font-extrabold uppercase tracking-wide flex items-center gap-2`).
   * Baris 1: `ID Mitra : {idMitra}` | `NPWP : {npwp}` | `Nomor Ponsel : {nomorPonsel}`.
   * Baris 2: `Email : {email}`.

---

### B. Halaman Admin Panel Terproteksi (`/app/secure-mbg/page.tsx`)

1. **Auth Gate (Login Screen):**
   * Jika user belum login, tampilkan modal atau card login elegan di tengah layar (`min-h-screen flex items-center justify-center`).
   * Form login meminta `Username` dan `Password`.
   * **Kredensial Valid:**
     * Username: `admin`
     * Password: `mbg`
   * Jika kredensial cocok, simpan status sesi (cookie atau `sessionStorage`) dan tampilkan halaman CMS.
   * Tombol **Logout** tersedia di pojok kanan atas halaman CMS untuk menghapus sesi.

2. **Form CMS Konten Teks:**
   * Input edit data Yayasan (`namaYayasan`, `idMitra`, `npwp`, `nomorPonsel`, `email`).
   * Input edit data SPPG (`namaSPPG`, `idSPPG`, `yayasanTerkait`, `statusBadge`).
   * Toggle centang verifikasi untuk Yayasan dan SPPG.

3. **Interactive Map Coordinates Picker:**
   * Input manual untuk `Latitude`, `Longitude`, dan `Label Titik Peta`.
   * **Click-to-Pick:** Peta Leaflet interaktif. Mengklik lokasi mana saja di peta akan otomatis mengisi input `latitude` dan `longitude`.

4. **Penyimpanan Data:**
   * Tombol "Simpan Konfigurasi" (data tersimpan di `localStorage` atau JSON state agar langsung sinkron ke halaman depan).

---

## 4. Urutan Prompting Vibe Coding (Copy-Paste Ready)

### Prompt 1 — Setup Komponen Peta Leaflet
```text
Instal paket leaflet dan react-leaflet beserta types:
npm install leaflet react-leaflet @types/leaflet

Buat komponen client-side 'components/InteractiveMap.tsx' dengan Next.js dynamic import (ssr: false).
Komponen ini menerima props:
- lat: number
- lng: number
- zoom: number
- label: string
- editable?: boolean
- onLocationChange?: (lat: number, lng: number) => void

Gunakan OpenStreetMap tile layer dan custom marker icon. Jika editable = true, aktifkan click listener pada peta untuk memicu callback onLocationChange saat admin mengklik lokasi baru.
```

### Prompt 2 — Implementasi Halaman Publik
```text
Buat halaman utama di 'app/page.tsx' menggunakan Tailwind CSS sesuai antarmuka DashboardState.
1. Render InteractiveMap di dalam bingkai hitam tebal rasio 16:9 dengan sudut rounded-3xl.
2. Tempatkan bar overlay hitam SPPG di bagian bawah frame peta dengan z-index tinggi agar tampil di atas Leaflet.
3. Tampilkan rincian teks Yayasan di bawah frame peta persis seperti mockup visual.
4. Ambil data dari state/localStorage agar perubahan dari admin langsung terefleksi.
```

### Prompt 3 — Implementasi Admin Panel & Auth Gate (`/secure-mbg`)
```text
Buat halaman admin di 'app/secure-mbg/page.tsx' dengan proteksi login:
1. Kredensial login:
   - Username: admin
   - Password: mbg
2. Tampilkan form login jika admin belum terautentikasi. Simpan status autentikasi di sessionStorage/cookies dan sediakan tombol Logout.
3. Setelah login, tampilkan panel CMS lengkap:
   - Form edit seluruh teks Yayasan & SPPG.
   - InteractiveMap dengan editable={true} agar klik pada peta otomatis mengubah input Latitude dan Longitude.
   - Tombol Simpan Konfigurasi untuk menyimpan ke state/localStorage.
```
