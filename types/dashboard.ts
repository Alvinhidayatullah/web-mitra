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

export interface DashboardState {
  yayasan: YayasanConfig;
  sppg: SPPGConfig;
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
};

export type DashboardConfigs = Record<string, DashboardState>;
