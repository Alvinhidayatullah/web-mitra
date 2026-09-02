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
    <main className="min-h-screen bg-[#f3f4f6] flex flex-col items-center justify-center p-4 font-sans text-gray-900">
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-[#0b1836] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
          <Search className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Portal Peta Mitra</h1>
        <p className="text-gray-500 mb-8 text-sm">
          Masukkan kode konfigurasi (UUID) untuk melihat detail Yayasan dan SPPG.
        </p>
        
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Contoh: 123e4567-e89b-..." 
            value={uuid}
            onChange={(e) => setUuid(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-mono bg-gray-50"
            required
          />
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition shadow-md hover:shadow-lg"
          >
            Lihat Konfigurasi
          </button>
        </form>
      </div>
    </main>
  );
}
