import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { ciudad } = await req.json();

  try {
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
        max_tokens: 1024,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{
          role: "user",
          content: `Busca en bencinaenlinea.cl el precio actual de bencina 93, 95 y 97 octanos en ${ciudad}, Chile. Dame solo los precios en este formato:
93: $X.XXX
95: $X.XXX
97: $X.XXX`,
        }],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ precios: `Error API: ${data.error?.message || res.status}` });
    }

    // Recorre todos los bloques y extrae texto
    const textos = (data.content || [])
      .filter((b: any) => b.type === "text" && b.text?.trim())
      .map((b: any) => b.text.trim());

    const texto = textos.length > 0 ? textos.join("\n") : "No se encontraron precios para " + ciudad;

    return NextResponse.json({ precios: texto });

  } catch (err: any) {
    return NextResponse.json({ precios: "Error al consultar: " + err.message });
  }
}