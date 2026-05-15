"use client";
import { useState, useEffect } from "react";

const DAYS = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const DAY_SHORT = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

const BRAND: Record<string,{color:string;emoji:string}> = {
  Copec:               { color:"#E8192C", emoji:"🔴" },
  Shell:               { color:"#DD1D21", emoji:"🐚" },
  Aramco:              { color:"#00703C", emoji:"🟢" },
  "Copec/Shell/Aramco":{ color:"#7C3AED", emoji:"⚡" },
};

const TYPE_STYLE: Record<string,{bg:string;text:string;icon:string}> = {
  Crédito:     { bg:"rgba(99,102,241,0.18)",  text:"#a5b4fc", icon:"💳" },
  Débito:      { bg:"rgba(14,165,233,0.18)",  text:"#7dd3fc", icon:"🏦" },
  Prepago:     { bg:"rgba(16,185,129,0.18)",  text:"#6ee7b7", icon:"📱" },
  Fidelización:{ bg:"rgba(245,158,11,0.18)",  text:"#fcd34d", icon:"⭐" },
  Club:        { bg:"rgba(236,72,153,0.18)",  text:"#f9a8d4", icon:"🎖️" },
  App:         { bg:"rgba(251,191,36,0.18)",  text:"#fde68a", icon:"📲" },
  Caja:        { bg:"rgba(168,85,247,0.18)",  text:"#d8b4fe", icon:"🏛️" },
};

const mono = "'Courier New',monospace";

/* ─── helpers ─────────────────────────────── */
function pctOf(precio:number, pct:number){ return Math.round(precio*(pct/100)); }
function fmtPeso(n:number){ return n.toLocaleString("es-CL"); }

/* ─── sub-components ─────────────────────── */
function Badge({tipo}:{tipo:string}){
  const s = TYPE_STYLE[tipo]||TYPE_STYLE.Crédito;
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:"3px",fontSize:"10px",fontWeight:700,
      letterSpacing:"0.05em",padding:"2px 8px",borderRadius:"20px",background:s.bg,color:s.text}}>
      {s.icon} {tipo}
    </span>
  );
}

function BrandPill({bencinera}:{bencinera:string}){
  const b = BRAND[bencinera]||{color:"#6366f1",emoji:"⛽"};
  return (
    <span style={{fontFamily:mono,fontSize:"11px",fontWeight:700,letterSpacing:"0.08em",color:b.color}}>
      {b.emoji} {bencinera.toUpperCase()}
    </span>
  );
}

function DiscountValue({item,size="lg",top=false}:{item:any;size?:"lg"|"md";top?:boolean}){
  const fs = size==="lg"?"26px":"20px";
  const color = top?"#4ade80":"#e2e8f0";
  return (
    <div style={{textAlign:"right",flexShrink:0}}>
      <div style={{fontFamily:mono,fontSize:fs,fontWeight:700,color,lineHeight:1}}>
        {item.porcentaje?`${item.porcentaje}%`:`-$${item.descuento}`}
      </div>
      <div style={{fontSize:"10px",color:"#475569",marginTop:"1px"}}>
        {item.porcentaje?"cashback":"por litro"}
      </div>
    </div>
  );
}

function Card({item,rank,precio93}:{item:any;rank:number;precio93:number}){
  const [open,setOpen]=useState(false);
  const top = rank===0;
  const bc = BRAND[item.bencinera]?.color||"#6366f1";
  const ahorro = item.descuento ? fmtPeso(item.descuento*40) : null;
  const precioFinal = item.descuento ? fmtPeso(precio93-item.descuento) : null;

  return (
    <div style={{background:top?"rgba(74,222,128,0.05)":"rgba(255,255,255,0.03)",
      border:`1px solid ${top?"rgba(74,222,128,0.25)":"rgba(255,255,255,0.07)"}`,
      borderLeft:`3px solid ${bc}`,borderRadius:"14px",overflow:"hidden",
      transition:"all 0.2s"}}>
      <button onClick={()=>setOpen(!open)}
        style={{width:"100%",background:"none",border:"none",padding:"14px 16px",
          cursor:"pointer",textAlign:"left",color:"inherit",display:"flex",
          justifyContent:"space-between",alignItems:"center",gap:"12px"}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"5px",flexWrap:"wrap"}}>
            <BrandPill bencinera={item.bencinera}/>
            <Badge tipo={item.tipo}/>
            {top&&<span style={{fontSize:"10px",color:"#fbbf24",fontFamily:mono}}>★ TOP</span>}
            {item.sinCosto&&<span style={{fontSize:"10px",color:"#4ade80",fontFamily:mono}}>💰 SIN COSTO</span>}
          </div>
          <div style={{fontSize:"15px",fontWeight:700,color:"#f1f5f9"}}>{item.tarjeta}</div>
          {precioFinal&&<div style={{fontSize:"11px",color:"#475569",marginTop:"2px",fontFamily:mono}}>
            precio final ~${precioFinal}/L
          </div>}
        </div>
        <DiscountValue item={item} top={top}/>
      </button>

      {open&&(
        <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",padding:"12px 16px",
          background:"rgba(0,0,0,0.2)"}}>
          <div style={{fontSize:"12px",color:"#94a3b8",lineHeight:1.6,marginBottom:"10px"}}>
            📋 {item.condicion}
          </div>
          {ahorro&&(
            <div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>
              <div style={{background:"rgba(74,222,128,0.08)",border:"1px solid rgba(74,222,128,0.15)",
                borderRadius:"10px",padding:"8px 14px",flex:1,textAlign:"center"}}>
                <div style={{fontSize:"10px",color:"#4ade80",fontFamily:mono,marginBottom:"3px"}}>AHORRO EN 40L</div>
                <div style={{fontSize:"18px",fontWeight:700,color:"#4ade80",fontFamily:mono}}>${ahorro}</div>
              </div>
              {precioFinal&&(
                <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
                  borderRadius:"10px",padding:"8px 14px",flex:1,textAlign:"center"}}>
                  <div style={{fontSize:"10px",color:"#64748b",fontFamily:mono,marginBottom:"3px"}}>PRECIO FINAL/L</div>
                  <div style={{fontSize:"18px",fontWeight:700,color:"#e2e8f0",fontFamily:mono}}>${precioFinal}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SiempreSection({siempre,precio93}:{siempre:any[];precio93:number}){
  const [open,setOpen]=useState(false);
  if(!siempre?.length) return null;
  return (
    <div style={{marginBottom:"16px"}}>
      <button onClick={()=>setOpen(!open)}
        style={{width:"100%",background:"rgba(251,191,36,0.06)",border:"1px solid rgba(251,191,36,0.18)",
          borderRadius:"12px",padding:"10px 16px",display:"flex",justifyContent:"space-between",
          alignItems:"center",cursor:"pointer",color:"#fde68a",fontSize:"13px",fontWeight:600,
          fontFamily:"Georgia,serif"}}>
        <span>⚡ Disponibles todos los días <span style={{opacity:.6}}>({siempre.length})</span></span>
        <span style={{fontSize:"11px"}}>{open?"▲":"▼"}</span>
      </button>
      {open&&(
        <div style={{display:"flex",flexDirection:"column",gap:"8px",marginTop:"8px"}}>
          {siempre.map((item,i)=><Card key={i} item={item} rank={99} precio93={precio93}/>)}
        </div>
      )}
    </div>
  );
}

/* ─── Tabs views ─────────────────────────── */
function ViewHoy({data,today}:{data:any;today:number}){
  const precio93 = data.precio93||1556;
  const todayDeals = [...(data.dias?.[today.toString()]||[])].sort((a:any,b:any)=>(b.descuento||0)-(a.descuento||0));
  const best = todayDeals[0]||data.siempre?.[0];
  return (
    <>
      {best&&(
        <div style={{background:"linear-gradient(135deg,rgba(74,222,128,0.1),rgba(16,185,129,0.05))",
          border:"1px solid rgba(74,222,128,0.25)",borderRadius:"18px",padding:"18px",marginBottom:"16px",
          position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-10,top:-10,fontSize:"60px",opacity:.06}}>🏆</div>
          <div style={{fontSize:"10px",letterSpacing:"2.5px",color:"#4ade80",marginBottom:"10px",fontFamily:mono}}>
            🏆 MEJOR DESCUENTO HOY
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:"12px"}}>
            <div>
              <div style={{fontSize:"18px",fontWeight:700,color:"#f1f5f9"}}>{best.tarjeta}</div>
              <div style={{fontSize:"12px",color:"#64748b",marginTop:"3px"}}>{best.bencinera}</div>
              {best.descuento&&<div style={{fontSize:"12px",color:"#4ade80",marginTop:"6px",fontFamily:mono}}>
                Precio final ~${fmtPeso(precio93-best.descuento)}/L
              </div>}
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontFamily:mono,fontSize:"36px",fontWeight:700,color:"#4ade80",lineHeight:1}}>
                {best.porcentaje?`${best.porcentaje}%`:`-$${best.descuento}`}
              </div>
              <div style={{fontSize:"11px",color:"#6ee7b7"}}>{best.porcentaje?"cashback":"por litro"}</div>
            </div>
          </div>
        </div>
      )}

      <SiempreSection siempre={data.siempre||[]} precio93={precio93}/>

      {todayDeals.length===0?(
        <div style={{textAlign:"center",padding:"30px",color:"#334155",fontSize:"13px"}}>
          Sin descuentos exclusivos hoy.<br/>
          <span style={{fontSize:"11px"}}>Usa los disponibles todos los días ↑</span>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          {todayDeals.map((item:any,i:number)=>(
            <Card key={i} item={item} rank={i} precio93={precio93}/>
          ))}
        </div>
      )}

      <div style={{marginTop:"16px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",
        borderRadius:"12px",padding:"12px 14px",fontSize:"11px",color:"#475569",lineHeight:1.7}}>
        💡 <strong style={{color:"#94a3b8"}}>Tip:</strong> Toca cualquier tarjeta para ver el ahorro estimado en 40L y el precio final por litro.
      </div>
    </>
  );
}

function ViewSemana({data,today}:{data:any;today:number}){
  const precio93 = data.precio93||1556;
  const [sel,setSel]=useState(today);
  const deals = [...(data.dias?.[sel.toString()]||[])].sort((a:any,b:any)=>(b.descuento||0)-(a.descuento||0));

  return (
    <>
      {/* Day selector */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"5px",marginBottom:"20px"}}>
        {DAY_SHORT.map((d,i)=>{
          const count=(data.dias?.[i.toString()]||[]).length;
          const isT=i===today, isS=i===sel;
          return (
            <button key={i} onClick={()=>setSel(i)}
              style={{padding:"10px 4px",borderRadius:"12px",cursor:"pointer",textAlign:"center",
                border:`1px solid ${isT?"rgba(74,222,128,0.5)":isS?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.06)"}`,
                background:isS?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.02)",
                color:isS?"#f1f5f9":"#64748b",transition:"all 0.15s"}}>
              <div style={{fontSize:"9px",fontFamily:mono,marginBottom:"4px"}}>{d.toUpperCase()}</div>
              <div style={{fontSize:"16px",fontWeight:700,
                color:count>0?(isS?"#4ade80":"#94a3b8"):"#1e293b"}}>{count}</div>
              {isT&&<div style={{width:"4px",height:"4px",borderRadius:"50%",background:"#4ade80",margin:"3px auto 0"}}/>}
            </button>
          );
        })}
      </div>

      <div style={{fontSize:"12px",color:"#475569",marginBottom:"14px",fontFamily:mono,display:"flex",alignItems:"center",gap:"8px"}}>
        <span style={{color:"#94a3b8",fontWeight:700}}>{DAYS[sel].toUpperCase()}</span>
        <span>·</span>
        <span>{deals.length} descuento{deals.length!==1?"s":""}</span>
        {sel===today&&<span style={{color:"#4ade80"}}>← hoy</span>}
      </div>

      <SiempreSection siempre={data.siempre||[]} precio93={precio93}/>

      <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
        {deals.map((item:any,i:number)=><Card key={i} item={item} rank={i} precio93={precio93}/>)}
        {deals.length===0&&<div style={{textAlign:"center",padding:"24px",color:"#1e293b",fontSize:"13px"}}>Sin descuentos exclusivos</div>}
      </div>
    </>
  );
}

function ViewSinCosto({data,today}:{data:any;today:number}){
  const precio93=data.precio93||1556;
  const allSinCosto: {dia:number|null;item:any}[]=[];
  (data.siempre||[]).filter((x:any)=>x.sinCosto).forEach((item:any)=>allSinCosto.push({dia:null,item}));
  for(let i=0;i<7;i++){
    (data.dias?.[i.toString()]||[]).filter((x:any)=>x.sinCosto).forEach((item:any)=>allSinCosto.push({dia:i,item}));
  }
  const byDia:{[k:string]:{dia:number|null;item:any}[]}={};
  allSinCosto.forEach(e=>{
    const k=e.dia===null?"siempre":String(e.dia);
    if(!byDia[k]) byDia[k]=[];
    byDia[k].push(e);
  });
  return (
    <>
      <div style={{background:"linear-gradient(135deg,rgba(74,222,128,0.08),rgba(16,185,129,0.04))",
        border:"1px solid rgba(74,222,128,0.2)",borderRadius:"16px",padding:"16px",marginBottom:"20px"}}>
        <div style={{fontSize:"10px",color:"#4ade80",fontFamily:mono,letterSpacing:"2px",marginBottom:"6px"}}>
          💰 DESCUENTOS SIN COSTO DE MANTENCIÓN
        </div>
        <div style={{fontSize:"13px",color:"#94a3b8",lineHeight:1.6}}>
          Todas estas opciones son gratis de obtener. Solo necesitas dinero en tu cuenta — sin tarjeta de crédito ni cuota anual.
        </div>
      </div>

      {["siempre",...Array.from({length:7},(_,i)=>String(i))].map(k=>{
        const entries=byDia[k];
        if(!entries?.length) return null;
        const label=k==="siempre"?"⚡ TODOS LOS DÍAS":DAYS[parseInt(k)].toUpperCase();
        const isToday=k===String(today);
        return (
          <div key={k} style={{marginBottom:"20px"}}>
            <div style={{fontSize:"11px",color:isToday?"#4ade80":"#64748b",fontFamily:mono,
              letterSpacing:"2px",marginBottom:"10px",display:"flex",gap:"8px",alignItems:"center"}}>
              {label}{isToday&&<span style={{color:"#4ade80"}}>← HOY</span>}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
              {entries.sort((a:any,b:any)=>(b.item.descuento||0)-(a.item.descuento||0))
                .map((e:any,i:number)=><Card key={i} item={e.item} rank={i} precio93={precio93}/>)}
            </div>
          </div>
        );
      })}

      <div style={{background:"rgba(74,222,128,0.06)",border:"1px solid rgba(74,222,128,0.12)",
        borderRadius:"12px",padding:"12px 14px",fontSize:"12px",color:"#64748b",lineHeight:1.7}}>
        🏆 <strong style={{color:"#4ade80"}}>El mejor sin costo:</strong> Tenpo los viernes ofrece hasta $300/L en Copec, Shell y Aramco — solo necesitas la app y saldo.
      </div>
    </>
  );
}

function ViewCalc({data,today}:{data:any;today:number}){
  const precio93=data.precio93||1556;
  const [litros,setLitros]=useState("");
  const [diaCalc,setDiaCalc]=useState(today);
  const L=parseFloat(litros)||0;
  const deals=[...(data.dias?.[diaCalc.toString()]||[]),...(data.siempre||[])]
    .sort((a:any,b:any)=>(b.descuento||0)-(a.descuento||0));

  return (
    <>
      <div style={{marginBottom:"16px"}}>
        <div style={{fontSize:"11px",color:"#64748b",fontFamily:mono,letterSpacing:"2px",marginBottom:"8px"}}>
          📐 CALCULADORA DE AHORRO
        </div>
        <div style={{display:"flex",gap:"8px",marginBottom:"12px",flexWrap:"wrap"}}>
          {DAY_SHORT.map((d,i)=>{
            const count=(data.dias?.[i.toString()]||[]).length;
            const isS=i===diaCalc, isT=i===today;
            return (
              <button key={i} onClick={()=>setDiaCalc(i)}
                style={{padding:"6px 10px",borderRadius:"8px",cursor:"pointer",fontSize:"11px",fontFamily:mono,
                  border:`1px solid ${isT?"rgba(74,222,128,0.4)":isS?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.07)"}`,
                  background:isS?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.02)",
                  color:isS?"#f1f5f9":"#475569"}}>
                {d} <span style={{color:count>0?"#4ade80":"#1e293b"}}>{count}</span>
              </button>
            );
          })}
        </div>
        <div style={{fontSize:"11px",color:"#64748b",fontFamily:mono,letterSpacing:"2px",marginBottom:"6px"}}>
          LITROS A CARGAR
        </div>
        <input type="number" placeholder="Ej: 40" value={litros}
          onChange={e=>setLitros(e.target.value)}
          style={{width:"100%",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",
            borderRadius:"12px",padding:"12px 16px",color:"#f1f5f9",fontSize:"18px",
            fontFamily:mono,outline:"none",boxSizing:"border-box"}}/>
      </div>

      {L>0&&deals.length>0&&(
        <>
          <div style={{fontSize:"11px",color:"#4ade80",fontFamily:mono,letterSpacing:"2px",marginBottom:"12px"}}>
            AHORRO CARGANDO {L}L — {DAYS[diaCalc].toUpperCase()}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
            {deals.map((item:any,i:number)=>{
              const ahorro=item.porcentaje?pctOf(precio93,item.porcentaje)*L:item.descuento*L;
              const precioFinal=precio93-(item.porcentaje?pctOf(precio93,item.porcentaje):item.descuento);
              const bc=BRAND[item.bencinera]?.color||"#6366f1";
              const top=i===0;
              return (
                <div key={i} style={{background:top?"rgba(74,222,128,0.05)":"rgba(255,255,255,0.03)",
                  border:`1px solid ${top?"rgba(74,222,128,0.2)":"rgba(255,255,255,0.07)"}`,
                  borderLeft:`3px solid ${bc}`,borderRadius:"14px",padding:"14px 16px",
                  display:"flex",justifyContent:"space-between",alignItems:"center",gap:"12px"}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:"14px",fontWeight:700,color:"#f1f5f9"}}>{item.tarjeta}</div>
                    <div style={{fontSize:"11px",color:"#475569",marginTop:"2px"}}>{item.bencinera} · ${fmtPeso(precioFinal)}/L</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:mono,fontSize:"22px",fontWeight:700,
                      color:top?"#4ade80":"#e2e8f0",lineHeight:1}}>${fmtPeso(Math.round(ahorro))}</div>
                    <div style={{fontSize:"10px",color:"#475569"}}>ahorro total</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{marginTop:"14px",background:"rgba(74,222,128,0.08)",border:"1px solid rgba(74,222,128,0.18)",
            borderRadius:"12px",padding:"14px 16px"}}>
            <div style={{fontSize:"10px",color:"#4ade80",fontFamily:mono,marginBottom:"5px",letterSpacing:"1px"}}>
              ✅ MEJOR OPCIÓN — {DAYS[diaCalc].toUpperCase()}
            </div>
            <div style={{fontSize:"14px",color:"#f1f5f9",lineHeight:1.5}}>
              Con <strong>{deals[0].tarjeta}</strong> en <strong>{deals[0].bencinera}</strong> ahorras{" "}
              <span style={{color:"#4ade80",fontWeight:700,fontFamily:mono}}>
                ${fmtPeso(Math.round(deals[0].porcentaje?pctOf(precio93,deals[0].porcentaje)*L:deals[0].descuento*L))}
              </span>{" "}cargando {L}L
            </div>
          </div>
        </>
      )}
      {!L&&(
        <div style={{textAlign:"center",padding:"30px",color:"#334155",fontSize:"13px"}}>
          Ingresa los litros para calcular tu ahorro
        </div>
      )}
    </>
  );
}

function ViewPrecios({precio93,precio97,precioDiesel}:{precio93:number;precio97:number;precioDiesel:number}){
  const [estado,setEstado]=useState<"idle"|"ubicando"|"listo"|"error">("idle");
  const [url,setUrl]=useState("");
  const [ciudad,setCiudad]=useState("");

  async function detectar(){
    setEstado("ubicando");
    try{
      const pos=await new Promise<GeolocationPosition>((res,rej)=>
        navigator.geolocation.getCurrentPosition(res,rej,{timeout:8000}));
      const{latitude:lat,longitude:lon}=pos.coords;
      const geo=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
      const gd=await geo.json();
      const comuna=gd.address?.city||gd.address?.town||gd.address?.village||"tu zona";
      setCiudad(comuna);
      setUrl(`https://www.bencinaenlinea.cl/?lat=${lat}&lng=${lon}`);
      setEstado("listo");
    }catch{setEstado("error");}
  }

  const combustibles=[
    {label:"Bencina 93",precio:precio93,color:"#E8192C",icon:"🔴"},
    {label:"Bencina 97",precio:precio97,color:"#DD1D21",icon:"🔵"},
    {label:"Diésel",   precio:precioDiesel,color:"#00703C",icon:"🟢"},
  ];

  return (
    <>
      <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"20px"}}>
        {combustibles.map(c=>(
          <div key={c.label} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",
            borderLeft:`3px solid ${c.color}`,borderRadius:"14px",padding:"14px 18px",
            display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:"14px",fontWeight:600,color:"#f1f5f9"}}>{c.icon} {c.label}</div>
            <div style={{fontFamily:mono,fontSize:"22px",fontWeight:700,color:"#e2e8f0"}}>
              ${fmtPeso(c.precio)}<span style={{fontSize:"12px",color:"#475569"}}>/L</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{fontSize:"10px",color:"#334155",fontFamily:mono,textAlign:"center",marginBottom:"20px"}}>
        Precios promedio nacionales CNE · Mayo 2026
      </div>

      <div style={{background:"linear-gradient(135deg,rgba(74,222,128,0.1),rgba(16,185,129,0.04))",
        border:"1px solid rgba(74,222,128,0.2)",borderRadius:"16px",padding:"16px",marginBottom:"12px"}}>
        <div style={{fontSize:"10px",color:"#4ade80",fontFamily:mono,letterSpacing:"2px",marginBottom:"8px"}}>
          📍 PRECIOS EN TU ZONA
        </div>
        <div style={{fontSize:"13px",color:"#94a3b8",marginBottom:"14px",lineHeight:1.6}}>
          Detecta tu ubicación y ve los precios exactos de las estaciones más cercanas a ti en el mapa oficial.
        </div>
        <button onClick={detectar} disabled={estado==="ubicando"}
          style={{width:"100%",padding:"12px",borderRadius:"10px",border:"none",
            background:estado==="ubicando"?"rgba(74,222,128,0.1)":"rgba(74,222,128,0.25)",
            color:"#4ade80",fontSize:"14px",fontWeight:700,cursor:"pointer",
            fontFamily:"Georgia,serif",transition:"all 0.2s"}}>
          {estado==="ubicando"?"📡 Obteniendo ubicación...":"📍 Detectar mi ubicación"}
        </button>
      </div>

      {estado==="listo"&&(
        <div style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",
          borderRadius:"14px",padding:"16px"}}>
          <div style={{fontSize:"10px",color:"#4ade80",fontFamily:mono,marginBottom:"8px",letterSpacing:"1px"}}>
            ✅ UBICACIÓN: {ciudad.toUpperCase()}
          </div>
          <a href={url} target="_blank" rel="noopener noreferrer"
            style={{display:"block",width:"100%",padding:"12px",borderRadius:"10px",
              background:"rgba(74,222,128,0.15)",border:"1px solid rgba(74,222,128,0.3)",
              color:"#4ade80",fontSize:"14px",fontWeight:700,textAlign:"center",
              textDecoration:"none",boxSizing:"border-box"}}>
            🗺️ Ver estaciones en Bencina en Línea
          </a>
          <div style={{fontSize:"10px",color:"#334155",marginTop:"10px",textAlign:"center",fontFamily:mono}}>
            Fuente: bencinaenlinea.cl · CNE
          </div>
        </div>
      )}
      {estado==="error"&&(
        <div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",
          borderRadius:"12px",padding:"14px",color:"#fca5a5",fontSize:"13px"}}>
          ⚠️ No se pudo obtener la ubicación. Permite el acceso en tu navegador e intenta de nuevo.
        </div>
      )}
    </>
  );
}

/* ─── Main ───────────────────────────────── */
export default function BencinaApp(){
  const today=new Date().getDay();
  const [view,setView]=useState("hoy");
  const [data,setData]=useState<any>(null);

  useEffect(()=>{
    fetch("/descuentos.json").then(r=>r.json()).then(setData).catch(()=>setData(null));
  },[]);

  if(!data) return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",display:"flex",alignItems:"center",
      justifyContent:"center",fontFamily:"Georgia,serif"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:"32px",marginBottom:"12px"}}>⛽</div>
        <div style={{color:"#4ade80",fontSize:"14px"}}>Cargando descuentos...</div>
      </div>
    </div>
  );

  const tabs=[
    {id:"hoy",    label:"📍 Hoy"},
    {id:"semana", label:"📅 Semana"},
    {id:"sincosto",label:"💰 Gratis"},
    {id:"calc",   label:"🧮 Ahorro"},
    {id:"precios",label:"⛽ Precio"},
  ];

  const todayCount=(data.dias?.[today.toString()]||[]).length;

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",color:"#e2e8f0",
      fontFamily:"Georgia,serif",maxWidth:"480px",margin:"0 auto"}}>

      {/* ── Header ── */}
      <div style={{padding:"22px 20px 0",borderBottom:"1px solid rgba(255,255,255,0.06)",paddingBottom:"0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"16px"}}>
          <div>
            <div style={{fontSize:"10px",letterSpacing:"3px",color:"#334155",fontFamily:mono,marginBottom:"2px"}}>
              ⛽ DESCUENTOS EN BENCINA
            </div>
            <div style={{fontSize:"13px",color:"#475569",fontFamily:mono,marginBottom:"4px"}}>{data.mes}</div>
            <div style={{fontSize:"28px",fontWeight:700,lineHeight:1.1,color:"#f8fafc"}}>Descuentos</div>
            <div style={{fontSize:"28px",fontWeight:700,lineHeight:1,
              background:"linear-gradient(90deg,#4ade80,#22d3ee)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>del Día</div>
          </div>
          <div style={{background:"rgba(74,222,128,0.08)",border:"1px solid rgba(74,222,128,0.2)",
            borderRadius:"16px",padding:"12px 16px",textAlign:"center",minWidth:"80px"}}>
            <div style={{fontSize:"10px",color:"#4ade80",letterSpacing:"1px",fontFamily:mono}}>HOY</div>
            <div style={{fontSize:"20px",fontWeight:700,color:"#f1f5f9",lineHeight:1.2}}>{DAYS[today]}</div>
            <div style={{fontSize:"11px",color:"#4ade80",fontFamily:mono,marginTop:"2px"}}>{todayCount} descuento{todayCount!==1?"s":""}</div>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"2px",
          padding:"0 0 0",position:"relative"}}>
          {tabs.map(t=>{
            const active=view===t.id;
            return (
              <button key={t.id} onClick={()=>setView(t.id)}
                style={{padding:"10px 4px",border:"none",background:"transparent",
                  color:active?"#f1f5f9":"#475569",fontSize:"11px",fontWeight:active?700:500,
                  cursor:"pointer",fontFamily:"Georgia,serif",position:"relative",
                  borderBottom:`2px solid ${active?"#4ade80":"transparent"}`,
                  transition:"all 0.15s"}}>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{padding:"20px 16px 50px"}}>
        {view==="hoy"    &&<ViewHoy     data={data} today={today}/>}
        {view==="semana" &&<ViewSemana  data={data} today={today}/>}
        {view==="sincosto"&&<ViewSinCosto data={data} today={today}/>}
        {view==="calc"   &&<ViewCalc    data={data} today={today}/>}
        {view==="precios"&&<ViewPrecios
          precio93={data.precio93||1556}
          precio97={data.precio97||1665}
          precioDiesel={data.precioDiesel||1544}/>}

        {/* Footer */}
        <div style={{marginTop:"28px",padding:"14px",borderTop:"1px solid rgba(255,255,255,0.05)",
          fontSize:"10px",color:"#1e293b",textAlign:"center",lineHeight:1.8,fontFamily:mono}}>
          Descuentos en estaciones Copec, Shell y Aramco adheridas.<br/>
          Padre Hurtado · {data.mes} · Sujeto a cambios sin previo aviso.
        </div>
      </div>
    </div>
  );
}
