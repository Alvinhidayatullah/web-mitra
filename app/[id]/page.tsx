"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
/* eslint-disable @next/next/no-img-element */
import { useParams } from "next/navigation";
import { CheckCircle2, Copy, ExternalLink, Store, X } from "lucide-react";
import { DashboardState } from "@/types/dashboard";

// Dynamic import for Leaflet map component to prevent SSR issues
const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center font-semibold text-gray-400">Memuat Peta...</div>
});

export default function DashboardView() {
  const params = useParams();
  const id = params.id as string;
  
  const [dashboardData, setDashboardData] = useState<DashboardState | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load config from Database via API
    fetch(`/api/configs/${id}`, { cache: "no-store" })
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        setDashboardData(data);
      })
      .catch(e => {
        console.error("Failed to fetch dashboard data:", e);
      });
  }, [id]);

  if (!mounted) return null;

  if (!dashboardData) {
    return (
      <main className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">404</h1>
          <p className="text-gray-600">Konfigurasi tidak ditemukan atau UUID tidak valid.</p>
        </div>
      </main>
    );
  }

  const { yayasan, sppg } = dashboardData;

  return (
    <main className="min-h-screen bg-[#f3f4f6] p-4 md:p-8 font-sans text-gray-900 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-4">
        
        {/* Map & SPPG Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          {/* Map Area */}
          <div className="w-full h-[400px] relative bg-blue-50">
            <InteractiveMap
              lat={sppg.location.latitude}
              lng={sppg.location.longitude}
              zoom={sppg.location.zoomLevel}
              label={sppg.location.label}
            />
            {/* Map Legend Overlay */}
            <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 z-[1000] bg-white/95 backdrop-blur-sm p-2 md:px-4 md:py-2 rounded-lg md:rounded-full shadow-md border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 text-[10px] md:text-xs font-medium text-gray-600">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 bg-[#0a1e3f] rounded-full flex items-center justify-center shrink-0">
                   <Store className="w-2.5 h-2.5 text-white" />
                </div>
                <span>Lokasi Calon SPPG</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-amber-500 rounded-sm shrink-0"></div>
                <span>Lokasi Data Kelompok</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-blue-500 rounded-full shrink-0"></div>
                <span>Titik Rekomendasi</span>
              </div>
            </div>
          </div>

          {/* SPPG Info Area */}
          <div className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 uppercase">
                {sppg.namaSPPG}
              </h2>
              <div className="flex items-center text-sm text-gray-500 flex-wrap gap-2">
                <span>ID SPPG : {sppg.idSPPG}</span>
                <button className="text-gray-400 hover:text-gray-600 transition" aria-label="Copy ID SPPG">
                  <Copy className="w-4 h-4" />
                </button>
                <span className="text-gray-300 mx-1">•</span>
                <span>Yayasan Terkait : {sppg.yayasanTerkait}</span>
              </div>
            </div>
            
            <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-1.5 rounded-full font-semibold text-sm whitespace-nowrap">
              {sppg.statusBadge}
            </div>
          </div>
        </div>

        {/* Yayasan Card */}
        <div className="bg-[#0b1836] rounded-xl shadow-md overflow-hidden p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-white">
          <div className="flex items-start md:items-center gap-4 w-full md:w-auto">
            {/* Yayasan Info */}
            <div className="flex flex-col justify-center w-full">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-lg md:text-xl font-bold tracking-wide">
                  {yayasan.namaYayasan}
                </h1>
                {yayasan.isVerified && (
                  <CheckCircle2 className="w-5 h-5 text-white fill-blue-500 shrink-0" />
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-300">
                <span className="flex items-center gap-1.5">
                  ID Mitra : {yayasan.idMitra}
                  <button className="text-gray-400 hover:text-white transition" aria-label="Copy ID Mitra">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </span>
                <span className="text-gray-500">•</span>
                <span>NPWP: {yayasan.npwp}</span>
                <span className="text-gray-500">•</span>
                <span>Nomor Ponsel: {yayasan.nomorPonsel}</span>
              </div>
              
              <div className="text-xs md:text-sm text-gray-300 mt-0.5">
                Email: {yayasan.email}
              </div>
            </div>
          </div>

          <button 
            onClick={() => setIsImagePopupOpen(true)}
            className="text-gray-300 hover:text-white transition shrink-0 mt-2 md:mt-0 self-end md:self-auto flex items-center justify-center p-2 md:p-0" 
            aria-label="Lihat Gambar"
          >
            <ExternalLink className="w-6 h-6" />
          </button>
        </div>

      </div>

      {/* Image Popup Modal */}
      {isImagePopupOpen && yayasan.imageUrl && (
        <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl overflow-hidden max-w-3xl w-full">
            <button 
              onClick={() => setIsImagePopupOpen(false)}
              className="absolute top-4 right-4 bg-white/50 hover:bg-white p-2 rounded-full text-black transition z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img src={yayasan.imageUrl} alt="Popup Image" className="w-full h-auto max-h-[80vh] object-contain" />
          </div>
        </div>
      )}
      {isImagePopupOpen && !yayasan.imageUrl && (
        <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl p-8 max-w-sm w-full text-center">
            <button 
              onClick={() => setIsImagePopupOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black transition"
            >
              <X className="w-5 h-5" />
            </button>
            <p className="text-gray-600 font-semibold">Belum ada gambar yang diupload untuk yayasan ini.</p>
          </div>
        </div>
      )}

    </main>
  );
}
