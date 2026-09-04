export interface GeoCoordinate {
  latitude: number;
  longitude: number;
  zoomLevel: number;
  label: string;
}

export interface YayasanConfig {
  namaYayasan: string;
  isVerified: boolean;
  idMitra: string;
  npwp: string;
  nomorPonsel: string;
  email: string;
  imageUrl?: string;
}

export interface SPPGConfig {
  namaSPPG: string;
  isVerified: boolean;
  idSPPG: string;
  yayasanTerkait: string;
  statusBadge: string;
  location: GeoCoordinate;
}

export interface BankConfig {
  namaBank: string;
  noRekening: string;
  namaPemilikRekening: string;
  namaBankVA: string;
  noVA: string;
  namaVA: string;
}

export interface PicConfig {
  namaPic: string;
  nikPic: string;
  emailPic: string;
  noHpPic: string;
}

export interface KasatpelConfig {
  namaKasatpel: string;
  emailKasatpel: string;
  noHpKasatpel: string;
  nikKasatpel: string;
  noSkepKasatpel: string;
  tglSkepKasatpel: string;
}

export interface MitraConfig {
  jenisMitra: string;
  namaMitra: string;
  namaPimpinanMitra: string;
  noHpMitra: string;
  emailMitra: string;
  bentukDukunganMitra: string;
  provinsiMitra: string;
  kabKotaMitra: string;
  kecamatanMitra: string;
  kelurahanDesaMitra: string;
  alamatMitra: string;
  kodePosMitra: string;
}

export interface ExtendedData {
  // Extra SPPG fields
  noBaVerval: string;
  tglBaVerval: string;
  statusOperasional: string;
  tglOperasional: string;
  kodeSppg: string;
  provinsiSppg: string;
  kabKotaSppg: string;
  kecamatanSppg: string;
  kelurahanDesaSppg: string;
  alamatSppg: string;
  kodePosSppg: string;
  jenisBangunanSppg: string;
  jenisSppg: string;

  // Extra Yayasan fields
  provinsiYayasan: string;
  kabKotaYayasan: string;
  kecamatanYayasan: string;
  kelurahanDesaYayasan: string;
  alamatYayasan: string;
  kodePosYayasan: string;

  bank: BankConfig;
  pic: PicConfig;
  kasatpel: KasatpelConfig;
  mitra: MitraConfig;
}

export interface DashboardState {
  yayasan: YayasanConfig;
  sppg: SPPGConfig;
  extendedData?: ExtendedData;
}

export const defaultState: DashboardState = {
  yayasan: {
    namaYayasan: "YAYASAN PPSS",
    isVerified: true,
    idMitra: "GHSYS7",
    npwp: "833",
    nomorPonsel: "085262",
    email: "adjd@gmail.com",
  },
  sppg: {
    namaSPPG: "SPPG YTTA",
    isVerified: true,
    idSPPG: "MS63",
    yayasanTerkait: "Yayasan PPSS",
    statusBadge: "Terdaftar",
    location: {
      latitude: -6.2088,
      longitude: 106.8456,
      zoomLevel: 13,
      label: "Titik Pengajuan Mitra",
    },
  },
  extendedData: {
    noBaVerval: "",
    tglBaVerval: "",
    statusOperasional: "Beroperasi",
    tglOperasional: "",
    kodeSppg: "",
    provinsiSppg: "",
    kabKotaSppg: "",
    kecamatanSppg: "",
    kelurahanDesaSppg: "",
    alamatSppg: "",
    kodePosSppg: "",
    jenisBangunanSppg: "",
    jenisSppg: "",
    provinsiYayasan: "",
    kabKotaYayasan: "",
    kecamatanYayasan: "",
    kelurahanDesaYayasan: "",
    alamatYayasan: "",
    kodePosYayasan: "",
    bank: {
      namaBank: "",
      noRekening: "",
      namaPemilikRekening: "",
      namaBankVA: "",
      noVA: "",
      namaVA: "",
    },
    pic: {
      namaPic: "",
      nikPic: "",
      emailPic: "",
      noHpPic: "",
    },
    kasatpel: {
      namaKasatpel: "",
      emailKasatpel: "",
      noHpKasatpel: "",
      nikKasatpel: "",
      noSkepKasatpel: "",
      tglSkepKasatpel: "",
    },
    mitra: {
      jenisMitra: "",
      namaMitra: "",
      namaPimpinanMitra: "",
      noHpMitra: "",
      emailMitra: "",
      bentukDukunganMitra: "",
      provinsiMitra: "",
      kabKotaMitra: "",
      kecamatanMitra: "",
      kelurahanDesaMitra: "",
      alamatMitra: "",
      kodePosMitra: "",
    },
  }
};

export type DashboardConfigs = Record<string, DashboardState>;
