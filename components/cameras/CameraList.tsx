"use client";
import { useStore } from "@/lib/store";
import StreamPlayer from "@/components/StreamPlayer";
export function CameraList(){
  const cameras=useStore(s=>s.cameras);
  if(cameras.length===0) return <p className="text-zinc-400">Nenhuma câmera cadastrada ainda.</p>;
  return (<div className="grid gap-6 md:grid-cols-2">
    {cameras.map(c=>(<div key={c.id} className="space-y-2">
      <div className="flex items-center justify-between"><h3 className="font-medium">{c.name}</h3>
      <span className="text-xs text-zinc-400">{c.protocol.toUpperCase()}</span></div>
      <StreamPlayer src={c.url} kind={c.protocol==="hls"?"hls":"hls"} /></div>))}
  </div>);
}
