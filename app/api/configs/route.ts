import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { DashboardState } from "@/types/dashboard";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const configs = await prisma.dashboardConfig.findMany();
    return NextResponse.json(configs);
  } catch {
    return NextResponse.json({ error: "Failed to fetch configs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, DashboardState>;
    // To match the DashboardConfigs structure: { [id]: DashboardState }
    // We will clear existing and insert new ones, or just upsert.
    // Given the admin page sends the whole configs object:
    
    // Clear all existing configs (this is a simple sync mechanism for MVP)
    await prisma.dashboardConfig.deleteMany();

    const dataToInsert = Object.entries(body).map(([id, state]) => ({
      id: id,
      namaYayasan: state.yayasan.namaYayasan,
      isVerifiedYay: state.yayasan.isVerified,
      idMitra: state.yayasan.idMitra,
      npwp: state.yayasan.npwp,
      nomorPonsel: state.yayasan.nomorPonsel,
      email: state.yayasan.email,
      imageUrl: state.yayasan.imageUrl || null,
      namaSPPG: state.sppg.namaSPPG,
      isVerifiedSppg: state.sppg.isVerified,
      idSPPG: state.sppg.idSPPG,
      yayasanTerkait: state.sppg.yayasanTerkait,
      statusBadge: state.sppg.statusBadge,
      lat: state.sppg.location.latitude,
      lng: state.sppg.location.longitude,
      zoomLevel: state.sppg.location.zoomLevel,
      mapLabel: state.sppg.location.label,
    }));

    if (dataToInsert.length > 0) {
      await prisma.dashboardConfig.createMany({
        data: dataToInsert,
      });
    }

    return NextResponse.json({ message: "Konfigurasi berhasil disimpan ke database" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save configs" }, { status: 500 });
  }
}
