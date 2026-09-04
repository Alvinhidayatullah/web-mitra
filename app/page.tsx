"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function LandingPage() {
  const [uuid, setUuid] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (uuid.trim()) {
      router.push(`/${uuid.trim()}`);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f0f4f8] to-[#d9e2ec] flex flex-col items-center justify-center p-4 sm:p-8 font-sans text-gray-900 relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>

      <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-12 rounded-[2rem] shadow-2xl border border-white/50 max-w-xl w-full text-center relative z-10 transition-all duration-300 hover:shadow-blue-900/10 hover:bg-white/90">
        
        {/* Logos Section */}
        <div className="flex items-center justify-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/BGN.png" alt="BGN Logo" className="h-24 sm:h-28 object-contain drop-shadow-md transition-transform hover:scale-105" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600 mb-3 tracking-tight">
          Portal Peta Mitra
        </h1>
        
        <p className="text-gray-600 mb-10 text-sm sm:text-base leading-relaxed px-4">
          Selamat datang di Sistem Informasi Geografis Mitra. Silakan masukkan kode unik (UUID) Anda untuk mengakses detail lokasi Yayasan dan SPPG
        </p>
        
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              placeholder="Masukkan UUID Konfigurasi..." 
              value={uuid}
              onChange={(e) => setUuid(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-left font-mono bg-white/50 text-gray-800 transition-all shadow-sm"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
          >
            <span>Akses Konfigurasi</span>
            <Search className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>
        </form>
      </div>

      <p className="mt-8 text-xs text-gray-500 font-medium tracking-wide">
        &copy; {new Date().getFullYear()} Makan Bergizi Gratis - Hak Cipta Dilindungi
      </p>
    </main>
  );
}
