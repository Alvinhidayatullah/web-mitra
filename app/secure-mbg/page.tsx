"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { DashboardConfigs, DashboardState, defaultState } from "@/types/dashboard";
import { QRCodeCanvas } from "qrcode.react";
import { Plus, Trash2, X, Copy, ExternalLink, Download } from "lucide-react";

const InteractiveMap = dynamic(() => import("@/components/InteractiveMap"), {
  ssr: false,
  loading: () => <div className="w-full h-48 bg-gray-200 animate-pulse flex items-center justify-center font-bold">Memuat Peta...</div>
});

const generateUUID = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 10) + '-' + Math.random().toString(36).substring(2, 10);
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [configs, setConfigs] = useState<DashboardConfigs>({});
  const [activeId, setActiveId] = useState<string>("");
  const [showQrModal, setShowQrModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const authSession = sessionStorage.getItem("mbg-auth");
    if (authSession === "true") setIsAuthenticated(true);

    // Load configs from API
    fetch("/api/configs")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const loadedConfigs: DashboardConfigs = {};
          data.forEach(item => {
            loadedConfigs[item.id] = {
              yayasan: {
                namaYayasan: item.namaYayasan,
                isVerified: item.isVerifiedYay,
                idMitra: item.idMitra,
                npwp: item.npwp,
                nomorPonsel: item.nomorPonsel,
                email: item.email,
                imageUrl: item.imageUrl || ""
              },
              sppg: {
                namaSPPG: item.namaSPPG,
                isVerified: item.isVerifiedSppg,
                idSPPG: item.idSPPG,
                yayasanTerkait: item.yayasanTerkait,
                statusBadge: item.statusBadge,
                location: {
                  latitude: item.lat,
                  longitude: item.lng,
                  zoomLevel: item.zoomLevel,
                  label: item.mapLabel
                }
              }
            };
          });
          setConfigs(loadedConfigs);
          setActiveId(Object.keys(loadedConfigs)[0]);
        } else {
          // Default if empty
          const newId = generateUUID();
          setConfigs({ [newId]: defaultState });
          setActiveId(newId);
        }
      })
      .catch(e => {
        console.error("Failed to load configs", e);
        const newId = generateUUID();
        setConfigs({ [newId]: defaultState });
        setActiveId(newId);
      });
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "mbg") {
      setIsAuthenticated(true);
      sessionStorage.setItem("mbg-auth", "true");
    } else {
      alert("Username atau password salah!");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("mbg-auth");
  };

  const handleSave = async () => {
    try {
      const res = await fetch("/api/configs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configs)
      });
      if (res.ok) {
        setShowQrModal(true);
      } else {
        alert("Gagal menyimpan ke database");
      }
    } catch (e) {
      alert("Error saat menyimpan: " + e);
    }
  };

  const addConfig = () => {
    const newId = generateUUID();
    setConfigs(prev => ({ ...prev, [newId]: defaultState }));
    setActiveId(newId);
  };

  const deleteConfig = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (Object.keys(configs).length === 1) {
      alert("Minimal harus ada 1 konfigurasi.");
      return;
    }
    if (confirm("Yakin ingin menghapus konfigurasi ini?")) {
      const newConfigs = { ...configs };
      delete newConfigs[id];
      setConfigs(newConfigs);
      if (activeId === id) {
        setActiveId(Object.keys(newConfigs)[0]);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateYayasan = (key: keyof DashboardState['yayasan'], value: any) => {
    if (!activeId) return;
    setConfigs(prev => ({
      ...prev,
      [activeId]: {
        ...prev[activeId],
        yayasan: { ...prev[activeId].yayasan, [key]: value }
      }
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateYayasan("imageUrl", reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateSPPG = (key: keyof DashboardState['sppg'], value: any) => {
    if (!activeId) return;
    setConfigs(prev => ({
      ...prev,
      [activeId]: {
        ...prev[activeId],
        sppg: { ...prev[activeId].sppg, [key]: value }
      }
    }));
  };

  if (!mounted) return null;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center text-black">Admin Login</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                required
              />
            </div>
            <button type="submit" className="w-full bg-black text-white p-2 rounded-lg font-bold hover:bg-gray-800 transition">
              Login
            </button>
          </div>
        </form>
      </div>
    );
  }

  const activeData = configs[activeId];
  if (!activeData) return null;

  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/${activeId}` : "";

  const downloadQR = () => {
    const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `QR_Code_${activeData.yayasan.namaYayasan || 'Config'}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 sticky top-0 z-50">
        <h1 className="text-lg sm:text-xl font-bold text-center sm:text-left">Admin - Manajemen Multi-Konfigurasi</h1>
        <div className="flex w-full sm:w-auto justify-center sm:justify-end gap-2 sm:gap-4">
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            Simpan Konfigurasi
          </button>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition">
            Logout
          </button>
        </div>
      </header>

      {/* Tabs / Pagination */}
      <div className="bg-white border-b overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center gap-2">
          {Object.entries(configs).map(([id, config], index) => (
            <div 
              key={id}
              onClick={() => setActiveId(id)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer whitespace-nowrap transition border-2 ${
                activeId === id ? "border-blue-600 bg-blue-50 text-blue-800" : "border-transparent bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <span className="font-semibold text-sm">Halaman {index + 1}</span>
              <button 
                onClick={(e) => deleteConfig(id, e)}
                className="text-gray-400 hover:text-red-500 transition"
                title="Hapus"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button 
            onClick={addConfig}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 transition whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Tambah Page
          </button>
        </div>
      </div>

      <main className="p-4 md:p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Data Yayasan Form */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Data Yayasan (Page: {activeId.substring(0, 8)})</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold">Nama Yayasan</label>
                <input type="text" value={activeData.yayasan.namaYayasan} onChange={e => updateYayasan("namaYayasan", e.target.value)} className="w-full border p-2 rounded-lg mt-1" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold">ID Mitra</label>
                  <input type="text" value={activeData.yayasan.idMitra} onChange={e => updateYayasan("idMitra", e.target.value)} className="w-full border p-2 rounded-lg mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-semibold">NPWP</label>
                  <input type="text" value={activeData.yayasan.npwp} onChange={e => updateYayasan("npwp", e.target.value)} className="w-full border p-2 rounded-lg mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold">Nomor Ponsel</label>
                  <input type="text" value={activeData.yayasan.nomorPonsel} onChange={e => updateYayasan("nomorPonsel", e.target.value)} className="w-full border p-2 rounded-lg mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-semibold">Email</label>
                  <input type="email" value={activeData.yayasan.email} onChange={e => updateYayasan("email", e.target.value)} className="w-full border p-2 rounded-lg mt-1" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold">Upload Gambar (Popup Yayasan)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload} 
                  className="w-full border p-2 rounded-lg mt-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                />
                {activeData.yayasan.imageUrl && (
                  <div className="mt-2 relative inline-block">
                    <img src={activeData.yayasan.imageUrl} alt="Preview" className="w-32 h-auto rounded-lg border shadow-sm" />
                    <button onClick={() => updateYayasan("imageUrl", "")} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"><X className="w-3 h-3" /></button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" checked={activeData.yayasan.isVerified} onChange={e => updateYayasan("isVerified", e.target.checked)} id="verif-yayasan" className="w-4 h-4" />
                <label htmlFor="verif-yayasan" className="text-sm font-semibold cursor-pointer">Centang Verifikasi Biru (Yayasan)</label>
              </div>
            </div>
          </section>

          {/* Data SPPG Form */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Data SPPG</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold">Nama SPPG</label>
                <input type="text" value={activeData.sppg.namaSPPG} onChange={e => updateSPPG("namaSPPG", e.target.value)} className="w-full border p-2 rounded-lg mt-1" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold">ID SPPG</label>
                  <input type="text" value={activeData.sppg.idSPPG} onChange={e => updateSPPG("idSPPG", e.target.value)} className="w-full border p-2 rounded-lg mt-1" />
                </div>
                <div>
                  <label className="block text-sm font-semibold">Status Badge</label>
                  <input type="text" value={activeData.sppg.statusBadge} onChange={e => updateSPPG("statusBadge", e.target.value)} className="w-full border p-2 rounded-lg mt-1" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold">Yayasan Terkait</label>
                <input type="text" value={activeData.sppg.yayasanTerkait} onChange={e => updateSPPG("yayasanTerkait", e.target.value)} className="w-full border p-2 rounded-lg mt-1" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" checked={activeData.sppg.isVerified} onChange={e => updateSPPG("isVerified", e.target.checked)} id="verif-sppg" className="w-4 h-4" />
                <label htmlFor="verif-sppg" className="text-sm font-semibold cursor-pointer">Centang Verifikasi Biru (SPPG)</label>
              </div>
            </div>
          </section>
        </div>

        {/* Map Coordinates Form */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
          <h2 className="text-lg font-bold mb-4 border-b pb-2">Pengaturan Koordinat Peta</h2>
          <p className="text-sm text-gray-500 mb-4">Klik pada peta di bawah ini untuk mengubah titik koordinat secara otomatis.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold">Latitude</label>
              <input 
                type="number" 
                step="any"
                value={activeData.sppg.location.latitude} 
                onChange={e => updateSPPG("location", { ...activeData.sppg.location, latitude: parseFloat(e.target.value) })}
                className="w-full border p-2 rounded-lg mt-1" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">Longitude</label>
              <input 
                type="number" 
                step="any"
                value={activeData.sppg.location.longitude} 
                onChange={e => updateSPPG("location", { ...activeData.sppg.location, longitude: parseFloat(e.target.value) })}
                className="w-full border p-2 rounded-lg mt-1" 
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold">Label Titik Peta</label>
            <input 
              type="text" 
              value={activeData.sppg.location.label} 
              onChange={e => updateSPPG("location", { ...activeData.sppg.location, label: e.target.value })}
              className="w-full border p-2 rounded-lg mt-1" 
            />
          </div>

          <div className="h-80 rounded-xl overflow-hidden border-4 border-gray-300 relative">
            <InteractiveMap
              lat={activeData.sppg.location.latitude}
              lng={activeData.sppg.location.longitude}
              zoom={activeData.sppg.location.zoomLevel}
              label={activeData.sppg.location.label}
              editable={true}
              onLocationChange={(lat, lng) => updateSPPG("location", { ...activeData.sppg.location, latitude: lat, longitude: lng })}
            />
          </div>
        </section>
      </main>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative flex flex-col items-center text-center">
            <button 
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition bg-gray-100 rounded-full p-2"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Berhasil Disimpan!</h3>
            <p className="text-gray-500 mb-6 text-sm">
              Scan barcode di bawah ini untuk melihat hasil konfigurasi pada halaman publik.
            </p>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-inner mb-6 inline-block flex flex-col items-center gap-4">
              <QRCodeCanvas id="qr-canvas" value={publicUrl} size={200} level="H" />
              <button 
                onClick={downloadQR}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl transition shadow-sm text-sm w-full"
              >
                <Download className="w-4 h-4" />
                Download QR Code
              </button>
            </div>

            <div className="w-full">
              <label className="block text-xs font-bold text-gray-500 mb-1 text-left uppercase tracking-wider">Tautan Unik Anda</label>
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
                  title="Buka di tab baru"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
