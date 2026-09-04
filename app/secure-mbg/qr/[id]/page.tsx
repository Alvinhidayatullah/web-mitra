"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardState } from "@/types/dashboard";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";

export default function QRCardPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const [data, setData] = useState<DashboardState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/configs/${id}`, { cache: "no-store" })
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(json => {
        setData(json);
        setIsLoading(false);
      })
      .catch(e => {
        console.error(e);
        setIsLoading(false);
      });
  }, [id]);

  const downloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 3, useCORS: true });
      const link = document.createElement("a");
      link.download = `QR_Card_${data?.sppg.namaSPPG || 'MBG'}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Failed to download image", e);
      alert("Gagal mengunduh gambar");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-sm">
          <h1 className="text-xl font-bold mb-2">Konfigurasi Tidak Ditemukan</h1>
          <button onClick={() => router.push("/secure-mbg")} className="text-blue-600 underline">Kembali ke Admin</button>
        </div>
      </div>
    );
  }

  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/${id}` : "";

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 flex flex-col items-center">
      {/* Back Button */}
      <div className="w-full max-w-[400px] mb-4">
        <button 
          onClick={() => router.push("/secure-mbg")}
          className="flex items-center gap-2 text-gray-600 hover:text-black font-semibold transition"
        >
          <ArrowLeft className="w-5 h-5" /> Kembali ke Admin
        </button>
      </div>

      {/* Identitas Card */}
      <h2 className="w-full max-w-[400px] text-left text-lg font-bold text-gray-800 mb-4">QR Code Identitas</h2>
      
      <div 
        ref={cardRef} 
        className="w-[400px] h-[550px] bg-white shadow-xl relative overflow-hidden flex flex-col items-center pt-8"
        style={{
          backgroundImage: "linear-gradient(to bottom, #ffffff 65%, #1e3a8a 65%)"
        }}
      >
        {/* Background Waves (Top) */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-full blur-xl opacity-80 z-0 translate-x-10 -translate-y-10"></div>
        <div className="absolute top-20 right-10 w-32 h-32 bg-blue-50 rounded-full blur-2xl opacity-60 z-0"></div>

        {/* Content */}
        <div className="relative z-10 w-full flex flex-col items-center px-8">
          {/* Header */}
          <div className="w-full flex justify-start mb-6">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/Logo-mbg.png" alt="MBG" className="h-12 object-contain" />
              <div className="font-bold text-[#1e3a8a] text-[11px] leading-tight tracking-wide">
                BADAN<br/>GIZI<br/>NASIONAL
              </div>
            </div>
          </div>

          {/* SPPG & Yayasan Name */}
          <h1 className="text-[14px] font-extrabold text-center text-gray-800 leading-snug mb-1 uppercase w-full">
            {data.sppg.namaSPPG}
          </h1>
          <h2 className="text-[12px] font-bold text-center text-gray-500 mb-4 uppercase w-full">
            {data.yayasan.namaYayasan}
          </h2>
          
          <div className="text-[10px] text-gray-400 font-mono tracking-widest mb-3">
            ID SPPG: {data.sppg.idSPPG || "-"}
          </div>

          {/* QR Code */}
          <div className="bg-white p-4 rounded-3xl shadow-lg border border-gray-100 mb-4">
            <QRCodeCanvas value={publicUrl} size={180} level="H" />
          </div>
          
          <p className="text-[10px] text-gray-400 font-medium mb-12">
            Pindai QR Code untuk informasi dapur ini
          </p>
        </div>

        {/* Footer wave curve effect using scale */}
        <div 
          className="absolute bottom-0 left-0 w-full h-[220px] bg-[#1e3a8a] rounded-t-[100%] flex flex-col items-center justify-end pb-8 text-[10px] text-white/90 font-medium z-0" 
          style={{ transform: "scaleX(1.5)", transformOrigin: "bottom center" }}
        >
          <div style={{ transform: "scaleX(0.666)" }} className="flex items-center gap-5">
            <span className="flex items-center gap-1.5"><span className="opacity-70">🌐</span> badangizinasional.ri</span>
            <span className="flex items-center gap-1.5"><span className="opacity-70">📱</span> @bgn.ri</span>
            <span className="flex items-center gap-1.5"><span className="opacity-70">✉️</span> halo@bgn.go.id</span>
          </div>
        </div>
      </div>

      {/* Controls below card */}
      <div className="w-full max-w-[400px] mt-6 flex flex-col gap-4">
        <button 
          onClick={downloadImage}
          className="w-full flex items-center justify-center gap-2 text-blue-600 hover:text-blue-800 font-bold transition p-2 text-lg hover:underline"
        >
          Unduh Gambar
        </button>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Tautan Unik Anda</label>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              readOnly 
              value={publicUrl} 
              className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl text-sm font-mono text-gray-600 outline-none" 
            />
            <button 
              onClick={() => { navigator.clipboard.writeText(publicUrl); alert("Disalin!") }}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition shadow-md"
              title="Copy URL"
            >
              <Copy className="w-5 h-5" />
            </button>
            <a 
              href={publicUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gray-900 hover:bg-gray-800 text-white p-3 rounded-xl transition shadow-md"
              title="Buka"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
