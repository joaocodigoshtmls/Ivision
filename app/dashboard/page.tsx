"use client";
import { useEffect, useState } from "react";
import { Activity, Cpu, Camera } from "lucide-react";
export default function DashboardPage(){
  const [loading,setLoading]=useState(true);
  useEffect(()=>{const t=setTimeout(()=>setLoading(false),400);return()=>clearTimeout(t)},[]);
  const k=[{label:"Câmeras ativas",value:8,icon:<Camera/>},{label:"Reconhecimentos hoje",value:156,icon:<Activity/>},{label:"Uso de CPU",value:"46%",icon:<Cpu/>}];
  return (<main className="space-y-6"><h1 className="text-2xl font-semibold">Dashboard</h1>
    <section className="grid gap-4 md:grid-cols-3">{k.map(x=>(
      <div key={x.label} className="rounded-2xl border border-white/10 p-5">
        <div className="flex items-center gap-2 text-zinc-400">{x.icon}<span>{x.label}</span></div>
        <div className="mt-2 text-2xl font-semibold">{loading?"…":x.value}</div></div>))}
    </section></main>);
}
