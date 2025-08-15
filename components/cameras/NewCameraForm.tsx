"use client";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { z } from "zod";
const schema=z.object({ name:z.string().min(2), protocol:z.enum(["rtsp","webrtc","hls"]), url:z.string().url(), location:z.string().optional() });
export function NewCameraForm(){
  const add=useStore(s=>s.addCamera);
  const [form,setForm]=useState({name:"",protocol:"hls",url:"",location:""});
  const [err,setErr]=useState<string|null>(null);
  function submit(e:React.FormEvent){ e.preventDefault(); const p=schema.safeParse(form);
    if(!p.success){ setErr("Preencha corretamente (URL válida, nome mínimo 2 letras)."); return; }
    add({ id: crypto.randomUUID(), ...p.data }); setForm({name:"",protocol:"hls",url:"",location:""}); setErr(null); }
  return (<form onSubmit={submit} className="rounded-2xl border border-white/10 p-4 grid gap-3 md:grid-cols-4">
    <input className="rounded-lg bg-zinc-900/60 p-2 ring-1 ring-white/10 outline-none" placeholder="Nome" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
    <select className="rounded-lg bg-zinc-900/60 p-2 ring-1 ring-white/10 outline-none" value={form.protocol} onChange={e=>setForm(f=>({...f,protocol:e.target.value as any}))}>
      <option value="hls">HLS</option><option value="rtsp">RTSP (via gateway)</option><option value="webrtc">WebRTC</option>
    </select>
    <input className="rounded-lg bg-zinc-900/60 p-2 ring-1 ring-white/10 outline-none" placeholder="URL (ex: https://…/index.m3u8)" value={form.url} onChange={e=>setForm(f=>({...f,url:e.target.value}))}/>
    <div className="flex gap-2">
      <input className="flex-1 rounded-lg bg-zinc-900/60 p-2 ring-1 ring-white/10 outline-none" placeholder="Localização (opcional)" value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))}/>
      <button className="rounded-lg bg-white/10 px-4 text-sm font-medium hover:bg-white/20" type="submit">Adicionar</button>
    </div>
    {err && <p className="md:col-span-4 text-sm text-red-400">{err}</p>}
  </form>);
}
