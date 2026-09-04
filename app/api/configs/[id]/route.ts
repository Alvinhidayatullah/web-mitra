import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const config = await prisma.dashboardConfig.findUnique({
      where: {
        id: params.id
      }
    });

    if (!config) {
      return NextResponse.json({ error: "Config not found" }, { status: 404 });
    }

    // Convert back to DashboardState structure
    const dashboardState = {
      yayasan: {
        namaYayasan: config.namaYayasan,
        isVerified: config.isVerifiedYay,
        idMitra: config.idMitra,
        npwp: config.npwp,
        nomorPonsel: config.nomorPonsel,
        email: config.email,
        imageUrl: config.imageUrl || "",
      },
      sppg: {
        namaSPPG: config.namaSPPG,
        isVerified: config.isVerifiedSppg,
        idSPPG: config.idSPPG,
        yayasanTerkait: config.yayasanTerkait,
        statusBadge: config.statusBadge,
        location: {
          latitude: config.lat,
          longitude: config.lng,
          zoomLevel: config.zoomLevel,
          label: config.mapLabel,
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      extendedData: config.extendedData ? (config.extendedData as any) : undefined
    };

    return NextResponse.json(dashboardState);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch config" }, { status: 500 });
  }
}
