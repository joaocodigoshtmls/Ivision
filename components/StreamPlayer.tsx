"use client";
import Hls from "hls.js";
import { useEffect, useRef } from "react";

type Props = {
  src: string;
  kind?: "hls" | "webrtc";
  autostart?: boolean;
  lowLatency?: boolean;
  className?: string; // <-- agora aceita className
};

export default function StreamPlayer({
  src,
  kind = "hls",
  autostart = true,
  lowLatency = false,
  className,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const lastSrcRef = useRef<string>("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // por enquanto suportamos HLS; WebRTC entra depois
    if (kind !== "hls") return;

    // evita recriar se a src não mudou
    if (lastSrcRef.current === src && (video as any)._attached) return;

    // cleanup anterior
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    (video as any)._attached = false;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      (video as any)._attached = true;
      if (autostart) video.play().catch(() => {});
    } else if (Hls.isSupported()) {
      const hls = new Hls({ lowLatencyMode: lowLatency });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);
      (video as any)._attached = true;
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        if (autostart) video.play().catch(() => {});
      });
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          try { hls.startLoad(); } catch {}
        }
      });
    } else {
      console.warn("HLS não suportado neste navegador.");
    }

    lastSrcRef.current = src;

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (video) {
        video.removeAttribute("src");
        video.load();
        (video as any)._attached = false;
      }
    };
  }, [src, kind, autostart, lowLatency]);

  return (
    <video
      ref={videoRef}
      className={className ?? "h-64 w-full rounded-lg bg-black"}
      controls
      playsInline
      muted
    />
  );
}
