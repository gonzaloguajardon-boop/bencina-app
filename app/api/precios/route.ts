import { NextRequest, NextResponse } from "next/server";

function distancia(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function POST(req: NextRequest) {
  const { lat, lon, ciudad } = await req.json();

  try {
    const res = await fetch(
      "https://api.bencinaenlinea.cl/api/Estaciones/GetAll",
      { headers: { "Accept": "application/json" }, next: { revalidate: 3600 } }
    );

    if (!res.ok) throw new Error("Sin respuesta de bencinaenlinea.cl");

    const estaciones: any[] = await res.json();

    // Filtrar las 5 más cercanas con precio
    const cercanas = estaciones
      .filter((e) => e.Latitud && e.Longitud && e.Precios?.length > 0)
      .map((e) => ({ ...e, dist: distancia(lat, lon, e.Latitud, e.Longitud) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 5);

    if (cercanas.length === 0) {
      return NextResponse.json({ precios: "No se encontraron estaciones cercanas." });
    }

    const lineas = cercanas.map((e) => {
      const p93 = e.Precios.find((p: any) => p.TipoCombustible?.includes("93"))?.Precio;
      const p95 = e.Precios.find((p: any) => p.TipoCombustible?.includes("95"))?.Precio;
      const p97 = e.Precios.find((p: any) => p.TipoCombustible?.includes("97"))?.Precio;
      const dist = e.dist < 1 ? `${Math.round(e.dist * 1000)}m` : `${e.dist.toFixed(1)}km`;
      return `📍 ${e.Nombre} (${dist})\n93: $${p93 ?? "—"} · 95: $${p95 ?? "—"} · 97: $${p97 ?? "—"}`;
    });

    return NextResponse.json({ precios: lineas.join("\n\n") });

  } catch (err: any) {
    return NextResponse.json({ precios: "Error: " + err.message });
  }
}