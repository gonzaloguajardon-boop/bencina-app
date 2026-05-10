"use client";
import { useState } from "react";

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

// Descuentos activos todos los días
const SIEMPRE: any[] = [
  { bencinera: "Shell",  tarjeta: "Banco Falabella",   descuento: 370, tipo: "Crédito",    condicion: "Solo nuevos clientes · App Shell · Tope $26.000 cashback/carga · Todos los días" },
  { bencinera: "Copec",  tarjeta: "App Copec",          descuento: 30,  tipo: "App",        condicion: "Cupones disponibles en la app Copec · Varían según disponibilidad" },
  { bencinera: "Copec",  tarjeta: "Santander Consumer", descuento: 50,  tipo: "Crédito",    condicion: "Clientes con crédito automotriz Santander Consumer al día · App Copec" },
  { bencinera: "Copec",  tarjeta: "Caja Los Andes",     descuento: 15,  tipo: "Caja",       condicion: "$10/L con Copec Pay · $15/L con código web Caja Los Andes · Todos los días" },
];

const DISCOUNTS: Record<number, any[]> = {
  0: [ // Domingo
    { bencinera: "Aramco", tarjeta: "Spin Visa",        descuento: 150, tipo: "Crédito",    condicion: "Tarjeta física o App Aramco Estaciones · Tope $10.000/mes" },
    { bencinera: "Shell",  tarjeta: "Banco BICE",       descuento: 100, tipo: "Crédito",    condicion: "App Shell · Tarjeta Limitless BICE · Tope $5.000/mes" },
  ],
  1: [ // Lunes
    { bencinera: "Aramco", tarjeta: "Banco Consorcio",  descuento: 150, tipo: "Crédito",    condicion: "App Aramco Estaciones · Tope $10.000/mes · No acumulable" },
    { bencinera: "Copec",  tarjeta: "Cencosud Scotiabank Black", descuento: 100, tipo: "Crédito", condicion: "App Copec · Black $100/L · Clásica/Platinum $50/L · Tope $10.000/mes" },
    { bencinera: "Copec",  tarjeta: "Jumbo Prime",      descuento: 100, tipo: "Fidelización", condicion: "App Copec · Tope 100L/mes · Socios activos" },
    { bencinera: "Copec",  tarjeta: "Mercado Pago",     descuento: 100, tipo: "Prepago",    condicion: "App Copec · Máx. 1 carga de 40L/mes por usuario" },
  ],
  2: [ // Martes
    { bencinera: "Shell",  tarjeta: "Lider BCI",        descuento: 100, tipo: "Crédito",    condicion: "App Shell · Tope $4.000/carga · Máx. 2 cargas/mes por RUT" },
    { bencinera: "Copec",  tarjeta: "Banco Internacional", descuento: 100, tipo: "Crédito", condicion: "App Copec · Mastercard Clásica, Gold o Black" },
    { bencinera: "Copec",  tarjeta: "Itaú Legend",      descuento: 100, tipo: "Crédito",    condicion: "App Copec · Requiere cupón desde sitio web Itaú" },
    { bencinera: "Copec",  tarjeta: "Rutpay BancoEstado", descuento: 100, tipo: "Débito",   condicion: "App Copec · Tope 50L/boleta · 1 vez por RUT/mes · No acumulable · Verificar vigencia" },
    { bencinera: "Aramco", tarjeta: "Mercado Pago",     descuento: 50,  tipo: "Prepago",    condicion: "App Aramco Estaciones · Tope $5.000/mes por titular" },
  ],
  3: [ // Miércoles
    { bencinera: "Aramco", tarjeta: "Ripley Gold",      descuento: 150, tipo: "Crédito",    condicion: "App Aramco o físico · Categoría Gold · Tope $8.000/mes" },
    { bencinera: "Aramco", tarjeta: "Ripley Silver",    descuento: 125, tipo: "Crédito",    condicion: "App Aramco o físico · Categoría Silver · Tope $8.000/mes" },
    { bencinera: "Aramco", tarjeta: "Ripley Plus",      descuento: 100, tipo: "Crédito",    condicion: "App Aramco o físico · Categoría Plus · Tope $8.000/mes" },
    { bencinera: "Copec",  tarjeta: "Scotiabank Singular", descuento: 100, tipo: "Crédito", condicion: "App Copec · Tarjeta Singular Scotiabank" },
    { bencinera: "Copec",  tarjeta: "Automóvil Club",   descuento: 50,  tipo: "Club",       condicion: "App Copec · Socios Plan Movilidad · Cupón semanal · Tope $10.000/mes" },
    { bencinera: "Shell",  tarjeta: "Código MIDCTO",    descuento: 15,  tipo: "App",        condicion: "App Shell · Ingresa código MIDCTO · Tope 70L · 1 carga/día" },
  ],
  4: [ // Jueves
    { bencinera: "Copec",  tarjeta: "Coopeuch Crédito", descuento: 200, tipo: "Crédito",    condicion: "App Copec · Abono en 10 días hábiles · Vigente hasta dic. 2026" },
    { bencinera: "Aramco", tarjeta: "Abc Visa",         descuento: 200, tipo: "Crédito",    condicion: "App Aramco Estaciones · Tope $10.000/mes" },
    { bencinera: "Copec",  tarjeta: "BCI Crédito",      descuento: null, porcentaje: 7, tipo: "Crédito", condicion: "Cashback vía App Copec · Tope $7.000/día" },
    { bencinera: "Copec",  tarjeta: "Coopeuch Débito",  descuento: 100, tipo: "Débito",     condicion: "App Copec · Tarjeta débito Coopeuch (Dale) · Vigente hasta dic. 2026" },
  ],
  5: [ // Viernes
    { bencinera: "Copec/Shell/Aramco", tarjeta: "Tenpo", descuento: 300, tipo: "Prepago",  condicion: "App de cada bencinera · Tope $4.000/carga · Máx. 2 cargas/mes · No acumulable" },
    { bencinera: "Copec",  tarjeta: "Itaú Legend",      descuento: 100, tipo: "Crédito",    condicion: "App Copec · Requiere cupón desde sitio web Itaú" },
  ],
  6: [ // Sábado
    { bencinera: "Shell",  tarjeta: "Scotiabank Visa",  descuento: 200, tipo: "Crédito",    condicion: "App Shell · Tope 50L/carga · Máx. 5 cargas/mes" },
    { bencinera: "Copec",  tarjeta: "MACHBANK",         descuento: 100, tipo: "Crédito",    condicion: "App Copec · Tarjeta virtual MACHBANK · No acumulable" },
    { bencinera: "Shell",  tarjeta: "Los Héroes Prepago", descuento: 100, tipo: "Prepago",  condicion: "App Shell · Cashback tarjeta prepago Los Héroes · Verificar tope" },
  ],
};

const BRAND_COLORS: Record<string, string> = {
  Copec: "#E8192C", Shell: "#DD1D21", Aramco: "#00703C", "Copec/Shell/Aramco": "#7C3AED",
};
const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  Crédito:      { bg: "rgba(99,102,241,0.15)",  text: "#a5b4fc" },
  Débito:       { bg: "rgba(14,165,233,0.15)",  text: "#7dd3fc" },
  Prepago:      { bg: "rgba(16,185,129,0.15)",  text: "#6ee7b7" },
  Fidelización: { bg: "rgba(245,158,11,0.15)",  text: "#fcd34d" },
  Club:         { bg: "rgba(236,72,153,0.15)",  text: "#f9a8d4" },
  App:          { bg: "rgba(251,191,36,0.15)",  text: "#fde68a" },
  Caja:         { bg: "rgba(168,85,247,0.15)",  text: "#d8b4fe" },
};

const s = {
  wrap:     { minHeight:"100vh", background:"#0a0a0f", color:"#e2e8f0", fontFamily:"Georgia,serif", maxWidth:"480px", margin:"0 auto" },
  mono:     { fontFamily:"'Courier New',monospace" },
  card:     (top: boolean, color: string) => ({ background: top?"rgba(255,255,255,0.06)":"rgba(255,255,255,0.03)", border:`1px solid ${top?"rgba(255,255,255,0.15)":"rgba(255,255,255,0.07)"}`, borderLeft:`3px solid ${color}`, borderRadius:"14px", padding:"14px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", gap:"12px" }),
  input:    { width:"100%", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"12px", padding:"12px 16px", color:"#f1f5f9", fontSize:"16px", fontFamily:"Georgia,serif", outline:"none", boxSizing:"border-box" as const },
  btn:      (active: boolean) => ({ flex:1, padding:"8px", borderRadius:"10px", border:"none", background:active?"rgba(255,255,255,0.1)":"transparent", color:active?"#f1f5f9":"#475569", fontSize:"13px", fontWeight:600, cursor:"pointer", fontFamily:"Georgia,serif" }),
  greenBox: { background:"linear-gradient(135deg,rgba(74,222,128,0.12),rgba(16,185,129,0.06))", border:"1px solid rgba(74,222,128,0.2)", borderRadius:"16px", padding:"16px", marginBottom:"16px" },
};

function Badge({ tipo }: { tipo: string }) {
  const c = TYPE_COLORS[tipo] || TYPE_COLORS["Crédito"];
  return <span style={{ fontSize:"10px", fontWeight:600, letterSpacing:"0.05em", padding:"2px 8px", borderRadius:"20px", background:c.bg, color:c.text }}>{tipo}</span>;
}

function DiscountCard({ item, rank }: { item: any; rank: number }) {
  const bc = BRAND_COLORS[item.bencinera] || "#6366f1";
  const top = rank === 0;
  return (
    <div style={s.card(top, bc)}>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"4px", flexWrap:"wrap" as const }}>
          <span style={{ ...s.mono, fontSize:"11px", fontWeight:700, letterSpacing:"0.08em", color:bc }}>{item.bencinera.toUpperCase()}</span>
          <Badge tipo={item.tipo} />
          {top && <span style={{ fontSize:"10px", color:"#fbbf24" }}>★ MEJOR</span>}
        </div>
        <div style={{ fontSize:"14px", fontWeight:600, color:"#f1f5f9", marginBottom:"4px" }}>{item.tarjeta}</div>
        <div style={{ fontSize:"11px", color:"#64748b", lineHeight:1.4 }}>{item.condicion}</div>
      </div>
      <div style={{ textAlign:"right" as const, flexShrink:0 }}>
        <div style={{ ...s.mono, fontSize:item.porcentaje?"20px":"22px", fontWeight:700, color:top?"#4ade80":"#e2e8f0", lineHeight:1 }}>
          {item.porcentaje ? `${item.porcentaje}%` : `-$${item.descuento}`}
        </div>
        <div style={{ fontSize:"10px", color:"#475569", marginTop:"2px" }}>{item.porcentaje?"cashback":"por litro"}</div>
      </div>
    </div>
  );
}

function SiempreSection() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom:"16px" }}>
      <button onClick={() => setOpen(!open)} style={{ width:"100%", background:"rgba(251,191,36,0.08)", border:"1px solid rgba(251,191,36,0.2)", borderRadius:"12px", padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", color:"#fde68a", fontSize:"12px", fontWeight:600, fontFamily:"Georgia,serif" }}>
        <span>⚡ Descuentos todos los días ({SIEMPRE.length})</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div style={{ display:"flex", flexDirection:"column" as const, gap:"8px", marginTop:"8px" }}>
          {SIEMPRE.map((item, i) => <DiscountCard key={i} item={item} rank={99} />)}
        </div>
      )}
    </div>
  );
}

function Calculadora({ today }: { today: number }) {
  const [litros, setLitros] = useState("");
  const allDeals = [...(DISCOUNTS[today] || []), ...SIEMPRE].sort((a: any, b: any) => (b.descuento||0)-(a.descuento||0));
  const L = parseFloat(litros) || 0;
  return (
    <div>
      <div style={{ marginBottom:"16px" }}>
        <div style={{ fontSize:"11px", color:"#475569", ...s.mono, letterSpacing:"2px", marginBottom:"8px" }}>LITROS A CARGAR</div>
        <input type="number" placeholder="Ej: 40" value={litros} onChange={e => setLitros(e.target.value)} style={s.input} />
      </div>
      {L > 0 && allDeals.length > 0 && (
        <>
          <div style={{ fontSize:"11px", color:"#4ade80", ...s.mono, letterSpacing:"2px", marginBottom:"12px" }}>
            AHORRO CON {L}L HOY ({DAYS[today].toUpperCase()})
          </div>
          <div style={{ display:"flex", flexDirection:"column" as const, gap:"10px" }}>
            {allDeals.map((item: any, i: number) => {
              const ahorro = item.porcentaje ? null : Math.round(L * item.descuento);
              const bc = BRAND_COLORS[item.bencinera] || "#6366f1";
              const top = i === 0;
              return (
                <div key={i} style={s.card(top, bc)}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"13px", fontWeight:600, color:"#f1f5f9" }}>{item.tarjeta}</div>
                    <div style={{ fontSize:"11px", color:"#64748b", marginTop:"2px" }}>{item.bencinera}</div>
                  </div>
                  <div style={{ textAlign:"right" as const }}>
                    <div style={{ ...s.mono, fontSize:"20px", fontWeight:700, color:top?"#4ade80":"#e2e8f0" }}>
                      {ahorro ? `$${ahorro.toLocaleString("es-CL")}` : `${item.porcentaje}%`}
                    </div>
                    <div style={{ fontSize:"10px", color:"#475569" }}>{ahorro?"ahorro total":"cashback"}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop:"16px", background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.15)", borderRadius:"12px", padding:"12px 16px" }}>
            <div style={{ fontSize:"10px", color:"#4ade80", ...s.mono, marginBottom:"4px" }}>MEJOR OPCIÓN HOY</div>
            <div style={{ fontSize:"13px", color:"#f1f5f9" }}>
              Con <strong>{allDeals[0].tarjeta}</strong> ahorras{" "}
              <span style={{ color:"#4ade80", fontWeight:700 }}>
                {allDeals[0].porcentaje ? `${allDeals[0].porcentaje}% cashback` : `$${Math.round(L * allDeals[0].descuento).toLocaleString("es-CL")}`}
              </span>{" "}cargando {L}L
            </div>
          </div>
        </>
      )}
      {!L && <div style={{ textAlign:"center" as const, padding:"30px", color:"#334155", fontSize:"13px" }}>Ingresa los litros para ver cuánto ahorras con cada tarjeta hoy</div>}
    </div>
  );
}

function Precios() {
  const [estado, setEstado] = useState<"idle"|"ubicando"|"listo"|"error">("idle");
  const [url, setUrl] = useState("");
  const [ciudad, setCiudad] = useState("");

  async function obtenerUbicacion() {
    setEstado("ubicando");
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8000 })
      );
      const { latitude: lat, longitude: lon } = pos.coords;
      const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
      const geoData = await geo.json();
      const comuna = geoData.address?.city || geoData.address?.town || geoData.address?.village || "tu zona";
      setCiudad(comuna);
      setUrl(`https://www.bencinaenlinea.cl/?lat=${lat}&lng=${lon}`);
      setEstado("listo");
    } catch { setEstado("error"); }
  }

  return (
    <div>
      <div style={s.greenBox}>
        <div style={{ fontSize:"10px", color:"#4ade80", ...s.mono, marginBottom:"6px" }}>📍 PRECIOS EN TU ZONA</div>
        <div style={{ fontSize:"13px", color:"#94a3b8", marginBottom:"12px" }}>Te lleva directo a Bencina en Línea con las estaciones más cercanas.</div>
        <button onClick={obtenerUbicacion} disabled={estado==="ubicando"} style={{ width:"100%", padding:"10px", borderRadius:"10px", border:"none", background:"rgba(74,222,128,0.3)", color:"#4ade80", fontSize:"14px", fontWeight:700, cursor:"pointer", fontFamily:"Georgia,serif" }}>
          {estado === "ubicando" ? "📡 Obteniendo ubicación..." : "📍 Detectar mi ubicación"}
        </button>
      </div>
      {estado === "listo" && (
        <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:"14px", padding:"16px" }}>
          <div style={{ fontSize:"10px", color:"#4ade80", ...s.mono, marginBottom:"8px" }}>✅ UBICACIÓN DETECTADA</div>
          <div style={{ fontSize:"15px", fontWeight:600, color:"#f1f5f9", marginBottom:"4px" }}>{ciudad}</div>
          <div style={{ fontSize:"12px", color:"#64748b", marginBottom:"16px" }}>Toca para ver precios actuales en el mapa oficial CNE.</div>
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ display:"block", width:"100%", padding:"12px", borderRadius:"10px", background:"rgba(74,222,128,0.2)", border:"1px solid rgba(74,222,128,0.3)", color:"#4ade80", fontSize:"14px", fontWeight:700, textAlign:"center" as const, textDecoration:"none", boxSizing:"border-box" as const }}>
            🗺️ Ver precios en Bencina en Línea
          </a>
          <div style={{ fontSize:"10px", color:"#334155", marginTop:"10px", textAlign:"center" as const }}>Fuente oficial: bencinaenlinea.cl · CNE</div>
        </div>
      )}
      {estado === "error" && (
        <div style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:"12px", padding:"14px", color:"#fca5a5", fontSize:"13px" }}>
          ⚠️ No se pudo obtener la ubicación. Permite el acceso en tu navegador.
        </div>
      )}
    </div>
  );
}

export default function BencinaApp() {
  const today = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState(today);
  const [view, setView] = useState("hoy");

  const todayDeals = (DISCOUNTS[today] || []).slice().sort((a: any, b: any) => (b.descuento||0)-(a.descuento||0));
  const selectedDeals = (DISCOUNTS[selectedDay] || []).slice().sort((a: any, b: any) => (b.descuento||0)-(a.descuento||0));
  const best = todayDeals[0] || SIEMPRE[0];

  const tabs = [
    { id:"hoy",     label:"📍 Hoy" },
    { id:"semana",  label:"📅 Semana" },
    { id:"calc",    label:"🧮 Ahorro" },
    { id:"precios", label:"⛽ Precios" },
  ];

  return (
    <div style={s.wrap}>
      <div style={{ padding:"24px 20px 16px", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontSize:"11px", letterSpacing:"3px", color:"#475569", ...s.mono, marginBottom:"4px" }}>⛽ BENCINA 93 · PADRE HURTADO</div>
            <div style={{ fontSize:"26px", fontWeight:700, lineHeight:1, color:"#f8fafc" }}>Descuentos</div>
            <div style={{ fontSize:"26px", fontWeight:700, lineHeight:1, color:"#4ade80" }}>del Día</div>
          </div>
          <div style={{ background:"rgba(74,222,128,0.1)", border:"1px solid rgba(74,222,128,0.25)", borderRadius:"12px", padding:"8px 14px", textAlign:"center" as const }}>
            <div style={{ fontSize:"10px", color:"#4ade80", letterSpacing:"1px", ...s.mono }}>HOY</div>
            <div style={{ fontSize:"18px", fontWeight:700, color:"#f1f5f9", lineHeight:1.2 }}>{DAYS[today]}</div>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"4px", marginTop:"16px" }}>
          {tabs.map(t => <button key={t.id} onClick={() => setView(t.id)} style={s.btn(view===t.id)}>{t.label}</button>)}
        </div>
      </div>

      <div style={{ padding:"16px 20px 40px" }}>
        {view === "hoy" && (
          <>
            {best && (
              <div style={s.greenBox}>
                <div style={{ fontSize:"10px", letterSpacing:"2px", color:"#4ade80", marginBottom:"8px", ...s.mono }}>🏆 MEJOR DESCUENTO HOY</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:"16px", fontWeight:700 }}>{best.tarjeta}</div>
                    <div style={{ fontSize:"12px", color:"#64748b", marginTop:"2px" }}>{best.bencinera}</div>
                  </div>
                  <div style={{ ...s.mono, fontSize:"32px", fontWeight:700, color:"#4ade80", lineHeight:1 }}>
                    {best.porcentaje?`${best.porcentaje}%`:`-$${best.descuento}`}
                    <span style={{ fontSize:"14px", color:"#6ee7b7" }}>/L</span>
                  </div>
                </div>
              </div>
            )}
            <SiempreSection />
            {todayDeals.length === 0 && <div style={{ textAlign:"center" as const, padding:"20px", color:"#475569" }}>Sin descuentos exclusivos hoy.</div>}
            <div style={{ display:"flex", flexDirection:"column" as const, gap:"10px" }}>
              {todayDeals.map((item: any, i: number) => <DiscountCard key={i} item={item} rank={i} />)}
            </div>
          </>
        )}

        {view === "semana" && (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:"4px", marginBottom:"16px" }}>
              {DAYS.map((day, i) => {
                const count = (DISCOUNTS[i]||[]).length;
                const isTod = i===today, isSel = i===selectedDay;
                return (
                  <button key={i} onClick={() => setSelectedDay(i)} style={{ padding:"8px 4px", borderRadius:"10px", border:isTod?"1px solid rgba(74,222,128,0.4)":"1px solid rgba(255,255,255,0.07)", background:isSel?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.03)", color:isSel?"#f1f5f9":"#64748b", cursor:"pointer", textAlign:"center" as const }}>
                    <div style={{ fontSize:"9px", ...s.mono, marginBottom:"4px" }}>{day.slice(0,3).toUpperCase()}</div>
                    <div style={{ fontSize:"14px", fontWeight:700, color:count>0?(isSel?"#4ade80":"#94a3b8"):"#334155" }}>{count}</div>
                    {isTod && <div style={{ width:"4px", height:"4px", borderRadius:"50%", background:"#4ade80", margin:"2px auto 0" }} />}
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize:"13px", color:"#64748b", marginBottom:"12px", ...s.mono }}>
              {DAYS[selectedDay].toUpperCase()} · {selectedDeals.length} descuento{selectedDeals.length!==1?"s":""}
              {selectedDay===today && <span style={{ color:"#4ade80", marginLeft:"8px" }}>← hoy</span>}
            </div>
            <SiempreSection />
            <div style={{ display:"flex", flexDirection:"column" as const, gap:"10px" }}>
              {selectedDeals.map((item: any, i: number) => <DiscountCard key={i} item={item} rank={i} />)}
              {selectedDeals.length===0 && <div style={{ textAlign:"center" as const, padding:"20px", color:"#334155" }}>Sin descuentos exclusivos este día</div>}
            </div>
          </>
        )}

        {view === "calc" && <Calculadora today={today} />}
        {view === "precios" && <Precios />}

        <div style={{ marginTop:"24px", padding:"12px", borderTop:"1px solid rgba(255,255,255,0.05)", fontSize:"10px", color:"#334155", textAlign:"center" as const, lineHeight:1.6 }}>
          Descuentos válidos en estaciones Copec, Shell y Aramco adheridas.<br />
          Datos actualizados a mayo 2026 · Sujeto a cambios sin previo aviso.
        </div>
      </div>
    </div>
  );
}