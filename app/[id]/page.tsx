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
  const [isLoading, setIsLoading] = useState(true);
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
        setIsLoading(false);
      })
      .catch(e => {
        console.error("Failed to fetch dashboard data:", e);
        setIsLoading(false);
      });
  }, [id]);

  if (!mounted) return null;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-semibold">Memuat Data...</p>
        </div>
      </main>
    );
  }

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

      
        {/* Detail Ekstra */}
        {dashboardData.extendedData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            
            {/* SPPG Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-800 border-b pb-2 mb-3">Identitas SPPG Lanjutan</h3>
              <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                <span className="text-gray-500">No. BA Verval</span><span className="font-medium text-gray-900">{dashboardData.extendedData.noBaVerval || "-"}</span>
                <span className="text-gray-500">Tgl BA Verval</span><span className="font-medium text-gray-900">{dashboardData.extendedData.tglBaVerval || "-"}</span>
                <span className="text-gray-500">Status Operasional</span><span className="font-medium text-gray-900">{dashboardData.extendedData.statusOperasional || "-"}</span>
                <span className="text-gray-500">Tgl Operasional</span><span className="font-medium text-gray-900">{dashboardData.extendedData.tglOperasional || "-"}</span>
                <span className="text-gray-500">Kode SPPG</span><span className="font-medium text-gray-900">{dashboardData.extendedData.kodeSppg || "-"}</span>
                <span className="text-gray-500">Jenis Bangunan</span><span className="font-medium text-gray-900">{dashboardData.extendedData.jenisBangunanSppg || "-"}</span>
                <span className="text-gray-500">Alamat Lengkap</span>
                <span className="font-medium text-gray-900">
                  {dashboardData.extendedData.alamatSppg}, {dashboardData.extendedData.kelurahanDesaSppg}, {dashboardData.extendedData.kecamatanSppg}, {dashboardData.extendedData.kabKotaSppg}, {dashboardData.extendedData.provinsiSppg} - {dashboardData.extendedData.kodePosSppg}
                </span>
              </div>
            </div>

            {/* Yayasan Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-800 border-b pb-2 mb-3">Identitas Yayasan Lanjutan</h3>
              <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                <span className="text-gray-500">Alamat Lengkap</span>
                <span className="font-medium text-gray-900">
                  {dashboardData.extendedData.alamatYayasan}, {dashboardData.extendedData.kelurahanDesaYayasan}, {dashboardData.extendedData.kecamatanYayasan}, {dashboardData.extendedData.kabKotaYayasan}, {dashboardData.extendedData.provinsiYayasan} - {dashboardData.extendedData.kodePosYayasan}
                </span>
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-800 border-b pb-2 mb-3">Data Bank & Rekening Yayasan</h3>
              <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                <span className="text-gray-500">Nama Bank</span><span className="font-medium text-gray-900">{dashboardData.extendedData.bank.namaBank || "-"}</span>
                <span className="text-gray-500">No. Rekening</span><span className="font-medium text-gray-900">{dashboardData.extendedData.bank.noRekening || "-"}</span>
                <span className="text-gray-500">Pemilik Rekening</span><span className="font-medium text-gray-900">{dashboardData.extendedData.bank.namaPemilikRekening || "-"}</span>
                <span className="text-gray-500">Bank Virtual Acc</span><span className="font-medium text-gray-900">{dashboardData.extendedData.bank.namaBankVA || "-"}</span>
                <span className="text-gray-500">No. Virtual Acc</span><span className="font-medium text-gray-900">{dashboardData.extendedData.bank.noVA || "-"}</span>
                <span className="text-gray-500">Nama Virtual Acc</span><span className="font-medium text-gray-900">{dashboardData.extendedData.bank.namaVA || "-"}</span>
              </div>
            </div>

            {/* PIC Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-800 border-b pb-2 mb-3">Data PIC Yayasan di SPPG</h3>
              <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                <span className="text-gray-500">Nama Perwakilan</span><span className="font-medium text-gray-900">{dashboardData.extendedData.pic.namaPic || "-"}</span>
                <span className="text-gray-500">NIK</span><span className="font-medium text-gray-900">{dashboardData.extendedData.pic.nikPic || "-"}</span>
                <span className="text-gray-500">No. HP/Telp</span><span className="font-medium text-gray-900">{dashboardData.extendedData.pic.noHpPic || "-"}</span>
                <span className="text-gray-500">Email</span><span className="font-medium text-gray-900">{dashboardData.extendedData.pic.emailPic || "-"}</span>
              </div>
            </div>

            {/* Kasatpel Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-800 border-b pb-2 mb-3">Data SPPI / Kasatpel / Ka SPPG</h3>
              <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                <span className="text-gray-500">Nama Lengkap</span><span className="font-medium text-gray-900">{dashboardData.extendedData.kasatpel.namaKasatpel || "-"}</span>
                <span className="text-gray-500">NIK</span><span className="font-medium text-gray-900">{dashboardData.extendedData.kasatpel.nikKasatpel || "-"}</span>
                <span className="text-gray-500">No. HP/Telp</span><span className="font-medium text-gray-900">{dashboardData.extendedData.kasatpel.noHpKasatpel || "-"}</span>
                <span className="text-gray-500">Email</span><span className="font-medium text-gray-900">{dashboardData.extendedData.kasatpel.emailKasatpel || "-"}</span>
                <span className="text-gray-500">No. SKEP</span><span className="font-medium text-gray-900">{dashboardData.extendedData.kasatpel.noSkepKasatpel || "-"}</span>
                <span className="text-gray-500">Tgl SKEP</span><span className="font-medium text-gray-900">{dashboardData.extendedData.kasatpel.tglSkepKasatpel || "-"}</span>
              </div>
            </div>

            {/* Mitra Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-800 border-b pb-2 mb-3">Identitas Mitra</h3>
              <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                <span className="text-gray-500">Instansi</span><span className="font-medium text-gray-900">{dashboardData.extendedData.mitra.namaMitra || "-"} ({dashboardData.extendedData.mitra.jenisMitra})</span>
                <span className="text-gray-500">Nama Pimpinan</span><span className="font-medium text-gray-900">{dashboardData.extendedData.mitra.namaPimpinanMitra || "-"}</span>
                <span className="text-gray-500">Bentuk Dukungan</span><span className="font-medium text-gray-900">{dashboardData.extendedData.mitra.bentukDukunganMitra || "-"}</span>
                <span className="text-gray-500">No. HP/Telp</span><span className="font-medium text-gray-900">{dashboardData.extendedData.mitra.noHpMitra || "-"}</span>
                <span className="text-gray-500">Email</span><span className="font-medium text-gray-900">{dashboardData.extendedData.mitra.emailMitra || "-"}</span>
                <span className="text-gray-500">Alamat Lengkap</span>
                <span className="font-medium text-gray-900">
                  {dashboardData.extendedData.mitra.alamatMitra}, {dashboardData.extendedData.mitra.kelurahanDesaMitra}, {dashboardData.extendedData.mitra.kecamatanMitra}, {dashboardData.extendedData.mitra.kabKotaMitra}, {dashboardData.extendedData.mitra.provinsiMitra} - {dashboardData.extendedData.mitra.kodePosMitra}
                </span>
              </div>
            </div>

          </div>
        )}

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
