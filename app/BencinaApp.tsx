"use client";
import { useState } from "react";

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const DISCOUNTS: Record<number, any[]> = {
  0: [
    { bencinera: "Shell",  tarjeta: "Banco BICE",      descuento: 100, tipo: "Crédito",   condicion: "App Shell · Tope $5.000/mes" },
    { bencinera: "Aramco", tarjeta: "Spin Visa",        descuento: 150, tipo: "Crédito",   condicion: "Tarjeta física o App Aramco · Tope $10.000/mes" },
  ],
  1: [
    { bencinera: "Aramco", tarjeta: "Banco Consorcio",  descuento: 150, tipo: "Crédito",   condicion: "App Aramco · Tope $10.000/mes" },
    { bencinera: "Copec",  tarjeta: "Cencosud Scotiabank Black", descuento: 100, tipo: "Crédito", condicion: "App Copec · Tope $10.000/mes" },
    { bencinera: "Copec",  tarjeta: "Jumbo Prime",      descuento: 100, tipo: "Fidelización", condicion: "Código desde Jumbo Prime · Tope 100L" },
    { bencinera: "Copec",  tarjeta: "Mercado Pago",     descuento: 100, tipo: "Prepago",   condicion: "App Copec · Máx. 1 carga de 40L/mes" },
  ],
  2: [
    { bencinera: "Shell",  tarjeta: "Lider BCI",        descuento: 100, tipo: "Crédito",   condicion: "App Shell · Tope $4.000, 2 cargas/mes" },
    { bencinera: "Copec",  tarjeta: "Banco Internacional", descuento: 100, tipo: "Crédito", condicion: "App Copec · Mastercard Clásica/Gold/Black" },
    { bencinera: "Copec",  tarjeta: "Itaú Legend",      descuento: 100, tipo: "Crédito",   condicion: "App Copec · Requiere cupón en sitio Itaú" },
    { bencinera: "Aramco", tarjeta: "Mercado Pago",     descuento: 50,  tipo: "Prepago",   condicion: "App Aramco · Tope $5.000/mes" },
  ],
  3: [
    { bencinera: "Aramco", tarjeta: "Ripley Gold",      descuento: 150, tipo: "Crédito",   condicion: "App Aramco o físico · Tope $8.000/mes" },
    { bencinera: "Aramco", tarjeta: "Ripley Silver",    descuento: 125, tipo: "Crédito",   condicion: "App Aramco o físico · Tope $8.000/mes" },
    { bencinera: "Copec",  tarjeta: "Scotiabank Visa",  descuento: 100, tipo: "Crédito",   condicion: "App Copec · Singular hasta $100/L" },
    { bencinera: "Copec",  tarjeta: "Automóvil Club",   descuento: 50,  tipo: "Club",      condicion: "App Copec · Socios Plan Movilidad · Tope $10.000" },
  ],
  4: [
    { bencinera: "Copec",  tarjeta: "Coopeuch Crédito", descuento: 200, tipo: "Crédito",   condicion: "App Copec · Abono en cuenta en 10 días hábiles" },
    { bencinera: "Copec",  tarjeta: "BCI",              descuento: null, porcentaje: 7, tipo: "Crédito", condicion: "Cashback · App Copec · Tope $7.000/día" },
    { bencinera: "Aramco", tarjeta: "Abc Visa",         descuento: 150, tipo: "Crédito",   condicion: "App Aramco · Tope $10.000/mes" },
    { bencinera: "Copec",  tarjeta: "Coopeuch Débito",  descuento: 100, tipo: "Débito",    condicion: "App Copec · Dale Coopeuch" },
  ],
  5: [
    { bencinera: "Copec/Shell/Aramco", tarjeta: "Tenpo", descuento: 300, tipo: "Prepago", condicion: "App bencinera · Tope $4.000, 2 cargas/mes" },
    { bencinera: "Copec",  tarjeta: "Itaú Legend",      descuento: 100, tipo: "Crédito",   condicion: "App Copec · Requiere cupón Itaú" },
  ],
  6: [
    { bencinera: "Shell",  tarjeta: "Scotiabank Visa",  descuento: 200, tipo: "Crédito",   condicion: "App Shell · Tope 50L por carga, 5 cargas/mes" },
    { bencinera: "Copec",  tarjeta: "MACHBANK",         descuento: 100, tipo: "Crédito",   condicion: "App Copec · Tarjeta virtual" },
  ],
};

const BRAND_COLORS: Record<string, string> = {
  Copec: "#E8192C",
  Shell: "#DD1D21",
  Aramco: "#00703C",
  "Copec/Shell/Aramco": "#7C3AED",
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  Crédito:      { bg: "rgba(99,102,241,0.15)", text: "#a5b4fc" },
  Débito:       { bg: "rgba(14,165,233,0.15)", text: "#7dd3fc" },
  Prepago:      { bg: "rgba(16,185,129,0.15)", text: "#6ee7b7" },
  Fidelización: { bg: "rgba(245,158,11,0.15)", text: "#fcd34d" },
  Club:         { bg: "rgba(236,72,153,0.15)", text: "#f9a8d4" },
};

function Badge({ tipo }: { tipo: string }) {
  const c = TYPE_COLORS[tipo] || TYPE_COLORS["Crédito"];
  return (
    <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.05em", padding: "2px 8px", borderRadius: "20px", background: c.bg, color: c.text }}>
      {tipo}
    </span>
  );
}

function DiscountCard({ item, rank }: { item: any; rank: number }) {
  const brandColor = BRAND_COLORS[item.bencinera] || "#6366f1";
  const isTop = rank === 0;
  return (
    <div style={{ background: isTop ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${isTop ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)"}`, borderLeft: `3px solid ${brandColor}`, borderRadius: "14px", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", flexWrap: "wrap" as const }}>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: brandColor, fontFamily: "'Courier New', monospace" }}>{item.bencinera.toUpperCase()}</span>
          <Badge tipo={item.tipo} />
          {isTop && <span style={{ fontSize: "10px", color: "#fbbf24" }}>★ MEJOR</span>}
        </div>
        <div style={{ fontSize: "14px", fontWeight: 600, color: "#f1f5f9", marginBottom: "4px" }}>{item.tarjeta}</div>
        <div style={{ fontSize: "11px", color: "#64748b", lineHeight: 1.4 }}>{item.condicion}</div>
      </div>
      <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: item.porcentaje ? "20px" : "22px", fontWeight: 700, color: isTop ? "#4ade80" : "#e2e8f0", lineHeight: 1 }}>
          {item.porcentaje ? `${item.porcentaje}%` : `-$${item.descuento}`}
        </div>
        <div style={{ fontSize: "10px", color: "#475569", marginTop: "2px" }}>{item.porcentaje ? "cashback" : "por litro"}</div>
      </div>
    </div>
  );
}

export default function BencinaApp() {
  const today = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState(today);
  const [view, setView] = useState("hoy");

  const todayDeals = (DISCOUNTS[today] || []).slice().sort((a: any, b: any) => (b.descuento || 0) - (a.descuento || 0));
  const selectedDeals = (DISCOUNTS[selectedDay] || []).slice().sort((a: any, b: any) => (b.descuento || 0) - (a.descuento || 0));
  const bestToday = todayDeals[0];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e2e8f0", fontFamily: "'Georgia', serif", maxWidth: "480px", margin: "0 auto" }}>
      <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#475569", fontFamily: "'Courier New', monospace", marginBottom: "4px" }}>⛽ BENCINA 93 · PADRE HURTADO</div>
            <div style={{ fontSize: "26px", fontWeight: 700, lineHeight: 1, color: "#f8fafc" }}>Descuentos</div>
            <div style={{ fontSize: "26px", fontWeight: 700, lineHeight: 1, color: "#4ade80" }}>del Día</div>
          </div>
          <div style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: "12px", padding: "8px 14px", textAlign: "center" as const }}>
            <div style={{ fontSize: "10px", color: "#4ade80", letterSpacing: "1px", fontFamily: "'Courier New', monospace" }}>HOY</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#f1f5f9", lineHeight: 1.2 }}>{DAYS[today]}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "4px", marginTop: "16px" }}>
          {["hoy", "semana"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ flex: 1, padding: "8px", borderRadius: "10px", border: "none", background: view === v ? "rgba(255,255,255,0.1)" : "transparent", color: view === v ? "#f1f5f9" : "#475569", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "'Georgia', serif" }}>
              {v === "hoy" ? `📍 Hoy (${DAYS[today]})` : "📅 Semana completa"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 20px 40px" }}>
        {view === "hoy" && (
          <>
            {bestToday && (
              <div style={{ background: "linear-gradient(135deg, rgba(74,222,128,0.12), rgba(16,185,129,0.06))", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "16px", padding: "16px", marginBottom: "16px" }}>
                <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#4ade80", marginBottom: "8px", fontFamily: "'Courier New', monospace" }}>🏆 MEJOR DESCUENTO HOY</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: 700 }}>{bestToday.tarjeta}</div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{bestToday.bencinera}</div>
                  </div>
                  <div style={{ fontFamily: "'Courier New', monospace", fontSize: "32px", fontWeight: 700, color: "#4ade80", lineHeight: 1 }}>
                    {bestToday.porcentaje ? `${bestToday.porcentaje}%` : `-$${bestToday.descuento}`}
                    <span style={{ fontSize: "14px", color: "#6ee7b7" }}>/L</span>
                  </div>
                </div>
              </div>
            )}
            {todayDeals.length === 0 && <div style={{ textAlign: "center" as const, padding: "40px 20px", color: "#475569", fontSize: "14px" }}>No hay descuentos registrados para hoy.</div>}
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "10px" }}>
              {todayDeals.map((item: any, i: number) => <DiscountCard key={i} item={item} rank={i} />)}
            </div>
          </>
        )}

        {view === "semana" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "16px" }}>
              {DAYS.map((day, i) => {
                const count = (DISCOUNTS[i] || []).length;
                const isToday = i === today;
                const isSelected = i === selectedDay;
                return (
                  <button key={i} onClick={() => setSelectedDay(i)} style={{ padding: "8px 4px", borderRadius: "10px", border: isToday ? "1px solid rgba(74,222,128,0.4)" : "1px solid rgba(255,255,255,0.07)", background: isSelected ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)", color: isSelected ? "#f1f5f9" : "#64748b", cursor: "pointer", textAlign: "center" as const }}>
                    <div style={{ fontSize: "9px", letterSpacing: "0.5px", fontFamily: "'Courier New', monospace", marginBottom: "4px" }}>{day.slice(0, 3).toUpperCase()}</div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: count > 0 ? (isSelected ? "#4ade80" : "#94a3b8") : "#334155" }}>{count}</div>
                    {isToday && <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#4ade80", margin: "2px auto 0" }} />}
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "12px", fontFamily: "'Courier New', monospace" }}>
              {DAYS[selectedDay].toUpperCase()} · {selectedDeals.length} descuento{selectedDeals.length !== 1 ? "s" : ""}
              {selectedDay === today && <span style={{ color: "#4ade80", marginLeft: "8px" }}>← hoy</span>}
            </div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "10px" }}>
              {selectedDeals.map((item: any, i: number) => <DiscountCard key={i} item={item} rank={i} />)}
              {selectedDeals.length === 0 && <div style={{ textAlign: "center" as const, padding: "30px", color: "#334155", fontSize: "13px" }}>Sin descuentos este día</div>}
            </div>
          </>
        )}

        <div style={{ marginTop: "24px", padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: "10px", color: "#334155", textAlign: "center" as const, lineHeight: 1.6 }}>
          Descuentos válidos en estaciones Copec, Shell y Aramco adheridas.<br />
          Verifica disponibilidad en Padre Hurtado en <span style={{ color: "#475569" }}>bencinaenlinea.cl</span><br />
          Datos actualizados a mayo 2026 · Sujeto a cambios sin previo aviso.
        </div>
      </div>
    </div>
  );
}