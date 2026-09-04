"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { DashboardConfigs, DashboardState, defaultState } from "@/types/dashboard";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

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
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  
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
      setIsSaving(true);
      const res = await fetch("/api/configs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configs)
      });
      if (res.ok) {
        router.push("/secure-mbg/qr/" + activeId);
      } else {
        alert("Gagal menyimpan ke database. Mungkin ukuran file terlalu besar.");
      }
    } catch (e) {
      alert("Error saat menyimpan: " + e);
    } finally {
      setIsSaving(false);
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



  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateExtendedFlat = (key: string, value: any) => {
    if (!activeId) return;
    setConfigs(prev => {
      const ext = prev[activeId].extendedData || {
        noBaVerval: "", tglBaVerval: "", statusOperasional: "Beroperasi", tglOperasional: "", kodeSppg: "", provinsiSppg: "", kabKotaSppg: "", kecamatanSppg: "", kelurahanDesaSppg: "", alamatSppg: "", kodePosSppg: "", jenisBangunanSppg: "", jenisSppg: "", provinsiYayasan: "", kabKotaYayasan: "", kecamatanYayasan: "", kelurahanDesaYayasan: "", alamatYayasan: "", kodePosYayasan: "", bank: { namaBank: "", noRekening: "", namaPemilikRekening: "", namaBankVA: "", noVA: "", namaVA: "" }, pic: { namaPic: "", nikPic: "", emailPic: "", noHpPic: "" }, kasatpel: { namaKasatpel: "", emailKasatpel: "", noHpKasatpel: "", nikKasatpel: "", noSkepKasatpel: "", tglSkepKasatpel: "" }, mitra: { jenisMitra: "", namaMitra: "", namaPimpinanMitra: "", noHpMitra: "", emailMitra: "", bentukDukunganMitra: "", provinsiMitra: "", kabKotaMitra: "", kecamatanMitra: "", kelurahanDesaMitra: "", alamatMitra: "", kodePosMitra: "" }
      };
      return {
        ...prev,
        [activeId]: {
          ...prev[activeId],
          extendedData: { ...ext, [key]: value }
        }
      };
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateExtendedNested = (section: 'bank'|'pic'|'kasatpel'|'mitra', key: string, value: any) => {
    if (!activeId) return;
    setConfigs(prev => {
      const ext = prev[activeId].extendedData || {
        noBaVerval: "", tglBaVerval: "", statusOperasional: "Beroperasi", tglOperasional: "", kodeSppg: "", provinsiSppg: "", kabKotaSppg: "", kecamatanSppg: "", kelurahanDesaSppg: "", alamatSppg: "", kodePosSppg: "", jenisBangunanSppg: "", jenisSppg: "", provinsiYayasan: "", kabKotaYayasan: "", kecamatanYayasan: "", kelurahanDesaYayasan: "", alamatYayasan: "", kodePosYayasan: "", bank: { namaBank: "", noRekening: "", namaPemilikRekening: "", namaBankVA: "", noVA: "", namaVA: "" }, pic: { namaPic: "", nikPic: "", emailPic: "", noHpPic: "" }, kasatpel: { namaKasatpel: "", emailKasatpel: "", noHpKasatpel: "", nikKasatpel: "", noSkepKasatpel: "", tglSkepKasatpel: "" }, mitra: { jenisMitra: "", namaMitra: "", namaPimpinanMitra: "", noHpMitra: "", emailMitra: "", bentukDukunganMitra: "", provinsiMitra: "", kabKotaMitra: "", kecamatanMitra: "", kelurahanDesaMitra: "", alamatMitra: "", kodePosMitra: "" }
      };
      return {
        ...prev,
        [activeId]: {
          ...prev[activeId],
          extendedData: {
            ...ext,
            [section]: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ...(ext[section] as any),
              [key]: value
            }
          }
        }
      };
    });
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
  const ext = activeData?.extendedData || { noBaVerval: '', tglBaVerval: '', statusOperasional: 'Beroperasi', tglOperasional: '', kodeSppg: '', provinsiSppg: '', kabKotaSppg: '', kecamatanSppg: '', kelurahanDesaSppg: '', alamatSppg: '', kodePosSppg: '', jenisBangunanSppg: '', jenisSppg: '', provinsiYayasan: '', kabKotaYayasan: '', kecamatanYayasan: '', kelurahanDesaYayasan: '', alamatYayasan: '', kodePosYayasan: '', bank: {namaBank:'', noRekening:'', namaPemilikRekening:'', namaBankVA:'', noVA:'', namaVA:''}, pic: {namaPic:'', nikPic:'', emailPic:'', noHpPic:''}, kasatpel: {namaKasatpel:'', emailKasatpel:'', noHpKasatpel:'', nikKasatpel:'', noSkepKasatpel:'', tglSkepKasatpel:''}, mitra: {jenisMitra:'', namaMitra:'', namaPimpinanMitra:'', noHpMitra:'', emailMitra:'', bentukDukunganMitra:'', provinsiMitra:'', kabKotaMitra:'', kecamatanMitra:'', kelurahanDesaMitra:'', alamatMitra:'', kodePosMitra:''} };
  if (!activeData) return null;



  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 sticky top-0 z-50">
        <h1 className="text-lg sm:text-xl font-bold text-center sm:text-left">Admin - Manajemen Multi-Konfigurasi</h1>
        <div className="flex w-full sm:w-auto justify-center sm:justify-end gap-2 sm:gap-4">
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className={`text-white px-4 py-2 rounded-lg font-semibold transition ${isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSaving ? "Menyimpan..." : "Simpan Konfigurasi"}
          </button>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition">
            Logout
          </button>
        </div>
      </header>

      {/* Tabs / Pagination */}
      <div className="bg-white border-b overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center gap-2">
          {Object.keys(configs).map((id, index) => (
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

              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" checked={activeData.yayasan.isVerified} onChange={e => updateYayasan("isVerified", e.target.checked)} id="verif-yayasan" className="w-4 h-4" />
                <label htmlFor="verif-yayasan" className="text-sm font-semibold cursor-pointer">Centang Verifikasi Biru (Yayasan)</label>
              </div>

              <h3 className="font-semibold text-gray-700 mt-4 mb-2">Alamat Lengkap Yayasan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold">Provinsi</label><input type="text" value={ext.provinsiYayasan} onChange={e => updateExtendedFlat("provinsiYayasan", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
                <div><label className="block text-sm font-semibold">Kab./Kota</label><input type="text" value={ext.kabKotaYayasan} onChange={e => updateExtendedFlat("kabKotaYayasan", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
                <div><label className="block text-sm font-semibold">Kecamatan</label><input type="text" value={ext.kecamatanYayasan} onChange={e => updateExtendedFlat("kecamatanYayasan", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
                <div><label className="block text-sm font-semibold">Kelurahan/Desa</label><input type="text" value={ext.kelurahanDesaYayasan} onChange={e => updateExtendedFlat("kelurahanDesaYayasan", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
              </div>
              <div><label className="block text-sm font-semibold">Alamat</label><textarea value={ext.alamatYayasan} onChange={e => updateExtendedFlat("alamatYayasan", e.target.value)} className="w-full border p-2 rounded-lg mt-1"></textarea></div>
              <div><label className="block text-sm font-semibold">Kode Pos</label><input type="text" value={ext.kodePosYayasan} onChange={e => updateExtendedFlat("kodePosYayasan", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>

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

              <h3 className="font-semibold text-gray-700 mt-4 mb-2">Detail Operasional & Bangunan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold">Nomor BA. Verval</label><input type="text" value={ext.noBaVerval} onChange={e => updateExtendedFlat("noBaVerval", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
                <div><label className="block text-sm font-semibold">Tanggal BA. Verval</label><input type="date" value={ext.tglBaVerval} onChange={e => updateExtendedFlat("tglBaVerval", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
                <div>
                  <label className="block text-sm font-semibold">Status Operasional</label>
                  <select value={ext.statusOperasional} onChange={e => updateExtendedFlat("statusOperasional", e.target.value)} className="w-full border p-2 rounded-lg mt-1">
                    <option value="Beroperasi">Beroperasi</option>
                    <option value="Tidak Beroperasi">Tidak Beroperasi</option>
                  </select>
                </div>
                <div><label className="block text-sm font-semibold">Tanggal Operasional/Rencana</label><input type="date" value={ext.tglOperasional} onChange={e => updateExtendedFlat("tglOperasional", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
                <div><label className="block text-sm font-semibold">Kode SPPG</label><input type="text" value={ext.kodeSppg} onChange={e => updateExtendedFlat("kodeSppg", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
                <div><label className="block text-sm font-semibold">Jenis / Asal Bangunan SPPG</label><input type="text" value={ext.jenisBangunanSppg} onChange={e => updateExtendedFlat("jenisBangunanSppg", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
                <div><label className="block text-sm font-semibold">Jenis SPPG</label><input type="text" value={ext.jenisSppg} onChange={e => updateExtendedFlat("jenisSppg", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
              </div>
              <h3 className="font-semibold text-gray-700 mt-4 mb-2">Alamat Lengkap SPPG</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-semibold">Provinsi</label><input type="text" value={ext.provinsiSppg} onChange={e => updateExtendedFlat("provinsiSppg", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
                <div><label className="block text-sm font-semibold">Kab./Kota</label><input type="text" value={ext.kabKotaSppg} onChange={e => updateExtendedFlat("kabKotaSppg", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
                <div><label className="block text-sm font-semibold">Kecamatan</label><input type="text" value={ext.kecamatanSppg} onChange={e => updateExtendedFlat("kecamatanSppg", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
                <div><label className="block text-sm font-semibold">Kelurahan/Desa</label><input type="text" value={ext.kelurahanDesaSppg} onChange={e => updateExtendedFlat("kelurahanDesaSppg", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
              </div>
              <div><label className="block text-sm font-semibold">Alamat</label><textarea value={ext.alamatSppg} onChange={e => updateExtendedFlat("alamatSppg", e.target.value)} className="w-full border p-2 rounded-lg mt-1"></textarea></div>
              <div><label className="block text-sm font-semibold">Kode Pos</label><input type="text" value={ext.kodePosSppg} onChange={e => updateExtendedFlat("kodePosSppg", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>

            </div>
          </section>
        
        </div>
        
        <div className="space-y-8">
          {/* Bank */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Data Bank/Rekening Yayasan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-semibold">Nama Bank</label><input type="text" value={ext.bank.namaBank} onChange={e => updateExtendedNested("bank", "namaBank", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
              <div><label className="block text-sm font-semibold">Nomor Rekening</label><input type="text" value={ext.bank.noRekening} onChange={e => updateExtendedNested("bank", "noRekening", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
              <div><label className="block text-sm font-semibold">Nama Pemilik Rekening</label><input type="text" value={ext.bank.namaPemilikRekening} onChange={e => updateExtendedNested("bank", "namaPemilikRekening", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
              <div><label className="block text-sm font-semibold">Nama Bank Virtual Account</label><input type="text" value={ext.bank.namaBankVA} onChange={e => updateExtendedNested("bank", "namaBankVA", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
              <div><label className="block text-sm font-semibold">Nomor Virtual Account</label><input type="text" value={ext.bank.noVA} onChange={e => updateExtendedNested("bank", "noVA", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
              <div><label className="block text-sm font-semibold">Nama Virtual Account</label><input type="text" value={ext.bank.namaVA} onChange={e => updateExtendedNested("bank", "namaVA", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
            </div>
          </section>

          {/* PIC */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Data Perwakilan (PIC) Yayasan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-semibold">Nama Perwakilan</label><input type="text" value={ext.pic.namaPic} onChange={e => updateExtendedNested("pic", "namaPic", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
              <div><label className="block text-sm font-semibold">NIK</label><input type="text" value={ext.pic.nikPic} onChange={e => updateExtendedNested("pic", "nikPic", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
              <div><label className="block text-sm font-semibold">Email</label><input type="email" value={ext.pic.emailPic} onChange={e => updateExtendedNested("pic", "emailPic", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
              <div><label className="block text-sm font-semibold">No. HP/Telepon</label><input type="text" value={ext.pic.noHpPic} onChange={e => updateExtendedNested("pic", "noHpPic", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
            </div>
          </section>

          {/* Kasatpel */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Data SPPI/Kasatpel/Ka SPPG</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-semibold">Nama</label><input type="text" value={ext.kasatpel.namaKasatpel} onChange={e => updateExtendedNested("kasatpel", "namaKasatpel", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
              <div><label className="block text-sm font-semibold">Email</label><input type="email" value={ext.kasatpel.emailKasatpel} onChange={e => updateExtendedNested("kasatpel", "emailKasatpel", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
              <div><label className="block text-sm font-semibold">No. HP/Telepon</label><input type="text" value={ext.kasatpel.noHpKasatpel} onChange={e => updateExtendedNested("kasatpel", "noHpKasatpel", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
              <div><label className="block text-sm font-semibold">NIK</label><input type="text" value={ext.kasatpel.nikKasatpel} onChange={e => updateExtendedNested("kasatpel", "nikKasatpel", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
              <div><label className="block text-sm font-semibold">Nomor SKEP</label><input type="text" value={ext.kasatpel.noSkepKasatpel} onChange={e => updateExtendedNested("kasatpel", "noSkepKasatpel", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
              <div><label className="block text-sm font-semibold">Tanggal SKEP</label><input type="date" value={ext.kasatpel.tglSkepKasatpel} onChange={e => updateExtendedNested("kasatpel", "tglSkepKasatpel", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
            </div>
          </section>

          {/* Mitra */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold mb-4 border-b pb-2">Identitas Mitra</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-semibold">Jenis Mitra/Instansi</label><input type="text" value={ext.mitra.jenisMitra} onChange={e => updateExtendedNested("mitra", "jenisMitra", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
              <div><label className="block text-sm font-semibold">Nama Mitra/Instansi</label><input type="text" value={ext.mitra.namaMitra} onChange={e => updateExtendedNested("mitra", "namaMitra", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
              <div><label className="block text-sm font-semibold">Nama Pimpinan</label><input type="text" value={ext.mitra.namaPimpinanMitra} onChange={e => updateExtendedNested("mitra", "namaPimpinanMitra", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
              <div><label className="block text-sm font-semibold">No. HP/Telepon</label><input type="text" value={ext.mitra.noHpMitra} onChange={e => updateExtendedNested("mitra", "noHpMitra", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
              <div><label className="block text-sm font-semibold">Email</label><input type="email" value={ext.mitra.emailMitra} onChange={e => updateExtendedNested("mitra", "emailMitra", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
              <div><label className="block text-sm font-semibold">Bentuk Dukungan/Aset</label><input type="text" value={ext.mitra.bentukDukunganMitra} onChange={e => updateExtendedNested("mitra", "bentukDukunganMitra", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
            </div>
            <h3 className="font-semibold text-gray-700 mt-4 mb-2">Alamat Lengkap Mitra</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="block text-sm font-semibold">Provinsi</label><input type="text" value={ext.mitra.provinsiMitra} onChange={e => updateExtendedNested("mitra", "provinsiMitra", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
              <div><label className="block text-sm font-semibold">Kab./Kota</label><input type="text" value={ext.mitra.kabKotaMitra} onChange={e => updateExtendedNested("mitra", "kabKotaMitra", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
              <div><label className="block text-sm font-semibold">Kecamatan</label><input type="text" value={ext.mitra.kecamatanMitra} onChange={e => updateExtendedNested("mitra", "kecamatanMitra", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
              <div><label className="block text-sm font-semibold">Kelurahan/Desa</label><input type="text" value={ext.mitra.kelurahanDesaMitra} onChange={e => updateExtendedNested("mitra", "kelurahanDesaMitra", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
            </div>
            <div className="mt-4"><label className="block text-sm font-semibold">Alamat</label><textarea value={ext.mitra.alamatMitra} onChange={e => updateExtendedNested("mitra", "alamatMitra", e.target.value)} className="w-full border p-2 rounded-lg mt-1"></textarea></div>
            <div className="mt-4"><label className="block text-sm font-semibold">Kode Pos</label><input type="text" value={ext.mitra.kodePosMitra} onChange={e => updateExtendedNested("mitra", "kodePosMitra", e.target.value)} className="w-full border p-2 rounded-lg mt-1" /></div>
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

    </div>
  );
}
