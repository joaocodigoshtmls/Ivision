"use client";

import { useEffect, useRef, useState } from "react";
import Hls, { Events, ErrorData } from "hls.js";

type Props = {
  src: string;
  /** Força comportamento de transmissão ao vivo (bloqueia scrub). */
  forceLive?: boolean;
  /** Desabilita scrub quando forceLive estiver ativo. */
  disableScrubbing?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
  poster?: string;
  className?: string;
};

export default function HlsPlayer({
  src,
  forceLive = false,
  disableScrubbing = true,
  autoPlay = true,
  muted = true,
  controls = true,
  poster,
  className = "",
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [status, setStatus] = useState<"idle" | "loading" | "playing" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Live state (detectado)
  const [isLive, setIsLive] = useState(false);
  const [isBehind, setIsBehind] = useState(false);
  const [latency, setLatency] = useState<number>(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    setStatus("loading");
    setErrorMsg("");
    setIsLive(false);
    setIsBehind(false);
    setLatency(0);

    const getLiveEdge = (v: HTMLVideoElement) => {
      if (v.seekable && v.seekable.length) {
        return v.seekable.end(v.seekable.length - 1);
      }
      const d = v.duration;
      return Number.isFinite(d) ? d : 0;
    };

    const getWindowStart = (v: HTMLVideoElement) =>
      v.seekable && v.seekable.length ? v.seekable.start(0) : 0;

    const goLiveEdge = () => {
      const v = videoRef.current;
      if (!v) return;
      const edge = getLiveEdge(v);
      v.currentTime = edge;
      v.play().catch(() => {});
    };

    // impede scrub quando forceLive
    const onSeeking = () => {
      if (forceLive && disableScrubbing) goLiveEdge();
    };

    // monitor da latência / atraso
    let liveTimer: number | undefined;
    const TOLERANCE = 5;   // s: marca “atrasado”
    const AUTONUDGE = 8;   // s: cola automaticamente no live edge

    const startLiveMonitor = () => {
      if (liveTimer) return;
      liveTimer = window.setInterval(() => {
        const v = videoRef.current;
        if (!v) return;

        const edge = getLiveEdge(v);
        const start = getWindowStart(v);
        const windowSize = Math.max(0, edge - start);

        // DETECÇÃO de live:
        // 1) se HLS sinalizou live (via LEVEL_LOADED) -> usamos esse valor (isLive já setado)
        // 2) fallback: duration Infinito OU janela >= 60s
        const inferredLive = !Number.isFinite(v.duration) || windowSize >= 60;
        setIsLive(prev => prev || inferredLive);

        if (prevOr(inferredLive)) {
          const lag = Math.max(0, edge - v.currentTime);
          setLatency(lag);
          const behind = lag > TOLERANCE;
          setIsBehind(behind);
          if (lag > AUTONUDGE) {
            goLiveEdge();
            setIsBehind(false);
          }
        }
      }, 1000);
    };
    const prevOr = (b: boolean) => b; // helper só pra clareza acima
    const stopLiveMonitor = () => {
      if (liveTimer) {
        window.clearInterval(liveTimer);
        liveTimer = undefined;
      }
    };

    // Suporte nativo (Safari/iOS)
    const canNativeHls =
      video.canPlayType("application/vnd.apple.mpegurl") !== "" ||
      video.canPlayType("application/x-mpegURL") !== "";

    video.addEventListener("seeking", onSeeking);

    if (canNativeHls && !Hls.isSupported()) {
      const onLoadedMeta = () => {
        setStatus("playing");
        goLiveEdge();
        startLiveMonitor();
      };
      const onError = () => {
        setStatus("error");
        setErrorMsg("Falha ao carregar o vídeo (verifique URL e CORS).");
      };

      video.src = src;
      video.addEventListener("loadedmetadata", onLoadedMeta);
      video.addEventListener("error", onError);
      if (autoPlay) video.play().catch(() => {});

      return () => {
        stopLiveMonitor();
        video.removeEventListener("loadedmetadata", onLoadedMeta);
        video.removeEventListener("error", onError);
        video.removeEventListener("seeking", onSeeking);
        video.removeAttribute("src");
        video.load();
      };
    }

    // hls.js (Chrome/Edge/Firefox etc.)
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        liveDurationInfinity: true,
        liveSyncDuration: 3,
        liveMaxLatencyDuration: 10,
        maxLiveSyncPlaybackRate: 1.1,
        backBufferLength: 90,
      });
      hlsRef.current = hls;

      // aqui vem o sinal "oficial" de live
      hls.on(Events.LEVEL_LOADED, (_e, data: any) => {
        const liveByManifest = !!data?.details?.live;
        if (liveByManifest) setIsLive(true);
        if (liveByManifest) {
          try {
            hls.startLoad(-1);
          } catch {}
        }
      });

      hls.on(Events.MANIFEST_PARSED, () => {
        setStatus("playing");
        if (autoPlay) video.play().catch(() => {});
        const onLM = () => {
          video.removeEventListener("loadedmetadata", onLM);
          goLiveEdge();
          startLiveMonitor();
        };
        video.addEventListener("loadedmetadata", onLM);
      });

      // erros (inclui 404)
      hls.on(Events.ERROR, (_event: string, data: ErrorData) => {
        if (
          data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR ||
          data.details === Hls.ErrorDetails.LEVEL_LOAD_ERROR
        ) {
          const code = (data as any).response?.code;
          if (code === 404) {
            setStatus("error");
            setErrorMsg("Playlist .m3u8 não encontrada (404 Not Found).");
            return;
          }
        }
        if (data.details === Hls.ErrorDetails.FRAG_LOAD_ERROR) {
          const code = (data as any).response?.code;
          if (code === 404) {
            setStatus("error");
            setErrorMsg("Segmento do stream não encontrado (404 Not Found).");
            return;
          }
        }
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad(-1);
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              setStatus("error");
              setErrorMsg("Erro fatal no player HLS.");
              hls.destroy();
          }
        }
      });

      hls.attachMedia(video);
      hls.loadSource(src);
      if (autoPlay) video.play().catch(() => {});

      return () => {
        stopLiveMonitor();
        video.removeEventListener("seeking", onSeeking);
        hls.destroy();
        hlsRef.current = null;
      };
    }

    // fallback final
    video.src = src;
    if (autoPlay) video.play().catch(() => {});
    startLiveMonitor();

    return () => {
      stopLiveMonitor();
      video.removeEventListener("seeking", onSeeking);
      video.removeAttribute("src");
      video.load();
    };
  }, [src, autoPlay, forceLive, disableScrubbing]);

  const jumpToLive = () => {
    try {
      hlsRef.current?.startLoad?.(-1);
      const v = videoRef.current;
      if (v) {
        const edge =
          v.seekable && v.seekable.length
            ? v.seekable.end(v.seekable.length - 1)
            : v.duration;
        v.currentTime = edge;
        v.play().catch(() => {});
      }
      setIsBehind(false);
    } catch {}
  };

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        poster={poster}
        controls={controls}
        muted={muted}
        playsInline
        className="w-full h-auto rounded-lg bg-black"
      />

      {/* Badge AO VIVO – aparece SOMENTE quando o stream é detectado como live */}
      {isLive && (
        <button
          onClick={isBehind ? jumpToLive : undefined}
          className={`absolute top-2 left-2 flex items-center gap-2 px-2 py-1 rounded text-xs font-semibold ${
            isBehind ? "bg-red-600" : "bg-emerald-600"
          }`}
          title={isBehind ? "Você está atrasado — clicar cola no ao vivo" : "Ao vivo"}
          style={{ pointerEvents: isBehind ? "auto" : "none" }} // clicável só quando atrasado
        >
          <span
            className={`block w-2 h-2 rounded-full ${
              isBehind ? "bg-white" : "bg-white"
            }`}
          />
          AO VIVO
        </button>
      )}

      {/* Overlay status/erro */}
      {status !== "playing" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm">
          {status === "loading" && "Carregando stream…"}
          {status === "error" && (
            <div className="p-3 text-center">
              <div className="font-semibold mb-1">Não foi possível reproduzir</div>
              <div className="opacity-80">{errorMsg || "Erro ao iniciar o stream."}</div>
              <div className="mt-2 text-xs opacity-70">
                Verifique a URL .m3u8, CORS e disponibilidade do servidor.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
