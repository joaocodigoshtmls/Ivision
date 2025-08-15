"use client";
import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";
type Props = { src:string; kind?:"hls"|"webrtc"; autostart?:boolean };
export default function StreamPlayer({ src, kind="hls", autostart=true }:Props){
  const videoRef = useRef<HTMLVideoElement|null>(null);
  const [error,setError]=useState<string|null>(null);
  useEffect(()=>{
    const video=videoRef.current; if(!video) return;
    if(kind==="hls"){
      if(video.canPlayType("application/vnd.apple.mpegurl")){ video.src=src; }
      else if(Hls.isSupported()){ const hls=new Hls({lowLatencyMode:true}); hls.loadSource(src); hls.attachMedia(video);
        hls.on(Hls.Events.ERROR,(_e,d)=>setError(`${d.type}: ${d.details}`)); return ()=>hls.destroy(); }
      else setError("HLS não suportado neste navegador.");
    }
  },[src,kind]);
  useEffect(()=>{ if(autostart&&videoRef.current) videoRef.current.play().catch(()=>{}); },[autostart]);
  return (<div className="rounded-xl border border-white/10 p-3">
    <video ref={videoRef} className="h-64 w-full rounded-lg bg-black" controls playsInline muted/>
    {error && <p className="mt-2 text-sm text-red-400">Erro: {error}</p>}
  </div>);
}
