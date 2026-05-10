import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { ciudad } = await req.json();

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "web-search-2025-03-05",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{
        role: "user",
        content: `Busca el precio actual de bencina 93, 95 y 97 octanos en ${ciudad}, Chile, mayo 2026. Responde SOLO con este formato exacto, sin texto adicional:
93: $X.XXX
95: $X.XXX  
97: $X.XXX
Fuente: [nombre sitio]`,
      }],
    }),
  });

  const data = await res.json();
  const texto = data.content
    ?.filter((b: any) => b.type === "text")
    .map((b: any) => b.text)
    .join("\n") || "Sin datos disponibles";

  return NextResponse.json({ precios: texto });
}