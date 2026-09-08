"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardState } from "@/types/dashboard";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";
import { ArrowLeft, Copy, Mail } from "lucide-react";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

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

      <div 
        ref={cardRef} 
        className="w-[400px] bg-white shadow-xl relative flex flex-col items-center pt-8 pb-8"
        style={{ minHeight: '650px' }} 
      >
        {/* Top Logo - White Background */}
        <div className="w-full flex justify-center mb-6 px-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/BGN.png" alt="BGN Logo" className="w-[85%] object-contain" />
        </div>

        {/* Kotak Biru Utama (Card) */}
        <div className="w-[90%] bg-[#1e3a8a] rounded-[2rem] shadow-xl p-8 flex flex-col items-center mb-auto">
          
          <h2 className="text-[#fbbf24] text-2xl font-black italic tracking-wider mb-1">PINDAI DISINI</h2>
          <p className="text-white text-sm font-bold tracking-widest mb-6">UNTUK MELIHAT DETAIL</p>
          
          {/* QR Code Container */}
          <div className="bg-white p-3 rounded-2xl mb-6 shadow-inner border-[3px] border-[#3b82f6]">
            <QRCodeCanvas value={publicUrl} size={180} level="H" />
          </div>
          
          {/* Info Text */}
          <div className="w-full flex flex-col gap-2 text-center text-white">
            <div className="font-bold text-sm uppercase">SATPEL : {data.sppg.namaSPPG}</div>
            <div className="font-bold text-xs uppercase">Mitra : {data.yayasan.namaYayasan}</div>
            
            <div className="mt-3 font-bold text-sm uppercase">
              ID SPPG : {data.sppg.idSPPG || "-"}
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="h-6"></div>

        {/* Footer Socials - Horizontal */}
        <div className="w-full px-4 flex items-center justify-center gap-4 mt-auto">
          <div className="flex items-center gap-1.5 text-[#1e3a8a]">
            <InstagramIcon className="w-4 h-4" />
            <span className="font-bold text-[10px] tracking-wide">@badangizinasional</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-[#1e3a8a]">
            <FacebookIcon className="w-4 h-4 fill-current" />
            <span className="font-bold text-[10px] tracking-wide">@badangizinasional</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-[#1e3a8a]">
            <Mail className="w-4 h-4" />
            <span className="font-bold text-[10px] tracking-wide">www.gizinasional.go.id</span>
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
          </div>
        </div>
      </div>
    </div>
  );
}
